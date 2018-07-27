/**
 * 负责加载grid数据
 *
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
        this.initUI();
        this._countUrl = oJqGridOption.countUrl;
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
                    self.gridData = data;
                    $(this).data('oData', data);
                },
                gridComplete: function (data) {
                }
            });
    },

    setColumns:function(){
       var list =  [
            { label: '车牌号', name: 'VehicleNo', editable: true,sortable: false,width:60, align: 'center'},
            { label: '企业名称', name: 'Enterprise', editable: true,sortable: false,width:120, align: 'center' },
            {
                label: '速度', name: 'AvgSpeed', editable: true, sortable: false,width:60, align: 'center',
                formatter:function(val){
                    return val + "km/h"
                }
            },
           { label: '开始时间', name: 'BeginTime', editable: true, sortable: false,width:50, align: 'center'},
           { label: '结束时间', name: 'EndTime', editable: true, sortable: false,width:50, align: 'center'},
           {
               label: '往返类型', name: 'Type', editable: true, sortable: false,width:50, align: 'center',
               formatter:function(val){
                   if(val == "1"){
                       return '<span class="ec-text-primary">起点-终点</span>';
                   }else{
                       return '<span class="ec-text-warning">终点-起点</span>';
                   }
               }
           },
           // { label: '里程数', name: 'Mileage', editable: true, sortable: false,width:70, align: 'center'},

           {
                label: '操作',
                name: 'actions',
                width: 100,
                sortable: false,
                title: false,
                align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var content = '';
                    content += '<button  class="ec-btn ec-btn-xs ec-btn-default ec-radius view"' + btnAuth.aTrack + '><i class="ec-icon-eye view"></i>  查看轨迹</button>';
                    return content;
                }
            }
        ];

        this.aoCol = list;
    },
    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('view')) {
            window.open("/MapView/TrackViewV2?PhoneNum=" + oModel.PhoneNum + "&VehicleNo=" + oModel.VehicleNo);
        }
    },

});


