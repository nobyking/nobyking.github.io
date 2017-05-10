window.onload = function(){
var btn = document.getElementById('btn');
var red = document.getElementById('red');
var green = document.getElementById('green');
var blue = document.getElementById('blue');
var w200 = document.getElementById('w200');
var w300 = document.getElementById('w300');
var w400 = document.getElementById('w400');
var h200 = document.getElementById('h200');
var h300 = document.getElementById('h300');
var h400 = document.getElementById('h400');
var div1= document.getElementById('div1');
var setStyle= document.getElementById('setStyle');
var cancel= document.getElementById('cancel');
var enter= document.getElementById('enter');

btn.onclick = function(){
	setStyle.style.display = "block";	
}
	
red.onclick = function(){
		div1.style.background = '#f00';
}
green.onclick = function(){
	div1.style.background = '#0f0';
}
blue.onclick = function(){
	div1.style.background = '#00f';
}
w200.onclick = function(){
	div1.style.width ='200px';
}
w300.onclick =function(){
	div1.style.width = '300px';
}
w400.onclick = function(){
	div1.style.width = '400px';
}
h200.onclick = function(){
	div1.style.height = '200px';
}
h300.onclick = function(){
	div1.style.height = '300px';
}
h400.onclick = function(){
	div1.style.height = '400px';
}
cancel.onclick = function(){
	div1.style.background ='#f70';
	div1.style.width ='100px';
	div1.style.height ='100px';
	
}
enter.onclick = function(){
	setStyle.style.display = 'none';
}
}