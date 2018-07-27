/**
 * Created by Lenovo on 2017/12/13.
 */


// 可疑消纳点
ES.MapBase.DoubtUnload = ES.MapBase.DoubtSite.extend({
    // 数据分析， 分析每个工地的数据
    getPopupContent: function (oPopContent, oGpsInfo) {

        var cVehHtml = this.setSiteTable(oGpsInfo.Vehs);
        {
            // 设置工地详情
            var cSiteHtml = "<div style='width:300px'><strong>名称：</strong>" + oGpsInfo.PlaceName + " <div>" +
                "<div cId='divContent'>" +
                " <div><ul class='siteview-siteinfo'>" +
                "<li><strong>开始消纳时间：</strong> " + ((!oPopContent.nBeginTick) ? "" : es.comFunc.dateFormat(oPopContent.nBeginTick * 1000, "yyyy-MM-dd hh:mm:ss")) + "  </li>" +
                " <li><strong>最新消纳时间：</strong> " + ((!oPopContent.nEndTick) ? "" : es.comFunc.dateFormat(oPopContent.nEndTick * 1000, "yyyy-MM-dd hh:mm:ss")) + " </li>" +
                " <li><strong>所属区域：</strong>" + oGpsInfo.cRegion + "</li>" +
                //" <li><strong>工地位置：</strong>" + oGpsInfo.SiteAddress + "</li>" +
                " <li><strong>消纳次数：</strong>" + ((!oPopContent.nCnt) ? 0 : oPopContent.nCnt) + "</li>" +
                " <li><strong>消纳车辆数：</strong>" + (oPopContent.nCntVeh ? oPopContent.nCntVeh : 0) + "</li>"+
                " <li><a cid='DU" + oGpsInfo.id + "' onclick='addTask(this,4)' class='btn btn-sm btn-success' onclick='addTask(this,2)' style='position: absolute;top: 35%;right: 15px;color: #fff;'>发布任务</a></li>";




            cSiteHtml += "</ul></div>"

            var cVehInfo = '<div style="height: ' + this.calHeigh(oGpsInfo.Vehs) + 'px; overflow-y: auto">  <table class="siteview-vehinfo-table" style="width:100%">'
            cVehInfo += '<thead class="siteview-vehinfo-table-th"><tr>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-vehno" style=""> 车牌号</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-date" style="">消纳时间</th>'
            cVehInfo += '<th class="siteview-vehinfo-table-th-opr" style="">	操作  </th></tr> </thead>'
            cVehInfo += '<tbody class="siteview-vehinfo-table-tb">'
            cVehInfo += (cVehHtml || "") + " </tbody> </table></div></div>"
            var cAllHtml = cSiteHtml + cVehInfo;
        }
        return cAllHtml;
    },

    initPopup: function (oPopup) {

        var self = this;

        if (!oPopup) return;

        oPopup.on("contentupdate", function () {

            var oGpsInfo = this.oGpsInfo;
            $("a[cid='DU" + oGpsInfo.id + "']").data("oGpsInfo", oGpsInfo);

        })
    },
})