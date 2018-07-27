/**
 *
 * 渣土车系统 线路管理
 *
 * Created by liulin on 2017/9/4.
 */


$(function () {

    var nMapHeight = $(window).height();
    var nMapWidth = $(window).width()-220;

    // 页面通信参数
    var oPage = new ES.CloudMap.Page('MapView', {})

    // 容器内容布局
    //var oLayoutContent = new ES.CloudMap.LayoutContent(oPage, {nWidth: nMapWidth, nHeight: nMapHeight});

    // 地图布局
    var oMapLayout = new L.MapLib.MapControl.Layout(oPage, {
        cDidId: 'MapView',
        cHTML: '<div  class="ex-layout-map-content">' +
        '       <div class="ex-layout-type-wbox ex-map-bottom"></div>' +
        '       <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left  ec-padding-0">   </div>' +
        '       <div class="ex-layout-maptool ex-theme-maptool ex-map-top"></div>' +
        '       <div class="ex-layout-monitor-wbox">  </div>' +
        ' </div>'
    });



    // 初始化地图控件
    var oMapMaster = new L.MapLib.MapMaster.Map(oPage, {
        cDidId: 'MapView',
        oMapOption: {
            zoomControl: false,
            layers: [],
            center: new L.LatLng(30.335250, 112.241821),
            zoom: 12
        },
        //瓦片参数
        oTileOption: {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map &copy;GB-20263—2018 <a target="_blank" href="#">武汉依迅</a> '
        },
        nMapWidth: nMapWidth,
        nMapHeight: nMapHeight
    });

    // 加载地图
    oMapMaster.loadMapMaster();

    new L.MapLib.MapControl.ESMapToolBox(oMapMaster, {
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-right"],

    });
    new L.MapLib.MapControl.ESMapTile(oMapMaster, {
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-right"],

    });
    new L.MapLib.MapControl.ESMapSearch(oMapMaster, {
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-right'],
        cUrl: ''
    });

    var oMenuTool = new ES.CloudMap.MenuTool(oPage, {});

    var oLineItem = new ES.CloudMap.LineMenu(oPage, {
        nTreePanelHeight: nMapHeight - 300,
        nTreePanelWidth:280,
        oTreePanelUrl: {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Line/Tree',
                    type: 'GET',
                }
            },
            plugins: [ 'types', 'search', 'state', 'unique']
        },
        oTreePopUrl:{
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Department/DistrictTree',
                    type: 'GET',
                }
            },
            plugins: [ 'types', 'search', 'state', 'unique']
        }
    });

    // 添加第一项
    oMenuTool.appendMenu(oLineItem);
    // 第一项默认画
    oLineItem.defaultClick();

    $(window).resize(function () {
        var nHeight = $(window).height();
        var nWidth = $(window).width()-220;
        oMapMaster.reflesh(nWidth, nHeight);
        //oLayoutContent.reflesh(nWidth, nHeight);
        // 广播消息
        oPage.fire('window:resize');
    });
});