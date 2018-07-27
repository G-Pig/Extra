/**
 *
 *
 *
 * Created by Administrator on 2017/4/27.
 */


ES.MapView.MaintainMonitor = ES.MapView.SubDeptMonitor.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag:'MaintainMonitor',

        cUrl:'/RouteStatic/GetMaintainDeptByTotal',

    },

    initEvent: function () {

        var self = this;
        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).siblings().find('.box').attr('data-id');
            var cUrl = '';
            if (dataId === 'TechLevel') {

                cUrl = '/RouteStatic/GetMaintainDeptStaticByTechLevel';
            } else if (dataId === 'PavmentType') {

                cUrl = '/RouteStatic/GetMaintainDeptStaticByPavmentType';
            }
            else {
                cUrl = '/RouteStatic/GetMaintainDeptStaticByCharacter';
            }

            // 请求数据 画饼图
            ES.Util.reqData({url: cUrl, data: {}}, self.updateChart, self, {oLiData: $(this).data('data')});
        });

        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();

    }

});