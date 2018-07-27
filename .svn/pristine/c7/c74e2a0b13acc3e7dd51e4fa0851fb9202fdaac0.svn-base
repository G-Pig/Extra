/**
 * 在地图上绘制消纳场,需要基础site/sitelayer对象
 * Created by liulin on 2018/5/20.
 */

ES.Muck.UnloadLayer  = ES.Muck.SiteLayer.extend({
    oOption: {

        oStyleConfig: {
            stroke: true,
            color: 'red',
            dashArray: '5, 5',
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 0.6,
            fill: true,
            fillColor: 'red',
            fillOpacity: 0.1,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

        oStyleSmallConfig: {

            stroke: true,
            color: 'green',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

    },

    //初始化工地数据
    initUI:function(){
        ES.Util.reqData({data:{ }, url: '/Unload/UnloadInfoForTrack'}, function (oData) {
            this.drawLayers({aoData: oData.rtnData});
        }, this);
    },
});