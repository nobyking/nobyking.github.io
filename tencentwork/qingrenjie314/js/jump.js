/**
 * Created by v_zmengren on 2015/3/9.
 */
var isIpad = (window.navigator.platform.toLowerCase().indexOf("ipad") > -1);
if(isIpad){
    var _PathName = location.pathname;
    var _PathSearch = location.search;
    var _Href = "http://lover.browser.qq.com/ipad";
    location.href = _Href + _PathName + _PathSearch;
}