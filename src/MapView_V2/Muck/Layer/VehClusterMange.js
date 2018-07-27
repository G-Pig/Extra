/**
 * 管理 车辆 集合数据，当地图乘积小于8时，显示区域集合图层
 * Created by liulin on 2018/4/25.
 */

ES.MapView.VehClusterMange = ES.Evented.extend({

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this._oMap = oParent.getMap();

        this.initOn();

        // 集合图层的数据
        this.aoGroup = null;
        // 车辆图层数据
        this.aoVehInfo = null;

        this.aoGroupLayer = [];

        this.oVehLayer = new ES.MapView.VehDetailClusterLayer(oParent, {});

        this.showVehInfo();
    },

    // 监听数据 做缩放管理
    initOn: function () {
        this._oMap.on('moveend', this.showVehInfo, this);
        this._oParent.on('VehClusterMange:refreshLoc',this.refreshLoc,this);

    },

    refreshLoc:function () {
        this.aoGroup = null;
        this.aoVehInfo = null;


        this.showVehInfo();
    },

    // 显示数据到集合中
    showVehInfo: function () {
        var nZoom = this._oMap.getZoom();
        if (nZoom < 12) {
            this.showGroup();
        }
        else {
            this.showDetail();
        }

    },

    // 显示分组图层数据
    showGroup: function () {
        this._oMap.removeLayer(this.oVehLayer.getLayer());
        if (this.aoGroup) {
            this.initGroup();

        } else {
            ES.loadAn($('#MapView'));
            this._oMap.off('moveend', this.showVehInfo, this);
            ES.getData({}, ES.MapView.oConfig.getVehsLoc, function (oData) {

                this.aoGroup = oData;
                for (var i = 0; i < oData.length; i++) {
                    var oLayer = new ES.MapView.VehClusterLayer(this._oParent, {
                        maxItem: oData[i].items.length,
                        areaName: oData[i].name
                    });
                    oLayer.drawLayers({aoData: oData[i].items});
                    this.aoGroupLayer.push(oLayer);
                }
                this.initGroup();
                ES.removeAn($('#MapView'));
                this._oMap.on('moveend', this.showVehInfo, this);
            }, this);
        }


    },

    initGroup: function () {
        for (var i = 0; i < this.aoGroupLayer.length; i++) {
            this._oMap.addLayer(this.aoGroupLayer[i].getLayer());
        }
    },

    showDetail: function () {

        for (var i = 0; i < this.aoGroupLayer.length; i++) {
            this._oMap.removeLayer(this.aoGroupLayer[i].getLayer());
        }

        if (this.aoVehInfo) {
            this.initVehInfo();
        } else {
            ES.loadAn($('#MapView'));
            this._oMap.off('moveend', this.showVehInfo, this);
            ES.getData({}, ES.MapView.oConfig.getVehsDetailLoc, function (oData) {

                this.aoVehInfo = oData;
                this.oVehLayer.drawLayers({aoData: oData});
                this.initVehInfo();

                ES.removeAn($('#MapView'));
                this._oMap.on('moveend', this.showVehInfo, this);
            }, this);
        }

    },

    initVehInfo: function () {

        this._oMap.addLayer(this.oVehLayer.getLayer());
    },

});