/**
 * 内部详细 页面
 * Created by liulin on 2017/9/27.
 */


ES.MapView.VehDetail = ES.Class.extend({

    // li 数据
    oMenuConfig: {
        li: [
            {
                "class": 'ec-active', "data-band": 'VehInfo:RealStatus.loadDetailView',
                "menu-flag":"VehicleState",
                span: { html: "实时状态" }
            },
            {
                "class": '', "data-band": 'VehInfo:RealStatus.loadVehInfoView',
                "menu-flag":"VehicleInfo",
                span: { html: "车辆详情" }
            },
            {
                "class": '', "data-band": 'VehInfo:RealStatus.loadCompanyView',
                "menu-flag":"EnterpriseView",
                span: { html: "企业信息" }
            },
            {
                "class": '', "data-band": 'VehInfo:RealStatus.loadCheckLine',
                "menu-flag":"CheckLineView",
                span: { html: "审批路线" }
            },

            {
                "class": '', "data-band": 'VehInfo:RealStatus.loadSetControl',
                "menu-flag":"DeviceView",
                span: { html: "设备控制" }
            },

            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.loadLineInfoView',
            //     span: { html: "运输过程" }
            // },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.VehChangeHis',
            //     span: { html: "变更信息" }
            // },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.DevInfo',
            //     span: { html: "设备信息" }
            // },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.IllegalInfo',
            //     span: { html: "违法记录" }
            // }
        ]
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);

        this._oParent = oParent;
        this._oPage = this._oParent._oParent;

        this.$_oDivVehContent = $('.ex-layout-cardetail-content');
        this.$_oDivVehDetailTitle = $('.ex-theme-cardetail-title');
        this.$_oDivVehDetail = $('.ex-layout-cardetail');

        this.$_oTab = $("ul.ec-avg-sm-6");

        this.initUI();
        this.initTabObj();
        //初始化事件监听
        this.initOn();

        this.hideContent();

    },

    // 影藏控件
    hideContent: function () {
        $(".ex-layout-cardetail-content").hide();
    },

    // 初始化li
    initUI: function () {
        this.$_oTab.empty();
        ES.initTag(this.$_oTab, this.oMenuConfig);
        var self = this;
        //判定数据权限
        this._oParent._oParent.AuthValue(this._oParent.oOption.MapViewAuthDetail,this.$_oTab);

        // 给Li 绑定事件

        this.$_oTab.find("li").bind("click", this, function () {
            $(this).siblings().removeClass("ec-active");
            $(this).addClass("ec-active");
            if (!self.oParam) return;

            self._loadPage($(this));
        })
    },

    // 要初始化所有的对象
    initTabObj: function () {
        this.aoTabObj = [

            // 实时跟踪详细页面的操作
            new ES.VehInfo.RealStatusNj(this, {}),

            // 车辆信息
            new ES.VehInfo.VehInfoView(this, {
                // 请求的页面url
                cPageUrl: '/MapView/VehicleInfo',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadVehInfoView'
            }),

            // 公司信息
            new ES.VehInfo.VehInfoView(this, {
                // 请求的页面url
                cPageUrl: '/MapView/CompanyInfo',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadCompanyView'}),

            //审批线路
            new ES.VehInfo.ExamineLine(this, {
                // 请求的页面url
                cPageUrl: '/MapView/LineInfo',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadCheckLine'
            }),

            // 设备控制
            new ES.VehInfo.VehInfoView(this, {
                // 请求的页面url
                cPageUrl: '/MapView/Command',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadSetControl'
            }),

            //运输过程
            new ES.VehInfo.TripLine(this, {
                // 请求的页面url
                cPageUrl: '/MapMonitor/TripLineView',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadLineInfoView'
            }),

            // 变更信息
            new ES.VehInfo.VehChangeHis(this, {
                // 请求的页面url
                cPageUrl: '/MapMonitor/_VehChangeHis',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.VehChangeHis'
            }),

            // 设备信息
            new ES.VehInfo.DevInfo(this, {
                // 请求的页面url
                cPageUrl: '/MapMonitor/_PartialMapDevice',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.DevInfo'
            }),

            new ES.VehInfo.IllegalInfo(this, {
                // 请求的页面url
                cPageUrl: '/Illegal/_IllegalLstForVehNo',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.IllegalInfo'
            })
        ]
    },

    // 添加监听
    initOn: function () {
        // 监听实时推送
        this._oPage.on("HubSvr:setGpsInfo", this.setHubGpsInfo, this);

        // 监听告警推送
        this._oPage.on("HubSvr:setSingleAlarmInfo", this.setAlarmInfo, this);
    },

    // 设置参数
    setHubGpsInfo: function (oData) {
        var oObj = this.aoTabObj[0];
        if (!oObj) return;

        oObj.setHubGpsInfo(oData);

    },

    setAlarmInfo: function (oData) {
        var oObj = this.aoTabObj[0];
        if (!oObj) return;

        oObj.setHubGpsInfo(oData);
    },

    // 外部切换 加载页面,
    loadPage: function (oData) {
        if (this.oParam) {
            this.oParam = oData;
            if (this.oParam.oGpsInfo.devNo !== oData.oGpsInfo.devNo) {
                // 订阅告警
                this._oParent.fire("HubSvr:HubMange.addAlarmHub", { oGpsInfo: oData.oGpsInfo });
                // 给按钮添加事件
                //this.setBtnTrackEven(oData);
            }
        }
        else {
            this.oParam = oData;
            //this.setBtnTrackEven(oData);
        }

        this.$_oTab.show();
        this.hideContent();
        var oLi = this.$_oDivVehDetailTitle.find("ul>li.ec-active");
        var nIndex = oLi.index();
        if (nIndex < 0) return;
        var oObj = this.aoTabObj[nIndex];

        // 加载标准
        if (oLi.attr("bIsLoad") == "1") {
            // 切换
            oObj.switchDetailView(oData);
        }
        else {
            oObj.loadDetailView(oData);
            oLi.attr("bIsLoad", 1);
        }
    },

    // 内部li切换
    _loadPage: function (oLi) {
        this.hideContent();
        var nIndex = oLi.index();
        if (nIndex < 0) return;
        var oObj = this.aoTabObj[nIndex];
        // 加载标准
        if (oLi.attr("bIsLoad") == "1") {
            // 切换
            oObj.switchDetailView(this.oParam);
        }
        else {
            oObj.loadDetailView(this.oParam);
            oLi.attr("bIsLoad", 1);
        }
    },

})