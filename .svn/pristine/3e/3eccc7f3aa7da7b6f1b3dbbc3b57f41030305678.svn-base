/**
 * 养护所 监控
 * Created by liulin on 2017/5/9.
 */

ES.MapView.AssetMaintainMonitor = ES.MapView.AssetMonitor.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: 'AssetMonitor',

        cUrl: '/AssetStatic/ReportAssetMaintainStatic',

    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        ES.Util.reqData({url: this.oOption.cUrl, data: {nDeptId:5}}, this.initMenuBoxHandler, this);

    },

});