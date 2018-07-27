/**
 * 整体页面布局
 *
 * Created by liulin on 2017/2/22.
 */



ES.CloudMap.LayoutContent = ES.Evented.extend({

    cHTML:'<div class="ex-layout-content"></div>',
    oOption: {
        cPContainer: '.ex-layout-main',

    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initUI();
        this.initOn();
    },

    initOn: function () {
        this._oParent.on('MapView:LayoutContent.resize',this.resize,this);
    },

    resize: function (oData) {
        if(oData.nWidth){
            this.$_oContainer.css({width:oData.nWidth});
        }
        if(oData.nHeight){
            this.$_oContainer.css({height:oData.nHeight});
        }
    },

    reflesh: function (nWidth,nHeight) {
        this.$_oContainer.css({width: nWidth, height: nHeight});
    },

    initUI: function () {
        //ES.initTag($(this.oOption.cContainerSel),this.oUIConfig);
        //this.$_oContainer=  $(this.oOption.cContainerSel).find('.ex-layout-content');
        this.$_oContainer = $(this.cHTML);
        $(this.oOption.cPContainer).append(this.$_oContainer);
        this.$_oContainer.css({width:this.oOption.nWidth,height:this.oOption.nHeight});
    },

});


