//上报
function report(hottagValue) {
	window.setTimeout(function() {
		pgvSendClick({
			hottag: hottagValue
		});
	}, 100);
	wsdReport(90247, 7, 207, 0, hottagValue, '', '');
};
if (typeof(pgvMain) == 'function') {
	pgvMain("pathtrace", {
		pathStart: true,
		tagParamName: "ADTAG",
		useRefUrl: true,
		override: true,
		careSameDomainRef: false
	});
};



// QQ浏览器IE核
var is_qb_ie = (window.external && window.external.extension && /QQBrowser/i.test(navigator.userAgent)) ? true : false;
// QQ浏览器chrometab
var is_qb_ct = (window.getExtension && /Chrome.*QQBrowser/i.test(navigator.userAgent)) ? true : false;

var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';

function getQBVersion() {
	var raw = navigator.userAgent.match(/QQBrowser\/([0-9]+\.[0-9]+)\./);
	return raw ? parseFloat(raw[1], 10) : false;
};

function wsdReport(key, int1, int2, int3, string1, string2, string3) {
	if (is_qb_ct) { // QB8 chrometab
		try {
			extension.sendMessage(platform_extension_id, {
				serviceId: "datareport.set2",
				args: [key, int1, int2, int3, string1, string2, string3]
			});
		} catch (e) {}
	} else if (is_qb_ie) { // QB8 IE
		try {
			window.external.extension.datareport.set2(key, int1, int2, int3, string1, string2, string3);
		} catch (e) {}
	} else if (getQBVersion() > 9) { // QB9
		try {
			window.external.dataReport(8107, key, 0, int1, int2, int3, string1, string2, string3);
		} catch (e) {}
	}
};


function setClassforPlat(){
    var platform = navigator.platform;
    var device = true;	
    if(platform.indexOf('Mac')==0 || platform.indexOf('iPad') == 0){
    	device = true; 
    }else{
    	device = false;
    }
    return device;

};


report('kaixuetong.click');

(function($) {

	//浏览器不为qb9则弹窗提示
	var is_Qb9 = getVersion();
	//mac && ipad用户
	var is_mac =  setClassforPlat();

	$('.applist a').on('click', function(e) {
		var id = $(this).attr('data-id');
		report("kaixuetong." + id + '.click');
		if (is_Qb9) {
			return true;
		}
		$('.masklayer').show();
		if(is_mac){
			$('#pop_mac').show();			
		}else{
			$('#pop_pc').show();	
		};

		return false;
	});

	$('.masklayer,.close').on('click', function() {
		$('.pop_layer').hide();
		$('.masklayer').hide();
		return false;
	});


	$('#QB_download').on('click', function() {
		report("kaixuetong.QBdownload.click");
	});


	function getVersion() {
		var agent = navigator.userAgent.match(/QQBrowser\/9\./);
		return agent ? true : false;
	};

})(jQuery)