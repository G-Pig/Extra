/**
 * Created by YangHang on 2017/12/20.
 */

ES.MapView.VehicleMonitor = ES.MapView.BaseMonitor.extend({
    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: '车辆违规数据统计',
        cDayHour:5,
        cUrl: '/AssetStatic/ReportAssetStatic',

        data:{
            rtnData:{
                Tech:[
                    { TypeId:1,TypeName: "武汉市", Cnt: (Math.floor(Math.random() * 200000) + 1), Icon: "Assets" },
                    { TypeId:2,TypeName: "蔡甸区", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Denoter" },
                ],
                TechGroup:[
                    {Value:[
                        { TypeId:1,AlarmName: "未密闭", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "违规行驶", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "超载", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "超速", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "可疑出土", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "可疑消纳", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Traffic" },
                    ],TypeId:1,TypeName:'武汉市',OnlineRate:[
                        {Name:"在线车辆",Value: (Math.floor(Math.random() * 200000) + 1),type:1},
                        {Name:"离线车辆",Value:(Math.floor(Math.random() * 200000) + 1),type:2}
                    ]},
                    {Value:[
                        { TypeId:1,AlarmName: "未密闭", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "违规行驶", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "超载", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "超速", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "可疑出土", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "可疑消纳", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Traffic" },
                    ],TypeId:2,TypeName:'蔡甸区',OnlineRate:[
                        {Name:"在线车辆",Value: (Math.floor(Math.random() * 200000) + 1),type:1},
                        {Name:"离线车辆",Value:(Math.floor(Math.random() * 200000) + 1),type:2}
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


        var self = this;
        ES.getData({},'/MapView/AlarmStat',function(data){
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
        if (!oData) {
            return;
        }

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

ES.MapView.VehicleMonitor.include({

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

        if (!oData) {
            return;
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSer.splice(0, this.aoSer.length);


        // for (var i = 0; i < oData.length; i++) {
        //     this.aoDept.unshift(oData[i].AlarmName);
        // }
        this.aoDept = ['可疑消纳','可疑出土','超载','超速','未密闭']
        this.aoSer = [];


        var aoTemp = [oData.Unload,oData.Unearth,oData.Overload,oData.Overspeed,oData.Noclosed]
        for (var i = 0; i < aoTemp.length; i++) {
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Cnt;
            if (aoTemp[i] > this.nMaxMile) {
                this.nMaxMile = aoTemp[i] ;
            }
        }

        var oSer = {
            name: oData.Name,
            type: 'bar',
            stack: 'chart',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    formatter:'{c}辆'
                }
            },
            data: aoTemp
        }

        this.aoSer.push(oSer);


        var oPie = this.getPieConfig(oData);

        this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function (oData) {
        var aoData =  oData;
        this.oDeptStatic.splice(0, this.oDeptStatic.length);

        this.oDeptStatic = [
            {name:'在线车辆',value:aoData.Online,itemStyle:{normal:{color:'#17c97b'}}},
            {name:'离线车辆',value:(parseInt(aoData.Total) - parseInt(aoData.Online)),itemStyle:{normal:{color:'#d0d4df'}}}
        ];

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
                text: '违规类型统计',
                //subtext: '总计 '+ this.nTotal +' 辆车',
                x: '25%',
                y:'5%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }, {
                text: '实时在线率(5分钟前)',

                x: '72%',
                y: '5%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }],
            tooltip :{
                formatter: "{b} : {c} ({d}%)"
            },
            grid: [{
                top: 50,
                width: '70%',
                bottom: '0',
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile * 2.5,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },

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

