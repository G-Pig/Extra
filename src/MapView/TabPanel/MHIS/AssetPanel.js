/**
 * 资产图层 显示
 *
 * Created by Administrator on 2017/4/16.
 */



ES.MapView.TabPanel.AssetPanel = ES.MapView.TabPanel.BasePanel.extend({
   cHTML:
   '<div class="ex-layout-carlist">' +
   '       <div class="ex-layout-carlist-title">' +
   '           <h4 class="ec-align-left">图层选择</h4>' +
   '           <a href="javascript:;" class="ex-icon-turn on" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a>' +
   '           <a href="javascript:;" class="ex-icon-turn off"><i class="ec-icon-arrow-circle-left"></i></a>' +
   '       </div>' +
   '       <div class="ex-layout-carlist-wrap">' +
   '           <div class="ex-layout-struckbox-search">' +
   '               <div class="ec-input-group">' +
   '                   <input type="text" class="ec-form-field  cls-search-text" placeholder="请输入名称">' +
   '                   <span class="ec-input-group-btn">' +
   '                       <button class="ec-btn ec-btn-secondary ec-btn-xs  cls-search-btn" type="button"><span class="ec-icon-search"></span> </button>' +
   '                   </span>' +
   '               </div>' +
   '           </div>' +

   '           <div class="ex-layout-struckbox-content" id="TreeListContent"></div>' +

   '       </div>' +
   '</div>',

   // 车辆列表构造函数
   initialize: function (oParent, oOption, oTOption) {

      ES.MapView.TabPanel.BasePanel.prototype.initialize.call(this,oParent, oOption, oTOption);

      // 图层列表，用于管理图层
      this.aoLayer ={};

      //this._oMap = this._oParent._oParent.getMap();
   },

   // 点击显示 树列表显示内容
   selectCallBack: function (e, oThisNode) {

      ES.Util.reqData({
         url: '/MapView/GetAssetByType',
         data: {icon: oThisNode.node.data.icon, id: oThisNode.node.data.id}
      }, this.checkCallBackHandler, this);
   },

   // 显示数据到界面
   checkCallBackHandler: function (oTemp) {
      // 图层不为空就显示
      var oData = oTemp.rtnData;
      this._oMap = this._oPage.getMap();
      if (!this.aoLayer[oData.id]) {
         if(oData.shapeType ==="点")
         {
            this.aoLayer[oData.id] = new ES.MapView.AssetPosLayer(this,{});
         }
         else
         {
            this.aoLayer[oData.id] =new ES.MapView.AssetLineLayer(this,{})
         }
         this.aoLayer[oData.id].drawSites(oData);

      }
   },
});