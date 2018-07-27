/**
 * 负责加载grid数据
 *
 * Created by liulin on 2017/8/31.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({

    setColumns:function(){
       var list =  [
           { label: '车牌号', name: 'VehicleNo', width: 100, key: true, align: 'center' },
           //{ label: '设备号', name: '_MainDeviceNo', width: 150, align: 'center' },
           //{ label: 'SIM卡号', name: '_MainDeviceSim', width: 150, align: 'center' },
           //{ label: '服务号', name: '_MainServiceNum', width: 150, align: 'center' },
           { label: '企业名称', name: 'ResourceTypeName', width: 150, align: 'center' },
           { label: '司机', name: 'Contact', width: 80, align: 'center' },
           { label: '司机电话', name: 'ContactPhone', width: 120, align: 'center' },
           { label: '车辆品牌', name: 'DeviceBrandStr', width: 120, align: 'center' },
           { label: '道路运营许可证号', name: 'TransportBusiness', width: 120, align: 'center' },
           // { label: '资质状态', name: 'TransportBusiness', width: 120, align: 'center' },
           // { label: '是否安装设备', name: 'TransportBusiness', width: 120, align: 'center' },
            // {
            //     label: "操作",
            //     name: "actions",
            //     align: 'center',
            //     width: 150,
            //     formatter: function formatHtml(cellValue, options, rowObject) {
            //
            //         var content = '';
            //         // content+= '<button class="ec-btn ec-radius ec-btn-xs ec-btn-primary edit"><i class="ec-icon-edit edit"></i> 编辑</button>';
            //         // content+= '  ';
            //         content+= '<button class="ec-btn ec-btn-xs ec-btn-default ec-radius del"><i class="ec-icon-trash-o del"></i> 删除</button>';
            //
            //         return content;
            //     }
            // }
        ];

        this.aoCol = list;
    },

    // initClick: function (e, oModel) {
    //     if (!e) {
    //         return;
    //     }
    //     // if ($(e.target).hasClass('edit')) {
    //     //     this._oParent.oEditD = new ES.Common.Dialog(this,{bRemove:true,cUrl:'/Vehicle/Edit'});
    //     //     this._oParent.oEditD.editShow(oModel.RoleId);
    //     // }
    //     if ($(e.target).hasClass('del')) {
    //         this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/Vehicle/Delete'},{
    //             title: '删除操作-车辆',
    //             content: '是否要删除数据！'});
    //         this._oParent.oDelD.del(oModel);
    //     }
    // }
});



