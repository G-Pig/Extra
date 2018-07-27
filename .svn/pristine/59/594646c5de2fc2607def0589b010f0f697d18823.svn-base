/**
 * Created by Administrator on 2017/6/3.
 */

ES.MapView.TabPanel.DiseSubDeptPanel = ES.MapView.TabPanel.SubDeptPanel.extend({

    oOption: {
        // 树的ur
        cUrl: '',
        // 面板的最上级容器，不是树容器
        cPContainer: '#classContainer',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',

        // 活动叶子节点得前缀
        cPrefix: '-',
        cUncheckEventName:'MapView:DiseLayer.removeLayers',
    },


    // 活动所有
    checkCallBack: function (e,oNode) {

        var aoNode = this.getSelfChildNode(oNode.node);
        var aoRtn = aoNode.map(function (oItem) {
            return {id: -parseInt(oItem.id), name: oItem.text}
        });
        ES.Util.reqData({url: '/Disease/QueryList', data: {model: JSON.stringify(aoRtn)}}, this.checkHandler, this);

    },

    checkHandler: function (oRtn) {
        if (!oRtn || !oRtn.rtnData) {
            return;
        }

        var aoData = oRtn.rtnData;

        this._oPage.fire("MapView:DiseLayer.DrawLayers", {aoData:aoData});
    },

});