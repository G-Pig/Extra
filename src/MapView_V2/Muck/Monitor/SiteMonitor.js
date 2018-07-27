/**
 * Created by YangHang on 2017/12/20.
 */
ES.MapView.SiteMonitor = ES.MapView.BaseMonitor.extend({
    cHTML:
    '<div class="ex-layout-monitor-wbox-content ec-align-left">' +
    '<div class="ex-title">' +
    '     <h2>' +
    '        <font>{cFlag}<sub>( {cTime} )</sub></font>' +
    '        <span class="ec-align-right ec-margin-left-sm">' +
    '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>' +
    '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff"><i class="ec-icon-arrow-right"></i></a>' +
    '          </span>' +
    '    </h2>' +
    '</div>' +
    '   <div class="ex-layout-monitor-charts">' +
    '       <div class="ex-layout-monitor-charts-content"></div>' +
    '   </div>' +
    '   <div class="ex-monitor-road-wbox ec-align-right"></div>' +
    '</div>',
    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: '工地违规数据统计',
        cUrl: '/AssetStatic/ReportAssetStatic',
        cDayHour:5,
        cNightHour:18,
        //cTime:'2017/12/28 18:00 至现在',
        data:{
            rtnData:{
                Tech:[
                    { TypeId:1,TypeName: "武汉市", Cnt: (Math.floor(Math.random() * 100) + 1), Icon: "Assets" },
                    { TypeId:2,TypeName: "蔡甸区", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                ],
                TechGroup:[
                    {Value:[
                        { TypeId:1,AlarmName: "提前出土", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "未上报", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "停工", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "可疑", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "出土", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "上报", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:1,TypeName:'武汉市',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]},
                    {Value:[
                        { TypeId:1,AlarmName: "提前出土", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "未上报", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "停工", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "可疑", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "出土", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "上报", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:2,TypeName:'蔡甸区',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]}
                ],
            }
        }
    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        //ES.Util.reqData({url: this.oOption.cUrl, data: {}}, this.initMenuBoxHandler, this);
        //this.initMenuBoxHandler(this.oOption.data);

        var self = this;
        ES.getData({},'/MapView/NormalSiteStat',function(data){
            self.initMenuBoxHandler(data);
            self.removeAn(self.$_oContainer);
            if(data.length == 0){
                self.noData(self.$_oContainer);
            }else{
                //self.$_oMinitorOpenBtn.click();
            }
        })
    },
    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData) {return;}

        this.oBusData = oData;
        for(var i = 0;i< oData.length;i++) {
            oData[i].FeatureId = oData[i].Id;
            oData[i].FeatureName = oData[i].Name;
            // 初始化图表和菜单
            var cLi = ES.template(this.cItem, oData[i]);
            $_oLi = $(cLi);
            $_oLi.data('data', oData[i]);
            this.$_oRoadBox.append($_oLi);
        }
        this.nTotal = oData[0].Total;
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

            for (var i = 0; i < self.oBusData.length; i++) {
                if (self.oBusData[i].Id === parseInt(dataId)) {
                    oData = self.oBusData[i];
                    break;
                }
            }
            self.updateChart(oData);
        });
        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();
    }
});

ES.MapView.SiteMonitor.include({
    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept1=[];
        this.nMaxMile1 =1;
        this.aoDept2=[];
        this.nMaxMile2 =1;
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
        if (!oData) {return;}

        this.aoDept1.splice(0, this.aoDept1.length);
        this.aoDept2.splice(0, this.aoDept2.length);
        this.aoSer.splice(0, this.aoSer.length);

        // for (var i = 0; i < oData.rtnData.Value.length; i++) {
        //     this.aoDept.unshift(oData.rtnData.Value[i].AlarmName);
        // }
        this.aoDept1 = ['上报提前','上报未出土'];
        this.aoDept2 = ['未上报出土'];
        this.aoSer = [];

        var aoTemp1 = [oData.Early,oData.NotUnearthed];
        for (var i = 0; i < aoTemp1.length; i++) {
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Cnt;
            if (aoTemp1[i] > this.nMaxMile1) {
                this.nMaxMile1 = aoTemp1[i] ;
            }
        }
        var aoTemp2 = [oData.NotReport];
        for (var j = 0; j < aoTemp2.length; j++) {
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Cnt;
            if (aoTemp2[j] > this.nMaxMile2) {
                this.nMaxMile2 = aoTemp2[j] ;
            }
        }
        var oSer1 = {
            name: oData.Name,
            type: 'bar',
            stack: 'Site',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    formatter:'{c}个'
                }
            },
            data: aoTemp1
        };
        var oSer2 = {
            name: oData.Name,
            type: 'bar',
            stack: 'upSite',
            silent: true,
            z: 3,
            xAxisIndex: 1,
            yAxisIndex: 1,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    formatter:'{c}个'
                }
            },
            data: aoTemp2
        };
        this.aoSer.push(oSer1);
        this.aoSer.push(oSer2);

        //var oPie = this.getPieConfig(oData);
        //this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function (oData) {
        var aoData =  oData.rtnData.OnlineRate;
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
            this.oDeptStatic.push({name:aoData[i].Name,value:aoData[i].Value,itemStyle:{normal:{color:aoData[i].type==1?'#f72b2e':'#2bb743'}}});
        };
        return oPie;
    },
    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            title: [{
                text: '上报工地违规统计',
                //subtext: '总计 '+ this.nTotal +' 个工地',
                x: '50%',
                y:'3%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 15
                }
            },{
                text: '未上报工地违规统计',
                //subtext: '总计 '+ this.nTotal +' 个工地',
                x: '50%',
                y:'58%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 15
                }
            }],
            tooltip :{
                formatter: "{b} : {c} ({d}%)"
            },
            grid: [{
                top: '12%',
                width: '80%',
                bottom: '42%',
                left: 10,
                containLabel: true
            }, {
                top: '68%',
                width: '80%',
                bottom: 0,
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile1 * 2.5,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },
            },{
                type: 'value',
                max: this.nMaxMile2 * 2.5,
                gridIndex: 1,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },
            }],
            yAxis: [{
                type: 'category',
                data: this.aoDept1,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: false
                }
            },{
                type: 'category',
                data: this.aoDept2,
                gridIndex: 1,
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