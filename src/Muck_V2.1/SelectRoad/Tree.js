/**
 * 左侧树
 * Created by YangHang on 2017/9/1.
 */
ES.SelectRoad.Tree = ES.Common.BaseTree.extend({

    initUI: function () {

        this.$_oContainer = $('#divVeh');
        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content.left-tree');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');
    },

    getSelfChildNode: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }
        var aoRtn = [];
        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {

            if(cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
            }

            return aoRtn;
        }

        $.merge(acNodeId, oNode.children_d);

        var cPrefix = this.oOption.cPrefix;


        for(var i = 0;i< acNodeId.length;i++){
            if(cPrefix) {
                if (acNodeId[i].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
            }

        }

        return aoRtn;
    },

    checkCallBack: function (e, oNode) {

        var aoRtn = this.getSelfChildNode(oNode.node);

        this._oParent.fire('SelectRoad:drawlayers', {aoData: aoRtn});

        this._oParent.appendRoad(aoRtn);
    },

    uncheckCallBack: function (e, oNode) {

        var aoRtn = this.getSelfChildNode(oNode.node);

        this._oParent.fire('Drawlayers:removelayers', {aoData: aoRtn});

        this._oParent.removeRoad(aoRtn);
    },

    getCheckData:function(acId){
        if (!acId || acId.length <= 0) {
            return;
        }
        var Data = [];
        for (var i = 0; i < acId.length; i++) {
            if(acId[i].indexOf("_") >= 0){
                var _data=this.$_oTree.get_node(acId[i]).data;
                Data.push(_data);
            }
        }
        return Data;

    },

    checkAllCallBack:function(){
        this._oParent.fire('RoadTree:layer',{acId:this.getCheckId(),acData:this.getCheckData(this.getCheckId())});
    },

    uncheckAllCallBack:function(){
        this._oParent.fire('unRoadTree:layer', {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },


});