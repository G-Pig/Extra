/**
 * Created by liulin on 2017/10/18.
 */


ES.MapView.BaseTabPanel.DeptVehLst = ES.MapView.BaseTabPanel.VehLst.extend({

    initEvent:function () {
        var self = this;

        var $_check =  this.$_oStruck.find('.ex-layout-carlist-query');

        this.$_oOpenBtn.bind('click', function () {
            //$struckList.fadeIn(500);
            //self._oParent.fire("MapView:Struct.show");
            self.$_oStruck.css({ "opacity": "1"});
            //self.$_oStruck.animate({"left": "220px", "opacity": "1"}, 300);
            self.$_oCloseBtn.show();
            $(this).hide();

            self._oParent.openTree();
            //treeList("click");
        });

        //车辆列表父选框隐藏事件
        this.$_oCloseBtn.bind('click', function () {
            //$struckList.fadeOut(500);
            //self._oParent.fire("MapView:Struct.hide");
            self.$_oStruck.css({"opacity": "1"});
            //self.$_oStruck.animate({"left": "0", "opacity": "1"}, 300);
            self.$_oOpenBtn.show();
            $(this).hide();
            self._oParent.closeTree();
            //self._oParent._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() - 260});
        });

        $_check.bind('mouseover', function () {
            $(this).children('.ec-dropdown-content').show();

        });

         $_check.bind('mouseout', function () {
             //console.log(0);
             $(this).children('.ec-dropdown-content').hide()
         });

        $_check.find('input[type="checkbox"]').bind('click',function () {
            $_check.find('.ex-layout-carlist-query-cover').addClass('ec-active');
            // 触发查询接口
            self.initData(1,function(oData){
                var aoGps = self.toModle(oData);
                self.$_oTitle.find('span').text(oData.records+' 辆')
                self.vehHandler(aoGps);
                self.initPager(oData);
                $_check.find('.ex-layout-carlist-query-cover').removeClass('ec-active');
            });
            //$(this).parents('.ec-dropdown-content').hide();
        });

        // this.$_oStruck.find('.ec-dropdown-content').on('click','a' ,function () {
        //     var _icon = $(this).children('i').attr('class');
        //     // $(this).siblings().removeClass('ec-active');
        //     // $(this).addClass('ec-active');
        //     $_check.children('i').attr('class', _icon);
        // });
        this.$_oStruck.find('input[type="checkbox"]').uCheck();


    },


    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '       <a href="javascript:;" class="ex-icon-turn on" ><i class="ec-icon-arrow-circle-left"></i></a>' +
    '       <a href="javascript:;" class="ex-icon-turn off" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group"  style="width:80%; float:left">' +
    '               <input type="text" class="ec-form-field" placeholder="请输入车牌号或设备号">' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs" type="button"><span class="ec-icon-search"></span> </button>' +
    '               </span>' +
    '           </div> ' +
    '           <div class="ex-layout-carlist-query"> ' +
    '               <div class="ex-carlist-query-btn">' +
    '                   <i class="ex-maptool-icon truck green"></i>' +
    '               </div>' +
    '               <ul class="ec-avg-sm-1 ec-dropdown-content">' +
    '                   <li><a href="javascript:void(0);"> <label class="ec-checkbox-inline"><input type="checkbox" checked="checked"  class="ec-ucheck-checkbox speed" /> ' +
    '                           <i class="ex-maptool-icon truck green"></i> &nbsp;行驶车辆  </label>' +
    '                        </a>' +
    '                    </li>' +
    '                   <li><a href="javascript:void(0);"><label class="ec-checkbox-inline"><input type="checkbox" checked="checked"  class="ec-ucheck-checkbox stop" /> ' +
    '                           <i class="ex-maptool-icon truck green"></i>&nbsp;停车车辆</label>' +
    '                       </a>' +
    '                   </li>' +
    '                   <li><a href="javascript:void(0);"><label class="ec-checkbox-inline"><input type="checkbox" checked="checked"  class="ec-ucheck-checkbox acc" /> ' +
    '                           <i class="ex-maptool-icon truck green"></i>&nbsp;熄火车辆</label></a>' +
    '                   </li>' +
    '                   <li><a href="javascript:void(0);"><label class="ec-checkbox-inline"><input type="checkbox" checked="checked" class="ec-ucheck-checkbox local" /> ' +
    '                       <i class="ex-maptool-icon truck yellow"></i>&nbsp;定位失败</label></a>' +
    '                   </li>' +
    '                   <li><a href="javascript:void(0);"><label class="ec-checkbox-inline"><input type="checkbox" class="ec-ucheck-checkbox lost" /> ' +
    '                       <i class="ex-maptool-icon truck gray"></i>&nbsp;通讯中断</label></a>' +
    '                   </li>' +
    '               </ul>' +
    '               <div class="ex-layout-carlist-query-cover"></div>' +
    '           </div>' +
    '           <div class="clearfix"></div>' +
    '       </div>' +
    '       <div class="ex-layout-carlist-content"></div>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-page">' +
    '       <ul class="ec-pagination ec-pagination-center">' +
    '           <li class="ec-disabled"><a href="javascript:;">&laquo;</a></li>' +
    '           <li class="ec-active"><a href="javascript:;">1</a></li>' +
    '           <li><a href="javascript:;">2</a></li>' +
    '           <li><a href="javascript:;">3</a></li>' +
    '           <li><a href="javascript:;">4</a></li>' +
    '           <li><a href="javascript:;">5</a></li>' +
    '           <li><a href="javascript:;">&raquo;</a></li>' +
    '       </ul>' +
    '   </div>' +
    '</div>',


});