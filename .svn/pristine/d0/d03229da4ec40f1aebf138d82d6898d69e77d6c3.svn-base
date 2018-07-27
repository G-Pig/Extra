/**
 * 编辑 站场的信息
 * Created by Administrator on 2017/8/2.
 */


ES.CloudMap.EditSiteTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>编 辑</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);
        this._oDrawLayer =oParent.getDrawLayer();
        this.oPen = null;

        this.initPen();

    },


    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
            self._oParent.addSaveACalToUI();

        });
    },

    //  画点
    initPen: function () {
        this.oPen = {
            enabled: this.oPenStyle,
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

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        this._oParent.on('CloudMap:EditTool.calEdit',this.calEdit,this);
        this._oParent.on('CloudMap:EditTool.edit',this.edit,this);
        this._oParent.on('CloudMap:EditTool.SaveEdit',this.saveEdit,this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {
            if(!self._oParent.getActive()){
                return
            }
            var oMap = this;
            var aoLayer = e.layers;

            aoLayer.eachLayer(function (oLayer) {

                var aoLatLng = oLayer.getLatLngs()[0].map(function (oItem) {
                    return {lat:oItem.lat,lng:oItem.lng};
                });


                var oInfo = {
                    aoLatLng: aoLatLng,
                    oOption: {},
                };

                self._oDrawLayer.addLayer(oLayer);

                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(aoLatLng[0]);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oBusData:oLayer.oBusData
                });
            });
        });
    },

    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();

    },

    // 取消编辑
    calEdit: function () {
        this.oPen.handler.revertLayers();
        this.oPen.handler.disable();
    },

    // 编辑数据
    edit: function (oVal) {

        this._oParent.clearLayers();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        var oVehLine = this.createLayer(oVal.oNode.data);

        if(!oVehLine){
            return;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        //var oVehLine = L.marker(oVal.oNode.data,{});
        oVehLine.edited = true;

        this.fitBound();

        var oData = {
            oLatLng: oVal.oNode.data,
            cId: oVal.oNode.id,
            cName: oVal.oNode.text,
            cParentId:oVal.oNode.parent,
            cParentText :oVal.oNode.parentText,
        }
        oVehLine.cId = oVal.oNode.id;
        oVehLine.oBusData = oData;
        oVehLine.addTo(this._oDrawLayer);

        this._oParent.addEditToUI();
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
        if (!oData || !oData.Json) return oVehLine;

        var oTemp = null;

        try {
            oTemp = JSON.parse(oData.Json);
            oTemp.oOption = this.oPenStyle;
        } catch (e) {
            oTemp = null;
        }
        if (!oTemp) {
            return oVehLine;
        }
        oVehLine = L.polyline(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);


        return oVehLine;
    },

});

