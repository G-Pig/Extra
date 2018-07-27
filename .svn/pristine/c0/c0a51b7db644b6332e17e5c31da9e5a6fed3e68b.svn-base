/**
 * Created by YangHang on 2017/12/18.
 */

ES.Muck.UnloadSupervision =ES.Page.extend({
    oOption:{
        SiteTreeUrl:'/Unload/Tree?bindcount=1',
    },
    initialize: function (cId, oOption, oGridOpt) {
        ES.setOptions(this, oOption);
        this.oGridOpt = oGridOpt;
        this.cId = cId;
        this.initUI();
        this.initOn();
        this.initEvent();
        this.resizeBody();
    },
    // 初始画界面对象
    initUI: function () {
        // 页面布局
        this.oLayout = new ES.Muck.Layout(this, {});

        var nMapHeight = $('#mapView').height();
        var nMapWidth = $('#mapView').width();

        // 左边树结构
        this.oSiteTree = new ES.Muck.UnloadTree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: this.oOption.SiteTreeUrl,
                    type: 'GET'
                }
            },
            plugins: ['types', 'search', 'unique']
        });
        // this.oVideoTree = new ES.Muck.VideoTree(this, {}, {
        //     core: {
        //         'animation': 0,
        //         'check_callback': true,
        //
        //         'state': {'opened': true},
        //         'data': {
        //             url: '/Site/CameraTree',
        //             type: 'GET'
        //         }
        //     },
        //     plugins: ['types', 'search', 'unique']
        // });

        this.oMap = new L.MapLib.MapMaster.Map(this, {
            cDidId: 'mapView',
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(30.592115, 114.305191),
                zoom: 10
            },
            oTileOption: {
                maxZoom: 18,
                minZoom: 3,
                attribution: 'Map &copy;GB-20263—2018 <a target="_blank" href="#">武汉依迅</a> '
            },
            nMapWidth: nMapWidth,
            nMapHeight: nMapHeight,
        });
        this.oMap.loadMapMaster();

        //卡口/可疑工地等图层勾选
        this.LayersPanel = new ES.CloudMap.LayersPanel(this, {
            item:[
                {Title:'卡口',PanelId:'Bayonet',check:'',cValue:5},
                {Title:'可疑消纳点',PanelId:'SuspiciousSite',check:'',cValue:18},
                //{Title:'国控点',PanelId:'StateCP',check:'',cValue:9}
            ],
        });
        //各种工地信息小面板
        this.SitesPanel = new ES.CloudMap.SitesPanel(this, {});
        // 在地图上画工地
        new ES.MapBase.Site(this, {
                site:8,//工地
                SuspSite:18,//可疑工地
                StateCp:9,//国控点
                Bayonet:5//卡口
        });
        // 在地图上画区域
        new ES.MapBase.Region(this, {});
        //地图图例
        new ES.CloudMap.TypeExample(this,{});
    },
    initOn:function(){
    },
    resizeBody: function () {
        $(window).resize(function () {
            $('.ex-layout-content').css("width", $(window).width() - $('.ex-layout-sider').width()+'px');
            $('.ex-layout-content').css({ height: $(window).height() });
        });
    },
    initEvent: function () {
        $('.ex-layout-content-map input[type="checkbox"],.ex-layout-content-map input[type="radio"]').uCheck();
    },
});
Array.prototype.filter = Array.prototype.filter || function(func) {
    var arr = this;
    var r = [];
    for (var i = 0; i < arr.length; i++) {
        if (func(arr[i],i,arr)) {
            r.push(arr[i]);
        }
    }
    return r;
};

