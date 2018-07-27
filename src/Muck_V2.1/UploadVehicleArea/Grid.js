/** 负责加载grid数据 */
ES.Muck.Grid = ES.Common.BaseJqGrid.extend({
    // initialize: function (oParent, oOption, oJqGridOption) {
    //     ES.setOptions(this, oOption);
    //     this._oParent = oParent;
    //     this.aoCol = [];
    //     this.setColumns();
    //     //this.initCount("");
    //     var self = this;
    //     ES.extend(
    //         this.oJqGridOption,
    //         oJqGridOption,
    //         {
    //             onSelectRow: function (cId, d, e) {
    //                 var record = $(this).data('oData').dataList[parseInt(cId) - 1];
    //                 self.initClick(e, record);
    //             },
    //             colModel: this.aoCol,
    //             pager: '#' + this.oOption.cPagerContainer,
    //             loadComplete: function (data) {
    //                 self.gridData = data;
    //                 //缓存数据到控件
    //                 $(this).data('oData', data);
    //                 var CountItems = $('.ex-vehicle-classify>li>span');
    //                 CountItems.eq(0).html(data.total);//车辆总数
    //                 CountItems.eq(1).html(data.normal);//在线车辆
    //                 CountItems.eq(2).html(data.never);//离线车辆
    //             },
    //         });
    // },
    setColumns: function () {
        var list = [
            { label: '创建名', name: 'CreateName', editable: true, sortable: false, width: 120, align: 'center', hidden: true },
            { label: 'Id', name: 'Id', editable: true, sortable: false, width: 120, align: 'center', hidden: true },
            { label: '区域Id', name: 'ToDepartmentId', editable: true, sortable: false, width: 120, align: 'center', hidden: true },
            { label: '表格区域ID', name: 'FromDepartmentId', editable: true, sortable: false, width: 120, align: 'center', hidden: true },

            { label: '区域名称', name: 'ToDepartmentName', editable: true, sortable: false, width: 120, align: 'center' },
            //{ label: '所属区域', name: 'SiteName', editable: true, sortable: false, width: 120, align: 'center' },
            { label: '上报车辆数', name: 'upVehicleCouunt', editable: true, sortable: false, width: 60, align: 'center' },
            { label: '上报时间', name: 'CreateTime', editable: true, sortable: false, width: 120, align: 'center' },
            //{
            //    label: '在线状态', name: 'Status', editable: true, sortable: false, width: 70, align: 'center',
            //    formatter: function (val, opt, itm) {
            //        var content = "";
            //        if (val == "在线") {
            //            content += '<button ' + btnAuth.detail + 'class="ec-btn ec-btn-xs ec-btn-success">  ' + val + '</button>';
            //        } else {
            //            content += '<button ' + btnAuth.detail + 'class="ec-btn ec-btn-xs ec-btn-default">  ' + val + '</button>';
            //        };
            //        return content;
            //    }
            //},
            {
                label: '审核状态', name: 'StatusStr', editable: true, sortable: false, width: 60, align: 'center',
                formatter: function (val, opt, item) {
                    var content = '';
                    var type = '';
                    if (val == "区域审核") {
                        type = 'ec-btn-primary';
                    } else if (val == "上报") {
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
                width: 80,
                title: false,
                formatter: function (val, opt, item) {
                    var content = '';
                    if (item.StatusStr == "上报") {
                        content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-success reUpload"' + btnAuth.reupload + '><i class="ec-icon-cog reUpload"></i> 重新上报</button>';
                    }
                    //content += '<button class="ec-btn ec-radius ec-btn-xs ec-btn-success reUpload"><i class="ec-icon-cog reUpload"></i> 重新上报</button>';
                    content += '  ';
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
                bRemove: true, cUrl: '/UploadVehicleArea/Edit',
                oModel: oModel
            }, { title: "审核工地" });
            this._oParent.oEditD.showModal();

        };
        if ($(e.target).hasClass('detail')) {
            this._oParent.oVehicleD = new ES.Common.Detail(this._oParent, {
                bRemove: true,
            }, {
                title: '过境车辆上报 — 详情',
                content:
                '<ul class="ec-avg-sm-2" style="padding-left: 1em">' +
                '   <li class="ec-form-group" style="border-bottom:1px dotted #ccc">' +
                '       <label class="ec-u-sm-4" style="white-space:nowrap"><b>上报区域：</b></label>' +
                '       <span class="ec-u-sm-8" style="white-space:nowrap;color:#B22222;">' + oModel.ToDepartmentName + '</span>' +
                '   </li>' +
                //'   <li class="ec-form-group" style="border-bottom:1px dotted #ccc">' +
                //'       <label class="ec-u-sm-4" style="white-space:nowrap"><b>开工工地：</b></label>' +
                //'       <span class="ec-u-sm-8" style="white-space:nowrap;color:#B22222;">' + oModel.SiteName + '</span>' +
                //'   </li>' +
                //'   <li class="ec-form-group" style="border-bottom:1px dotted #ccc">' +
                //'       <label class="ec-u-sm-4" style="white-space:nowrap"><b>上报时在线率：</b></label>' +
                //'       <span class="ec-u-sm-8" style="white-space:nowrap;color:#B22222;">' + oModel.OlineRate + '%</span>' +
                //'   </li>' +
                '   <li class="ec-form-group" style="border-bottom:1px dotted #ccc">' +
                '       <label class="ec-u-sm-4" style="white-space:nowrap"><b>车辆总数：</b></label>' +
                '       <span class="ec-u-sm-8" style="white-space:nowrap;color:#B22222;" id="total"></span>' +
                '   </li>' +
                '   <li class="ec-form-group" style="border-bottom:1px dotted #ccc">' +
                '       <label class="ec-u-sm-4" style="white-space:nowrap"><b>在线数量：</b></label>' +
                '       <span class="ec-u-sm-8" style="white-space:nowrap;color: #B22222;" id="onlin_ct"></span>' +
                '   </li>' +
                '   <li class="ec-form-group" style="border-bottom:1px dotted #ccc">' +
                '       <label class="ec-u-sm-4" style="white-space:nowrap"><b>作废数量：</b></label>' +
                '       <span class="ec-u-sm-8" style="white-space:nowrap;color:#B22222;" id="status_3_ct"></span>' +
                '   </li>' +
                '</ul>' +
                '<div class="ex-Permit-VehicleModel"><table id="VehicleModelGridContainer" class="dt-grid-container" style="width:100%;"></table><div id="VehicleModelGridToolBarContainer" class="dt-grid-toolbar-container"></div>',
                width: 800,
                height: 430
            });
            this._oParent.oVehicleD.del(oModel.Id);
        }
        if ($(e.target).hasClass('reUpload')) {
            this._oParent.oEditD = new ES.Common.ReuploadEdit(this._oParent, {
                bRemove: true, cUrl: '/UploadVehicleArea/Edit',
                oModel: oModel
            }, { title: "上传工地车辆" });
            this._oParent.oEditD.showModal();

        };
    },
    //initCount: function (ResourceTypeId) {
    //    ES.getData({ ResourceTypeIds: ResourceTypeId }, this._countUrl, function (data) {
    //        var CountItems = $('.ex-vehicle-classify>li>span');
    //        CountItems.eq(0).html(data.total);//车辆总数
    //        CountItems.eq(1).html(data.normal);//资质车辆
    //        CountItems.eq(2).html(data.never);//备案车辆
    //        CountItems.eq(3).html(data.expired);//资质过期
    //    })
    //},
});
//弹出层的详情—只有一个表格
ES.Muck.ModelGrid = ES.Common.BaseJqGrid.extend({
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
                    if (data.userdata) {
                        self.gridData = data;
                        $('#total').text(data.userdata.total);
                        $('#onlin_ct').text(data.userdata.onlin_ct);
                        $('#status_3_ct').text(data.userdata.status_3_ct);
                        $('#Remark').text(data.userdata.Remark);
                    }
                }
            });
    },
    setColumns: function () {
        var list = [
            { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false },
            { label: '所属企业', name: 'EnterpriceName', editable: true, align: 'center', width: 180, sortable: false },
            { label: '在线状态', name: 'Online', editable: true, align: 'center', sortable: false },
            {
                label: '审核状态', name: 'Status', editable: true, align: 'center', sortable: false,
                formatter: function (val, opt, itm) {
                    if (val == 0 || !val) {
                        return "<span class='ec-text-primary'>待审核</span>";
                    } else if (val == 1) {
                        return "<span class='ec-text-success'>审核通过</span>";
                    } else if (val == 2) {
                        return "<span class='ec-text-danger'>整改</span>";
                    } else if (val == 3) {
                        return "作废";
                    }
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
                        //self.gridData = data;
                        var VehicleAmount = data.dataList.length;
                        var VehicleOnline = [];
                        for (var i = 0; i < VehicleAmount; i++) {
                            if (data.dataList[i].HourOnline) {
                                VehicleOnline.push(data.dataList[i]);
                            }
                        }
                        var OnlineRate = VehicleOnline.length / VehicleAmount;
                        $('#VehicleAmount').text(VehicleAmount);//车辆总数
                        $('#VehicleOnline').text(VehicleOnline.length);//在线车辆数
                        $('#reportsTotal').text((OnlineRate *100).toFixed(2) + "%");//平均上线率
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
            { label: '企业Id', name: 'ResourceTypeId', editable: true, align: 'center', sortable: false, hidden: true },
            {
                label: '车辆状态', name: 'Status', editable: true, align: 'center', sortable: false, width: 30,
                formatter: function (val, opt, itm) {
                    if (val == 0 || !val) {
                        return "<span class='ec-text-primary'>待审核</span>";
                    } else if (val == 1) {
                        return "<span class='ec-text-success'>审核通过</span>";
                    } else if (val == 2) {
                        return "<span class='ec-text-danger'>整改</span>";
                    } else if (val == 3) {
                        return "作废";
                    }
                }
            },
            { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false, width: 40 },
            { label: '所属企业', name: 'EnterpriceName', editable: true, align: 'center', width: 90, sortable: false },
            {
                label: '在线状态', name: 'Online', editable: true, align: 'center', sortable: false, width: 30,
            },
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
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('cancleVehicle')) {
            var tt = e.target.innerText;
            if (tt == "作废") {
                e.target.innerText = "取消作废";
                var gridData = this.gridData.dataList;//缓存的表格源数据
                var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                var getRowData = $(this.oJqGrid.selector).jqGrid('getRowData', rowId);//获取当前行的数据
                var origVal;
                if (getRowData.Status == "作废") {
                    origVal = 3;
                } else if (getRowData.Status == "待审核") {
                    origVal = 0;
                } else if (getRowData.Status == "审核通过") {
                    origVal = 1;
                } else if (getRowData.Status == "整改") {
                    origVal = 2;
                }
                var rowData = $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": 3, "CreateName": origVal });//更改当前行数据
                gridData[parseInt(rowId) - 1].Status = 3;//修改源表格数据的车辆状态,该车辆作废
                var onlineVehicle = [];
                var banishVehicl = [];
                for (var i = 0; i < gridData.length; i++) {
                    if (gridData[i].Status) {
                        if (gridData[i].Status != 3 && gridData[i].CheckOlineRate) {
                            onlineVehicle.push(gridData[i].VehicleNo);//在线的并且没有作废的车辆
                        }
                        if (gridData[i].Status == 3) {
                            banishVehicl.push(gridData[i].VehicleNo);//废除的车辆
                        }
                    } else {
                        if (gridData[i].CheckOlineRate) {
                            onlineVehicle.push(gridData[i].VehicleNo);//在线的并且没有作废的车辆
                        }
                    }
                }
                var newDataLen = gridData.length - banishVehicl.length;//所有参与在线率计算的车辆长度
                var onlineRate = onlineVehicle.length / newDataLen;//重新渲染的在线率
                if (onlineRate == 0 || !onlineRate) {
                    $('#reportsTotal').text(0 + "%");
                } else {
                    if (onlineRate == 1) {
                        $('#reportsTotal').text("100%");

                    } else {
                        $('#reportsTotal').text((onlineRate * 100).toFixed(2) + "%");
                    }
                }
            } else {
                e.target.innerText = "作废";
                var gridData = this.gridData.dataList;//缓存的表格源数据
                var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                var getRowData = $(this.oJqGrid.selector).jqGrid('getRowData', rowId);//获取当前行的数据
                var rowData = $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": getRowData.CreateName });//更改当前行数据控制前面的显示
                gridData[parseInt(rowId) - 1].Status = getRowData.CreateName;//修改源表格数据的车辆状态,该车辆还原
                var onlineVehicle = [];
                var banishVehicl = [];
                for (var i = 0; i < gridData.length; i++) {
                    if (gridData[i].Status != 3 && gridData[i].CheckOlineRate) {
                        onlineVehicle.push(gridData[i].VehicleNo);//在线的并且没有作废的车辆
                    }
                    if (gridData[i].Status == 3) {
                        banishVehicl.push(gridData[i].VehicleNo);//废除的车辆
                    }
                }
                var newDataLen = gridData.length - banishVehicl.length;//所有参与在线率计算的车辆长度
                var onlineRate = onlineVehicle.length / newDataLen;//重新渲染的在线率
                if (onlineRate == 0 || !onlineRate) {
                    $('#reportsTotal').text(0 + "%");
                } else {
                    if (onlineRate == 1) {
                        $('#reportsTotal').text("100%");

                    } else {
                        $('#reportsTotal').text((onlineRate * 100).toFixed(2) + "%");
                    }
                }
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
                    $(this).data('oData', data);
                    self.gridData = data;
                    if (data.dataList) {
                        var VehicleAmount = data.dataList.length;
                        var VehicleOnline = [];
                        for (var i = 0; i < VehicleAmount; i++) {
                            if (data.dataList[i].HourOnline) {
                                VehicleOnline.push(data.dataList[i]);
                            }
                        }
                        var OnlineRate = VehicleOnline.length / VehicleAmount;
                        $('#VehicleAmount').text(VehicleAmount);//车辆总数
                        $('#VehicleOnline').text(VehicleOnline.length);//在线车辆数
                        $('#reportsTotal').text((OnlineRate * 100).toFixed(2) + "%");//平均上线率
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
            { label: '企业Id', name: 'ResourceTypeId', editable: true, align: 'center', sortable: false, hidden: true },
            {
                label: '车辆状态', name: 'Status', editable: true, align: 'center', sortable: false, width: 30,
                formatter: function (val, opt, itm) {
                    if (val == 0 || !val) {
                        return "<span class='ec-text-primary'>待审核</span>";
                    } else if (val == 1) {
                        return "<span class='ec-text-success'>审核通过</span>";
                    } else if (val == 2) {
                        return "<span class='ec-text-danger'>整改</span>";
                    } else if (val == 3) {
                        return "作废";
                    }
                }
            },
            { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false, width: 40 },
            { label: '所属企业', name: 'EnterpriceName', editable: true, align: 'center', width: 90, sortable: false },
            {
                label: '在线状态', name: 'Online', editable: true, align: 'center', sortable: false, width: 30,
            },
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
        if (!e) {
            return;
        }
        if ($(e.target).hasClass('cancleVehicle')) {
            var tt = e.target.innerText;
            if (tt == "作废") {
                e.target.innerText = "取消作废";
                var gridData = this.gridData.dataList;//缓存的表格源数据
                var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                var getRowData = $(this.oJqGrid.selector).jqGrid('getRowData', rowId);//获取当前行的数据
                var origVal;
                if (getRowData.Status == "作废") {
                    origVal = 3;
                } else if (getRowData.Status.indexOf("待审核") > -1) {
                    origVal = 0;
                } else if (getRowData.Status.indexOf("审核通过") > 1) {
                    origVal = 1;
                } else if (getRowData.Status.indexOf("整改") > -1) {
                    origVal = 2;
                }
                var rowData = $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": 3, "CreateName": origVal });//更改当前行数据
                gridData[parseInt(rowId) - 1].Status = 3;//修改源表格数据的车辆状态,该车辆作废
                var onlineVehicle = [];
                var banishVehicl = [];
                for (var i = 0; i < gridData.length; i++) {
                    if (gridData[i].Status) {
                        if (gridData[i].Status != 3 && gridData[i].CheckOlineRate) {
                            onlineVehicle.push(gridData[i].VehicleNo);//在线的并且没有作废的车辆
                        }
                        if (gridData[i].Status == 3) {
                            banishVehicl.push(gridData[i].VehicleNo);//废除的车辆
                        }
                    } else {
                        if (gridData[i].CheckOlineRate) {
                            onlineVehicle.push(gridData[i].VehicleNo);//在线的并且没有作废的车辆
                        }
                    }
                }
                var newDataLen = gridData.length - banishVehicl.length;//所有参与在线率计算的车辆长度
                var onlineRate = onlineVehicle.length / newDataLen;//重新渲染的在线率
                if (onlineRate == 0 || !onlineRate) {
                    $('#reportsTotal').text(0 + "%");
                } else {
                    if (onlineRate == 1) {
                        $('#reportsTotal').text("100%");

                    } else {
                        $('#reportsTotal').text((onlineRate * 100).toFixed(2) + "%");
                    }
                }
            } else {
                e.target.innerText = "作废";
                var gridData = this.gridData.dataList;//缓存的表格源数据
                var rowId = $(this.oJqGrid.selector).jqGrid('getGridParam', 'selrow');//获取当前行Id
                var getRowData = $(this.oJqGrid.selector).jqGrid('getRowData', rowId);//获取当前行的数据
                if (getRowData.CreateName) {
                    $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": getRowData.CreateName });//更改当前行数据控制前面的显示
                } else {
                    $(this.oJqGrid.selector).jqGrid('setRowData', rowId, { "Status": 0 });
                }
                gridData[parseInt(rowId) - 1].Status = getRowData.CreateName;//修改源表格数据的车辆状态,该车辆还原
                var onlineVehicle = [];
                var banishVehicl = [];
                for (var i = 0; i < gridData.length; i++) {
                    if (gridData[i].Status != 3 && gridData[i].CheckOlineRate) {
                        onlineVehicle.push(gridData[i].VehicleNo);//在线的并且没有作废的车辆
                    }
                    if (gridData[i].Status == 3) {
                        banishVehicl.push(gridData[i].VehicleNo);//废除的车辆
                    }
                }
                var newDataLen = gridData.length - banishVehicl.length;//所有参与在线率计算的车辆长度
                var onlineRate = onlineVehicle.length / newDataLen;//重新渲染的在线率
                if (onlineRate == 0 || !onlineRate) {
                    $('#reportsTotal').text(0 + "%");
                } else {
                    if (onlineRate == 1) {
                        $('#reportsTotal').text("100%");

                    } else {
                        $('#reportsTotal').text((onlineRate * 100).toFixed(2) + "%");
                    }
                }
            }
        }
    },
    resizeBody: function () {

    },
});