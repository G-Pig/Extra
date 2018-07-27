/**
 * Created by liulin on 2017/9/1.
 */
ES.Muck.BaseSearch= ES.Evented.extend({
    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        this.initUI();
        this.initEvent();
    },
    initUI: function () {
        this.oSearchInput =$('#txt_name');
        this.oSearvhBtn =$('.ex-final-button:eq(0)');
    },
    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var oParam = {EventTypeName: cSearchVal};
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});
        });
    },
});