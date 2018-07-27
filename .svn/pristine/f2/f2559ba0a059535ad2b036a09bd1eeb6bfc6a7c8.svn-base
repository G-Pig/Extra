/**
 * Created by liulin on 2017/9/13.
 */

ES.WTMTrack.Control = ES.TrackView.Control.extend({

    // 获得每个控件的值
    //  查询时间
    getSearchTime: function () {
        var nVal = parseInt($(".ec-handle-time").val());
        var nBeginT = 0
        var nEndT = 0;

        if (nVal === 0) {
            nBeginT = $("#txtBeginDate").val();
            nEndT = $("#txtEndDate").val();
        }
        else {
            nEndT = new Date().getTime();
            nBeginT = nEndT - nVal * 60 * 60 * 1000;
        }

        var cEndDate = ES.Util.dateFormat(nEndT, "yyyy-MM-dd hh:mm:ss");
        var cBeginData = ES.Util.dateFormat(nBeginT, "yyyy-MM-dd hh:mm:ss");
        var oParam = {
            //nBeginT: nBeginT,
            //nEndT: nEndT,
            endTime: cEndDate,
            startTime: cBeginData
        }
        return oParam;
    },


});