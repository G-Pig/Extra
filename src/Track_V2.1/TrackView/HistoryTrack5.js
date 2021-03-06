/**
 * 报表内容弹出
 * Created by liulin on 2017/2/23.
 */


ES.TrackView.HistoryTrack = ES.Class.extend({
    oOption: {
        nTrackWinWidth: 1000,
        nTrackWinHeight:500,
    },

    _aoHistoryTrackData: [],

    initialize: function (oParent, options, oJqGridOption) {
        this._oParent = oParent;
        options = ES.setOptions(this, options);
        this.initEvent();
        this.initOn();
    },

    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.fristHandler, this);
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.setAllTrackInfo, this);
    },

    initEvent: function () {
        var self = this;
        $(".ex-layout-trackbar .ex-maptool-box.pass").bind("click", function () {
            self.historyTrackWindow()
        });
    },
    //报表容器
    msg: function () {
        var cHtml = '<div class="ex-layout-warning-grid-box">' +
            '<table id="dtHistoryTrackContainer" class="dt-grid-container"></table>'+
            '<div id="historyTracGrdTbar" class="dt-grid-toolbar-container"></div>' +
            '</div>';
        return cHtml;
    },

    //历史轨迹窗口设置
    historyTrackWindow: function () {
        if (!this.oWnd) {
            this.oWnd = this.getWnd();
            this.initGrid();
        }
        this.oWnd.show();
    },
    //空白窗口
    getWnd: function () {
        var cTitle = '历史轨迹';
        var self = this;
        var oHistoryWindow = dialog({
            fixed: true,
            align: "right bottom",
            title: cTitle,
            content: this.msg(),
            width: this.oOption.nTrackWinWidth,
            // height:this.oOption.nTrackWinHeight,
            button:[
                {
                    value: "导出数据",
                    callback: function () {
                        self.exportGrid();
                        return false;
                    },
                    autofocus: true
                },
                {
                    id: 'cancel',
                    value: ES.Lang.BaseDialog[2],
                    callback: function () {
                        if (self.oOption.bRemove) {
                            this.remove();
                        }
                        else {
                            this.close();
                        }
                        return false;
                    }
                },
            ],
            onclose: function () {
                self.oWnd = null;
            },
        });
        return oHistoryWindow;
    },
    //数据内容（行名，数据行，与空白窗口关联）
    initGrid: function () {
        var dtGridOption = {
            lang: 'zh-cn',
            ajaxLoad: false,
            datas: this._aoHistoryTrackData,
            columns: this.getDtGridColumns(),
            gridContainer: 'dtHistoryTrackContainer',
            toolbarContainer: "historyTracGrdTbar",
            tools: "",
            pageSize: 10,
            pageSizeLimit: [10, 20, 30, 50],
            // onSelectRow: function (cId, d, e) {
            //     var record = $(this).data('oData').this._aoHistoryTrackData[parseInt(cId) - 1];
            //     self.initClick(e, record);
            // },
            // loadComplete: function (data) {
            //     $(this).data('oData', data);
            //     self.gridData = data;
            // },
            // gridComplete: function (data) {
            // }
        };
        //报表内容设置
        var dtgrid = this.oAlarmGrid = $.fn.DtGrid.init(dtGridOption);
        dtgrid.load();
    },
    //导出报表
    exportGrid:function(){
        var curTbl = document.getElementById("dtHistoryTrackContainer");
        var oXL = new ActiveXObject("Excel.Application");
        var oWB = oXL.Workbooks.Add();
        var oSheet = oWB.ActiveSheet;
        var Lenr = curTbl.rows.length;
        for (var i = 0; i < Lenr; i++) {
            var Lenc = curTbl.rows(i).cells.length;
            for (var j = 0; j < Lenc; j++)
            {
                oSheet.Cells(i + 1, j + 1).value = curTbl.rows(i).cells(j).innerText;
            }
        }
        oXL.Visible = true;
    },
    //行名
    getDtGridColumns: function () {
        var dtGridColumns = [
            //VehicleNo、、CompanyName
            { id: 'VehicleNo', title: '车牌', columnClass: 'ec-text-center' },
            { id: 'CompanyName', title: '企业', columnClass: 'ec-text-center' },
            { id: 'Speed', title: '速度(Km/h)', columnClass: 'ec-text-center' },
            { id: 'Direction', title: '方向', columnClass: 'ec-text-center' },
            { id: 'Mileage', title: '累积里程(Km)', columnClass: 'ec-text-center' },
            { id: 'Lng', title: '经度', columnClass: 'ec-text-center' },
            { id: 'Lat', title: '纬度', columnClass: 'ec-text-center' },
            { id: 'PoiInfo', title: '位置', columnClass: 'ec-text-center' },
            { id: 'GpsTime', title: '定位时间', columnClass: 'ec-text-center' },
        ];
        return dtGridColumns;
    },
    //表格内点击事件
    initClick: function (e, oModel) {
        var self = this;
        if (!e) {
            return;
        }
        if (e) {
            //点击每一行触发地图画一个点
            self._oParent.fire("TrackView:Penal.drawParkMarker",oModel);
        }
    },
    //第一段轨迹
    fristHandler: function (oData) {
        if (this._aoHistoryTrackData && this._aoHistoryTrackData.length >= 0) {
            this._aoHistoryTrackData.splice(0, this._aoHistoryTrackData.length);
        }
        var aoTrack = this.convertData(oData);
        $.merge(this._aoHistoryTrackData, aoTrack);

        if (!this.oAlarmGrid) return;
        this.oAlarmGrid.reload(true);
    },
    //第二次及以后数据
    setAllTrackInfo: function (oData) {
        var aoTrack = this.convertData(oData);
        $.merge(this._aoHistoryTrackData, aoTrack);

        if (!this.oAlarmGrid) return;
        this.oAlarmGrid.reload(true);
    },
    convertData: function (oData) {
        var aoTrack = oData.aoPageTrack.map(function (oItem) {
            var oTemp = {};
            oTemp.VehicleNo = oItem.VehicleNo;
            oTemp.CompanyName = oItem.CompanyName;
            oTemp.Direction = ES.TrackHelper.getDire(oItem.Direction);
            oTemp.Mileage = (oItem.Mileage * 0.001).toFixed(2);
            oTemp.Lng =oItem.Poi.GeoPoint.Lon;// parseFloat(oItem.Lng).toFixed(6);
            oTemp.Lat =oItem.Poi.GeoPoint.Lat;// oItem.Lat;//parseFloat(oItem.Lat).toFixed(6);
            oTemp.GpsTime =  oItem.GpsDateTime ;
            oTemp.Speed = oItem.Speed;
            oTemp.PoiInfo = oItem.Poi.Address;

            return oTemp;
        });
        return aoTrack;
    },

});