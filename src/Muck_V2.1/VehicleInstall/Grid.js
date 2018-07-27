/**负责加载grid数据 下单的grid审核完成下单的grid*/
ES.Muck.Grid = ES.Common.BaseJqGrid.extend({
    setColumns:function(){
       var list =  [
           { label: '报装企业', name: 'EnterpriceName', editable: true,sortable: false,width:60, align: 'center'},
           //{ label: '报装区域', name: 'InstallTime', editable: true,sortable: false,width:120, align: 'center' },
           { label: '上报时间', name: 'CreateTime', editable: true, sortable: false,width:60, align: 'center' },
           {
               label: '安装时间', name: 'InstallTime', editable: true, sortable: false,width:60, align: 'center',
               formatter: function (cellValue, options, rowObject) {
                   if(cellValue){
                       return cellValue.substr(0,10)
                   }
               }
           },
           {
               label: '报装车辆数', name: 'upVehicleCount', editable: true, sortable: false,width:50, align: 'center',
               formatter: function (cellValue, options, rowObject) {
                   var val = cellValue;
                   if(!cellValue){
                       val = "0"
                   }
                   return val;
               }
           },
           {
               label: '安装车辆数', name: 'readyVehicleCount', editable: true, sortable: false,width:50, align: 'center',
               formatter: function (cellValue, options, rowObject) {
                   var val = cellValue;
                   if(!cellValue){
                       val = "0"
                   }
                   return val;
               }
           },
           { label: '企业联系人', name: 'Contact', editable: true, sortable: false,width:50, align: 'center'},
           { label: '联系人电话', name: 'Phone', editable: true, sortable: false,width:70, align: 'center'},
           //{ label: '报装来源', name: 'StartAlarmTime', editable: true, sortable: false,width:70, align: 'center'},
           { label: '备注', name: 'Remark', editable: true, sortable: false,width:50, align: 'center'},
           {
               label: '审核状态', name: 'StatusStr', editable: true, sortable: false,width:50, align: 'center',
               formatter: function (cellValue, options, rowObject) {
                   var content = '',type = "defalut"
                   if(cellValue == "区城管审核"){
                       type="primary";
                   }
                   content += '<button  class="ec-btn ec-btn-xs ec-btn-'+type+' ec-radius examine">'+cellValue+'</button>';
                   return content;
               }
           },
           {
               label: '安装进度', name: '', editable: true, sortable: false,width:70, align: 'center',
               formatter: function (cellValue, options, rowObject) {
                   var val = rowObject.readyVehicleCount/rowObject.upVehicleCount;
                   if(!val){
                       val = '0%'
                   }else{
                       val = (val * 100).toFixed(2) + "%";
                   }
                   var content = '';
                   content += '<div class="ec-progress ex-grid-progress"><div class="ec-progress-bar ec-progress-bar-success" style="width:'+val+'">'+val+'</div><span class="ec-progress-text"></span></div>';
                   return content;
               }
           },
           {
                label: '操作', name: 'actions', width: 90, sortable: false, title: false, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var content = '';
                    if(rowObject.StatusStr == "企业上报"){
                        content += '<button  class="ec-btn ec-btn-xs ec-btn-warning ec-radius reupload" '+btnAuth.reupload+'><i class="ec-icon-eye view reupload"></i>  重新上报</button>';
                        content += '    ';
                        content += '<button  class="ec-btn ec-btn-xs ec-btn-primary ec-radius examine" '+btnAuth.examine+'><i class="ec-icon-eye view examine"></i>  审核</button>';
                    }else if(rowObject.StatusStr == "区城管审核"){
                        content += '<button  class="ec-btn ec-btn-xs ec-btn-primary ec-radius examine" '+btnAuth.examine+'><i class="ec-icon-eye view examine"></i>  审核</button>';
                    }
                    content += '    ';
                    content += '<button  class="ec-btn ec-btn-xs ec-btn-default ec-radius detail" '+btnAuth.detail+'><i class="ec-icon-eye detail"></i>  详情</button>';
                    // content += '    ';
                    // content += '<button  class="ec-btn ec-btn-xs ec-btn-danger ec-radius delete" '+btnAuth.detail+'><i class="ec-icon-trash delete"></i>  删除</button>';
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
        if ($(e.target).hasClass('reupload')) {
            this._oParent.oEditD = new ES.Common.AddDialog(this._oParent, { bRemove: true, cUrl: '/VehicleInstall/GetUploadDetail',oData:oModel},
                { title: '重新上报：'+oModel.EnterpriceName }
            );
            this._oParent.oEditD.showModal();
        }
        if ($(e.target).hasClass('examine')) {
            this._oParent.oDetailD = new ES.Common.Examine(this._oParent, { bRemove: true, cUrl: '/VehicleInstall/GetUploadVehs',oModel:oModel},
                { title: '审核：'+oModel.VehicleNo });
            this._oParent.oDetailD.showModal(oModel);
        }
        if ($(e.target).hasClass('detail')) {
            this._oParent.oDetailD = new ES.Common.Detail(this._oParent, { bRemove: true, cUrl: '/VehicleInstall/GetUploadVehs'},
                {
                    title: '报装详情：'+oModel.EnterpriceName,
                    content:
                        '<ul class="ec-avg-sm-2" style="padding-left: 1em">' +
                        '   <li class="ec-form-group" style="border-bottom:1px dotted #ccc">' +
                        '       <label class="ec-u-sm-4"><b>审核意见：</b></label>' +
                        '       <span class="ec-u-sm-8">' + oModel.Remark + '</span>' +
                        '   </li>' +
                        '</ul>'+
                        '<div class="ex-Permit-VehicleModel"><table id="VehicleModelGridContainer" class="dt-grid-container" style="width:100%;"></table><div id="VehicleModelGridToolBarContainer" class="dt-grid-toolbar-container"></div>',
                    height:430,
                    width:785
                }
            );
            this._oParent.oDetailD.del(oModel.Id);
        }
        // if ($(e.target).hasClass('delete')) {
        //     this._oParent.oDelD = new ES.Common.DelEntity(this._oParent, { bRemove: true, cUrl: '/VehicleInstall/Delete'},
        //         { title: '删除数据：'+oModel.EnterpriceName, content: '是否要删除数据！'});
        //     this._oParent.oDelD.del(oModel);
        // }
    },
});

/**审核的grid*/
ES.Muck.CheckGrid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
        this.initUI();
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
            { label: 'Id', name: 'Id',hidden:true},
            { label: '报装企业', name: 'EnterpriceName', editable: true,sortable: false,width:60, align: 'center'},
            //{ label: '报装区域', name: 'InstallTime', editable: true,sortable: false,width:120, align: 'center' },
            { label: '报装时间', name: 'CreateTime', editable: true, sortable: false,width:60, align: 'center' },
            {
                label: '报装车辆数', name: 'upVehicleCouunt', editable: true, sortable: false,width:50, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var val = cellValue;
                    if(!cellValue){
                        val = "0"
                    }
                    return val;
                }
            },
            {
                label: '安装车辆数', name: 'readyVehicleCount', editable: true, sortable: false,width:50, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var val = cellValue;
                    if(!cellValue){
                        val = "0"
                    }
                    return val;
                }
            },
            { label: '企业联系人', name: 'Contact', editable: true, sortable: false,width:50, align: 'center'},
            { label: '联系人电话', name: 'Phone', editable: true, sortable: false,width:70, align: 'center'},
            //{ label: '报装来源', name: 'StartAlarmTime', editable: true, sortable: false,width:70, align: 'center'},
            { label: '上报人', name: 'CreateName', editable: true, sortable: false,width:50, align: 'center'},
            {
                label: '审核状态', name: 'StatusStr', editable: true, sortable: false,width:70, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var content = '',type = "defalut"
                    if(cellValue == "区城管审核"){
                        type="primary";
                    }
                    content += '<button  class="ec-btn ec-btn-xs ec-btn-'+type+' ec-radius examine">'+cellValue+'</button>';
                    return content;
                }
            },
            { label: '审核意见', name: 'Remark', editable: true, sortable: false,width:70, align: 'center'},
            {
                label: '安装进度', name: '', editable: true, sortable: false,width:70, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var val = rowObject.readyVehicleCount/rowObject.upVehicleCouunt;
                    if(!val){
                        val = '0%'
                    }else{
                        val = (val * 100).toFixed(2) + "%";
                    }
                    var content = '';
                    content += '<div class="ec-progress ex-grid-progress"><div class="ec-progress-bar ec-progress-bar-success" style="width:'+val+'"></div><span class="">'+val+'</span></div>';
                    return content;
                }
            },
            // { label: '报装企业', name: 'VehicleNo', editable: true,sortable: false,width:60, align: 'center'},
            // { label: '报装区域', name: 'CompanyName', editable: true,sortable: false,width:120, align: 'center' },
            // { label: '报装时间', name: 'DistName', editable: true, sortable: false,width:60, align: 'center' },
            // { label: '报装车辆数', name: 'AlarmTypeStr', editable: true, sortable: false,width:50, align: 'center'},
            // { label: '已安装车辆数', name: 'AlarmTypeStr', editable: true, sortable: false,width:50, align: 'center'},
            // { label: '企业联系人', name: 'ContinueTime', editable: true, sortable: false,width:50, align: 'center'},
            // { label: '企业联系人电话', name: 'StartAlarmTime', editable: true, sortable: false,width:70, align: 'center'},
            // { label: '报装来源', name: 'StartAlarmTime', editable: true, sortable: false,width:70, align: 'center'},
            // { label: '审核人', name: 'StartAlarmTime', editable: true, sortable: false,width:70, align: 'center'},
            // { label: '审核意见', name: 'StartAlarmTime', editable: true, sortable: false,width:70, align: 'center'},
            // { label: '下单人', name: 'StartAlarmTime', editable: true, sortable: false,width:70, align: 'center'},
            // {
            //     label: '审核状态', name: 'StatusStr', editable: true, sortable: false,width:70, align: 'center',
            //     formatter: function (cellValue, options, rowObject) {
            //         var content = '',type = "defalut"
            //         if(cellValue == "区城管审核"){
            //             type="primary";
            //         }
            //         content += '<button  class="ec-btn ec-btn-xs ec-btn-'+type+' ec-radius examine">'+cellValue+'</button>';
            //         return content;
            //     }
            // },
            {
                label: '操作', name: 'actions', width: 100, sortable: false, title: false, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var content = '';
                    if(rowObject.StatusStr == "市城管委备案"){
                        content += '<button  class="ec-btn ec-btn-xs ec-btn-primary ec-radius getDone" '+btnAuth.order+'><i class="ec-icon-eye getDone"></i>  下单</button>';
                        content += '    ';
                    }
                    content += '<button  class="ec-btn ec-btn-xs ec-btn-default ec-radius detail" '+btnAuth.detail+'><i class="ec-icon-eye detail"></i>  详情</button>';
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
        if ($(e.target).hasClass('getDone')) {
            this._oParent.oDetailD = new ES.Common.GetDone(this._oParent, { bRemove: true, cUrl: ''},
                { title: '下单操作：'+oModel.VehicleNo, content: '是否下单？' }
            );
            this._oParent.oDetailD.showModal(oModel);
        }
        if ($(e.target).hasClass('detail')) {
            this._oParent.oDetailD = new ES.Common.Detail(this._oParent, { bRemove: true, cUrl: '/VehicleInstall/GetUploadVehs'},
                {title: '报装详情：'+oModel.VehicleNo,
                    content:
                    '<div class="ex-Permit-VehicleModel">' +
                    '   <table id="VehicleModelGridContainer" class="dt-grid-container" style="width:100%;"></table>' +
                    '   <div id="VehicleModelGridToolBarContainer" class="dt-grid-toolbar-container">' +
                    '</div>',
                    width: 800,
                    height:465
                }
            );
            this._oParent.oDetailD.del(oModel);
        }
    },
});

