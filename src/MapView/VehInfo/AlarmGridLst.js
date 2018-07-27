/**
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.AlarmGridLst = ES.Class.extend({

    oOption: {
        cDivContain: 'dtAlarmGridContainer',
        cPager: 'dtAlarmGridToolBarContainer',

        nTop: 600,
        cTagAlarm: '.ex-theme-cardetail-warning >.stats-card'
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this._aoData = [];

        this.oAlarmData = {};

        this.initGrid();
    },

    //初始化所有的gird控件
    initGrid: function () {
        var self = this;

        var dtGridOption = {
            lang: 'zh-cn',
            ajaxLoad: false,
            check: false,
            exportFileName: '告警列表',
            datas: this._aoData,
            columns: this.getColumns(),
            gridContainer: this.oOption.cDivContain,
            toolbarContainer: this.oOption.cPager,
            tools: "",//'refresh|faseQuery|advanceQuery|export[excel,csv,pdf,txt]|print',
            pageSize: 30,
            pageSizeLimit: [10, 20, 30, 50]
        };

        var dtgrid = $.fn.DtGrid.init(dtGridOption);
        this.dtGrid = dtgrid;
        // 设置grid高度
        $("#" + this.oOption.cDivContain).height(200);

        dtgrid.reload(false);
    },

    // 设置列单元
    getColumns: function () {

        var self = this;
        var aoCol = [
            { id: 'VehicleNo', title: '车牌号', type: 'string', columnClass: 'text-center' },
            { id: 'CompanyName', title: '所属企业', type: 'string', columnClass: 'text-center',width:100 },
            { id: 'AlarmTypeStr', title: '报警描述', type: 'string', columnClass: 'text-center'  },
            {id: 'StartAlarmTime', title: '报警开始时间', type: 'string', columnClass: 'text-center'},
            {id: 'EndAlarmTime', title: '报警结束时间', type: 'string', columnClass: 'text-center'},
            { id: 'Address', title: '最后报警位置', type: 'string', columnClass: 'text-center' },
            //{
            //    id: 'operation', title: '操作', type: 'string', columnClass: 'text-center grid-blue', resolution: function (value, record, column, grid, dataNo, columnNo) {
            //        var content = '';
            //        content += '<a  href="javascript:void(0);" title="定位"><i class="ec-icon-link"></i></a>';
            //        content += '&nbsp;&nbsp;';
            //        content += '<a  href="javascript:void(0);"  title="处理" ><i class="ec-icon-pencil"></i></a>';
            //        content += '&nbsp;&nbsp;';
            //        return content;
            //    }
            //}
        ]

        return aoCol;

    },

    //切换告警数据源，需要情况当前的所有告警信息，重新查询数据，绑定数据到grid中
    swithAlarmData: function (oGpsInfo) {
        this.clearGrid();

        // 保存当前订阅的车数据，如果告警查询返回和当前的设备号不一致，不与绑定数据
        this.oGpsInfo = oGpsInfo;

        var oReqAlarm = {
            devNo: oGpsInfo.devNo,
            AlarmType: 0,
            BeginTime: parseInt((new Date().getTime() - 5 * 60 * 60 * 1000) / 1000),
            EndTime: parseInt(new Date().getTime() / 1000),
            PageIndex: 1,
            PageSize: 100,
            DistrictCode: 420000,
            Src: null
        }

        //loadAnimate($(this.oOption.cTagAlarm), null);

        // 获得告警数据
        ES.getData(oReqAlarm,  ES.MapView.oConfig.getAlarmDetailPaing, this.vehAlarmHandler, this);
    },

    // 生成数据绑定,第一次加载数据
    vehAlarmHandler: function (oAlarmData) {
        if (!oAlarmData || !oAlarmData.dataList || oAlarmData.dataList.length <= 0) {
            return;
        }
        if (this.oGpsInfo.devNo !== oAlarmData.dataList[0].PhoneNum){
            return;
        }
        for(var i = 0;i<oAlarmData.dataList.length;i++){
            oAlarmData.dataList[i].Address = oAlarmData.dataList[i].EndPoi.Address;
        }
        // 合并结果集合
        $.merge(this._aoData, oAlarmData.dataList);

        // 重新加载数据
        this.dtGrid.reload(true);
    },

    // 实时推送的数据加入到grid中
    addAlarm: function (oRealAlarm) {
        if (!oRealAlarm) return;

        for (var cKey in oRealAlarm) {

            // 加告警消息
            this._aoData.unshift(oRealAlarm[cKey]);

            // 删除最后一条记录
            if (this._aoData.length >= this.oOption.nTop) {
                this._aoData.splice(this.oOption.nTop, 1);
            }
        }

        this.dtGrid.reload(true);
    },

    // 清空 grid
    clearGrid: function () {
        if (!this._aoData || this._aoData.length <= 0) return;

        // 清空数据
        this._aoData.splice(0, this._aoData.length);

        if (!this.dtGrid) return;
        this.dtGrid.reload(true)
    },

});