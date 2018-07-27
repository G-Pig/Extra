/**
 * 红谷滩编译 文件
 *
 * Created by liulin on 2016/12/22.
 */


var deps = {

	Core: {
		src: [
			'Track/Track.js',
			'Unit/TrackHelper.js',
		],
		desc: '版权说明文件，车辆状态的配置.'
	},


	TrackView: {

		src: [
			'Track/TrackView/TrackView.js',
			'Track/TrackView/Layout.js',
			'Track/TrackView/Page.js',
			'Track/TrackView/Bar.js',
			'Track/TrackView/Control.js',
			'Track/TrackView/TrackChart.js',
			'Track/TrackView/TrackData.js',
			'Track/TrackView/HistoryTrack.js',
			'Track/TrackView/AlarmTrack.js'

		],

		desc: '历史轨迹页面的基本控制，在page 下进行消息交互',
		deps: ['Core']
	},

	BasePanel: {
		src: [

			'Track/TrackView/PanelBox/BasePanel.js',
		],
		desc: '页面显示基本组件，可以配置为全有，但是控制是有bar对象来控制',
		deps: ['Core', 'TrackView']
	},

	AlarmPanel: {
		src: [

			'Track/TrackView/PanelBox/AlarmPanel.js',
		],
		desc: '是否显示告警面板',
		deps: ['BasePanel']
	},

	ParkPanel: {
		src: [

			'Track/TrackView/PanelBox/ParkPanel.js',
		],
		desc: '是否显示停留面板',
		deps: ['BasePanel']
	},

	SpeedDoorWeightPanel: {
		src: [

			'Track/TrackView/PanelBox/SpeedDoorWeightPanel.js',
		],
		desc: '是否显示速度、门磁、载重chart面板',
		deps: ['BasePanel']
	},

	BaseMarker: {
		src: [

			'Track/TrackView/PointLayer/BaseMarker.js',
		],
		desc: '地图上显示点的基础控件',
		deps: ['Core', 'TrackView']
	},

	AlarmMarkerMgr: {
		src: [

			'Track/TrackView/PointLayer/AlarmMarkerMgr.js',
		],
		desc: '地图上显示告警点',
		deps: ['BaseMarker']
	},

	BeginMarker: {
		src: [

			'Track/TrackView/PointLayer/BeginMarker.js',
		],
		desc: '地图上显示起点',
		deps: ['BaseMarker']
	},

	EndMarker: {
		src: [

			'Track/TrackView/PointLayer/EndMarker.js',
		],
		desc: '地图上显示终点',
		deps: ['BaseMarker']
	},

	ParkMarkerMgr: {
		src: [

			'Track/TrackView/PointLayer/ParkMarkerMgr.js',
		],
		desc: '地图上显示停留点',
		deps: ['BaseMarker']
	},

	SubMarkerMgr: {
		src: [

			'Track/TrackView/PointLayer/SubMarkerMgr.js',
		],
		desc: '地图上显示分段点',
		deps: ['BaseMarker']
	},

	BaseRealTrack: {
		src: [

			'Track/TrackView/RealTrack/BaseRealTrack.js',
		],

		desc: '实时轨迹点基础对象',
		deps: ['Core', 'TrackView']

	},

	TrackPos: {
		src: [

			'Track/TrackView/RealTrack/TrackPos.js',
		],

		desc: '实时点箭头',
		deps: ['BaseRealTrack']

	},

	TrackArrow: {
		src: [

			'Track/TrackView/RealTrack/TrackArrow.js',
		],

		desc: '实时点箭头',
		deps: ['BaseRealTrack']

	},

	TrackLine: {
		src: [

			'Track/TrackView/RealTrack/TrackLine.js',
		],

		desc: '实时线',
		deps: ['BaseRealTrack']

	},

	TrackMarkers: {
		src: [

			'Track/TrackView/RealTrack/TrackMarker.js',
		],

		desc: '实时点',
		deps: ['BaseRealTrack']

	},

	VehTrackInfo: {
		src: [

			'Track/TrackView/VehTrackInfo/VehTrackInfo.js',
			'Track/TrackView/VehTrackInfo/RealStatus.js',
			'Track/TrackView/VehTrackInfo/SpeedChart.js',
			'Track/TrackView/VehTrackInfo/WeightChart.js',

		],

		desc: '回放轨迹时 显示车辆实时状态',
		deps: ['Core', 'TrackView']

	},

	UserTrack: {

		src: [

			'Track/UserTrack/Page.js',
			'Track/UserTrack/Control.js',
			'Track/UserTrack/TrackData.js',
			'Track/UserTrack/TrackPos.js',
			'Track/UserTrack/TrackMarker.js',
			'Track/UserTrack/HistoryTrack.js',
		],

		desc: '实时点',
		deps: ['BasePanel', 'AlarmPanel', 'ParkPanel', 'SpeedDoorWeightPanel', 'BaseMarker', 'AlarmMarkerMgr', 'BeginMarker',
			'EndMarker', 'ParkMarkerMgr', 'SubMarkerMgr', 'BaseRealTrack', 'TrackPos', 'TrackArrow', 'TrackLine', 'TrackMarkers', 'VehTrackInfo']
	},

	BossTrack: {
		src: [

			'Track/BossTrack/Page.js',
			//'Track/BossTrack/Control.js',
			'Track/BossTrack/TrackData.js',
			//'Track/BossTrack/TrackPos.js',
			//'Track/BossTrack/TrackMarker.js',
			//'Track/BossTrack/HistoryTrack.js',

		],

		desc: '回放轨迹时 显示车辆实时状态',
		deps: ['BasePanel', 'AlarmPanel', 'ParkPanel', 'SpeedDoorWeightPanel', 'BaseMarker', 'AlarmMarkerMgr', 'BeginMarker',
			'EndMarker', 'ParkMarkerMgr', 'SubMarkerMgr', 'BaseRealTrack', 'TrackPos', 'TrackArrow', 'TrackLine', 'TrackMarkers', 'VehTrackInfo']
	},

	WTMTrack: {
		src: [

			'Track/WTMTrack/Page.js',
			'Track/WTMTrack/Control.js',
			'Track/WTMTrack/TrackData.js',
			//'Track/BossTrack/TrackPos.js',
			//'Track/BossTrack/TrackMarker.js',
			//'Track/BossTrack/HistoryTrack.js',

		],

		desc: '回放轨迹时 显示车辆实时状态',
		deps: ['BasePanel', 'AlarmPanel', 'ParkPanel', 'SpeedDoorWeightPanel', 'BaseMarker', 'AlarmMarkerMgr', 'BeginMarker',
			'EndMarker', 'ParkMarkerMgr', 'SubMarkerMgr', 'BaseRealTrack', 'TrackPos', 'TrackArrow', 'TrackLine', 'TrackMarkers', 'VehTrackInfo']
	},
};




if (typeof exports !== 'undefined') {
	exports.deps = deps;

}
