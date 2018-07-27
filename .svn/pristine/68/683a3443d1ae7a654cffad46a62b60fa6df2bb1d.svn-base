/**
 * Created by liulin on 2017/9/27.
 */

ES.MapView.FrameTab = ES.Evented.extend({

    oOption: {
        //是否用iframe实现轨迹回放，目前分2不走，一步用iframe 来实现，一个用div来实现
        bIsIframe: true,
        nTick: 600,
        nHideTick:150,
    },

    // 保存车辆信息
    oParam:null,

    // nFlag 表示页面加载的内容 0 表示什么都没有加载，1表示加载车辆信息，2表示加载历史轨迹，3表示加载跟踪车辆信息
    nFlag:0,

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initUI();

        // 详细页面的内容
        this.$_oDivVehContent = $('.ex-layout-cardetail-content.veh-other-info');
        // 详细页面的title
        this.$_oDivVehDetailTitle = $('.ex-theme-cardetail-title');
        // 整个详细页面
        this.$_oDivVehDetail = $('.ex-layout-cardetail');


        //初始化事件监听
        this.initOn();
        this.initObj();
        this.initEvent();

    },

    initEvent: function () {
        var self = this;

        $(".ex-layout-cardetail-close.ec-close").eq(0).bind('click', this, function () {

            // 显示X按钮
            self._oParent.setBtn0();
            // 隐藏 实时监控 、轨迹回放
            self._oParent.fire("MapView:VehDetail.hideTrack");
            // 设置地图高度 h - 0
            self._oParent.fire("MapView:Map.setMapConterH", { nH: 0, nTick: 150 });
        });

        // 向下箭头
        $(".ex-layout-cardetail-close.ec-close").eq(1).bind('click', this, function () {
            // 显示向上箭头
            self._oParent.setBtn2();
            // 隐藏实时跟踪的
            self._oParent.fire("MapView:TrackLst.hideTrack");
            //地图显示为 h - 40
            self._oParent.fire("MapView:Map.setMapConterH", { nH: 40, nTick: 150 });
        });

        $(".ex-layout-cardetail-close.ec-close").eq(2).bind('click', this, function () {
            // 显示向下按钮
            self._oParent.setBtn1();
            // 显示实时跟踪的高度
            self._oParent.fire("MapView:TrackLst.reShowTrack");
        })
    },

    // 管理对象
    initObj: function () {
        this.oVehDetail = new ES.MapView.VehDetail(this, {});
        // 初始查询
    },

    // 注册监听事件
    initOn: function () {
        this._oParent.on("MapView:VehDetail.showDetail", this.showDetail, this);
        this._oParent.on("MapView:VehDetail.switchDetail", this.switchDetail, this);

        // 轨迹显示方法
        this._oParent.on("MapView:VehDetail.showTrack", this.showTrack, this);
        this._oParent.on("MapView:VehDetail.reShowTrack", this.reShowTrack, this);
        this._oParent.on("MapView:VehDetail.hideTrack", this.hideTrack, this);
    },

    initUI: function () {
        var $_oContainer = $(this.cHtml);
        $('.ex-layout-content').append($_oContainer);
        this.$_oContainer=$_oContainer;
        this.$_oContainer.show();
    },

    // 隐藏轨迹
    hideTrack: function () {
        var self = this;
        this.$_oDivVehDetail.animate({ "height": "100%", "bottom": "-100%" }, self.oOption.nHideTick);
        this.nFlag = 0;
    },

    // 显示轨迹
    reShowTrack: function () {
        var self = this;
        this.$_oDivVehDetail.animate({ "height": "100%", "bottom": "0" }, self.oOption.nTick);
    },

    // 页面显示情况下 切换页面
    switchDetail:function (oData) {
        this.oParam = oData.oGpsInfo;
        $(".ex-theme-cardetail-title>span").html('<i class="ec-icon-truck"></i>  ' + oData.oGpsInfo.vehNo);
        this.oVehDetail.loadPage(oData);
    },

    // 加载实时状态显示
    showDetail: function (oData) {
        // 保存数据
        this.oParam = oData.oGpsInfo;
        $(".ex-theme-cardetail-title>span").html('<i class="ec-icon-truck"></i>  ' + oData.oGpsInfo.vehNo);
        var nFlag = this._oParent.getDetailStatus();
        if (nFlag == 1) {
            this.oVehDetail.loadPage(oData);
            this.$_oDivVehDetail.animate({"height": "100%", "bottom": "0"}, this.oOption.nTick);
            return;
        }

        //var self = this;
        this.$_oDivVehDetail.animate({"height": "100%", "bottom": "0"}, this.oOption.nTick);
        //loadAnimate(this.$_oDivVehDetail, null);
        //setTimeout(function () {
        // 显示详细页面
        this.oVehDetail.loadPage(oData);
        //loadAnimate(null, 'remove');
        //}, self.oOption.nTick);

        this._oParent.setBtn0();
    },

    // 加载历史轨迹页面
    showTrack: function (oData) {
        // 初始化界面
        $("ul.ec-avg-sm-12").hide();

        var self = this;
        this.$_oDivVehDetail.animate({ "height": "100%", "bottom": "0" }, self.oOption.nTick);
        //loadAnimate(this.$_oDivVehDetail, null);
        setTimeout(function () {
            self.$_oDivVehContent.show();
            self.$_oDivVehContent
                .css({ "width": "100%","overflow":"hidden","height": $('.ex-layout-cardetail').height() - 40 })
                .html(self.getContent(oData));
            //loadAnimate(null, 'remove');
        }, self.oOption.nTick);
        $(".ex-theme-cardetail-title>span").html('<i class="ec-icon-truck"></i>  ' + oData.oGpsInfo.vehNo);

        this._oParent.setBtn0();
    },

    // 获得轨迹回放的内容
    getContent: function (oData) {
        if (this.oOption.bIsIframe) {
            var m_cTrackUrl = "/MapMonitor/TrackView";
            return '<iframe src="' + m_cTrackUrl + '?PhoneNum=' + oData.oGpsInfo.devNo + '&VehicleNo=' + oData.oGpsInfo.vehNo + '" name="MainFrame" id="MainFrame"  frameborder="0" style="width:100%; height:100%; margin:0; padding:0; overflow:hidden;" allowfullscreen mozallowfullscreen webkitallowfullscreen></iframe>'
        }
        else {
            return $('#TempTrackView').html();
        }
    },

});

