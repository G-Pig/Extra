/**
 * boss 历史轨迹
 * Created by liulin on 2017/8/16.
 */

ES.BossTrack.TrackData = ES.TrackView.TrackData.extend({

    // 把轨迹传化为标准的GPS数据格式
    convertGpsData:function(aoGpsInfo) {

        if (!aoGpsInfo || aoGpsInfo.length <= 0) {
            return aoGpsInfo;
        }


        var aoTrack = aoGpsInfo.map(function (oItem) {
            var oTemp = {};
            //oTemp.Direction = ES.TrackHelper.getDire(oItem.Direction);
            oTemp.Mileage = (oItem.Mileage * 0.001).toFixed(2);
            //oTemp.Lng = parseFloat(oItem.Poi.MapPoint.Lon).toFixed(6);
            //oTemp.Lat = parseFloat(oItem.Poi.MapPoint.Lat).toFixed(6);
            var latlng =ES.CoordTrans.gcj_encrypt(oItem.Lat,oItem.Lon);// parseFloat(oItem.Lon).toFixed(6);
            oTemp.Lng =latlng.lon;
            oTemp.Lat =latlng.lat;
            oTemp.Direction = oItem.Direction;
            oTemp.GpsTime = oItem.GpsTime;
            oTemp.GpsDate = ES.Util.dateFormat(oItem.GpsTime * 1000, 'yyyy-MM-dd hh:mm:ss');
            oTemp.Speed = oItem.Speed;
            oTemp.PoiInfo = oItem.Poi.Address;
            oTemp.PhoneNum = oItem.PhoneNum;
            oTemp.VehicleNo = m_VehicleNo;
            return oTemp;
        });
        return aoTrack;
    },

    // 获得查询参数，如果获得成功返回true，否则返回false
    getReqParam: function () {
        var oParam = this._oParent.getSearchTime();
        if (!oParam) return false;

        this.oReqParam = {
            StartTime: '2000-01-01',
            EndTime: '2000-01-02',
            PhoneNums: ['016202702743'],//[m_PhoneNum],
            MinSpeed: this._oParent.getSearchSpeed(),
            PageSize: 300,
            PageIndex:1,
            IsGpsTimeDesc: 0,
        };

        ES.extend(this.oReqParam, this._oParent.getSearchTime());
        return true;
    },

    //首次加载轨迹数据，点击查询时
    firstReqTrack: function () {

        var bVal = this.getReqParam();
        if (!bVal) {
            return;
        }

        //第一次请求时，要清除查询数据，
        delete this.m_oTrack;
        // 然后在加载数据
        this.m_oTrack = {};
        this.m_oTrackInfo = {nTotalCnt: 0, nTotalPage: 0, nPageSize: 100, nPage: 0};
        //请求数据时，清空数据
        this.aoTrack.splice(0, this.aoTrack.length);
        this.nPage = 1;

        ES.loadAn('body', ' ');
        // 执行请求


        ES.reqData({
                url: this.cUrl,
                data: JSON.stringify(this.oReqParam),
                contentType: 'application/json'
            },
            this.fristCallBack,
            this);

    },

    // 第一次请求返回处理
    fristCallBack: function (oTemp) {
        if(!oTemp  || !oTemp.rtnData ){
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }
        var oTrackInfo =oTemp.rtnData.Data;

        if (!oTrackInfo || !oTrackInfo.DataItems || oTrackInfo.DataItems.length<=0) {
            // 移除遮罩层
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }
        oTrackInfo.DataItems = this.convertGpsData(oTrackInfo.DataItems);

        this.ReqTrackCallBack(oTrackInfo);

        // 用于分页
        this.m_oTrackInfo = {
            nTotalCnt: oTrackInfo.TotalCount,
            nTotalPage: Math.ceil(oTrackInfo.PageSize == 0 ? 0 : oTrackInfo.TotalCount / oTrackInfo.PageSize),
            nPageSize: oTrackInfo.PageSize,
            nPage: oTrackInfo.PageNumber
        };

        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName('firstReqTrackBC'), {
            // 总的轨迹数据
            aoTrack: this.aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: oTrackInfo.DataItems,
            // 轨迹当前页
            nPage: this.m_oTrackInfo.nPage,
            // 总页数
            nTotalPage: this.m_oTrackInfo.nTotalPage,
        });
    },

    //广播查询轨迹接口，也是回调函数,点击查询按钮第一请求
    ReqTrackCallBack: function (oTrackInfo) {
        // 移除遮罩层
        ES.removeAn('body', ' ');

        // 设置页号
        this.oReqParam.PageIndex = this.oReqParam.PageIndex + 1;

        // 设置当页轨迹
        this.m_oTrack[oTrackInfo.PageNumber] = oTrackInfo.DataItems;

        // 合并轨迹
        $.merge(this.aoTrack, oTrackInfo.DataItems);

        this.aoTrack.sort(function (a, b) { return a.GpsTime > b.GpsTime ? 1 : -1 });


    },

    //timer时间到了，再次请求数据
    timerReqTrack: function () {

        //在请求前判断是否结束请求
        var nBeginReqPage = this.oReqParam.PageIndex;

        if (nBeginReqPage > this.m_oTrackInfo.nTotalPage) {
            //结束轨迹回放,修改按钮状态
            this._oParent.fire(this._oParent.getEvenName('playFinish'), { nPage: nBeginReqPage });
            ES.aWarn('历史轨迹播放完毕！');
            return;
        }

        if (this.m_oTrack.hasOwnProperty(nBeginReqPage)) {

            this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
                aoTrack: this.aoTrack,
                aoPageTrack: this.m_oTrack[nBeginReqPage],
                nPage: nBeginReqPage,
                nTotalPage: this.m_oTrackInfo.nTotalPage,
            });

            // 下一次请求的分页数
            this.oReqParam.PageIndex = nBeginReqPage + 1;

            return;
        };

        ES.loadAn('body');

        // 执行请求
        //ES.getData(JSON.stringify(this.oReqParam), this.cUrl, this.timerReqCallBack, this);

        ES.reqData({
                url: this.cUrl,
                data: JSON.stringify(this.oReqParam),
                contentType: 'application/json'
            },
            this.timerReqCallBack,
            this);

    },

    timerReqCallBack: function (oTemp) {
        if(!oTemp  || !oTemp.rtnData ){
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }
        var oTrackInfo =oTemp.rtnData.Data;
        if (!oTrackInfo || !oTrackInfo.DataItems || oTrackInfo.DataItems.length<=0) {
            // 移除遮罩层
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }
        oTrackInfo.DataItems = this.convertGpsData(oTrackInfo.DataItems);
        this.ReqTrackCallBack(oTrackInfo);

        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
            // 总的轨迹数据
            aoTrack: this.aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: oTrackInfo.DataItems,
            // 轨迹当前页
            nPage: oTrackInfo.PageNumber,
            // 总页数
            nTotalPage: this.m_oTrackInfo.nTotalPage,
        });
    },

    sliderReq: function (oData) {
        var nPage = oData.nPage + 1;
        //判断是否有该属性
        if (this.m_oTrack.hasOwnProperty(nPage)) {

            this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
                aoTrack: this.aoTrack,
                aoPageTrack: this.m_oTrack[nPage],
                nPage: nPage,
                nTotalPage: this.m_oTrackInfo.nTotalPage,
            });


            //判断是发有这个属性,返回轨迹
            this.oReqParam.PageIndex = nPage + 1;
            return;
        }
        this.oReqParam.PageIndex = nPage;
        ES.loadAn('body');
        //ES.getData(JSON.stringify(this.oReqParam), this.cUrl, this.sliderReqCallBack, this);

        ES.reqData({
                url: this.cUrl,
                data: JSON.stringify(this.oReqParam),
                contentType: 'application/json'
            },
            this.sliderReqCallBack,
            this);

    },

    sliderReqCallBack: function (oTemp) {
        if(!oTemp  || !oTemp.rtnData ){
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }
        var oTrackInfo =oTemp.rtnData.Data;
        if (!oTrackInfo || !oTrackInfo.DataItems || oTrackInfo.DataItems.length<=0) {
            // 移除遮罩层
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }
        oTrackInfo.DataItems = this.convertGpsData(oTrackInfo.DataItems);
        this.ReqTrackCallBack(oTrackInfo);
        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
            // 总的轨迹数据
            aoTrack: this.aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: oTrackInfo.DataItems,
            // 轨迹当前页
            nPage: oTrackInfo.PageNumber,
            // 总页数
            nTotalPage: this.m_oTrackInfo.nTotalPage,
        });
    },

});