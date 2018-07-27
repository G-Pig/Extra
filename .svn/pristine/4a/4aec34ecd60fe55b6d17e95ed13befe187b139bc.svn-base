/**
 * 站场窗体
 * Created by Administrator on 2017/8/2.
 */

ES.CloudMap.LineWnd = ES.CloudMap.BaseWnd.extend({

    oOption: {
        cContainerSel: '#MapView',
        cFlag: 'Grid',
        oText: {},
        oOffset: {nW: 0, nH: 0},

    },

    initialize: function (oParent, oOption,oTreeOption) {
        this._oParent = oParent;
        this.oTreeOption = oTreeOption;
        ES.setOptions(this, oOption);

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
        this.$_oContainer.find('a[type="button"]').bind('click', function () {
            self.$_oContainer.hide();
            self._oParent.clearLayers();
        });

        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                    cBandSel: $('#DeptName')
                }, this.oTreeOption);
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);
    },

    setVal: function (oData) {

        $('#DeptName').val(oData.text);
        this.cParentId = oData.id;
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
            ES.aWarn('请录入名称！');
            return false;
        }

        if (!this.oBusData.oSite.Id || !this.oBusData.oUnload.Id) {
            ES.aWarn('线路数据异常，不能新增！');
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
            Id: this.oBusData.Id,
            Name: $('#GridName').val(),
            AreaId:this.cParentId,
            Map: this.oBusData.oInfo,
            CloudMapId:this.oBusData.oLine.CloudMapId,
            SId:this.oBusData.oSite.Id,
            UId:this.oBusData.oUnload.Id,
        };

        ES.getData(oParam, '/Line/Edit', this.saveHandler, this, {nId: oParam.Id,Map:oParam.Map,Name:oParam.Name});
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

            this._oParent.fire('CloudMap:LineLayer.reflesh', {Id:oTemp.nId,Json:JSON.stringify(oTemp.Map),Name:oTemp.Name} );

            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Message}' : '修改数据失败,原因:{Message}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },

    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShow', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPos', this.setPos, this);
    },

    // 设置窗体屏幕位置
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

        $('#GridName').val(oData.oLine.Name);
        $('#DeptName').val(oData.oLine.ParentText);

        this.oBusData = oData;
        this.oBusData.Id = oData.oLine.Id;
        this.cParentId = oData.oLine.ParentId;
        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });

        $('#GridName').val(oData.oSite.Name + '--' + oData.oUnload.Name);
        $('#DeptName').val('');

        this.oBusData = oData;
        this.oBusData.Id = oData.cId;
        this.$_oContainer.show();
    },
});

// 树的选择初始化
ES.CloudMap.LineWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  GridWnd"  style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">线路名称：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="GridName" name="form-sitename" placeholder="请输入线路名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+

    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label"> 区域：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="DeptName" name="form-sitename"  placeholder="请输入区域" class="ec-form-field ec-radius ec-input-sm">'+
    '    </div>'+
    '    </li>'+


    '    <li class="ec-form-group">'+
    '       <div class="ec-u-sm-12 ex-final-button">'+
    '           <button type="button" class="ec-btn ec-btn-sm ec-btn-primary"><i class="ec-icon-save"></i> 保存 </button>'+
    '           <a href="#" type="button" class="ec-btn ec-btn-sm ec-btn-warning" style="color:#fff;">' +
    '               <i class="ec-icon-link"></i> 关闭 ' +
    '           </a>'+
    '       </div>'+
    '   </li>'+
    '</ul>'+
    '</div>',


});
