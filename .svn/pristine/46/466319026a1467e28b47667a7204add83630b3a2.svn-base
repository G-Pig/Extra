/**
 * Created by YangHang on 2018/2/2.
 */


ES.Common.ExitManage = L.MapLib.MapControl.ESMapEdit.extend({
    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left','ex-maptool-edit'],
        cBtnContain: '.ex-map-tool-edit',
        className: '',
        title: '图层编辑',
        oPenStyle: {
            stroke: true,
            color: '#5e7aea',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 3,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false

        },
        cNameHtml:'<div class="ex-maptool-box ex-maptool-box-name ex-map-tool-edit">'+
        '               <input type="text" id="ExitName">'+
        '               <a href="javascript:void(0)"> 确 定 </a>'+
        '           </div>',
    },

    initUI: function () {

        L.initTag(this._oContainer, this.oUIConfig);

        this._oNameContainer.append($(this.oOption.cNameHtml));

        this.initEven();
        var cBtnContain = this.oOption.cBtnContain;

        this.$_btnPlus = $(cBtnContain).find('.ec-icon-plus').parent();
        this.$_btnEdit = $(cBtnContain).find('.ec-icon-pencil').parent();
        this.$_btnCal = $(cBtnContain).find('.ec-icon-ban').parent();
        this.$_btnSave = $(cBtnContain).find('.ec-icon-save').parent();
        this.$_btnDel = $(cBtnContain).find('.ec-icon-power-off').parent();
        this.$_nameInput = this._oNameContainer.find('input');

        this.$_btnPlus.show();
        this.$_btnEdit.hide();
        this.$_btnCal.hide();
        this.$_btnSave.hide();
        this.$_btnDel.hide();
        this.dealEditUI();


    },
    //初始化工具栏事件
    initEven: function () {
        var self = this;

        // 对象
        $(this.oOption.cBtnContain).find('.ec-icon-plus').parent().bind('click', function () {
            self.$_btnPlus.hide();
            self.$_btnSave.hide();
            self.$_btnEdit.hide();
            self.$_btnCal.show();
            self.$_btnDel.hide();
            self.dealEditUI();

            self._oNameContainer.css('left','1rem');

        });

        // 确定修改
        $(this.oOption.cBtnContain).find('.ec-icon-save').parent().bind('click', function () {
            // 触发结束编辑
            self.oEditPen.handler.save();
            self.oEditPen.handler.disable();
            // 清除图层
            //self._oDrawLayer.clearLayers();

            // 点击确定 隐藏自身、取消、编辑
            self.$_btnPlus.hide();
            self.$_btnEdit.hide();
            self.$_btnCal.hide();
            $(this).hide();
            self.dealEditUI();

        });

        // 编辑
        $(this.oOption.cBtnContain).find('.ec-icon-pencil').parent().bind('click', function () {

            // 点击编辑隐藏自身，和添加功能，显示确定和取消
            $(self.oOption.cBtnContain).find('.ec-icon-plus').parent().hide();

            self.$_btnSave.show();
            $(self.oOption.cBtnContain).find('.ec-icon-ban').parent().show();
            $(this).hide();
            self.$_btnDel.hide();
            self.dealEditUI();
            self.oEditPen.handler.enable();
        });

        $(this.oOption.cBtnContain).find('.ec-icon-ban').parent().bind('click', function () {

            $(this).hide();

            if (self.cFlag === 'add') {
                // 全部隐藏
                self.$_btnPlus.show();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                self.$_btnDel.hide();
                //self.clearLayers();
            }

            if (self.cFlag === 'edit') {
                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.show();
                self.$_btnCal.hide();
                self.$_btnDel.hide();
            }

            self._oNameContainer.removeAttr('style').find('input').val('').removeAttr('disabled').siblings().show();

            self.oDrawPen.handler.disable();
            // 撤销修改
            self.oEditPen.handler.revertLayers();
            self.oEditPen.handler.disable();

            self.dealEditUI();
        });
        // 删除
        $(this.oOption.cBtnContain).find('.ec-icon-power-off').parent().bind('click', function () {

            $(this).hide();

            if (self.cFlag === 'add') {
                // 全部隐藏
                self.$_btnPlus.hide();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                self.$_btnDel.hide();
            }

            if (self.cFlag === 'edit') {
                self.$_btnPlus.show();
                self.$_btnSave.hide();
                self.$_btnEdit.hide();
                self.$_btnCal.hide();
                self.$_btnDel.hide();
            }


            self.deleteFence();
            //self.oDrawPen.handler.disable();
            // 撤销修改
            //self.oEditPen.handler.revertLayers();
            //self.oEditPen.handler.disable();

            self.dealEditUI();
        });

        this._oNameContainer.find('a').bind('click',function(){
            if(self.$_nameInput.val()==''){
                ES.aErr('请输入路口名称！');
            }else{
                $(this).hide().siblings().attr('disabled','disabled');
                self.oDrawPen.handler.enable();
            }

        });
    },

    // 添加数据
    addFence: function () {
        this.$_btnPlus.show();
        this.$_btnSave.hide();
        this.$_btnEdit.hide();
        this.$_btnCal.hide();
        this.dealEditUI();
    },

    initCallBack: function () {
        var self = this;

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oDrawLayer.addLayer(oLayer);
            var oInfo = self._getGisObj(oLayer);
            self._oMapBase.fire('FenceView:UI.addFence', oInfo);
            self.fire('FenceView:UI.addFence', oInfo);
        });

        this._oMap.on('draw:edited', function (e) {

            var aoLayer = e.layers;
            aoLayer.eachLayer(function (oLayer) {
                var oInfo = self._getGisObj(oLayer);
                self._oDrawLayer.addLayer(oLayer);
                oInfo.cId = oLayer.cId;
                oInfo.oFenceInfo = oLayer.oFenceInfo;

                self._oMapBase.fire('FenceView:UI.updateFence', oInfo);
                self.fire('FenceView:UI.updateFence', oInfo);
            });
        });
    },

    setParentEvent: function () {
        this._oNameContainer = $('.ex-layout-maptool.ex-theme-maptool.ex-map-top.ex-map-left.ex-maptool-edit');
        ////屏蔽事件
        L.DomEvent.addListener(this._oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

        L.DomEvent.addListener(this._oNameContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oNameContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oNameContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oNameContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this._oNameContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },

});
