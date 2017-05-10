;(function(window,$){

	var teamMap = [
		{
			"id" : 1,
			"name" : "麒零",
			"actors" : "麒零 - 陈学冬饰",
			"skins":[{"tab_shape":"rect","primary_color":"rgb(150,147,139)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_9371579716cfe13a344e4a2faf0cfb1b.png","primary_image_mode":"top_right","primary_inverse":false,"id":"154"}]
		},
		{
			"id" : 2,
			"name" : "鬼山莲泉",
			"actors" : "鬼山莲泉 - 范冰冰饰",
			"skins":[{"tab_shape":"rect","primary_color":"rgb(107,108,104)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_d29a74aa945a53d996e1e301909f6ec6.png","primary_image_mode":"top_right","primary_inverse":true,"id":"150"}]
		},
		{
			"id" : 3,
			"name" : "银尘",
			"actors" : "银尘 - 吴亦凡饰",
			"skins":[{"tab_shape":"rect","primary_color":"rgb(223,211,185)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_540159f1e476dac667f5cd545da1f657.png","primary_image_mode":"top_right","primary_inverse":false,"id":"151"}]
		},
		{
			"id" : 4,
			"name" : "幽冥",
			"actors" : "幽冥 - 陈伟霆饰",
			"skins":[{"tab_shape":"rect","primary_color":"rgb(98,102,94)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_584e7580660502f8bb789ba7ec428865.png","primary_image_mode":"top_right","primary_inverse":true,"id":"155"}]
		},
		{
			"id" : 5,
			"name" : "神音",
			"actors" : "神音 - 杨幂饰",
			"skins":[{"tab_shape":"rect","primary_color":"rgb(184,170,150)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_b7e323f8237083120409f808a048f4f4.png","primary_image_mode":"top_right","primary_inverse":false,"id":"152"}]
		},
		{
			"id" : 6,
			"name" : "苍白少年",
			"actors" : "苍白少年 - 王源饰",
			"skins":[{"tab_shape":"rect","primary_color":"rgb(133,126,116)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_633d29445334712994d09b82dfc0a3e9.png","primary_image_mode":"top_right","primary_inverse":true,"id":"153"}]
		}
	];

	function switchSkin(_id) {
		var obj = {
			'skins': teamMap[_id].skins
		};
		$('[data-id="' + teamMap[_id].id + '"]').removeClass('nocur').addClass('current').siblings().removeClass('current').addClass('nocur');
		try {
			chrome.prefs.setStringPref('Skin.Detail', JSON.stringify(obj));
		}
		catch (e) {}
	}



	function buildSkinHTML(arr) {
		var htmlStr = '<ul>';
		if (typeof arr === 'string' || !arr || !arr.length) {
			return
		}
		for (var i = 0; i < arr.length; i++) {
			htmlStr += '<li data-id="'+ arr[i].id +'" data-skin="' + arr[i].name + '" class="skin-' + arr[i].id + '">\
						<div class="skin-black"></div>\
						<div class="skin-pic" data-skinid="'+ arr[i].id +'"></div>\
						<div class="skin-info">\
						<span class="skin-actors">'+ arr[i].actors +'</span>\
						</div>\
						</li>';
		}
		htmlStr += '</ul>';
		$('.skins').html(htmlStr);

		// 判断皮肤
		try {
			chrome.prefs.getStringPref('Skin.Detail', function (data) {
				var obj = JSON.parse(data);
				for (var key in teamMap) {
					if (obj.skins[0].id == teamMap[key].skins[0].id) {
						$('[data-id="' + (parseInt(key) + 1) + '"]').removeClass('nocur').addClass('current').siblings().removeClass('current').addClass('nocur');
						break;
					}
				}
			})
		}
		catch (e) {}
	}

	buildSkinHTML(teamMap);

	$('.skins').on('click', '.skin-pic', function (e) {
		if(!api.isQQBrowser()){
			// 非QQ浏览器弹框
			QB_JUEJI.dialog.show(QB_JUEJI.tips['8']());
			return;
		}
		//判断QQ浏览器版本
		try{
			var version = window.external.getVersion().split('.');
			if(version[0] < 9) {
				QB_JUEJI.dialog.show(QB_JUEJI.tips['7']());
				return;
			}
			if(version[1] < 4) {
				QB_JUEJI.dialog.show(QB_JUEJI.tips['7']());
				return;
			}
		} catch (e) {
			QB_JUEJI.dialog.show(QB_JUEJI.tips['7']());
			return;
		}
		var id = $(this).data('skinid');
		switchSkin(id-1);
		api.report('BROWSER.ACTIVITY.JUEJI.SKIN_' + id);
	})

})(window,jQuery);