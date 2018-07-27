/**
 * Created by Administrator on 2017/6/17.
 */

/**
 * Created by Administrator on 2017/4/22.
 */


ES.MapView.TabPanel.TaskPanel = ES.MapView.TabPanel.BasePanel.extend({
    cHTML: '<div class="ex-layout-carlist">' +
    '       <div class="ex-layout-carlist-title">' +
    '           <h4 class="ec-align-left">选件任务</h4>' +
    '           <a href="javascript:;" class="ex-icon-turn on" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a>' +
    '           <a href="javascript:;" class="ex-icon-turn off"><i class="ec-icon-arrow-circle-left"></i></a>' +
    '       </div>' +
    '       <div class="ex-layout-carlist-wrap">' +
    '           <div class="ex-layout-struckbox-search">' +
    '               <div class="ec-input-group">' +
    '                   <input type="text" class="ec-form-field cls-search-text" placeholder="请输入名称">' +
    '                   <span class="ec-input-group-btn">' +
    '                       <button class="ec-btn ec-btn-secondary ec-btn-xs  cls-search-btn" type="button"><span class="ec-icon-search"></span> </button>' +
    '                   </span>' +
    '               </div>' +
    '           </div>' +

    '           <div class="ex-layout-struckbox-content" ></div>' +

    '       </div>' +
    '</div>',

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
        cUncheckEventName:'MapView:ShowTaskLayer.removeLayers',
    },

    // 活动所有
    selectCallBack: function (e,oNode) {

        if (oNode.node.data.TaskId === 0 || oNode.node.data.Month === 0) {
            return;
        }
        var oParam = {BusinessType: 1, TackId: oNode.node.data.TaskId, Month: oNode.node.data.Month}

        ES.Util.reqData({url: '/MapView/GetTaskTrackAndDise', data: oParam}, this.checkHandler, this);

    },

    checkHandler: function (oRtn) {
        if (!oRtn || !oRtn.rtnData) {
            return;
        }

        var oData = oRtn.rtnData;

        this._oPage.fire("MapView:ShowTaskLayer.DrawLayers", oData);
    },


});