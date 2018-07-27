/**
 * 警告弹出
 * Created by liulin on 2017/9/1.
 */
//备用
ES.HubSvrEvent = ES.Class.extend({
    oOption: {
        _t:0
    },
    initialize: function(oOption,type,data) {
        this._status = type;//1报警
        this.userData = data;
        this.tempAlert(oOption);
        this.clickEvent();
    },
    clickEvent:function(){
        var self = this;
    },
    tempAlert : function(data) {
        if (this.oOption._t > 20) {
            this.oOption._t = 0;
            $('.ex-layout-alert-box-list').empty();
            this.showAlert(data);
        } else {
            this.showAlert(data);
        }
    },
    showAlert: function (Data) {

        if (Data.length <= 0)
            return;
        this.oOption._t += 1;
        //临时牌照
        var datas = new Array();

        var _status =  this._status;
        //alertObj.id = (Math.floor(Math.random() * 99999));
        //attr_type  (1：报警，2：消息，3：task，11：消息汇总)
        for (var i = 0; i < Data.length; i++) {
            var alertObj = new Object();
            var info = Data[i];
            info.Propertys[2] = this.userData[info.PhoneNum];
            _status = info.MesType;
            switch (_status) {
                case 1:
                    alertObj.type = 'alert';
                    alertObj.number = info.Propertys[2];
                    alertObj.icon = 'exclamation-triangle';
                    alertObj.content = ES.TrackHelper.getAlarmTypeName(info.AlarmType);
                    alertObj.PhoneNum = info.PhoneNum;
                    alertObj.Hhref = "/MapView/TrackViewV2?PhoneNum="+ info.PhoneNum +"&VehicleNo=" + info.Propertys[2];
                    //alertObj.time = new Date(info.AlarmDateTime.replace('T', ' ')).Format("yyyy-MM-dd hh:mm:ss");
                    alertObj.time = info.AlarmDateTime.replace('T', ' ');
                    alertObj.attr_type = "1";
                    break;
                case 2:
                    alertObj.type = 'message';
                    alertObj.number = '发件人：' + info.SendUserName;
                    alertObj.icon = 'commenting';
                    //if (info.Title.length > 50) {
                    //    msg = info.Title.substr(0, 50);
                    //}
                    //if (msg.length >= 25)
                    //{
                    //    if (msg.length >= 25)
                    //        msg = msg.substr(0, 25) + "<br />" + msg.substr(25, msg.length);
                    //}

                    alertObj.content = info.Title;
                    if (info.CreateTime != null) {
                        alertObj.time = info.CreateTime.replace('T', ' ');
                    }
                    alertObj.attr_type = "2";
                    break;
                case 3:
                    alertObj.type = 'tasks';
                    alertObj.number = '创建人：' + (Math.floor(Math.random() * 999));
                    alertObj.icon = 'tasks';
                    alertObj.content = '任务简介任务简介任务简介任务简介任务简介任务简介任务简介任务简介任务简介';
                    alertObj.attr_type = "3";
                    break;
                default:
                    alertObj.type = 'alert';
                    alertObj.number = '鄂A' + (Math.floor(Math.random() * 99999));
                    alertObj.icon = 'exclamation-triangle';
                    alertObj.content = '车辆未密闭';
                    alertObj.attr_type = "2";
                    break;
            }
            if (info.AlarmType != 5 && info.AlarmType != 6 && info.AlarmType != 7 && info.AlarmType != 8) {
                datas.push(alertObj);

                obj_datalis.push(alertObj);
            }

        }
        //var data = {
        //    list: datas
        //};
        //obj_datalis.push(data);

        // this.alert = template('alertTpl', data);
        //$('.ex-layout-alert-box-list').prepend(this.alert);
        //this.openTips();

    },
    openTips:function(){
        $('.ex-layout-home').stop().animate({ "width": "87%" }, 800);
        $('.ex-layout-alert-box').stop().animate({ "width": "13%" }, 800);
    },
    closeTips:function(){
        $('.ex-layout-home').stop().animate({ "width": "100%" }, 800);
        $('.ex-layout-alert-box').stop().animate({ "width": "0%" }, 800);
        //$('.ex-layout-alert-box-list').empty();
        $('.ex-layout-alert-box-tab > li').removeClass('ec-active').eq(0).addClass('ec-active');
    },
});
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
