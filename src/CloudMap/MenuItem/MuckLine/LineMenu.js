/**
 * 线路菜单
 * Created by liulin on 2017/9/4.
 */

// 菜单项 站点,一个菜单管理面板、操作、弹出层
ES.CloudMap.LineMenu = ES.CloudMap.BaseMenu.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p> 绘制线路 </p></li>',

    initialize: function (oParent, oOption) {

        ES.CloudMap.BaseMenu.prototype.initialize.call(this, oParent, oOption);

        this.initPenal();
        this.initEditTool();
        this.initDrawTool();
        this.initPopWnd();
        this.initSaveACalTool();

        // 画所有线路图
        //this.oLineLayer = new ES.CloudMap.LineLayer(this, {});


    },

    initOn: function () {
        ES.CloudMap.BaseMenu.prototype.initOn.call(this);

        var self = this;

        this._oMap.on('moveend', function (e) {
            if (!self.getActive()) {
                return;
            }
            var aoLayer = self._oDrawLayer.getLayers();
            if (!aoLayer || aoLayer.length <= 0) {
                return;
            }
            var nLen = aoLayer[0].getLatLngs().length;
            var oPos = this.latLngToLayerPoint(aoLayer[0].getLatLngs()[nLen-1]);

            self.fire('CloudMap:PopWnd.setPos', {oPos: oPos});
        });
    },


    endMenu: function () {
        if (this.oEditTool) {
            this.oEditTool.calEdit();
        }
        if (this.oDrawTool) {
            this.oDrawTool.calDraw();
        }

        this.clearLayers();
    }
});


// 管理面板
ES.CloudMap.LineMenu.include({

    // 树面板，其实不是面板树
    initPenal: function () {
        this.oPenal = new ES.CloudMap.LeftTree(this,{}, this.oOption.oTreePanelUrl);
        this.oPenal.show= function () {
            
        }
        this.oPenal.hide = function () {
            
        }
    },

    hidePenal: function () {
        //this.oPenal.hide();
    },
});

// 对图形进行编辑、删除操作
ES.CloudMap.LineMenu.include({

    // 树面板
    initEditTool:function(){

        this.oEditTool = new ES.CloudMap.EditLineTool(this,{oDrawLayer: this._oDrawLayer});
        this.oDelTool = new ES.CloudMap.DeleteTool(this,{});
        // 编辑
        this.aoEditTool.push(this.oEditTool);
        // 取消编辑
        this.aoEditTool.push(this.oDelTool);
    },

    // 添加到UI
    addEditToUI:function() {
        if (!this.oPContainer || this.aoEditTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoEditTool.length; i++) {
            this.oPContainer.appendTool(this.aoEditTool[i]);
            this.aoEditTool[i].bandClick();
        }
    },
});

// 对图形进行绘制
ES.CloudMap.LineMenu.include({

    // 树面板
    initDrawTool:function() {
        this.oDrawTool = new ES.CloudMap.DrawLineTool(this, {})
        this.aoDrawTool.push(this.oDrawTool);
    },

    // 添加到UI
    addDrawToUI:function() {
        if (!this.oPContainer || this.aoDrawTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();

        for (var i = 0; i < this.aoDrawTool.length; i++) {
            this.oPContainer.appendTool(this.aoDrawTool[i]);
            this.aoDrawTool[i].bandClick();
        }
    },

});

// 对图形进行保存和取消
ES.CloudMap.LineMenu.include({

    // 树面板
    initSaveACalTool:function(){
        this.oSaveTool = new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer});
        this.oCalTool =  new ES.CloudMap.CalEditTool(this,{});

        this.aoSaveACalTool.push( this.oSaveTool );
        this.aoSaveACalTool.push( this.oCalTool );
    },

    // 添加到UI
    addSaveACalToUI:function() {

        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i]);
            this.aoSaveACalTool[i].bandClick();
        }
    },



});

// 弹出层的基本操作
ES.CloudMap.LineMenu.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.LineWnd(this, {
            //弹出点相对位移
            oOffset: {nW: 10, nH: 30},
            cContainerSel: this._oParent.getMap()._mapPane
        },this.oOption.oTreePopUrl);

        this.oDelWnd = new ES.CloudMap.DelWnd(this, { cUrl: '/Line/Delete',}, {
            title: '删除操作-线路',
            cancelValue: '取消',
            content: '是否要删除数据！',

        });

        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});
