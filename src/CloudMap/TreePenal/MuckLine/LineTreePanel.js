/**
 * 树 的panel
 * 不要继承BaseTreePanel
 * Created by liulin on 2017/9/4.
 */

ES.CloudMap.LeftTree = ES.Common.BaseTree.extend({

    initUI: function () {

        this.$_oContainer = $('.ex-theme-tree');
        this.$_oTreeContainer = this.$_oContainer.find('.ex-layout-struckbox-content');
        this.$_oSearchInput = this.$_oContainer.find('.ex-tree-search-ipt');
        this.$_oSearchBtn = this.$_oContainer.find('.ex-tree-search-btn');
        this.$_oContainer.find('h3').html(this.oOption.cTitle);

        this.initOn();
    },

    initOn: function () {
        this._oParent.on('PostPosTreeView.reflesh',this.reflesh,this);
    },

    reflesh: function () {
        //if (!this.oPopTree) {
        //    return;
        //}
        //this.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
        this.$_oTree.refresh();
    },

    // 点击节点选择
    selectCallBack: function (e,oNode) {
        if (!oNode.node.data || !oNode.node.data.Id) {
            this._oParent.defaultClick();
            //this._oParent.clearLayers();
            //this._oParent.fire('CloudMap:EditTool.calEdit');
            return;
        }

        // 清除交互图层
        this._oParent.clearLayers();
        ES.getData({Id: oNode.node.data.Id}, '/Line/LineInfo', this.selectHandler, this);
    },

    selectHandler: function (oData) {
        this._oParent.fire('CloudMap:EditTool.edit', {oNode: oData});
    },
});