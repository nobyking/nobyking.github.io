;(function($){
    var QB_URL = 'https://itunes.apple.com/app/apple-store/id426097375?pt=69276&ct=xingmanjiang&mt=8'
    var QB_INSTALLED = false   // QB是否安装
        // 是否在QB内打开
   QB_INSTALLED = (function (){
        var useragent = window.navigator.userAgent;
        if(useragent.toString().indexOf("MQQBrowser") < 0){
            return false;
         }
            return true;
    })()
                //妖怪名单,王牌御史,据说我是王的女儿,妖精种植手册,妖神记,狐妖小红娘,通灵妃 ,女屌丝的爱情,我的霸道萝莉,中国惊奇先生,女主播攻略,王牌校草
   var cid_url = [521825,519855,545099,535731,533395,518333,540627,491608,542976,511915,543718,542724]
   var comics = document.querySelectorAll('.middle_6 .comic')
   for(var i = 0 ;i < comics.length;i++){
        if(!QB_INSTALLED){
          comics[i].href = QB_URL
        }else{
          comics[i].href = 'qb://cartoon?cid=' + cid_url[i]
        }
     }
})(jQuery)