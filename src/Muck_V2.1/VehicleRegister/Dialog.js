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

        // 分析按钮
        this.oDialogBtn = new ES.Muck.DialogBtn(this, {});
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
        // if (!$('#siteReportsInput').val()) {
        //     ES.aWarn("请填写审核意见"); return
        // }
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
//上传车辆弹出层
ES.Common.AddVehicles = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initUI();
        this.initEvent();
        this.initOn();
        this.oEnterpriceInsideTree = new ES.Common.SelectTreeNodeW(null, { cBandSel: $("#EnterpriceInside") },
            {
                core: {
                    'animation': 0,
                    'check_callback': true,
                    'state': { 'opened': true },
                    'data': {
                        'url': '/Enterprise/Tree',
                    }
                },
                plugins: ["search"],
            });
        this.oEnterpriceInsideTree.on("selectVal", function (oData) {
            if (oData.data.type <= 2) {
                ES.aWarn("请选择企业！")
            } else {
                $("#s_h_EnterpriceInside").val(oData.id);
                $("#EnterpriceInside").val(oData.text);
                $('.ex-cover-tree-select').hide().siblings('div').hide();
            }
        });
        this.gridData;
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '车辆户籍上报',
            content: template('VehicleRegisterUploadTpl', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('车辆户籍上报');

        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
        var exparameters = {};
        var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        if (this.oOption.oModel) {
            exparameters = {
                Id: this.oOption.oModel.Id,
                //OlineRate: this.oOption.oModel.OlineRate,
                //EnterpriceId: this.oOption.oModel.EnterpriceId,
                CurrentYearTime: cDate
            }
        }
        // grid 查询
        this.oGrid = new ES.Muck.uploadGrid(this, {
            cContainer: '.ec-u-sm-12',
            cGridContainer: 'dtGridSiteReportsContainer',
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

        var nW = 487
        var nH = 237;

        this.oGrid.initGrid({ width: nW, height: nH });

        // 分析按钮
        this.oDialogBtn = new ES.Muck.DialogBtn(this, {});
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
        if(!oGrid.gridData.dataList){return false}
        var loadData =[oGrid.gridData.dataList,oGrid._oParent.onRegister,oGrid._oParent.offRegister,oGrid._oParent.attached,oGrid._oParent.unInstall,oGrid._oParent.sameData,]
        $(this.oGrid.oJqGrid.selector).jqGrid("clearGridData");
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

        // this.gridData =oData;
        this.onRegister = onRegister;
        this.attached = attached;
        this.sameData = sameData;
        this.offRegister = offRegister;
        this.unInstall = unInstall;
    },
    cancleData:function(oData){
        //var dataList =this.oGrid.gridData.dataList;
        var dataList =this.oGrid.gridData.dataList;
        for(var i=0;i<dataList.length;i++){
            if(dataList[i].VehicleId == oData.VehicleId){
                dataList[i].Status = oData.Status;
                dataList[i].StatusStr = oData.StatusStr;
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
            self.$popTabContent.children('li').removeClass('ec-active in').eq(_i).addClass('ec-active in');
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
        var EnterpriceId = $('#s_h_EnterpriceInside').val();
        if (gridData.dataList.length == 0) {
            ES.aWarn("请分析车辆到表格！"); return
        }
        if (!EnterpriceId) {
            ES.aWarn("请选择区域"); return
        }
        var Vehiclelis = [], status, enterpriceMod, uploadVehicles=[], newVehicles, IsNotHasCancelArr = [], IsNotHasCancel = 0;
        for (var i = 0; i < gridData.dataList.length; i++) {
            if (!gridData.dataList[i].Status) {
                status = 0;
            } else {
                status = gridData.dataList[i].Status;
            }
            newVehicles = {
                VehicleId: gridData.dataList[i].VehicleId,
                VehicleNo: gridData.dataList[i].VehicleNo,
                CurrentEnterpriceId:gridData.dataList[i].CurrentEnterpriceId,
                Id: gridData.dataList[i].Id,
                Status: status,
            }
            IsNotHasCancelArr.push(status);
            Vehiclelis.push(newVehicles);//作废的车辆的ID和企业Id和车辆的状态
        };
        for(var j=0;j<Vehiclelis.length;j++){
            if(Vehiclelis[j].Status !=3){
                uploadVehicles.push(Vehiclelis[j])
            }
        }
        if (IsNotHasCancelArr.indexOf(3) > -1) {
            IsNotHasCancel = 1
        }
        enterpriceMod = {
            IsNotHasCancel: IsNotHasCancel,
            EnterpriceId:EnterpriceId
        };
        var isPass;
        if ($("#passExamine").is(":checked")) {
            isPass = 1;
        } else {
            isPass = 0;
        }
        ES.loadAn($(this.oDialog.node));
        ES.getData({enterpriceMod: enterpriceMod, Vehiclelis: uploadVehicles, isPass: isPass }, "/VehicleRegister/SetUploadByVehcleNos", this.saveHandler, this);//第一次上报
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
        this.initUI();
        this.initEvent();
        this.initOn();
        this.gridData;
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '车辆户籍重新上报',
            content: template('VehicleRegisterReUploadTpl', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('车辆户籍重新上报');

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
        this.exparameters = exparameters;
        // grid 查询
        this.oGrid = new ES.Muck.ReuploadGrid(this, {
            cContainer: '.ex-selcar-content',
            cGridContainer: 'dtGridSiteReportsContainer',
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
            loadError: function (xhr, status, error) {
                console.log(xhr)
            }
        });

        var nW = 487;
        var nH = 237;

        this.oGrid.initGrid({ width: nW, height: nH });

        // 分析按钮
        this.oReDialogBtn = new ES.Muck.ReDialogBtn(this, {});
        this.$popTabTitle = $('.ex-layout-pop-tab-title');
        this.$popTabContent = $('.ex-layout-pop-tab-content');
    },
    initOn: function () {
        this._oParent.on('Upload.reloadGrid',this.reloadGrid,this);
        this._oParent.on('Upload.count',this.initCount,this);
        this._oParent.on('Upload.cancelData',this.cancleData,this);
    },
    reloadGrid:function(oData){
        var oGrid = this.oGrid;
        if(!oGrid.gridData.dataList){
            $(this.oGrid.oJqGrid.selector).jqGrid("clearGridData");
            oGrid.query({});
            return false
        };
        var loadData =[oGrid.gridData.dataList,oGrid._oParent.onRegister,oGrid._oParent.offRegister,oGrid._oParent.attached,oGrid._oParent.unInstall,oGrid._oParent.sameData,]
        $(this.oGrid.oJqGrid.selector).jqGrid("clearGridData");
        for (var i = 0; i <= loadData[oData.cId].length; i++) {
            $(this.oGrid.oJqGrid.selector).jqGrid('addRowData', i + 1, loadData[oData.cId][i]);
        };
    },
    //重置总数
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

        this.gridData = oData;
        this.onRegister = onRegister;
        this.attached = attached;
        this.sameData = sameData;
        this.offRegister = offRegister;
        this.unInstall = unInstall;
    },
    //作废的数据
    cancleData:function(oData){
        var dataList =this.gridData.dataList;
        for(var i=0;i<dataList.length;i++){
            if(dataList[i].VehicleId == oData.VehicleId){
                dataList[i].Status = oData.Status;
                dataList[i].StatusStr = oData.StatusStr;
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
            self._oParent.fire('Upload.reloadGrid',{cId:_i});
            self.$popTabTitle.children('li').removeClass('ec-active').eq(_i).addClass('ec-active');
            self.$popTabContent.children('li').removeClass('ec-active in').eq(_i).addClass('ec-active in');
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
        var EnterpriceId = $('#s_h_AreaInside').val();
        if (!gridData.dataList || gridData.dataList.length == 0) {
            ES.aWarn("请分析车辆到表格！"); return
        }
        var Vehiclelis = [], status, enterpriceMod, uploadVehicles=[], newVehicles, IsNotHasCancelArr = [], IsNotHasCancel = 0;
        for (var i = 0; i < gridData.dataList.length; i++) {
            if (!gridData.dataList[i].Status) {
                status = 0;
            } else {
                status = gridData.dataList[i].Status;
            }
            newVehicles = {
                VehicleId: gridData.dataList[i].VehicleId,
                VehicleNo: gridData.dataList[i].VehicleNo,
                CurrentEnterpriceId:gridData.dataList[i].CurrentEnterpriceId,
                Id: gridData.dataList[i].Id,
                Status: status,
                VRegisterId:gridData.exparameters.VRegisterId
            }
            IsNotHasCancelArr.push(status);
            Vehiclelis.push(newVehicles);//作废的车辆的ID和企业Id和车辆的状态
        };
        for(var j=0;j<Vehiclelis.length;j++){
            if(Vehiclelis[j].Status !=3){
                uploadVehicles.push(Vehiclelis[j])
            }
        }
        if (IsNotHasCancelArr.indexOf(3) > -1) {
            IsNotHasCancel = 1
        }
        enterpriceMod = {
            IsNotHasCancel: IsNotHasCancel,
            EnterpriceId:EnterpriceId,
            Id:gridData.exparameters.VRegisterId
        };
        var isPass;
        if ($("#passExamine").is(":checked")) {
            isPass = 1;
        } else {
            isPass = 0;
        }
        ES.loadAn($(this.oDialog.node));
        ES.getData({ enterpriceMod: enterpriceMod, Vehiclelis: uploadVehicles, isPass: isPass }, "/VehicleRegister/UpdateUploadSiteByVehcleNos", this.saveHandler, this);//重新上报
    },

    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    },
});
//删除车辆
ES.Common.DelEntity =ES.Common.DialogDel.extend({
    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
            this._oParent._oParent.oGrid.query({});
        }
    },
});
