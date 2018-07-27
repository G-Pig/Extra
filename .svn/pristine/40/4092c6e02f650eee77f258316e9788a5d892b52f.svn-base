/**
 * Created by liulin on 2017/5/9.
 */

ES.Report.AssetChart = ES.Report.BaseChart.extend({

    nCol:8,

    setDefaultData: function () {
        this.acLegend = [];
        this.aoPie= [];
        //this.aoPavData = [];
        //this.aoChaData = [];

        this.aoGraphic = [];

    },

    initOn: function () {
        ES.Report.BaseChart.prototype.initOn.call(this);

        this._oParent.on('Report:RouteLeftTree.select', this.setData, this);
    },

    // 重新父类方法
    onresize: function () {
        var self = this;
        this._oParent.on('window:onresize', function () {

            self.oChart.resize();

            self.updateChart();
        });
    },

    // 获得数据
    setData:function(oData) {
        var cUrl = "/AssetStatic/ReportAssetStatic";
        if (oData.oNode.data.Category === 2) {
            cUrl = "/AssetStatic/ReportAssetMaintainStaticForReport";
            ES.getData({nDeptId: oData.oNode.id}, cUrl, this.setDataHandler, this);
        } else if (oData.oNode.data.Category === 1) {
            ES.getData({}, cUrl, this.setDataHandler, this);
        }

    },

    // 获得数据，要
    setDataHandler: function (oData) {
        this.oData = oData;
       this.updateChart();
    },



    // 更新chart 图表数据
    updateChart: function () {
var oData = this.oData;

        if(!oData){
            return;
        }

        //this._oParent.fire("Report:RouteChart.setData",oData);

        this.acLegend.splice(0,this.acLegend.length);

        this.aoPie.splice(0,this.aoPie.length);

        this.aoGraphic.splice(0,this.aoGraphic.length);
        var nRow = Math.ceil(oData.TechGroup.length/this.nCol) ;


        var nWidth = $('#echartsCar').width() ;
        var nHeight = $('#echartsCar').height() - 50 - 20;

        var nRowInt=Math.ceil(nHeight / nRow) ;

        var nColInt =Math.ceil( nWidth / this.nCol);

        var nR = nRowInt>nColInt?nColInt:nRowInt;

        this.oDemoData = [];

        // graphic 结束
        for(var i = 0;i<nRow;i++ ) {
            for (var j = 0; j < this.nCol && (i * this.nCol + j) < oData.TechGroup.length; j++) {

                var oGraphic = {
                    type: 'text',
                    z: 100,
                    //left: (4 + 11 * j) + '%',
                    //top: (44 + i * 35) + '%', parseInt((nColInt+1) * j /2)
                    left: parseInt(nColInt / 2)- 10 + j * nColInt + 'px',
                    top: 40 + (i + 1) * nRowInt + 'px',
                    style: {
                        fill: '#333',
                        text: oData.TechGroup[i * this.nCol + j].TypeName,
                        font: '14px Microsoft YaHei'
                    }
                };
                this.aoGraphic.push(oGraphic);

                var aoTemp = oData.TechGroup[i * this.nCol + j].Value.map(function (oItem) {
                    return {
                        name: oItem.DeptName,
                        value: oItem.Cnt
                    };
                });
                this.oDemoData = aoTemp;
                var oPie = {
                    name: oData.TechGroup[i * this.nCol + j].TypeName,
                    type: 'pie',
                    radius: [10, nR / 2 - 20],
                    z: 1,
                    //radius: [10,50],
                    //center: [(5 + 11 * j) + '%', (30 + i * 35) + '%'],
                    center: [parseInt(nColInt / 2) + j * nColInt + 'px',50 + parseInt(nRowInt / 2) + i * nRowInt + 'px'],
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
                    data: aoTemp
                };

                this.aoPie.push(oPie);
            }
        }

        for(var i = 0;i<  oData.TechGroup[0].Value.length;i++) {

            this.acLegend.push(oData.TechGroup[0].Value[i].DeptName);
        }

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    // 获得 图表数据 线路第一个饼图
    getOption: function () {

        this.oOpt = {

            legend: {
                y:20,
                data:  this.acLegend
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",

            },

            graphic:this.aoGraphic,

            series: this.aoPie

        };

    }

});