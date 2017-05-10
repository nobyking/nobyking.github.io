(function (window,$) {
	try {
		document.domain = 'qq.com';
	} catch(e) {
	}


	//判断是否已经加载过
	if(typeof window.Adtag == "undefined"){
		$.getScript("http://imgcache.qq.com/club/portal_new/js/adtag.js");
	}

	/**
	 * 导航模块
	 * @requires jQuery QV
	 * @example Nav.run();
	 */
	//基本参数、常量
	var COOKIE_INIT_ARG = {domain:'vip.qq.com',path:'/',expires:24*60*60};
	var m_temp = {
		notLogin: '您还没登录，请<a href="#" class="bt_login">登录</a>',
		isLogin: '<span class="user_pic"><img src="{avatar}" width="30" height="30" ></span><span class="user_nick" title="欢迎">{nick}</span><a class="mod_st_logout" href="#" title="注销">【注销】</a>'
	};

	//填充用户信息
	var _fillUserInfo = function(nick, uin){
		var _arHtml = [];
		var _data = {};
		if(nick){
			_data.nick = qv.string.encodeHTML(nick);
		}
		if(uin){
			_data.avatar = "http://q4.qlogo.cn/g?b=qq&nk=" + uin + "&s=40";
		}
		if(!qq.login.getUin()){
			_arHtml.push(m_temp.notLogin);
		}else{
			_arHtml.push(qv.string.format(m_temp.isLogin, _data));
		}
		$('#navUserInfo').html(_arHtml.join(''));
		//登录
		$('.bt_login').click(function(e) {
			e.preventDefault();
			qq.login.open(null, {appid: 8000201});
		});

		//退出
		$('.mod_st_logout').click(function(e) {
			e.preventDefault();
			qq.login.logout();
		});
		qq.login.trigger('navrendered');

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
				_fillUserInfo(_nick, _uin);
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

						_fillUserInfo(data.nickname, qq.login.getUin());
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
			_fillUserInfo();
		});

		if (qq.login.getUin()) {
			qq.login.trigger('login');
		}else{
			_fillUserInfo();
		}
	};

	$(function(){
		//填充头部
		_setLogin();
	})
})(window,jQuery);