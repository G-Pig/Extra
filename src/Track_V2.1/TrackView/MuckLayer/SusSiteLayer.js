/**
 * 可疑工地 图层绘制
 * 2018-05-12 修改： 要做可以工地里绘制可以出土点，显示可以出土时间、可疑车辆
 * Created by liulin on 2018/4/16.
 */

ES.TrackView.SusSiteLayer  = ES.TrackView.SiteLayer.extend({
    //执行画点，画线操作
    oOption: {

        oStyleConfig: {

            stroke: true,
            color: 'orange',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: 'orange',
            fillOpacity: 0.1,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

        oStyleSmallConfig: {

            stroke: true,
            color: 'orange',
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
        this._oParent.on('TrackView.SusSiteLayer:DrawArea', this.drawLayers, this);
        this._oParent.on('TrackView.SusSiteLayer:ClearArea', this.clearLayer, this);

    },

    drawLayers: function (oData) {

        this._oPolylineGroup.clearLayers();

        var aoLatLng = this._oParent.getLatLngs();
        if (!aoLatLng) {
            return;
        }
        var oVehLine = L.polygon(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        var cHtml = ES.Util.template(this.cHtml, {Name: '可疑工地'});

        var oIcon = this._getIcon(cHtml);

        var oMarker = L.marker(oVehLine.getCenter(), {icon: oIcon});

        oMarker.addTo(this._oPolylineGroup);

        oVehLine.oMarker = oMarker;

        var oBound = this._oPolylineGroup.getBounds();

        if (!oBound.isValid()) {
            return;
        }
        this._oMap.fitBounds(oBound);
    },


    drawSusSite: function () {
        if (m_cLatLng === "" || !m_cLatLng) {
            return;
        }

        var acTemp = m_cLatLng.split(',');
        if(!acTemp ||acTemp.length!=2){
            return;
        }

        var oLatLng = L.latLng(acTemp[1],acTemp[0]);

        this.drawLayers({oLatLng:oLatLng});



    }

});