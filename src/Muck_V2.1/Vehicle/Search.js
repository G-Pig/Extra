ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearchInput = $('#txt_vehicleNo');
        this.oCheckExpiredDays = $('#s_yearcheck');
        this.oInsuranceExpiredDays = $('#s_insurance');
        this.oSearvhBtn = $('.ex-grid-search');
        this.oExportBtn = $('#VehicleInfoExport');//导出按钮
    },

    initEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {

            var cSearchVal = self.oSearchInput.val();
            var checkExpiredDays = self.oCheckExpiredDays.val();
            var insuranceExpiredDays = self.oInsuranceExpiredDays.val();
            var oParam = { VehicleNo: cSearchVal, CheckExpiredDays: checkExpiredDays, InsuranceExpiredDays: insuranceExpiredDays };
            // 触发查询
            self._oParent.oGrid.query({ oParam: oParam });

        });
        //导出按钮
        this.oExportBtn.bind('click', function () {
            var checkExpiredDays = self.oCheckExpiredDays.val();
            var insuranceExpiredDays = self.oInsuranceExpiredDays.val();
            var cSearchVal = $('#txt_vehicleNo').val();
            var cQualifications = $('#Qualifications').val() == "0" ? 0 : $('#Qualifications').val();
            //var cCheckDate = self.CheckDateFmt($('#CheckDateBegin').val());

            window.location.href = "/Vehicle/Export_Simp?VehicleNo=" + cSearchVal +
                "&Qualifications=" + cQualifications +
                "&CheckDateBegin=" + "&CheckDateEnd=" +
                "&ResourceTypeIds=" + self.acAreaId +
                "&CheckExpiredDays=" + checkExpiredDays +
                "&InsuranceExpiredDays=" + insuranceExpiredDays;
        });
    }
});