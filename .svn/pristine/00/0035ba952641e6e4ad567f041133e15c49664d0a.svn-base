/**
 * 用户管理
 *
 * Created by liulin on 2017/9/1.
 */


ES.Muck.PhotoWall=ES.Page.extend({

    initialize: function (cId, oOption, oGridOpt) {

        this.oGridOpt = oGridOpt;
        this.cId = cId;
        this.initUI();
        this.initEvent();

    },

    // 初始画界面对象
    initUI: function () {

        // 页面布局
        this.oLayout = new ES.Muck.Layout(this, {});


        // 查询 控件
        this.oSearch = new ES.Muck.Search(this, {});

        // 左侧列表生成
        this.oCarList = new ES.Muck.CarList(this, {});

        // 右侧图片生成
        //this.oPhotoList = new ES.Muck.PhotoList(this,{PhoneNums:["013147159128"]});
    },

    initEvent: function () {

    }
});


