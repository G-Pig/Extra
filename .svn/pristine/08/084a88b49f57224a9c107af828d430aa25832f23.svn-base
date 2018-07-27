/**
 * Created by liulin on 2017/8/31.
 */

ES.AnnualSurvey.Search = ES.Muck.BaseSearch.extend({

    initUI: function () {

    },

    initEvent:function() {
        var self = this;
        // 注册查询事件

        $('.ex-selcar-contet-type>ul').on('click','a',function(){
            $(this).addClass('ec-btn-active').parent().siblings().find('a').removeClass('ec-btn-active');

            if($(this).hasClass('Import')){
                var _type = $(this).attr('data-type');
            }else{
                var _type = parseInt($(this).attr('data-type'));
            }

            var oParam = {flag: _type};
            self._oParent.oGrid.query({oParam: oParam});
        });

    }
});