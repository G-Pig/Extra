/**
 *
 * 渣土车系统 处置证管理
 *
 * Created by YangHang on 2017/9/4.
 */


$(function () {

    var nMapHeight = $(window).height();
    var nMapWidth = $(window).width();

    // 页面通信参数
    var oPage = new ES.CloudMap.Page('MapView', {});

    // 容器内容布局
    var oLayoutContent = new ES.CloudMap.LayoutContent(oPage, {nWidth: nMapWidth, nHeight: nMapHeight});

    // 地图布局
    var oMapLayout = new L.MapLib.MapControl.Layout(oPage, {
        cDidId: 'MapView',
    });
    oMapLayout.addToolItem({cHTML: '<div class = "ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left tree-layout-map"> </div>'})

    // 初始化地图控件
    var oMapMaster = new L.MapLib.MapMaster.Map(oPage, {
        cDidId: 'MapView',
        oMapOption: {
            zoomControl: false,
            layers: [],
            center: new L.LatLng(30.592115, 114.305191),
            zoom: 10
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


    this.oPenal = new ES.CloudMap.Panel(oPage,
        {
            cTitle:'正式处置证办理',
            eTitle:'正式处置证编辑',
            cTempTitle:'临时处置证办理',
            eTempTitle:'临时处置证编辑',
            nHeight: nMapHeight - 230,
        },{});



    $(window).resize(function () {
        var nHeight = $(window).height();
        var nWidth = $(window).width();
        oMapMaster.reflesh(nWidth, nHeight);
        //oLayoutContent.reflesh(nWidth, nHeight);
        // 广播消息
        oPage.fire('window:resize');
    });
});