ES.MapView.FrameTab.include({
    cHtml:
    '<div id="MapShowDetail" class="ex-layout-cardetail ex-theme-cardetail">' +
    '   <a href="javascript:void(0);" class="ex-layout-cardetail-close ec-close">&times;</a>' +
    '   <a href="javascript:void(0);" class="ex-layout-cardetail-close  ec-close ec-btn-sm ex-btn-close-down" style="color:#fff;display:none">' +
    '       <i class="ec-icon-arrow-down"></i>' +
    '   </a>' +
    '   <a href="javascript:void(0);" class="ex-layout-cardetail-close  ec-close ec-btn-sm ex-btn-close-up" style="color:#fff;display:none">' +
    '       <i class="ec-icon-arrow-up"></i>' +
    '   </a>' +
    '   <h4 class="ex-theme-cardetail-title">' +
    '       <span>车辆实时状况</span>' +
    '       <ul class="ec-avg-sm-6">' +
    '           <li class="ec-active" >实时状态</li>' +
    '           <li>车辆详情</li>' +
    '           <li>企业信息</li>' +
    '           <li>审批路线</li> ' +
    '           <li>运输过程</li> ' +
    '           <li>设备控制</li> ' +
    '           <li>变更信息</li> ' +
    '           <li>违法记录</li> ' +
    '           <li>设备信息</li> ' +
    '           <li>安装信息</li> ' +
    '           <li>统计分析</li> ' +
    '       </ul>' +
    '   </h4>    ' +
    '   <div class="ex-layout-cardetail-content veh-other-info"></div>    ' +
    '   <div class="ex-layout-cardetail-content veh-real-status"></div>    ' +
    '</div>',

});