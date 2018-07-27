/**
 * 负责加载grid数据
 *
 * Created by liulin on 2017/8/31.
 */
ES.Muck.DriverGrid = ES.Common.BaseJqGrid.extend({

    setColumns: function () {
        var list = [
            { label: '司机姓名', name: 'Name', align: 'center', width: 60 },
            { label: '司机电话', name: 'Phone', align: 'center' },
            { label: '司机所属公司', name: 'EnterpriseName', align: 'center', width: 60 },
            {
                label: '是否录入指纹', name: 'IsFinger', align: 'center', width: 80,
                formatter: function (val, itm, opt) {
                    if(val == 1){
                        return "已录入";
                    }else {
                        return "未录入";
                    }
                }
            },
            {
                label: "操作",
                name: "actions",
                align: 'center',title: false,
                formatter: function formatHtml(cellValue, options, rowObject) {

                    var content = '';

                    content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-primary edit"' + DriverAuth.driverEdit + '><i class="ec-icon-edit edit"></i> 编辑</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default ec-radius del"' + DriverAuth.driverDel + '><i class="ec-icon-trash-o del"></i> 删除</button>';

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
        if ($(e.target).hasClass('edit')) {
            this._oParent.oEditD = new ES.Common.Dialog(this._oParent, { bRemove: true, cUrl: '/DriverInfo/Edit' });
            this._oParent.oEditD.editShow(oModel.Id);
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent, { bRemove: true, cUrl: '/DriverInfo/Delete' }, {
                title: '删除操作-用户',
                content: '是否要删除数据！'
            });
            //oModel = { drId: oModel.Id };
            this._oParent.oDelD.del(oModel);
        }
    }
});



