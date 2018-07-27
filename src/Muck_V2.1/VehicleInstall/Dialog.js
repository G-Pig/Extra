/**弹出层审核、详情、下单、新增 */
ES.Common.Examine = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '审核',
            content: template('examineReport', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
        var self = this;
        var exparameters = {
            VRegisterId: this.oOption.oModel.Id
        }
        // grid 查询
        this.oGrid = new ES.Muck.ExamineGrid(this, {
            cContainer: '.ex-site-users-bottom',
            cGridContainer: 'examineGridContainer',
            cPagerContainer: ''
        }, {
            url: this.oOption.cUrl,
            postData:{
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
        //渲染图片
        ES.getData(exparameters, self.oDOption.cUrl, this._appenImg,this);
    },
    _appenImg:function(data){
        if(data.Img){
            if(data.Img && data.Img.length>0){
                var imgLis = data.Img;
                for(var i=0;i<imgLis.length;i++){
                    var imgItem =
                        '<li class="ec-form-group ec-gallery-item">' +
                        '   <div class="ec-gallery-item">'+
                        '       <a href="'+imgLis[i].ImgUrl+'">' +
                        '           <img src="'+imgLis[i].ImgUrl+'" />' +
                        '       </a>' +
                        '   </div>' +
                        '</li>';
                    $('#imgContainer').append(imgItem);
                }
                $('#imgContainer').lightGallery({
                    selector: '.ec-gallery-item>a',
                    closable: false
                });
            }
        }
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
                value: "不通过",
                callback: function () {
                    self.reform();
                    return false;
                },
            },
            {
                value: "审核通过",
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
    afterOpen:function(){
        $('.ui-dialog-button>button:eq(0)').css({backgroundColor:"#F37B1D",color:"white"})
    },
    reform: function () {
        //整改的回调函数
        var VehLis = this.oGrid.gridData;
        var remark = $('#siteReportsInput').val();
        if(!remark){
            ES.aWarn('请填写审核意见！');
            return;
        }
        for(var i = 0;i<VehLis.dataList.length;i++){
            VehLis.dataList[i].VRegisterId = this.oBusData.Id;
        }
        ES.loadAn($(this.oDialog.node));
        ES.getData({ Vehiclelis: VehLis.dataList, Remark:remark}, "/VehicleInstall/CheckNotPass", this.saveHandler, this);
    },
    save: function () {
        var VehLis = this.oGrid.gridData;
        for(var i = 0;i<VehLis.dataList.length;i++){
            VehLis.dataList[i].VRegisterId = this.oBusData.Id;
        }
        ES.loadAn($(this.oDialog.node));
        ES.getData({Vehiclelis:VehLis.dataList,Remark:$('#siteReportsInput').val()}, "/VehicleInstall/CheckPass", this.saveHandler, this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
            this._oParent.oLayout._oParent.fire('VehicleInstall.initCount');
        }
    },
});

//详情弹窗页
ES.Common.Detail = ES.Common.BaseDialog.extend({
    afterOpen: function (id) {
        this.oModelGrid = new ES.Muck.DetailGrid(this, {
            // 容器
            cContainer: '.ex-Permit-VehicleModel',
            // grid id
            cGridContainer: 'VehicleModelGridContainer',
            // 分页菜单id
            cPagerContainer: 'VehicleModelGridToolBarContainer',
        }, {
            url: this.oOption.cUrl,
            postData:{
                exparameters: {
                    VRegisterId: this.oBusData
                }
            },
            multiselect: false,
            rowNum: 100000
        });
        var nW = $('.ex-Permit-VehicleModel').width();
        var nH = $('.ex-Permit-VehicleModel').parent().height() - 112;

        this.oModelGrid.initGrid({ width: nW, height: nH });
    },
    del: function (oData) {
        this.oBusData = oData;
        this.hideFooter();
        this.oDialog.showModal();
    }
});

//详情里的详情
ES.Common.InDetail = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '车辆详情',
            content: template('inDetail', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {

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
                value: "确定",
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen: function (id) {
        //渲染图片以及车辆详情
        ES.getData({VehicleId:this.oBusData.VehicleId}, "/VehicleInstall/GetBossVehicleInfoById", this._appendImg);
    },
    _appendImg:function(data){
        if(data){
            $('#MainDeviceNo').html(data._MainDeviceNo);
            $('#InstallTime').html(data.InstallTime);
            if(data.VehicleImgs && data.VehicleImgs.length>0){
                var imgLis = data.VehicleImgs;
                for(var i=0;i<imgLis.length;i++){
                    var imgItem =
                        '<li class="ec-form-group ec-gallery-item">' +
                        '   <div class="ec-gallery-item">'+
                        '       <a href="'+imgLis[i].ImgUrl+'">' +
                        '           <img src="'+imgLis[i].ImgUrl+'" />' +
                        '       </a>' +
                        '   </div>' +
                        '</li>';
                    $('#imgContainer').append(imgItem);
                }
                $('#imgContainer').lightGallery({
                    selector: '.ec-gallery-item>a',
                    closable: false
                });
            }
        }
    },
    save: function () {
        this.oDialog.remove();
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    },
});

//下单和批量下单
ES.Common.GetDone = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '下单',
            content: "确定下单？"
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
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
        console.log(this.oBusData)
        //ES.loadAn($(this.oDialog.node));
        //ES.getData({}, "", this.saveHandler, this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        var oParent = this._oParent;
        if (oData.IsSuccess) {
            this._oParent.oGrid.query({});
            oParent.oEditD = new ES.Common.AfterPage(oParent,{bRemove:true,cUrl:''});
            oParent.oEditD.showModal();
        }
    },
});

