
ES.HubSvr = ES.Class.extend({
    oOption: {
        // hub 服务地址
        cHubUrl: '',
        // 超时时长
        nTimeOut: 10000,

        // hub 服务名称
        cSvrName:'GpsHub',

        // 推送服务
        aoClientName:[{cSvrFn:'sendAlarm',on:'ReceiveHGTAlarm'}],
    },
    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.afnCallBack = [];
        this.initSvr();
        // 启动hub服务
        this.start();
        // 注册接受回调数据
        //this.onReceiveGPS();
        this.onReceiveAlarm();
        // 开启监听
        this.initOn();
    },
    initSvr: function () {
        var self = this;
        $.connection.hub.url = this.oOption.cHubUrl;
        $.connection.hub.logging = true;
        this.svrBoss = $.connection[this.oOption.cSvrName];
        this.oConnection = $.connection.hub;
        var oConnection = this.oConnection;
        //断开超时时间
        var nTimeOut = this.oOption.nTimeOut;
        if(!this.oConnection.disconnected){
            return;
        }
        this.oConnection.disconnected(function () {
            console.log('disconnected id: ' + oConnection.id + ' state: ' + oConnection.state + '  ' + new Date().getSeconds().toString());
            setTimeout(function () {
                self.start();
            }, nTimeOut);
        });
        this.oConnection.error(function (error) {
            console.log('Error: ' + error);
        });
    },
    //开启hub监听，开启之后 在内存中 读取订阅数据，重新订阅
    start: function () {
        var oConnection = this.oConnection;
        var self = this;
        var hubSvr = null;
        try {
            hubSvr = this.oConnection.start()
        }
        catch (e) {
        }
        if (!hubSvr) {
            return;
        }
        hubSvr.done(function () {
            if (self.afnCallBack && self.afnCallBack.length > 0) {
                for (var i = 0; i < self.afnCallBack.length; i++) {
                    var oTemp = self.afnCallBack[i];
                    oTemp.fn.call(oTemp.oContext, oTemp.oData);
                }
            }
            console.log('started transport: ' + oConnection.transport.name + ' ' + oConnection.id);
        }).fail(function (err) {
            console.log('Could not connect.' + err);
        });
    },
    initOn: function () {
        this._oParent.on('HubSvr:subAlarm', this.subAlarm, this);
    },
    //停止hub监听
    stop: function () {
        this.oConnection.stop();
    },
    subAlarm: function (oData) {
        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._subAlarm, oContext: this, oData: oData});
        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }
        this._subAlarm(oData);
    }
});
