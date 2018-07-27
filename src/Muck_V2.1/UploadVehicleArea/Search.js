//新增、导出、查询
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
        var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        this.oStartDate.val(cDate)
        //查询按钮
        this.oSearchBtn.bind('click', function () {
            var rId = self.oAId.val();
            var oStartDate = self.oStartDate.val();
            var oParam = {
                ToDepartmentId: rId,
                CurrentTime: oStartDate,
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
            window.location.href = "/UploadVehicleArea/AreaExport?ToDepartmentId=" + oEnterpriceId + "&CurrentTime=" + oStartDate;
        });
        //增加按钮
        this.oAddBtn.bind('click', function () {
            oParent.oEditD = new ES.Common.AddVehicles(oParent, {
                bRemove: true,
            }, { title: "上传过境车辆" });
            oParent.oEditD.showModal();
        });
        //下载模版
        this.oDownBtn.bind('click',function(){
            window.location.href = '/UploadVehicleArea/DownFileExcelTemplte';
        })
    },
});
//分析按钮、导入按钮、区域选择按钮
ES.Muck.DialogBtn = ES.Muck.BaseSearch.extend({
    initUI: function () {
        this.oAnalysisBtn = $('#AnalysisBtn');//分析按钮
        this.oUploadFileBtn = $('#UploadFileBtn');//文件导入
        this.oAId = $('#s_h_AreaInside');//区域ID
        this.oStartDate = $('#CurrentTime');
    },

    initEvent: function () {
        var self = this;
        //清除按钮
        $("a.ex-input-clear-btn").click(function () {
            $(this).parent().siblings("input").val("");
        });
        //时间控件
        var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        this.oStartDate.val(cDate)
        var newArr = [], arrItem = "", oParam, VehcleNoS;
        //分析按钮
        this.oAnalysisBtn.on('click', function () {
            var AreaId = self.oAId.val();//区域ID
            if (!AreaId) { ES.aWarn("请选择区域！"); return };
            //var gridData = $(self._oParent.oGrid.oJqGrid.selector).jqGrid("getRowData");//获取所有数据
            var cancleData = "", uploadData = "";
            if (!self._oParent.oGrid.gridData.dataList) {
                VehcleNoS = $('#siteReportsInput').val();//若没有表格数据，则直接加载textarea里的数据
                if (!VehcleNoS) { ES.aWarn("请输入车牌号！"); return };
                oParam = {
                    VehcleNoS: VehcleNoS,
                    AreaId: AreaId,
                }
                self._oParent.oGrid.query({ oParam: oParam });//重新渲染表格
                $('#siteReportsInput').val("");//清空textarea数据
            } else {
                var oGridData = self._oParent.oGrid.gridData.dataList;
                for (var i = 0; i < oGridData.length; i++) {
                    if (oGridData[i].CreateName == 0) {//修改的条件来判断是否进行了作废
                        cancleData += oGridData[i].VehicleNo + ",";//作废的车辆
                    } else {
                        uploadData += oGridData[i].VehicleNo + ",";//没作废的车辆
                    }
                }
                uploadData += $('#siteReportsInput').val();//包含表格里的选中车牌号和textarea里的车牌号
                oParam = {
                    VehcleNoS: uploadData,
                    //AreaId: AreaId,
                }
                self._oParent.oGrid.query({ oParam: oParam });
                $('#siteReportsInput').val("");
            }
        });
        this.oUploadFileBtn.on('change', function (event) {
            $('#uploadForm').ajaxSubmit({
                type: "post",
                url: "/UploadVehicleArea/GetVehcleNoByExcel",
                data: self.oUploadFileBtn.val(),
                dataType: "json",
                error: function (data) {
                    ES.aWarn("请确认格式是否正确！");
                    return
                },
                success: function (data) {
                    $('#siteReportsInput').val(data);
                    self.oUploadFileBtn.val("");
                }
            });
            // var files = this.files[0];
            // var form = new FormData();
            // form.append('file', files);
            // $.ajax({
            //     url: '/UploadVehicleArea/GetVehcleNoByExcel',
            //     data: form,
            //     method: 'post',
            //     contentType: false,
            //     processData: false,//此处是data的预处理，需要设置为false才可以
            //     success: function (data) {
            //         //console.log(data);
            //         $('#siteReportsInput').val(data);
            //         self.oUploadFileBtn.val("");
            //     },
            //     error: function (data) {
            //         ES.aWarn("请确认格式是否正确！");
            //         return
            //     }
            // });
        });
    }
});
//Re分析按钮和导入按钮
ES.Muck.ReDialogBtn = ES.Muck.BaseSearch.extend({
    initUI: function () {
        this.oAnalysisBtn = $('#AnalysisBtn');//分析按钮
        this.oUploadFileBtn = $('#UploadFileBtn');//文件导入
        this.oAId = $('#s_h_AreaInside');//区域ID
        this.oStartDate = $('#CurrentTime');
    },

    initEvent: function () {
        var self = this;
        //清除按钮
        $("a.ex-input-clear-btn").click(function () {
            $(this).parent().siblings("input").val("");
        });
        //时间控件
        var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        this.oStartDate.val(cDate)
        var newArr = [], arrItem = "", oParam, VehcleNoS;
        //分析按钮
        this.oAnalysisBtn.on('click', function () {
            var AreaId = self.oAId.val();//区域ID
            if (!AreaId) { ES.aWarn("请选择区域！"); return };
            var gridData = $(self._oParent.oGrid.oJqGrid.selector).jqGrid("getRowData");//获取所有数据
            var cancleData = "", uploadData = "";
            if (gridData.length == 0) {
                VehcleNoS = $('#siteReportsInput').val();//若没有表格数据，则直接加载textarea里的数据
                if (!VehcleNoS) { ES.aWarn("请输入车牌号！"); return };
                oParam = {
                    VehcleNoS: VehcleNoS,
                    AreaId: AreaId,
                }
                self._oParent.oGrid.query({ oParam: oParam });//重新渲染表格
                $('#siteReportsInput').val("");//清空textarea数据
            } else {
                for (var i = 0; i < gridData.length; i++) {
                    if (gridData[i].CreateName == 0) {//修改的条件来判断是否进行了作废
                        cancleData += gridData[i].VehicleNo + ",";//作废的车辆
                    } else {
                        uploadData += gridData[i].VehicleNo + ",";//没作废的车辆
                    }
                }
                uploadData += $('#siteReportsInput').val();//包含表格里的选中车牌号和textarea里的车牌号
                oParam = {
                    VehcleNoS: uploadData,
                    //AreaId: AreaId,
                }
                self._oParent.oGrid.query({ oParam: oParam });
                $('#siteReportsInput').val("");
            }
        });
        this.oUploadFileBtn.on('change', function (event) {
            $('#uploadForm').ajaxSubmit({
                type: "post",
                url: "/UploadVehicleArea/GetVehcleNoByExcel",
                data: self.oUploadFileBtn.val(),
                dataType: "json",
                error: function (data) {
                    ES.aWarn("请确认格式是否正确！");
                    return
                },
                success: function (data) {
                    $('#siteReportsInput').val(data);
                    self.oUploadFileBtn.val("");
                }
            });
        });
    }
});