//新增
ES.Common.AddDialog = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initOn();
        this.initUI();
        this.oEnterpriseTree = new ES.Common.SelectTreeNodeW(null, { cBandSel: $("#EnterpriceInside") },
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
        this.oEnterpriseTree.on("selectVal", function (oData) {
            if(oData.data.type<=2){
                ES.aWarn('请选择企业！');
                return;
            }
            $("#s_h_EnterpriceInside").val(oData.id);
            $("#EnterpriceInside").val(oData.text);
            $('.ex-cover-tree-select').hide().siblings('div').hide();
        });
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '车辆报装',
            content: template('addNewReport', this.oOption.oModel)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
        // 上传图片按钮
        this.oDialogBtn = new ES.Muck.AddDialogBtn(this, {});
    },
    initOn:function(){
        this._oParent.on('OnChange.Vehicle',this.changeVehicle,this);
    },
    changeVehicle:function(oData){
        if(!oData.oData){
            $('#amount').html(0);
            this.VehLis = [];
            return;
        }
        var oData = oData.oData;
        var re = new RegExp("，", "g");
        var rem = new RegExp("、", "g");
        oData = oData.replace(re,',');
        oData = oData.replace(rem,',');
        var vLen = oData.split(',');
        var sLen;
        if(!vLen.length){
            sLen = 0;
            this.VehLis = [];
        }else if(vLen.length){
            sLen = vLen.length;
            this.VehLis = vLen;
        }
        $('#amount').html(sLen)
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
                value: '确定上报',
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
    afterOpen:function(data){
        if(this.oOption.oData){
            var oData = this.oOption.oData;
            var self = this;
            ES.getData({id:oData.Id}, "/VehicleInstall/GetUploadDetail",function(oData){
                $('#EnterpriceInside').val(oData.EnterpriceName);
                $('#s_h_EnterpriceInside').val(oData.EnterpriceId);
                $('#EnterpriceInside').attr('disabled','disabled');
                var cTime = oData.CreateTime.substr(0,10);
                $('#Contact').val(oData.Contact);
                $('#InstallTime').val(cTime);
                $('#Phone').val(oData.Phone);
                if(oData.VehicleNos){
                    $('#VehicleLis').val(oData.VehicleNos);
                    self._oParent.fire('OnChange.Vehicle',{oData:oData.VehicleNos});
                }
            });
        }
    },
    save: function () {
        var s_h_EnterpriceInside = $('#s_h_EnterpriceInside').val();
        var Contact = $('#Contact').val();
        var Phone = $('#Phone').val();
        var InstallTime = $('#InstallTime').val();
        var newVeh = [], isPass, VInstallId = "";
        var VehLis = this.VehLis;
        if(this.oOption.oData){
            VInstallId = this.oOption.oData.Id;
        }
        if(!VehLis || VehLis.length == 0){
            ES.aWarn('请输入正确的车牌号！')
            return false;
        }
        if(!s_h_EnterpriceInside || !Contact || !Phone || !InstallTime){
            ES.aWarn('请把带（*）号的信息填写完整！')
            return false;
        }
        var oParams = {
            EnterpriceId:s_h_EnterpriceInside,
            Contact:Contact,
            Phone:Phone,
            InstallTime:InstallTime,
            Id:VInstallId,
            VInstallId:VInstallId
        };
        for(var i =0;i<VehLis.length;i++){
            newVeh.push({
                VehicleNo:VehLis[i],
                EnterpriceId:s_h_EnterpriceInside,
                Contact:Contact,
                Phone:Phone,
                VInstallId:VInstallId,
                InstallTime:InstallTime,
            })
        };
        if ($("#passExamine").is(":checked")) {
            isPass = 1;
        } else {
            isPass = 0;
        }
        ES.loadAn($(this.oDialog.node));
        if(this.oOption.oData){
            ES.getData({enterpriceMod:oParams,Vehiclelis:newVeh,isPass:isPass}, "/VehicleInstall/UpdateUploadByVehcleNos", this.saveHandler, this);//重新上报
        }else{
            ES.getData({enterpriceMod:oParams,Vehiclelis:newVeh,isPass:isPass}, "/VehicleInstall/SetUploadByVehcleNos", this.saveHandler, this);
        }
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
        var oParent = this._oParent;
        if (oData.IsSuccess) {
            oParent.oGrid.query({});
            oParent.oLayout._oParent.fire('VehicleInstall.initCount');
            oParent.oEditD = new ES.Common.AfterPage(oParent,{bRemove:true,cUrl:'',oModel: this.VehLis.length});
            oParent.oEditD.showModal();
        }
    },
});

//完成添加后的页面
ES.Common.AfterPage = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '车辆报装',
            content: template('sucessPage', this.oOption)
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
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
                value: '继续报装',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '确定',
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
    afterOpen:function(){
        var oData = this.oOption;
        $('#vAmount').html(oData.oModel);
    },
    save: function () {
        this.oDialog.remove();
        this._oParent.oEditD = new ES.Common.AddDialog(this._oParent,{bRemove:true,cUrl:''});
        this._oParent.oEditD.showModal();
    },
    saveHandler: function (oData) {
        if (oData.IsSuccess) {
            ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
            this._oParent.oGrid.query({});
        }
    },
});

//删除
ES.Common.DelEntity =ES.Common.DialogDel.extend({
    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oGrid.query({});
        }
    }
});
