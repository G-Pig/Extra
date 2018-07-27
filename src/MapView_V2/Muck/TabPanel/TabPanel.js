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

        //普通box宽度
        nViewWidth:220,
    },
    
    // 打开 2个view
    openTree: function () {
        if (!this.$_oContainer) {
            return;
        }

        var nWidth = 0;
        if (this.oListView) {
            nWidth = this.oOption.nListWidth;
        }
        if(this.oStrcukBox) {
            nWidth = nWidth+ this.oOption.nTreeWidth;
        }else if (this.oViewBox){
            nWidth = nWidth+ this.oOption.nViewWidth;
        }
        this.setWidth(nWidth);
        //var nWidth = this.getWidth();
        //this.$_oContainer.width(nWidth);

        nWidth = $(window).width() - nWidth - 40;
        this._oParent.fire('MapView:LayoutContent.resize', {nWidth: nWidth});
    },

    closeTree: function () {
        if (!this.$_oContainer) {
            return;
        }

        if (this.oListView) {
            this.setWidth(this.oOption.nListWidth);
            //this.$_oContainer.width();
        }

        // if (this.oStrcukBox) {
        //     this.oStrcukBox.hide();
        // }
        var nWidth = this.getWidth();
        nWidth = $(window).width() - nWidth - 40;
        this._oParent.fire('MapView:LayoutContent.resize', {nWidth: nWidth});
    },

    // 显示查询面板
    showBox: function () {
        if (!this.$_oContainer) {
            return;
        }

        //this.$_oContainer.fadeIn(500);
        this.$_oContainer.show();
        //this._oParent.resize(400);
        //this.openTree();
        if (this.oStrcukBox) {
            this.oStrcukBox.onOffCtrl(false);
        }
        var nWidth = $(window).width() - this.nWidth - 40;
        this._oParent.fire('MapView:LayoutContent.resize', {nWidth: nWidth});
    },

    // 隐藏查询面板
    hideBox: function () {
        this.$_oContainer.hide();
        //this.$_oContainer.fadeOut(500);
        //this._oParent.resize(120);
        //this.closeTree();
        if (this.oStrcukBox) {
            this.oStrcukBox.onOffCtrl(true);
        }

    },

});