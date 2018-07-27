/**
 * Created by liulin on 2016/12/19.
 *
 * 容器 tab 加载项
 *
 * tab 的布局 包括2部分 树的view 和 列表的view
 *
 */


ES.MapView.TabPanel = ES.MapView.BaseTabPanel.extend({

    oOption: {

        bIsCreate: true,

        // 初始化监听事件
        cEvenName: 'MV:VehSitePanel.initVehSite',

        // 加载的父级容器
        cPContainer: '.ex-layout-main',

        // 当前面板标志
        cFlag: 'panelFlag',

        // 是否显示查询面板
        bIsShowPanel: true,

        cTitle: '工地搜索车辆',

        // -- 界面加载完成 后触发的事件,url 加载
        cEventNameTabLoad: 'MapView:TabPanel.TabLoad',

        nWidth:220,

        // 初始化 宽度
        nInitWidth:220,

        // list 的 宽度
        nListWidth:220,
        
        // tree 的 宽度
        nTreeWidth:220,

    },
    
    
    // 打开 2个view
    openTree: function () {
        if (!this.$_oContainer) {
            return;
        }

        var nWidth = this.oOption.nTreeWidth + this.oOption.nListWidth;

        this.$_oContainer.width(nWidth);

        this._oParent.fire('MapView:LayoutContent.resize', {nWidth: nWidth});
    },

    closeTree: function () {
        if (!this.$_oContainer) {
            return;
        }

        this.$_oContainer.width(this.oOption.nTreeWidth);

        this._oParent.fire('MapView:LayoutContent.resize', {nWidth: this.oOption.nTreeWidth});
    },

    // 显示查询面板
    showBox: function () {
        if (!this.$_oContainer) {
            return;
        }

        this.$_oContainer.fadeIn(500);
        //this.$_oContainer.show();
        //this._oParent.resize(400);
        this.openTree();
        this.oStrcukBox.onOffCtrl(false);
    },

    // 隐藏查询面板
    hideBox: function () {
        //this.$_oContainer.hide();
        this.$_oContainer.fadeOut(500);
        //this._oParent.resize(120);
        this.closeTree();
        this.oStrcukBox.onOffCtrl(true);
    },

});