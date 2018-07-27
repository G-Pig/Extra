/**
 * Created by Lenovo on 2017/12/13.
 */


// 要把画区域单独拿处理封装
    ES.MapBase.Region = ES.MapBase.extend({

    oOption: {
        oStyle: {
            "color": "#ff7800",
            "weight": 3,
            "opacity": .25
        },
    },

    initialize: function (oParent, oOption) {
        ES.MapBase.prototype.initialize.call(this, oParent, oOption);

        // 执行自己的方法
        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {

        //把所有的圆点区域绘制在分组图层中
        this._oRegionGroup = L.featureGroup();
        this._oMap.addLayer(this._oRegionGroup);

    },

    //初始化时加载数据
    _loadOn: function () {

        // 监听画工地，画多个工地
        //this._oParent.on("SiteMap:drawSites", this.drawSites, this);
        //给界面赋值
        this._oParent.on("MV:Site.drawRegion", this.drawRegion, this);

        this._oParent.on("MV:Site.clearRegion", this.clearRegion, this);

        this._oMap.on("Map:setRegionStyle", this.setRegionStyle, this);
    },


    drawRegion: function (oText) {
        this.oText = oText;
        this.clearRegion();

        var oData = null;
        if (oText.nType == 1) {
            this.getRegionByGaodeApi("武汉市", this.drawRegionHandler, this)
        } else if (oText.nType == 2) {
            var nIndex = oText.cText.indexOf("(");
            var cSubText = oText.cText.substring(0, nIndex);
            var cSubText = cSubText.trim();

            this.getRegionByGaodeApi(cSubText, this.drawRegionHandler, this);

        } else {
            var nIndex = oText.cText.indexOf("(");
            var cSubText = oText.cText.substring(0, nIndex);
            var cSubText = cSubText.trim();

            this.getRegionByGaodeApi(cSubText, this.drawRegionHandler, this);

        }
    },

    drawRegionHandler: function (oData) {
        var nIndex = 0;
        if (oData.cName == "青山区") {
            nIndex = 1;
        }

        //var aoAllTemp = [];
        var acTemp = oData.districts[nIndex].polyline.split('|');
        for (var j = 0; j < acTemp.length; j++) {

            var aoLatLng = [];
            var acPoly = acTemp[j].split(';');
            for (var k = 0; k < acPoly.length; k++) {
                var acLL = acPoly[k].split(',');
                var oLatLng = L.latLng(acLL[1], acLL[0])
                aoLatLng.push(oLatLng);
                //aoAllTemp.push(oLatLng)
            }
            var oLayer = L.polygon(aoLatLng, this.oOption.oStyle).addTo(this._oRegionGroup);
        }
        if (this.oText.nCurType != 3) {
            this._oMap.fitBounds(this._oRegionGroup.getBounds());
        }
    },

    getRegionByGaodeApi: function (cName, fnCallBack, oContext) {

        $.ajax({
            type: "GET",
            url: es.comStr.cGaodeApiUrl + cName,
            dataType: "json",
            //contentType: 'application/json',
            data: {},
            success: function (oData) {
                //执行数据,不能用实例方法，在这里this为$对象,合并参数
                oData.cName = cName;
                fnCallBack.call(oContext, oData);

            },
            error: function (e, f, g) {
                console.log('ES.AsynDataSvr.getData err!');
            },
        })
    },

    clearRegion: function () {
        if (!this._oRegionGroup) return;
        this._oRegionGroup.clearLayers();
    },

    setRegionStyle: function (oData) {
        if (oData.cText == "GeoQ灰色图") {
            this.oOption.oStyle = {
                "color": "#ff7800",
                "weight": 4,
                "opacity": .35,
                "fillOpacity": .15
            }
        }
        else {
            this.oOption.oStyle = {
                "color": "#199BE4",
                "weight": 4,
                "opacity": .35,
                "fillOpacity": .05

            };
        }

        //设置地图画图区域
        this._oRegionGroup.setStyle(this.oOption.oStyle);

    },
})
