/**
 * 弹出层的解决方案
 *
 * 主要用于弹出规则添加 修改操作
 *
 * 新增 修改
 * Created by liulin on 2017/9/1.
 */

ES.Common.DialogRuleEdit = ES.Common.BaseDialog.extend({

    oOption: {

        // 页面提交的url路径
        cUrl: '',

        // 是否移除窗体
        bRemove: false,

    },

    // 父级容器、参数、弹出窗体
    initialize: function (oParent, oOption, oDOption) {
        ES.Common.BaseDialog.prototype.initialize.call(this, oParent, oOption, oDOption);
        // 窗体保存的业务数据
        this.oBusData = null;
    },

    // 加载html
    editShow: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('编辑');

        this.oDialog.showModal();
    },

    addShow: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('新增');
        this.oDialog.showModal();
    },
    detailShow: function (oData) {
        this.oBusData = oData;
        this.oDialog.title('详情');
        this.oDialog.showModal();
    },

    afterOpen:function(Id) {
        var oParam = {
            url: this.oOption.cUrl,
            data:   this.oBusData ,
            dataType: 'html',
            type:'Get'
        };
        ES.reqData(oParam, function (oResp) {
            this.setContent(oResp.rtnData);
        }, this);
    },

    save: function () {
        ES.loadAn($(this.oDialog.node));

        var serializeObj = {};
        var array = $("#frm_ruleedit").serializeArray();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });

        var ids = '';
        var items = $('.ex-layout-selected-roadlist').find('label');
        for (var i = 0; i < items.length; i++) {
            var id = items.eq(i).attr('cid')
            ids += i == (items.length - 1) ? id : id + ',';
        }
        serializeObj.RfIdList = ids;

        ES.getData(serializeObj, "/RuleManage/Edit", this.saveHandler, this);
    },

    saveHandler: function (oData) {

        ES.Common.BaseDialog.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            var gType = parseInt($('.ex-rule-tab>li.active').attr('data-index'));
            var oParam = {Type: gType};

            this._oParent.oGrid.query({oParam: oParam});
        }
    }

});

ES.Common.DelEntity =ES.Common.DialogDel.extend({

    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            var gType = parseInt($('.ex-rule-tab>li.active').attr('data-index'));
            var oParam = {Type: gType};

            this._oParent.oGrid.query({oParam: oParam});
        }
    }
});


ES.Common.AddType =ES.Common.DialogDel.extend({

    initialize: function (oParent, oOption,oDOption) {
        ES.Common.BaseDialog.prototype.initialize.call(this, oParent, oOption,oDOption);
        // 窗体保存的业务数据
        this.oBusData = null;
    },

    initButton:function(){},
    // 注册事件
    initOn: function () {},

    afterOpen:function(){
        var self = this;
        $('.ex-rule-tabs.modelType').on('click','li',function(){
            var nIndex = parseInt($(this).attr('data-index'));

            if (self.oOption.bRemove) {
                self.oDialog.remove();
            }
            else {
                self.oDialog.close();
            }
            self._oParent.addModel = new ES.Common.DialogRuleEdit(self._oParent,{bRemove:true,cUrl:'/RuleManage/EditRSpeedLimit'});
            self._oParent.addModel.addShow({TypeId:nIndex});
        })
    }
});


ES.Common.linkTruck =ES.Common.DialogDel.extend({
    save: function () {
        if (!this.oBusData) {
            ES.aWarn(ES.Lang.BaseDialog[30]);
            return;
        }

        ES.loadAn($(this.oDialog.node));

        ES.getData({ruleid:this.oBusData}, this.oOption.cUrl, this.saveHandler, this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogDel.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            var gType = parseInt($('.ex-rule-tab>li.active').attr('data-index'));
            var oParam = {Type: gType};

            this._oParent.oGrid.query({oParam: oParam});
        }
    }
});


