/**
 * Created by liulin on 2017/9/1.
 */

ES.Muck.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {
        this.oSearchInput =$('#txt_name');
        // 查询
        this.oSearchBtn =$('.ex-final-button>.ec-btn').eq(0);
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {
            if(self.TimeVer()){
                self._oParent.oCarList.closeCar();
            }
        });
    },
    TimeVer:function () {
        var startTime = $('#start_Photo').val();
        var endTime = $('#end_Photo').val();

        var nBS =Date.parse(startTime);
        var nES =Date.parse(endTime);

        if($('.ex-photoWall-carList-panel>ul').find('li.ex-PW-carList-item').length == 0){
            ES.aWarn("提示：请左侧选择车辆!");
            return false;
        }else if (nBS >= nES) {
            ES.aErr("错误：时间选择出错【开始时间大于等于结束时间】，请重新选择时间！");
            return false;
        }else{
            return true;
        }
    }

});