/**页面的操作类 */
ES.Muck.EntranceGuard=ES.Page.extend({
    initialize: function (cId, oOption, oGridOpt) {
        this.oGridOpt = oGridOpt;
        this.cId = cId;
        this.initUI();
        this.initOn();
        this.initEvent();
        this._appendHtml();
        this.m_cSignal = "http://signalr.hgt.comlbs.com";
        this.imgUrl = "http://signalr.hgt.comlbs.com/recognition/";
    },
    // 初始画界面对象
    initUI: function () {
        // 页面布局
        this.oLayout = new ES.Muck.Layout(this,{});
        // 左边树结构
        this.oTree = new ES.Muck.Tree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,
                'state': {'opened': true},
                'data': {
                    url: '/CloudMap/CloudMapTreeByMapType?MapType=1&cloudTypes=[6,13]',
                    type: 'GET'
                }
            },
            checkbox:{tie_selection:false},
            plugins: ['search','type','unique']
        });
    },
    initOn: function () {
        this.on('SiteGuard.getHtml',this._getHtml,this);
        this.on('SiteGuard.getEntrance',this._getEntrance,this);
        this.on('SiteGuard.getExit',this._getExit,this);
        this.on('SiteGuard.getHubImg',this._getHubImg,this);
        this.on('SiteGuard.appendHtml',this._appendHtml,this);
        this.on('SiteGuard.getVoice',this._getVoice,this);
    },
    initEvent: function () {

    },
    _getHtml:function(oData){
        var sId = oData.id, self = this;
        if (sId.indexOf("_") > -1) {
            sId = sId.replace('_','');
        }
        $.get("/EntranceGuard/GetDeviceBySiteId?Id=" + sId, function (xml) {
            if(xml.length == 0){
                ES.aWarn('该项目暂时没有安装设备！')
                return;
            }
            self._appendHtml(xml)
            //ConfigureType为3控制语音和起落杆 为4的时候控制图片
            var xImg ="";
            if(xml.length >0){
                for(var i= 0;i<xml.length;i++){
                    if(xml[i].ConfigureType == "4" && xml[i].Direction == '2'){
                        self.fire('SiteGuard.getEntrance',xml[i]);
                    }
                    if(xml[i].ConfigureType == "4"){
                        xImg += xml[i].DeviceCode+',';
                    }
                }
                var oData = xImg.substr(0,xImg.length-1);
                self.fire('SiteGuard.getHubImg',{oData:oData});
                for(var i= 0;i<xml.length;i++){
                    if(xml[i].ConfigureType == "4" && xml[i].Direction == '1'){
                        self.fire('SiteGuard.getExit',xml[i]);
                    }
                }
            }
        });
    },
    //入口主控
    _getEntrance: function(data){
      var devNo = data.DeviceCode;
      var self = this;
        $.get("/Site/GetPreviewPramas?code=" + devNo, function (xml) {
            var cHtml =
                '<object classid="clsid:04DE0049-8359-486e-9BE7-1144BA270F6A" id="_entranceVideo" width="300" height="220" name="_playviewocx">'+
                '   <param name="wmode" value="transparent">'+
                '</object>';
            $('#entranceVideo').append($(cHtml));
            var ocxObj = document.getElementById("_entranceVideo");
            setTimeout(function(){
                try {
                    ocxObj.SetOcxMode(0);
                    ocxObj.StartTask_Preview_InWnd(xml, 0);
                }
                catch (e) {
                    self.browserTip();
                }
            },3000)
        });
    },
    browserTip:function(){
        var _TipHtml = "<div id='browserTip'><div class='ex-layout-loading'><div class='window_tip ec-vertical-align'><p class='ec-vertical-align-middle'>该功能需要在IE浏览器中安装插件才能使用 <a href='/cmsocx.rar'><span class='ec-icon-download' style='font-size:2.4rem;'></span> 下载插件</a> </p>";
        _TipHtml += "<em class='ec-close ec-close-alt ec-close-spin' onclick='$(\"#browserTip\").remove()'>&times;</em></div></div></div>";
        $('body').append(_TipHtml);
    },
    //出口主控
    _getExit: function(data){
        var self = this;
        var devNo = data.DeviceCode;
        $.get("/Site/GetPreviewPramas?code=" + devNo, function (xml) {
            var cHtml =
                '<object classid="clsid:04DE0049-8359-486e-9BE7-1144BA270F6A" id="_exitVideo" width="300" height="220" name="_playviewocx1">'+
                '   <param name="wmode1" value="transparent1">'+
                '</object>';
            $('#exitVideo').append($(cHtml));
            var ocxObj = document.getElementById("_exitVideo");
            setTimeout(function(){
                try {
                    ocxObj.SetOcxMode(0);
                    ocxObj.StartTask_Preview_InWnd(xml, 0);
                }
                catch (e) {
                    //self.browserTip();
                }
            },3000)
        });
    },
    //订阅获取车辆的图片及信息
    _getHubImg:function(oData){
        var timeout = 1000;
        var self = this;
        jQuery.support.cors = true;
        $.connection.hub.url = this.m_cSignal + "/signalr"
        var gpshub = $.connection.GpsHub;
        var hub = $.connection.hub;
        gpshub.client.handlerVehRecog = function (items) {
            if(!items){return};
            var entDevCode = $('#entDevCode').val();//入口的设备号
            var exitDevCode = $('#exitDevCode').val();//出口的设备号
            var imgHtml = '<a><img src="'+self.imgUrl+items[0].VehicleMediaPath+'" /></a>';//图片容器
            var DateTime = items[0].DateTime.replace('T',' ');//时间
            var VehiclePlate = items[0].VehiclePlate;//车牌号
            var State = items[0].VehState;//车辆状态
            var xState = self._getState(State);
            if(items[0].DevCode == entDevCode){ //渲染入口的数据
                $('#entranceImg').html('');
                $('.entVehicleNum').html(VehiclePlate);
                $('#entTime').html(DateTime);
                $('#state').html(xState);
                $('#entranceImg').attr('data-src',imgHtml)
                $('#entranceImg').append(imgHtml);
                $('#entranceImg').lightGallery();
            }else if(items[0].DevCode == exitDevCode){ //渲染出口的数据
                $('#exitImg').html('');
                $('.exitVehicleNum').html(VehiclePlate);
                $('#exitTime').html(DateTime);
                $('#exitState').html(xState);
                $('#exitImg').attr('data-src',imgHtml)
                $('#exitImg').append(imgHtml);
                $('#exitImg').lightGallery();
            };
        };
        hub.disconnected(function () {
            console.log('disconnected.' + new Date().getSeconds().toString());
            setTimeout(function () {
                console.log('reconnect...' + new Date().toString());
                hub.start().done(function () {
                    console.log("reconn succ.");
                });
            }, timeout); // Restart connection after 5 seconds.
        });
        hub.start().done(function () {
            console.log("start succ.");
        }).fail(function (err) {
            console.log(err);
            console.log('Could not connect.' + err);
        });
        setTimeout(function () {
            gpshub.server.subVehicleRecognition(oData.oData);
            console.log("sub subSiteImg");
        }, timeout * 1.5);
    },
    //加载工地模块
    _appendHtml:function (data) {
        if(!data){return;}
        $("#siteGuard").html('');
        for(var i=0;i<data.length;i++){
            if(data[i].ConfigureType == "3" && data[i].Direction == '2'){
                var entDev = data[i].DeviceCode;//入口设备号
            }
            if(data[i].ConfigureType == "3" && data[i].Direction == '1'){
                var exitDev = data[i].DeviceCode;//出口设备号
            }
            if(data[i].ConfigureType == "4" && data[i].Direction == '2'){
                var entDevCode = data[i].DeviceCode;//入口设备号
            }
            if(data[i].ConfigureType == "4" && data[i].Direction == '1'){
                var exitDevCode = data[i].DeviceCode;//出口设备号
            }
        }
        var siteName = data[0].SiteName;//工地名称
        var cHTML =
                '<div class="ex-layout-site-item">' +
                '<input type="hidden" value="'+entDevCode+'" id="entDevCode">' +
                '<input type="hidden" value="'+exitDevCode+'" id="exitDevCode">' +
                '<div class="ex-layout-site-entry-title">' +
                '   <h2>'+siteName+'</h2>' +
                //'   <p><i class="ec-icon-map-marker"></i> </p>'+
                '</div>'+
                '<ul class="ec-avg-sm-2">'+
                '   <li data-id="'+entDev+'">'+
                '       <div class="ex-layout-site-panel ex-layout-panel">'+
                '           <h3>实时门禁(入口)</h3>'+
                '           <p>'+
                '               <button '+btnAuth.open+' class="ec-btn ec-btn-secondary ec-round ec-btn-xs openGate" data-id="'+entDev+'"><i class="ec-icon-map"></i> 道闸—开</button>&nbsp;&nbsp;'+
                '               <button '+btnAuth.close+' class="ec-btn ec-btn-secondary ec-round ec-btn-xs closeGate" data-id="'+entDev+'"><i class="ec-icon-map"></i> 道闸—关</button>&nbsp;&nbsp;'+
                '               <button '+btnAuth.voice+' class="ec-btn ec-btn-secondary ec-round ec-btn-xs VoiceControl" data-id="'+entDev+'"><i class="ec-icon-map"></i> 控制语音</button>&nbsp;&nbsp;'+
                //'               <button class="ec-btn ec-btn-secondary ec-round ec-btn-xs"><i class="ec-icon-picture-o"></i> 过车记录</button>&nbsp;&nbsp;'+
                '           </p>' +
                '           <div class="ec-g">' +
                '               <div class="ec-u-sm-7">' +
                '                   <div class="ex-img-entry">' +
                '                       <div class="ex-img-entry-box">' +
                '                           <div class="ex-img-entry-line"></div>' +
                '                           <div class="ex-img-entry-grid"></div>' +
                '                       </div>' +
                '                       <div class="ex-img-entry-door">' +
                '                           <i class="light"></i>' +
                '                       </div>' +
                '                       <div class="ex-img-entry-truck">' +
                '                           <div class="ex-img-entry-number entVehicleNum"></div>' +
                '                       </div>' +
                '                   </div>' +
                '               </div>' +
                '               <div class="ec-u-sm-5 ec-text-p">' +
                //'                   <p class="ec-text-lg">今日抬杆次数：<strong class="ex-text-entry-total">10</strong> 次</p>' +
                '                   <p class="ec-text-md">驶入车牌号：<strong class="ex-text-entry-number entVehicleNum"></strong></p>' +
                '                   <p class="ec-text-md">驶入时间：<span class="ex-text-entry-date" id="entTime"></span></p>' +
                '                   <p class="ec-text-md">车辆状态：<span class="ex-text-entry-state" id="state"></span></p>' +
                //'                   <p>是否有资质：<strong class="ex-text-entry-qualifications">是</strong></p>' +
                //'                   <p>是否在线：<strong class="ex-text-entry-online">在线</strong></p>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '   </li>' +
                '   <li data-id="'+exitDev+'">'+
                '       <div class="ex-layout-site-panel ex-layout-panel">'+
                '           <h3>实时门禁(出口)</h3>'+
                '           <p>'+
                '               <button '+btnAuth.openE+' class="ec-btn ec-btn-secondary ec-round ec-btn-xs openGate" data-id="'+exitDev+'"><i class="ec-icon-map"></i> 道闸—开</button>&nbsp;&nbsp;'+
                '               <button '+btnAuth.closeE+' class="ec-btn ec-btn-secondary ec-round ec-btn-xs closeGate" data-id="'+exitDev+'"><i class="ec-icon-map"></i> 道闸—关</button>&nbsp;&nbsp;'+
                '               <button '+btnAuth.voiceE+' class="ec-btn ec-btn-secondary ec-round ec-btn-xs VoiceControl" data-id="'+exitDev+'"><i class="ec-icon-map"></i> 控制语音</button>&nbsp;&nbsp;'+
                //'               <button class="ec-btn ec-btn-secondary ec-round ec-btn-xs"><i class="ec-icon-map"></i> 过车记录</button>&nbsp;&nbsp;'+
                '           </p>' +
                '           <div class="ec-g">' +
                '               <div class="ec-u-sm-7">' +
                '                   <div class="ex-img-entry">' +
                '                       <div class="ex-img-entry-box">' +
                '                           <div class="ex-img-entry-line"></div>' +
                '                           <div class="ex-img-entry-grid"></div>' +
                '                       </div>' +
                '                       <div class="ex-img-entry-door">' +
                '                           <i class="light"></i>' +
                '                       </div>' +
                '                       <div class="ex-img-entry-truck">' +
                '                           <div class="ex-img-entry-number exitVehicleNum"></div>' +
                '                       </div>' +
                '                   </div>' +
                '               </div>' +
                '               <div class="ec-u-sm-5 ec-text-p">' +
                //'                   <p class="ec-text-lg">今日抬杆次数：<strong class="ex-text-entry-total">10</strong> 次</p>' +
                '                   <p class="ec-text-md">驶出车牌号：<strong class="ex-text-entry-number exitVehicleNum"></strong></p>' +
                '                   <p class="ec-text-md">驶出时间：<span class="ex-text-entry-date" id="exitTime"></span></p>' +
                '                   <p class="ec-text-md">车辆状态：<span class="ex-text-entry-state" id="exitState"></span></p>' +
                //'                   <p>是否有资质：<strong class="ex-text-entry-qualifications">是</strong></p>' +
                //'                   <p>是否在线：<strong class="ex-text-entry-online">在线</strong></p>' +
                '               </div>' +
                '           </div>' +
                '       </div>' +
                '   </li>' +

                '   <li  data-id="'+entDev+'">' +
                '       <div class="ex-layout-site-panel ex-layout-panel ex-site-video">' +
                '           <h3>视频监控(入口)</h3>' +
                '           <ul class="ec-avg-sm-2">' +
                '               <li class="ex-layout-video-box" id="entranceVideo" style="min-height:150px;"></li>' +
                '               <li id="entranceImg" data-src=""></li>' +
                '           </ul>' +
                '       </div>' +
                '   </li>' +
                '   <li  data-id="'+exitDev+'">' +
                '       <div class="ex-layout-site-panel ex-layout-panel ex-site-video">' +
                '           <h3>视频监控(出口)</h3>' +
                '           <ul class="ec-avg-sm-2">' +
                '               <li class="ex-layout-video-box" id="exitVideo"></li>' +
                '               <li id="exitImg" data-src="">' +
                '               </li>' +
                '           </ul>' +
                '       </div>' +
                '   </li>' +
                '</ul>'+
                '</div>';
            var oItem = $(cHTML);
            $("#siteGuard").append(oItem);
        var self = this;
        oItem.find('.openGate').bind('click',function(){
            var dataId = $(this).attr('data-id');
            self.oEditD = new ES.Common.CloseGate(self, {
                bRemove: true,cUrl:"/EntranceGuard/EntranceGuardDoor"
            }, {
                title: "关闭道闸",
                content:'是否开启道闸？'
            });
            self.oEditD.showModal({PhoneNum:dataId,Command:5});
            return false
        });
        oItem.find('.closeGate').bind('click',function(){
            var dataId = $(this).attr('data-id');
            self.oEditD = new ES.Common.CloseGate(self, {
                bRemove: true,cUrl:"/EntranceGuard/EntranceGuardDoor"
            }, {
                title: "关闭道闸",
                content:'是否关闭道闸？'
            });
            self.oEditD.showModal({PhoneNum:dataId,Command:6});
            return false
        });
        oItem.find('.VoiceControl').bind('click',function(){
            var dataId = $(this).attr('data-id');
            self.oEditD = new ES.Common.ShowVoice(self, {
                bRemove: true
            }, {
                title: "控制语音",
                content:self._getVoice(dataId)
            });
            self.oEditD.showModal({DeviceNo:dataId});
            return false
        });
    },
    //控制闸道的页面
    // _getGate:function(){
    //     var cHtml =
    //         '<div class="ex-dialog-siteGuard">'+
    //         '<ul class="ec-avg-sm-2">' +
    //         '   <li class="ec-form-group">'+
    //         '       <label class="ec-u-sm-5"><b>类型：</b></label>'+
    //         '       <span class="ec-u-sm-7"><strong>控制闸道</strong></span>'+
    //
    //         // '       <select class="ec-u-sm-7">' +
    //         // '           <option value="">请选择放行理由</option>' +
    //         // '           <option value="">允许通过</option>' +
    //         // '           <option value="">合理通过</option>' +
    //         // '           <option value="">车辆通过</option>' +
    //         // '       </select>' +
    //         '   </li>' +
    //         '   <li class="ec-form-group">'+
    //         '       <label class="ec-u-sm-5"><b>通行时间：</b></label>'+
    //         '       <span class="ec-u-sm-7"><strong>2018-04-27</strong></span>'+
    //         '   </li>' +
    //         '</ul>'+
    //     '   <div class="ec-g ex-layout-site-reports-bottom" style="border-top:1px dotted #ccc">'+
    //     '       <div class="ec-u-sm-12">'+
    //     '           <form class="ec-form">' +
    //     '               <textarea placeholder="请填写其他理由" style="min-height:200px;" id="reasonsText"></textarea>' +
    //     '           </form>' +
    //     '       </div>' +
    //     '   </div>'+
    //     '   </div>';
    //     return cHtml;
    // },
    //控制语音的页面
    //控制语音的弹窗
    _getVoice:function(data){
        var cHtml =
            '<div class="ex-dialog-siteGuard">'+
            '   <div class="ec-g ex-layout-site-reports-bottom" style="border-top:1px dotted #ccc">'+
            '       <div class="ec-u-sm-12">'+
            '           <form class="ec-form">' +
            '               <input type="hidden" id="devNo" value="'+data+'">'+
            '               <textarea placeholder="请填写语音内容" style="min-height:100px;" id="voiceText"></textarea>' +
            '           </form>' +
            '       </div>' +
            '   </div>'+
            '</div>';
        return cHtml;
    },
    //获取车辆状态
    _getState:function(data){
        var xState;
        switch (data)
        {
            case 1:
                xState="行驶";
                break;
            case 2:
                xState="停车";
                break;
            case 3:
                xState="熄火";
                break;
            case 4:
                xState="定位失败";
                break;
            case 5:
                xState="通讯失败";
                break;
        }
        return xState;
    }
});