/**详情grid*/
ES.Muck.DetailGrid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
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
                    $(this).data('oData', data);
                    self.gridData = data;
                }
            });
    },
    setColumns:function(){
        var list =  [
            { label: 'Id', name: 'Id',hidden:true},
            { label: 'VInstallId', name: 'VInstallId',hidden:true},
            { label: 'DeviceNo', name: 'DeviceNo',hidden:true},
            { label: '车牌号', name: 'VehicleNo', editable: true,sortable: false,width:60, align: 'center'},
            { label: '企业名称', name: 'CompanyName', editable: true,sortable: false,width:120, align: 'center' },
            { label: '所属区域', name: 'DistName', editable: true, sortable: false,width:60, align: 'center' },
            {
                label: '上报时间', name: 'CreateTime', editable: true, sortable: false,width:60, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var val = cellValue.substr(0,10)
                    return val;
                }
            },
            {
                label: '操作', name: 'actions', width: 100, sortable: false, title: false, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var content = '';
                    content += '<button  class="ec-btn ec-btn-xs ec-btn-default ec-radius detail" '+btnAuth.inDetail+'><i class="ec-icon-eye detail"></i>  详情</button>';
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
        if ($(e.target).hasClass('detail')) {
            this._oParent.oDetailD = new ES.Common.InDetail(this._oParent, { bRemove: true, cUrl: '/VehicleInstall/GetBossVehicleInfoById',oModel:oModel},
                { title: '详情：'+oModel.VehicleNo }
            );
            this._oParent.oDetailD.showModal({VehicleId:oModel.VehicleId});
        }
    },
    resizeBody: function () {

    },
});

/**审核详情里的表格*/
ES.Muck.ExamineGrid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
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
                    $(this).data('oData', data);
                    self.gridData = data;
                }
            });
    },
    setColumns:function(){
        var list =  [
            { label: 'Id', name: 'Id',hidden:true},
            { label: 'VInstallId', name: 'VInstallId',hidden:true},
            { label: 'DeviceNo', name: 'DeviceNo',hidden:true},
            { label: '车牌号', name: 'VehicleNo', editable: true,sortable: false,width:60, align: 'center'},
            { label: '企业名称', name: 'CompanyName', editable: true,sortable: false,width:120, align: 'center' },
            { label: '所属区域', name: 'DistName', editable: true, sortable: false,width:60, align: 'center' },
            {
                label: '上报时间', name: 'CreateTime', editable: true, sortable: false,width:60, align: 'center',
                formatter: function (cellValue, options, rowObject) {
                    var val = cellValue.substr(0,10)
                    return val;
                }
            },
        ];
        this.aoCol = list;
    },
    initClick: function (e, oModel) {

    },
    resizeBody: function () {

    },
});