/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({

    // 查询gird 用户信息
    setColumns: function () {
        if(this._oParent.oOption.bht){
            this.aoCol =[
                { label: '企业名称', name: 'EnterpriseName', width: 180,sortable: false, align: 'center' },
                { label: '简称', name: 'Abbreviation', width: 70,sortable: false,align: 'center' },
                //{ label: '注册资金', name: 'Registered', width: 100, align: 'center' },
                { label: '所属地区', name: 'ParentName',sortable: false, width: 100, align: 'center' },
                { label: '企业车辆数', name: 'VehCount',sortable: false, width: 100, align: 'center' ,
                    formatter: function (cellValue, options, rowObject) {
                        var value = cellValue+"辆"
                        return value;
                    }
                },
                // { label: '安装设备数', name: '', width: 100, align: 'center',
                //     formatter: function (cellValue, options, rowObject) {
                //         var value = "0个"
                //         return value;
                //     }
                // },
                // { label: '处置证数量', name: 'PermitCount', width: 100, align: 'center' ,
                //     formatter: function (cellValue, options, rowObject) {
                //         var value = cellValue+"张"
                //         return value;
                //     }
                // },
                { label: '法人代表', name: 'LegalName',sortable: false, width: 100, align: 'center' },
                { label: '联系人电话', name: 'ContactPhone',sortable: false, width: 130, align: 'center' },
                {
                    label: '操作',
                    name: '',
                    width: 150,
                    sortable: false,
                    align: 'center',
                    title:false,
                    formatter: function (cellValue, options, rowObject) {
                        var content = '  ';
                        content += '<button class="ec-btn ec-btn-xs ec-btn-default detail"' + EnterpriseAuth.enterpriseDetail + '><i class="ec-icon-eye detail"></i>  详情</button>';
                        content += '  ';
                        content += '<button  class="ec-btn ec-btn-xs ec-btn-primary ec-radius edit"' + EnterpriseAuth.enterpriseedit + '><i class="ec-icon-edit edit"></i>  编辑</button>';
                        content += '  ';
                        content += '<button class="ec-btn ec-btn-xs ec-btn-danger ec-radius del"' + EnterpriseAuth.enterprisedel + '><i class="ec-icon-trash-o del"></i>  删除</button>';

                        return content;
                    }
                }
            ];
        }else{
            this.aoCol =[
                { label: '企业名称', name: 'EnterpriseName',sortable: false, width: 180, align: 'center' },
                { label: '简称', name: 'Abbreviation',sortable: false, width: 70,align: 'center' },
                //{ label: '注册资金', name: 'Registered', width: 100, align: 'center' },
                { label: '所属地区', name: 'ParentName',sortable: false, width: 100, align: 'center' },
                //{ label: '安装车辆数', name: 'VehCount',sortable: false, width: 80, align: 'center' ,hidden:true},
                //{ label: '报备车辆数', name: 'ReportVehCount',sortable: false, width: 100, align: 'center' },
                //{ label: '车辆总数', name: 'ReportVehCount',sortable: false, width: 100, align: 'center' },
                { label: '车辆总数', name: 'VehCount',sortable: false, width: 100, align: 'center' },
                // { label: '安装设备数', name: '', width: 100, align: 'center',
                //     formatter: function (cellValue, options, rowObject) {
                //         var value = "0个"
                //         return value;
                //     }
                // },
                { label: '处置证数量', name: 'PermitCount',sortable: false, width: 100, align: 'center' ,
                    formatter: function (cellValue, options, rowObject) {
                        var value = cellValue+"张"
                        return value;
                    }
                },
                { label: '法人代表', name: 'LegalName',sortable: false, width: 60, align: 'center' },
                { label: '联系人电话', name: 'ContactPhone',sortable: false, width: 80, align: 'center' },
                // { label: '实时在线率', name: 'OnlineReal',sortable: false, width: 70, align: 'center' },
                // { label: '24小时在线率', name: 'HourReal',sortable: false, width: 90, align: 'center' },
                { label: '24小时在线率', name: 'HourReal',sortable: false, width: 90, align: 'center' },
                {
                    label: '操作',
                    name: '',
                    width: 180,
                    sortable: false,
                    align: 'center',
                    title: false,
                    formatter: function (cellValue, options, rowObject) {
                        var content = '  ';
                        content += '<button class="ec-btn ec-btn-xs ec-btn-default detail"' + EnterpriseAuth.enterpriseDetail + '><i class="ec-icon-eye detail"></i>  详情</button>';
                        content += '  ';
                        content += '<button  class="ec-btn ec-btn-xs ec-btn-primary ec-radius edit"' + EnterpriseAuth.enterpriseedit + '><i class="ec-icon-edit edit"></i>  编辑</button>';
                        content += '  ';
                        content += '<button class="ec-btn ec-btn-xs ec-btn-danger ec-radius del"' + EnterpriseAuth.enterprisedel + '><i class="ec-icon-trash-o del"></i>  删除</button>';
                        content += '  ';
                        content += '<button class="ec-btn ec-btn-sm ec-btn-success ec-radius export"' + EnterpriseAuth.enterpriseExport + '><i class="ec-icon-file-excel-o"></i>  导出</button>';
                        return content;
                    }
                }
            ];
        }


    },

    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('edit')) {
            this._oParent.oEditD = new ES.Common.Dialog(this._oParent,{bRemove:true,cUrl:'/Enterprise/Edit'},{width:800});
            this._oParent.oEditD.editShow(oModel);
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/Enterprise/Delete'},{
                title: '删除操作-企业',
                content: '是否要删除数据！'});
            oModel.id = oModel.Id;
            this._oParent.oDelD.del(oModel);
        }
        if ($(e.target).hasClass('detail')) {
            this._oParent.oDetailD = new ES.Common.Detail(this._oParent, { bRemove: true, cUrl: '/Enterprise/Detail' }, { title: "企业详情" });
            this._oParent.oDetailD.showModal(oModel);
        }
        if ($(e.target).hasClass('export'))
        {
            //alert(oModel.Id);
            window.location.href = '/Vehicle/Export?ResourceTypeId=' + oModel.Id + "&IsOnline=true";
        }
    }
});

