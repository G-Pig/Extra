/**
 * 告警查询操作
 * 告警 按照类型来查询
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PanelBox.AlarmPanel = ES.TrackView.PanelBox.BasePanel.extend({

    oOption: {
        cAlarmDiv: "alarmChartView",

    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initOn();
    },

    // 点击查询
    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.initUI, this);

        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    clearMap: function () {
        $("#" + this.oOption.cAlarmDiv).empty();
    },

    // 获得查询参数，如果获得成功返回true，否则返回false
    getReqParam: function () {
        var oParam = this._oParent.getSearchTime();
        if (!oParam) {
            return false;
        }

        this.oReqParam = {
            devNo: m_PhoneNum,
            startTime: oParam.StartTime  ,
            endTime:  oParam.EndTime  ,
            alarmTypes:[100,101,104,105,106],
        };
        return true;
    },

    // 设置界面
    initUI: function () {

        if (!this.getReqParam()) return;
        if (!this._oParent.getUrl("oAlarmUrl")) {
            return
        }

        ES.loadAn(this.oOption.cAlarmDiv, "#");

        ES.getData(this.oReqParam, this._oParent.getUrl("oAlarmUrl"), this.InitUIHandler, this);
    },

    // 设置值
    InitUIHandler: function (oData) {
        if (!oData  || oData.length <= 0) {
            ES.removeAn("body", ' ');
            return;
        };

        var aoAlarm = oData;

        // 请求的停留数据要做标记
        for (var i = 0 ; i < aoAlarm.length; i++) {
            aoAlarm[i].nIndex = i;
        };

        // 设置数据
        this._oParent.fire(this._oParent.getEvenName("setAlarmData"), {aoAlarm:aoAlarm});

        this.initDataAlarm(aoAlarm);

        //ES.removeAn();

        var $_oLI = $("#" + this.oOption.cAlarmDiv).parent().parent()
        // 判断是否要加载
        if ($_oLI.css("display") === "none") {
            return;
        }

        //显示告警框时触发事件，返回true
        this._oParent.fire("Track:Bar.dealAlarmMarkers", { bIsDraw: false });
    },

    initDataAlarm: function (oData) {
        var self = this;
        if (!oData || oData.length <= 0) {
            return;
        }
        var aoAlarm = oData;

        var oLi = $("#" + this.oOption.cAlarmDiv).empty();

        for (var i = 0 ; i < aoAlarm.length ; i++) {
            ES.Util.initTag(oLi, this.getAlarmConfig(aoAlarm[i]));
            $("div.alarmRecord[cId='" + aoAlarm[i].nIndex + "']").data("oItem", { oItem: aoAlarm[i] });
        }


        // 注册点击事件
        $(".alarmRecord").bind("click", this, function (e) {
            var oItem = $(this).data('oItem');
            self._oParent.fire(self._oParent.getEvenName('localAlarmMarker'), oItem);

            $(this).removeClass("selected");
            $(this).addClass("selected");
        });

        //this.oParent.fire("TV:stopFinish");
    },

    //获得告警记录数据
    getAlarmConfig: function (oItem) {

        oRunConfig = {

            div: {
                class: 'TrackPanel-mRow TrackPanel-hoverRow alarmRecord',
                cId: oItem.nIndex,
                span: [
                    { class: 'TrackPanel-icon over-speed' },
                    { class: 'TrackPanel-emOrStrong', html: '[' + ES.TrackHelper.getAlarmTypeName(oItem.AlarmType) + ']' },
                    { html: oItem.AlarmPoi.Address +'</br>'},
                    { html: '时间：' + ES.Util.dateFormat(oItem.AlarmTime * 1000, "yyyy-MM-dd hh:mm") },
                    { html: '到' + ES.Util.dateFormat((oItem.AlarmTime + oItem.ContinueTime*60) * 1000, "yyyy-MM-dd hh:mm") },
                    { html: '(' + oItem.ContinueTime + '分)' },
                    //{ html: ES.TrackHelper.getTrackDateMsg((oItem.LastUpdateTimeStamp - oItem.AlarmStartTimeStamp) * 1000) }

                ]
            }
        }

        return oRunConfig;
    },
})

//告警类型过滤
ES.TrackView.PanelBox.AlarmPanel.include({
    //选择项样式设置
    alarmFilter: function () {
        var self = this;

        $(".alarm-type>li").click(function () {
            $(".alarm-type>li").removeClass("active");
            $(this).addClass("active");
            var cAlarmType = $(this).text();
            self.selectAlarmTyle(cAlarmType);
        })
    },
    //告警类型过滤
    selectAlarmTyle: function (cAlarmType) {

        if (cAlarmType == "全部") {
            $(".alarmRecord").css("display", "block");
        } else {

            var $_aoT = $(".alarmRecord").siblings();
            for (var i = 0; i < $_aoT.length; i++) {

                var cLiType = ES.TrackHelper.getAlarmTypeName($($_aoT[i]).data("oItem").oItem.AlarmType);

                if (cLiType.indexOf(cAlarmType) != -1) {
                    $($(".alarmRecord")[i]).css("display", "block");
                } else {
                    $($(".alarmRecord")[i]).css("display", "none");
                }
            }
        }
    },

})