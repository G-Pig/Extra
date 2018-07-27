/**
 * 红谷滩编译 文件
 *
 * Created by liulin on 2016/12/22.
 */


var deps = {

	Core: {
		src: [
			'CloudMap/CloudMap.js',
		],
		desc: '版权说明文件.'
	},


	CloudMap: {
		src: [
			// 云图的做法
			'CloudMap/Layout.js',
			'CloudMap/Tool/BaseTool.js',
			'CloudMap/Tool/CalEditTool.js',
			'CloudMap/Tool/EditTool.js',
			'CloudMap/Tool/SaveTool.js',
			'CloudMap/MenuTool.js',
			'CloudMap/PopWnd/BaseWnd.js',
			'CloudMap/MenuItem/BaseMenu.js',
			'CloudMap/TreePenal/BaseTreePanel.js',
		],

		desc: 'HGT 作为基础来包装地图实时监控, 概览页面',
		deps: ['Core']

	},



	CloudMapForPO: {
		src: [
			'CloudMap/MenuItem/PostLineMenu.js',
			'CloudMap/Tool/PostLine/PostLineEditTool.js',
			'CloudMap/Tool/PostLine/PostLineCalTool.js',
			'CloudMap/TreePenal/CreatePos.js',
			'CloudMap/Tool/PostLine/PostLineDrawTool.js',
			'CloudMap/PopWnd/PostLineWnd.js',
			'CloudMap/PopWnd/PostLineDelWnd.js',
			'CloudMap/TreePenal/LineTree.js',


		],
		desc: 'PO 邮局项目',
		deps: ['CloudMap']
	},

	CloudMapForBoss: {
		src: [
			'CloudMap/MenuItem/Boss/GridMenu.js',
			'CloudMap/PopWnd/Boss/GridWnd.js',
			'CloudMap/TreePenal/Boss/GridTreePanel.js',
			'CloudMap/Tool/Boss/DrawGridTool.js',
			'CloudMap/Tool/Boss/GridEditTool.js',
            'CloudMap/Tool/Boss/GridDelTool.js',
            'CloudMap/System/BossMain.js',
		],
		desc: 'Boss 项目',
		deps: ['CloudMap']
	},

	CloudMapForEPMonitor: {
		src: [
			'CloudMap/MenuItem/EPMonitor/LineMenu.js',
			'CloudMap/PopWnd/EPMonitor/LineWnd.js',
			'CloudMap/PopWnd/EPMonitor/DelWnd.js',
			'CloudMap/PopWnd/EPMonitor/MarkerWnd.js',
			'CloudMap/PopWnd/EPMonitor/RegionMarkerWnd.js',
			'CloudMap/TreePenal/EPMonitor/LineTreePanel.js',
			'CloudMap/Tool/EPMonitor/DrawLineTool.js',
			'CloudMap/Tool/EPMonitor/EditLineTool.js',
			'CloudMap/Tool/EPMonitor/DrawMarkerTool.js',
			'CloudMap/Tool/EPMonitor/EditMarkerTool.js',
			'CloudMap/Tool/EPMonitor/DeleteTool.js',
			'CloudMap/MenuItem/EPMonitor/NationalCtrlMenu.js',
			'CloudMap/MenuItem/EPMonitor/RegionCtrlMenu.js',
			'CloudMap/Layers/LineLayer.js',
			'CloudMap/Layers/MarkerLayer.js',
		],
		desc: 'EPMonitor 项目',
		deps: ['CloudMap']
	},

	CloudMapForWTM: {
		src: [
			'CloudMap/Lang/ZH-CN.js',
			'CloudMap/MenuItem/WTM/SiteMenu.js',
			'CloudMap/PopWnd/WTM/SiteWnd.js',
			'CloudMap/PopWnd/WTM/DelWnd.js',
			'CloudMap/TreePenal/WTM/SiteTreePanel.js',
			'CloudMap/Tool/WTM/DrawSiteTool.js',
			'CloudMap/Tool/WTM/EditSiteTool.js',
			'CloudMap/Tool/WTM/DeleteTool.js',

			'CloudMap/Layers/WTM/SiteLayer.js',

		],
		desc: 'EPMonitor 项目',
		deps: ['CloudMap']
	},

	CloudMapForMuckLine: {
		src: [
			'CloudMap/Lang/ZH-CN.js',
			'CloudMap/MenuItem/MuckLine/LineMenu.js',
			'CloudMap/PopWnd/MuckLine/LineWnd.js',
			'CloudMap/PopWnd/MuckLine/DelWnd.js',
			'CloudMap/PopWnd/MuckLine/PopSiteUnload.js',

			'CloudMap/TreePenal/MuckLine/LineTreePanel.js',
			'CloudMap/Tool/MuckLine/DrawLineTool.js',
			'CloudMap/Tool/MuckLine/EditLineTool.js',
			'CloudMap/Tool/MuckLine/DeleteTool.js',
			'CloudMap/Layers/MuckLine/LineLayer.js',
			'CloudMap/System/MuckLine.js',
		],
		desc: 'EPMonitor 项目',
		deps: ['CloudMap']
	},

    CloudMapForMuck: {
        src: [
            'CloudMap/Lang/ZH-CN.js',
            'CloudMap/PopWnd/Muck/GridWnd.js',
            'CloudMap/PopWnd/Muck/DelWnd.js',
            //'CloudMap/PopWnd/Muck/PopSiteUnload.js',
            'CloudMap/Tool/Muck/DrawGridTool.js',
            'CloudMap/Tool/Muck/EditGridTool.js',
            'CloudMap/Tool/Muck/DeleteTool.js',
            'CloudMap/TreePenal/Muck/GridTreePanel.js',
            'CloudMap/MenuItem/Muck/MuckGridMenu.js',

            'CloudMap/System/Muck.js',
        ],
        desc: '武汉渣土Muck',
        deps: ['CloudMap']
    },

	System: {
		src: [
			'CloudMap/System/WTMMain.js',
		],
		desc: '版权说明文件.'
	},

};




if (typeof exports !== 'undefined') {
	exports.deps = deps;

}
