/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({

    // 查询gird 用户信息
    setColumns: function () {

        this.aoCol = [
            { label: '帐号', name: 'Account', width: 100,   align: 'center' },
            { label: '姓名', name: 'Name', width: 100, align: 'center' },
            { label: '角色名', name: 'RolesStr', width: 100, align: 'center' },
            { label: '性别', name: 'Sex', width: 50, align: 'center',
                formatter:
                    function (val, opt, item) {
                        if (val == 1) {
                            return "男";
                        } else {
                            return "女";
                        }
                    }},

            { label: '所属部门', name: 'DepartmentName',width: 150,align: 'center' },
            /*{
                label: '是否启用', name: 'IsEnabled', width: 60, align: 'center',
                formatter:
                    function (val,opt,item) {
                        if (val) {
                            return "启用";
                        } else {
                            return "禁用";
                        }
                    }
            },*/
            { label: 'Email', name: 'Email', width: 100, align: 'center' },
            { label: '联系电话', name: 'Phone', width: 100, align: 'center' },
            {
                label: "操作",
                name: "actions",
                width: 240,
                align: 'center',title: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-success editRole"' + UserAuth.userroleset + '><i class="ec-icon-key editRole"></i> 用户角色</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-primary edit"' + UserAuth.useredit + ' ><i class="ec-icon-edit edit"></i>  编辑</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-primary reset"' + UserAuth.userReset + ' ><i class="ec-icon-eye reset"></i>  重置密码</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-default del"' + UserAuth.userdel + '><i class="ec-icon-trash-o del"></i>  删除</button>';
                    return content;
                }
            }
        ];
    },

    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('editRole')) {
            this._oParent.oEditRoleD = new ES.Common.RoleDialog(this._oParent,{bRemove:true,cUrl:'/User/SetRoles'});
            this._oParent.oEditRoleD.editShow(oModel.Id);
        }
        if ($(e.target).hasClass('edit')) {
            this._oParent.oEditD = new ES.Common.Dialog(this._oParent,{bRemove:true,cUrl:'/User/Edit'});
            this._oParent.oEditD.editShow(oModel.Id);
        }
        if ($(e.target).hasClass('reset')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/User/ResetPwd'},{
                title: '重置密码-用户',
                content: '是否确定重置密码！'});
            oModel = {Id:oModel.Id};
            this._oParent.oDelD.del(oModel);
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/User/Delete'},{
                title: '删除操作-用户',
                content: '是否要删除数据！'});
            this._oParent.oDelD.del(oModel);
        }
    }

});

