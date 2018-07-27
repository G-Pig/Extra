/**弹出层的
 道闸1: 000000000001    道闸2: 000000000002
 摄像机1: 100000000001   摄像机2: 100000000002
 抬起道闸 5 落下 6
 * */
//闸道
ES.Common.ShowGate = ES.Common.DialogEdit.extend({
    save: function () {
        var oParam = { Text:$('#reasonsText').val(),PhoneNum:"000000000001",Command:5}
        ES.loadAn($(this.oDialog.node));
        ES.getData(oParam,"/EntranceGuard/EntranceGuardDoor",this.saveHandler,this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oTree.reload();
        }
    },
});
//控制闸道
ES.Common.CloseGate =ES.Common.DialogDel.extend({
    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.oTree.reload();
        }
    },
});
//语音
ES.Common.ShowVoice = ES.Common.DialogEdit.extend({
    save: function () {
        if(!$('#voiceText').val()){
            ES.aWarn("请语音信息"); return
        }
        var gg = "000000000001"
        var oParam = { Text:$('#voiceText').val(),PhoneNum:$('#devNo').val()}
        //var oParam = { Text:$('#voiceText').val(),PhoneNum:gg}
        ES.loadAn($(this.oDialog.node));
        ES.getData(oParam,"/EntranceGuard/EntranceGuardVoice",this.saveHandler,this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        // var oParent =this._oParent;
        // if(oData.IsSuccess){
        //     oParent.oEditD = new ES.Common.AfterPage(oParent,{bRemove:true,cUrl:''});
        //     oParent.oEditD.showModal();
        // }
    },
});

ES.Common.AfterPage = ES.Evented.extend({
    initialize: function (oParent, oOption, oDOption) {
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
            title: 'afterpage',
            content: template('sucessPage', this.oOption.oModel)
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
                value: '查看报装单',
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
        //ES.loadAn($(this.oDialog.node));
        //ES.getData({}, "", this.saveHandler, this);
    },
    saveHandler: function (oData) {
        if (oData.IsSuccess) {
            ES.Common.DialogEdit.prototype.saveHandler.call(this, oData);
            this._oParent.oGrid.query({});
        }
    },
});

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
            url: '/UploadSite/GetUploadSite',

            postData:{
                exparameters: {
                    UploadSiteId: this.oBusData
                }
            },
            multiselect: false,
            rowNum: 100000
        });
        var nW = $('.ex-Permit-VehicleModel').width();
        var nH = $('.ex-Permit-VehicleModel').parent().height() - 225;

        this.oModelGrid.initGrid({ width: nW, height: nH });
    },
    del: function (oData) {
        this.oBusData = oData;
        this.hideFooter();
        this.oDialog.showModal();
    }
});