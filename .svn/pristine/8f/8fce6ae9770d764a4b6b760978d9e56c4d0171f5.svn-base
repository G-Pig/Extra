/**
 * Boss 项目 云图的入库
 *
 * Created by Administrator on 2017/8/4.
 */

$(function () {

    var nMapHeight = $(window).height();
    var nMapWidth = $(window).width();

    // 页面通信参数
    var oPage = new ES.CloudMap.Page('MapView', {})

    // 容器内容布局
    var oLayoutContent = new ES.CloudMap.LayoutContent(oPage, {cPContainer:'.gridManager',nWidth: nMapWidth, nHeight: nMapHeight-60});

    // 地图布局
    var oMapLayout = new ES.MapControl.Layout(oPage, {
        cDidId: 'MapView',
        cHTML: '<div  class="ex-layout-map-content">' +
        '       <div class="ex-layout-type-wbox ex-map-bottom"></div>' +
        '       <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left  ec-padding-0">   </div>' +
        '       <div class="ex-layout-maptool ex-theme-maptool ex-map-top"></div>' +
        '       <div class="ex-layout-monitor-wbox">  </div>' +
        ' </div>'
    });

    // 添加paneltree
    oMapLayout.addToolItem({cHTML: '<div class = "ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left tree-layout-map" style="margin-top:8rem"> </div>'})

    // 初始化地图控件
    var oMapMaster = new L.MapLib.MapMaster.Map(oPage, {
        cDidId: 'MapView',
        oMapOption: {
            zoomControl: false,
            layers: [],
            center: new L.LatLng(30.574529, 114.296265),
            zoom: 12
        },
        //瓦片参数
        oTileOption: {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map &copy;GB-20263—2018 <a target="_blank" href="#">武汉依迅</a> '
        },
        nMapWidth: nMapWidth,
        nMapHeight: nMapHeight-60
    });

    // 加载地图
    oMapMaster.loadMapMaster();

    new ES.MapControl.ESMapToolBox(oMapMaster, {
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-right"],

    });
    new ES.MapControl.ESMapTile(oMapMaster, {
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-right"],

    });
    new ES.MapControl.ESMapSearch(oMapMaster, {
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-right'],
        cUrl: ''
    });

    var oMenuTool = new ES.CloudMap.MenuTool(oPage, {});

    var oLineItem = new ES.CloudMap.GridMenu(oPage, {
        nTreePanelHeight: nMapHeight - 280,
        nTreePanelWidth:280,
        oTreePanelUrl: {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    'url': '/CloudMap/TreeDept?appid='+applicationId
                }
            },
            plugins: ['types', 'search', 'unique'],
        },
        oTreePopUrl:{
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    'url': '/ResourceType/GetAppResourceTypeTree?typeid=5&appid='+applicationId
                }

            },
            plugins: ['types', 'search', 'unique']
        }
    });

    // 添加第一项
    oMenuTool.appendMenu(oLineItem);


    $(window).resize(function () {
        var nHeight = $(window).height();
        var nWidth = $(window).width();
        oMapMaster.reflesh(nWidth, nHeight);
        oLayoutContent.reflesh(nWidth, nHeight);
        // 广播消息
        oPage.fire('window:resize');
    });
});