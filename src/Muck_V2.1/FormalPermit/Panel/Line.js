/**
 * Created by YangHang on 2017/12/4
 */

// 基础菜单
ES.CloudMap.Line = ES.CloudMap.BaseItem.extend({
    cHtml:
    '<div class="ex-permit-step-item">'+
    '   <div class="ex-permit-step-line">'+
    '       <a href="javascript:void(0)" class="ex-btn-plus"><i class="ec-icon-plus-circle"></i></a>' +
    '       <div class="ex-point-title"><p>途经点路线</p>'+
    '           <ul class="ec-avg-sm-1">'+
    '           </ul>' +
    '       </div>'+
    '       <a href="javascript:void(0)" class="ec-btn ec-btn-sm ec-btn-primary ec-btn-block Line">生成线路</a>'+
    '       <a href="javascript:void(0)" class="ec-btn ec-btn-sm ec-btn-warning ec-btn-block EditPoint" style="display:none">重新编辑地图点</a>'+
    '       <a href="javascript:void(0)" class="ec-btn ec-btn-sm ec-btn-primary ec-btn-block Edit" style="display:none">编辑地图信息</a>'+
    '   </div>'+
    '</div>',
    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseItem.prototype.initialize.call(this,oParent, options);

        this.aoPopWnd =[];

        //线路group
        this.PointGroup = [];
        this.PointPanel =[];

        //保存数组
        this.oLineParam={};
        this.oParam ={
            Name: null,
            GpsX: null,
            GpsY: null,
            MapX: null,
            MapY: null,
            Order:null,
        };
        this.pointIndex = 0;
        this.initGroup();
        this.initPen();
        this.initEditPen();
        this.bandClick();
        this.initOn();
        //历史绘制
        this.hisDraw();
    },


});

