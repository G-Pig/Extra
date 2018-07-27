/**
 * Created by liulin on 2017/5/5.
 */


ES.Report.RouteDeptChart = ES.Report.BaseChart.extend({

    setDefaultData: function () {
        this.acLegend = [];
        //this.aoTechData = [];
        //this.aoPavData = [];
        //this.aoChaData = [];
        this.aoDept =[];
        this.aoSer =[];
        this.nMaxMile =1;
    },

    // 添加监听
    initOn: function () {
        this._oParent.on('Report:RouteChart.setData', this.updateChart, this);
    },

    // 更新chart 图表数据
    updateChart: function (oData) {

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSer.splice(0, this.aoSer.length);
        this.acLegend.splice(0, this.acLegend.length);
        this.nMaxMile =1;

        for (var i = 0; i < oData.TechGroup[0].value.length; i++) {
            this.aoDept.push(ES.Util.replaceAll(oData.TechGroup[0].value[i].deptName,'分公司',''));
        }

        for (var j = 0; j < oData.TechGroup.length; j++) {

            var aoTemp = []
            for (var k = 0; k < oData.TechGroup[j].value.length; k++) {
                aoTemp.push(oData.TechGroup[j].value[k].Mile);
                if (oData.TechGroup[j].value[k].Mile > this.nMaxMile) {
                    this.nMaxMile = oData.TechGroup[j].value[k].Mile;
                }
            }
            var oSer ={
                    name: oData.TechGroup[j].name,
                    type: 'bar',
                    data: aoTemp,
                    stack: '技术等级'
                };

            this.aoSer.push(oSer);
            this.acLegend.push(oData.TechGroup[j].name);
        }

        for (var j = 0; j < oData.PavGroup.length; j++) {

            var aoTemp = []
            for (var k = 0; k < oData.PavGroup[j].value.length; k++) {
                aoTemp.push(oData.PavGroup[j].value[k].Mile);
                if (oData.PavGroup[j].value[k].Mile > this.nMaxMile) {
                    this.nMaxMile = oData.PavGroup[j].value[k].Mile;
                }
            }
            var oSer ={
                name: oData.PavGroup[j].name,
                type: 'bar',
                data: aoTemp,
                stack: '路面类型'
            };

            this.aoSer.push(oSer);
            this.acLegend.push(oData.PavGroup[j].name);
        }


        for (var j = 0; j < oData.ChaGroup.length; j++) {

            var aoTemp = []
            for (var k = 0; k < oData.ChaGroup[j].value.length; k++) {
                aoTemp.push(oData.ChaGroup[j].value[k].Mile);
                if (oData.ChaGroup[j].value[k].Mile > this.nMaxMile) {
                    this.nMaxMile = oData.ChaGroup[j].value[k].Mile;
                }
            }
            var oSer ={
                name: oData.ChaGroup[j].name,
                type: 'bar',
                data: aoTemp,
                stack: '路面性质'
            };

            this.aoSer.push(oSer);
            this.acLegend.push(oData.ChaGroup[j].name);
        }


        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },


    // 获得 图表数据 线路第一个饼图
    getOption: function () {

        this.oOpt = {

            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: this.acLegend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data:this.aoDept
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: this.aoSer

        };
    }
});