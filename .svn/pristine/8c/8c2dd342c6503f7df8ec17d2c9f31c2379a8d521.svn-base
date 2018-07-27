/**
 *  详细界面
 * 管理实时状态 所有组件
 * 判断是切换还是再次加载页面由后台决定
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.RealStatusNj = ES.VehInfo.extend({

    //管理基本事件操作,内部事件管理机制，只在内部使用，禁止事件在外部广播
    includes: ES.Mixin.Events,

    oOption: {
        // 实时状态$ 查找标志
        cTagGpsInfo: '.ec-g > .ec-u-md-4 > .stats-card > ul.ec-avg-md-2',

        // 车信号$ 查找标志
        cTagVehStatusInfo: '.ec-g > .ec-u-md-4 > .stats-card > ul.ex-acc',

        //车辆gps信息 和 网络信息
        cTagMobileInfo: '.ex-layout-mobile',

        // 速度图表控件
        cSpeedChartId: 'echartsSpeed',

        cSpeed: ""
    },

    // 加载详情界面
    loadDetailView: function (oData) {

        var self = this;
        this.$_oContent.show();
        this.$_oContent.load("/MapView/DetailView",
            { 'devNo': oData.oGpsInfo.devNo,'vehNo':  oData.oGpsInfo.vehNo},
            function () {
                // 加载注册时，加载图表和grid 对象
                self.oSpeedChart = new ES.VehInfo.SpeedChart(self, {});
                self.oAlarmGrid = new ES.VehInfo.AlarmGridLst(self, {});

                self.oWeightChart = new ES.VehInfo.WeightChart(self, {});

                self.oMapMonitor = new ES.VehInfo.MapMonitor(self, {oMapOption: {
                    zoomControl: false,
                    layers: [],
                    center: new L.LatLng(22.550611, 114.055595),
                    zoom: 13,
                    attributionControl:false,
                } ,cDidId: 'mCarLiveView'});

                // 隐藏相关配置信息
                var aoLi = self.$_oContent.find('ul.ex-acc>li[cId='+ ES.MapView.oConfig.carMask+']');
                if(!aoLi || aoLi.length<=0){
                    self.$_oContent.find('div.car-mask').hide();
                    self.oSpeedLineChart = new ES.VehInfo.SpeedLineChart(self, {});
                    self.$_oContent.find('div.car-light').hide();
                }
                else
                {
                    self.oSpeedLineChart = new ES.VehInfo.SpeedDoorLineChart(self, {});
                }
                self.bIsLoad = true;
                // 加载成功回调
                self.switchDetailView(oData);

                self.initEven();

                self.oSpeedLineChart.reflesh();
                self.oMapMonitor.reflesh();
            });
    },

    // 第一个，加载GPS状态
    setGpsInfo: function (oGpsInfo) {
        if (!oGpsInfo) {
            oGpsInfo = this.oGpsInfo;
        }
        var cMsg = ES.TrackHelper.getDateMsg(oGpsInfo.gpsTime);
        $(this.oOption.cTagGpsInfo).empty();
        var cHtml = '<li>状态： ' + (oGpsInfo.sta || "通讯中断") + ' </li>'
            + '<li>速度： ' + oGpsInfo.speed + ' Km/h</li>';
        $(this.oOption.cTagGpsInfo).html(cHtml);
        $(this.oOption.cTagGpsInfo).parent().find("p").eq(0).html("最后记录位置：" + oGpsInfo.poi);
        $(this.oOption.cTagGpsInfo).parent().find("p").eq(1).html("最后记录时间：" + oGpsInfo.gpsDate.replace('T', ' ') + cMsg);
        $(this.oOption.cTagGpsInfo).parent().find("p").eq(2).html("最后记录状态：" + oGpsInfo.sta);
    },

    // 第二个，设置车辆实时状态,设置顶棚状态，
    setVehStatusInfo: function (oGpsInfo) {
        if (!oGpsInfo.status){
            return;
        }
        $(this.oOption.cTagVehStatusInfo).parent().show();
        $(this.oOption.cTagVehStatusInfo).find('a').removeClass('on');
        $(this.oOption.cTagVehStatusInfo).find('a>span').text('关')
        var oStatus = oGpsInfo.status;
        for (var cKey in oStatus) {
            var oA = $('a[cId="' + oStatus[cKey] + '"]');
            if (oA || oA.length > 0) {
                oA.addClass('on');
                oA.find('span').text('开');
            }
        }

        //设置顶灯状态 开为 -360px ，关 为0px
        $.inArray(15, oStatus)<0 ? $('.car-cover').animate({"left": "0px"}, 500) : $('.car-cover').animate({"left": "-360px"}, 500);

        //设置是否超速
        // $('a[cId="cs"]').find('span').text('');
        // if (oGpsInfo.speed > 60) {
        //     $('a[cId="cs"]').addClass("warning");
        //     $('a[cId="cs"]').find('span').text('超');
        // }
        // else {
        //     $('a[cId="cs"]').removeClass("warning");
        //     $('a[cId="cs"]').find('span').text('');
        // }

        // // 设置未密封
        // $('a[cId="OilLinetemp"]').removeClass("on").removeClass("check");
        // //设置未密封 速度大于0 ，但是门磁为1
        // if (oGpsInfo.speed > 0 && oStatus.FrontDoor) {
        //     $('a[cId="OilLinetemp"]').addClass("on");
        // }
        // else if (oStatus.FrontDoor == false) {
        //     $('a[cId="OilLinetemp"]').addClass("check");
        // }
    },

    // 车顶灯状态
    setVehLight: function (oGpsInfo) {
        if (!oGpsInfo || !oGpsInfo.attach) {
            return;
        }

        $(".car-light").removeClass("l-green").removeClass("l-red").removeClass("l-yellow").removeClass("l-gray");
        $('a[cId="cz"]').removeClass("green").removeClass("warning").removeClass("yellow");

        ES.TrackHelper.convertVehStatus(oGpsInfo);

        var cClass = "";
        if ((oGpsInfo.nGreenOn  + oGpsInfo.nRedOn  + oGpsInfo.nYelloOn ) != 1) {
            cClass = "l-gray";

        }
        else if (oGpsInfo.nGreenOn  == 1) {
            cClass = "l-green";
            $('a[cId="cz"]').addClass('green');
        }
        else if (oGpsInfo.nRedOn == 1) {
            cClass = "l-red";
            $('a[cId="cz"]').addClass('warning');
        }
        else {
            cClass = "l-yellow";
            $('a[cId="cz"]').addClass('yellow');
        }
        $(".car-light").addClass(cClass);
    },

    // 第三个，设置车辆gps信息 和 网络信息
    setMobileInfo: function (oGpsInfo) {
        //去掉on状态
        var $_oIMobile = $(".ex-icon-mobile");
        var $_oIBD = $(".ex-icon-bd");

        $_oIMobile.removeClass("on").removeClass("off");
        $_oIBD.removeClass("on").removeClass("off");

        //判断当前位置信息
        if (oGpsInfo.sta == "行驶"
            || oGpsInfo.sta == "停车"
            || oGpsInfo.sta == "熄火") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("on");
        }
        else if (oGpsInfo.sta == "通讯中断") {
            $_oIMobile.addClass("l-mobile-off");
            $_oIBD.addClass("l-bd-off");
        }
        else if (oGpsInfo.sta == "定位失败") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("off");
        }
        else {
            $_oIMobile.addClass("off");
            $_oIBD.addClass("off");
        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.$_oContent = $(".ex-layout-cardetail-content.veh-real-status");
        this.bIsLoad = false;

        // 初始化界面
        this.initUI();

        //初始化事件监听
        this.initOn();

    },

    initEven: function () {
        var self = this;
        //放大
        $('.ex-expand').bind('click', function () {
            var $that = $(this).closest('.stats-card');
            $that.addClass('expand').find('.ex-map-car-live').css({
                'width': $that.width() + 'px',
                'height': $that.height() - 33 + 'px'
            });
            $(this).hide();
            $that.find('.ex-compress').show();
            $('.ex-layout-content').css("z-index", "3");
            self.oMapMonitor.reflesh();
            self.oSpeedLineChart.reflesh();

        });

        //缩小
        $('.ex-compress').bind('click', function () {
            var $that = $(this).closest('.stats-card');
            $that.removeClass('expand').find('.ex-map-car-live').css({'width': $that.width() + 'px', 'height': '100%'});
            $(this).hide();
            $that.find('.ex-expand').show();
            $('.ex-layout-content').css("z-index", "1");
            self.oMapMonitor.reflesh();
            self.oSpeedLineChart.reflesh();

        });

        $(window).resize(function () {
            self.oMapMonitor.reflesh();
            self.oSpeedLineChart.reflesh();
        });
    },

    // 监听事件
    initOn: function () {

    },

    // 设置告警内容
    setAlarmInfo: function (oData) {

        if (!oData || !oData.aoAlarmInfo || oData.aoAlarmInfo.length <= 0) {
            return;
        }

        if (!this.oAlarmGrid) {
            return;
        }
        // 设置告警数据到grid 中
        this.oAlarmGrid.addAlarm(oData.aoAlarmInfo)
    },

    // 订阅车里gps 推送
    setHubGpsInfo: function (oD) {
        if (!oD || !oD.oData || oD.oData.length <= 0) return;
        // 要判断当前detail页面展开的是那个页面

        var self = this;
        if (!self.oGpsInfo) {
            //还没有初始化
            //console.log(ESLang.VehInfo.RealStatusNj[1]);
            return;
        }
        var Item = this._oParent._oPage.toHeartModle(this._oParent._oPage.getVstatus(oD.oData));
        // 要判断当前的车辆设备号是否为监控的设备号
        $.each(Item, function (nIndex, oItem) {
            if (oItem.devNo == self.oGpsInfo.devNo) {
                if (oItem.vehNo === undefined) {
                    oItem.vehNo = self.oGpsInfo.vehNo;
                    oItem.entName = self.oGpsInfo.entName;
                }

                // 设置监听对象的值
                ES.TrackHelper.convertVehStatus(oItem);
                self.setVehGpsStatus({oGpsInfo: oItem});
            }
        })
    },

    // 切换设备,并缓存订阅的车辆信息
    switchDetailView: function (oData) {

        if(!this.bIsLoad){
            return;
        }

        // 显示对话框
        this.$_oContent.show();


        // 切换车辆设备
        var oGpsInfo = {};
        if (!oData || !oData.oGpsInfo) {
            oGpsInfo = this.clearVehInfo();
        }
        else {
            oGpsInfo = oData.oGpsInfo;
        }

        // 缓存当前页面的值
        this.oGpsInfo = oGpsInfo;

        // 切换车里Gps状态
        this.setVehGpsStatus(oData);

        // 切换告警数据
        this.oAlarmGrid.swithAlarmData(oData.oGpsInfo);

        this.oMapMonitor.setGpsInfo(oData.oGpsInfo);

        this.setBtnTrackEven(oData);
    },

    // 设置gpshub 的状态
    setVehGpsStatus: function (oData) {

        // 设置gps
        this.setGpsInfo(oData.oGpsInfo);

        // 设置车辆状态
        this.setVehStatusInfo(oData.oGpsInfo);

        this.setVehLight(oData.oGpsInfo);

        // 设置信号状态
        this.setMobileInfo(oData.oGpsInfo);

        // 速度仪表盘
        this.oSpeedChart.changeSpeed(oData.oGpsInfo);

        // 重量仪表盘
        this.oWeightChart.changeWeight(oData.oGpsInfo);

        // 线性图表设置速度和顶棚
        this.oSpeedLineChart.changeSpeedLine(oData.oGpsInfo);

        // 小地图实时监控
        this.oMapMonitor.setHubGpsInfo(oData.oGpsInfo);
    },

    clearVehInfo: function () {

        var oGpsInfo = { vehNo: '',
            devNo: '',
            latLng: null,
            gpsDate: '2017-01-01',
            direction: 0,
            poi:  '',
            speed: 0,
            status: {
                /// 0: ACC关 1：ACC开
                Acc : 1,
                /// 0: 未定位 1：定位
                Located : 2,
                /// 0: 北纬 1：南纬
                LatInfo : 3,
                /// 0: 东经 1：西经
                LonInfo : 4,
                /// 0: 运营状态 1：停运状态
                BusinessStatus : 5,
                /// 0：经纬度未经保密插件加密；1：经纬度已经保密插件加密
                LonLatEncrypt : 6,
                /// 0：车辆油路正常  1：车辆油路断开
                OilLine : 7,
                /// 0：车辆电路正常  1：车辆电路断开
                ElectricCircuit : 8,
                /// 0：车门解锁  1：车门加锁
                DoorLock : 9,
                /// 刹车
                Breaking : 10,
                /// 左转
                LeftTurn : 11,
                /// 右转
                RightTurn : 12,
                /// 远光
                DistanceLight : 13,
                /// 近光
                LowLight : 14,
                /// 0：前门关  1：前门开 （门磁线）
                FrontDoor : 15,
                /// 后门  0：后门关 或自定义高2无效   1：后门开或自定义高2有效
                BackDoor : 16,
                /// 发动机 0：发动机关  1：发动机开
                Engine : 17,
                /// 空调 0：空调关   1：空调开
                AirCondition : 18,
                /// 震动 0：震动关   1：震动开
                Vibration : 19,
                /// 喇叭 0：喇叭关   1：喇叭开
                Horn : 20
            },
            attach: {
                ZtLeightYelloOn: 0,
                ZtLeightGreenOn: 0,
                ZtLeightRedOn: 0,
            },
            currentState: '',
            mile: 0,
            gpsTime: 0,
            img:'/Asset/img/ex_default/law_144.png',
            CompanyName:'',
            sWeightValue:0,
        };

        return oGpsInfo;
    },

    // 给历史轨迹按钮绑定事件
    setBtnTrackEven: function (oData) {
        var self = this;
        // 先解绑
        $(".ex-btn-track").unbind("click");
        $(".ex-btn-track").bind("click", function () {
            window.open("/MapView/TrackView?PhoneNum=" + oData.oGpsInfo.devNo + "&VehicleNo=" + oData.oGpsInfo.vehNo);
        })
    },

    // 初始化界面
    initUI: function () {
        this.$_oContent.css({
            "width": "100%",
            "height": $('.ex-layout-cardetail').height() - 40,
            "overflow": "auto"
        })
    },

});