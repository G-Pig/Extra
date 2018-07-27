/**
 * 树加载对象
 * 选择车辆接口，也可以导入车辆接口
 * 对应的 html 为 selectTruckTpl.csHtml
 * Created by liulin on 2017/8/31.
 *
 *  ！！！线路绑车  规则绑车 ！！！两个页面同用一个js模块，但是得更换地址  TODO 有提醒注释
 */

ES.SelectTruck = {};

ES.SelectTruck.Dialog = ES.Evented.extend({

    initialize: function (cId, oOption, oDOption) {

        //this.oGridOpt = oGridOpt;
        this.cId = cId;
        ES.setOptions(this, oOption);
        this.oDOption = {};

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
                title: '选择车辆',
                content:ES.Util.template( $('#selectTruckTpl').html(),{divSelectTruck:'divVeh'}),
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

        // grid 查询
        this.oGrid = new ES.SelectTruck.Grid(this, {
            cContainer:'.ex-selcar-contet',
            cGridContainer:'dtTruckGridContainer_model',
            cPagerContainer:'dtTruckGridToolBarContainer_model'
        }, {multiselect:true,url:'/Vehicle/GetListByResourceTypeId',rowNum: 100000});

        var nW = 560;
        var nH = 386-39;

        this.oGrid.initGrid({ width: nW, height: nH});

        // 查询 控件
        this.oSearch = new ES.SelectTruck.Search(this, {});

        // 左边树结构
        this.oTree = new ES.SelectTruck.Tree(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': {
                    url: '/Enterprise/Tree?bindveh=1',
                    type: 'GET',
                }
            },
            plugins: ['types', 'search', 'unique']
        });

        if(this.oOption.type){
            $('.ex-select-type-box').show();
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
    },

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
            }
        ];
        this.oDOption.button = aoButton;
    },
    initIsAllEvent:function(){
        var self =this;
        $('.ex-select-type-box a.All').on('click',function(){
            $(this).addClass("active").parent().siblings().children('a.Select').removeClass('active');
            $('.ex-select-type-box').addClass('active').siblings().hide();
            self.oDialog.reset();
        });

        $('.ex-select-type-box a.Select').on('click',function(){
            $(this).addClass("active").parent().siblings().children('a.All').removeClass('active');
            $('.ex-select-type-box').removeClass('active').siblings().show();
            self.oDialog.reset();
        });
    },
    isAllActive:function(type){
        switch(type){
            case 0://自主选车
                $('.ex-select-type-box a.Select').click();
                break;
            case 1://全选
                $('.ex-select-type-box a.All').click();
                break;
        }
    },
    afterOpen:function(id) {
        this.initIsAllEvent();
        this.isAllActive(this.oOption.isAll);


        // TODO 规则分配 获取车辆地址
        ES.getData({ruleId:this.oBusData},"/RuleManage/GetAlarmRuleVehMap",function(data){
            for (var i = 0; i < data.length; i++) {
                this.oGrid.appendUser(data[i].Id, data[i].VehicleNo,data[i].Name,data[i].DeviceNo);
            }
        },this);

        // TODO 清运线路 获取车辆地址
        // ES.getData({Id:this.oBusData},"/Line/QueryLineVehMapList",function(data){
        //     for (var i = 0; i < data.length; i++) {
        //         this.oGrid.appendUser(data[i].Id, data[i].VehicleNo,data[i].Name,data[i].DeviceNo);
        //     }
        // },this);

    },

    save: function () {
        ES.loadAn($(this.oDialog.node));
        var VIds = [];
        var Vcontent = $(".ex-layout-selected-user").find('label>a');
        for(var i = 0;i<Vcontent.length;i++){
            var _Vid = Vcontent.eq(i).attr('_uid');
            VIds.push(_Vid);
        }
        var isAll = $('.ex-select-type-box').hasClass('active')?1:0;
        // TODO 规则分配 保存车辆绑定地址
        ES.getData({ruleId:this.oBusData,vehicleids:VIds,AllCheck:isAll},"/RuleManage/SaveAlarmRuleVehMap",this.saveHandler,this);
        // TODO 清运线路 保存车辆绑定地址
        // ES.getData({lineId:this.oBusData,vehIds:VIds},"/Line/SaveLineVehMap",this.saveHandler,this);

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
            $('.ex-rule-content .ex-grid-search').trigger('click');

            if (this.oOption.bRemove) {
                this.oDialog.remove();
            }
            else {
                this.oDialog.close();
            }
        }
        else {

            ES.aErr('操作失败: {message}', oData);
        }
    }
});


