/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.BaseSearch = ES.Evented.extend({

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        this.initUI();
        this.initEvent();

    },

    initUI: function () {
        this.oSearchInput = $('#txt_name');
        this.oSearvhBtn = $('.ex-final-button:eq(0)');
    },

    initEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var oParam = { EventTypeName: cSearchVal };
            // 触发查询
            self._oParent.oGrid.query({ oParam: oParam });

        });

    },
});
ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearchInput = $('#s_message_send');
        this.oSearchInput_recive = $('#s_message_recive');
        this.oSearvhBtn = $('.ex-grid-search');
        this.oSearvhBtn_recive = $('.ex-grid-search_recive');

        this.oAddBtn = $('.ex-grid-add');
    },

    initEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var gType = parseInt($('.ex-rule-tab>li.active').attr('data-index'));
            var oParam = { Content: cSearchVal, Type: gType };
            // 触发查询
            self._oParent.oGrid.query({ oParam: oParam });

        });
        this.oSearvhBtn_recive.bind('click', function () {

            var cSearchVal = self.oSearchInput_recive.val();
            var gType = parseInt($('.ex-rule-tab>li.active').attr('data-index'));
            var oParam = { Content: cSearchVal, Type: gType };
            // 触发查询
            self._oParent.oGrid_recive.query({ oParam: oParam });

        });


        var oParent = this._oParent;

        this.oAddBtn.bind('click', function () {
            oParent.oAddD = new ES.Common.Dialog(oParent, { bRemove: true, cUrl: '/Message/Edit' });
            oParent.oAddD.addShow();
        });

    },
});