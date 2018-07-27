/**
 * Created by Administrator on 2017/6/2.
 */


ES.MapView.PopAssetInfo = ES.Common.BaseDialog.extend({

    // 车辆列表构造函数
    initialize: function (oParent, oBus) {
        this.oBus = oBus;

        this.cContentCls = 'business-type-' + this.oBus.Id;

        var oOption = {
            content: '',
            cancel: function () {
                this.close();
                return true;
            },
            title: '查看资产详情',

        };

        ES.Common.BaseDialog.prototype.initialize.call(this, oParent,{}, oOption);

    },


    afterOpen:function() {

        ES.getData({id: this.oBus.cId,TypeName:this.oBus.cTypeName}, this.oBus.cUrl, this.setContent, this, null, {dataType: 'html'});

    },



    showModal: function () {
        this.oDialog.show();
        this.oDialog._$('footer').hide();
    },

    initButton: function () {
        this.oOption.button = [];
    },



});