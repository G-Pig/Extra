/**页面查询按钮和批量下单*/
ES.Muck.Search = ES.Muck.BaseSearch.extend({
    initUI: function () {
        this.oSearchBtn =$('#SearchBtn');//查询按钮
        this.oNewReportBtn = $('#newReport');//新增报单
        //this.oArea = $('#InstallArea');
        this.oEnterprise = $('#InstallEnterprise');
        this.oOEnterprise = $('#s_h_InstallEnterprise');
        this.oStartTime = $('#indexTime');
        this.oExTime = $('#exTime');
        this.oAllIn = $('#allIn');
    },
    initEvent:function() {
        var self = this;
        var oParent = this._oParent;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {
            var CkType = $('.aClick.ec-active').attr('data-index');
            var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
            var oParam = {
                //Area: self.oArea.val(),
                EnterpriceId: self.oOEnterprise.val(),
                StartTime:self.oStartTime.val()+' 00:00:00',
                EndTime: self.oExTime.val()+' 23:59:59',
                CkType:CkType
            };
            self._oParent.oGrid.query({oParam: oParam});
            self.initCount(oParam)
        });
        //新增
        this.oNewReportBtn.on('click',function(){
            oParent.oEditD = new ES.Common.AddDialog(oParent,{bRemove:true,cUrl:''});
            oParent.oEditD.showModal();
        });
        //批量下单按钮
        this.oAllIn.bind('click',function(){
            var itms = $("#checkGridContainer").jqGrid("getGridParam", "selarrrow");//获取所有选择项
            var ids = [];
            for (var i = 0 ; i < itms.length; i++) {
                var rowData = $("#checkGridContainer").jqGrid('getRowData', itms[i]);//获取所有选择项的具体数据
                ids.push(rowData.Id)
            }
            oParent.oEditD = new ES.Common.GetDone(this._oParent,{bRemove:true,cUrl:''});
            oParent.oEditD.showModal(ids);
        });
        //清除按钮
        $("a.ex-input-clear-btn").click(function () {
            $(this).parent().siblings("input").val("");
        });
        //选择时间
        this.oStartTime.click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd",
                isShowClear: false,
            });
        });
        this.oExTime.click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd",
                isShowClear: false,
            });
        });
    },
    initCount:function(oData){
        if(oData){
            $.post(this._oParent.oGridOpt.countUrl,oData,function(data){
                var CountItems = $('.ex-top-charts ul li .item-info .boxNum strong');
                CountItems.eq(0).html(data.allVehs_count);//车辆总数
                CountItems.eq(1).html(data.NotCheck_count);//待报装
                //CountItems.eq(2).html(data.never);//已下单
                CountItems.eq(2).html(data.allVehs_install_count);//已安装
                CountItems.eq(3).html(data.Vehs_other_count);//未安装
                var itm = $('.ex-sider-menu .aClick a span');
                itm.eq(0).html(data.all_order_count);
                itm.eq(1).html(data.NotCheck_count);
                itm.eq(2).html(data.Check_count);
            })
        }
    },
});

//新增报装单里的按钮
ES.Muck.AddDialogBtn = ES.Muck.BaseSearch.extend({
    initUI:function(){
        this.oUploadBtn = $('#UploadFileBtn');
        this.oInstallTime = $("#InstallTime");
        this.oCompTime = $("#CompTime");
        this.oTextArea = $('#VehicleLis');
        this.oExcelBtn = $('#ExcelBtn');
        this.oImgBtn = $('#ImgBtn');
        this.oImgContainer = $('#ImgContainer');
    },
    initEvent:function(){
        var self = this;
        this.oInstallTime.click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd",
                isShowClear: false,
                minDate:"%y-%M-%d"
            });
        });
        var cDate = new Date().toLocaleDateString().replace(/\//g, "-");
        this.oCompTime.val(cDate);
        this.oTextArea.on('input propertychange',function(){
            var vLis = $(this).val();
            self._oParent._oParent.fire('OnChange.Vehicle',{oData:vLis});
        });
        //上传文件
        this.oExcelBtn.on('input propertychange', function (event) {
            $('#uploadForm').ajaxSubmit({
                type: "post",
                url: "/VehicleInstall/GetVehcleNoByExcel",
                data: self.oExcelBtn.val(),
                dataType: "json",
                error: function (data) {
                    ES.aWarn("请确认格式是否正确！");
                    return
                },
                success: function (data) {
                    $('#siteReportsInput').val(data);
                    self._oParent._oParent.fire('OnChange.Vehicle',{oData:data});
                    self.oExcelBtn.val("");
                }
            });
        });
        //上传照片
        this.oImgBtn.on('input propertychange',function (event) {
            var files = event.target.files;//获取上传的图片对象
            var filesList = [];
            if (files.length > 1) {
                ES.aWarn("请上传小于1张图片！");
                return;
            }
            for (var i = 0; i < files.length; i++) {
                var fileName = files[i].name,
                    index1 = fileName.lastIndexOf("."),
                    index2 = fileName.length,
                    suffix = fileName.substring(index1 + 1, index2);//判断后缀名
                if (suffix == "jpg" || suffix == "jpeg" || suffix == "png" || suffix == "bmp") {

                } else {
                    ES.aWarn("您上传的格式不正确！");
                    return;
                }
                var imgSize = files[i].size;//判断大小
                if (imgSize > 4194304) {
                    ES.aWarn("您上传的图片大于4M，请重新上传！");
                    return;
                }
                var URL = window.URL || window.webkitURL;
                var imgUrl = URL.createObjectURL(files[i]);
                var imgDiv = '<div style="display:inline"><img src="' + imgUrl + '"/><span class="ec-icon-close removeImg"></span></div>'
                self.oImgContainer.html($(imgDiv))
            }
            $('.removeImg').on('click', function () {
                $(this).parent().remove()
            })
            self.oImgBtn.val(filesList)
        });
    }
})