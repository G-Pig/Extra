//审核页面
ES.Common.ExamineAdvice = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initUI();
        this.initEvent();
        this.initOn();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '车辆户籍审核',
            content: template('VehicleRegisterExamineTpl', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('车辆户籍审核');

        this.oDialog.showModal();
    },
    // 初始画界面对象
    initUI: function () {
        var exparameters = {};
        if (this.oOption.oModel) {
            exparameters = {
                VRegisterId: this.oOption.oModel.Id,
                Id: this.oOption.oModel.Id,
                EnterpriceName: this.oOption.oModel.EnterpriceName,
                EnterpriceId: this.oOption.oModel.EnterpriceId,
                CurrentYearTime: this.oOption.oModel.CurrentYearTime,
                IsNotHasCancel:1
            }
        }
        // grid 查询
        this.oGrid = new ES.Muck.ExamineGrid(this, {
            cContainer: '.ex-site-users-bottom',
            cGridContainer: 'examineGridContainer',
            cPagerContainer: ''
        }, {
            url: '/VehicleRegister/GetStatusByVehcleNo',
            postData: {
                exparameters: exparameters
            },
            jsonReader: {
                root: "dataList"
            },
            multiselect: false,
            rowNum: 100000,
        });

        var nW = $(".exGridContainer").width();
        var nH = 300;

        this.oGrid.initGrid({ width: nW, height: nH });

        this.$popTabTitle = $('.ex-layout-pop-tab-title');
        this.$popTabContent = $('.ex-layout-pop-tab-content');
    },
    initOn: function () {
        this._oParent.on('Upload.grid',this.reloadGrid,this);
        this._oParent.on('Upload.count',this.initCount,this);
        this._oParent.on('Upload.cancelData',this.cancleData,this);
    },
    reloadGrid:function(oData){
        var oGrid = this.oGrid;
        if(!oGrid.gridData){return false}
        var loadData =[oGrid.gridData.dataList,oGrid._oParent.onRegister,oGrid._oParent.offRegister,oGrid._oParent.attached,oGrid._oParent.unInstall,oGrid._oParent.sameData,]
        $(this.oGrid.oJqGrid.selector).jqGrid("clearGridData");
        $(this.oGrid.oJqGrid.selector).jqGrid({
            datatype: "json",
            data : loadData[oData.cId],
            colModel: [
                { label: '修改的辅助名', name: 'CreateName', editable: true, align: 'center', sortable: false, hidden: true },
                { label: '车辆Id', name: 'VehicleId', editable: true, align: 'center', sortable: false, hidden: true },
                { label: '企业Id', name: 'CurrentEnterpriceId', editable: true, align: 'center', sortable: false, hidden: true },
                { label: '车辆类型', name: 'VehType', editable: true, align: 'center', sortable: false, hidden: true },
                { label: '车辆状态', name: 'Status', editable: true, align: 'center', sortable: false, hidden: true },

                { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false, width: 40 },
                { label: '车辆状态', name: 'StatusStr', editable: true, align: 'center', width: 40, sortable: false },
                { label: '车辆类型', name: 'VehTypeStr', editable: true, align: 'center', width: 40, sortable: false },
                { label: '所属企业', name: 'CurrentEnterpriceName', editable: true, align: 'center', width: 90, sortable: false },
                {
                    label: "操作", name: "actions", align: 'center', width: 40, sortable: false, title: false,
                    formatter: function (val, opt, item) {
                        var content = '';
                        var sText;
                        if (item.StatusStr == "作废") {sText = "取消作废"};
                        sText = "作废";
                        content += '<button class="ec-btn ec-btn-xs ec-btn-default cancleVehicle">' + sText + '</button>';
                        return content;
                    }
                }
            ],
            onSelectRow: function (cId, d, e) {
                var record = $(this).data('oData').dataList[parseInt(cId) - 1];
                self.initClick(e, record);
            },
        });
        for (var i = 0; i <= loadData[oData.cId].length; i++) {
            $(this.oGrid.oJqGrid.selector).jqGrid('addRowData', i + 1, loadData[oData.cId][i]);
        };
    },
    initCount:function(oData){
        var onRegister =[],offRegister=[], attached =[],unInstall=[],sameData=[];
        for(var i=0;i<oData.dataList.length;i++){
            if(oData.dataList[i].VehType == 0){
                onRegister.push(oData.dataList[i]);
            }else if(oData.dataList[i].VehType == 1){
                offRegister.push(oData.dataList[i]);
            }
            else if(oData.dataList[i].VehType == 2){
                attached.push(oData.dataList[i]);
            }
            else if(oData.dataList[i].VehType == 3){
                unInstall.push(oData.dataList[i]);
            };
            if(oData.dataList[i].IsHasUp){
                sameData.push(oData.dataList[i]);
            }
        }
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(0).find('span').text('('+oData.dataList.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(1).find('span').text('('+onRegister.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(2).find('span').text('('+offRegister.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(3).find('span').text('('+attached.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(4).find('span').text('('+unInstall.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(5).find('span').text('('+sameData.length+')');

        this.onRegister = onRegister;
        this.attached = attached;
        this.sameData = sameData;
        this.offRegister = offRegister;
        this.unInstall = unInstall;
    },
    cancleData:function(oData){
        var dataList =this.oGrid.gridData.dataList;
        for(var i=0;i<dataList.length;i++){
            if(dataList[i].VehicleId == oData.VehicleId){
                dataList[i].IsChange = oData.IsChange;
            }
        }
        this.fire('Upload.count',dataList);
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
        //点击不同的类型加载不同的数据
        this.$popTabTitle.children('li').bind('click', function () {
            var _i = $(this).index();
            self._oParent.fire('Upload.grid',{cId:_i});
            self.$popTabTitle.children('li').removeClass('ec-active').eq(_i).addClass('ec-active');
            // ES.loadAn(self.$popTabContent, null);
            // setTimeout(function () {
            self.$popTabContent.children('li').removeClass('ec-active in').eq(_i).addClass('ec-active in');
            //     ES.removeAn(self.$popTabContent, null);
            // }, 200);
        });
    },
    //初始化整改、同意、关闭按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                id: "reform",
                value: "不同意",
                callback: function () {
                    self.reform();
                    return false;
                },
            },
            {
                id: "agree",
                value: "同意",
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
        $('.ui-dialog-button>button:eq(0)').css({ backgroundColor: "red", color: "white" })
    },
    reform: function () {
        //整改的回调函数
        if (!$('#siteReportsInput').val()) {
            ES.aWarn("请填写审核意见"); return
        }
        var gridData =this.oGrid.gridData, Vehiclelis=[], newVehicles, oParams;
        for(var i=0;i<gridData.dataList.length;i++){
            newVehicles = {
                VehicleId: gridData.dataList[i].VehicleId,
                VehicleNo: gridData.dataList[i].VehicleNo,
                CurrentEnterpriceId:gridData.dataList[i].CurrentEnterpriceId,
                Id: gridData.dataList[i].Id,
                Status: status,
                VRegisterId:gridData.exparameters.VRegisterId
            };
            Vehiclelis.push(newVehicles);
        }
        ES.getData({ Id: gridData.exparameters.Id,Vehiclelis: Vehiclelis, Remark: $('#siteReportsInput').val() }, "/VehicleRegister/CheckNotPass", this.saveHandler, this)
    },
    save: function () {
        var gridData =this.oGrid.gridData, Vehiclelis=[], newVehicles, oParams;
        for(var i=0;i<gridData.dataList.length;i++){
            if(gridData.dataList[i].IsChange && gridData.dataList[i].IsChange == "2"){
                continue
            }
            newVehicles = {
                VehicleId: gridData.dataList[i].VehicleId,
                VehicleNo: gridData.dataList[i].VehicleNo,
                CurrentEnterpriceId:gridData.dataList[i].CurrentEnterpriceId,
                Id: gridData.dataList[i].Id,
                Status: status,
                VRegisterId:gridData.exparameters.VRegisterId
            };
            Vehiclelis.push(newVehicles);
        }
        ES.getData({ Vehiclelis: Vehiclelis, Remark: $('#siteReportsInput').val() }, "/VehicleRegister/CheckPass", this.saveHandler, this)
        // var newArr = [], self = this, arrItem, temp = [], temparray = [], reformVehicles = {};
        // var ids = $("#"+this.oGrid.oOption.cGridContainer).jqGrid("getGridParam", "selarrrow");//获取所有选择项
        // if (ids.length == 0) {
        //     ES.aWarn("请选择车辆！"); return
        // }
        // var UploadSiteId = this.oGrid.gridData.exparameters.UploadSiteId;//外面表格的行Id
        // for (var i = 0 ; i < ids.length; i++) {
        //     rowData = $("#exGridContainer").jqGrid('getRowData', ids[i]);//获取所有选择项的具体数据
        //     arrItem = {
        //         VehicleId: rowData.VehicleId,//表格里的选择的车牌号
        //         EnterpriceId: rowData.EnterpriceId,//表格里的选择的公司Id
        //         UploadSiteId: UploadSiteId,
        //         Id: rowData.Id,//表格里的选择的公司Id
        //         Status: 1
        //     };
        //     newArr.push(arrItem);//得到新的车辆数组
        // }
        // var origData = self.oGrid.gridData;
        // for (var i = 0; i < newArr.length; i++) {
        //
        //     temp[newArr[i].VehicleId] = true;//巧妙地方：把数组B的值当成临时数组1的键并赋值为真
        //
        // };
        //
        // for (var i = 0; i < origData.dataList.length; i++) {
        //
        //     if (!temp[origData.dataList[i].Id]) {
        //         reformVehicles = {
        //             VehicleId: origData.dataList[i].Id,//表格里的选择的车牌号
        //             EnterpriceId: origData.dataList[i].EnterpriceId,//表格里的选择的公司Id
        //             Id: origData.dataList[i].Id,//表格里的选择的公司Id
        //             UploadSiteId: UploadSiteId,
        //             Status: origData.dataList[i].Status
        //         }
        //         temparray.push(reformVehicles);//巧妙地方：同时把数组A的值当成临时数组1的键并判断是否为真，如果不为真说明没重复，就合并到一个新数组里，这样就可以得到一个全新并无重复的数组
        //
        //     };
        // };
        // for (var i in temparray) {
        //     newArr.push(temparray[i]);//将选择的和为选择的数据重新组合 并更改了各自的状态
        // }
        // ES.loadAn($(this.oDialog.node));
        // ES.getData({ Vehiclelis: newArr, Remark: $('#siteReportsInput').val() }, "/UploadSite/CheckPass", this.saveHandler, this)
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    },
});
//弹窗详情页
ES.Common.Detail = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initDialog();
        this.initUI();
        this.initEvent();
        this.initOn();
        this.newData;
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '车辆户籍——详情',
            content: template('VehicleRegisterDetailTpl', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('车辆户籍审核');

        this.oDialog.showModal();
    },
    // 初始画界面对象
    initUI: function () {
        var exparameters = {};
        if (this.oOption.oModel) {
            exparameters = {
                VRegisterId: this.oOption.oModel.Id,
                Id: this.oOption.oModel.Id,
                EnterpriceName: this.oOption.oModel.EnterpriceName,
                EnterpriceId: this.oOption.oModel.EnterpriceId,
                CurrentYearTime: this.oOption.oModel.CurrentYearTime
            }
        }
        // grid 查询
        this.oGrid = new ES.Muck.ModelGrid(this, {
            cContainer: '.ex-site-users-bottom',
            cGridContainer: 'detailGridContainer',
            cPagerContainer: ''
        }, {
            url: '/VehicleRegister/GetUploadVehs',
            postData: {
                exparameters: exparameters
            },
            jsonReader: {
                root: "dataList"
            },
            multiselect: false,
            rowNum: 100000,
        });

        var nW = $(".exGridContainer").width();
        var nH = 300;

        this.oGrid.initGrid({ width: nW, height: nH });
        this.$popTabTitle = $('.ex-layout-pop-tab-title');
        this.$popTabContent = $('.ex-layout-pop-tab-content');
    },
    initOn: function () {
        this._oParent.on('Upload.grid',this.reloadGrid,this);
        this._oParent.on('Upload.count',this.initCount,this);
    },
    reloadGrid:function(oData){
        var oGrid = this.oGrid;
        if(!oGrid.gridData){return false}
        var loadData =[oGrid.gridData.dataList,oGrid._oParent.onRegister,oGrid._oParent.offRegister,oGrid._oParent.attached,oGrid._oParent.unInstall,oGrid._oParent.sameData,]
        $(this.oGrid.oJqGrid.selector).jqGrid("clearGridData");
        $(this.oGrid.oJqGrid.selector).jqGrid({
            datatype: "json",
            data : loadData[oData.cId],
            colModel: [
                { label: '修改的辅助名', name: 'CreateName', editable: true, align: 'center', sortable: false, hidden: true },
                { label: '车辆Id', name: 'VehicleId', editable: true, align: 'center', sortable: false, hidden: true },
                { label: '企业Id', name: 'CurrentEnterpriceId', editable: true, align: 'center', sortable: false, hidden: true },
                { label: '车辆类型', name: 'VehType', editable: true, align: 'center', sortable: false, hidden: true },
                { label: '车辆状态', name: 'Status', editable: true, align: 'center', sortable: false, hidden: true },

                { label: '车牌号', name: 'VehicleNo', editable: true, align: 'center', sortable: false, width: 40 },
                { label: '车辆状态', name: 'StatusStr', editable: true, align: 'center', width: 40, sortable: false },
                { label: '车辆类型', name: 'VehTypeStr', editable: true, align: 'center', width: 40, sortable: false },
                { label: '所属企业', name: 'CurrentEnterpriceName', editable: true, align: 'center', width: 90, sortable: false },
                {
                    label: "操作", name: "actions", align: 'center', width: 40, sortable: false, title: false,
                    formatter: function (val, opt, item) {
                        var content = '';
                        var sText;
                        if (item.StatusStr == "3") {sText = "不变更"};
                        sText = "变更";
                        content += '<button class="ec-btn ec-btn-xs ec-btn-default cancleVehicle">' + sText + '</button>';
                        return content;
                    }
                }
            ],
            onSelectRow: function (cId, d, e) {
                var record = $(this).data('oData').dataList[parseInt(cId) - 1];
                self.initClick(e, record);
            },
        });
        for (var i = 0; i <= loadData[oData.cId].length; i++) {
            $(this.oGrid.oJqGrid.selector).jqGrid('addRowData', i + 1, loadData[oData.cId][i]);
        };
    },
    initCount:function(oData){
        var onRegister =[],offRegister=[], attached =[],unInstall=[],sameData=[];
        for(var i=0;i<oData.dataList.length;i++){
            if(oData.dataList[i].VehType == 0){
                onRegister.push(oData.dataList[i]);
            }else if(oData.dataList[i].VehType == 1){
                offRegister.push(oData.dataList[i]);
            }
            else if(oData.dataList[i].VehType == 2){
                attached.push(oData.dataList[i]);
            }
            else if(oData.dataList[i].VehType == 3){
                unInstall.push(oData.dataList[i]);
            };
            if(oData.dataList[i].IsHasUp){
                sameData.push(oData.dataList[i]);
            }
        }
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(0).find('span').text('('+oData.dataList.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(1).find('span').text('('+onRegister.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(2).find('span').text('('+offRegister.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(3).find('span').text('('+attached.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(4).find('span').text('('+unInstall.length+')');
        $('ul.ex-layout-pop-tab-title.ec-avg-sm-6>li').eq(5).find('span').text('('+sameData.length+')');

        this.onRegister = onRegister;
        this.attached = attached;
        this.sameData = sameData;
        this.offRegister = offRegister;
        this.unInstall = unInstall;
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        //点击不同的类型加载不同的数据
        this.$popTabTitle.children('li').bind('click', function () {
            var _i = $(this).index();
            self._oParent.fire('Upload.grid',{cId:_i});
            self.$popTabTitle.children('li').removeClass('ec-active').eq(_i).addClass('ec-active');
            self.$popTabContent.children('li').removeClass('ec-active in').eq(_i).addClass('ec-active in');
        });
    },
});