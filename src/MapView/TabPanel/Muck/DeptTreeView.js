/**
 *  Created by xunchuang on 2017/7/23.
 *
 *  初始化部门树
 *  DeptTreeView
 *  其他的树 的写法和这个是一样的
 */

ES.MapView.TabPanel.DeptTreeView = ES.MapView.BaseTabPanel.BaseTreeView.extend({

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

    checkHandler: function (oRtn) {
        if (!oRtn || !oRtn.rtnData) {
            return;
        }

        var oData = oRtn.rtnData;

        this._oPage.fire("MapView:ShowTaskLayer.DrawLayers", oData);
    },

    //e, oThisNode
    readyCallBack:function () {
        this.checkAll();
        //this.checkCallBack();
    },
});