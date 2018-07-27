/**
 *  WTM 历史轨迹的设计
 * Created by liulin on 2017/9/13.
 */

ES.WTMTrack = {};

ES.WTMTrack.Page = ES.TrackView.Page.extend({

    oReqUrl: {

        // 查询实时状态,停留、行程数据
        oStatusUrl: {cUrl: null, cType: 'api'},

        // 查询历史轨迹
        oTrackUrl: {cUrl: UrlTemp.Monitor.carCtrlTrack, cType: 'api', PageSize: 300, PageIndex: 1},

        // 查询告警数据
        oAlarmUrl: {cUrl: null, cType: 'api'},

        // 查询当前中心位置信息
        oCenterPOIUrl: {cUrl: m_cSignal + '/api/util/GetPointRegion', cType: 'api'}
    },
});