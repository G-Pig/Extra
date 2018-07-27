/**
 * 分公司统计
 * Created by Administrator on 2017/4/27.
 */


ES.MapView.SubDeptMonitor = ES.MapView.BaseMonitor.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: 'RouteMonitor',

        cUrl: '/RouteStatic/GetSubDeptByTotal',

    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        ES.Util.reqData({url: this.oOption.cUrl, data: {}}, this.initMenuBoxHandler, this);

    },

    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData.rtnData) {
            return;
        }
        // 初始化图表和菜单
        var cLi = ES.template(this.cItem, {
            Icon: 'Assets',
            FeatureId: 'TechLevel',
            FeatureName: '路面技术等级',
            Cnt: oData.rtnData.tech
        });
        var $_oLi = $(cLi);
        $_oLi.data('data', oData.rtnData.techsum);
        this.$_oRoadBox.append($_oLi);

        cLi = ES.template(this.cItem, {
            Icon: 'Assets',
            FeatureId: 'PavmentType',
            FeatureName: '路面类型',
            Cnt: oData.rtnData.pav
        });
        $_oLi = $(cLi);
        $_oLi.data('data', oData.rtnData.pavsum);
        this.$_oRoadBox.append($_oLi);

        cLi = ES.template(this.cItem, {
            Icon: 'Assets',
            FeatureId: 'Character',
            FeatureName: '路面性质',
            Cnt: oData.rtnData.Cha
        });
        $_oLi = $(cLi);
        $_oLi.data('data', oData.rtnData.Chasum);
        this.$_oRoadBox.append($_oLi);
        this.nTotal = oData.rtnData.tech+oData.rtnData.pav+oData.rtnData.Cha;
        this.initEvent();
    },

    initEvent: function () {

        var self = this;

        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).siblings().find('.box').attr('data-id');
            var cUrl = '';
            if (dataId === 'TechLevel') {

                cUrl = '/RouteStatic/GetSDeptStaticByTechLevel';
            } else if (dataId === 'PavmentType') {

                cUrl = '/RouteStatic/GetSDeptStaticByPavmentType';
            }
            else {
                cUrl = '/RouteStatic/GetSDeptStaticByCharacter';
            }

            // 请求数据 画饼图
            ES.Util.reqData({url: cUrl, data: {}}, self.updateChart, self, {oLiData: $(this).data('data')});
        });

        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();
    }


});

// chart 图表得编写
ES.MapView.SubDeptMonitor.include({

    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept=[];
        this.nMaxMile =1;
    },

    // 初始化图表
    initChart: function () {
        var oChart = echarts.init(this.$_oChart.get(0));
        this.oChart = oChart;
        this.getOption();
        oChart.setOption(this.oOpt);
    },


    // 更新chart 图表数据
    updateChart: function (oData) {

        if (!oData.rtnData) {
            return;
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSer.splice(0, this.aoSer.length);


        for (var i = 0; i < oData.rtnData[0].value.length; i++) {
            this.aoDept.push(ES.Util.replaceAll(oData.rtnData[0].value[i].deptName,'分公司',''));
        }
        this.aoSer = [];

        for (var j = 0; j < oData.rtnData.length; j++) {

            var aoTemp = []
            for (var k = 0; k < oData.rtnData[j].value.length; k++) {
                aoTemp.push(oData.rtnData[j].value[k].Mile);
                if (oData.rtnData[j].value[k].Mile > this.nMaxMile) {
                    this.nMaxMile = oData.rtnData[j].value[k].Mile;
                }
            }

            var oSer = {
                name: oData.rtnData[j].name,
                type: 'bar',
                stack: 'chart',
                silent: true,
                z: 3,
                label: {
                    normal: {
                        position: 'insideRight',
                        show:false,
                        formatter: function (a) {
                            if(a.value >0)
                            {
                                return a.value;
                            }
                            else
                            {
                             return '';
                            }
                        }
                    }
                },
                data: aoTemp
            }

            this.aoSer.push(oSer);

        }


        var oPie = this.getPieConfig(oData);

        this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function (oData) {
        this.oDeptStatic.splice(0, this.oDeptStatic.length);
        var oPie = {
            type: 'pie',
            z: 100,
            radius: [0, '30%'],
            center: ['75%', '25%'],
            label: {
                normal: {
                    position: 'inner',
                    show: false
                }
            },
            data: this.oDeptStatic
        }

        if (!oData.oLiData) {
            return oPie;
        }

        for(var i=0;i< oData.oLiData.length;i++){
            this.oDeptStatic.push({name:oData.oLiData[i].deptName,value:oData.oLiData[i].mile});
        };

        return oPie;
    },


    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {

            tooltip: {
                //trigger: 'item',
                //formatter: "{a} <br/>{b} : {c} ({d}%)",
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            title: [{
                text: '总公里数',
                subtext: '总计 '+this.nTotal+'公里',
                x: '25%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }, {
                text: '总公里数占比',

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
                //axisLabel: {
                //    interval: 0,
                //    rotate: 30
                //},
                //splitLine: {
                //    show: false
                //},
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


});
