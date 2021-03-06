/**
 *
 */
/**
 * Created by YangHang on 2017/12/10.
 */

ES.PermitView = {};

ES.PermitView.Dialog = ES.Evented.extend({

    initialize: function (cId, oOption, oDOption) {

        //this.oGridOpt = oGridOpt;
        this.cId = cId;
        this.oOption = ES.setOptions(this, oOption);
        this.oDOption = {};

        this.initButton();

        this.initDialog();

        this.initEvent();

        this.initUI();
    },

    // 初始化 dialog
    initDialog: function () {

        var  oDOption={
            fixed: true,
            align: 'right bottom',
            title: '查看处置证详情',
            content:ES.Util.template( $('#permitViewTpl').html(),null),
        };
        ES.extend(oDOption,this.oDOption);
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },

    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },

    // 初始画界面对象
    initUI: function () {


    },

    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen(self.oOption.data);
            }

        });

        this.oDialog.addEventListener('close',function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },

    initButton: function () {
        this.oDOption.button = '';
    },
    afterOpen:function(oData) {
        var list = {
            '处置证类型':oData.TypeName,
            '所属企业名称':oData.CompanyName,
            '工地名称':oData.SiteName,
            '消纳点名称':oData.UnloadName,
            '线路':oData.Route,
            '有效期起止时间':oData.DayStart + ' 至 ' + oData.DayEnd,
            '发证单位':'武汉城管委',
        }

        var content = '';
        for(var key in list){
            content += '<li><label class="ec-u-sm-4">'+ key +'：</label><span class="ec-u-sm-8">'+ list[key] +'</span></li>';
        }
        var VehList = '';
        $.each(oData.Vehicles,function(i,v){
            VehList += '<li>'+v.VehicleNo+'</li>';
        });

        $('.ex-permit-info').append(content).siblings().find('.Id').html(oData.SerialNum);
        $('.ex-permit-view-Vehicle>ul').append(VehList);
        this.initMap(oData);
    },
    initMap:function(layers){

        var nMapHeight = $('.ex-permit-view-map').height();
        var nMapWidth = $('.ex-permit-view-map').width();

        this.oMapMaster = new L.MapLib.MapMaster.Map(this, {
            cDidId: 'permitMap',
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(30.592115, 114.305191),
                zoom: 10
            },
            oTileOption: {
                maxZoom: 18,
                minZoom: 3,
                attribution: 'Map &copy;GB-20263—2018 <a target="_blank" href="#">武汉依迅</a> '
            },
            nMapWidth:nMapWidth,
            nMapHeight:nMapHeight,
        });
        this.oMapMaster.loadMapMaster();

        this.oToolEdit = new L.MapLib.MapControl.mapDraw(this.oMapMaster, {});

        //画工地
        this.oToolEdit.editDraw({ MapX: layers.SiteMapX, MapY: layers.SiteMapY, Id: layers.SiteId, Name: '工地名称：' + layers.SiteName},1);
        //画消纳点
        this.oToolEdit.editDraw({ MapX: layers.UnloadMapX, MapY: layers.UnloadMapY, Id: layers.UnloadId, Name: '消纳点名称：' + layers.UnloadName},1);
        //画线路
        this.oToolEdit.editDraw({ MapX: layers.MapX, MapY: layers.MapY, Id: layers.Id, Name: ''},2);

    },
});

L.MapLib.MapControl.mapDraw =L.MapLib.MapControl.ESMapEdit.extend({
    //1 画多边形 2 画线路
    editDraw:function(oData,type){
        this.cFlag = 'edit';
        if(type == 2){
            if(oData.MapX == null) {
                return ;
            }
            var aX = oData.MapX.substr(0, oData.MapX.length - 1).split(',');
            var aY = oData.MapY.substr(0, oData.MapX.length - 1).split(',');
        }else{
            var aX = oData.MapX.split(',');
            var aY = oData.MapY.split(',');
        }

        if (!aX || !aY || aX.length <= 0||aX[0] == "") {
            return;
        }
        var aoLatLng = [];
        for (var i = 0; i < aX.length; i++) {
            var oLatLng = L.latLng(parseFloat(aY[i]), parseFloat(aX[i]));
            aoLatLng.push(oLatLng);
        }
        if(type == 1){
            var oVehLine = L.polygon(aoLatLng, {
                fillOpacity: 0.2,
                //color: '#0FFF05',
                fill: true,
            }).addTo(this._oDrawLayer);
            oVehLine.bindTooltip(oData.Name).openTooltip();
        }else if(type == 2){
            var oVehLine = L.polyline(aoLatLng, {
                opacity: 1,
                color: 'blue',
                weight: 2,
            }).addTo(this._oDrawLayer);
            this.fitBound();
        }


        oVehLine.cId = oData.Id;
        oVehLine.oFenceInfo = oData;

    }
});





