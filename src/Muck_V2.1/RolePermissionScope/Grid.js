/**
 * 负责加载grid数据
 *
 * Created by liulin on 2017/8/31.
 */

ES.Muck.RoleGrid = ES.Common.BaseJqGrid.extend({

    setColumns: function () {
        var list = [
            //{ label: '角色ID', name: 'RoleId', align: 'center', width: 40 },
            { label: '角色名称', name: 'RoleName', align: 'center', },
            { label: '所属组织', name: 'DeptName', align: 'center' },
            {
                label: "操作",
                name: "actions",
                align: 'center',
                width: 150,
                formatter: function formatHtml(cellValue, options, rowObject) {

                    var content = '';
                    content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-success editResource"' + RolePermissonScope.RolePermissonScopeAuth + '><i class="ec-icon-list-ul editResource"></i> 数据权限</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default ec-radius del"' + RolePermissonScope.RolePermissonScopeDel + '><i class="ec-icon-trash-o del"></i> 删除</button>';

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
        if ($(e.target).hasClass('editResource')) {
            this._oParent.oEditD = new ES.Common.Dialog(this._oParent, { bRemove: true, cUrl: '/DepartMent/GetSysDepartmentTree' });
            //oModel = { roleId: oModel.Id };
            //edit(oModel.Id);
            this._oParent.oEditD.editShow(oModel.Id);
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent, { bRemove: true, cUrl: '/RolePermissionScope/Delete' }, {
                title: '删除操作-用户',
                content: '是否要删除数据！'
            });
            //oModel = { RoleId: oModel.Id };
            this._oParent.oDelD.del(oModel);
        }
    }
});
