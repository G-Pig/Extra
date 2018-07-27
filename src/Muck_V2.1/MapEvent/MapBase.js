/**
 * Created by YangHang on 2017/12/12.
 */
ES.MapBase = ES.Class.extend({

    //  基础参数
    oOption: {},

    /*
     功能描述：页面的构造函数
     @oParent：父亲级容器，可以监听全局事件的容器
     @oOption：外部参赛设置
     */
    initialize: function (oParent, oOption) {
        oOption = ES.setOptions(this, oOption);

        this._oParent = oParent;
        this._oMap = oParent.oMap._oMap;
    },

    /*
     功能描述：手动设置地图，如果用户不用默认地图对象时，需要手动设置地图，
     @oMap：设置的地图对象
     */
    setMap: function (oMap) {
        this._oMap = oMap;
    },

    /*
     功能描述：@虚拟点表明tip，
     @oTemp：参数对象
     @cId 点id：方便查询
     @bIsNotEdit：点是否不编辑，false为可编辑状态
     @cName：点显示的内容
     @oLatLng：点显示左边经纬度
     @lat：纬度
     @lng：经度
     @bNoHide：是否显示tip，ture不隐藏，false隐藏
     */
    _drawTip: function (oTemp) {
        var oOption = {
            cId: "1",
            //是否
            bIsNotEdit: true,
            cName: '测试tip',
            oLatLng: { lat: 30.333, lng: 113.333 },
            bNoHide: true,
        }

        ES.extend(oOption, oTemp);

        var oIcon = new L.DivIcon({
            html: "<div> </div>",
            className: '',
        });

        var oMarker = L.marker(oOption.oLatLng, { icon: oIcon, bIsNotEdit: oOption.bIsNotEdit });
        oMarker.cId = "TM_" + oOption.cId;

        //给oMarker绑定tip
        oMarker.bindLabel(oOption.cName, { noHide: oOption.bNoHide, direction: "auto" });

        return oMarker;
    },

    /*
     功能描述：在图层中查找对象，只返回第一找到的对象，原则上为对象id，一个图层对象唯一
     @oGroupLayer：查询的图层
     @cId：查找对象id
     */
    findLayer: function (oGroupLayer, cId) {
        if (!oGroupLayer || oGroupLayer.getLayers().length <= 0) return null;

        var aoLayer = oGroupLayer.getLayers();

        for (oLayer in aoLayer) {
            if (!aoLayer[oLayer]) continue;

            if (aoLayer[oLayer].cId == cId) {
                return aoLayer[oLayer];
            }
        }
        return null;
    },

    findLayers: function (oGroupLayer, cId) {
        if (!oGroupLayer || oGroupLayer.getLayers().length <= 0) return null;

        var aoLayer = oGroupLayer.getLayers();
        var aoTemp = [];
        for (oLayer in aoLayer) {
            if (!aoLayer[oLayer]) continue;

            if (aoLayer[oLayer].cId == cId) {
                aoTemp.push(aoLayer[oLayer]);
            }
        }
        return aoTemp;
    },
    //在地图范围内查找图层，可能查找到多个
    findLayerInMap: function (cId) {
        if (!this._oMap) return null;

        var oLayer = this._oMap._layers;

        if (!oLayer) return null;
        var aoLayer = [];
        for (cKey in oLayer) {
            //if (!oLayer[cKey].options) continue;

            if (oLayer[cKey].cId == cId) {
                aoLayer.push(oLayer[cKey]);
            }
        }
        return aoLayer;
    },
})
