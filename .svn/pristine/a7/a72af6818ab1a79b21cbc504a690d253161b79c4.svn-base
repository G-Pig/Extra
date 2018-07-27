/**
 * Created by yanghang on 2017/9/30.
 */


ES.SSOlogin = ES.Class.extend({

    oOption : {
        type:1,//0 账号登录 1账号+手机登录
        BgType: 0,//0 全屏背景 1宽屏背景 2左边图片
        wait:60,//短信验证等待时间
        otherLogonInfo :["qq","weibo","alipay","weixin"],
        logoPC :{
            logo:'/Asset/img/login/logo.png',
            logoTitle: '测试标题标题标题'
        },
        logoApp : '/Asset/img/login/app_logo.png',
        loginBg:{
            loginBgFull:"/Asset/img/login/login_bg_full.jpg",
            loginBgWide:"/Asset/img/login/login_bg_wide.png",
            loginBgPic:"/Asset/img/login/login_bg_pic.png",
            loginBgApp:"/Asset/img/login/login_bg_app.png",
        },
        footerTitle : '客服热线：4008-111-180</br>武汉依讯电子信息技术有限公司 &copy;版权所有'
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        //加载登录框登录类型
        this.loginType(this.oOption.type);

        //加载模式以及背景
        this.initUI(this.oOption.BgType);

        //加载第三方
        //暂时更改为.net写

        //简易响应式
        this.resizeApp();

        //事件
        this.initClick();

    },
    initClick:function(){
        var self =this;

        //选择类型
        $('ul.login-header li').on('click','a',function(){
            $('.login-in input').removeClass('err');
            $('.login-err').hide();
            $(this).parent().addClass('type-active').siblings().removeClass('type-active');
            var i = $(this).parent().index();
            if(i==0){
                $('.login-in>.loginInfo').show().siblings('.loginInfo-phone').hide();
            }else if(i==1){
                $('.login-in>.loginInfo-phone').show().siblings('.loginInfo').hide();
            }
        });

        //手机短信验证码
        $('.login-phone-code').on('click',function(){
            this._wait = this.oOption.wait;
            self._time($(this));
        });

        // TODO 登录操作
        $('.login-btn').on('click',function(){
            //  暂时只做失败验证
            var i =$('.type-active').index();
            // if(i == 0){
            //     $('.userName,.userPwd,.userCode').removeClass('err').addClass('err');
            //     loginErrorToast('用户名不存在');
            // }else if(i == 1){
            //     $('.userPhone,.userPhoneCode').removeClass('err').addClass('err');
            //     loginErrorToast('手机短信验证码不正确');
            // }
        })


    },
    loginType:function(type){
        if(n==0){
            $('.login-box> p.login-header').show().siblings('ul').hide();
        }else if(n==1){
            $('.login-box> ul.login-header').show().siblings('p').hide();
        }
    },
    initUI:function(bt){

        this.bg = $('#login-bg');
        this.Logo = $('#logo-pic');
        this.LogoTitle = $('#logo-title');
        this.footer = $('.login-footer>p');


        var _class,url;
        switch (bt){
            case 0:
                _class ='login-bg-full';
                url = this.oOption.loginBg.loginBgFull;
                this.Logo.attr('src',this.oOption.logoPC.logo);
                this.LogoTitle.html(this.oOption.logoPC.logoTitle);
                break;
            case 1:
                _class ='login-bg-wide';
                url = this.oOption.loginBg.loginBgWide;
                $('.login-box').css('right','10%');
                this.Logo.attr('src',this.oOption.logoPC.logo);
                this.LogoTitle.html(this.oOption.logoPC.logoTitle);
                break;
            case 2:
                _class ='login-bg-pic';
                url = this.oOption.loginBg.loginBgPic;
                $('.login-box').css('right','10%');
                this.Logo.attr('src',this.oOption.logoPC.logo);
                this.LogoTitle.html(this.oOption.logoPC.logoTitle);
                break;
        }
        this.bg.addClass(_class);
        this.bg.css('background-image','url('+url+')');
        this.footer.html(this.oOption.footerTitle);

    },
    resizeApp:function(){
        var logoTemp = this.Logo.attr('src');
        var bgTemp = this.bg.css('background-image')

        this.AppChange(logoTemp,bgTemp);

        var a = null;
        var self = this;
        $(window).resize(function () {
            a && clearTimeout(a); a = setTimeout( self.AppChange(logoTemp,bgTemp), 100);
        })
    },
    AppChange:function(l,b){
        if ($(window).width() < 768) {
            this.Logo.attr('src', this.oOption.logoApp);
            this.bg.css('background-image', 'url(' + this.oOption.loginBg.loginBgApp + ')');
        } else {
            this.Logo.attr('src', l);
            this.bg.css('background-image', b);
        }
    },
    _time:function(o){
        var self = this;
        if (this._wait == 0) {
            o.removeAttr("disabled");
            o.html("获取动态码");
            o.css({'background-color':'#3598db','color':'#fff'});
            this._wait = this.oOption.wait;
        } else {
            o.attr("disabled", true);
            o.html("重新发送(" + this._wait + ")");
            o.css({'background-color':'#ddd','color':'#888'});
            this._wait--;
            setTimeout(function() {
                self._time(o)
            }, 1000)
        }
    }

});