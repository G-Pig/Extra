/**
 * Created by liulin on 2017/8/31.
 */
ES.Muck.BaseSearch= ES.Evented.extend({

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        this.initUI();
        this.initEvent();

    },

    initUI: function () {
        this.oSearchInput =$('#TagName');
        this.oSearvhBtn =$('.ex-final-button:eq(0)');
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var oParam = {Name_1: cSearchVal};
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});

        });

    },
});
ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearvhBtn =$('.ex-grid-search');
        this.oAddBtn =$('.ex-grid-add');
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var CName = $('#CName').val();
            var CFirstParty = $('#CFirstParty').val();
            var CSecondParty = $('#CSecondParty').val();

            var oParam = {Name: CName,FirstParty:CFirstParty,SecondParty:CSecondParty};
            // 触发查询
            self._oParent.oGrid.query({oParam: oParam});

        });
        var oParent = this._oParent;

        this.oAddBtn.bind('click',function(){
            oParent.oAddD = new ES.Common.Dialog(oParent,{bRemove:true,cUrl:'/Tag/Edit'});
            oParent.oAddD.addShow();
        });

    },
});
