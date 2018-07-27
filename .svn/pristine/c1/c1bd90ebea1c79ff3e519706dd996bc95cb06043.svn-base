/**
 * Created by liulin on 2017/2/5.
 *
 * 安装组织架构来加载车辆列表,显示车辆列表，车辆地图显示
 * 没有列表都不相同，自己处理自己的业务数据
 * 如：组织架构列表
 * 如：告警查询列表
 *
 */

ES.MapView.BaseTabPanel.BaseLst = ES.Evented.extend({
    // 查询面板控件
    oOption: {
        // 车辆url
        cUrl: '',


        // 当前关注车辆信息
        cAttentUrl: '',

        // 面板的最上级容器，不是车辆容器
        cDivContainerSel: '#classContainer',

        // 车辆容器
        cLstContainerSel: '.ex-layout-carlist-content',

        // 查询框容器
        cSearchInputSel: 'input.ec-form-field',

        // 查询btn容器
        cSearchBtnSel: 'button.ec-btn-secondary',

        // 打开查询列表的宽度 ，车辆列表宽度 + 树宽度
        //nOpenWidth: 440,

        // 车辆 列表的 宽度
        nWidth:220,

        cCheckEventName:'MapView:DeptTreeView.getDeptId',
        cUncheckEventName:'MapView:UnDeptTreeView.getDeptId',
    },

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
        this.anDeptId = null;

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

    initUI: function () {
        // 当前对象集合
        this.$_oStruck = $(this.cHtml);
        this.$_oContainer.append(this.$_oStruck);
        // 车辆容器
        this.$_oLstContainer = this.$_oStruck.find(this.oOption.cLstContainerSel);
        this.oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.oSearchBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);

        this.$_oOpenBtn = this.$_oStruck.find('a.ex-icon-turn.on');
        this.$_oCloseBtn = this.$_oStruck.find('a.ex-icon-turn.off');

        this.$_oTitle = this.$_oStruck.find('h4');
        this.$_oTitle.html(this.oOption.cTitle+'<span style="margin-left: 2em;"></span>');

        this.initSearchEvent();

        var self =this;

        if(this._oParent.cFlag == "attend"){
            //第一次按照 用户 的权限加载数据
            this.initData(1,function(oData){
                var aoGps = self.toModle(oData);

                self.$_oTitle.find('span').text(oData.records+' 辆')

                self.vehHandler(aoGps);

                self.initPager(oData);
            });
        }


        // 绑定tab 关闭打开按钮事件
        this.initEvent();
    },

    // 数据转化,
    toModle: function (oData) {
        var aoGps = [];
        if (!oData || !oData.obj.content || !oData.obj || oData.obj.content.length <= 0) {
            return aoGps;
        }
        for (var i = 0; i < oData.obj.content.length; i++) {

            var vehNo = oData.obj.content[i].devNO;
            if (oData.obj.content[i].car) {
                vehNo = oData.obj.content[i].car.plateNum;
            }
            var oModel = {
                vehNo: vehNo,
                devNo: oData.obj.content[i].devNo,
                latLng: oData.obj.content[i].devState.mapLatLng,
                gpsDate: ES.Util.dateFormat(ES.Util.toDate('20' + oData.obj.content[i].devState.gpsStamp, 'yyyyMMddhhmmss').getTime(), 'yyyy-MM-dd hh:mm:ss'),
                direction: parseInt(oData.obj.content[i].devState.direction),
                poi: oData.obj.content[i].devState.poi,
                speed: oData.obj.content[i].devState.speed,
                status: oData.obj.content[i].devState.status,
                currentState: oData.obj.content[i].devState.currentState,
                mile: oData.obj.content[i].devState.status.mileage,
                gpsTime: ES.Util.toDate('20' + oData.obj.content[i].devState.gpsStamp, 'yyyyMMddhhmmss').getTime(),

            };

            aoGps.push(oModel);
        }

        return aoGps;
    },

    getPanel: function () {
        return this.$_oStruck
    },

    /*
    *  加载数据
    * @nPage 加载数据时的页数
    * @fnCall 加载数据的回调函数
    * @return 返回 null
    * */
    initData: function (nPage,fnCall) {

        // 添加 遮罩层
        ES.Util.loadAn(this.$_oLstContainer);
        var oTemp = {"VehicleNo": this.oSearchInput.val()};

        if(this.anDeptId) {
            ES.extend(oTemp, {anDeptId: this.anDeptId});
        }


        var oParam = {
            'exparameters':oTemp,
            '_search': false,
            'nd': (new Date()).getTime(),
            'rows':ES.MapView.oConfig.nMaxPageSize,
            'page': nPage,
            'sidx': '',
            'sord': 'asc'
        };
        // 分页请求数据
        ES.getData(
            JSON.stringify(oParam),
            this.oOption.cUrl,
            fnCall,
            this);

    },

    // 绑定tab 关闭打开按钮事件
    initEvent: function () {
        var self = this;

        this.$_oOpenBtn.bind('click', function () {
            //$struckList.fadeIn(500);
            //self._oParent.fire("MapView:Struct.show");
            self.$_oStruck.css({ "opacity": "1"});
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
            self.$_oStruck.css({"opacity": "1"});
            //self.$_oStruck.animate({"left": "0", "opacity": "1"}, 300);
            self.$_oOpenBtn.show();
            $(this).hide();
            self._oParent.closeTree();
            //self._oParent._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() - 260});
        });
    },

    // 获得外层容器的宽度
    getWidth: function () {
        if (this.$_oStruck.offset().left <= 80) {
            return 0;
        }
        return this.$_oStruck.width();
    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {
            self.initData(1,function(oData){
                var aoGps = self.toModle(oData);
                self.$_oTitle.find('span').text(oData.records+' 辆')
                self.vehHandler(aoGps);
                self.initPager(oData);
            });
        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {

                self.initData(1, function (oData) {
                    var aoGps =  self.toModle(oData)
                    self.$_oTitle.find('span').text(oData.records+' 辆');
                    self.vehHandler(aoGps);
                    self.initPager(oData);
                });

            }, 500);
        });
    },

    show: function () {
        this.$_oStruck.show();
    },

    hide: function () {
        this.$_oStruck.hide();
    },

    // 初始化界面
    initOn: function () {
        // 翻页执行
        this._oParent.on('MapView:VehLst.onPagerSearch', this.pagerSearch, this);

        this._oParent.on('MapView:VehLst.initVehLst', this.initVehLst, this);

        if (this.oOption.cCheckEventName) {
            this._oPage.on(this.oOption.cCheckEventName, this.initVehLst, this);
        }

        //cUncheckEventName
        if (this.oOption.cUncheckEventName) {
            this._oPage.on(this.oOption.cUncheckEventName, this.initVehLst, this);
        }

        if(this._oParent.cFlag=="attend"){
            this._oPage.on("MapView:VehLst.refreshConcern", this.initVehLst, this);
        }
    },

    initVehLst: function (oData) {
        this.anDeptId = !oData.acId?this.anDeptId:oData.acId;
        var self = this;
        this.initData(1, function (oData) {
            var aoGps =  self.toModle(oData);
            self.$_oTitle.find('span').text(oData.records+' 辆')
            self.vehHandler(aoGps);

            self.initPager(oData);
        });
    },

    pagerSearch: function (oData) {
        if (!oData || !oData.oSearchParam || !oData.oSearchParam.PageIndex) {
            return;
        }
        var self = this;
        this.initData(oData.oSearchParam.PageIndex, function (oData) {
          var aoGps =  self.toModle(oData)
            self.vehHandler(aoGps);
        });
    },
});

