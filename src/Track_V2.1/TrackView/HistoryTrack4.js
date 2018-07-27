/**
 * 报表内容弹出
 * Created by liulin on 2017/2/23.
 */
//弹窗详情页
ES.TrackView.HistoryTrack = ES.Common.BaseDialog.extend({
    oOption: {
        nTrackWinWidth: 1000,
        nTrackWinHeight:500,
    },
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    afterOpen: function (id) {
        this.oModelGrid = new ES.TrackView.ModelGrid(this, {
            // 容器
            cContainer: '.ex-layout-warning-grid-box',
            // grid id
            cGridContainer: 'dtHistoryTrackContainer',
            // 分页菜单id
            cPagerContainer: 'historyTracGrdTbar',
        });
        this.oModelGrid.initGrid({ width: this.oOption.nTrackWinWidth, height: this.oOption.nTrackWinHeight });
    },
    //报表容器
    msg: function () {
        var cHtml = '<div class="ex-layout-warning-grid-box">' +
            '<div class="ec-u-sm-12">' +
            '   <button type="button" id="exportBtn" class="ec-btn ec-btn-xs ec-btn-warning">' +
            '       <i class="ec-icon-file-excel-o"></i> 导出 </button>' +
            '</div>' +
            // '<div id="dtHistoryTrackContainer" class="dt-grid-container" style="width:100%;height:80%;clear:both"></div>' +
            '<table id="dtHistoryTrackContainer" class="dt-grid-container"></table>'+
            '<div id="historyTracGrdTbar" class="dt-grid-toolbar-container"></div>' +
            '</div>';
        return cHtml;
    },
    //初始化事件 窗口显示和导出按钮
    initEvent: function () {
        var self = this;
        $(".ex-layout-trackbar .ex-maptool-box.pass").bind("click", function () {
            self.historyTrackWindow()
        });
        $('.ex-layout-warning-grid-box').find("#exportBtn").bind('click',function(){
            var curTbl = document.getElementById("dtHistoryTrackContainer");
            var oXL = new ActiveXObject("Excel.Application");
            var oWB = oXL.Workbooks.Add();
            var oSheet = oWB.ActiveSheet;
            var Lenr = curTbl.rows.length;
            for (var i = 0; i < Lenr; i++)
            {        var Lenc = curTbl.rows(i).cells.length;
                for (j = 0; j < Lenc; j++)
                {
                    oSheet.Cells(i + 1, j + 1).value = curTbl.rows(i).cells(j).innerText;
                }
            }
            // oXL.Visible = true;
        })
    },
    //历史轨迹窗口设置
    historyTrackWindow: function () {
        if (!this.oWnd) {
            this.oWnd = this.getWnd();
            this.initGrid();
        }
        this.oWnd.show();
    },
    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.fristHandler, this);
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.setAllTrackInfo, this);
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

ES.TrackView.ModelGrid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
        var self = this;
        ES.extend(
            this.oJqGridOption,
            oJqGridOption,
            {
                onSelectRow: function (cId, d, e) {
                    var record = $(this).data('oData').dataList[parseInt(cId) - 1];
                    self.initClick(e, record);
                },
                colModel: this.aoCol,
                pager: '#' + this.oOption.cPagerContainer,
                loadComplete: function (data) {
                    $(this).data('oData', data);
                    self.gridData = data;
                }
            });
    },
    setColumns: function () {
        var list = [
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

        this.aoCol = list;
    },

    initClick: function (e, oModel) {

    },
    resizeBody: function () {

    },
});