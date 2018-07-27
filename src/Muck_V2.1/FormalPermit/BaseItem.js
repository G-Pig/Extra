/**
 * Created by YangHang on 2017/12/4
 */

// 基础菜单
ES.CloudMap.BaseItem = ES.Evented.extend({

    oOption: {
        $_oPContainer:'.ex-permit-step',
        oTreeOption:{}
    },

    cHtml:
    '<div class="ex-permit-step-item">' +
    '   <fieldset class="ex-box-title ec-margin-0">' +
    '       <legend align="center">绘制地图信息</legend>' +
    '   </fieldset>' +
    '   <div class="ec-form-group ec-cf">' +
    '<label class="ec-u-sm-3 ec-form-label ec-padding-0 ec-text-left"><span class="ec-text-danger">(*)</span> 工地：</label>' +
    '       <div class="ec-u-sm-9 ec-padding-left-0 ec-input-group">' +
    '           <input type="text" name="form-email" id="SelectSite" placeholder="请选择工地" class="ec-form-field ec-radius ec-input-sm">' +
    // '           <span class="ec-input-group-btn">' +
    // '               <button class="ec-btn ec-btn-default ec-btn-sm" type="button" style="width: 75px;">画工地</button>' +
    // '           </span>' +
    '</div></div></div>',

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this._oPage = oParent._oParent;

        this._oMap = this._oPage.getMap();
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);

        this.$_oLi = null;
        this.oPen = null;


        this.initUI();


    },

    getDrawLayer:function() {
        return this._oDrawLayer;
    },

    getLayer: function () {
        return this._oDrawLayer.getLayers();
    },
    initPen: function () {
        this.oPen = {
            enabled: {},
            handler: new L.Draw.Polygon(this._oMap, {}),
            title: ''
        }
    },


    initOn: function () {
        this._oParent.on('CloudMap:BaseMenu.addActive',this.addActive,this);
        this._oParent.on('CloudMap:BaseMenu.removeActive',this.removeActive,this);
        this._oParent.on('CloudMap:BaseMenu.hidePenal',this.hidePenal,this);
        this._oParent.on('CloudMap:BaseMenu.endMenu',this.endMenu,this);
    },

    initUI:function(){

        this.$_oLi = $(this.cHtml);
        $(this.oOption.$_oPContainer).append( this.$_oLi);

        var self = this;

        this.$_oLi.find('button').bind('click', function () {


        });

    },

    defaultClick: function () {
        this.$_oLi.find('button').click();
    },

    hidePenal: function () {

    },

    clearLayers: function () {
        this._oDrawLayer.clearLayers();
    },

    addLayer: function (oLayer) {
        oLayer.addTo( this._oDrawLayer);
    },

    getMenu: function () {
        return this.$_oLi;
    },

    addActive: function () {
        this.$_oLi.find('button').removeClass('ec-btn-default').addClass('ec-btn-warning');
    },

    removeActive: function () {
        this.$_oLi.find('button').removeClass('ec-btn-warning').addClass('ec-btn-default');
    },

    getActive: function () {
        if (this.$_oLi.find('button').hasClass('ec-btn-warning')) {
            return true;
        }
        return false;
    },
    // 绑定事件
    bandClick: function () {


    },
    // 编辑数据oData:oNode.node.data,
    GridEditTool: function (oVal) {

        this.clearLayers();

        if (!oVal ) {
            return ;
        }

        oVal.MapJson={};
        oVal.MapJson.aoLatLng=[];
        oVal.MapJson.nType = 0;
        oVal.MapJson.oOption = null;
        var _lat = oVal.data.MapY.split(",");
        var _lng = oVal.data.MapX.split(",");
        for (var i=0;i<_lat.length;i++){
            var _aoLatLng = {};
            _aoLatLng.lat = parseFloat(_lat[i]);
            _aoLatLng.lng = parseFloat(_lng[i]);
            oVal.MapJson.aoLatLng.push(_aoLatLng);
        }
        oVal.MapJson = JSON.stringify(oVal.MapJson)
        var oVehLine = this.createLayer(oVal);
        oVehLine.bindTooltip(oVal.text).openTooltip();

        // 编辑围栏数据,画围栏时要表明自己的名称
        //var oVehLine = L.marker(oVal.oNode.data,{});
        //oVehLine.edited = true;

        this.fitBound();

        var oData = {
            oLatLng: oVal.data,
            cId: oVal.data.Id,
            cName: oVal.text,
            cParentId:oVal.parent,
            cParentText :oVal.parentText,
        };
        oVehLine.cId = oVal.data.Id;
        oVehLine.oBusData = oData;

        //this._oParent.addEditToUI();
    },
    //编辑重新加载
    drawHislayer:function(oVal){
        if (!oVal ) {
            return ;
        }

        oVal.MapJson={};
        oVal.MapJson.aoLatLng=[];
        oVal.MapJson.nType = 0;
        oVal.MapJson.oOption = null;
        var _lat = oVal.MapY.split(",");
        var _lng = oVal.MapX.split(",");
        for (var i=0;i<_lat.length;i++){
            var _aoLatLng = {};
            _aoLatLng.lat = parseFloat(_lat[i]);
            _aoLatLng.lng = parseFloat(_lng[i]);
            oVal.MapJson.aoLatLng.push(_aoLatLng);
        }
        oVal.MapJson = JSON.stringify(oVal.MapJson)
        this.createLayer(oVal);
    },
    // 多边形定位到地图中间
    fitBound: function () {
        if (!this._oDrawLayer) {
            return;
        }
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData || !oData.MapJson) return oVehLine;

        var oTemp = null;

        try {
            oTemp = JSON.parse(oData.MapJson);
            oTemp.oOption = this.oPenStyle;
        } catch (e) {
            oTemp = null;
        }
        if (!oTemp) {
            return oVehLine;
        }
        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        this.oCenter = this._oDrawLayer.getBounds().getCenter();

        //switch (oData.MapType) {
        //    case 1:
        //        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 2:
        //        // 计算2个点的距离，在来画圆
        //        var dDis = L.latLng(oTemp.aoLatLng[0]).distanceTo(L.latLng(oTemp.aoLatLng[1]))
        //        oVehLine = L.circle(oTemp.aoLatLng[0], dDis, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 3:
        //        oVehLine = L.rectangle(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 4:
        //        oVehLine = L.polyline(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 5:
        //        oVehLine = L.marker(oTemp.aoLatLng[0], oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    default :
        //        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //}
        return oVehLine;
    },
});
