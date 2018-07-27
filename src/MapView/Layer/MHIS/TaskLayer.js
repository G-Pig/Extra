/**
 * Created by Administrator on 2017/6/17.
 */

ES.MapView.TaskLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {

        oStyleConfig: {
            stroke: true,
            color: '#0FFF05',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 8,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false
        },

        cHtml:
        '<div class="ex-monitor-mapicon-pin  {Icon} ">' +
        '   <i></i>' +
        '   <div class="pin-tip">' +
        '       <div class="pin-dome"></div>' +
        '       <div class="pin-number">{DisTypeName}</div>' +
        '   </div>' +
        '</div>'
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {

        // 病害图层
        this._oDiseGroup = L.featureGroup();
        this._oMap.addLayer(this._oDiseGroup);

        // 轨迹图层
        this._oTrackGroup = L.featureGroup();
        this._oMap.addLayer(this._oTrackGroup);

    },

    //初始化时加载数据
    _loadOn: function () {

        //给界面赋值，并画工地
        this._oParent.on('MapView:ShowTaskLayer.DrawLayers', this.drawSites, this);

        // 清除工地
        this._oParent.on('MapView:ShowTaskLayer.removeLayers', this.clearSites, this);

        this._oParent.on('AssetLayer:clearAll', this.clearAll, this);
    },

    clearAll: function () {
        // 清空数据
        this._oDiseGroup.clearLayers();
        this._oTrackGroup.clearLayers();
    },

    createLine:function(aoTrack) {
        var oVehLine = null;
        if (!aoTrack) {
            return oVehLine;
        }

        var aoLatLng = [];
        for (var i = 0; i < aoTrack.length; i++) {

            aoLatLng.push(L.latLng(aoTrack[i].Lat, aoTrack[i].Lon));
        }

        oVehLine = L.polyline(aoLatLng, this.oOption.oStyleConfig).addTo(this._oTrackGroup);
        if (aoLatLng && aoLatLng.length >= 0) {
            this._oMap.fitBounds(aoLatLng);
        }

        oVehLine.bindPopup("弹出线路详情");

        //oVehLine.setText(oData.MaintainName + ':' + oData.name + '        ', {
        //    repeat: true,
        //    offset: 20,
        //    attributes: {'font-size': '16', fill: 'red'}
        //});

        return oVehLine;
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawSites: function (oData) {
        this.clearAll();

        if (!oData) {
            return;
        }

        this.createLine(oData.lstTrack);

        for (var i = 0; i < oData.lstDise.length; i++) {

            this._drawMarker(oData.lstDise[i]);
        }

    },

    // 画单个点
    _drawMarker: function (oPosInfo) {

        if (!this._oDiseGroup || !oPosInfo) return;

        var oLayer = this.findLayer(this._oDiseGroup, oPosInfo.Id);
        if (oLayer) {
            return oLayer;
        }

        var oIcon = this._getIcon( ES.Util.template(this.oOption.cHtml, oPosInfo));

        var oMarker = L.marker([oPosInfo.Lat,oPosInfo.Lon], { icon: oIcon });

        oMarker.cId = oPosInfo.Id;

        oMarker.oPosInfo = oPosInfo;

        oMarker.addTo(this._oDiseGroup);

        this.initEventForMarker(oMarker);

        return oMarker;
    },


    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {

            ES.Util.reqData({
                    url: this.oPosInfo.MapPopUrl,
                    data: {id: this.oPosInfo.Id},
                    dataType: 'html',

                },
                function (oData) {
                    this.bindPopup(oData.rtnData);
                    var oPopup = this.getPopup();
                    oPopup.id = this.cId;
                    oPopup.on('contentupdate', function () {
                        $('li[band-id=' + this.id + ']').unbind('click');
                        $('li[band-id=' + this.id + ']').bind('click', function () {
                            var aa = 0;
                            // 创建弹出层
                            var oD = new ES.MapView.PopAssetInfo(self, {
                                cId: $(this).attr('band-id'),
                                cUrl: $(this).attr('band-url'),
                                cTypeName: $(this).attr('band-type')
                            });

                            oD.showModal();

                        });
                    });

                    this.openPopup();
                },
                this);

        }, oMarker);

    },


    // 画点
    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: "",
            html: cHtml,
        });
        return oIcon;
    },

    // 获得弹出层的内容
    _getPopHtml: function (oPosInfo) {

        return '';
    },

    // 清空界面所有的工地数据
    clearSites: function (oData) {
        //this.oInfo = null;

        //this.clearMarkerSite(oData);
        //this.deleteSite(oData);
    },

    // 删除对象
    deleteSite: function (oData) {
        if (!this.aoSiteInfo || !oData || !oData.anId || oData.anId.length <= 0) return;
        var aoSiteInfo = this.aoSiteInfo
        var anId = oData.anId;
        for (var i = aoSiteInfo.length - 1; i >= 0; i--) {

            var aoTemp = $.grep(anId, function (k, nIndex) {
                if (aoSiteInfo[i].Id === parseInt(k)) {
                    return true;
                }
            })
            if (!aoTemp || aoTemp.length <= 0) continue;

            aoSiteInfo.splice(i, 1);
        }
    },

    addSiteData: function (oData) {
        //测试结果
        if (!this.aoSiteInfo) {
            this.aoSiteInfo = oData.aoSiteInfo;
            return;
        }

        $.merge(this.aoSiteInfo, oData.aoSiteInfo);

    },



    clearMarkerSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oAssetGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oAssetGroup.removeLayer(oLayer.oMarker);
            }
            this._oAssetGroup.removeLayer(oLayer);
        };


    },

    // 删除所有的数据
    clearAllPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
        }
    },


});