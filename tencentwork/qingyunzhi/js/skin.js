;(function(window,$){

	var lsKey = 'qyz_vote';
	var lsKey_cache = 'qyz_skin_cache';
	var teamMap = [
		{
			"id" : 1,
			"name" : "张小凡",
			"actors" : "李易峰",
			"skins":[{"id":"133","tab_shape":"chrome","primary_color":"rgb(157,217,240)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_00d71b2419daa7f7a4cb8f71a329761f.png","primary_image_mode":"top_right","primary_inverse":false,"newtab_image_mode":"top_left"}]
		},
		{
			"id" : 2,
			"name" : "鬼厉",
			"actors" : "李易峰",
			"skins":[{"id":"134","tab_shape":"chrome","primary_color":"rgb(3,8,17)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_fdf233baf061849412d94d717f03e262.png","primary_image_mode":"top_right","primary_inverse":true,"newtab_image_mode":"top_right"}]
		},
		{
			"id" : 3,
			"name" : "碧瑶",
			"actors" : "赵丽颖",
			"skins":[{"id":"135","tab_shape":"chrome","primary_color":"rgb(144,227,226)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_8dbfff669534c290fb9aab83ddbcb909.png","primary_image_mode":"top_right","primary_inverse":false,"newtab_image_mode":"top_right"}]
		},
		{
			"id" : 4,
			"name" : "少年张小凡",
			"actors" : "王&nbsp;&nbsp;源",
			"skins":[{"id":"136","tab_shape":"chrome","primary_color":"rgb(157,217,240)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_289ebd4a2e23ddd8712e684f94c6bfdc.png","primary_image_mode":"top_right","primary_inverse":false,"newtab_image_mode":"top_left"}]
		},
		{
			"id" : 5,
			"name" : "少年林惊羽",
			"actors" : "王俊凯",
			"skins":[{"id":"137","tab_shape":"chrome","primary_color":"rgb(157,217,241)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_a5984364f4049c50eb4a02061f7a88a7.png","primary_image_mode":"top_right","primary_inverse":false,"newtab_image_mode":"top_right"}]
		},
		{
			"id" : 6,
			"name" : "小七",
			"actors" : "易烊千玺",
			"skins":[{"id":"138","tab_shape":"chrome","primary_color":"rgb(157,217,242)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/upload_4203ba5b70646112a5fb0397f8267558.png","primary_image_mode":"top_right","primary_inverse":false,"newtab_image_mode":"top_right"}]
		}
	];
	jQuery.support.cors = true;

	function switchSkin(_id) {
		var obj = {
			'skins': teamMap[_id].skins
		};
		$('[data-skin="' + teamMap[_id].name + '"]').removeClass('nocur').addClass('current').siblings().removeClass('current').addClass('nocur');
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
			htmlStr += '<li data-id="'+ arr[i].id +'" data-skin="' + arr[i].name + '" class="skin-0' + arr[i].id + '">';
			htmlStr += '<div class="skin-name">' + arr[i].name + '</div>';
			htmlStr += '<div class="skin-pic" data-skinid="'+ arr[i].id +'"></div>';
			htmlStr += '<div class="skin-info">';
			htmlStr += '<i class="icon"></i>';
			htmlStr += '<span class="skin-actors">'+ arr[i].actors +'</span>';
			htmlStr += '<div class="skin-rate-info">';
			htmlStr += '<div class="skin-total"></div>';
			htmlStr += '<div class="skin-bar">';
			htmlStr += '<div class="skin-get"></div>';
			htmlStr += '<div class="skin-rate"></div>';
			htmlStr += '</div>';
			htmlStr += '</div>';
			htmlStr += '<span class="skin-number">0</span>';
			htmlStr += '<div class="add-vote"></div>';
			htmlStr += '</div>';
			htmlStr += '</li>';
		}
		htmlStr += '</ul>';
		$('#offset-1 .skins').html(htmlStr);

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
	$('#offset-1').on('click', '.skin-pic', function (e) {
		if(!api.isQQBrowser()){
			//TODO 非QQ浏览器弹框
			QB_QINGYUN.dialog.show(QB_QINGYUN.tips['8']());
			return;
		}
		var id = $(this).data('skinid');
		switchSkin(id-1);
		QB_QINGYUN.page.vote(id);
	})

})(window,jQuery);