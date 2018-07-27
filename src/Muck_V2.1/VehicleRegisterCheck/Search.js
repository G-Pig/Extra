//新增、下载、查询
ES.Muck.Search = ES.Muck.BaseSearch.extend({
    initUI: function () {
        this.oExportBtn = $('#ExportBtn');//导出按钮
        this.oAddBtn = $('#AddBtn');//上报按钮
        this.oSearchBtn = $('#SearchBtn');//查询按钮
        this.oAddBtn = $('#AddBtn');//新增按钮
        this.oArea = $('#Area');//区域名称
        this.oAId = $('#s_h_Area');//区域Id
        this.oStartDate = $('#startDate');//过境日期
        this.oDownBtn = $('#downBtn');
    },

    initEvent: function () {
        var self = this;
        var oParent = this._oParent

        //时间控件
        //var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        var cYear = new Date().getFullYear();
        this.oStartDate.val(cYear)
        //查询按钮
        this.oSearchBtn.bind('click', function () {
            var EnterpriceId = self.oAId.val();
            var oStartDate = self.oStartDate.val()+'-01-01 00:00:00';
            var oParam = {
                EnterpriceId: EnterpriceId,
                CurrentYearTime: oStartDate,
            };
            // 触发查询
            oParent.oGrid.query({ oParam: oParam });
        });
        //清除按钮
        $("a.ex-input-clear-btn").click(function () {
            $(this).parent().siblings("input").val("");
        });
        //导出按钮
        this.oExportBtn.bind('click', function () {
            var oEnterpriceId = self.oAId.val();
            var oStartDate = self.oStartDate.val();
            window.location.href = "/VehicleRegister/AreaExport?ToDepartmentId=" + oEnterpriceId + "&CurrentYearTime=" + oStartDate;
        });
        //增加按钮
        this.oAddBtn.bind('click', function () {
            oParent.oEditD = new ES.Common.AddVehicles(oParent, {
                bRemove: true,
            }, { title: "上传过境车辆" });
            oParent.oEditD.showModal();
        })
        //下载模版
        this.oDownBtn.bind('click',function(){
            window.location.href = '/VehicleRegister/DownFileExcelTemplte';
        })
    },
});