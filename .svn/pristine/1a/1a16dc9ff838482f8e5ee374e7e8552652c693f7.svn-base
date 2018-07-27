/** 负责加载grid数据 */
ES.Muck.Grid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
        //this.initCount("");
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
                    //缓存数据到控件
                    $(this).data('oData', data);
                    var CountItems = $('.ex-vehicle-classify>li>span');
                    CountItems.eq(0).html(data.total);//车辆总数
                    CountItems.eq(1).html(data.normal);//在线车辆
                    CountItems.eq(2).html(data.never);//离线车辆
                },
            });
    },
    setColumns: function () {
        var list = [
            { label: '创建名', name: 'CreateName', editable: true, sortable: false, width: 120, align: 'center', hidden: true },
            { label: 'Id', name: 'Id', editable: true, sortable: false, width: 120, align: 'center', hidden: true },
            { label: '企业Id', name: 'EnterpriceId', editable: true, sortable: false, width: 120, align: 'center', hidden: true },

            { label: '企业名称', name: 'EnterpriceName', editable: true, sortable: false, width: 120, align: 'center' },
            { label: '上报车辆数', name: 'upVehicleCouunt', editable: true, sortable: false, width: 50, align: 'center' },
            { label: '上报时间', name: 'CreateTime', editable: true, sortable: false, width: 80, align: 'center' },
            {
                label: '审核状态', name: 'StatusStr', editable: true, sortable: false, width: 60, align: 'center',
                formatter: function (val, opt, item) {
                    var content = '';
                    var type = '';
                    if (val == "区城管审核") {
                        type = 'ec-btn-primary';
                    } else if (val == "企业上报") {
                        type = 'ec-btn-default';
                    } else {
                        type = 'ec-btn-success';
                    }
                    content += '<button class="ec-btn ec-btn-xs ' + type + '"><i class=""></i>' + val + '</button>';
                    return content;
                }
            },
            {
                label: "操作",
                name: "actions",
                align: 'center',
                width: 100,
                title: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    if(item.StatusStr == "企业上报"){
                        content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-success reUpload"' + btnAuth.reupload + '><i class="ec-icon-cog reUpload"></i> 重新上报</button>';
                        content += '  ';
                    }
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default detail"' + btnAuth.detail + '><i class="ec-icon-eye detail"></i>  详情</button>';
                    return content;
                }
            }
        ];
        this.aoCol = list;
    },

    initClick: function (e, oModel) {
        var self = this;
        if (!e) {
            return;
        };
        if ($(e.target).hasClass('examine')) {
            this._oParent.oEditD = new ES.Common.ExamineAdvice(this._oParent, {
                bRemove: true,
                oModel: oModel
            }, { title: "车辆户籍管理——审核" });
            this._oParent.oEditD.showModal();

        };
        if ($(e.target).hasClass('detail')) {
            this._oParent.oVehicleD = new ES.Common.Detail(this._oParent, {
                bRemove: true,
                oModel: oModel
            }, {title: '车辆户籍管理 — 详情'});
            this._oParent.oVehicleD.showModal();
        }
        if ($(e.target).hasClass('reUpload')) {
            this._oParent.oEditD = new ES.Common.ReuploadEdit(this._oParent, {
                bRemove: true, cUrl: '/VehicleRegister/Edit',
                oModel: oModel
            }, { title: "上传车辆" });
            this._oParent.oEditD.showModal();

        };
    },
});
//审核时中间的表格
ES.Muck.ExamineGrid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
        this.initUI();
        this._countUrl = oJqGridOption.countUrl;
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
                    if (data.Message) {
                        ES.Util.aBase({ cColor: 'ec-alert-danger', cMsg: data.Message }, function (data) {
                            setTimeout(function () {
                                $(this).alert('close');
                            }, 3000);
                        });
                    }
                    $(this).data('oData', data);
                    if (data.dataList) {
                        self._oParent._oParent.fire('Upload.count',data)
                    }
                },
                gridComplete: function (data) {
                }
            });
    },
    setColumns: function () {
        var list = [
            { label: '修改的辅助名', name: 'CreateName', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆Id', name: 'VehicleId', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '企业Id', name: 'CurrentEnterpriceId', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆类型', name: 'VehType', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆状态', name: 'Status', editable: true, align: 'center', sortable: false, hidden: true },

            { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false, width: 20 },
            { label: '车辆状态', name: 'StatusStr', editable: true, align: 'center', width: 20, sortable: false,hidden:true,
                formatter:function(val){
                    if(val == "作废")return '<span class="ec-btn ec-btn-xs ec-btn-danger">作废<span>';
                    return  val
                }
            },
            { label: '是否变更', name: 'IsChange', editable: true, align: 'center', width: 20, sortable: false,
                formatter:function(val){
                    if(!val || val =="1"){return '<span class="ec-btn ec-btn-xs ec-btn-success">变更<span>';}else{
                        return '<span class="ec-btn ec-btn-xs ec-btn-danger">不变更<span>';
                    }
                }
            },
            { label: '车辆类型', name: 'VehTypeStr', editable: true, align: 'center', width: 20, sortable: false },
            { label: '原企业', name: 'CurrentEnterpriceName', editable: true, align: 'center', width: 120, sortable: false },
            {
                label: "操作",
                name: "actions",
                align: 'center',
                width: 30,
                sortable: false,
                title: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    var sText;
                    if (!item.IsChange || item.IsChange == "1") {
                        sText = "不变更"
                    } else {
                        sText = "变更"
                    }
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default cancleVehicle">' + sText + '</button>';
                    return content;
                }
            }
        ];

        this.aoCol = list;
    },
    //表格内的点击事件
    initClick: function (e, oModel) {
        var self = this;
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('cancleVehicle')) {
            var origStatus = oModel.Status;
            var origStatusStr = oModel.IsChange;
            var tt = e.target.innerText;
            if (tt == "变更") {
                e.target.innerText = "不变更";
                var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "IsChange":"1" });//更改当前行数据
                self._oParent._oParent.fire('Upload.cancelData',{VehicleId:oModel.VehicleId,IsChange:"1"});

            } else {
                e.target.innerText = "变更";
                var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "IsChange":"2" });//更改当前行数据
                self._oParent._oParent.fire('Upload.cancelData',{VehicleId:oModel.VehicleId,IsChange:"2"});
            }
        }
    },
    resizeBody: function () {

    },
});
//弹出层的详情—只有一个表格
ES.Muck.ModelGrid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
        this.initUI();
        this._countUrl = oJqGridOption.countUrl;
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
                    if (data.Message) {
                        ES.Util.aBase({ cColor: 'ec-alert-danger', cMsg: data.Message }, function (data) {
                            setTimeout(function () {
                                $(this).alert('close');
                            }, 3000);
                        });
                    }
                    $(this).data('oData', data);
                    if (data.dataList) {
                        self._oParent._oParent.fire('Upload.count',data)
                    }
                },
                gridComplete: function (data) {
                }
            });
    },
    setColumns: function () {
        var list = [
            { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false, width: 40 },
            { label: '车辆类型', name: 'VehTypeStr', editable: true, align: 'center', width: 40, sortable: false },
            { label: '原企业', name: 'CurrentEnterpriceName', editable: true, align: 'center', width: 90, sortable: false },
        ];
        this.aoCol = list;
    },

    initClick: function (e, oModel) {

    },
    resizeBody: function () {

    },
});
//上传车辆时右边的表格
ES.Muck.uploadGrid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
        this.initUI();
        this._countUrl = oJqGridOption.countUrl;
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
                    if (data.Message) {
                        ES.Util.aBase({ cColor: 'ec-alert-danger', cMsg: data.Message }, function (data) {
                            setTimeout(function () {
                                $(this).alert('close');
                            }, 3000);
                        });
                    }
                    $(this).data('oData', data);
                    if (data.dataList) {
                        self._oParent._oParent.fire('Upload.count',data)
                    }
                },
                gridComplete: function (data) {
                }
            });
    },
    setColumns: function () {
        var list = [
            { label: '修改的辅助名', name: 'CreateName', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆Id', name: 'VehicleId', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '企业Id', name: 'CurrentEnterpriceId', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆类型', name: 'VehType', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆状态', name: 'Status', editable: true, align: 'center', sortable: false, hidden: true },

            { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false, width: 40 },
            { label: '车辆状态', name: 'StatusStr', editable: true, align: 'center', width: 40, sortable: false,
                formatter:function(val){
                    if(val == "作废")return '<span class="ec-btn ec-btn-xs ec-btn-danger">作废<span>';
                    return  val
                }
            },
            { label: '车辆类型', name: 'VehTypeStr', editable: true, align: 'center', width: 40, sortable: false },
            { label: '原企业', name: 'CurrentEnterpriceName', editable: true, align: 'center', width: 90, sortable: false },
            {
                label: "操作",
                name: "actions",
                align: 'center',
                width: 40,
                sortable: false,
                title: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    var sText;
                    if (item.StatusStr == "作废") {
                        sText = "取消作废"
                    } else {
                        sText = "作废"
                    }
                    content += '<button class="ec-btn ec-btn-xs ec-btn-default cancleVehicle">' + sText + '</button>';
                    return content;
                }
            }
        ];

        this.aoCol = list;
    },
    //表格内的点击事件
    initClick: function (e, oModel) {
        var self = this;
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('cancleVehicle')) {
            var tt = e.target.innerText;
            if (tt == "作废") {
                e.target.innerText = "取消作废";
                var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": 3, "StatusStr":"作废" });//更改当前行数据
                self._oParent._oParent.fire('Upload.cancelData',{Status:3,VehicleId:oModel.VehicleId,StatusStr:"作废"});

            } else {
                e.target.innerText = "作废";
                var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": 0, "StatusStr":"上报" });//更改当前行数据
                self._oParent._oParent.fire('Upload.cancelData',{Status:0,VehicleId:oModel.VehicleId,StatusStr:"上报"});
            }
        }
    },
    resizeBody: function () {

    },
});
//重新上传车辆时右边的表格
ES.Muck.ReuploadGrid = ES.Common.BaseJqGrid.extend({
    initialize: function (oParent, oOption, oJqGridOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.aoCol = [];
        this.setColumns();
        this.initUI();
        this._countUrl = oJqGridOption.countUrl;
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
                    if (data.Message) {
                        ES.Util.aBase({ cColor: 'ec-alert-danger', cMsg: data.Message }, function (data) {
                            setTimeout(function () {
                                $(this).alert('close');
                            }, 3000);
                        });
                    }
                    $(this).data('oData', data);
                    if (!data.dataList) {
                        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').find('span').text('('+0+')');
                    }else{
                        self._oParent._oParent.fire('Upload.count',data)
                    }
                },
                gridComplete: function (data) {
                }
            });
    },
    setColumns: function () {
        var list = [
            { label: '修改的辅助名', name: 'CreateName', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆Id', name: 'VehicleId', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '企业Id', name: 'CurrentEnterpriceId', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆类型', name: 'VehType', editable: true, align: 'center', sortable: false, hidden: true },
            { label: '车辆状态', name: 'Status', editable: true, align: 'center', sortable: false, hidden: true },

            { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false, width: 40 },
            { label: '车辆状态', name: 'StatusStr', editable: true, align: 'center', width: 40, sortable: false,
                formatter:function(val){
                    if(val == "作废")return '<span class="ec-btn ec-btn-xs ec-btn-danger">作废<span>';
                    return  val
                }
            },
            { label: '车辆类型', name: 'VehTypeStr', editable: true, align: 'center', width: 40, sortable: false },
            { label: '原企业', name: 'CurrentEnterpriceName', editable: true, align: 'center', width: 90, sortable: false },
            {
                label: "操作",
                name: "actions",
                align: 'center',
                width: 40,
                sortable: false,
                title: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    if(item.Id == "0"){
                        var sText;
                        if (item.StatusStr == "作废") {
                            sText = "取消作废"
                        } else {
                            sText = "作废"
                        }
                        content += '<button class="ec-btn ec-btn-xs ec-btn-default cancleVehicle">' + sText + '</button>';
                    }else{
                        content += '<button class="ec-btn ec-btn-xs ec-btn-default cancleVehicle"> 删除</button>';
                    }
                    return content;
                }
            }
        ];

        this.aoCol = list;
    },
    //表格内的点击事件
    initClick: function (e, oModel) {
        var self = this;
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('cancleVehicle')) {
            var tt = e.target.innerText;
            if(oModel.Id != "0"){
                this._oParent.oDelD = new ES.Common.DelEntity(this._oParent,{bRemove:true,cUrl:'/VehicleRegister/Delete'},{
                    title: '删除操作-用户',
                    content: '是否要删除数据！'});
                this._oParent.oDelD.del(oModel);
            }else{
                if (tt == "作废") {
                    e.target.innerText = "取消作废";
                    var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                    $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": 3, "StatusStr":"作废" });//更改当前行数据
                    self._oParent._oParent.fire('Upload.cancelData',{Status:3,VehicleId:oModel.VehicleId,StatusStr:"作废"});

                } else {
                    e.target.innerText = "作废";
                    var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                    $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": 0, "StatusStr":"上报" });//更改当前行数据
                    self._oParent._oParent.fire('Upload.cancelData',{Status:0,VehicleId:oModel.VehicleId,StatusStr:"上报"});
                }
            }
        }
    },
    resizeBody: function () {

    },
});