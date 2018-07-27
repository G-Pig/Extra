/**
 * 工地监控
 *
 * Created by YangHang on 2017/12/11.
 */


ES.Muck.SiteSupervision=ES.Page.extend({
    oOption:{
        //SiteTreeUrl:'/Site/Tree?bindsite=1',
        SiteTreeUrl:'/Site/WorkTree',
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
        this.oSiteTree = new ES.Muck.SiteTree(this, {}, {
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
                {Title:'可疑工地',PanelId:'SuspiciousSite',check:'',cValue:18},
               // {Title:'国控点',PanelId:'StateCP',check:'',cValue:9}
            ],
        });

        //各种工地信息小面板
        this.SitesPanel = new ES.CloudMap.SitesPanel(this, {
            item:[
                {Title:'正常工地数目',IconClass:'class1',data:0,id:1},
                {Title:'可疑工地数目',IconClass:'class2',data:0,id:7}
            ]
        });
        // 在地图上画工地
        new ES.MapBase.Site(this, {});
        // 在地图上画区域
        new ES.MapBase.Region(this, {});
        //地图图例
        new ES.CloudMap.TypeExample(this,{});
    },
    initOn:function(){
        //this.oMap.on();
    },
    initEvent: function () {
        $("ul.ex-layout-struckbox-tab").on('click','a', function () {
            var _index = $(this).parent().index();
            $(this).addClass('ec-btn-primary ec-active').parent().siblings().children('a').removeClass('ec-btn-primary ec-active');
            $(".ex-layout-struckbox").children('li').eq(_index).show().siblings().hide();
            $(".ex-layout-content").eq(_index).show().siblings('.ex-layout-content').hide();
            if (_index == 1) { playView.init(); }
        });
        $('.ex-layout-content-map input[type="checkbox"],.ex-layout-content-map input[type="radio"]').uCheck();
    },
    resizeBody: function () {
        $(window).resize(function () {
            $('.ex-layout-content').css("width", $(window).width() - $('.ex-layout-sider').width()+'px'-550);
            $('.ex-layout-content').css({ height: $(window).height() });
        });
    },
});

//地图操作
ES.Muck.SiteSupervision.include({});

Array.prototype.filter = Array.prototype.filter || function(func) {
    var arr = this;
    var r = [];
    for (var i = 0; i < arr.length; i++) {
        if (func(arr[i], i, arr)) {
            r.push(arr[i]);
        }
    }
    return r;
}


