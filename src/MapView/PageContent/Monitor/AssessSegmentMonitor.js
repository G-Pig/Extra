/**
 * Created by Administrator on 2017/6/18.
 */


ES.MapView.AssessSegmentMonitor = ES.MapView.BaseMonitor.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: 'AssetMonitor',

        cUrl: '/AssessSegmentStatic/ReportAssetStatic',

    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        ES.Util.reqData({url: this.oOption.cUrl, data: {grade:this.oOption.cFlag}}, this.initMenuBoxHandler, this);

    },

    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData.rtnData) {
            return;
        }

        this.oBusData = oData.rtnData;

        for(var i = 0;i< oData.rtnData.Tech.length;i++) {
            oData.rtnData.Tech[i].FeatureId = oData.rtnData.Tech[i].Grade;
            oData.rtnData.Tech[i].FeatureName = oData.rtnData.Tech[i].Grade;
            oData.rtnData.Tech[i].Icon ='';
            // 初始化图表和菜单
            var cLi = ES.template(this.cItem, oData.rtnData.Tech[i]);

            $_oLi = $(cLi);
            $_oLi.data('data', oData.rtnData.Tech[i]);
            this.nTotal = this.nTotal + oData.rtnData.Tech[i].Cnt;
            this.$_oRoadBox.append($_oLi);
        }

        this.initEvent();
    },

    // 要执行父类方法
    initEvent: function () {

        var self = this;
        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).find('.box').attr('data-id');
            // 添加数据
            var oData = null;

            for (var i = 0; i < self.oBusData.TechGroup.length; i++) {
                if (self.oBusData.TechGroup[i].Grade === dataId) {
                    oData = self.oBusData.TechGroup[i];
                    break;
                }
            }
            self.updateChart({rtnData:oData});

        });

        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();
    }
});

// chart 图表得编写
ES.MapView.AssessSegmentMonitor.include({

    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept=[];
        this.nMaxMile =1;

        //this.nTotal = 0
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


        for (var i = 0; i < oData.rtnData.Value.length; i++) {
            this.aoDept.push(ES.Util.replaceAll(oData.rtnData.Value[i].DeptName, '分公司', ''));
        }
        this.aoSer = [];


        var aoTemp = []
        for (var i = 0; i < oData.rtnData.Value.length; i++) {
            aoTemp.push(oData.rtnData.Value[i].Cnt);
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Cnt;
            if (oData.rtnData.Value[i].Cnt > this.nMaxMile) {
                this.nMaxMile = oData.rtnData.Value[i].Cnt;
            }
        }

        var oSer = {
            name: oData.rtnData.TypeName,
            type: 'bar',
            stack: 'chart',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true
                }
            },
            data: aoTemp
        }

        this.aoSer.push(oSer);


        var oPie = this.getPieConfig( );

        this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function ( ) {
        var aoData =  this.oBusData.Tech;
        this.oDeptStatic.splice(0, this.oDeptStatic.length);
        var oPie = {
            type: 'pie',
            radius: [0, '30%'],
            center: ['75%', '25%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: this.oDeptStatic
        }

        for(var i=0;i< aoData.length;i++){
            this.oDeptStatic.push({name:aoData[i].TypeName,value:aoData[i].Cnt});
        };

        return oPie;
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
                text: '评定公里数',
                subtext: '总计 '+ this.nTotal +' 个数',
                x: '25%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }, {
                text: '评定公里数占比',

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


});

