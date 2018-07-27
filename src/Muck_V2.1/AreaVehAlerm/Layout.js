/**
 * Created by liulin on 2017/8/31.
 */
ES.Muck.Layout= ES.Muck.BaseLayout.extend({

    initUI: function () {

        $('.ex-layout-content').css({ height: $(window).height() , width: $(window).width() - this.oOption.nWidth  });
        $('.ex-vehicle-batch').height(0);
    }
})