
var TaskHubMgr = function (url, userid) {
    var timeout = 5000;

    jQuery.support.cors = true;
    $.connection.hub.url = url
    var gpshub = $.connection.GpsHub;
    var hub = $.connection.hub;


    var tasks = [];  //任务通知

    var init = function () {
        hub.disconnected(function () {
            log('disconnected.' + new Date().getSeconds().toString());
            setTimeout(function () {
                log('reconnect...' + new Date().toString());
                hub.start().done(function () {
                    log("reconn succ.");
                });
            }, timeout); // Restart connection after 5 seconds.
        });


        gpshub.client.handlerAlarm = function (items) {
            if (items.length == 0) return;
            new ES.HubSvrEvent(items,1);
        };


    };

    var start = function () {
        hub.start().done(function () {
            log("start succ.");

        }).fail(function (err) {
            log(err);
            console.log('Could not connect.' + err);
        });
    };

    this.initHub = function () {
        init();
        start();
        gpshub.server.subAlarm(userid);
    };

    this.getTasks = function () {
        return tasks;
    };

    //删除某条任务信息
    this.readTask = function (sid) {
        var index = -1;
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i].sid == sid) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            tasks.splice(index, 1);
        }
    }
};

