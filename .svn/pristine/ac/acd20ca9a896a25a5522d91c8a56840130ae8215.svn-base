/**
 * 警告渲染
 * Created by liulin on 2017/9/1.
 */
var obj_datalis = [];

setInterval("addToTpl()", 3000);

function addToTpl() {
    var _type = $('.ex-layout-alert-box-tab >li.ec-active').attr('data-type');
    if (_type == "alert")
    {
        var obj_datalis_alert =[]
        $(obj_datalis).each(function (i, v) {
            if (v.type == "alert")
            {
                obj_datalis_alert.push(v);
            }
        })
        obj_datalis = obj_datalis_alert;
    }
    if (_type == "message")
    {
        var obj_datalis_message = []
        $(obj_datalis).each(function (i, v) {
            if (v.type == "message") {
                obj_datalis_message.push(v);
            }
        })
        obj_datalis = obj_datalis_message;
    }




    if (obj_datalis.length > 0) {
        if(obj_datalis.length>15)
        {
            var hasSame_1 = obj_datalis[0];
            var al_sameDatas = [];
            var samect = 0;
            for (var k = 0; k < obj_datalis.length; k++) {
                if (obj_datalis[k].type == hasSame_1.type) {
                    samect++;
                    if (samect >= 50)
                    {
                        break;
                    }
                }
                else {
                    break;
                }
            }
            var data;
            if (samect >= 10)
            {
                al_sameDatas = obj_datalis.slice(0, samect);
                var totalCT = obj_datalis[0];
                var tcontent = obj_datalis[0].content;
                totalCT.totalCount = al_sameDatas.length;
                var samnumber = []
                totalCT.content = "";
                $(al_sameDatas).each(function (v, i) {
                    var isHas = $.inArray(i.number, samnumber);
                    if (isHas == -1) {
                        samnumber.push(i.number);
                        totalCT.content += i.number + ",";
                    }
                })
                if (al_sameDatas.length > 0)
                {
                    totalCT.content = totalCT.content.substr(0, totalCT.content.length - 1);
                    //if (totalCT.content.length > 71)
                    //{
                    //    totalCT.content = totalCT.content.substr(0, 71);
                    //}
                }
                totalCT.number = tcontent;
                totalCT.attr_type = "11";
                data = {
                    list: [totalCT]
                };
                obj_datalis.splice(0, samect);
            }
            else
            {
                var data = {
                    list: [obj_datalis[0]]
                };
                obj_datalis.splice(0, 1);
            }
            var al = template('alertTpl', data);
            $('.ex-layout-alert-box-list').prepend(al);
            if ($('.ex-layout-administrator i.ec-icon-bell').find('span.ex-dot-tips').length == 0) {

                $('.ex-layout-administrator i.ec-icon-bell').append('<span class="ex-dot-tips">&nbsp;</span>');
            }

            //$('.ex-layout-home').stop().animate({ "width": "87%" }, 800);
            //$('.ex-layout-alert-box').stop().animate({ "width": "13%" }, 800);

        }
        else
        {
            //原本的方法
            /*var data = {
             list: [obj_datalis[0]]
             };
             var al = template('alertTpl', data);
             $('.ex-layout-alert-box-list').prepend(al);*/

            //现在的方法
            var dKey = 1;
            var dList = [];
            if (obj_datalis[0]) {
                dlist.push(obj_datalis[0]);
                return dList;
            };
            sessionStorage.setItem(dkey++, JSON.stringify(dList));//将推送消息存储在本地
            var data = {};
            var newArr = [];
            if (sessionStorage.length <= 0) {
                return data;
            } else {
                for (var i = 0; i < sessionStorage.length; i++) {
                    var sKey = sessionStorage.key[i];
                    var sValue = JSON.parse(storage.getItem(sKey));
                    newArr.push(sValue);//返回所有缓存中的value，是对象数组
                }
                for (var j = 0; j < sValue.length; j++) {
                    if (obj_datalis[0].attr_type == sValue[j].attr_type && obj_datalis[0].number == sValue[j].number) {
                        if ($('.ex-layout-alert-box-list .attr-num').val() == sValue[j].number) {
                            var showTimes = 1;
                            $("li[attr-num=" + sValue[j].number + "]").children('i').eq(0).after("<i style='color:#F3DA1D'>" + showTimes++ + "</i>次");//渲染次数
                            return;
                        }
                    } else {
                        data = {
                            list: [obj_datalis[0]]
                        }
                        var al = template('alertTpl', data);//当数据不重复的时候进行渲染
                        $('.ex-layout-alert-box-list').prepend(al);
                        return;
                    }
                };
            };
            if ($('.ex-layout-administrator i.ec-icon-bell').find('span.ex-dot-tips').length == 0) {

                $('.ex-layout-administrator i.ec-icon-bell').append('<span class="ex-dot-tips">&nbsp;</span>');
            }

            //$('.ex-layout-home').stop().animate({ "width": "87%" }, 800);
            //$('.ex-layout-alert-box').stop().animate({ "width": "13%" }, 800);
            obj_datalis.splice(0, 1)
        }
    }
}

