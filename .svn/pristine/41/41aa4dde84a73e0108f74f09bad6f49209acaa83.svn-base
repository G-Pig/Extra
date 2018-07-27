/**
 * 车辆明细图层，只显示10层以上的数据
 * Created by liulin on 2018/4/25.
 */

ES.MapView.VehDetailClusterLayer= ES.MapView.VehClusterLayer.extend({

    // 初始化Group
    _initGroup: function () {
        var self = this;
        // 使用计划来画图
        this._oPosGroup = L.markerClusterGroup({ });



    },

    getData: function () {

        ES.getData({},ES.MapView.oConfig.getVehsDetailLoc, function (oData) {
            this.drawLayers({aoData: oData});
        }, this);
    }

});
