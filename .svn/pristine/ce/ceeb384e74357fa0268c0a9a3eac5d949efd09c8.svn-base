/**
 * 视频监控编译 文件
 *
 * Created by liufangzhou on 2017/3/22.
 */



var deps = {
	Core: {
		src: [
			'MapView/MapView.js',
		],
		desc: '版权说明文件.'
	},


	MapView: {

		src: [
			'Unit/TrackHelper.js',

			'MapView/Menu.js',

			// 小部分 右边小部分
			'MapView/TabPanel/TabPanel.js',
			'MapView/TabPanel/JsTreeEx.js',
			'MapView/TabPanel/SiteTree.js',

			// 设备树控制
			'MapView/TabPanel/VehTree.js',

			// 路网树控制
			'MapView/TabPanel/LineTree.js',

			// 车辆列表和分页控件
			'MapView/TabPanel/ListView/LstPager.js',
			'MapView/TabPanel/ListView/VehLst.js',
			'MapView/TabPanel/ListView/UserLst.js',

			// 地图基础控件
			'MapView/PageContent/LayoutContent.js',
			'MapView/PageContent/AlarmCtrl.js',
			//'MapView/PageContent/PopSubAlarmType.js',


			'MapView/Box/ReceiveAlarm.js',
			'MapView/Box/VehInOut.js',
			'MapView/Box/SiteStatic.js',
			'MapView/Box/PopSiteInfo.js',

			// 图层管理
			'MapView/PopTabPage/TabPage.js',


			// 视频监控
			'MapView/Video/VideoBox.js',

			'MapView/Layer/LineLayer.js',
			'MapView/Layer/SiteLayer.js',
			'MapView/Layer/RegionBoundLayer.js',
			'MapView/Layer/VehRealTrack/LiveMange.js',
			'MapView/Layer/VehRealTrack/MapLive.js',
			'MapView/ReqTrack/ReqTrack.js',

		],

		desc: '地图实时监控, 概览页面',
		deps: ['Core']
	},




	TabPanel: {

		src: [
			'MapView/TabPanel/BasePanel.js',
			'MapView/TabPanel/Panel/AssetPanel.js',
			'MapView/TabPanel/Panel/SubDeptPanel.js',
			'MapView/TabPanel/Panel/MaintainPanel.js',
			'MapView/TabPanel/Panel/DiseSubDeptPanel.js',
			'MapView/TabPanel/Panel/TaskPanel.js',
			'MapView/TabPanel/Panel/UserPanel.js'
		],

		desc: '地图实时监控, 概览页面',
		deps: ['MapView']
	},

	Monitor: {

		src: [
			'MapView/PageContent/MonitorMgr.js',
			'MapView/PageContent/Monitor/BaseMonitor.js',
			'MapView/PageContent/Monitor/AssetMonitor.js',
			'MapView/PageContent/Monitor/AssetMaintainMonitor.js',

			'MapView/PageContent/Monitor/DiseMonitor.js',
			'MapView/PageContent/Monitor/DiseMaintainMonitor.js',

			'MapView/PageContent/Monitor/SubDeptMonitor.js',
			'MapView/PageContent/Monitor/MaintainMonitor.js',
			'MapView/PageContent/Monitor/TaskMonitor.js',

			'MapView/PageContent/Monitor/AssessSegmentMonitor.js',
		],

		desc: '地图实时监控, 概览页面',
		deps: ['MapView']
	},

	Target: {
		src: ['MapView/Box/Target.js'],
		desc: '指标显示',
		deps: ['MapView']

	},

	Layer: {
		src: [
			'MapView/Layer/Asset/AssetPosLayer.js',
			'MapView/Layer/Asset/AssetLineLayer.js',
			'MapView/Layer/Asset/PopAssetInfo.js',
			'MapView/Layer/DiseLayer.js',
			'MapView/Layer/AssessSegmentLayer.js',
			'MapView/Layer/TaskLayer.js',
			'MapView/Layer/UserLayer.js',
		],
		desc: '资产图层显示',
		deps: ['MapView']

	},
};


if (typeof exports !== 'undefined') {
	exports.deps = deps;

}
