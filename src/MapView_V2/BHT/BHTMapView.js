/**
 * 白鹤滩页面  Created by liulin on 2018/3/16.
 */
// 存储页面公共的模块
ES.MapView.PageBHT = ES.MapView.Page.extend({
    _getVecMarkerHtml: function (oGpsInfo) {
        var cDir = ES.TrackHelper.getDire(oGpsInfo.dir);
        var cMsg = ES.TrackHelper.getDateMsg(oGpsInfo.gpsTime);
        var oTemp = {};
        ES.extend(oTemp, oGpsInfo,  {
            cMsg: cMsg,
            cDir: cDir,
            Mileage: oGpsInfo.mile / 1000,
            cGpsDate: ES.Util.dateFormat(oGpsInfo.gpsTime  , "yyyy-MM-dd hh:mm:ss"),
            cVehicleStatus: oGpsInfo.sta || '通讯中断',
            cPoiInfo: oGpsInfo.poi || '',
            map: oGpsInfo.sta !== '通讯中断'&&oGpsInfo.sta !== '定位失败' ? 'on' : '',
            key:oGpsInfo.status.accStatus==='1'?'on':'',
            open:oGpsInfo.status.vehicleDoorStatus==='1'?'on':'',
            signal:oGpsInfo.sta !== '通讯中断'?'on':'',
            weight:this.weightStatus(oGpsInfo.weight,oGpsInfo.status)
        });
        var cHtml =
            '<div class="ex-maptip-wtm"> ' +
            '   <div class="ex-maptip-wtm-content">' +
            '       <div class="ex-content-info-box">' +
            '            <div class="ex-content-info-car ec-u-sm-6">' +
            '               <h3>{shortName}</h3>' +
            '               <div class="ex-content-img"><img src="{img}" alt="{img}" /></div>' +
            '               <ul>' +
            '                   <li><i class="ec-icon-car"></i><span>{entName}</span></li>' +
            //'                   <li><i class="ec-icon-user"></i><span>{CompanyName}</span></li>' +
            //'                   <li><i class="ec-icon-map-signs"></i><span>{weigth}</span></li>' +
            '               </ul>' +
            '           </div>' +
            '           <div class="ex-content-info-state ec-u-sm-6">' +
            '               <ul>' +
            '                   <li><span>{cGpsDate}{cMsg}</span></li>' +
            '                   <li><strong>状态：</strong><span>{cVehicleStatus}</span></li>' +
            '                   <li><strong>速度：</strong><span>{speed} (Km/h)</span></li>' +
            '                   <li><strong>车牌：</strong><span>{vehNo}</span></li>' +
            //'                   <li><strong>今日：</strong><span></span></li>' +
            '                   <li><strong>里程：</strong><span>{Mileage} Km</span></li>' +
            '                   <li><strong>位置：</strong><span>{cPoiInfo}</span></li>' +
            '               </ul>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="ex-maptip-wtm-tool">' +
            '       <ul class="tool-btn ec-avg-sm-3 ec-u-sm-6">' +
            '           <li><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-truck"> 详情 </a></li>' +
            '           <li><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 轨迹 </a></li>' +
            '        </ul>' +
            '       <ul class="tool-state ec-avg-sm-4 ec-u-sm-6">' +
            '           <li><i class="GPS {map}"></i></li>' +
            //'           <li><i class="ACC {key}"></i></li>' +
            '           <li><i class="signal {signal}"></i></li>' +
            //'           <li><i class="door {open}"></i></li>' +
            '        </ul>' +
            '   </div>' +
            '</div>';

        var cHtml = ES.Util.template(cHtml, oTemp);
        return cHtml;
    },
    toHeartModle: function (aoData) {
        var aoGps = [];
        if (!aoData ||  aoData.length <= 0) {
            return aoGps;
        }
        var cImg = '/Asset/img/ex_default/law_144.png'
        if(ES.MapView.oConfig.systemFlag ==='truck')
        {
            cImg= '/Asset/img/ex_default/truck_144.png'
        }
        for (var i = 0; i < aoData.length; i++) {
            var mapLatLng = aoData[i].Poi.MapPoint;
            var oModel = {
                vehNo: aoData[i].VehicleNo,
                devNo: aoData[i].PhoneNum,
                shortName: aoData[i].ShortName,
                latLng: {lat:mapLatLng.Lat,lng:mapLatLng.Lon},
                gpsDate: aoData[i].GpsDateTime,
                dir: aoData[i].Direction,
                poi:  aoData[i].Poi.Address,
                speed: aoData[i].Speed,
                status: aoData[i].Status,
                attach: aoData[i].Property,
                sta: aoData[i].VehicleStatus,
                mile: aoData[i].Mileage,
                gpsTime: ES.Util.toDate(aoData[i].GpsDateTime).getTime(),
                img:cImg,
                entName:aoData[i].CompanyName,
                weight:aoData[i].sWeightValue || aoData[i].Property.ZtWeightValue,
            };
            aoGps.push(oModel);
        }
        return aoGps;
    },
});