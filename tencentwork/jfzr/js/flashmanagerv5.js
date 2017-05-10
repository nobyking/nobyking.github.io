/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
	is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/
//活动页面需要显示的抽奖Flash
//flash -> js:
//1、clickRoll 点击滚动的事件
//2、completeRoll 完成以后的回调函数

//js -> flash:
//1、_obj.stopRoll(num); 停止的方法

//document.body.style.overflowX="hidden";
function flashChecker(){var hasFlash=0;　　　　//是否安装了flash
var flashVersion=0;　　//flash版本
if(document.all)
{
	var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash'); 
		if(swf) {
		hasFlash=1;
		VSwf=swf.GetVariable("$version");
		flashVersion=parseInt(VSwf.split(" ")[1].split(",")[0]); 
		}
	}else{
	if (navigator.plugins && navigator.plugins.length > 0)
	{
		var swf=navigator.plugins["Shockwave Flash"];
		if (swf)
			{
		hasFlash=1;
			   var words = swf.description.split(" ");
			   for (var i = 0; i < words.length; ++i)
		{   

			 if (isNaN(parseInt(words[i]))) continue;
				 flashVersion = parseInt(words[i]);
		}
		}
	}
	}
	return {f:hasFlash,v:flashVersion};
}
 var jsReady=false;
 var swfReady=false;
 function pageInit(){jsReady=true;} 
 onload=function(){ pageInit();} 
function isReady(){return jsReady;}
var $id = function(o){return document.getElementById(o);};
var cid = function(fid, id){var _div = document.createElement('div');_div.id = id;$id(fid).appendChild(_div);return _div;};
var swfstr=function(id,url,width,height,basev){
		 var obj='';
			obj+='<object id="'+id+'" name="'+id+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+width+'" height="'+height+'">';
			obj+='<param name="movie" value="'+url+'" />';
			obj+='<param name="quality" value="high" />';
			obj+='<param name="wmode" value="transparent" />';
			obj+='<param name="base" value="'+basev+'" />';
			obj+='<param name="allowScriptAccess" value="always" />';
			obj+='<embed id="'+id+'_ff" name="'+id+'_ff" base="'+basev+'" src="'+ url +'" quality="high" wmode="transparent" width="'+ width +'" height="'+ height +'" allowfullscreen="true" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
			 obj += '</object>';
			return obj;
		}
function insertSwf(elm,url,width,height,base){
if(!$id(elm))return;
var fls=flashChecker();
	var s="";
	var id=elm+"_swf";
	if(fls.f) {
	if(fls.v>=10){
		if(!base)base="";
		$id(elm).innerHTML=swfstr(id,url,width,height,base);
				//document.write("当前flash版本为: "+fls.v+".0");
		}
	}
	//else document.write("您没有安装flash");

}
var FlashManager = function(opt){
	var _this = this;
	this.option = {
		'flashUrl' : '', //flash地址
		'contentId' : '', //替换flash的容器
		'width' : '100%', //flash的宽度
		'height' : '100%', //flash的高度
		'onClickRollEvent' : null, //点击的事件
		'onCompleteRollEvent' : null, //完成后的事件
		'base':'.'
	};
	 //是否初始化完毕
	this.config = {'isInited' : false };
	this.init = function(){
		var flashvars="&testModel=1"
		for(var i in opt){_this.option[i] = opt[i];if(typeof(opt[i])!='function')flashvars+=("&"+i+"="+opt[i]);}
		_this.option.swfid=_this.option.contentId + '_content'+ '_swf'
		flashvars+=("&flag="+_this.option.swfid);
		if(!_this.option.flashUrl){alert('没有设置flash地址。');return;}
		if(!_this.option.contentId){alert('没有设置页面容器。');return;}
		cid(_this.option.contentId, _this.option.contentId + "_content");
		$id(_this.option.contentId + '_content').innerHTML='<div id="noflash" ><p>请下载最新的Flash插件<a href="http://get.adobe.com/flashplayer/" target="_blank" title="下载最新的Flash插件"><img src="http://ossweb-img.qq.com/images/xy/web200907/images/flashLogo.gif" align="absmiddle" target="_blank" /></a></p> </div>';
		//alert("s"+_this.option.height)
	//	$id(_this.option.contentId + '_content').innerHTML=swfstr({url:_this.option.flashUrl+'?v=' + Math.random()+flashvars,fid: _this.option.swfid+"_swf",width:_this.option.width,height:_this.option.height})
		insertSwf(_this.option.contentId + '_content',_this.option.flashUrl+'?v=' + Math.random()+flashvars,_this.option.width,_this.option.height,_this.option.base)
		{//初始化flash里的方法
		
			//1 swf Ready
			window['setSwfIsReady' + _this.objectID() ]=function(){
				window['swfReady'+_this.option.contendId]=true;
				_this.config.isInited=true;
			}
			//2、点击SWF的方法
			window['SWFCallJSToStart' +_this.objectID()] = function(num){
			//alert("CallJS")
				if(typeof(_this.option.onClickRollEvent) == 'function'){setTimeout(function(){_this.option.onClickRollEvent(num)},50);}
			};
			//3回调函数。
			window['SWFPlayComplete' +_this.objectID()] = function(num){
				if(typeof(_this.option.onCompleteRollEvent) == 'function'){
						setTimeout(function(){_this.option.onCompleteRollEvent(num)},100);
					}
				};
				//alert(this.objectID())
		}
	};
	//取得该flash对象
	this.getFlashInstance = function(){
	//alert($id(_this.option.swfid+ '_swf'))
	 if (navigator.appName.indexOf("Microsoft") != -1) {
	   return window[_this.option.swfid];
	  } else {
	   return document[_this.option.swfid+"_ff"];
	  }
	};
	this.objectID=function(){
		return this.getFlashInstance().id;
	}
	
	//通知flash 停止播放抽奖动画 并传中奖值给flash  并等待flash播放完
	this.stopRoll = function(num){
		//延时执行
			var _obj = _this.getFlashInstance();
			if(typeof(_obj) == 'object' && typeof(_obj.JScallSWFtoRun) == 'function'){
				_obj.JScallSWFtoRun(num);
				return;
			}
			window['FlashLoadTimes_' + _this.option.contentId] = 0;
			window['FlashLoadFlag_' + _this.option.contentId] = window.setInterval(function(){
				if(window['FlashLoadTimes_' + _this.option.contentId] > 100){//如果10s钟还没有加载到，则自动弹出提示即可。
					clearInterval(window['FlashLoadFlag_' + _this.option.contentId]);
					window['FlashLoadFlag_' + _this.option.contentId] = undefined;
					throw 'no转盘没有转动';
					return;
				}							  
				if(typeof(_obj.JScallSWFtoRun) == 'function'){
					clearInterval(window['FlashLoadFlag_' + _this.option.contentId]);
					window['FlashLoadFlag_' + _this.option.contentId] = undefined;
					_obj.JScallSWFtoRun(num);
					return;
				}
				window['FlashLoadTimes_' + _this.option.contentId]++;
			}, 10);
		
	};
	_this.init();
};

//取得该实例化对象。
FlashManager.init = function(opt){return new FlashManager(opt);};
/*  |xGv00|965243ca9712ab56db7b76c16a4adc17 */