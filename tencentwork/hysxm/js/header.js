
try {
	document.domain = 'qq.com';
} catch(e) {
}


var write_global_nav = function (){
	var header = '\
		<div class="mod_gst">\
			<div class="mod_gst_main">\
				<a id="logo-btn" href="http://tq.qq.com?ADTAG=hysxm&adtag=hysxm" title="QQ浏览器特权中心" target="_blank"></a>\
				<a id="tq" href="http://tq.qq.com?ADTAG=hysxm&adtag=hysxm" target="_blank"></a>\
				<div class="mod_gst_userinfo" id="navUserInfo"></div>\
                <a id="header-qb" title="QQ浏览器下载" href="http://dldir1.qq.com/invc/tt/QQBrowser_Setup_ylhz.exe" onclick="report(\'BROWSER.ACTIVITY.HYSXM.QBDOWNLOADCLICK\');"></a>\
			</div>\
		</div>';
	document.write(header);
	//fill the data
	Nav.run();
};


/**
 * @设置页面底部版权
 */
var write_global_footer = function(){
	document.write('<p><a target="_blank" href="http://tq.qq.com/qbrcenter/index.html?ADTAG=hysxm&adtag=hysxm">QQ浏览器特权中心</a>&nbsp;|&nbsp;<a target="_blank" href="http://xiaoyuan.qq.com/pioneer/surl2qzone.html?ADTAG=hysxm&adtag=hysxm">腾讯移动互联网先锋队</a>&nbsp;|&nbsp;<a target="_blank" href="hhttp://oto.qq.com/g/qingliri/index.html?ADTAG=hysxm&adtag=hysxm">清理日免费活动</a>/p><p>Copyright &copy; 1998-'+(new Date()).getFullYear()+' Tencent. All Rights Reserved.</p><p>腾讯公司&nbsp;<a target="_blank" href="http://www.tencent.com/zh-cn/le/copyrightstatement.shtml">版权所有</a></p>');
};

//添加了游戏码等内容
var write_global_footer2 = function(t, width){
	write_global_footer();
	document.write('</div></div>');
};



Nav = (function ($) {

	//基本参数、常量
	var NUM_ONE_COLUMN = 10;
	var COOKIE_INIT_ARG = {domain:'vip.qq.com',path:'/',expires:24*60*60};
	var m_navData;
	var m_temp = {
		speaker : '<li><a href="{url}" target="_blank">{title}</a></li>',
		gmDivSt : '<div class="{css}">',
		gmDivEnd: '</div>',
		gmType : '<h4 class="gst_poptt"><b>{type}</b>({num})</h4>',
		gmUlSt : '<ul class="gst_popul">',
		gmUlEnd: '</ul>',
		games : '<li><a class="{label}" href="{href}" target="_blank">{name}</a></li>',
		gmMore: '<li><a href="http://vip.qq.com" target="_blank" class="more">更多</a></li>',
		notLogin: '您还未登录，请<a href="#" class="bt_login">登录</a>',
		isLogin: '<span class="user_nick" title="欢迎">欢迎您，{nick}</span><a class="mod_st_logout" href="#" title="注销">【注销】</a>',
		vip: ''
	};

	//拉取数据，填充导航内容
	var _run = function(){
		_setLogin();
	};


	//设置登录
	var _setLogin = function(){

		qq.login.init({
			loginMaskShow  : true,
			loginMaskStyle : {'z-index' : 1000},
			loginUIStyle   : {'z-index' : 1001},
			event: {
				login: function() { return false; },
				logout: function() { return false; }
			}
		});

		qq.login.bind('login', function() {
			var _uin = qv.cookie.get('_uin');
			var _nick = qv.cookie.get('_nick');

			if (_uin == qq.login.getUin() && _nick) {
				var isVip =  ~~qv.cookie.get('isVip');
				_fillUserInfo(_nick,isVip);
			} else {
				var options = {
					url: 'http://pf.vip.qq.com/common/yii.php',
					dataType: 'jsonp',
					data: {
						r: 'user/info',
						g_tk: qq.security.getCSRFToken()
					},
					success: function(data, textStatus, jqXHR) {
						qv.cookie.set('_uin', qq.login.getUin(), COOKIE_INIT_ARG);
						qv.cookie.set('_nick', data.nickname, COOKIE_INIT_ARG);
						qv.cookie.set('isVip', Number(data.isVip), COOKIE_INIT_ARG);
						//alert(qv.cookie.get('_nick'));
						_fillUserInfo(data.nickname, data.isVip);
						if(data.nickname === undefined){
							qq.login.logout();
						}
					}
				};

				$.ajax(options);
			}
		});

		qq.login.bind('logout', function() {
			qv.cookie.clear('_uin');
			qv.cookie.clear('_nick');
			qv.cookie.clear('isVip') ;
			_fillUserInfo();
		});

		if (qq.login.getUin()) {
			qq.login.trigger('login');
		}else{
			_fillUserInfo();
		}
	};
	var formatAid = function(aid){
		if(window.Adtag){
			return Adtag.getAidWithAdtag(aid);
		}
		return aid;
	};
	//填充用户信息
	var _fillUserInfo = function(nick, isVip){
		var _arHtml = [];
		var _data = {
			//如果有AID，则使用AID的配置，否则使用默认支付地址
			paymentUrl: typeof(AID) === 'undefined' ?  formatAid('http://pay.qq.com/qqvip/index.shtml?aid='+(isVip ? 'vip.pingtai.act.nav.xufei' : 'vip.pingtai.act.nav.clubopen') ) : AID.getUrl() ,
			css: isVip ? 'mod_xf' : 'link_be_vip',
			word: isVip ? '续费会员' : '开通会员'
		}
		if(nick){
			_data.nick = qv.string.encodeHTML(nick);
		}
		if(!qq.login.getUin()){
			_arHtml.push(m_temp.notLogin);
			_arHtml.push(qv.string.format(m_temp.vip, _data));
		}else{
			_arHtml.push(qv.string.format(m_temp.isLogin, _data));
			_arHtml.push(qv.string.format(m_temp.vip, _data));
		}
		$('#navUserInfo').html(_arHtml.join(''));

		//登录
		$('.bt_login').click(function(e) {
			e.preventDefault();
			qq.login.open(null, {appid: 8000201});
			var loginTop = jQuery(window).scrollTop();
			setTimeout(function(){
				window.scroll(0,loginTop);
			},100);
		});

		//退出
		$('.mod_st_logout').click(function(e) {
			e.preventDefault();
			qq.login.logout();
		});
		qq.login.trigger('navrendered');

	};

	//外部接口
	return {
		run : _run
	};


})(jQuery);
