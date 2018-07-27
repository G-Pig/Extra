/**
 * Created by liulin on 2017/6/1.
 */


ES.CloudMap.DrawLineTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画线路</p></li>',

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

            // 开启
            self.oPen.handler.enable();
            self._oMap.once('draw:created', self.createdCallBack, self);

        });
    },

    // 画点
    initPen: function () {
        this.oPen = {
            enabled: {},
            handler: new L.Draw.Polyline(this._oMap, {}),
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

    //initMapEvent: function () {
    //
    //    var self = this;
    //
    //    //this._oMap.on('draw:created', this.createdCallBack, this);
    //},




    createdCallBack:function(e){
        var oLayer = e.layer;

        this._oParent.addLayer(oLayer);

        var aoLatLng = oLayer.getLatLngs();

        var aoTemp = aoLatLng.map(function (oItem) {

            return {lat: oItem.lat, lng: oItem.lng}
        });

        var oInfo = {
            aoLatLng: aoTemp,
            oOption: {},
        };

        var oPos = this._oMap.latLngToLayerPoint(aoTemp[0]);

        this._oParent.fire('CloudMap:PopWnd.show', {oInfo: oInfo, oPos: oPos});
    }


});
