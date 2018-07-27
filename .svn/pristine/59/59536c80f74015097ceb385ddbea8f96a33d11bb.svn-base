
/**
 * 资产图层的处理方式
 *
 * Created by Administrator on 2017/5/7 0007.
 */



ES.MapView.AssetLineLayer = ES.MapView.AssetPosLayer.extend({


    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawSites: function (oData) {


        if (!oData) {
            return;
        }
        for (var i = 0; i < oData.lst.length; i++) {
            oData.lst[i].icon = oData.icon.replace('icon-tree','');
            oData.lst[i].MapPopUrl = oData.MapPopUrl;
            this._drawMarker(oData.lst[i]);
        }

        if (oData.lst && oData.lst.length === 1) {
            oLayer = this.findLayer(this._oAssetGroup, oData.lst[0].Id);
            if (oLayer) {
                var aoLatLnt = oLayer.getLatLngs();

                if (aoLatLnt && aoLatLnt.length > 0) {
                    this._oMap.fitBounds(aoLatLnt);
                }
                //this.flyTo({oGpsInfo: {Lat: oLatLng.lat, Lon: oLatLng.lng}}, {zoom: 15});
            }
        }
    },

    // 画单个点
    _drawMarker: function (oPosInfo) {

        if (!this._oAssetGroup || !oPosInfo) return;

        var oLayer = this.findLayer(this._oAssetGroup, oPosInfo.Id);
        if (oLayer) {
            return oLayer;
        }

        var oLine = L.polyline(oPosInfo.lstLatLng, {});

        oLine.cId = oPosInfo.Id;
        oLine.oPosInfo = oPosInfo;

        var oIcon = this._getIcon( ES.Util.template(this.oOption.cHtml, oPosInfo));

        oLine.addTo(this._oAssetGroup);

        var oMarker = L.marker(oPosInfo.lstLatLng[0], { icon: oIcon });
        oMarker.addTo(this._oAssetGroup);
        oMarker.oPosInfo = oPosInfo;
        oLine.oMarker = oMarker;
        this.initEventForMarker(oLine.oMarker);
        return oLine;
    },

});