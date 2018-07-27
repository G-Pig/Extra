/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({

    // 查询gird 用户信息
    setColumns: function () {
            this.aoCol =[
                { label: '车辆编码', name: 'Code', align: 'center' },
                { label: '车辆简称', name: 'VehTeam', align: 'center' },
                { label: '车牌号', name: 'VehicleNo', align: 'center' },
                {
                    label: '操作',
                    name: '',
                    width: 150,
                    align: 'center',title: false,
                    formatter: function (cellValue, options, rowObject) {
                        var content = '  ';
                        content += '<button  class="ec-btn ec-btn-xs ec-btn-primary ec-radius edit"' + WeighBridgeType.edit + '><i class="ec-icon-edit edit"></i>  编辑</button>';
                        //content += '  ';
                        //content += '<button class="ec-btn ec-btn-xs ec-btn-danger ec-radius del"' + WeighBridgeType.del + '><i class="ec-icon-trash-o del"></i>  删除</button>';

                        return content;
                    }
                }
            ];
    },

    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('edit')) {
            this._oParent.oEditD = new ES.Common.Dialog(this._oParent,{bRemove:true,cUrl:'/WeighBridgeType/Edit'},{width:800});
           // oModel = "Code="+"'"+ oModel.Code+"'"+"";
            this._oParent.oEditD.editShow(oModel);
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/WeighBridgeType/Delete'},{
                title: '删除操作-车辆',
                content: '是否要删除数据！'});
            this._oParent.oDelD.del(oModel);
        }
    }
});

