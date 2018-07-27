/**
 *
 *  地图显示 显示容器
 *
 *  Created by liulin on 2016/12/20.
 *
 *  容器的定义和编辑
 *
 *  地图展示容器
 */

ES.MapView.LayoutContent = ES.Evented.extend({

    cHTML:'<div class="ex-layout-content" style="float:left"></div>',

    oOption: {
        cPContainer: '.ex-layout-main',
        nWidth:1000,
        nHeight:500,
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 初始化界面
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

    setWidth:function (nWidth) {
        //this.$_oContainer.width(nWidth);
        this.$_oContainer.stop().animate({"width": nWidth + "px"}, 100);
    },

    reflesh: function (nWidth,nHeight) {
        this.$_oContainer.css({width:nWidth,height:nHeight});
    },
    
    initUI: function () {
        this.$_oContainer = $(this.cHTML);

        $(this.oOption.cPContainer).append(this.$_oContainer);

        this.$_oContainer.css({width:this.oOption.nWidth,height:this.oOption.nHeight});
    },

});