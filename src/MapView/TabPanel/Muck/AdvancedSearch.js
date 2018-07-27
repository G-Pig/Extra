/**
 * Created by YangHang on 2017/11/17.
 */

ES.MapView.BaseTabPanel.AdvancedSearch = ES.MapView.BaseTabPanel.BaseLst.extend({


    initOn: function () { },

    // 高级查询
    initEven: function () {
        var self = this;
        var oSearchParam = {
            DeptIds: [171, 193, 26, 25, 24, 23, 22, 182, 34, 33, 32, 31, 30, 29, 28, 191,
                190, 36, 201, 195, 51, 49, 48, 46, 43, 42, 41, 40, 39, 38, 243, 199, 198,
                192, 189, 187, 186, 64, 63, 61, 58, 57, 55, 52, 50, 47, 45, 260, 56, 54,
                251, 250, 249, 62, 60, 203, 183, 179, 71, 70, 69, 68, 67, 66, 202, 80, 79,
                76, 75, 74, 73, 197, 188, 184, 85, 84, 83, 82, 81, 78, 204, 200, 194, 180,
                87, 196, 185, 110, 109, 108, 107, 106, 105, 104, 103, 102, 101, 100, 92, 91,
                90, 89, 20, 181, 97, 96, 95, 94, 99, 98, 93, 88, 86, 77, 72, 65, 59, 53, 44,
                37, 35, 27, 21, 19],
            Veh: "",
            DeviceNo: '',
            DevStatus: '-1',
            Key: $("#hidUserId").val() || "" + new Date().getTime(),
        };

        $("#btnBestSearch").bind("click", function () {
            oSearchParam.Veh = $.trim($("#txtVeh").val());
            oSearchParam.DeviceNo = $.trim($("#txtDev").val());
            oSearchParam.DevStatus = $.trim($("#ddlDevStatus").val());
            oSearchParam.Key = $("#hidUserId").val() || "" + new Date().getTime();
            // oPage
            self._oParent.fire("MapView:VehLst.onBestSearch", { oSearchParam: oSearchParam });
        })
    },

    initUI: function () {
        // 当前对象集合
        this.$_oStruck = $(this.cHtml);
        this.$_oContainer.append(this.$_oStruck);
        // 车辆容器

        this.$_oTitle = this.$_oStruck.find('h4');
        this.$_oTitle.html(this.oOption.cTitle);

        this.initEven();
    }


});

// html数据
ES.MapView.BaseTabPanel.AdvancedSearch.include({
    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '      <div></div>'+
    '   </div>' +
    '</div>',
});