/**
 * Created by YangHang on 2017/12/18.
 */

ES.Muck.UnloadTree = ES.Muck.LeftTree.extend({
    initUI: function () {
        this.$_oContainer = $('.ex-theme-tree');
        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');
    },
    // 选择节点触发
    selectCallBack:function (e,node ) {
        var oItem = node.node;
        if(oItem.data.type == 2){
            this.areaEvent(oItem);
        }else if(oItem.data.type == 8){
            this.siteEvent(oItem);
        }
    },
    areaEvent:function(oItem){
        var self = this;
        this._oParent.fire("MV:Site.drawRegion", { cText: oItem.text,  cId: oItem.id });
        var _typeIds = this._oParent.LayersPanel.oOption.checkStatus.concat([8]);
        ES.getData({typeIds:_typeIds,districtId:oItem.id},'/CloudMap/GetList',function(oData){
            //保存节点
            self._oParent.fire("MV:Site.setStatusData", {aoStatusData:oData});
        });
        ES.getData({districtId:oItem.id},'/Unload/GetSuspicList',function(oData){
            //保存节点
            self._oParent.fire("MV:Site.setStatusSuspSiteData", {aoStatusData:oData});
        });
        ES.getData({districtId:oItem.id},'/Unload/Stat',function(oData){
            //卡片数据
            self._oParent.fire("MV:Site.setSiteCards", {aoSiteCards:oData});
        })
    },
    siteEvent:function(oItem){
        var self = this;
        this._oParent.fire("MV:Site.clearRegion");
        this._oParent.fire("MV:Site.clearAll");
        var oSiteData = [oItem.data];
        var _typeIds = this._oParent.LayersPanel.oOption.checkStatus.concat([8]);
        ES.getData({typeIds:_typeIds,districtId:"3"},'/CloudMap/GetList',function(oData){
            //保存节点
            oData[8] = oSiteData;
            self._oParent.fire("MV:Site.setStatusData", {aoStatusData:oData});
        })
        ES.getData({districtId:"3"},'/Unload/GetSuspicList',function(oData){
            //保存节点
            self._oParent.fire("MV:Site.setStatusSuspSiteData", {aoStatusData:oData});
        })
    }
});
