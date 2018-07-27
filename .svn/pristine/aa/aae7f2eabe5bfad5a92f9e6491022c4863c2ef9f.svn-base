/**
 * 工地
 * Created by liulin on 2018/4/25.
 */

ES.TrackView.WorkSiteLayer = ES.TrackView.SiteLayer.extend({

    initialize: function (oParent, oOption) {
        ES.TrackView.SiteLayer.prototype.initialize.call(this, oParent, {});

        // 初始化界面
        this.initUI();

    },
    initUI:function() {

        var nSiteId = this._oParent.getSiteId();

        if (!nSiteId) {
            return
        }

        ES.Util.reqData({data: {anId: [-nSiteId]}, url: '/Site/GetSiteByIds'}, function (oData) {

            this.drawLayer(oData);

        }, this);

    },

    //初始化时加载数据
    _loadOn: function () {

    },

    drawLayer: function (oData, cTarget) {
        if (!oData || !oData.rtnData || oData.rtnData.length<=0) {
            return;
        }

        var oSite = oData.rtnData[0];
        // 编辑邮路,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oSite, cTarget);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oSite.Id;

        var cHtml = ES.Util.template(this.cHtml, oSite);

        var oIcon = this._getIcon(cHtml);

        var oMarker = L.marker(oVehLine.getCenter(), { icon: oIcon });

        oMarker.addTo(this._oPolylineGroup);
        oVehLine.oMarker = oMarker;
    },

    // 设置图层设置
    createLayer: function (oData, cTarget) {

        var oVehLine = this.findLayer(this._oPolylineGroup, oData.Id)

        if (oVehLine) {
            return oVehLine;
        }
        if (!oData  || !oData.Points) {
            return oVehLine;
        }

        oVehLine = L.polygon(oData.Points, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        return oVehLine;
    },

});