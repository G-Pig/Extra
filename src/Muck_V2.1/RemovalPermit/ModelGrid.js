/**
 * 查看车辆Grid弹框
 *
 * Created by YangHang on 2017/12/5.
 */

ES.Muck.ModelGrid = ES.Common.BaseJqGrid.extend({

    setColumns:function(){
        var list =  [
            { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center' },
            { label: '所属区域', name: 'DistName', editable: true, align: 'center' },
            { label: '所属企业', name: 'ResourceTypeName', editable: true, align: 'center',width:180},
            { label: '企业法人', name: 'LegalName', editable: true, align: 'center' },
            { label: '联系电话', name: 'LegalPhone', editable: true , align: 'center'},
        ];

        this.aoCol = list;
    },

    initClick: function (e, oModel) {

    },
    resizeBody: function () {

    },
});



