/**
 * Created by liulin on 2018/4/15.
 */

ES.TrackView.UnloadLayer = ES.TrackView.SiteLayer.extend({

    //执行画点，画线操作
    oOption: {

        oStyleConfig: {

            stroke: true,
            color: 'red',
            dashArray: null,
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
            color: 'red',
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


    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on('TrackView.UnloadLayer:DrawArea', this.drawLayers, this);
        this._oParent.on('TrackView.UnloadLayer:ClearArea', this.clearLayer, this);
        this._oParent.on('TrackView.UnloadLayer:RemoveArea', this.removeLayers, this);


    },
});