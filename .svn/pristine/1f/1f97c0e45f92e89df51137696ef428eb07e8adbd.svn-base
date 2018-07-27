/**
 *
 * 管理 统计 实时数据,仓库实体为 monitor
 *
 * 全局控制 monitor 面板数据
 *
 * Created by liulin on 2017/4/18.
 */


ES.MapView.MonitorMgr = ES.Evented.extend({



    oOption: {

        bIsCreate: true,

        // 初始化监听事件
        cEvenName: 'MV:VehSitePanel.initVehSite',

        // 当前div通用的样式,如果为空，以html 为容器
        acContainerDivClass: ['ex-layout-sider', 'ex-theme-sider'],

        cPContainer: '.ex-layout-main',

        // 当前面板标志
        cFlag: 'asset',

        // 是否显示查询面板
        bIsShowPanel: true,


        cTitle: '工地搜索车辆',

        // -- 界面加载完成 后触发的事件,url 加载
        cEventNameTabLoad: 'MapView:TabPanel.TabLoad',

    },

    oPagerParam: {
        // 分页总数
        nTotalCnt: 0,
        //当前页数
        nPageIndex: 1,
        //按钮总数
        nBtnCnt: 8,
        //每页大小
        nPageSize: 10,
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent
        // 保存当前页面对象
        //this.$_oPanel = null;

        // 车辆list
        //this.oListView =null;

        // 查询list
        //this.oStrcukBox = null;

        // 简化变量定义
        this.cFlag = this.oOption.cFlag;

        //this.cDivVehContent = '.ex-layout-sider.ex-theme-sider.' + this.cFlag + ' .ex-layout-carlist-content';

        this.dictMonitor = {};

        this.initOn();



    },

    // 监听事件
    initOn: function () {
        this._oParent.on('MapView:MonitorMgr.initMonitor', this.initMonitor, this);
        //this._oParent.on('flishLoaded', this.loadTree, this);
    },

    // 创建面板
    initMonitor: function (oTemp) {
        if(!this.dictMonitor){

            return;
        }

        var bIsExist = false;
        for(var cKey in this.dictMonitor ){
            if(cKey === oTemp.cFlag){
                this.dictMonitor[cKey].show();
                bIsExist = true;
            }
            else{

                this.dictMonitor[cKey].hide();
            }
        }

        if(!bIsExist) {

            var oObj = eval(oTemp.cMonitor);
            if (!oObj) {
                return;
            }

            this.dictMonitor[oTemp.cFlag] = new oObj(this, {cFlag:oTemp.cFlag});
            this.dictMonitor[oTemp.cFlag].show();
        }


    },

    // 初始化面板数据cListView
    initPanel: function () {
        // 是否显示查询面板
        if (!this.oOption.bIsShowPanel) {
            return;
        }
        var oTemp = eval(this.oOption.cObject);

        this.oStrcukBox = new oTemp(this, {
                // 树的顶级容器，不是树容器
                cPContainer: this.$_oPanel,
                //cUrl: '',
                cTitle: this.oOption.cTitle
            },
            ES.MapView.oConfig[this.oOption.cFlag]);


    },




    // 显示查询面板
    showBox: function () {
        if (!this.$_oPanel) {
            return;
        }

        this.$_oPanel.show();



    },

    // 隐藏查询面板
    hideBox: function () {
        this.$_oPanel.hide();

    },


    getWidth: function () {
        var nWidth = 0;
        if (this.oListView) {
            nWidth = this.oListView.getWidth();
        }

        if (this.oStrcukBox) {
            nWidth =nWidth+ this.oStrcukBox.getWidth();
        }

        return nWidth;
    }

});

// html 数据
ES.MapView.TabPanel.include({

    cHTML:'<div class="ex-layout-sider ec-fr">',

});