// 初始化界面
ES.MapView.BaseTabPanel.BaseLst.include({

    // 初始化车辆列表数据
    vehHandler: function (oData) {
        // 移除遮罩层
        ES.Util.removeAn(this.$_oLstContainer);

        if(!oData){
            return ;
        }
        // 生存车辆列表
        var $_oUL = this.initVehItems(oData.dataList);
        if(!$_oUL) {
            return;
        }

        // 对所有车辆列表位置查询,并绘制车辆到地图图层
        this.initVehLocal($_oUL);
        this.vehItemEvent($_oUL);
        this.initVehByAnimate($_oUL);
        this.initAttendEvent();
        this.initAttend();
    },

    // 加载车辆实时位置信息
    initVehLocal: function ($_oUL) {

        var $_aoLi = $_oUL.find("li");
        if (!$_aoLi || $_aoLi.length <= 0) {
            return;
        }
        var oAlarmData = [];
        for (var i = 0; i < $_aoLi.length; i++) {
            var oData = $($_aoLi[i]).data('data');
            if (!oData) {
                continue;
            }
            oAlarmData.push(oData.devNo);
        }

        // 获得车辆实时位置信息
        ES.getData({devNos : oAlarmData}, ES.MapView.oConfig.curPosUrl, this.curPosHandler, this);
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

    // 初始化所有车辆列表
    initVehItems:function(aoDataList) {
        var $_oUL = $("<ul></ul>");
        if (!aoDataList || aoDataList.length <= 0) {
            this.initVehByAnimate($_oUL);
            return;
        }
        for (var i = 0; i < aoDataList.length; i++) {

            var cHtml =ES.Util.template(this.cItemHtml, aoDataList[i]);
            var oLi = $(cHtml);
            oLi.data('data', aoDataList[i]);

            $_oUL.append(oLi);
        }
        return $_oUL;
    },

    // 给每一项绑定事件,给每一项绑定 定位，点击li 定位位置信息
    vehItemEvent: function ($_oUL) {

        var self = this;

        $_oUL.find("li").each(function () {

            $(this).find("a").eq(0).bind("click", $(this), function (e) {
                var oGpsInfo = e.data.data('data');
                //ec-btn-secondary //ec-btn-default
                if ($(this).hasClass('ec-btn-secondary')) {
                    $(this).removeClass('ec-btn-secondary').addClass('ec-btn-default');
                    $(this).removeClass('track');
                    self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});
                    self._oPage.fire("MapView:LiveMange.removeAll");
                }
                else {
                    $_oUL.find('a.track').click();

                    self._oPage.fire('MapView:LiveMange.addLivePos', {oGpsInfo: oGpsInfo});

                    // 加历史轨迹界
                    self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});

                    $(this).addClass('track');
                    $(this).removeClass('ec-btn-default').addClass('ec-btn-secondary')
                }
            });

            $(this).find("a").eq(1).bind("click", $(this), function (e) {
                var oGpsInfo = e.data.data('data');
                window.open("/MapView/TrackView?PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);
            });

            $(this).find("a").eq(2).bind("click", $(this), function (e) {
                e.stopPropagation();
                var oGpsInfo = e.data.data('data');
                // 画当前点到界面
                self._oPage.fire("MapView:VehDetail.showDetail", {oGpsInfo: oGpsInfo});
                // 取消订阅
                self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});
                // 移除跟踪列表
                self._oPage.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});

                // 取消其他设备订阅
                self._oPage.fire('HubSvr.unSubAlarm');
                //订阅车辆告警
                self._oPage.fire('HubSvr.subAlarm', {aoGpsInfo: oGpsInfo});
            });
        });

        // 实现定位人，并展示人的数据
        $_oUL.find("li").bind('click', function () {

            var oGpsInfo = $(this).data("data");
            $(this).siblings().removeClass('ec-active');
            $(this).addClass('ec-active');

            self._oPage.fire('MapView:LiveMange.addLivePos', {oGpsInfo: oGpsInfo});

            // 如果详情界面显示，则进行跟踪
            if ($('#MapShowDetail').css('bottom') === '0px') {

                // 取消其他设备订阅
                self._oPage.fire('HubSvr.unSubAlarm');

                //订阅车辆告警
                self._oPage.fire('HubSvr.subAlarm', {aoGpsInfo: oGpsInfo});

                // 取消订阅
                self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});

                // 添加跟踪
                self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});
            }

            // 定位到当前车辆
            //self._oPage.fire('MapView:MapLive.setZoomIn',{oGpsInfo:oGpsInfo});
            self._oPage._oMap.flyTo(oGpsInfo.latLng, 16);

            self._oPage.fire("MapView:VehDetail.switchDetail", {oGpsInfo: oGpsInfo});

        });
    },

    // 获得项
    getVehItemConfig: function (oItem,nIndex) {

        oItem.cGpsDate = ES.Util.dateFormat((oItem.GpsTime ? oItem.GpsTime : 946684800) * 1000, 'yyyy-MM-dd hh:mm:ss');

        var oItemConfig = {
            div: [
                {
                    i: { class: 'icon-car-pin green', html: nIndex },
                    div: { class: 'carlist-title', h2: { html: oItem.VehicleNo }, p: { html: oItem.cGpsDate } },
                    //em: { class: 'carlist-fav ' , i: { class: 'ec-icon-star' } }
                },
                {
                    class: 'carlist-bottom',
                    div: {
                        class: 'carlist-btn',
                        a: [{ class: "ec-btn ec-btn-xs ec-round ec-btn-secondary ex-btn-moredetail", href: 'javascript:void(0)', html: '跟踪' },
                            { class: "ec-btn ec-btn-xs ec-round ec-btn-default", href: 'javascript:void(0)', html: '轨迹' },
                            { class: "ec-btn ec-btn-xs ec-round ec-btn-default", href: 'javascript:void(0)', html: '消息' }
                        ]
                    }
                }
            ]
        };

        return oItemConfig;
    },

    // 动画加载车辆列表
    initVehByAnimate: function ($_oUL) {

        var $_aoLi = this.$_oLstContainer.find("ul>li");
        if($_aoLi && $_aoLi.length>0)
        {
            this._oPage.fire("MapView:LiveMange.removeAll");
        }

        // 清除ul时要清除处理定位，实时跟踪
        this.$_oLstContainer.find("ul").remove();

        this.$_oLstContainer.append($_oUL);
        $_oUL.find('li').hide().each(function () {
            var $_oLI = $(this);
            var nIndex = $(this).index();
            setTimeout(function () {
                $_oLI.show().addClass('in')
            }, nIndex * 100);
        });

    },

    // 初始化分页
    initPager: function (oData) {
        // 初始化分页控件
        this._oParent.fire("MapView:Pager.reflashPager", { nTotalCnt: oData.TotalCount });
    },

    // 如果没有StruckBox，就隐藏btn
    hideBtn:function () {
        this.$_oOpenBtn.hide();
        this.$_oCloseBtn.hide();
    },

});

