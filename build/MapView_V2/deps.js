/**
 * 视频监控编译 文件
 * Created by liufangzhou on 2017/3/22.
 */
var deps = {
	Core: {
		src: [
			'MapView_V2/MapView.js',
		],
		desc: '版权说明文件.'
	},
	MapView: {
		src: [
			// 外部配置基础库
			'Unit/TrackHelper.js',
			// 基础菜单内容
			'MapView_V2/MapViewBase/BaseMenu.js',
			// 小部分 右边小部分
			'MapView_V2/MapViewBase/BaseTabPanel.js',
			// 设备树控制
			'MapView_V2/MapViewBase/BaseTreeView.js',
			// 车辆列表和分页控件
			'MapView_V2/MapViewBase/BasePager.js',
			'MapView_V2/MapViewBase/BaseLst.js',
			// 地图基础控件
			'MapView_V2/MapViewBase/LayoutContent.js',
		],
		desc: '地图实时监控, 概览页面',
		deps: ['Core']
	},

	WTM:{
		src: [
			'MapView_V2/WTM/Menu/Menu.js',
			'MapView_V2/WTM/TabPanel/TabPanel.js',
			'MapView_V2/WTM/TabPanel/DeptTreeView.js',
			'MapView_V2/WTM/TabPanel/VehLst.js',
			'MapView_V2/WTM/VehRealTrack/LiveMange.js',
			'MapView_V2/WTM/VehRealTrack/MapLive.js',
			'MapView_V2/WTM/System/WTMMain.js'
		],
		desc: '地图实时监控, 概览页面',
		deps: ['MapView']
	},

	Muck:{
		src: [
			'MapView_V2/Muck/Unit/HubSvr.js',
			'MapView_V2/Muck/Unit/Timer.js',
			'MapView_V2/Muck/Unit/Lang.js',
            'MapView_V2/Muck/BoxCtrl/RefreshLoc.js',
            'MapView_V2/Muck/Menu/Menu.js',
            'MapView_V2/Muck/PageContent/Monitor/BaseMonitor.js',
            'MapView_V2/Muck/PageContent/Tool/VehicleMonitor.js',
            'MapView_V2/Muck/PageContent/Tool/SiteMonitor.js',
            'MapView_V2/Muck/PageContent/Tool/UnloadMonitor.js',
            'MapView_V2/Muck/PageContent/Tool/SuspicSiteMonitor.js',
            'MapView_V2/Muck/PageContent/Tool/SuspicUnloadMonitor.js',
            'MapView_V2/Muck/PageContent/Tool/TypeExample.js',

			'MapView_V2/Muck/TabPanel/TabPanel.js',
			'MapView_V2/Muck/TabPanel/DeptTreeView.js',
            'MapView_V2/Muck/TabPanel/SiteTreeView.js',
			'MapView_V2/Muck/TabPanel/VehLst.js',
            'MapView_V2/Muck/TabPanel/DeptVehLst.js',
            'MapView_V2/Muck/TabPanel/AlarmTypes.js',
            'MapView_V2/Muck/TabPanel/SiteVehLst.js',
            'MapView_V2/Muck/TabPanel/UnloadVehLst.js',
            'MapView_V2/Muck/TabPanel/SuspicUnloadVehLst.js',
            'MapView_V2/Muck/TabPanel/SuspicSiteVehLst.js',
            'MapView_V2/Muck/TabPanel/AlarmVehLst.js',
            'MapView_V2/Muck/TabPanel/FenceTreeView.js',
            'MapView_V2/Muck/TabPanel/FenceVehicle.js',
            'MapView_V2/Muck/TabPanel/RectSearch.js',
            'MapView_V2/Muck/TabPanel/RectVehicle.js',

            'MapView_V2/Muck/Layer/LiveMange.js',
			'MapView_V2/Muck/Layer/MapLive.js',
			'MapView_V2/Muck/Layer/VehClusterLayer.js',
            'MapView_V2/Muck/Layer/VehDetailClusterLayer.js',
            'MapView_V2/Muck/Layer/VehClusterMange.js',
            'MapView_V2/Muck/Layer/SiteLayer.js',
            'MapView_V2/Muck/Layer/UnloadLayer.js',
            'MapView_V2/Muck/Layer/SuspicUnloadLayer.js',
            'MapView_V2/Muck/Layer/SuspicSiteLayer.js',
            'MapView_V2/Muck/Layer/RectLayer.js',
            'MapView_V2/Muck/Layer/FenceLayer.js',
			'MapView_V2/Muck/Layer/PopSiteInfo.js',
            'MapView_V2/Muck/Layer/PopUnloadInfo.js',
		],
		desc: '地图实时监控, 概览页面',
		deps: ['MapView']
	},

	MapViewFrameTab:{
		src: [
			// 图层管理
			'MapView_V2/MapViewFrameTab/PopTabPage/FrameTab.js',
			'MapView_V2/MapViewFrameTab/PopTabPage/VehDetail.js',

			'MapView_V2/MapViewFrameTab/VehInfo/VehInfo.js',
			'MapView_V2/MapViewFrameTab/VehInfo/RealStatusNj.js',
			'MapView_V2/MapViewFrameTab/VehInfo/SpeedChart.js',
			'MapView_V2/MapViewFrameTab/VehInfo/VehInfoView.js',
			'MapView_V2/MapViewFrameTab/VehInfo/WeightChart.js',
			'MapView_V2/MapViewFrameTab/VehInfo/AlarmGridLst.js',
			'MapView_V2/MapViewFrameTab/VehInfo/MapLive.js',
			'MapView_V2/MapViewFrameTab/VehInfo/MapMonitor.js',
			'MapView_V2/MapViewFrameTab/VehInfo/SpeedLineChart.js',
			'MapView_V2/MapViewFrameTab/System/MuckMain.js'
		],

		desc: '地图实时监控, 概览页面',
		deps: ['Muck']
	},

    MapViewGPSFrameTab:{
        src: [
            // 图层管理
            'MapView_V2/MapViewGPSFrameTab/PopTabPage/FrameTab.js',
            'MapView_V2/MapViewGPSFrameTab/PopTabPage/VehDetail.js',

            'MapView_V2/MapViewGPSFrameTab/VehInfo/VehInfo.js',
            'MapView_V2/MapViewGPSFrameTab/VehInfo/RealStatusNj.js',
            'MapView_V2/MapViewGPSFrameTab/VehInfo/SpeedChartGPS.js',
            'MapView_V2/MapViewGPSFrameTab/VehInfo/VehInfoView.js',
            'MapView_V2/MapViewGPSFrameTab/VehInfo/WeightChart.js',
            'MapView_V2/MapViewGPSFrameTab/VehInfo/AlarmGridLst.js',
            'MapView_V2/MapViewGPSFrameTab/VehInfo/MapLiveGPS.js',
            'MapView_V2/MapViewGPSFrameTab/VehInfo/MapMonitor.js',
            'MapView_V2/MapViewGPSFrameTab/VehInfo/SpeedLineChart.js',
            'MapView_V2/MapViewGPSFrameTab/System/GPSMuckMain.js'
        ],

        desc: 'GPS地图实时监控, 概览页面',
        deps: ['Muck']
    },

    // 白鹤滩实时监控页面设计
    BHT:{
        src:[
            'MapView_V2/BHT/BHTMapView.js',
            'MapView_V2/BHT/Unit/HubSvr.js',
            'MapView_V2/BHT/Unit/Timer.js',
            'MapView_V2/BHT/Unit/Lang.js',

            'MapView_V2/BHT/BoxCtrl/BHTSearch.js',
            'MapView_V2/BHT/Menu/Menu.js',

            'MapView_V2/BHT/PageContent/BaseMonitor.js',
            'MapView_V2/BHT/PageContent/VehicleMonitor.js',
            'MapView_V2/BHT/PageContent/TypeExample-BHT.js',

            'MapView_V2/BHT/TabPanel/TabPanel.js',
            'MapView_V2/BHT/TabPanel/DeptTreeView.js',
            'MapView_V2/BHT/TabPanel/SiteTreeView.js',
            'MapView_V2/BHT/TabPanel/SpeedLimitTreeView.js',
            'MapView_V2/BHT/TabPanel/VehLst.js',
            'MapView_V2/BHT/TabPanel/DeptVehLst.js',
            'MapView_V2/BHT/TabPanel/AlarmTypes.js',
            'MapView_V2/BHT/TabPanel/SiteVehLst.js',
            'MapView_V2/BHT/TabPanel/UnloadVehLst.js',
            'MapView_V2/BHT/TabPanel/AlarmVehLst.js',

            'MapView_V2/BHT/Layer/LineLayer.js',
            // 分路段限速图层
            'MapView_V2/BHT/Layer/SpeedLimitLayer.js',
            'MapView_V2/BHT/Layer/LiveMange.js',
            'MapView_V2/BHT/Layer/MapLive.js',
            'MapView_V2/BHT/Layer/VehClusterLayer.js',
            'MapView_V2/BHT/Layer/SiteLayer.js',
            'MapView_V2/BHT/Layer/UnloadLayer.js',
            'MapView_V2/BHT/Layer/PopSiteInfo.js',
            'MapView_V2/BHT/Layer/PopUnloadInfo.js',

            // 图层管理
            'MapView_V2/BHT/PopTabPage/FrameTab.js',
            'MapView_V2/BHT/PopTabPage/VehDetail.js',

            'MapView_V2/BHT/VehInfo/VehInfo.js',
            'MapView_V2/BHT/VehInfo/RealStatusNj.js',
            'MapView_V2/BHT/VehInfo/SpeedChart.js',
            'MapView_V2/BHT/VehInfo/VehInfoView.js',
            'MapView_V2/BHT/VehInfo/WeightChart.js',
            'MapView_V2/BHT/VehInfo/AlarmGridLst.js',
            'MapView_V2/BHT/VehInfo/MapLive.js',
            'MapView_V2/BHT/VehInfo/MapMonitor.js',
            'MapView_V2/BHT/VehInfo/SpeedLineChart.js',

            'MapView_V2/BHT/System/BHTMuckMain.js'
        ],
        desc: '白鹤滩地图实时监控, 概览页面',
        deps: ['MapView']
    },
    Report: {
        src: [
            'MapView_V2/Report/Muck_V2.1.js',
            'MapView_V2/Report/Layout/BaseLayout.js',
            'MapView_V2/Report/Layout/BaseSearch.js',
            'MapView_V2/Report/LeftTree/LeftTree.js',
        ],
        desc: '指标显示',
    },
    MapViewTest: {
        src: [
            'MapView_V2/MapViewTest/Layout.js',
            'MapView_V2/MapViewTest/Page.js',
            'MapView_V2/MapViewTest/Search.js',
        ],
        desc: '测试地图——弃土流向',
        deps: ['MapView','Report']
    },
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}