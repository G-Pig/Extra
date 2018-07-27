/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({

    // 查询gird 用户信息
    setColumns: function () {

        this.aoCol = [
            { label: '工地名称', name: 'SiteName', align: "center", sortable: false },
            { label: '所属片区', name: 'AreaName', align: "center", sortable: false },
            { label: '出土开始日期', name: 'WorkTimeStart', align: "center", sortable: false },
            { label: '出土结束日期', name: 'WorkTimeEnd', align: "center", sortable: false },
            { label: '上报日期', name: 'CurrentTime', align: "center", sortable: false },
            { label: '上报状态', name: 'IsUploadingStr', align: "center", sortable: false },
            { label: '当日出土车辆数', name: 'VehicleCount', align: "center", sortable: false },
            { label: '当日运输次数', name: 'TransportCount', align: "center", sortable: false },
            { label: '出土状态', name: 'WorkTypeStr', align: "center", sortable: false },
            { label: '开始出土时间', name: 'FirstWorkDate', align: "center", sortable: false },
            { label: '最新出土时间', name: 'LastWorkDate', align: "center", sortable: false },

        ];
    },

});