// 车辆列表 关注处理
ES.MapView.BaseTabPanel.BaseLst.include({

    // 初始关注列表
    initAttend: function () {
        var acVehNo = [];
        // 获得所有的车牌号
        this.$_oLstContainer.find('li').each(function () {
            var oData = $(this).data("data");
            if (!oData) {
                return true;
            }
            acVehNo.push(oData.id);
        });
        if (acVehNo.length <= 0) {
            return;
        }
        ES.getData({vehids: acVehNo}, ES.MapView.oConfig.getFollowVehIds, function (oData) {
            // 设置车辆列表颜色
            if (!oData || oData.length <= 0) {
                return;
            }

            for (var i = 0; i < oData.length; i++) {
                this.$_oLstContainer.find('li').each(function () {
                    var oVehInfo = $(this).data("data")
                    if (!oVehInfo || !oVehInfo.hasOwnProperty("id")) {
                        return true;
                    }
                    if (oVehInfo.id === oData[i]) {
                        $(this).find("em.ec-icon-star").parent().addClass("carlist-fav");
                        return false;
                    }
                });
            }
        }, this);
    },

    // 注册关注事件
    initAttendEvent: function () {
        var self = this;
        // 注册关注事件
        this.$_oLstContainer.find(".ec-icon-star").parent().bind("click", function () {
            var oItem = $(this).parent().parent().data("data")
            if (!oItem) return;

            if ($(this).hasClass("carlist-fav")) {
                self.delAttend($(this), oItem);
            }
            else {
                // 添加关注
                self.addAttend($(this), oItem);
            }
        });
    },

    // 取消车辆关注
    delAttend: function ($_oEm, oItem) {
        if (!$_oEm) {
            return;
        }
        var self = this;
        //var self = this;
        // 车辆已经关注，取消关注
        var oTemp = {
            content: "确认要取消车辆[" + oItem.vehNo + "]关注吗？",
            okValue: '确定',
            ok: function () {
                // 取消车辆
                ES.getData({vehid: oItem.id}, ES.MapView.oConfig.unfollowVehUrl, function (oData) {
                    if (!oData || !oData.IsSuccess) {
                        // 取消关注车辆失败
                        return;
                    }
                    $_oEm.removeClass("carlist-fav");
                    self._oPage.fire("MapView:VehLst.refreshConcern");
                    self._oPage.fire("deptTree:layer",{});
                }, this);
            },
            cancelValue: '取消',
            cancel: null
        }
        var oWnd = this.initConfirmWnd(oTemp);

        oWnd.showModal();

    },

    //添加关注
    addAttend: function ($_oEm, oItem) {
        if (!$_oEm) return;
        var self = this;
        ES.getData({vehid: oItem.id,vehno:oItem.vehNo}, ES.MapView.oConfig.followVehUrl, function (oData) {
            if (!oData || !oData.IsSuccess) {
                // 关注车辆失败
                return;
            }
            $_oEm.addClass("carlist-fav");
            self._oPage.fire("MapView:VehLst.refreshConcern");


        }, this)
    },

    // 弹出层的设置
    initConfirmWnd: function (oOption) {

        var oTemp = {
            title: "提示",
            content: "是否删除数据",
            okValue: '确定',
            ok: null,
            cancelValue: '取消',
            cancel: null
        }

        ES.Util.extend(oTemp, oOption);

        var oWnd = dialog(oTemp);

        return oWnd;
    },
});

// html数据
ES.MapView.BaseTabPanel.BaseLst.include({
    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '       <a href="javascript:;" class="ex-icon-turn on" ><i class="ec-icon-arrow-circle-left"></i></a>' +
    '       <a href="javascript:;" class="ex-icon-turn off" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field" placeholder="请输入车牌号或设备号">' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs" type="button"><span class="ec-icon-search"></span> </button>' +
    '               </span>' +
    '           </div>' +
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