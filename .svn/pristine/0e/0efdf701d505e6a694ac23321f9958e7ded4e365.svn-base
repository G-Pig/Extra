/**
 * Created by Administrator on 2017/6/4.
 */


ES.MapView.DiseMonitor =ES.MapView.AssetMonitor.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: 'DiseMonitor',

        cUrl: '/DiseStatic/ReportAssetStatic',

    },


    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            tooltip : {
                //trigger: 'axis',
                //axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                //    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                //}
            },
            title: [{
                text: '病害面积',
                subtext: '总计 '+ Math.round(this.nTotal,2)  +' ㎡',
                x: '25%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }, {
                text: '病害数占比',

                x: '75%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }],
            grid: [{
                top: 50,
                width: '100%',
                bottom: '0',
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile * 2,
                splitLine: {
                    show: false
                }

            }],
            yAxis: [{
                type: 'category',
                data: this.aoDept,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: false
                }
            }],
            series: this.aoSer
        };

        this.oOpt = oOpt;
    },
})