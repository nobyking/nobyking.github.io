/**
 * Created by v_zmengren on 2015/3/9.
 */
var isIpad = (window.navigator.platform.toLowerCase().indexOf("ipad") > -1);
if(!isIpad){
    var _PathName = location.pathname.replace(/\/ipad/,"");
    var _PathSearch = location.search;
    var _Href = "http://lover.browser.qq.com";
    location.href = _Href + _PathName + _PathSearch;
}