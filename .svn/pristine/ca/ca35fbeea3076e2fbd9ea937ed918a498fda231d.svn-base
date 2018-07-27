/**
 *  负责画线路
 * Created by liulin on 2017/9/2.
 */

ES.CloudMap.DrawLineTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画线路</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

        this._oDrawLayer =oParent.getDrawLayer();

        this.initPen();

        this.initOn();

        this.initUI();

        this.oPop =  new  ES.Common.Dialog(this,{fnCallBack:this.enablePen,oContext:this},{width:400 ,title:'选择工地、消纳点'});

        // 负责画工地和消纳点图层
        this._oSiteUnloadLayer =  L.featureGroup();
        this._oSiteUnloadLayer.addTo(this._oMap);
    },

    // 点击callback
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this );

        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPop.showModal();
        });
    },

    // 画完之后在启动编辑
    enablePen: function (oData) {
        // 画工地
        var oSiteLayer = L.polygon(ES.Util.getLatLng(oData.oSite.MapY, oData.oSite.MapX), {}).addTo(this._oSiteUnloadLayer);
        var oUnloadLayer = L.polygon(ES.Util.getLatLng(oData.oUnload.MapY, oData.oUnload.MapX), {}).addTo(this._oSiteUnloadLayer);

        var oBLatLng = oSiteLayer.getCenter();
        var oELatLng = oUnloadLayer.getCenter();

        var oLineLayer = L.polyline([oBLatLng,oELatLng], {}).addTo(this._oDrawLayer);
        oLineLayer.oBusData = oData;
        this.oPen.handler.enable();
        this._oParent.addSaveACalToUI();
        //this._oMap.once('draw:created', this.createdCallBack, this);
    },
        

    // 画点
    initPen: function () {

        this.oPen = {
            enabled: {},
            handler: new L.EditToolbar.Edit(this._oMap, {
                featureGroup: this._oDrawLayer,
                selectedPathOptions: {
                    dashArray: '10, 10',
                    fill: true,
                    fillColor: '#fe57a1',
                    fillOpacity: 0.1,
                    maintainColor: false
                },
                poly: {allowIntersection: false}
            }),
            title: ''
        }
    },

    calDraw:function(){

        this._oSiteUnloadLayer.clearLayers();

        this.oPen.handler.revertLayers();
        this.oPen.handler.disable();

    },


    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        this._oParent.on('CloudMap:EditTool.calEdit',this.calDraw,this);
        //this._oParent.on('CloudMap:EditTool.edit',this.edit,this);
        this._oParent.on('CloudMap:EditTool.SaveEdit',this.saveEdit,this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {
            if(!self.getActive()){
                return
            }
            var oMap = this;
            var aoLayer = e.layers;
            for (var i in aoLayer._layers){
                var hasLayer = true;
            }
            if(!hasLayer){
                for(var j in self._oDrawLayer._layers){
                    var oLayer = self._oDrawLayer._layers[j];
                }
                var aoLatLng = oLayer.getLatLngs().map(function (oItem) {
                    return {lat:oItem.lat,lng:oItem.lng};
                });

                var oInfo = {
                    aoLatLng: aoLatLng,
                    oOption: {},
                };

                self._oDrawLayer.addLayer(oLayer);

                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(aoLatLng[aoLatLng.length-1]);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.show', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oSite:oLayer.oBusData.oSite,
                    oUnload:oLayer.oBusData.oUnload,
                    oLine:{}
                });

            }else{
                aoLayer.eachLayer(function (oLayer) {

                    var aoLatLng = oLayer.getLatLngs().map(function (oItem) {
                        return {lat:oItem.lat,lng:oItem.lng};
                    });

                    var oInfo = {
                        aoLatLng: aoLatLng,
                        oOption: {},
                    };

                    self._oDrawLayer.addLayer(oLayer);

                    // 弹出层显示的位置信息
                    var oPos = oMap.latLngToLayerPoint(aoLatLng[aoLatLng.length-1]);

                    // 告诉外面弹出层的位置
                    self._oParent.fire('CloudMap:PopWnd.show', {
                        oInfo: oInfo,
                        oPos: oPos,
                        oSite:oLayer.oBusData.oSite,
                        oUnload:oLayer.oBusData.oUnload,
                        oLine:{}
                    });
                });
            }
        });
    },

    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();

    },


    createdCallBack:function(e) {

        var oLayer = e.layer;

        this._oParent.addLayer(oLayer);

        var aoLatLng = oLayer.getLatLngs();

        var aoTemp = aoLatLng[0].map(function (oItem) {

            return {lat: oItem.lat, lng: oItem.lng}
        });

        var oInfo = {
            aoLatLng: aoTemp,
            oOption: {},
        };

        var oPos = this._oMap.latLngToLayerPoint(aoTemp[aoTemp.length - 1]);

        this._oParent.fire('CloudMap:PopWnd.show', {oInfo: oInfo, oPos: oPos});
    }


});
