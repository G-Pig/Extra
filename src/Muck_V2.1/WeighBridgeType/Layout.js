/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Layout= ES.Muck.BaseLayout.extend({

    initUI: function () {
        this.$_oContainer = $('.ex-layout-content');

        $(this.oOption.cPContainer).append(this.$_oContainer);

    }

});