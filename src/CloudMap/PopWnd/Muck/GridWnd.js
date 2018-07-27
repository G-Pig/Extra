/**
 *
 * 站点 弹出层
 *(1=网格 2=线 3=围栏 4=兴趣点 5=卡口)
 *
 * 图形类型(1=多边形 2=圆 3=矩形 4=线,5=点)
 * Created by liulin on 2017/3/17.
 */


ES.CloudMap.GridWnd = ES.CloudMap.BaseWnd.extend({

    oOption: {
        cContainerSel: '#MapView',
        cFlag: 'Grid',
        oText: {},
        oOffset: {nW: 0, nH: -15}
    },

    initialize: function (oParent, oOption,oTreeOption) {
        this._oParent = oParent;
        this.oTreeOption = oTreeOption;
        //ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);
        ES.setOptions(this, oOption);
        //this.hideDefaultButton();
        this.cFlag = 'PostPos';
        // 窗体在地图上弹出的位置信息
        this.oPopLatLng = null;

        this.initUI();
        this.initOn();

        this.setParentEvent();

    },

    initUI: function () {
        this.$_oContainer = $(this.cContent);
        $(this.oOption.cContainerSel).append(this.$_oContainer);
        this.$_oContainer.hide();
        this.afterOpen();
    },

    afterOpen: function () {
        var self = this;
        this.$_oContainer.find('.ec-icon-save').parent().bind('click', function () {
            self.save();
        });

        //type="button"
        this.$_oContainer.find('.ec-icon-close').parent().bind('click', function () {
            self.$_oContainer.hide();
            self._oParent.clearLayers();
            self._oParent.fire('CloudMap:BaseTool.removeActive');
        });
        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                    cBandSel: $('#DeptId')
                },this.oTreeOption

            );
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);
    },

    setVal: function (oData) {
        $('#DeptId').val(oData.text);

        this.cParentId = parseInt(oData.id);
        this.cParentVal = oData.text;
    },

    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener( this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    check: function () {

        if (!$('#GridName').val()) {
            ES.aWarn('请录入站点名称！');
            return false;
        }

        return true;
    },

    save: function () {
        if (!this.check()) {
            return;
        }

        ES.loadAn(this.$_oContainer);


        var oParam = {
            Id:this.oBusData.Id,
            DeptId: (this.cParentId || '0'),
            deptName:this.cParentVal,
            CloudName: $('#GridName').val(),
            CloudType: 2,//(1=网格 2=线 3=围栏 4=兴趣点 5=卡口)
            MapType: 4,//图形类型(1=多边形 2=圆 3=矩形 4=线,5=点)
            Map: this.oBusData.oInfo
        };

        ES.getData(oParam, '/CloudMap/Edit', this.saveHandler, this, {nId: oParam.Id});
    },

    saveHandler: function (oTemp) {
        ES.removeAn(this.$_oContainer);
        var oData = oTemp.oData;
        var bAdd = false;
        if (!oTemp.nId) {
            bAdd = true;
        }

        if (oData && oData.IsSuccess) {
            ES.aSucess(bAdd ? ES.Common.Lang[10] : ES.Common.Lang[20]);
            // 刷新grid列表
            this._oParent.fire('CloudMap:EditTool.clearLayer');
            // 刷新listview
            this._oParent.fire('PostPosTreeView.reflesh');
            //取消按钮active
            this._oParent.fire('CloudMap:BaseTool.removeActive');
            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Msg}' : '修改数据失败,原因:{Msg}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },
    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShow', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPos', this.setPos, this);
    },

    setPos:function(oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        if(!oData) {return;}
        var oPos = oData.oPos
        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});
    },


    editShow: function (oData) {
        if (!oData || !oData.oInfo) {
            return;
        }
        var oPos = oData.oPos;

        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });

        $('#GridName').val(oData.oBusData.cName);
        $('#DeptId').val(oData.oBusData.cParentText);

        this.oBusData = {};
        this.oBusData.Id = parseInt(oData.oBusData.cId);
        this.oBusData.oInfo = oData.oInfo;
        this.cParentId = oData.oBusData.cParentId;

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#GridName').val('');
        $('#DeptId').val('');

        this.oBusData = oData;
        this.oBusData.Id = 0;
        this.$_oContainer.show();

    },

});

// 树的选择初始化
ES.CloudMap.GridWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  GridWnd"  style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">线路名称：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="GridName" name="form-sitename" placeholder="请输入道路名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+

    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label"> 所属部门：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="DeptId" name="form-sitename"  placeholder="请输入所属部门" class="ec-form-field ec-radius ec-input-sm">'+
    '    </div>'+
    '    </li>'+
    '    <li class="ec-form-group">'+
    '       <div class="ec-u-sm-12 ex-final-button">'+
    '           <button type="button" class="ec-btn ec-btn-sm ec-btn-primary"><i class="ec-icon-save"></i> 保存 </button>'+
    '           <a href="#" type="button" class="ec-btn ec-btn-sm ec-btn-warning" style="color:#fff;">' +
    '               <i class="ec-icon-close"></i> 关闭 ' +
    '           </a>'+
    '       </div>'+
    '   </li>'+
    '</ul>'+
    '</div>',


});




//删除操作
ES.CloudMap.DelCloudMap = ES.Common.DialogDel.extend({
    initOn: function () {
        this._oParent.on('CloudMap:DelCloudMap.del', this.del, this);
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Lang[32]);

            this._oParent.fire('PostPosTreeView.reflesh');
        }
        else {
            ES.aErr(ES.template(ES.Common.Lang[33], oData));
        }

        this.oDialog.close();
    },

});

