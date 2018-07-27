/**
 * 渣土车  地图实时监控js
 * Created by liulin on 2017/9/18.
 */

//程序启动
$(function () {

    var nMapHeight = $(window).height();
    var nMapWidth = $(window).width() - 260;

    ES.MapView.oConfig = {

        // 资产树
        deptTree: {
            plugins: [  'types', 'search', 'unique',"checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Enterprise/Tree?bindveh=1'
                }
            },

            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            },
        },

        lineTree: {
            plugins: [  'types', 'search', 'unique',"checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Line/Tree'
                }
            },
            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            },
        },


        siteTree:{
            plugins: [  'types', 'search', 'unique',"checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Site/WorkTree'
                }
            },
            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            },
        },
        unloadTree:{
            plugins: [  'types', 'search', 'unique',"checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Unload/Tree?bindcount=1'
                }
            },
            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            },
        },
        SuspicSiteTree:{
            plugins: [  'types', 'search', 'unique',"checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/MapView/SuspicTree?type=1&?bindveh=1'
                }
            },
            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            },
        },
        SuspicUnloadTree:{
            plugins: [  'types', 'search', 'unique',"checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/MapView/SuspicTree?type=2&?bindveh=1'
                }
            },
            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            },
        },
        //围栏树
        FenceTree:{
            plugins: [  'types', 'search', 'unique',"checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/CloudMap/CloudMapTree?cloudtype=3'
                }
            },
            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            },
        },


        // 部门查车
        lineVehLstUrl:'/MapView/QueryVehicle',

        // 线路查查
        getLineVeh:'/MapView/GetLineVeh',

        // 车辆列表url
        vehLstUrl:'/MapView/QueryVehicle',
        // 获得车辆实时位置
        curPosUrl : '/MapView/GetLocByDeviceNo',
        // 添加关注
        followVehUrl:'/MapView/FollowVeh',
        // 取消关注
        unfollowVehUrl:'/MapView/UnfollowVeh',
        // 获得关注列表
        getFollowVeh:'/MapView/GetFollowVeh',

        getVehsLoc:'/MapView/GetVehsLoc',

        // 没有分组获取车辆信息
        getVehsDetailLoc:'/MapView/GetVehsDetailLoc',

        getFollowVehIds:'/MapView/GetFollowVehIds',

        getAlarmDetailPaing:'/MapView/AlarmTop5',

        // 获得地图线路数据
        getLineByIds:'/Line/GetLineByIds',

        mapAreaLocal:'/MapView/mapAreaLocal',

        //工地/消纳点查车
        QueryNormalVeh:'/MapView/QueryNormalVeh',
        //可疑工地/可疑消纳点查询
        QuerySuspicVeh:'/MapView/QuerySuspicVeh',
        //告警车辆
        AlarmVehLstUrl:'/MapView/QueryAlarmlVeh',
        //拉框搜索
        RectVehLstUrl:'/MapView/QueryRegionalVeh',
        //围栏查经过车辆
        FenceVehLstUrl:'/Reports/KeyAreaFenceMonitorList',


        dLng: 115.868897,
        dLat: 28.702860,

        nPagerBtnCnt:7,

        // 最大分页数
        nMaxPageSize:10,

        oSiteConfig: {
            stroke: true,
            color: '#0FFF05',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false

        },
        oSuspicSiteConfig: {
            stroke: true,
            color: 'orange',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false

        },
        oLiveCircleConfig:{
            stroke: true,
            color: '#FF3300',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 1,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false
        },
        oLiveCircleMarkerConfig: {
            fill: true,
            fillColor: '#fff',
            radius: 3,
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        },

        // 监控最大车辆数
        nMonitorCnt:1,

        //顶棚
        carMask:15,

        // 顶灯
        carLight:1,

        // 载重
        echartsWeight:12,

        // 系统名称
        systemFlag:'truck',
    };

    // 页面通信参数
    var oPage = new ES.MapView.Page('MapView', {});

    // 菜单
    var oMenu = new ES.MapView.Menu(oPage, MapViewAuth);

    // 容器内容布局
    var oLayoutContent = new ES.MapView.LayoutContent(oPage, { nWidth: nMapWidth-220, nHeight: nMapHeight });
    oLayoutContent.setWidth($(window).width() - 440 - 40-80);


    // 地图布局
    var oMapLayout = new L.MapLib.MapControl.Layout(oPage, { cDidId: 'MapView' });

    oMapLayout.addToolItem({cHTML:'<div class="ex-right-switch hidden"></div><div class="ex-right-switch open" style="display: none;"></div>'});

    oPage.rightEvent();


    // 初始化地图控件
    var oMapMaster = new L.MapLib.MapMaster.Map(oPage, {
        cDidId: 'MapView',
        oMapOption: {
            zoomControl: false,
            layers: [],
            center: new L.LatLng(30.522639, 114.239960),
            zoom: 11,
            attributionControl:false,

        },
        //瓦片参数
        oTileOption: {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map &copy;GB-20263—2018 <a href="http://www.exsun.cn">武汉依迅Exsun</a>'
        },
        nMapWidth: nMapWidth,
        nMapHeight: nMapHeight
    });

    // 加载地图
    oMapMaster.loadMapMaster();

    L.control.attribution({prefix:''}).addTo(oMapMaster.getMap());

    // 监听 改变 左边结构的宽度 的事件
    oPage.on('MapView:LayoutContent.resize', function (oData) {
        // 更改地图的 宽度
        //oMapMaster.reflesh(oData.nWidth);
        oLayoutContent.reflesh($(window).width() - 440 - 40-80, $(window).height());
        refleshMap(oData.nWidth);
    });

    oPage.on('MapView:Menu.resize', function (oData) {
        // 更改地图的 宽度
        //var nWidth = $(window).width() - $('.ex-layout-sider:visible').width() -oData.nWidth;
        //oLayoutContent.setWidth(nWidth);
        //oMapLayout.setWidth(nWidth);
        //oMapMaster.reflesh(nWidth);
    });

    // 区域中心点
    // new L.MapLib.MapControl.ESMapToolArea(oMapMaster, {
    //     acParentDivClass: [
    //         'ex-layout-maptool',
    //         'ex-theme-maptool',
    //         'ex-map-top',
    //         'ex-map-right'
    //     ],
    //     cUrl: ES.MapView.oConfig.mapAreaLocal,
    //     nZoom:11,
    //     oUIConfig: {
    //         div: {
    //             'class': 'ex-maptool-box ex-control-dropmenu',
    //             i: {'class': 'ec-icon-map-marker'},
    //             html: '&nbsp;&nbsp;区域：',
    //             span: {html: '武汉市'},
    //             i11: {'class': 'ec-icon-angle-down'},
    //             ul: {
    //                 'class': 'ec-avg-sm-2 ec-dropdown-content',
    //             }
    //         }
    //     }});

    // 工具条
    new L.MapLib.MapControl.ESMapToolBox(oMapMaster, {
            acParentDivClass: [
                'ex-layout-maptool',
                'ex-theme-maptool',
                'ex-map-top',
                'ex-map-right'
            ]});
    // 地图瓦片
    new L.MapLib.MapControl.ESMapTile(oMapMaster, {
        acParentDivClass: [
            'ex-layout-maptool',
            'ex-theme-maptool',
            'ex-map-top',
            'ex-map-right'
        ]
    });

    // 全屏显示
    new L.MapLib.MapControl.ESMapFull(oMapMaster, { });

    new ES.MapView.LiveMange(oPage,{});

    new ES.MapView.VehClusterMange(oPage,{});

    // ES.getData({},ES.MapView.oConfig.getVehsLoc, function (oData) {
    //     for(var i = 0;i<oData.length;i++){
    //         var newLayer = new ES.MapView.VehClusterLayer(oPage, {maxItem:oData[i].items.length,areaName:oData[i].name});
    //         newLayer.drawLayers({aoData: oData[i].items});
    //     }
    //
    // }, this);


    new ES.HubSvr(oPage,{
        //cHubUrl:'http://signalr.bss.comlbs.com/signalr',
        //cHubUrl:'http://192.168.1.236:20000/signalr',
        cHubUrl:'http://signalr.hgt.comlbs.com/signalr',
        // Gps 推送
        aoClientName:[
            {cSvrFn:'handlerGps',on:'HubSvr:setGpsInfo'},
            {cSvrFn:'handlerAlarm',on:'HubSvr:setSingleAlarmInfo'}]
    });

    //工地layer
    new ES.MapView.SiteLayer(oPage,{});
    //消纳点layer
    new ES.MapView.UnloadLayer(oPage,{});
    //可疑工地layer
    new ES.MapView.SuspicSiteLayer(oPage,{});
    //可疑消纳点layer
    new ES.MapView.SuspicUnloadLayer(oPage,{});
    //拉框layer
    new ES.MapView.RectLayer(oPage,{});
    //围栏layer
    new ES.MapView.FenceLayer(oPage,{});

    new ES.MapView.FrameTab(oPage,MapViewAuth);

    new L.MapLib.MapControl.ESMapSearch(oMapMaster,{});

    new ES.MapView.RefreshLoc(oPage,{});
    //统计弹框
    //new ES.MapView.VehicleMonitor(oPage,{});//车辆统计数据
    //new ES.MapView.SiteMonitor(oPage,{});//工地统计数据
    //new ES.MapView.UnloadMonitor(oPage,{});//消纳点统计数据

    //new ES.MapView.SuspicSiteMonitor(oPage,{});//可疑工地统计数据
    //new ES.MapView.SuspicUnloadMonitor(oPage,{});//可疑消纳点统计数据

    new ES.MapView.TypeExample(oPage,{})//地图图例

    // 界面改变是 出发的事件
    $(window).resize(function () {
        var nHeight = $(window).height();
        //var nWidth = oMenu.getWidth();
        var nWidth = $(window).width() - 440 - 40-80;
        if($('.ex-layout-menu').hasClass('ex-hidden')||$('.ex-layout-menu').hasClass('ex-hidden-sm')){
            var nMapWidth = $(window).width();
        }else{
            var nMapWidth = $(window).width()- $('.ex-layout-sider:visible').width() -40;
        }

        refleshMap(nMapWidth, nHeight);

        oLayoutContent.reflesh(nWidth, nHeight);
        // 广播消息
        //oPage.fire('window:resize');
    });


    function refleshMap(nW, nH) {
        if (!oMapMaster._oMap) {
            return;
        }
        var oContainer = oMapMaster._oMap.getContainer();
        if (nW) {
            oContainer.style.width = nW + 'px';
        }
        if (nH) {
            oContainer.style.height = nH + 'px';
        }

        //oMapMaster._oMap._onResize();
        oMapMaster._oMap.invalidateSize({animate:true,pan:false,debounceMoveend:false});
        //setTimeout(function(){oMapMaster._oMap.invalidateSize({animate:true,pan:false,debounceMoveend:false});},200);

    };
});