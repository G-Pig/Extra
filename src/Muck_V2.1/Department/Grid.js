/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({

    // 查询gird 用户信息
    setColumns: function () {

        this.aoCol =[
            { label: '部门名称', name: 'Name', width: 200, align: 'center' },
            { label: '部门简称', name: 'ShortName', align: 'center' },
            { label: '部门标签', name: 'TagName', align: 'center' },
            { label: '部门属性', name: 'DepartRoleName', align: 'center' },
            { label: '上级部门', name: 'ParentName', align: 'center' },
            {
                label: '操作',
                name: '',
                width: 270,
                align: 'center',title: false,
                formatter: function (cellValue, options, rowObject) {
                    var content = '';
                    content += '<button  class="ec-btn ec-btn-xs ec-btn-default ec-radius edit"' + DeparAuth.deparedit + '><i class="ec-icon-edit edit"></i>  编辑</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-danger ec-radius del"' + DeparAuth.depardel + '><i class="ec-icon-trash-o del"></i>  删除</button>';
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
            this._oParent.oEditD = new ES.Common.Dialog(this._oParent,{bRemove:true,cUrl:'/Department/Edit'});
            this._oParent.oEditD.editShow(oModel);
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/Department/Delete'},{
                title: '删除操作-部门',
                content: '是否要删除数据！'});
            oModel.id = oModel.ResourceTypeId;
            this._oParent.oDelD.del(oModel);
        }
    }

});