//画点连线操作
ES.CloudMap.Line.include({
    //历史绘制
    hisDraw:function(){
        if(this._oParent.oOption.Edit == 'true'){
            var HisData = this._oParent.oOption.HisData;
            //添加点  保存并且生成线路
            for(var i = 0;i<HisData.Points.length;i++){
                var content = new ES.CloudMap.LinePoint(this._oParent,{
                    acParentDivClass:['ex-permit-step-line >div.ex-point-title>ul'],
                    PanelIndex:this.pointIndex
                });
                content.localPos(HisData.Points[i]);
                this.pointIndex++;
                content.saveEdit();
                this.PointPanel.push(content);
            }
            this.hisCreatedCallBack({MapX:HisData.MapX,MapY:HisData.MapY},HisData.Points);

            //保存线路
            this.saveEdit();

            //按钮更改
            this.$_oLi.find('.Line').hide().siblings('a.Edit').show();
           // this.cover();
        }
    },
    // 点击callback
    bandClick: function () {
        ES.CloudMap.BaseItem.prototype.bandClick.call(this );
        this.$_oLi.find('.Line').attr('disabled','disabled');
        var self =this;
        this.$_oLi.find('.ex-btn-plus').bind('click', function () {
            var content = new ES.CloudMap.LinePoint(self._oParent,{
                acParentDivClass:['ex-permit-step-line>div.ex-point-title>ul'],
                PanelIndex:self.pointIndex,
            });
            self.PointPanel.push(content);
            self.pointIndex++;

        });
        this.$_oLi.find('.Line').bind('click', function () {
            self.editIndex = 0;
            for(var i=0;i<self.PointPanel.length;i++){
                self.PointPanel[i].saveEdit();
            }
            self.createdCallBack();
        });
        this.$_oLi.find('.Edit').bind('click', function () {

            self.oEditPen.handler.enable();
            self.HisMarkerUnMove(self._oParent.oOption.HisData.Points);
            self.$_oLi.find('.Edit').hide().siblings('.EditPoint').show();
        });
        this.$_oLi.find('.EditPoint').bind('click', function () {
            self._oPolylineGroup.clearLayers();

            for(var i = 0;i<self.PointPanel.length;i++){
                self.PointPanel[i].oEditMarkerPen.handler.enable();
            }
            self.$_oLi.find('.EditPoint').hide().siblings('.Line').show();
            self.$_oLi.find('.Line').removeAttr('disabled');
            self.removeCover();
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
    initGroup: function () {

        this._oPolylineGroup = L.featureGroup();

        this._oMap.addLayer(this._oPolylineGroup);

    },

    calDraw:function(){
        if(this.oPen){
            this.oPen.handler.disable();
        }

    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseItem.prototype.initOn.call(this);
        this._oParent.on('CloudMap:BaseItem.addLineGroup',this.addLineGroup,this);
        this._oParent.on('CloudMap:BaseItem.delLineGroup',this.delLineGroup,this);
        var self = this;
        this._oMap.on('draw:edited', function (e) {
            var aoLayer = e.layers;
            aoLayer.eachLayer(function (oLayer) {
                if(oLayer._latlngs == undefined){
                    if(self.PointPanel[self.editIndex].oInputData.name == oLayer.oData.name){
                        self.PointPanel[self.editIndex].oInputData.lat =oLayer._latlng.lat;
                        self.PointPanel[self.editIndex].oInputData.lng =oLayer._latlng.lng;
                        self.PointPanel[self.editIndex].oInputData.alt = 10086;
                    }
                }

                if(oLayer._latlng == undefined){
                    self._oParent.oLine.oLineParam.aoLatLng=oLayer._latlngs.concat()
                }
            });
            self.editIndex++;
        });
    },
    //遮照层，不许修改
    cover:function(){
        var _height = 0;
        var items = $(this.oOption.$_oPContainer).find('div.ex-permit-step-item');
        for(var i = 0;i<3;i++){
            _height+=items.eq(i).height();
        }
        var _cover = '<div class="ex-permit-step-cover" style="height:'+ (_height-10) +'px"></div>';
        $(this.oOption.$_oPContainer).append(_cover);
    },
    removeCover:function(){
        $(this.oOption.$_oPContainer).find('div.ex-permit-step-cover').remove();
    },
    createdCallBack: function () {
        var LineGroup = this.PointGroup.concat();

        LineGroup.unshift(this._oParent.oSite.oCenter);
        LineGroup.push(this._oParent.oUnload.oCenter);
        this.oLineParam.aoLatLng = LineGroup;
        //创建线图层 fill-opacity
        var oLineLayer = L.polyline(LineGroup, {
            opacity: 1,
            color: 'blue',
            weight: 2,
        });
        oLineLayer.addTo(this._oPolylineGroup);

        this.oEditPen.handler.enable();

        this.markerUnMove(LineGroup.length);

        this.$_oLi.find('.Line').hide().siblings('.EditPoint').show();
        this.cover();

    },
    hisCreatedCallBack:function(olayers,points){
        if(olayers.MapX == null){
            return ;
        }
        var Group = {};
        Group.MapX = olayers.MapX.substr(0, olayers.MapX.length - 1).split(',');
        Group.MapY = olayers.MapY.substr(0, olayers.MapY.length - 1).split(',');
        var LineGroup = [];
        for(var i=0;i<Group.MapX.length;i++){
            LineGroup.push({lng:Group.MapX[i],lat:Group.MapY[i]})
        }
        for(var j=0;j<points.length;j++){
            var index = points[j].Order;
            LineGroup[index].alt = 10086;
        }
        this.oLineParam.aoLatLng = LineGroup;
        var oLineLayer = L.polyline(LineGroup, {
            opacity: 1,
            color: 'blue',
            weight: 2,
        });
        oLineLayer.addTo(this._oPolylineGroup);
        this.oEditPen.handler.enable();

    },
    //  画点
    initEditPen: function () {
        this.oEditPen = {
            enabled: this.oPenStyle,
            handler: new L.EditToolbar.Edit(this._oMap, {
                featureGroup: this._oPolylineGroup,
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
    addLineGroup:function(oLayer){
        var LatLng={
            Name: oLayer.name,
            GpsX: oLayer.lng,
            GpsY: oLayer.lat,
            MapX: oLayer.lng,
            MapY: oLayer.lat,
            lng:oLayer.lng,
            lat:oLayer.lat,
            alt:10086
        };
        var addPoint = true;
        for(var i=0;i<this.PointGroup.length;i++) {
            if (this.PointGroup[i].Name === oLayer.name) {
                this.PointGroup[i].Name = oLayer.name;
                this.PointGroup[i].lng = oLayer.lng;
                this.PointGroup[i].lat = oLayer.lat;
                this.PointGroup[i].GpsX = oLayer.lng;
                this.PointGroup[i].GpsY = oLayer.lat;
                this.PointGroup[i].MapX = oLayer.lng;
                this.PointGroup[i].MapY = oLayer.lat;
                this.PointGroup[i].alt = 10086;
                addPoint = false;
            }
        }
        if(addPoint){
            this.PointGroup.push(LatLng);
        }
    },
    delLineGroup:function(n){
        this.PointPanel.splice(n.index,1);
        this.PointGroup.splice(n.index,1);
        this.pointIndex--;
    },
    markerUnMove:function(count){
        for(var i=0;i<count;i++){
            $('.leaflet-pane.leaflet-marker-pane').find('div').eq(i).hide();
        }
    },
    HisMarkerUnMove:function(oData){
        var points = $('.leaflet-pane.leaflet-marker-pane').find('div');
        for(var i=0;i<oData.length;i++){
            var index = oData[i].Order;
            points.eq(index).hide();
        }
        points.eq(0).hide();
        points.eq((points.length-1)/2).hide();
    },
    // 保存编辑
    saveEdit: function () {
        this.oEditPen.handler.save();
        this.oEditPen.handler.disable();

    },

    // 取消编辑
    calEdit: function () {
        this.oEditPen.handler.revertLayers();
        this.oEditPen.handler.disable();
    },
});




ES.CloudMap.LinePoint = L.MapLib.MapControl.ESMapSearch.extend({
    cHtml: '<li class="ec-form-group ec-cf">' +
    '<label class="ec-u-sm-4 ec-form-label ec-padding-0 ec-text-center"> 途径点：</label>' +
    '       <div class="ec-u-sm-8 ec-input-group ec-padding-left-0">' +
    '           <input type="text" name="form-email" class="ec-form-field ec-radius ec-input-sm">' +
    '           <ul class="ex-maptool-box-search-result">      </ul>' +
    '           <span class="ec-input-group-btn">' +
    '               <button class="ec-btn ec-btn-danger ec-btn-sm del" type="button"><i class="ec-icon-trash"></i></button>' +
    '           </span>' +
    '</div></li>',
    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        // 获得地图控件
        this._oParent = oParent;
        this._oMap = this._oParent._oParent._oMap;
        //图层
        this.oLayer = L.featureGroup();
        this.oInputData = null;
        this.oLayer.addTo(this._oMap);
        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));

        this.initUI();
        this.setParentEvent();
        this.initOn();
        // 注册事件
        this.initToolEvent();
        this.initEditMarkerPen();
    },
    //加载工具事件，初始化工具栏
    initUI: function () {
        this.$_oContainer = $(this.cHtml);
        this.$_oPContainer.eq(0).append(this.$_oContainer);

        this.$_oSearchRtn = this.$_oContainer.find('.ex-maptool-box-search-result');

        this.$_oSearchRtn.hide();

        // 查询项
        this.$_oUL = this.$_oContainer.find('ul.ex-maptool-box-search-result');

        // 清空
        this.$_oUL.empty();

        // 查询输入框
        this.$_oInput = this.$_oContainer.find('input');

        // 清空
        this.$_btnClear = this.$_oContainer.find('button.clear');

        // 查询
        this.$_btnSearch = this.$_oContainer.find('button.search');

        //删除
        this.$_btnDel =  this.$_oContainer.find('button.del');


    },
    initOn:function(){
        var self= this;


        this.$_btnDel.bind('click',function(){
            var index = $(this).parents('li').index()
            self.Del(index);
        })
    },
    // 设置父级容器的事件
    setParentEvent: function () {
        //屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);
    },
    // 查询处理
    searchPoiHandler: function (oData) {
        this.$_oUL.empty();
        this.$_oSearchRtn.hide();

        if (!oData || oData.status === 0 || oData.count <= 0) {
            return;
        }
        // 加载数据
        for (var i = 0; i < 5; i++) {
            if (oData.tips[i].lng === 0) {
                continue;
            }
            //oData.tips[i].cDist = oData.tips[i].district||'';
            var $_li = $(L.Util.template('<li class="location"><b>{name}</b></li>', oData.tips[i]));//<span>{cDist}</span>
            $_li.data('oData', oData.tips[i]);
            this.$_oUL.append($_li);


            $_li.bind('click',this, function (e) {
                e.data.localPos();
            });
            $_li.bind('mouseover', function () {
                $(this).addClass('ec-active');
            });
            $_li.bind('mouseout', function () {
                $(this).removeClass('ec-active');
            });
        }
        this.$_oSearchRtn.show();

    },
    // 定位 当前位置,
    localPos:function(localLayer) {
        this.oLayer.clearLayers();
        if(!localLayer){
            var $_oLI = this.$_oUL.find("li.ec-active");
            var oData = $_oLI.data('oData');
        }else{
            var oData = localLayer;
            oData.lat = oData.GpsY;
            oData.lng = oData.GpsX;
            oData.name = oData.Name;
        }
        var oMarker = L.marker([oData.lat, oData.lng,10086]);
        oMarker.oData = oData;
        // 创建点
        oMarker.addTo(this.oLayer);

        this._oMap.flyTo([oData.lat, oData.lng,10086], 12);
        // 给文本框赋值
        this.$_oInput.val(oData.name);

        this.oInputData = oData;
        this.oInputData.PanelIndex = this.oOption.PanelIndex;
        this.$_oUL.empty();
        this.$_oSearchRtn.hide();

        this.oEditMarkerPen.handler.enable();
    },
    // 保存编辑
    saveEdit: function () {
        this.oEditMarkerPen.handler.save();
        this.oEditMarkerPen.handler.disable();
        this._oParent.fire("CloudMap:BaseItem.addLineGroup",this.oInputData );
    },

    // 取消编辑
    calEdit: function () {
        this.oEditMarkerPen.handler.revertLayers();
        this.oEditMarkerPen.handler.disable();
    },
    initEditMarkerPen:function(){
        this.oEditMarkerPen = {
            enabled: this.oPenStyle,
            handler: new L.EditToolbar.Edit(this._oMap, {
                featureGroup: this.oLayer,
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
    //删除操作
    Del:function(n){
        this.oLayer.clearLayers();
        this.$_oContainer.remove();
        this._oParent.fire("CloudMap:BaseItem.delLineGroup",{index:n});
    },

});