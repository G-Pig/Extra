/**
 * Created by Administrator on 2017/5/2.
 */


ES.Report.RouteChart = ES.Report.BaseChart.extend({

    setDefaultData: function () {
        this.acLegend = [];
        this.aoTechData = [];
        this.aoPavData = [];
        this.aoChaData = [];
    },

    initOn: function () {
        ES.Report.BaseChart.prototype.initOn.call(this);

        this._oParent.on('Report:RouteLeftTree.select', this.setData, this);
    },

    // 获得数据
    setData:function(oData) {
        var cUrl = "/RouteStatic/ReportRouteStatic";
        if (oData.oNode.data.Category === 2) {
            cUrl = "/RouteStatic/ReportRouteMaintainStatic";
            ES.getData({nDeptId: oData.oNode.id}, cUrl, this.updateChart, this);
        } else if(oData.oNode.data.Category === 1){
            ES.getData({}, cUrl, this.updateChart, this);
        }
    },

    // 获得数据，要
    getData: function () {

    },

    // 更新chart 图表数据
    updateChart: function (oData) {

        if(!oData){
            return;
        }

        this._oParent.fire("Report:RouteChart.setData",oData);

        this.acLegend.splice(0,this.acLegend.length);
        this.aoTechData.splice(0,this.aoTechData.length);
        this.aoPavData.splice(0,this.aoPavData.length);
        this.aoChaData.splice(0,this.aoChaData.length);

        for(var i = 0;i< oData.Tech.length;i++) {

            this.acLegend.push(oData.Tech[i].Category);

            this.aoTechData.push({name: oData.Tech[i].Category, value: oData.Tech[i].Mile});
        }

        for(var i = 0;i< oData.Pav.length;i++) {

            this.acLegend.push(oData.Pav[i].Category);

            this.aoPavData.push({name: oData.Pav[i].Category, value: oData.Pav[i].Mile});
        }

        for(var i = 0;i< oData.Cha.length;i++) {

            this.acLegend.push(oData.Cha[i].Category);

            this.aoChaData.push({name: oData.Cha[i].Category, value: oData.Cha[i].Mile});
        }



        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    // 获得 图表数据 线路第一个饼�?
    getOption: function () {

        this.oOpt = {

            legend: {
                y: 20,
                data: this.acLegend
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            graphic: [
                {
                    type: 'text',
                    z: 100,
                    left: '13%',
                    top: '85%',
                    style: {
                        fill: '#333',
                        text: '技术等级',
                        font: '14px Microsoft YaHei'
                    }
                }, {
                    type: 'text',
                    z: 100,
                    left: '43%',
                    top: '85%',
                    style: {
                        fill: '#333',
                        text: '路面类型',
                        font: '14px Microsoft YaHei'
                    }
                }, {
                    type: 'text',
                    z: 100,
                    left: '73%',
                    top: '85%',
                    style: {
                        fill: '#333',
                        text: '路面性质',
                        font: '14px Microsoft YaHei'
                    }
                }
            ],
            series: [
                {
                    name: '技术等级',
                    type: 'pie',
                    radius: [10, 70],
                    center: ['15%', '55%'],
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data:  this.aoTechData
                }, {
                    name: '路面类型',
                    type: 'pie',
                    radius: [10, 70],
                    center: ['45%', '55%'],
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: this.aoPavData
                }, {
                    name: '路面性质',
                    type: 'pie',
                    radius: [10, 70],
                    center: ['75%', '55%'],
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    lableLine: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    },
                    data: this.aoChaData
                }
            ]


        };
    }

});