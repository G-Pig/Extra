/**
 * Created by yagnhang on 2017/9/21.
 */
ES.Muck.CarList= ES.Evented.extend({

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        this.initUI();
        this.initEvent();

    },

    initUI: function () {
        this.oCarListAdd = $('.ex-PW-carList-add');
        this.oCarListEdit = $('.ex-PW-carList-edit');
    },

    initEvent:function() {
        var self = this;
        // 注册查询事件
        this.oCarListAdd.bind('click', function () {
            self._oParent.oConfigD = new ES.Muck.SelectTruckPhoto(self._oParent,{bRemove:true,cUrl:'/Site/Configure'},{ title: "线路绑定车辆"});
            self._oParent.oConfigD.showModal("");
        });
        this.oCarListEdit.bind('click', function () {
            self._oParent.oConfigD = new ES.Muck.SelectTruckPhoto(self._oParent,{bRemove:true,cUrl:'/Site/Configure'},{ title: "线路绑定车辆"});
            self._oParent.oConfigD.showModal("");
        });
        $('.ex-photoWall-carList-panel>ul').on('click', 'a.car-delete',function () {
            $(this).parents('li.ex-PW-carList-item').remove();

            //事件
            self.closeCar();
        });

    },
    closeCar:function(){
        var items = $('.ex-photoWall-carList-panel>ul').find('li.ex-PW-carList-item');

        if(!items){
            $('.ex-photoList>.ex-photoList-box').empty();
            $('#photoPage').empty();
        }

        var DeviceNos = [];
        for(var i=0;i<items.length;i++){
            var _deviceNo = items.eq(i).find('h3').attr('_deviceno');
            DeviceNos.push(_deviceNo);
        }
        var startTime = $('#start_Photo').val();
        var endTime = $('#end_Photo').val();
        var oParam = {
            PhoneNums:DeviceNos,
            ExtenstionName:0,
            PageIndex:1,
            PageSize:20,
            StartTime:startTime,
            EndTime:endTime
        };
        new ES.Muck.PhotoList(this,oParam);
    }
});
