/**
 * Created by liulin on 2017/8/31.
 */

ES.Muck.RoleSearch = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearchInput = $('#roleName');
        this.oSearvhBtn = $('.ex-grid-search');
        this.oAddBtn = $('.ex-grid-add');
    },

    initEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var oParam = { RoleName: cSearchVal };
            // 触发查询
            self._oParent.oGrid.query({ oParam: oParam });

        });
        var oParent = this._oParent;

        this.oAddBtn.bind('click', function () {
            oParent.oAddD = new ES.Common.Dialog(oParent, { bRemove: true, cUrl: '/RolePermissionScope/Edit' });
            oParent.oAddD.addShow();
        });

    },
});