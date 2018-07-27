/**
 * Created by liulin on 2017/8/31.
 */

//页面的布局
ES.Muck.Layout = ES.Muck.BaseLayout.extend({
    cHTML:
    '<div class="ex-layout-sider">' +
    '   <a class="title">' +
    '       <h3>总出土量</h3> ' +
    '       <p>总出土量：5027 (单位：立方)</p>' +
    '   </a>' +
    '   <div class="ex-layout-struckbox-search">' +
    '       <table id="outMount"></table>'+
    '   </div>' +
    '   <div class="ex-layout-struckbox-content"  ></div>' +
    '</div>' +

    '<div class="ex-layout-content">' +
    '   <form data-reactroot="" class="ec-form ec-form-horizontal ex-layout-form-search ex-theme-form-search" id="formId" action="" target="MainFrame">' +
    '       <ul class="ec-avg-sm-3 ec-avg-md-4 ec-avg-lg-5">' +
    '           <li class="ec-form-group">' +
    '               <select id="AreaName">' +
    '               <option value="">武汉市</option>>' +
    '               <option value="">硚口区</option>>' +
    '               <option value="">武昌区</option>>' +
    '               <option value="">汉阳区</option>>' +
    '               </select>'+
    '               <span class="ec-title-span">弃土流向智能分析</span>'+
    '           </li>' +
    '           <li class="ec-form-group">' +
    '               <ul class="ex-layout-pop-tab-title ec-avg-sm-3">'+
    '                   <li>按日<span></span></li>'+
    '                   <li>月<span></span></li>'+
    '                   <li>年选择<span></span></li>'+
    '               </ul>'+

    // '               <label for="startDate" class="ec-u-sm-4 ec-form-label">上报时间：</label>' +
    // '               <div class="ec-u-sm-">' +
    // '                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    // '                   <input size="16" type="text" name="startDate" id="startDate" class="ec-form-field" onclick="" readonly>' +
    // '                   <span class="ec-input-group-label add-on">至</span>'+
    // '                   <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
    // '                   </div>' +
    // '               </div>' +
    '           </li>' +
    // '           <li class="ec-form-group">' +
    // '               <label for="startDate" class="ec-u-sm-4 ec-form-label">开始时间：</label>' +
    // '               <div class="ec-u-sm-8">' +
    // '                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    // '                   <input size="16" type="text" name="startDate" id="startDate" class="ec-form-field" onclick="" readonly>' +
    // '                   </div>' +
    // '               </div>' +
    // '           </li>' +
    // '           <li class="ec-form-group">' +
    // '               <label for="endDate" class="ec-u-sm-4 ec-form-label">结束时间：</label>' +
    // '               <div class="ec-u-sm-8">' +
    // '                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    // '                   <input size="16" type="text" name="endDate" id="endDate" class="ec-form-field" onclick="" readonly>' +
    // '                   </div>' +
    // '               </div>' +
    // '           </li>' +
    '       </ul>' +
    '   </form>' +
    '   <div id="MapView" style="width: 100%;"></div>' +
    '</div>'+
    '<div class="ex-layout-sider">' +
    '   <a class="title">' +
    '       <h3>总消纳量</h3> ' +
    '       <p>总消纳量：5027 (单位：立方)</p>' +
    '   </a>' +
    '   <div class="ex-layout-struckbox-search">' +
    '       <table id="outMount"></table>'+
    '   </div>' +
    '   <div class="ex-layout-struckbox-content"  ></div>' +
    // '</div>' +
    // '<div class="ex-layout-sider">' +
    // '   <h3 class="ex-theme-sider-title">' +
    // '       <i class="ec-icon-sitemap"></i>&nbsp;组织架构' +
    // '   </h3>' +
    // '   <div class="ex-layout-struckbox-search">' +
    // '       <div class="ec-input-group">' +
    // '           <input  type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">' +
    // '           <span class="ec-input-group-btn">' +
    // '               <button   class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    // '           </span>' +
    // '       </div>' +
    // '   </div>' +
    // '   <div class="ex-layout-struckbox-content"  ></div>' +
    '</div>'
});