/**
 * Created by yanghang on 2017/10/10.
 */

ES.Muck.PhotoList= ES.Class.extend({
    // oOption: {
    //     PhoneNums:[],
    //     ExtenstionName:0,
    //     PageIndex:1,
    //     PageSize:20,
    //     StartTime:"2017-09-21 00-00-00",
    //     EndTime:"2017-09-21 23-59-59",
    // },


    initialize: function (oParent, oOption) {

        this.oParam = {
            PhoneNums:[],
            ExtenstionName:0,
            PageIndex:1,
            PageSize:20,
            StartTime:"2017-09-21 00:00:00",
            EndTime:"2017-09-21 23:59:59",
        };

        this.oOption = oOption;
        this.oParam = $.extend(this.oParam, this.oOption);

        this.initUI();
    },
    initUI:function(){
        this.getData();

    },
    getData:function(data){
        loadAnimate($(".ex-layout-main"),null);
        ES.getData(this.oParam,'/PhotoWall/ListPaging',this.initPhotos,this);
    },
    initPhotos: function(data){
        loadAnimate($(".ex-layout-main"),"remove");
        if(data.dataList.length == 0){
            ES.aWarn("提示：当前搜索没有数据!");
        }
        //if(this.phtotList){phtotList.destroy();}
        var self = this;
        var _timeID =Date.parse(new Date());
        data.timeId = _timeID;
        var _html = template('photoListTpl', data);
        $('.ex-photoList>.ex-photoList-box').html(_html);

        $('.ex-lightgallery').lightGallery({ closable: false, selector: 'a.ec-img-thumbnail', loop: false });

        //分页加载
        $("#photoPage").paging({
            totalPage: data.total,
            totalSize: data.records,
            callback: function (num) {
                loadAnimate($(".ex-layout-main"),null);
                self.oParam.PageIndex = num;
                ES.getData(self.oParam,'/PhotoWall/ListPaging',self.reLoadPhotos,self);
                $('#ex-lightgallery').lightGallery({ closable: false, selector: 'a.ec-img-thumbnail', loop: false });
            }
        })
    },
    reLoadPhotos:function(data){
        loadAnimate($(".ex-layout-main"),"remove");
        var _html = template('photoListTpl', data);
        $('.ex-photoList>.ex-photoList-box').html(_html);
        $('.ex-lightgallery').lightGallery({ closable: false, selector: 'a.ec-img-thumbnail', loop: false });
    }

});