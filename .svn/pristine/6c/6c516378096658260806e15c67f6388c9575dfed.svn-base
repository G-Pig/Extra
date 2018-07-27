/**
 * Created by YangHang on 2018/2/26.
 */



ES.MapView.BaseTabPanel.RectVehLst = ES.MapView.BaseTabPanel.BaseLst.extend({
    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent;
        this.$_oLstContainer = null;
        this.$_oContainer = null;
        this.oSearchInput = null;
        this.oSearchBtn = null;

        // 部门id数组为空
        this.anDeptId = {};

        // 初始化界面
        this.initOn();

        if (typeof this.oOption.cDivContainerSel === 'object') {

            this.$_oContainer = this.oOption.cDivContainerSel
        }
        else {
            this.$_oContainer = $(this.oOption.cDivContainerSel);
        }

        this.initUI();
    },

    // 初始化界面
    initData: function (nPage, fnCall) {

        ES.Util.loadAn(this.$_oLstContainer);
        var oTemp = this.anDeptId;

        ES.extend(oTemp, {
            pageSize: ES.MapView.oConfig.nMaxPageSize,
            page: nPage
        });

        ES.getData(oTemp, this.oOption.cUrl, fnCall, this);
    },

    toModle: function (oData) {

        var aoGps = [];
        if (!oData || !oData.dataList || oData.dataList.length <= 0) {
            return aoGps;
        }
        for (var i = 0; i < oData.dataList.length; i++) {
            var item = oData.dataList[i];

            var oModel =  {
                id: item.VehicleId,
                vehNo: item.VehicleNo,
                devNo: item.DeviceNo,
                latLng: null,
                gpsDate: '',
                dir: 0,
                poi: '',
                speed: 0,
                status: null,
                currentState: '',
                mile: 0,
                gpsTime: 0,
            };
            aoGps.push(oModel);
        }

        return aoGps;
    },
    // 设置车辆位置到地图
    curPosHandler: function (oTemp) {
        if (!oTemp) {
            return;
        }
        var aoTemp = this._oPage.toHeartModle(oTemp);
        var self = this;
        // 要不请求到的值赋值给li对象
        this.$_oLstContainer.find('li').each(function () {
            var oItem = $(this).data('data');
            if (!oItem) {
                return true;
            }

            for (var i = 0; i < aoTemp.length; i++) {
                if (aoTemp[i].devNo === oItem.devNo) {
                    $(this).find(".carlist-title > p.time").html(aoTemp[i].gpsDate);
                    aoTemp[i].id = oItem.id;
                    aoTemp[i].trankInfo =  oItem.trankInfo;
                    // 缓存当前也的数据
                    $(this).data('data', aoTemp[i]);
                    var cCls = self.getTruckCls(aoTemp[i]);
                    // 跟新车辆状态
                    $(this).find('.carlist-card>i')
                        .removeClass('green')
                        .removeClass('yellow')
                        .removeClass('gray')
                        .addClass(cCls);

                    break;
                }
            }
        });

        // 触发实时控制,推送数据到界面
        //this._oPage.fire('HubSvr:setGpsInfo', {oData: oTemp.Data});
        //this._oPage.fire('HubSvr:batchSubGps', {aoGpsInfo: oTemp.Data,cUserId:m_cUserId});
    },
    toRectModle: function (oData) {
        var aoGps = [];
        if (!oData || !oData.dataList || oData.dataList.length <= 0) {
            return aoGps;
        }
        for (var i = 0; i < oData.dataList.length; i++) {
            var item = oData.dataList[i];

            var oModel =  {
                id: item.VehicleId,
                vehNo: item.VehicleNo,
                devNo: item.PhoneNum,
                latLng: null,
                gpsDate: item.PullBoxList[0].GpsDateTime,
                dir: 0,
                poi: '',
                speed: 0,
                status: null,
                currentState: '',
                mile: 0,
                gpsTime: 0,
                trankInfo:item.PullBoxList,
            };
            aoGps.push(oModel);
        }

        return aoGps;
    },

    // 初始化分页
    initPager: function (oData) {
        // 初始化分页控件
        this._oParent.fire("MapView:Pager.reflashPager", {nTotalCnt: oData.records});
    },

    vehHandler: function (aoGps) {

        ES.Util.removeAn(this.$_oLstContainer);

        if (!aoGps) {
            return;
        }
        var $_oUL = this.initVehItems(aoGps);
        if (!$_oUL) {
            return;
        }
        this.initVehLocal($_oUL);
        this.vehItemEvent($_oUL);
        this.initVehByAnimate($_oUL);
        this.initAttendEvent();
        this.initAttend();
    },
    vehItemEvent: function ($_oUL) {

        var self = this;

        $_oUL.find("li").each(function () {

            // 跟踪
            // $(this).find("a").eq(0).bind("click", $(this), function (e) {
            //     var oGpsInfo =  e.data.data('data');
            //     //ec-btn-secondary //ec-btn-default
            //     if($(this).text() === '跟踪'){
            //
            //         $_oUL.find('a.track').click();
            //         $(this).addClass('track');
            //         $(this).text("取消跟踪")
            //         // 加历史轨迹界
            //         self._oPage.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});
            //     }
            //     else
            //     {
            //         $(this).removeClass('track');
            //         $(this).text('跟踪')
            //         self._oPage.fire('HubSvr.unsubGps',{aoGpsInfo:[oGpsInfo]});
            //         self._oPage.fire("MapView:LiveMange.removeAll");
            //     }
            //
            // });

            $(this).find("a").eq(0).bind("click", $(this), function (e) {
                var oGpsInfo =  e.data.data('data');
                //ec-btn-secondary //ec-btn-default
                if($(this).hasClass('ec-btn-secondary')){
                    $(this).removeClass('ec-btn-secondary').addClass('ec-btn-default');
                    $(this).removeClass('track');
                    self._oPage.fire('HubSvr.unsubGps',{aoGpsInfo:[oGpsInfo]});
                    self._oPage.fire("MapView:LiveMange.removeAll");
                }
                else
                {
                    $_oUL.find('a.track').click();
                    // 加历史轨迹界
                    self._oPage.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});

                    $(this).addClass('track');
                    $(this).removeClass('ec-btn-default').addClass('ec-btn-secondary')
                }
            });

            $(this).find("a").eq(1).bind("click", $(this), function (e) {
                var oGpsInfo =  e.data.data('data');
                window.open("/MapView/TrackViewV2?PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);
            });

            $(this).find("a").eq(2).bind("click", $(this), function (e) {
                var oGpsInfo =  e.data.data('data');
                // 画当前点到界面
                self._oPage.fire("MapView:VehDetail.showDetail",{oGpsInfo:oGpsInfo});
                // 取消订阅
                self._oPage.fire('HubSvr.unsubGps',{aoGpsInfo:[oGpsInfo]});
                // 移除跟踪列表
                self._oPage.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oPage.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});

                // 取消其他设备订阅
                self._oPage.fire('HubSvr.unSubAlarm');
                //订阅车辆告警
                self._oPage.fire('HubSvr.subAlarm',{aoGpsInfo:oGpsInfo});
            });
        });

        // 实现定位人，并展示人的数据
        $_oUL.find("li").bind('click', function () {

            var oGpsInfo = $(this).data("data");
            $(this).siblings().removeClass('ec-active');
            $(this).addClass('ec-active');

            self._oPage.fire('MapView:LiveMange.addLivePos',{oGpsInfo:oGpsInfo});
            // 定位到当前车辆
            self._oPage.fire('MapView:MapLive.setZoomIn',{oGpsInfo:oGpsInfo});

            self._oPage.fire("MapView:VehDetail.switchDetail",{oGpsInfo:oGpsInfo});

            self._oPage.fire('VehicleLine:layer',{oGpsInfo:oGpsInfo.trankInfo});

        });
    },
    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'truck';
        var cClsStatus = 'gray';
        if (oData.carUseIn == 0) {
            cClsType = 'tram';
        }

        if (oData.sta == '行驶' || oData.sta == '停车'|| oData.sta == '熄火') {
            cClsStatus = 'green';
        }
        else {
            cClsStatus = 'gray';
        }

        return cClsType + ' ' + cClsStatus;
    },

    // 初始化所有车辆列表
    initVehItems: function (aoGps) {
        var $_oUL = $("<ul></ul>");
        if (!aoGps) {
            this.initVehByAnimate($_oUL);
            return;
        }

        for (var i = 0; i < aoGps.length; i++) {
            aoGps[i].cCls = this.getTruckCls(aoGps[i]);
            var cHtml = ES.Util.template(this.cItemHtml, aoGps[i]);
            var oLi = $(cHtml);
            oLi.data("data", aoGps[i]);

            $_oUL.append(oLi);
        }

        return $_oUL;
    },

    initEvent:function () {
        var self = this;

        var $_check =  this.$_oStruck.find('.ex-layout-carlist-query');

        this.$_oOpenBtn.bind('click', function () {
            //$struckList.fadeIn(500);
            //self._oParent.fire("MapView:Struct.show");
            self.$_oStruck.css({ "width": "220px"});
            //self.$_oStruck.animate({"left": "220px", "opacity": "1"}, 300);
            self.$_oCloseBtn.show();
            $(this).hide();

            self._oParent.openTree();
            //treeList("click");
        });

        //车辆列表父选框隐藏事件
        this.$_oCloseBtn.bind('click', function () {
            //$struckList.fadeOut(500);
            //self._oParent.fire("MapView:Struct.hide");
            self.$_oStruck.css({"width": "0"});
            //self.$_oStruck.animate({"left": "0", "opacity": "1"}, 300);
            self.$_oOpenBtn.show();
            $(this).hide();
            self._oParent.closeTree();
            //self._oParent._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() - 260});
        });

        this.$_oCloseBtn.click();
    },
    initVehLst: function (oData) {
        this.anDeptId = oData.Data;
        var self = this;
        this.initData(1, function (oData) {
            var aoGps =  self.toRectModle(oData);
            self.$_oTitle.find('span').text(oData.records+' 辆')
            self.vehHandler(aoGps);

            self.initPager(oData);
        });
    },


    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '       <a href="javascript:;" class="ex-icon-turn on" ><i class="ec-icon-arrow-circle-left"></i></a>' +
    '       <a href="javascript:;" class="ex-icon-turn off" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group"  style="width:100%; float:left">' +
    '               <input type="text" class="ec-form-field" placeholder="请输入车牌号或设备号">' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs" type="button"><span class="ec-icon-search"></span> </button>' +
    '               </span>' +
    '           </div> ' +
    '           <div class="clearfix"></div>' +
    '       </div>' +
    '       <div class="ex-layout-carlist-content"></div>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-page">' +
    '       <ul class="ec-pagination ec-pagination-center">' +
    '           <li class="ec-disabled"><a href="javascript:;">&laquo;</a></li>' +
    '           <li class="ec-active"><a href="javascript:;">1</a></li>' +
    '           <li><a href="javascript:;">2</a></li>' +
    '           <li><a href="javascript:;">3</a></li>' +
    '           <li><a href="javascript:;">4</a></li>' +
    '           <li><a href="javascript:;">5</a></li>' +
    '           <li><a href="javascript:;">&raquo;</a></li>' +
    '       </ul>' +
    '   </div>' +
    '</div>',


});

ES.MapView.BaseTabPanel.RectVehLst.include({

    cItemHtml:
    '<li class="slideup in" style="display: list-item;">' +
    '   <div class="carlist-card">' +
    '       <i class="{cCls}"></i>' +
    '       <div class="carlist-title">' +
    '           <h2 class="num">{vehNo}</h2>' +
    '           <p class="time">{gpsDate}</p>' +
    '       </div>' +
    '       <div class="">' +//
    '           <em class="ec-icon-star" style="float: right;"></em>' +
    //'           <em class="ec-icon-star"></em>' +
    //'           <em class="ec-icon-star"></em>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '   <div class="carlist-bottom">' +
    '       <div class="carlist-btn">' +//ec-btn-secondary
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">跟踪</a>'+ '' +
    '       </div>' +
    '       <div class="carlist-btn">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">轨迹</a>' +
    '       </div>' +
    '       <div class="carlist-btn">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">详情</a>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '</li>',

});