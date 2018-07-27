//弹窗详情页
ES.Common.Detail = ES.Common.BaseDialog.extend({
    afterOpen: function (id) {
        this.oModelGrid = new ES.Muck.ModelGrid(this, {
            // 容器
            cContainer: '.ex-Permit-VehicleModel',
            // grid id
            cGridContainer: 'VehicleModelGridContainer',
            // 分页菜单id
            cPagerContainer: 'VehicleModelGridToolBarContainer',
        }, {
            url: '/UploadVehicleArea/GetUploadAreaVehs',

            postData: {
                exparameters: {
                    UpAreaId: this.oBusData
                }
            },
            multiselect: false,
            rowNum: 100000
        });
        var nW = $('.ex-Permit-VehicleModel').width();
        var nH = $('.ex-Permit-VehicleModel').parent().height() - 149;

        this.oModelGrid.initGrid({ width: nW, height: nH });
    },
    del: function (oData) {
        this.oBusData = oData;
        this.hideFooter();
        this.oDialog.showModal();
    }
});
//上传车辆弹出层
ES.Common.AddVehicles = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
        this.oAreaTree = new ES.Common.SelectTreeNodeW(null, { cBandSel: $("#AreaInside") },
            {
                core: {
                    'animation': 0,
                    'check_callback': true,
                    'state': { 'opened': true },
                    'data': {
                        'url': '/Department/GetSysDepartmentTree',
                    }
                },
                plugins: ["search"],
            });
        this.oAreaTree.on("selectVal", function (oData) {
            if (oData.parents.length != 2) {
                ES.aWarn("请选择区域！")
            } else {
                if (!$("#s_h_AreaInside").val()) {
                    $("#s_h_AreaInside").val(oData.id);
                    $("#AreaInside").val(oData.text);
                    $('.ex-cover-tree-select').hide().siblings('div').hide();
                } else {
                    if (oData.text == $("#AreaInside").val()) {
                        $('.ex-cover-tree-select').hide().siblings('div').hide();
                    } else {
                        $("#AreaInside").val($("#AreaInside").val() + "," + oData.text);
                        $("#s_h_AreaInside").val($("#s_h_AreaInside").val() + "," + oData.id);
                        $('.ex-cover-tree-select').hide().siblings('div').hide();
                    }
                }
            }

        });
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '过境车辆上报',
            content: template('AddOverVehiclesTpl', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('过境车辆上报');

        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
        var exparameters = {};
        if (this.oOption.oModel) {
            exparameters = {
                Id: this.oOption.oModel.Id,
                //FromDepartmentId: this.oOption.oModel.FromDepartmentId,
                //ToDepartmentId: this.oOption.oModel.ToDepartmentId,
                //CurTaskId: this.oOption.oModel.CurTaskId,
                CheckOlineRate: this.oOption.oModel.CheckOlineRate,
                ToDepartmentName: this.oOption.oModel.ToDepartmentName,
                CurrentTime: this.oOption.oModel.CurrentTime
            }
            //exparameters = {
            //    EnterpriceId: this.oOption.oModel.EnterpriceId,
            //    VehcleNoS: this.oOption.oModel.Vehiclelis,
            //    SiteId: this.oOption.oModel.SiteId,
            //    UploadSiteId: this.oOption.oModel.Id,
            //}
        }
        // grid 查询
        this.oGrid = new ES.Muck.uploadGrid(this, {
            cContainer: '.ec-u-sm-12',
            cGridContainer: 'dtGridSiteReportsContainer',
            cPagerContainer: ''
        }, {
            url: '/UploadVehicleArea/GetVehcleInfo',
            postData: {
                exparameters: exparameters
            },
            jsonReader: {
                root: "dataList"
            },
            multiselect: false,
            rowNum: 100000,
        });

        var nW = 487
        var nH = 195;

        this.oGrid.initGrid({ width: nW, height: nH });

        // 分析按钮
        this.oDialogBtn = new ES.Muck.DialogBtn(this, {});

    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: ES.Lang.BaseDialog[1],
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: ES.Lang.BaseDialog[2],//取消
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    save: function () {
        var gridData = this.oGrid.gridData;
        if (gridData.dataList.length == 0) {
            ES.aWarn("请分析车辆到表格！"); return
        }
        if (!$('#s_h_AreaInside').val()) {
            ES.aWarn("请选择区域"); return
        }
        var Vehiclelis = [], status, oParams, UploadSiteId, newVehicles, IsNotHasCancelArr = [], IsNotHasCancel = 0;
        for (var i = 0; i < gridData.dataList.length; i++) {
            if (!gridData.dataList[i].Status) {
                status = 0;
            } else {
                status = gridData.dataList[i].Status;
            }
            newVehicles = {
                VehicleId: gridData.dataList[i].VehicleId,
                UpAreaId: gridData.dataList[i].UpAreaId,
                Id: gridData.dataList[i].Id,
                Status: status,
            }
            IsNotHasCancelArr.push(status);
            Vehiclelis.push(newVehicles);//作废的车辆的ID和企业Id和车辆的状态
        };
        if (IsNotHasCancelArr.indexOf(3) > -1) {
            IsNotHasCancel = 1
        }
        oParams = {
            Id: gridData.exparameters.UpAreaId,
            IsNotHasCancel: IsNotHasCancel,
            CheckOlineRate: $('#reportsTotal').text().replace("%", ""),
            CurrentTime: $('#CurrentTime').val()
        };
        var isPass;
        if ($("#passExamine").is(":checked")) {
            isPass = 1;
        } else {
            isPass = 0;
        }
        ES.loadAn($(this.oDialog.node));
        ES.getData({ CurrentTime: $('#CurrentTime').val(), ToAreaIds: $('#s_h_AreaInside').val(), Vehiclelis: Vehiclelis, isPass: isPass }, "/UploadVehicleArea/SetUploadSiteByVehcleNos", this.saveHandler, this);//第一次上报
    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    },
});
//重新上传车辆弹出层
ES.Common.ReuploadEdit = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {

        //this.oGridOpt = oGridOpt;
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};

        this.initButton();

        this.initDialog();

        this.initEvent();

        this.initUI();
        this.newData;
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '工地上报车辆',
            content: template('ReUploadVehiclesAreaTpl', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('重新上传车辆');

        this.oDialog.showModal();
    },
    // 初始画界面对象
    initUI: function () {
        var exparameters = {};
        if (this.oOption.oModel) {
            exparameters = {
                UpAreaId: this.oOption.oModel.Id,
                //FromDepartmentId: this.oOption.oModel.FromDepartmentId,
                //ToDepartmentId: this.oOption.oModel.ToDepartmentId,
                //CurTaskId: this.oOption.oModel.CurTaskId,
                CheckOlineRate: this.oOption.oModel.CheckOlineRate,
                ToDepartmentName: this.oOption.oModel.ToDepartmentName,
                CurrentTime: this.oOption.oModel.CurrentTime
            }
        }
        // grid 查询
        this.oGrid = new ES.Muck.ReuploadGrid(this, {
            cContainer: '.ex-selcar-content',
            cGridContainer: 'dtGridSiteReportsContainer',
            cPagerContainer: ''
        }, {
            url: '/UploadVehicleArea/GetUpVehcleLis',
            postData: {
                exparameters: exparameters
            },
            jsonReader: {
                root: "dataList"
            },
            multiselect: false,
            rowNum: 100000,
            loadError: function (xhr, status, error) {
                console.log(xhr)
            }
        });

        var nW = 487;
        var nH = 195;

        this.oGrid.initGrid({ width: nW, height: nH });

        // 分析按钮
        this.oReDialogBtn = new ES.Muck.ReDialogBtn(this, {});

    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }

        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: ES.Lang.BaseDialog[1],
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: ES.Lang.BaseDialog[2],//取消
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen: function () {

    },
    save: function () {
        var gridData = this.oGrid.gridData;
        if (gridData.dataList.length == 0) {
            ES.aWarn("请分析车辆到表格！"); return
        }
        var Vehiclelis = [], status, oParams, UploadSiteId, newVehicles, IsNotHasCancelArr = [], IsNotHasCancel = 0;
        if (gridData.exparameters.UploadSiteId) {
            UploadSiteId = gridData.exparameters.UploadSiteId
        } else {
            UploadSiteId = null;
        }
        for (var i = 0; i < gridData.dataList.length; i++) {
            if (!gridData.dataList[i].Status) {
                status = 0;
            } else {
                status = gridData.dataList[i].Status;
            }
            newVehicles = {
                VehicleId: gridData.dataList[i].VehicleId,
                UpAreaId: gridData.dataList[i].UpAreaId,
                Id: gridData.dataList[i].Id,
                Status: status,
            }
            IsNotHasCancelArr.push(status);
            Vehiclelis.push(newVehicles);//作废的车辆的ID和企业Id和车辆的状态
        };
        if (IsNotHasCancelArr.indexOf(3) > -1) {
            IsNotHasCancel = 1
        }
        oParams = {
            Id: gridData.exparameters.UpAreaId,
            IsNotHasCancel: IsNotHasCancel,
            CheckOlineRate: $('#reportsTotal').text().replace("%", ""),
            CurrentTime:$('#CurrentTime').val()
        };
        var isPass;
        if ($("#passExamine").is(":checked")) {
            isPass = 1;
        } else {
            isPass = 0;
        }
        ES.loadAn($(this.oDialog.node));
        ES.getData({ areaMod: oParams, Vehiclelis: Vehiclelis, isPass: isPass }, "/UploadVehicleArea/UpdateUploadSiteByVehcleNos", this.saveHandler, this);//重新上报
    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    },
});