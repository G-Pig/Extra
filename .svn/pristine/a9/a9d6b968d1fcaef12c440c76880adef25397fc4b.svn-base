/**
 * Created by liulin on 2017/6/1.
 */


ES.CloudMap.LineTreePanel = ES.CloudMap.BaseTreePanel.extend({

    initUI: function () {

        ES.CloudMap.BaseTreePanel.prototype.initUI.call(this);

        $('input[type="checkbox"]').uCheck();//这是统一写法
        $('input[type="checkbox"].ec-ucheck-checkbox').uCheck();//这是根据class调用

        var self = this;
        $('#Ctrl').bind('change', function (oData) {

            if ($(this).is(':checked')) {
                ES.Util.reqData({data:{CloudType: 2},url: '/Line/GetCtrlInfo'}, function (oData) {

                    self._oParent.fire('ES:CloudMap.DrawCtrlLayer', {aoData: oData.rtnData});

                }, this);
            } else {
                self._oParent.fire('ES:CloudMap.ClearCtrlLayer');
            }

        });

        $('#CityCtrl').bind('change', function (oData) {

            if ($(this).is(':checked')) {
                ES.Util.reqData({data:{CloudType: 3}, url: '/Line/GetCtrlInfo'}, function (oData) {

                    self._oParent.fire('ES:CloudMap.DrawCityCtrlLayer', {aoData: oData.rtnData});

                }, this);
            } else {
                self._oParent.fire('ES:CloudMap.ClearCityCtrlLayer');
            }
        });
    },

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white ex-maptool-property ec-padding-0">' +
    '   <div class="ex-layout-sider ex-theme-tree ec-fl" style = "width:280px">' +
    '       <h3 class="ex-theme-sider-title">' +
    '           <i class="ec-icon-sitemap"></i>&nbsp;{cTitle}' +
    '           <label for="Ctrl" class="ec-margin-left ec-checkbox-inline ec-success">' +
    '               <input type="checkbox" id="Ctrl" name="form-checkbox" class="ec-ucheck-checkbox">国控点' +
    '           </label>' +
    '           <label for="CityCtrl" class="ec-checkbox-inline ec-success">' +
    '               <input type="checkbox" id="CityCtrl" name="form-checkbox2" class="ec-ucheck-checkbox">市控点' +
    '           </label>' +

    '       </h3>' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字"> </input>' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-struckbox-content" style="height:350px;"></div>' +
    '   </div>' +
    '</div>',
});
