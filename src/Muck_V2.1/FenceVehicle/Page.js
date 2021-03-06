/**
 * 用户管理
 *
 * Created by liulin on 2017/9/1.
 */


ES.Muck.FenceVehicle=ES.Page.extend({

    initialize: function (cId, oOption, oGridOpt) {

        this.oGridOpt = oGridOpt;
        this.oOption = oOption;
        this.cId = cId;
        this.initUI();
        this.initEvent();

    },

    // 初始画界面对象
    initUI: function () {

        // 页面布局
        this.oLayout = new ES.Muck.Layout(this, {});

        // grid 查询
        this.oGrid = new ES.Muck.Grid(this, {}, this.oGridOpt);

        var nW = $('.ex-layout-content').width()/2 - 20;
        var nH = $('.ex-layout-content').height() - $('.ex-fence-vehicle-echart').height() - 60;
        var nMapWidth = $('.ex-layout-content').width() - nW -33;

        this.oGrid.initGrid({ width:nW,height: nH});

        // 查询 控件
        this.oSearch = new ES.Muck.Search(this, {});

        // 左边树结构
        this.oTree = new ES.Muck.Tree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/CloudMap/CloudMapTree?cloudtype=3',
                    type: 'POST'
                }
            },
            checkbox: {
                tie_selection: false,
            },

            plugins: [ 'types', 'search', 'unique']
        });

        this.echart = new ES.Muck.echart(this,{parentId:'FenceVehicle',Url:this.oOption.monitorUrl,monitorParam:this.oOption.monitorParam})

        // 初始化地图控件
        var oMapMaster = new L.MapLib.MapMaster.Map(this, {
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
            nMapHeight: nH + 60
        });

        // 加载地图
        oMapMaster.loadMapMaster();

        this.oLayer = new  ES.Muck.FenceLayer(this,{});
    },

    initEvent: function () {

    }
});

Date.prototype.Format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "H+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}


