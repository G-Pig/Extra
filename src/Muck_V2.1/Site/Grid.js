/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Grid = ES.Common.BaseJqGrid.extend({

    // 查询gird 用户信息
    setColumns: function () {

        this.aoCol =[
            { label: '工地名称', name: 'Name', align: "center", sortable: false },
            //{ label: '行政区域', name: 'DistinctName', align: "center", sortable: false },
            { label: '所属地区', name: 'AreaName', align: "center", sortable: false },
            { label: '出土开始日期', name: 'WorkTimeStartDay', align: "center", sortable: false },
            { label: '出土结束日期', name: 'WorkTimeEndDay', align: "center", sortable: false },
            { label: '开工状态', name: 'StartStateStr', align: "center", sortable: false },
            {
                label: '资质状态', name: 'Qualification', align: "center", sortable: false,
                formatter: function (val, opt, item) {

                    var s = "";
                    if (val == '有资质') {
                        s = "<span class='ex-state-tag ex-success'>有资质</span>"
                    }
                    if (val == '已过期') {
                        s = "<span class='ex-state-tag ex-danger'>已过期</span>";
                    }
                    return s;
                }
            },
            {
                label: '操作', name: "Id", align: "center", width: 380, sortable: false,title: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default detail"'+ SiteAuth.sitedetail +'><i class="ec-icon-eye detail"></i>  详情</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-primary exit"'+ SiteAuth.sitedeExport +'><i class="ec-icon-cog exit"></i>  出口管理</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-primary edit"'+ SiteAuth.siteedit +'><i class="ec-icon-edit edit"></i>  编辑</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-primary config"'+ SiteAuth.siteset +'><i class="ec-icon-video-camera config"></i>  配置</button>';
                    content += '  ';
                    content += '<button class="ec-btn ec-btn-xs ec-btn-danger del"'+ SiteAuth.sitedel +'><i class="ec-icon-trash-o del"></i>  删除</button>';
                    return content;

                }
            }
        ];
    },

    initClick: function (e, oModel) {
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('config')) {
            this._oParent.oConfigD = new ES.Common.Config(this._oParent,{bRemove:true,cUrl:'/Site/Configure'},{ title: "工地配置管理 ( 工地名称："+ oModel.Name+" )"});
            this._oParent.oConfigD.showModal(oModel.Id);
        }
        if ($(e.target).hasClass('detail')) {
            this._oParent.oDetailD = new ES.Common.Detail(this._oParent,{bRemove:true,cUrl:'/Site/Detail'},{ title: "工地详情"});
            this._oParent.oDetailD.showModal(oModel.Id);
        }
        if ($(e.target).hasClass('edit')) {
            this._oParent.oEditD = new ES.Common.Dialog(this._oParent,{bRemove:true,cUrl:'/Site/Edit'});
            this._oParent.oEditD.editShow(oModel);
        }
        if ($(e.target).hasClass('del')) {
            this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/Site/Delete'},{
                title: '删除操作-工地',
                content: '是否要删除数据！'});
            this._oParent.oDelD.del(oModel.Id);
        }
        if ($(e.target).hasClass('exit')) {
            this._oParent.oAddExitD = new ES.Common.addExit(this._oParent,{bRemove:true},{});
            this._oParent.oAddExitD.showModal(oModel,"工地出口管理 —— 工地名称："+oModel.Name);
        }

    }

});

