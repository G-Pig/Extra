/**
 * 视频监控编译 文件
 *
 * Created by liufangzhou on 2017/3/22.
 */



var deps = {

    Report: {
        src: [
            'Muck_V2.1/Muck_V2.1.js',
            'Muck_V2.1/Layout/BaseLayout.js',
            'Muck_V2.1/Layout/BaseSearch.js',
            'Muck_V2.1/LeftTree/LeftTree.js',
            //'Muck_V2.1/Layout.js',
            //'Muck_V2.1/BaseChart.js',
            //'Muck_V2.1/Chart/RouteChart.js',
            //'Muck_V2.1/Chart/RouteDeptChart.js',
            //'Muck_V2.1/LeftTree/RouteLeftTree.js',
            //'Muck_V2.1/Grid/RouteGrid.js'
        ],
        desc: '指标显示',

    },

    Role: {
        src: [
            'Muck_V2.1/Role/Dialog.js',
            'Muck_V2.1/Role/Grid.js',
            'Muck_V2.1/Role/Role.js',
            'Muck_V2.1/Role/RoleLayout.js',
            'Muck_V2.1/Role/Search.js'
        ],
        desc: '角色管理',
        deps: ['Report']
    },

    User: {
        src: [
            'Muck_V2.1/User/Grid.js',
            'Muck_V2.1/User/User.js',
            'Muck_V2.1/User/Layout.js',
            'Muck_V2.1/User/Search.js',
            'Muck_V2.1/User/Tree.js',
            'Muck_V2.1/User/Dialog.js'
        ],
        desc: '用户管理',
        deps: ['Report']
    },

    Site: {
        src: [
            'Muck_V2.1/Site/ExitLayer.js',
            'Muck_V2.1/Site/Grid.js',
            'Muck_V2.1/Site/Page.js',
            'Muck_V2.1/Site/Layout.js',
            'Muck_V2.1/Site/Search.js',
            'Muck_V2.1/Site/Tree.js',
            'Muck_V2.1/Site/Dialog.js',
            'Muck_V2.1/Site/SiteLayer.js'
        ],
        desc: '工地管理',
        deps: ['Report']
    },

    Department: {
        src: [
            'Muck_V2.1/Department/Grid.js',
            'Muck_V2.1/Department/Page.js',
            'Muck_V2.1/Department/Layout.js',
            'Muck_V2.1/Department/Search.js',
            'Muck_V2.1/Department/Tree.js',
            'Muck_V2.1/Department/Dialog.js'
        ],
        desc: '部门管理',
        deps: ['Report']
    },

    Enterprise: {
        src: [
            'Muck_V2.1/Enterprise/Grid.js',
            'Muck_V2.1/Enterprise/Page.js',
            'Muck_V2.1/Enterprise/Layout.js',
            'Muck_V2.1/Enterprise/Search.js',
            'Muck_V2.1/Enterprise/Tree.js',
            'Muck_V2.1/Enterprise/Dialog.js',
            'Muck_V2.1/RemovalPermit/permitView/pageDig.js',
        ],
        desc: '企业管理',
        deps: ['Report']
    },

    Vehicle: {
        src: [
            'Muck_V2.1/Vehicle/Dialog.js',
            'Muck_V2.1/Vehicle/Grid.js',
            'Muck_V2.1/Vehicle/Page.js',
            'Muck_V2.1/Vehicle/Layout.js',
            'Muck_V2.1/Vehicle/Search.js',
            'Muck_V2.1/Vehicle/Tree.js'
        ],
        desc: '车辆管理',
        deps: ['Report']
    },

    Unload: {
        src: [
            'Muck_V2.1/Unload/Grid.js',
            'Muck_V2.1/Unload/Page.js',
            'Muck_V2.1/Unload/Layout.js',
            'Muck_V2.1/Unload/Search.js',
            'Muck_V2.1/Unload/Tree.js',
            'Muck_V2.1/Unload/Dialog.js',
            'Muck_V2.1/Site/SiteLayer.js',
            'Muck_V2.1/Unload/UnloadLayer.js'
        ],
        desc: '消纳点管理',
        deps: ['Report']
    },

    ContractManager: {
        src: [
            'Muck_V2.1/ContractManager/Dialog.js',
            'Muck_V2.1/ContractManager/Grid.js',
            'Muck_V2.1/ContractManager/Page.js',
            'Muck_V2.1/ContractManager/Layout.js',
            'Muck_V2.1/ContractManager/Search.js'
        ],
        desc: '合同管理',
        deps: ['Report']
    },

    RuleManageBHT: {
        src: [
            'Muck_V2.1/RuleManageBHT/Dialog.js',
            'Muck_V2.1/RuleManageBHT/Grid.js',
            'Muck_V2.1/RuleManageBHT/Page.js',
            'Muck_V2.1/RuleManageBHT/Layout.js',
            'Muck_V2.1/RuleManageBHT/Search.js'
        ],
        desc: '规则维护BHT',
        deps: ['Report']
    },

    LineCheck: {
        src: [
            'Muck_V2.1/LineCheck/Grid.js',
            'Muck_V2.1/LineCheck/Page.js',
            'Muck_V2.1/LineCheck/Layout.js',
            'Muck_V2.1/LineCheck/Search.js',
            'Muck_V2.1/LineCheck/Tree.js',
            'Muck_V2.1/LineCheck/Dialog.js'
        ],
        desc: '线路绑定',
        deps: ['Report']
    },

    SelectTruck: {
        src: [
            'Muck_V2.1/SelectTruck/SelectTruck.js',
            'Muck_V2.1/SelectTruck/Grid.js',
            'Muck_V2.1/SelectTruck/Search.js',
            'Muck_V2.1/SelectTruck/Tree.js',

        ],
        desc: '车辆绑定弹框 (规则绑定/线路绑定 共用)',

    },

    PhotoWall: {
        src: [
            'Muck_V2.1/SelectTruck/SelectTruck.js',
            'Muck_V2.1/SelectTruck/Grid.js',
            'Muck_V2.1/SelectTruck/Search.js',
            'Muck_V2.1/SelectTruck/Tree.js',
            'Muck_V2.1/PhotoWall/Layout.js',
            'Muck_V2.1/PhotoWall/Page.js',
            'Muck_V2.1/PhotoWall/Search.js',
            'Muck_V2.1/PhotoWall/LeftCarList.js',
            'Muck_V2.1/PhotoWall/SelectTruckPhoto.js',
            'Muck_V2.1/PhotoWall/PhotoList.js',

        ],
        desc: '历史照片',

    },

    HubSvr: {
        src: [
            'Muck_V2.1/Unit/Layout.js',
            'Muck_V2.1/Unit/Search.js',
            'Muck_V2.1/Unit/Tree.js',
            'Muck_V2.1/Unit/TrackHelper.js',
            'Muck_V2.1/Unit/HubSvrEvent.js',
            //'Muck_V2.1/Unit/addToTpl.js'
        ],
        desc: '推送'

    },

    SiteThen: {
        src: [
            'Muck_V2.1/SiteThen/Grid.js',
            'Muck_V2.1/SiteThen/Page.js',
            'Muck_V2.1/SiteThen/Layout.js',
            'Muck_V2.1/SiteThen/Search.js',
            'Muck_V2.1/SiteThen/Tree.js',
            'Muck_V2.1/SiteThen/Dialog.js'
        ],
        desc: '工地上报'

    },

    VehicleInfoMgr: {
        src: [
            'Muck_V2.1/VehicleInfoMgr/Dialog.js',
            'Muck_V2.1/VehicleInfoMgr/Grid.js',
            'Muck_V2.1/VehicleInfoMgr/Page.js',
            'Muck_V2.1/VehicleInfoMgr/Layout.js',
            'Muck_V2.1/VehicleInfoMgr/Search.js',
            'Muck_V2.1/VehicleInfoMgr/Tree.js',
            'Muck_V2.1/AnnualSurvey/AnnualSurvey.js',
            'Muck_V2.1/AnnualSurvey/Grid.js',
            'Muck_V2.1/AnnualSurvey/Search.js',
            'Muck_V2.1/RemovalPermit/permitView/pageDig.js',
        ],
        desc: '资产管理/车辆信息管理',
        deps: ['Report']
    },

    RemovalPermit: {
        src: [
            'CloudMap/CloudMap.js',
            'CloudMap/Layout.js',
            'Muck_V2.1/RemovalPermit/Dialog.js',
            'Muck_V2.1/RemovalPermit/ModelGrid.js',
            'Muck_V2.1/RemovalPermit/Grid.js',
            'Muck_V2.1/RemovalPermit/Page.js',
            'Muck_V2.1/RemovalPermit/Layout.js',
            'Muck_V2.1/RemovalPermit/Search.js',
            'Muck_V2.1/RemovalPermit/Tree.js',
            'Muck_V2.1/RemovalPermit/permitView/pageDig.js',
        ],
        desc: '处置证信息管理',
        deps: ['Report']
    },
    FormalPermit: {
        src: [
            'CloudMap/CloudMap.js',
            'CloudMap/Layout.js',
            'Muck_V2.1/FormalPermit/PointPop.js',
            'Muck_V2.1/SelectTruck/SelectTruck.js',
            'Muck_V2.1/SelectTruck/Grid.js',
            'Muck_V2.1/SelectTruck/Search.js',
            'Muck_V2.1/SelectTruck/Tree.js',
            'Muck_V2.1/FormalPermit/SelectTruck/PermitSelectTruck.js',
            'Muck_V2.1/FormalPermit/BaseItem.js',
            'Muck_V2.1/FormalPermit/Panel/Site.js',
            'Muck_V2.1/FormalPermit/Panel/Line.js',
            'Muck_V2.1/FormalPermit/Panel/UnLoad.js',
            'Muck_V2.1/FormalPermit/Panel/BaseInfo.js',
            'Muck_V2.1/FormalPermit/Panel/Vehicle.js',
            'Muck_V2.1/FormalPermit/BasePanel.js',
            'Muck_V2.1/FormalPermit/System.js',
        ],
        desc: '正式处置证办理',
        deps: ['Report']
    },
    SiteSupervision: {
        src: [
            'CloudMap/CloudMap.js',
            'CloudMap/Layout.js',
            'Muck_V2.1/SiteSupervision/Layout.js',
            'Muck_V2.1/SiteSupervision/Tree.js',
            'Muck_V2.1/SiteSupervision/Panel.js',
            'Muck_V2.1/SiteSupervision/PopSiteInfo.js',
            'Muck_V2.1/SiteSupervision/Panels/LayersPanel.js',
            'Muck_V2.1/SiteSupervision/Panels/SitesPanel.js',
            'Muck_V2.1/MapEvent/MapBase.js',
            'Muck_V2.1/MapEvent/System/Region.js',
            'Muck_V2.1/MapEvent/System/Site.js',
            'Muck_V2.1/MapEvent/System/TypeExample.js',

            'Muck_V2.1/SiteSupervision/Page.js',
        ],
        desc: '工地监控',
        deps: ['Report']
    },
    UnloadSupervision: {
        src: [
            'CloudMap/CloudMap.js',
            'CloudMap/Layout.js',
            'Muck_V2.1/SiteSupervision/Layout.js',
            'Muck_V2.1/UnloadSupervision/Tree.js',
            'Muck_V2.1/SiteSupervision/Panel.js',
            'Muck_V2.1/SiteSupervision/Panels/LayersPanel.js',
            'Muck_V2.1/UnloadSupervision/Panels/UnloadPanel.js',
            'Muck_V2.1/MapEvent/MapBase.js',
            'Muck_V2.1/MapEvent/System/Region.js',
            'Muck_V2.1/MapEvent/System/Site.js',
            'Muck_V2.1/MapEvent/System/TypeExample.js',

            'Muck_V2.1/UnloadSupervision/Page.js',
        ],
        desc: '消纳点监控',
        deps: ['Report']
    },
    EntranceGuard: {
        src: [
            'Muck_V2.1/EntranceGuard/Grid.js',
            'Muck_V2.1/EntranceGuard/Page.js',
            'Muck_V2.1/EntranceGuard/Layout.js',
            'Muck_V2.1/EntranceGuard/Search.js',
            'Muck_V2.1/EntranceGuard/Tree.js',
            'Muck_V2.1/EntranceGuard/Dialog.js'
        ],
        desc: '门禁管理',
        deps: ['Report']
    },

    SelectRoad: {
        src: [
            'Muck_V2.1/SelectRoad/SelectRoad.js',
            'Muck_V2.1/SelectRoad/Tree.js',
            'Muck_V2.1/SelectRoad/RoadLayer.js',
            //'Muck_V2.1/SelectRoad/Grid.js',
            //'Muck_V2.1/SelectRoad/Search.js',

        ],
        desc: '选择道路弹框',
    },

    RolePermissionScope: {
        src: [
            'Muck_V2.1/RolePermissionScope/Dialog.js',
            'Muck_V2.1/RolePermissionScope/Grid.js',
            'Muck_V2.1/RolePermissionScope/Role.js',
            'Muck_V2.1/RolePermissionScope/RoleLayout.js',
            'Muck_V2.1/RolePermissionScope/Search.js'
        ],
        desc: '角色数据权限管理',
        deps: ['Report']
    },
    DriverInfo: {
        src: [
            'Muck_V2.1/DriverInfo/Dialog.js',
            'Muck_V2.1/DriverInfo/Grid.js',
            'Muck_V2.1/DriverInfo/Driver.js',
            'Muck_V2.1/DriverInfo/DriverLayout.js',
            'Muck_V2.1/DriverInfo/Search.js'
        ],
        desc: '司机信息管理',
        deps: ['Report']
    },
    Message: {
        src: [
            'Muck_V2.1/Message/Dialog.js',
            'Muck_V2.1/Message/Grid.js',
            'Muck_V2.1/Message/Page.js',
            'Muck_V2.1/Message/Layout.js',
            'Muck_V2.1/Message/Search.js',
            'Muck_V2.1/Message/Tree.js'
        ],
        desc: '消息管理',
        deps: ['Report']
    },
    Tag: {
        src: [
            'Muck_V2.1/Tag/Dialog.js',
            'Muck_V2.1/Tag/Grid.js',
            'Muck_V2.1/Tag/Tag.js',
            'Muck_V2.1/Tag/TagLayout.js',
            'Muck_V2.1/Tag/Search.js',
        ],
        desc: '标签管理',
        deps: ['Report']
    },
    WeighBridgeType: {
        src: [
            'Muck_V2.1/WeighBridgeType/Dialog.js',
            'Muck_V2.1/WeighBridgeType/Grid.js',
            'Muck_V2.1/WeighBridgeType/Page.js',
            'Muck_V2.1/WeighBridgeType/Layout.js',
            'Muck_V2.1/WeighBridgeType/Search.js',
        ],
        desc: '载重类型管理',
        deps: ['Report']
    },
    AreaVehAlerm: {
        src: [
            'Muck_V2.1/AreaVehAlerm/Dialog.js',
            'Muck_V2.1/AreaVehAlerm/Grid.js',
            'Muck_V2.1/AreaVehAlerm/Page.js',
            'Muck_V2.1/AreaVehAlerm/Layout.js',
            'Muck_V2.1/AreaVehAlerm/Search.js',
            'Muck_V2.1/AreaVehAlerm/Tree.js',
        ],
        desc: '车辆实时状态统计',
        deps: ['Report']
    },
    FenceVehicle: {
        src: [
            'Muck_V2.1/FenceVehicle/Dialog.js',
            'Muck_V2.1/FenceVehicle/Grid.js',
            'Muck_V2.1/FenceVehicle/Page.js',
            'Muck_V2.1/FenceVehicle/Layout.js',
            'Muck_V2.1/FenceVehicle/Search.js',
            'Muck_V2.1/FenceVehicle/Tree.js',
            'Muck_V2.1/FenceVehicle/echart.js',
            'Muck_V2.1/FenceVehicle/FenceLayer.js',

        ],
        desc: '围栏车流量',
        deps: ['Report']
    },
    UploadSite: {
        src: [
            'Muck_V2.1/UploadSite/Dialog.js',
            'Muck_V2.1/UploadSite/Grid.js',
            'Muck_V2.1/UploadSite/Page.js',
            'Muck_V2.1/UploadSite/Layout.js',
            'Muck_V2.1/UploadSite/Search.js',
            'Muck_V2.1/UploadSite/Tree.js',
        ],
        desc: '工地出土车辆在线',
        deps: ['Report']
    },
    SelectArea: {
        src: [
            'Muck_V2.1/SelectArea/SelectArea.js',
            'Muck_V2.1/SelectArea/AreaTree.js',
            'Muck_V2.1/SelectArea/AreaLayer.js',
        ],
        desc: '地图选择面要素'
    },
    VehicleRegister:{
        src: [
            'Muck_V2.1/VehicleRegister/Dialog.js',
            'Muck_V2.1/VehicleRegister/Grid.js',
            'Muck_V2.1/VehicleRegister/Page.js',
            'Muck_V2.1/VehicleRegister/Layout.js',
            'Muck_V2.1/VehicleRegister/Search.js',
            'Muck_V2.1/VehicleRegister/Tree.js',
        ],
        desc: '车辆户籍管理',
        deps: ['Report']
    },
    RuleManage: {
        src: [
            'Muck_V2.1/RuleManage/Dialog.js',
            'Muck_V2.1/RuleManage/Grid.js',
            'Muck_V2.1/RuleManage/Page.js',
            'Muck_V2.1/RuleManage/Layout.js',
            'Muck_V2.1/RuleManage/Search.js'
        ],
        desc: '规则维护',
        deps: ['Report']
    },
    VehicleRegisterCheck:{
        src: [
            'Muck_V2.1/VehicleRegisterCheck/Dialog.js',
            'Muck_V2.1/VehicleRegisterCheck/Grid.js',
            'Muck_V2.1/VehicleRegisterCheck/Page.js',
            'Muck_V2.1/VehicleRegisterCheck/Layout.js',
            'Muck_V2.1/VehicleRegisterCheck/Search.js',
            'Muck_V2.1/VehicleRegisterCheck/Tree.js',
        ],
        desc: '车辆户籍管理——审核',
        deps: ['Report']
    },
    UploadVehiclArea: {
        src: [
            'Muck_V2.1/UploadVehicleArea/Dialog.js',
            'Muck_V2.1/UploadVehicleArea/Grid.js',
            'Muck_V2.1/UploadVehicleArea/Page.js',
            'Muck_V2.1/UploadVehicleArea/Layout.js',
            'Muck_V2.1/UploadVehicleArea/Search.js',
            'Muck_V2.1/UploadVehicleArea/Tree.js',
        ],
        desc: '过境车辆上报',
        deps: ['Report']
    },
    VehicleTunnel: {
        src: [
            'Muck_V2.1/VehicleTunnel/Grid.js',
            'Muck_V2.1/VehicleTunnel/Page.js',
            'Muck_V2.1/VehicleTunnel/Layout.js',
            'Muck_V2.1/VehicleTunnel/Search.js',
            'Muck_V2.1/VehicleTunnel/Tree.js',
        ],
        desc: '车辆隧道速度—bht',
        deps: ['Report']
    },
    SelectTruckZTC: {
        src: [
            'Muck_V2.1/SelectTruck/SelectTruckZTC.js',
            'Muck_V2.1/SelectTruck/Grid.js',
            'Muck_V2.1/SelectTruck/SearchZTC.js',
            'Muck_V2.1/SelectTruck/Tree.js',

        ],
        desc: '渣土车2.0车辆绑定弹框 (规则绑定/线路绑定 共用)',
    },
    //2018-05-11重新做的工地门禁
    SiteGuard: {
        src: [
            'Muck_V2.1/SiteGuard/Dialog.js',
            'Muck_V2.1/SiteGuard/Page.js',
            'Muck_V2.1/SiteGuard/Layout.js',
            'Muck_V2.1/SiteGuard/Tree.js',
        ],
        desc: '工地门禁',
        deps: ['Report']
    },
    VehicleInstall: {
        src: [
            'Muck_V2.1/VehicleInstall/Dialog.js',
            'Muck_V2.1/VehicleInstall/Page.js',
            'Muck_V2.1/VehicleInstall/Grid.js',
            'Muck_V2.1/VehicleInstall/Layout.js',
            'Muck_V2.1/VehicleInstall/Search.js',
            'Muck_V2.1/VehicleInstall/Tree.js',
        ],
        desc: '车量报装',
        deps: ['Report']
    },
};


if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
