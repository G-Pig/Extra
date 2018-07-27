/**
 * 工地监控使用的
 * Created by liulin on 2018/5/4.
 */

ES.Muck.PopSiteInfo = ES.Common.BaseDialog.extend({

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
            title: '查看工地详情',

        };

        ES.Common.BaseDialog.prototype.initialize.call(this, oParent,{}, oOption);

    },


    afterOpen:function() {
        if( this.oBus.SiteType ===3){
            //临时工地
            //http://localhost:14979/Reports/SiteWorkDetail?SiteId=21510&Day=2018-05-04&SiteType=3
            ES.getData({SiteId: this.oBus.Id,SiteType:this.oBus.SiteType,Day:this.oBus.StartTime},  '/Reports/SiteWorkDetail', this.setContent, this, null, {dataType: 'html'});
        }
        else{
            ES.getData({id: this.oBus.Id}, '/Site/Detail', this.setContent, this, null, {dataType: 'html'});
        }

    },



    showModal: function () {
        this.oDialog.showModal();
        this.oDialog._$('footer').hide();
    },

    initButton: function () {
        this.oOption.button = [];
    },



});