/**
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.WeightChart = ES.Class.extend({
    oOption : {
        cDivContain: 'echartsWeight',
        nAvgSpeed: 60,
        nMaxSpeed: 100,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 初始化界面
        this.initUI();
    },


    // 初始化图表
    initUI: function () {
        this.oChart = echarts.init(document.getElementById(this.oOption.cDivContain));
        this._setChartConfig();
    },

    // 设置图表属性
    _setChartConfig: function (ec) {

        var nRedSpeed = this.oOption.nAvgSpeed / this.oOption.nMaxSpeed;

        this.oChartOption = {
            backgroundColor: '#136635',
            tooltip: {
                //formatter: "{a} <br/>{c}T"
                formatter: "{a} <br/>{c}"
            },
            grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0

            },
            series: [
                {
                    name: '载重',
                    type: 'gauge',
                    radius: '90%',
                    min: 0,
                    max: 30,
                    splitNumber: 5,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 3,
                            color: [[0.1, '#fff'], [0.6, '#00ff00'], [0.8, '#f5c01b'], [1, '#b62d22']]
                            //color: [[0.05, '#72d572'], [0.8, '#fdd835'], [1, '#f4511e']]
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 6,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 9,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        formatter: '载重\n{value}', offsetCenter: [0, '45%'], textStyle: {
                            color: '#fff', fontSize: 12, fontWeight: 'bold'
                        },
                    },
                    data: [{ value: 80, name: '速度' }]
                }
            ]
        };
        this.oChart.setOption(this.oChartOption, true);


    },

    // 设置速度值
    changeWeight: function (oGpsInfo) {

        if (!oGpsInfo) return;
        ES.TrackHelper.convertVehStatus(oGpsInfo);
        var nMax = 100;
        var dWeight = parseInt(oGpsInfo.dWeight) || 0;
        if (oGpsInfo.attach) {
            if ((oGpsInfo.nGreenOn + oGpsInfo.nRedOn + oGpsInfo.nYelloOn ) != 1) {
                //此时为白灯
                nMax = dWeight * 100 / 5;
            }
            else if (oGpsInfo.nGreenOn == 1) {
                nMax = dWeight * 100 / 50;
            }
            else if (oGpsInfo.nYelloOn == 1) {
                nMax = dWeight * 100 / 70;
            }
            else {
                nMax = dWeight * 100 / 90;
            }
        }

        this.oChartOption.series[0].max = nMax || 100;

        if (oGpsInfo.attach) {
            this.oChartOption.series[0].data[0].value = oGpsInfo.dWeight || 0;
        }
        else {
            this.oChartOption.series[0].data[0].value = 0;
        }

        this.oChart.setOption(this.oChartOption, true);
    },

});