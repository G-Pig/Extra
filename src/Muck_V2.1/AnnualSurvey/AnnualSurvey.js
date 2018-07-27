/**
 * 树加载对象
 * 车辆变更弹框  选择车辆/导入车辆
 * 对应的 html 为 annualSurveyTpl.csHtml
 * Created by yangHang on 2017/11/8.
 *
 */

ES.AnnualSurvey = {};

ES.AnnualSurvey.Dialog = ES.Evented.extend({
    oOption: {
        Import:false,
        ImportValue: 'display:none;',
        annualValue:'display:block;'
    },
    initialize: function (oParent, oOption, oDOption) {

        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = oDOption;

        this.initButton();

        this.initDialog();

        this.initEvent();

        this.initUI();
    },

    // 初始化 dialog
    initDialog: function () {

        var  oDOption={
            fixed: true,
                align: 'right bottom',
                title: '车辆变更',
                content:template('annualSurveyTpl', this.oOption)
        };
        ES.extend(oDOption,this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },

    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },

    // 初始画界面对象
    initUI: function () {
        var self = this;
        if(!this.oOption.Import){

            var oParam = { exparameters:  {ResourceTypeId:this.oOption.ResourceId} };
            // grid 查询
            this.oGrid = new ES.AnnualSurvey.Grid(this, {
                cContainer:'.ex-selcar-contet',
                cGridContainer:'dtTruckGridContainer',
                cPagerContainer:'dtTruckGridToolBarContainer',
                addUserCount:0,
                Import:self.oOption.Import
            }, {multiselect:true,url:this.oOption.url,rowNum: 100000,postData: oParam,});

            var nW = $('.ex-selcar-contet').width();
            var nH = $('.ex-selcar-contet').height() - $('.ex-selcar-contet-type').height() - 40;

            this.oGrid.initGrid({ width: nW, height: nH});
            // 查询 控件
            // this.oSearch = new ES.AnnualSurvey.Search(this, {});
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

        this.oDialog.addEventListener('close',function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });


        if(this.oOption.Import){
            $('#cancelStep').bind('click',function(){
                if (self.oOption.bRemove) {
                    self.oDialog.remove();
                }
                else {
                    self.oDialog.close();
                }
            });
            $('#cancelStep2').bind('click',function(){
                if (self.oOption.bRemove) {
                    self.oDialog.remove();
                }
                else {
                    self.oDialog.close();
                }
            });

            $('#nextStep').bind('click',function(){
                if(!$('#AnnualSurveyImportV').val()) {
                    ES.aErr("请按照要求输入车牌号列表");
                }else{
                    if(!self.oGrid){
                        self.importSaveHandler();
                    }else{
                        var ImportValue = $('#AnnualSurveyImportV').val();
                        self.oGrid.query({oParam: {companyId:self.oOption.ResourceId,vehnos:ImportValue}});
                        self.changeStep(1);
                        $('.ex-annualSurvey-import').hide().parent().siblings().find('.ex-annualSurvey-main').show();
                        $('.ec-annualSurvey-time').show();
                    }
                    $('.ui-dialog-footer').find('.ec-steps-2').show().siblings('.ec-steps-1').hide();
                }
            });
            $('#prevStep').bind('click',function(){
                self.changeStep(-1);
                $('.ex-annualSurvey-main').hide().parent().siblings().find('.ex-annualSurvey-import').show();
                $('.ec-annualSurvey-time').hide();
                $('.ui-dialog-footer').find('.ec-steps-1').show().siblings('.ec-steps-2').hide();
            })

            $('#okStep').bind('click',function(){
                self.save();
            })

        }
    },

    initButton: function () {
        var self = this;
        if(this.oOption.Import){
            // var aoButton =[{
            //     value: '取消',
            //     callback: function () {
            //         if (self.oOption.bRemove) {
            //             this.remove();
            //         }
            //         else {
            //             this.close();
            //         }
            //         return false;
            //     }
            //
            // },
            //     {
            //         id:"next",
            //         value: '下一步',
            //         callback: function () {
            //
            //             if(!$('#AnnualSurveyImportV').val()) {
            //                 ES.aErr("请按照要求输入车牌号列表");
            //                 return false;
            //             }else{
            //                 self.importSaveHandler();
            //             }
            //
            //             var obj = this;
            //             self.initNextButton(obj);
            //             return false;
            //         }
            //
            //     } ];

        }else{
            var aoButton = [
                {
                    value: ES.Lang.BaseDialog[2],
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
                {
                    value: ES.Lang.BaseDialog[1],
                    callback: function () {
                        self.save();
                        return false;
                    },
                    autofocus: true
                },
            ];
        }
        this.oDOption.button = aoButton;
    },
    afterOpen:function(id) {

    },
    importSave:function(e){

    },
    importSaveHandler:function(){

        var ImportValue = $('#AnnualSurveyImportV').val();
        // grid 返回数据初始化
        this.oGrid = new ES.AnnualSurvey.Grid(this, {
            cContainer:'.ex-selcar-contet',
            cGridContainer:'dtTruckGridContainer',
            cPagerContainer:'dtTruckGridToolBarContainer',
            addUserCount:0
        }, {multiselect:true,url:this.oOption.url,rowNum: 100000,postData:{"exparameters":{companyId:this.oOption.ResourceId,vehnos:ImportValue}}});

        var nW = $('.ex-selcar-contet').width();
        var nH = $('.ex-selcar-contet').height() - $('.ex-selcar-contet-type').height() - 40;

        this.oGrid.initGrid({ width: nW, height: nH});


        // 查询 控件
        this.oSearch = new ES.AnnualSurvey.Search(this, {});

        //界面更换
        this.changeStep(1);
        $('.ex-annualSurvey-import').hide().parent().siblings().find('.ex-annualSurvey-main').show();
        $('.ec-annualSurvey-time').show();
        $('.ex-selcar-sider').show();
        $('.ex-selcar-contet-type').height(40);
        if(this.oOption.change){
            $('.ex-selcar-contet-type>ul>li').eq(1).show();
            $('.ex-selcar-contet-type>ul>li').eq(2).show();
            $('.ex-selcar-contet-type>ul>li').eq(3).show();
            $('.ex-selcar-contet-type>ul>li').eq(4).show();
            $('.ex-selcar-contet-type>ul>li').eq(5).show();
            $('.ex-selcar-contet-type>ul>li').eq(6).show();
            $('.ex-selcar-contet-type>ul>li').eq(7).hide();
            $('.ex-selcar-contet-type>ul>li').eq(8).hide();
            $('.ex-selcar-contet-type>ul>li').eq(9).hide();
        }
        $('#dtTruckGridContainer')
        $('#dtTruckGridContainer').setGridWidth($('.ex-selcar-contet').width());
        $('#dtTruckGridContainer').setGridHeight($('.ex-selcar-contet').height() - $('.ex-selcar-contet-type').height() - 40);
    },
    save: function () {
        ES.loadAn($(this.oDialog.node));
        var VIds = [];
        var Vcontent = $(".ex-layout-selected-user").find('label>a');
        for(var i = 0;i<Vcontent.length;i++){
            var _Vid = Vcontent.eq(i).attr('_uid');
            VIds.push(_Vid);
        }
        var remark = $('#approvalOpinion').val();

        ES.getData({companyId:this.oOption.ResourceId,vehids:VIds,remark:remark},this.oOption.saveUrl,this.saveHandler,this);

    },
    saveHandler: function(oData){
        ES.removeAn($(this.oDialog.node));
        //var oData = oTemp.oData;
        var bAdd = false;
        if(!oData) {
            ES.aErr(ES.Lang.BaseDialog[34]);
            return;
        }

        if (oData.IsSuccess) {
            ES.aSucess('操作成功');
            $('#VehicleInfoSearch').trigger('click');
            this._oParent.oTree.reload();

            if (this.oOption.bRemove) {
                this.oDialog.remove();
            }
            else {
                this.oDialog.close();
            }
        }
        else {
            this.changeStep(-2);
            ES.aErr('操作失败: '+oData.Message);
        }
    },
    //进度条更换
    changeStep:function(Index){

        var ItemStatus =$('.ec-steps .ec-steps-item');//完成亦或者正在完成 整体 状态改变class
        var IconStatus = $('.ec-steps-head-inner .ec-steps-icon');//完成或者正在完成  图标/数字 状态改变class

        switch(Index){
            case 1://  筛选/变更中
                //变更整体状态
                ItemStatus.eq(1).removeClass('ec-steps-status-wait').addClass('ec-steps-status-finish');
                //变更icon
                IconStatus.eq(0).removeClass('ec-icon-clock-o').addClass('ec-icon-check');
                IconStatus.eq(1).addClass('ec-icon-clock-o').empty();

                break;
            case -1://  筛选/变更中
                //变更整体状态
                ItemStatus.eq(1).removeClass('ec-steps-status-finish').addClass('ec-steps-status-wait');
                //变更icon
                IconStatus.eq(0).removeClass('ec-icon-check').addClass('ec-icon-clock-o');
                IconStatus.eq(1).removeClass('ec-icon-clock-o').html(2);
                break;
            case 2://  变更完成
                //变更整体状态
                ItemStatus.eq(2).removeClass('ec-steps-status-wait').addClass('ec-steps-status-finish');
                ItemStatus.eq(3).removeClass('ec-steps-status-wait').addClass('ec-steps-status-finish');;
                //变更icon
                IconStatus.eq(1).removeClass('ec-icon-clock-o').addClass('ec-icon-check');
                IconStatus.eq(2).addClass('ec-icon-check').empty();
                IconStatus.eq(3).addClass('ec-icon-check').empty();
                break;
            case -2:
                //变更整体状态
                ItemStatus.eq(2).removeClass('ec-steps-status-finish').addClass('ec-steps-status-wait');
                ItemStatus.eq(3).removeClass('ec-steps-status-finish').addClass('ec-steps-status-error').find('.ec-steps-main .ec-steps-title').html('提交失败,请按照提示重新操作!');
                //变更icon
                IconStatus.eq(1).removeClass('ec-icon-check').addClass('ec-icon-clock-o');
                IconStatus.eq(2).removeClass('ec-icon-check').html(3);
                IconStatus.eq(3).removeClass('ec-icon-check').html(4);
                break;
        }

    }
});


