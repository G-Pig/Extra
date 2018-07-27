/**
 * Created by liulin on 2017/6/1.
 */

ES.CloudMap.DrawMarkerTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画国(市)控点</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

        this.initPen();

        this.initOn();

        this.initUI();


    },

    // 点击callback
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this );

        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();

            self._oMap.once('draw:created', self.createdCallBack, self);

        });
    },

    // 画点
    initPen: function () {
        this.oPen = {
            enabled: {},
            handler: new L.Draw.Marker(this._oMap, {}),
            title: ''
        }
    },

    calDraw:function(){
        if(this.oPen){
            this.oPen.handler.disable();
        }

    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

    },


    createdCallBack: function (e) {

        var oLayer = e.layer;

        this._oParent.addLayer(oLayer);

        var oLatLng = oLayer.getLatLng();


        var oInfo = {
            aoLatLng: [{lat: oLatLng.lat, lng: oLatLng.lng}],
            oOption: {},
        };

        var oPos = this._oMap.latLngToLayerPoint(oLatLng);

        this._oParent.fire('CloudMap:PopWnd.show', {oInfo: oInfo, oPos: oPos});

    },
});
