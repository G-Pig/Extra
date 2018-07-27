/**
 * Created by liulin on 2018/3/16.
 */

ES.MapView.TabPanel.SpeedLimitTreeView = ES.MapView.BaseTabPanel.BaseTreeView.extend({

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
        cPrefix: null,
        cUncheckEventName:'MapView:DeptTreeView.removeLayers',
        cCheckEventName:'MapView:DeptTreeView.getDeptId'
    },

    // 活动所有
    selectCallBack: function (e,oNode) {
        //if (oNode.node.data.TaskId === 0 || oNode.node.data.Month === 0) {
        //    return;
        //}
        //var oParam = {BusinessType: 1, TackId: oNode.node.data.TaskId, Month: oNode.node.data.Month}
        //
        //ES.Util.reqData({url: '/MapView/GetTaskTrackAndDise', data: oParam}, this.checkHandler, this);
    },

    checkCallBack:function (e,oNode) {
        var aoRtn = this.getSelfChildNode(oNode.node);
        this._oPage.fire("MapView:SpeedLimit.show",{aoData:aoRtn} );

    },
    uncheckCallBack:function(e,oNode){
        var aoRtn =  this.getSelfChildNode(oNode.node);
        this._oPage.fire("MapView:SpeedLimit.RemoveLayers", {aoData:aoRtn} );
    },
    checkHandler: function (oRtn) {
        if (!oRtn || !oRtn.rtnData) {
            return;
        }
        var oData = oRtn.rtnData;

        this._oPage.fire("MapView:SpeedLimit.RemoveLayers", oData);
    },
    //e, oThisNode
    readyCallBack:function () {
        //this.checkAll();
        //this.checkCallBack();
    },
});