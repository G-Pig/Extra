/**
 *
 * 历史轨迹在企业版本上进行修改
 * 依靠一个js 可以直接查看历史轨迹
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.Layout = ES.Evented.extend({


    oOption: {
        //父亲级容器
        cContainerSel: '.ex-layout-main',
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initUI();

        this.initOn();

        this.setParentEvent();
    },

    initOn: function () {
        this._oParent.on('MapView:LayoutContent.resize',this.resize,this);
    },

    resize: function (oData) {
        if(oData.nWidth){
            this.$_oContainer.css({width:oData.nWidth});
        }
        if(oData.nHeight){
            this.$_oContainer.css({height:oData.nHeight});
        }

    },

    reflesh: function (nWidth,nHeight) {
        this.$_oContainer.css({width:nWidth,height:nHeight});
    },

    initUI: function () {
        this.$_oContainer =$(this.cHtml);
        $(this.oOption.cContainerSel).append(this.$_oContainer);

        this.$_oContainer.css({width:this.oOption.nWidth,height:this.oOption.nHeight});

        $('input[type="checkbox"]').uCheck();//这是统一写法
        $('input[type="checkbox"].ec-ucheck-checkbox').uCheck();//这是根据class调用

        var self = this;
        $('#Site').bind('change', function (oData) {

            if ($(this).is(':checked')) {
                ES.Util.reqData({data:{},url: '/Site/SiteInfoForTrack'}, function (oData) {
                    self._oParent.fire('TrackView.SiteLayer:DrawArea', {aoData: oData.rtnData});

                }, this);
            } else {
                self._oParent.fire('TrackView.SiteLayer:ClearArea');
            }
        });

        $('#Unload').bind('change', function (oData) {

            if ($(this).is(':checked')) {
                ES.Util.reqData({data:{ }, url: '/Unload/UnloadInfoForTrack'}, function (oData) {

                    self._oParent.fire('TrackView.UnloadLayer:DrawArea', {aoData: oData.rtnData});

                }, this);
            } else {
                self._oParent.fire('TrackView.UnloadLayer:ClearArea');
            }
        });

    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        var oTemp =this.$_oContainer.find('.ex-layout-track-chart').get(0);
        L.DomEvent.addListener(oTemp, 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'mousewheel', L.DomEvent.stopPropagation);

        var oTemp =this.$_oContainer.find('.ex-layout-trackbar').get(0);
        L.DomEvent.addListener(oTemp, 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'mousewheel', L.DomEvent.stopPropagation);
    },

});


ES.TrackView.Layout.include({
    // 渣土车V2.1历史轨迹
cHtml:
'<div class="ex-layout-content">' +
'   <div id="MapView" class="ex-layout-map-content">' +
'       <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left"></div>' +
'       <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right">' +
'           <div class="ex-layout-trackbar">' +
'               <div class="ex-maptool-box" >' +
'                   <i class="ec-icon-tachometer"></i>&nbsp;&nbsp;状态' +
'               </div>' +
'               <div class="ex-maptool-box">' +
'                   <i class="ec-icon-line-chart"></i>&nbsp;&nbsp;速度、顶棚、载重' +
'               </div>' +
'               <div class="ex-maptool-box" style = "display:none">' +
'                   <i class="ec-icon-check-square"></i>&nbsp;&nbsp;顶棚' +
'               </div>' +
'               <div class="ex-maptool-box" style = "display:none">' +
'                   <i class="ec-icon-map-signs"></i>&nbsp;&nbsp;行程' +
'               </div>' +
'               <div class="ex-maptool-box"  even-name="Track:Bar.dealParkMarkers">' +
'                   <i class="ec-icon-get-pocket" ></i>&nbsp;&nbsp;停留' +
'               </div>' +
'               <div class="ex-maptool-box"  even-name="Track:Bar.dealAlarmMarkers">' +
'                   <i class="ec-icon-warning"></i>&nbsp;&nbsp;报警' +
'               </div>' +
'               <div class="ex-maptool-box" style = "display:none">' +
'                   <i class="ec-icon-ils"></i>&nbsp;&nbsp;线路' +
'               </div>' +
'               <div class="ex-maptool-box pass">' +
'                   <i class="ec-icon-area-chart"></i>&nbsp;&nbsp;报表' +
'               </div>' +

'               <div class="ex-maptool-box passCheck">' +
'                   <i class="ec-icon-ils"></i>' +
'                   <label for="Site" class=" ec-checkbox-inline ec-success">' +
'                         <input type="checkbox" id="Site" name="form-checkbox" class="ec-ucheck-checkbox">工地' +
'                   </label>' +
'               </div>' +

'               <div class="ex-maptool-box passCheck">' +
'                   <i class="ec-icon-check-square"></i>' +
'                   <label for="Unload" class=" ec-checkbox-inline ec-success">' +
'                       <input type="checkbox" id="Unload" name="form-checkbox" class="ec-ucheck-checkbox">消纳点' +
'                   </label>' +
'               </div>' +

'           </div>' +
'       </div>' +
'       <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right" style="top:50px; box-shadow:none;">' +
'           <ul class="ex-layout-track-chart chart-width">' +
'               <li class="track-chart-box" style="height:145px;overflow:hidden">' +
'                   <dl class="ex-layout-track-chart-box">' +
'                       <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                       <dt><i class="ec-icon-tachometer"></i>&nbsp;&nbsp;状态</dt>' +
'                       <dd>' +
'                       <table class="TrackPanel-Tabel">' +
'                           <tbody>' +
'                               <tr>' +
'                                   <td><strong>行驶时长</strong></td>' +
'                                       <td class="TrackPanel-emOrStrong ec-text-right" id="total_travelPeriod"></td>' +
'                                       <td > &nbsp;&nbsp;<span id="travelPeriod_msg"></span></td>' +
'                                       <td><strong>行驶里程</strong></td>' +
'                                       <td class="TrackPanel-emOrStrong ec-text-right" id="total_mileage"></td>' +
'                                       <td> &nbsp;&nbsp;Km</td>' +
'                               </tr>' +
'                               <tr>' +
'                                   <td><strong>平均速度</strong></td>' +
'                                   <td class="TrackPanel-emOrStrong ec-text-right" id="total_avgSpeed"></td>' +
'                                   <td> &nbsp;&nbsp;Km/h</td>' +
'                                   <td><strong>轨迹点</strong></td>' +
'                                   <td class="TrackPanel-emOrStrong ec-text-right" id="total_points"></td>' +
'                                   <td>&nbsp;&nbsp;个</td>' +
'                               </tr>' +
'                               <tr>' +
'                                   <td><strong>开始时间</strong></td>' +
'                                   <td colspan="5" class="TrackPanel-emOrStrong" id="tdBeginDate" style="text-align:center;"></td>' +
'                                   <td></td>' +
'                               </tr>' +
'                               <tr>' +
'                                       <td><strong>结束时间</strong></td>' +
'                                   <td colspan="5" class="TrackPanel-emOrStrong" id="tdEndDate" style="text-align:center;"></td>' +
'                                   <td></td>' +
'                               </tr>' +
'                           </tbody>' +
'                       </table>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box" style="max-height:340px;padding:0">' +
'                   <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-line-chart"></i>&nbsp;&nbsp;速度、顶棚、载重</dt>' +
'                   <dd  style="max-height:340px">' +
'                       <div id="speedWeightDoorChartView">' +
'                           <div id="divSpeedWeightChart" style="width:380px;height:150px"> </div>' +
'                           <div id="divDoorChart" style="width:380px;height:150px" > </div>' +
'                       </div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-check-square"></i>&nbsp;&nbsp;顶棚</dt>' +
'                   <dd>' +
'                       <div id="speedChartsView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-map-signs"></i>&nbsp;&nbsp;行程</dt>' +
'                   <dd>' +
'                       <div id="runChartsView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" even-name="Track:Bar.dealParkMarkers" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-get-pocket"></i>&nbsp;&nbsp;停留</dt>' +
'                   <dd>' +
'                       <div id="parkChartView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box" style="height:260px;padding:0 !important">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" even-name="Track:Bar.dealAlarmMarkers" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-warning"></i>&nbsp;&nbsp;报警</dt>' +
'                   <ul class="alarm-type">' +
'                       <li class="active" cid="">全部</li>' +
'                       <li class="" cid="cover">未密闭</li>' +
'                       <li class="" cid="o-earth">可疑出土</li>' +
'                       <li class="" cid="i-earth">可疑消纳</li>' +
'                       <li class="" cid="speed">平台超速</li>' +
'                       <li class="" cid="work" style="display:none">非工作时间</li>' +
'                   </ul>' +
'                   <dd>' +
'                       <div id="alarmChartView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-ils"></i>&nbsp;&nbsp;线路</dt>' +
'                   <dd>' +
'                       <div id="speedChartsView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box"></li>' +
'       </ul>' +
'    </div>' +
'       <div class="ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right">' +
'           <div class="truck_box" style="zoom: 0.6; margin: 0px; background-color: rgba(255, 255, 255, 0.85098);">' +
'               <div id="echartsSpeed" class="echarts_box speed"></div>' +
'               <div id="echartsWeight" class="echarts_box weight"></div>' +
'               <div class="ex-layout-mobile">' +
'                   <i class="ex-icon-16 ex-icon-mobile on"></i>' +
'                   <i class="ex-icon-16 ex-icon-bd"></i>' +
'               </div>' +
'               <div class="car-mask">' +
'                   <div class="car-cover" style="left: 0px;"></div>' +
'               </div>' +
'               <div class="car-light l-gray"></div>' +
'           </div>' +
'       </div>' +
'   </div>' +
'   <div class="ex-layout-trackcontrol ">' +
'       <div class="track-control-box slideup">' +
'           <ul class="ex-layout-trackcontrol-query">' +
'               <li class="ec-form-group ec-form-select ec-form-icon">' +
'                   <label class=" ec-checkbox-inline ec-success"><input type="checkbox" checked  class="ckbPopup"/>气泡</label>' +
'               </li>' +
'               <li class="ec-form-group ec-form-select ec-form-icon">' +
'                   <label  class=" ec-checkbox-inline ec-success"><input type="checkbox" checked class="ckbTrackLine" />轨迹线</label>' +
'               </li>' +
'               <li class="ec-form-group ec-form-select ec-form-icon">' +
'                   <label  class=" ec-checkbox-inline ec-success"><input type="checkbox" class="ckbTrackPos"/>轨迹点</label>' +
'               </li>' +
'               <li class="ec-form-group ec-form-select ec-form-icon" style="float:right;">' +
'                   <i class="ec-icon-line-chart"></i>' +
'                   <select class="ec-form-field ec-handle-playSpeed">' +
'                       <option value="50">播放速度[极速]</option>' +
'                       <option value="100">播放速度[快速]</option>' +
'                       <option value="200">播放速度[较快]</option>' +
'                       <option value="500">播放速度[一般]</option>' +
'                       <option value="1000">播放速度[慢速]</option>' +
'                   </select>' +
'               </li>' +
'           </ul>' +
'           <ul class="ex-layout-trackcontrol-console">' +
'               <li>' +
'                   <button class="ec-btn ec-btn-secondary ec-radius track-play" style="width:4rem"><i class="ec-icon-play"></i></button>' +
'                   <button class="ec-btn ec-btn-secondary ec-radius track-pause" style="width:4rem;display:none;"><i class="ec-icon-pause"></i></button>' +
'               </li>' +
'               <li>' +
'                   <button class="ec-btn ec-btn-secondary ec-radius track-replay"><i class="ec-icon-repeat"></i></button>' +
'               </li>' +
'               <li>' +
'                   <div class="track-control-slider" data-range_min="0" data-range_max="100" data-cur_min="100" data-cur_max="0">' +
'                       <div class="track-control-bar"></div>' +
'                       <div class="track-control-leftGrip"></div>' +
'                   </div>' +
'                   <ul class="track-control-label"></ul>' +
'               </li>' +
'            </ul>' +
'       </div>' +
'       <ul class="ex-layout-trackcontrol-search">' +
'           <li class="ec-form-group">' +
'               <label>查找轨迹：</label>' +
'           </li>' +
'           <ul class="ex-datetime-box ec-avg-sm-2">' +
'               <li class="ec-form-group">' +
'                   <label for="form-dateStart" class="ec-form-label">开始时间：</label>' +
'                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
'                       <input size="16" type="text" id="txtBeginDate" value="2015-02-14 14:45" class="ec-form-field">' +
'                           <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
'                   </div>' +
'               </li>' +
'               <li class="ec-form-group">' +
'                   <label for="form-dateEnd" class="ec-form-label">结束时间：</label>' +
'                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
'                       <input size="16" type="text" id="txtEndDate" value="2015-02-14 14:45" class="ec-form-field">' +
'                       <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
'                   </div>' +
'               </li>' +
'           </ul>' +
'           <li class="ec-form-group ec-form-select ec-form-icon">' +
'               <i class="ec-icon-clock-o"></i>' +
'               <select class="ec-form-field ec-handle-time">' +
'                   <option value="1">最近1小时</option>' +
'                   <option value="3">最近3小时</option>' +
'                   <option value="6">最近6小时</option>' +
'                   <option value="12">最近半天</option>' +
'                   <option value="24">最近1天</option>' +
'                   <option value="72">最近3天</option>' +
'                   <option value="0">手动选择</option>' +
'               </select>' +
'           </li>' +
'           <li class="ec-form-group ec-form-select ec-form-icon">' +
'               <i class="ec-icon-line-chart"></i>' +
'               <select class="ec-form-field ec-handle-speed">' +
'                   <option value="0">0km/h</option>' +
'                   <option value="2">2km/h以内</option>' +
'                   <option value="5">5km/h以内</option>' +
'                   <option value="10">10km/h以内</option>' +
'                   <option value="60">60km/h以内</option>' +
'                   <option value="80">80km/h以内</option>' +
'                   <option value="-1">不屏蔽</option>' +
'               </select>' +
'           </li>' +
'           <li class="ec-form-group">' +
'               <button class="ec-btn ec-btn-sm ec-btn-success track-search"><i class="ec-icon-search"></i> 查询轨迹</button>' +
'           </li>' +
'       </ul>' +
'    </div>' +
'</div>'


});