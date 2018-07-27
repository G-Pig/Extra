/**
 *  因为树的htl 在layout 中所以在这里只写树的实现
 *
 * Created by liulin on 2018/3/22.
 */

ES.SelectArea.Tree = ES.Common.BaseTree.extend({

    // 页面的配置
    cUIConfig: '',

    // 界面初始化
    initUI: function () {

        this.$_oContainer = $(this.oOption.cContainer);

        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');

    },

    checkCallBack: function (e, oNode) {

        var aoRtn = this.getSelfChildNode(oNode.node);

        this._oParent.appendRoad(aoRtn);
        // 在地图上绘制 选择的多边形
        this._oParent.fire("SelectArea:DrawArea",{aoData:aoRtn});
    },

    uncheckCallBack: function (e, oNode) {

        var aoRtn =  this.getSelfChildNode(oNode.node);

        this._oParent.removeRoad(aoRtn);

        this._oParent.fire("SelectArea:RemoveArea",{aoData:aoRtn});
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

});