var arr = [{id:1,name:'AJAX',pid:0},{id:2,name:'vue.js',pid:0},{id:3,name:'正则表达式',pid:0},{id:4,name:'Jquery',pid:0},{id:5,name:'html',pid:2},{id:6,name:'css',pid:2},{id:7,name:'img',pid:4},{id:8,name:'js',pid:4}];
var box = document.getElementsByClassName("box")[0],
	dls = box.getElementsByClassName("box_folder");
var as = document.getElementsByClassName("box_folder_check");
var m = arr.length;

var loadNum = document.getElementsByClassName("load_num")[0];
var tal = loadNum.previousElementSibling;

var newFolder = document.getElementsByClassName("newFolder")[0];
var delet = document.getElementsByClassName("delet")[0];
var rename = document.getElementsByClassName("rename")[0];
var checkAll = document.getElementsByClassName("body_right_bot_k")[0];
var checkTxt = document.getElementsByClassName("body_right_bot_text")[0];

var newFV = box.getElementsByClassName("box_folder_new");
var q = 0;
var on = true;
var don = true;

var copy = document.getElementById("copy");

var bodyH = document.getElementById("body");
var headerH = document.getElementsByTagName("header")[0];
bodyH.style.height = document.documentElement.clientHeight - headerH.offsetHeight + 'px';
box.style.height = document.documentElement.clientHeight - box.getBoundingClientRect().top + 'px';

window.onresize = function(){
	bodyH.style.height = document.documentElement.clientHeight - headerH.offsetHeight + 'px';
	box.style.height = document.documentElement.clientHeight - box.getBoundingClientRect().top + 'px';
}
 		
	//初始化
	window.onload = function(){
		location.hash = 'rank=0';
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].pid == 0){
				init(arr[i]);
				box.insertBefore(dls[dls.length-1],dls[0]);
			}
		}
		dowri();
		loadNum.innerHTML = '已全部加载，共'+dls.length+'个';
	}
	var dlMove = false;
	var posdl = {};
	var posdl2 = [];
	var dl_this = null;
	function init(n){
//		location.hash = 'rank='+n.pid;
		var dl = document.createElement("dl");
		var dt = document.createElement("dt");
		var dd = document.createElement("dd");
		var a = document.createElement("a");
		dt.innerHTML = '<a href="javascript:;"></a>';
		dd.innerHTML = '<a href="javascript:;" class="box_folder_new">'+n.name+'</a>';
		dd.IDS = n.id;
		a.href = 'javascript:;';
		a.className = 'box_folder_check';
		dl.className = 'box_folder fl';
		dl.num = n.id;
		dl.appendChild(dt);
		dl.appendChild(dd);
		dl.appendChild(a);
		box.appendChild(dl);
		dl.onOff = true;
		dl.onmouseover = function(){
			if(!this.onOff){
				return;
			}
			if(!a.onOff){
				a.style.backgroundImage = 'url(img/ycheck2.png)';
				if(switchs.index == 1){
					a.style.backgroundImage = 'url(img/checkbox_ico.png)';
				}
			}else{
				this.style.backgroundColor = '#f1f5fa';
				a.style.backgroundImage = 'url(img/ycheck.png)';
				a.style.display = 'block';
				if(switchs.index == 1){
					a.style.backgroundImage = 'none';
				}
			}
		}
		dl.onmouseout = function(){
			if(!this.onOff){
				return;
			}
			if(!a.onOff){
				a.style.backgroundImage = 'url(img/ycheck2.png)';
				if(switchs.index == 1){
					a.style.backgroundImage = 'url(img/checkbox_ico.png)';
				}
			}else{
				this.style.backgroundColor = '';
				this.style.borderColor = 'rgba(241,245,250,0)';
				a.style.display = '';
				if(switchs.index == 1){
					a.style.display = 'block';
					this.style.borderColor = 'rgba(242,246,253,1)';
				}
			}
		}
		dl.onOff = true;
		dl.ondblclick = function(){
			if(!this.onOff){
				return;
			}
			box.innerHTML = '';
			location.hash = 'rank='+(n.id);
			loadNum.innerHTML = '已全部加载，共'+(dls.length)+'个';
			var ddIn = dl.children[1].children[0].innerHTML;
			tal.children[1].innerHTML +='<span class="color_blue fl">></span><a class="fl" index="'+n.id+'">'+ddIn+'</a>';
			
			if(tal.children[1].children.length>2){
				tal.children[1].children[tal.children[1].children.length-3].className += ' color_blue';
				tal.children[1].children[tal.children[1].children.length-3].href = 'javascript:;';
			}
			if(switchs.index==1){
				checkTxt.innerHTML = '文件名';
			}
		}
		
		a.onOff = true;
		a.onclick = function(){
			if(!on){
				return;
			}
			if(this.onOff){
				dl.onOff = false;
				this.style.backgroundImage = 'url(img/ycheck2.png)';
				if(switchs.index == 1){
					this.style.backgroundImage = 'url(img/checkbox_ico.png)';
				}
				dl.style.backgroundColor = '#f1f5fa';
				dl.style.borderColor = 'rgba(144,195,253,1)';
				this.onOff =!this.onOff;
			}else{
				this.style.backgroundImage = 'url(img/ycheck.png)';
				if(switchs.index == 1){
					this.style.backgroundImage = 'none';
				}
				dl.style.borderColor = 'rgba(241,245,250,0)';
				checkAll.style.background = '';
				dl.onOff = true;
				this.onOff =!this.onOff
			}
//			newOn();
			allCheck();
		}
		a.onmousedown = function(ev){
			ev.cancelBubble = true;
		}
		a.ondblclick = function(ev){
			ev.cancelBubble = true;
		}
		dl.onmousedown = function(ev){
			dl_this = this;
			for (var i = 0; i < as.length; i++) {
				if(!as[i].onOff){
					posdl.x = ev.clientX;
					posdl.y = ev.clientY;
				}
			}
			pos2 = [];
			for(var i=0;i<as.length;i++){
				if(!as[i].onOff){
					posdl2.push({
						x:dls[i].getBoundingClientRect().left,
						y:dls[i].getBoundingClientRect().top,
						e:dls[i]
					})
				}
			}	
			ev.cancelBubble = true;
			ev.preventDefault();
			newOn();
//			allCheck();
			dlMove = true;
		}
	}
	//新建文件夹
	newFolder.onOff = true;
	newFolder.onclick = function(){
		if(!this.onOff){
			return;
		}
		this.onOff =!this.onOff;
		
		q = 0;
		var v =location.hash.split('=')[1];
		checkTxt.innerHTML = '全选';
			//console.log(del)
		for (var i = 0; i < dls.length; i++) {
			dls[i].style.backgroundColor = '';
			dls[i].style.borderColor = 'rgba(241,245,250,0)';
			as[i].style.display = '';
			as[i].onOff = true;
			if(switchs.index==1){
				dls[i].style.borderColor = 'rgba(242,246,253,1)';
				as[i].style.background = 'none';
				as[i].onOff = true;
			}
			dls[i].onOff = true;
		}
		checkAll.on = false;
		var j = {};
		m++;
		
		for (var i = 0; i < arr.length; i++) {
			if(m==arr[i].id){
				m = arr[i].id+1;
			}
		}
		
		j.id = m;
		j.pid = v;
//		j.name = '新建文件夹' + '('+(m-1)+')';
		arr.push(j);
		init(arr[arr.length-1]);
		
		//
		box.insertBefore(dls[dls.length-1],dls[0]);
		
		
		if(switchs.index == 1){
			switchs.onOff = true;
			switchs.onclick();
		}else{
			switchs.onOff = false;
			switchs.onclick();
		}
		son = false;
		don = false;
		inpName();
		allCheck();
		dowri();
		loadNum.innerHTML = '已全部加载，共'+(dls.length)+'个';
		
	}
	
	//重命名
	rename.onclick = function(){
		checkAll.on = false;
		son = false;
		if(q>1){
			return;
		}else if(q==1){
			for (var i = 0; i < dls.length; i++) {
				dls[i].onOff = false;
				on = false;
				don = false;
			}
		}

		inpName2();
//		console.log(arr);
	}
	
	//input命名函数
	function inpName(){
		var dls = box.getElementsByClassName("box_folder");
		var p = document.createElement("p");
		var inp = document.createElement("input");
		var a1 = document.createElement("a");
		var a2 = document.createElement("a");
		p.className = 'box_inp';
		inp.type = 'text';
		inp.className = 'text fl';
		inp.value = '新建文件夹';
		a1.className = 'fl true';
		a1.href = 'javascript:;';
		a2.className = 'fl false';
		a2.href = 'javascript:;';
		p.appendChild(inp);
		p.appendChild(a1);
		p.appendChild(a2);
		box.appendChild(p);
		
		for (var i = 0; i < dls.length; i++) {
			dls[i].onOff = false;
		}
			newFV[0].style.opacity = 0;
			p.style.left = dls[0].offsetLeft + 'px';
			p.style.top = dls[0].offsetHeight - 40 + 'px';
			if(switchs.index==1){
				p.style.left = dls[0].offsetLeft + 75 + 'px';
				p.style.top = '9px';
			}
			
			var v =location.hash.split('=')[1];
				var wj = ['新建文件夹'];
				for (var i = 0; i < 200; i++) {
					wj.push('新建文件夹('+(i+1)+')');
				}
				for (var i = 0; i < dls.length; i++) {
					for (var j = 0; j < wj.length; j++) {
						if(wj[j]==dls[i].children[1].children[0].innerHTML){
							console.log(wj[j],dls[i].children[1].children[0].innerHTML)
							wj.splice(j,1);
						}
					}
					inp.value = wj[0];
				}
			inp.select();
			
			a1.onclick = function(){
				for (var i = 0; i < as.length; i++) {
					if(dls[i].children[1].children[0].innerHTML == inp.value){
						alert('重复命名');
						return;
					}
				}
				for (var i = 0; i < dls.length; i++) {
					dls[i].onOff = true;
				}
				arr[arr.length-1].name = inp.value;
				newFV[0].innerHTML = inp.value;
				newFV[0].style.opacity = 1;
				box.removeChild(p);
				wj = ['新建文件夹'];
				newFolder.onOff = true;
				checkAll.on = true;
				son = true;
				don = true;
			}
			a2.onclick = function(){
				box.removeChild(dls[0]);
				box.removeChild(p);
				arr.splice(arr.length-1,1)
				m--;
				newFolder.onOff = true;
				for (var i = 0; i < as.length; i++) {
					as[i].onOff = true;
					dls[i].onOff = true;
				}
				loadNum.innerHTML = '已全部加载，共'+(dls.length)+'个';
				checkAll.on = true;
				son = true;
				don = true;
			}
			a1.onmousedown = a2.onmousedown = inp.onmousedown =  function(ev){
				ev.cancelBubble = true;
			}
	}
	
	//input命名函数2
	function inpName2(){
		var dls = box.getElementsByClassName("box_folder");
		var p = document.createElement("p");
		var inp = document.createElement("input");
		var a1 = document.createElement("a");
		var a2 = document.createElement("a");
		p.className = 'box_inp';
		inp.type = 'text';
		inp.className = 'text fl';
		inp.value = '新建文件夹';
		a1.className = 'fl true';
		a1.href = 'javascript:;';
		a2.className = 'fl false';
		a2.href = 'javascript:;';
		p.appendChild(inp);
		p.appendChild(a1);
		p.appendChild(a2);
		
			for (var i = 0; i < as.length; i++) {
				if(!as[i].onOff){
					p.style.left = 0;
					p.style.top = dls[i].offsetHeight - 40 + 'px';
					if(switchs.index==1){
						p.style.left = dls[0].offsetLeft + 75 + 'px';
						p.style.top = dls[i].offsetHeight - 38 + 'px';
					}
					newFV[i].style.opacity = 0;
					inp.value = newFV[i].innerHTML;
					dls[i].appendChild(p);
					inp.select();
				}
			}
			a1.onclick = function(){
				for (var i = 0; i < as.length; i++) {
					if(dls[i].children[1].children[0].innerHTML == inp.value){
						alert('重复命名');
						return;
					}
				}
				for (var i = 0; i < as.length; i++) {
					if(!as[i].onOff){
						newFV[i].innerHTML = inp.value;
						for (var j = 0; j < arr.length; j++) {
							if(arr[j].id == newFV[i].parentNode.IDS){
								arr[j].name = newFV[i].innerHTML;
							}
						}
						
						newFV[i].style.opacity = 1;
						dls[i].removeChild(p);
						dls[i].style.backgroundColor = '';
						dls[i].style.borderColor = '';
						as[i].style.display = '';

						q = 0;
						checkTxt.innerHTML = '全选';
						as[i].onOff = true;
					}
					dls[i].onOff = true;
					on = true;
				}
				son = true;
				don = true;
				checkAll.on = true;
			}
			a2.onclick = function(){
				for (var i = 0; i < as.length; i++) {
					if(!as[i].onOff){
						newFV[i].style.opacity = 1;
						dls[i].removeChild(p);
					}
					dls[i].onOff = true;
					on = true;
				}
				son = true;
				don = true;
				checkAll.on = true;
			}
			a1.onmousedown = a2.onmousedown = inp.onmousedown =  function(ev){
				ev.cancelBubble = true;
			}
	}
	
	
	//删除
	delet.onclick = function(){
		var del = [];
		var v =location.hash.split('=')[1];
		for (var i = 0; i < as.length; i++) {
			if(!as[i].onOff){
				for (var j = 0; j < arr.length; j++) {
					if(arr[j].name == dls[i].children[1].children[0].innerHTML && arr[j].pid == v){
						del.push(arr[j]);
						del.sort(function(a,b){
							return a.id - b.id;
						})
						m = del[0].id-1;
						deletss(arr[j].id);
						arr.splice(j,1);
					}
				}
				box.removeChild(dls[i]);
				i--;
			}
			q = 0;
			checkTxt.innerHTML = '全选';
			loadNum.innerHTML = '已全部加载，共'+(dls.length)+'个';
		}
		allCheck();
	}
	//删除子数据
	function deletss(m){
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].pid == m){
				deletss(arr[i].id);
				arr.splice(i,1);
				i--;
			}
		}
	}
	
	//全选
	checkAll.onOff = true;
	checkAll.on = true;
	checkAll.onclick = function(ev){
		if(!this.on){
			return;
		}
		ev.cancelBubble = true;
		allCheck();
		if(this.onOff){
			for (var i = 0; i < as.length; i++) {
				dls[i].style.backgroundColor = '#f1f5fa';
				as[i].style.backgroundImage = 'url(img/ycheck2.png)';
				if(switchs.index == 1){
					as[i].style.backgroundImage = 'url(img/checkbox_ico.png)';
				}
				as[i].style.display = 'block';
				dls[i].style.borderColor = 'rgba(144,195,253,1)';
				dls[i].onOff = false;
				as[i].onOff = false;
			}
			q = as.length;
			checkTxt.innerHTML = '已选中'+q+'个文件/文件夹';
			this.style.background = 'url(img/checkbox_ico.png)';
			this.onOff = !this.onOff;
		}else{
			for (var i = 0; i < as.length; i++) {
				dls[i].style.backgroundColor = '';
				as[i].style.backgroundImage = '';
				as[i].style.display = '';
				dls[i].style.borderColor = '';
				if(switchs.index == 1){
					as[i].style.backgroundImage = 'none';
					as[i].style.display = 'block';
					dls[i].style.borderColor = 'rgba(242,246,253,1)';
				}
				dls[i].onOff = true;
				as[i].onOff = true;
			}
			q = 0;
			checkTxt.innerHTML = '全选';
			if(switchs.index == 1){
				checkTxt.innerHTML = '文件名';
			}
			this.style.background = '';
			this.onOff = !this.onOff;
		}
		
	}
	
	//判断全选函数
	function allCheck(){
		var n = 0;
		for (var i = 0; i < as.length; i++) {
			if(!as[i].onOff){
				n++;
			}
		}
		if(n == as.length && as.length != 0){
			checkAll.style.background = 'url(img/checkbox_ico.png)';
			checkAll.onOff = false;
		}else{
			checkAll.style.background = '';
		}
		q = n;
		if(q == 0){
			checkTxt.innerHTML = '全选';
			if(switchs.index == 1){
				checkTxt.innerHTML = '文件名';
			}
		}else{
			checkTxt.innerHTML = '已选中'+q+'个文件/文件夹';
		}
//		console.log(checkAll.onOff)
	}
	
	

	window.onhashchange = function(){
		var t = location.hash.split('=')[1];//t=pid
		box.innerHTML = '';
		if(t!=0){
			tal.children[0].innerHTML = '<a href="javascript:;" class="color_blue fl prev">返回上一级</a><span class="color_blue fl"> | </span><a href="javascript:;" class="color_blue fl all">全部文件</a>';
			var prev = document.getElementsByClassName("prev")[0];
			var all = document.getElementsByClassName("all")[0];
			var oAh = tal.children[1].getElementsByTagName("a");
			prev.onclick = function(){
				if(tal.children[1].children.length>=1){
					tal.children[1].removeChild(tal.children[1].children[tal.children[1].children.length-1]);
					tal.children[1].removeChild(tal.children[1].children[tal.children[1].children.length-1]);
				}
				if(tal.children[1].children.length>1){
					tal.children[1].children[tal.children[1].children.length-1].className = 'fl';
					tal.children[1].children[tal.children[1].children.length-1].removeAttribute('href');
				}
				for (var i = 0; i < arr.length; i++) {
					if(arr[i].id==t){
						location.hash = 'rank=' + arr[i].pid;
					}
				}
			}
			all.onclick = function(){
				location.hash = 'rank=0';
			}
			var oAsLength = oAh.length-1;
			for (var i = 0; i < oAh.length-1; i++) {
				oAh[i].index = i;
				oAh[i].onclick = function(){
					if(this.href == ''){
						return;
					}
					box.innerHTML = '';
					location.hash = 'rank='+this.getAttribute('index');
					this.className = 'fl';
					this.removeAttribute('href');
					console.log(oAsLength,this.index)
					for (var j = 0; j < oAsLength-this.index; j++) {
						tal.children[1].removeChild(tal.children[1].children[tal.children[1].children.length-1]);
						tal.children[1].removeChild(tal.children[1].children[tal.children[1].children.length-1]);
						console.log(222222)
					}
					
				}
			}
		}else{
			tal.innerHTML = '<i class="fl claerfix">全部文件</i><i class="fl claerfix"></i>';
		}
		for (var i = 0; i < arr.length; i++) {
			if(arr[i].pid==t){
				init(arr[i]);
				box.insertBefore(dls[dls.length-1],dls[0]);
			}
		}
		dowri();
		loadNum.innerHTML = '已全部加载，共'+dls.length+'个';
		if(switchs.index == 1){
			switchs.onOff = true;
			switchs.onclick();
		}else if(switchs.index == 0){
			switchs.onOff = false;
			switchs.onclick();
		}
		checkTxt.innerHTML = '全选';
		if(switchs.index==1){
			checkTxt.innerHTML = '文件名';
		}
		checkAll.style.background = '';
		
	}
	

	//选框、选中文件
	var selectBox = document.getElementById("selectBox");
	var pos = {};
	var selectMove = false;
	var copydl = copy.getElementsByTagName("dl");
	box.onmousedown = function(ev){
		copy.innerHTML = '';
		if(!don){
			return;
		}
		pos.l = ev.clientX;
		pos.t = ev.clientY;
		ev.preventDefault();
		for (var i = 0; i < dls.length; i++) {
			as[i].onOff = true;
			as[i].style.display = '';
			dls[i].style.borderColor = '';
			dls[i].style.backgroundColor = '';
			if(switchs.index==1){
				dls[i].style.borderColor = 'rgba(242,246,253,1)';
				as[i].style.display = 'block';
				as[i].style.backgroundImage = 'none';
			}
		}
		selectMove = true;
		if(ev.button==2){
			selectMove = false;
		}
		newOn();
		allCheck();
	}
	var dlMoveArr = [];
	var copydl_this = null;
	document.onmousemove = function(e){
		if(selectMove){
			var il = e.clientX;
			var it = e.clientY;
	
			var w = Math.abs(pos.l-il);
			var h = Math.abs(pos.t-it);
			var sl = pos.l<il?pos.l:il;
			var st = pos.t<it?pos.t:it;
			selectBox.style.display = 'block';
			
			selectBox.style.left = sl + 'px';
			selectBox.style.top = st+ 'px';
			selectBox.style.width = w + 'px';
			selectBox.style.height = h + 'px';
			
			for (var i = 0; i < dls.length; i++) {
				if(ram(selectBox,dls[i])){
					as[i].onOff = false;
					as[i].style.display = 'block';
					as[i].style.backgroundImage = 'url(img/ycheck2.png)';
					if(switchs.index==1){
						as[i].style.backgroundImage = 'url(img/checkbox_ico.png)';
					}
					dls[i].style.borderColor = 'rgba(144,195,253,1)';
					dls[i].style.backgroundColor = '#f1f5fa';
				}else{
					as[i].onOff = true;
					as[i].style.display = '';
					dls[i].style.borderColor = '';
					dls[i].style.backgroundColor = '';
					if(switchs.index==1){
						dls[i].style.borderColor = 'rgba(242,246,253,1)';
						as[i].style.display = 'block';
						as[i].style.backgroundImage = 'none';
					}
				}
			}
//			newOn();
			allCheck();
		}
		//
		if(dlMove){
			var l = e.clientX;
			var t = e.clientY;
			for(var i=0;i<posdl2.length;i++){
				copydl[i].style.left = posdl2[i].x + (l-posdl.x) + 'px';
				copydl[i].style.top = posdl2[i].y + (t-posdl.y) + 'px';
			}
			dlMoveArr = [];
			for (var i = 0; i < copydl.length; i++) {
				if(copydl[i].num==dl_this.num){
					copydl_this = copydl[i];
					for (var j = 0; j < as.length; j++) {
						if(as[j].onOff){
							if(ram(copydl[i],dls[j])){
								dlMoveArr.push({left:dls[j].getBoundingClientRect().left,top:dls[j].getBoundingClientRect().top,obj:dls[j]});
								as[j].style.display = 'none';
								if(switchs.index==1){
									as[j].style.display = 'block';
								}
								dls[j].style.background = '';
								dls[j].children[0].children[0].style.backgroundImage = 'url(img/folder_ADD_ico.png)';
							}else{
								as[j].style.display = 'none';
								if(switchs.index==1){
									as[j].style.display = 'block';
								}
								dls[j].style.background = '';
								dls[j].children[0].children[0].style.backgroundImage = '';
							}
						}
					}
				}
			}
		}
	}
	document.onmouseup = function(ev){
		if(selectMove){
			selectBox.style.cssText = '';
			selectMove = false;
		}
		if(dlMove){
			var sortArr = [];
			if(dlMoveArr.length>0){
				for (var i = 0; i < dlMoveArr.length; i++) {
					sortArr.push({sum:Math.pow(dlMoveArr[i].left-copydl_this.getBoundingClientRect().left,2)+Math.pow(dlMoveArr[i].top-copydl_this.getBoundingClientRect().top,2),mark:i});
				}
				sortArr.sort(function (a,b) {
					return a.sum - b.sum;
				})
				for (var i = 0; i < as.length; i++) {
					if(!as[i].onOff){
						for (var j = 0; j < arr.length; j++) {
							if(dls[i].num==arr[j].id){
								arr[j].pid = dlMoveArr[sortArr[0].mark].obj.num;
							}
						}
					}
				}
				for (var i = 0; i < as.length; i++) {
					if(!as[i].onOff){
						box.removeChild(dls[i]);
						i--;
					}
				}
			}
			allCheck();
			posdl2 = [];
			dlMove = false;
			copy.innerHTML = '';
			loadNum.innerHTML = '已全部加载，共'+dls.length+'个';
			for (var i = 0; i < dls.length; i++) {
				dls[i].children[0].children[0].style.backgroundImage = '';
			}
		}
	}
	//碰撞检测函数
	function ram(obj1,obj2){
		var pos1 = obj1.getBoundingClientRect();
		var pos2 = obj2.getBoundingClientRect();
		if(pos1.right<pos2.left || pos1.bottom<pos2.top || pos1.left>pos2.right || pos1.top>pos2.bottom){
			return false;
		}else{
			return true;
		}
	}
	
	//复制节点
	function newOn(){
		copy.innerHTML = '';
		for (var i = 0; i < as.length; i++) {
			if(!as[i].onOff){
				var newJd = as[i].parentNode.cloneNode(true);
				newJd.num = dls[i].num;
				newJd.style.background = '';
				newJd.style.border = '';
				newJd.style.opacity = '0.5';
				newJd.removeChild(newJd.children[2]);
				if(switchs.index==1){
					newJd.children[1].style.width = '200px';
				}
				newJd.style.top = dls[i].getBoundingClientRect().top + 'px';
				newJd.style.left = dls[i].getBoundingClientRect().left + 'px';
				newJd.style.margin = '0';
				copy.appendChild(newJd);
			}
		}
	}

	var ridow = document.getElementById("ridow");
	var view = document.getElementById("view");
	
	
	
	//鼠标右键菜单
	box.oncontextmenu = function(ev){
		var del = document.getElementsByClassName("false")[0];
		if(del!=undefined){
			del.onclick();
		}
		
		ridow.innerHTML = '';
		ev.preventDefault();
		var dowLi = document.createElement("li");
		var dowLi2 = document.createElement("li");
		var dowLi3 = document.createElement("li");
		dowLi.innerHTML = '查看 >';
		dowLi2.innerHTML = '新建文件夹';
		dowLi3.innerHTML = '重新载入';
		ridow.appendChild(dowLi);
		ridow.appendChild(dowLi2);
		ridow.appendChild(dowLi3);
		
		ridow.style.display = 'block';
		ridow.style.left = ev.clientX + 'px';
		ridow.style.top = ev.clientY + 'px';
		ridow.oncontextmenu = function(ev){
			ev.preventDefault();
		}
		
		dowLi.onmouseover = function(){
			view.innerHTML = '';
			view.style.display = 'block';
			view.style.left = ridow.getBoundingClientRect().right - 4 + 'px';
			view.style.top = ev.clientY + 'px';
			
			var vLi = document.createElement("li");
			var vLi2 = document.createElement("li");
			
			vLi.innerHTML = '列表';
			vLi2.innerHTML = '缩略图';
			view.appendChild(vLi);
			view.appendChild(vLi2);
			view.oncontextmenu = function(ev){
				ev.preventDefault();
			}
			view.onmouseover = function(){
				this.style.display = 'block';
				dowLi.style.backgroundColor = '#4f9dfb';
				dowLi.style.color = '#FFFFFF';
			}
			vLi.onclick = function(){
				switchs.onOff = true;
				switchs.onclick();
			}
			vLi2.onclick = function(){
				switchs.onOff = false;
				switchs.onclick();
			}
			if(switchs.index == 1){
				vLi.style.background = 'url(img/vli_ico.png) no-repeat 7px 11px';
			}else{
				vLi2.style.background = 'url(img/vli_ico.png) no-repeat 7px 11px';
			}
			vLi.onmouseover = function(){
				vLi2.style.backgroundColor = '';
				this.style.backgroundColor = '#4f9dfb';
			}
			vLi2.onmouseover = function(){
				vLi.style.backgroundColor = '';
				this.style.backgroundColor = '#4f9dfb';
			}
			vLi.onmouseout = vLi2.onmouseout =  function(){
				this.style.backgroundColor = '';
			}
		}
		dowLi.onmouseout = function(){
			view.style.display = 'none';
		}
		dowLi2.onclick = function(){
			newFolder.onclick();
			ridow.style.display = 'none';
		}
		dowLi3.onclick = function(){
			box.innerHTML = '';
			document.location.reload();
			ridow.style.display = 'none';
		}
		dowLi2.onmouseover = dowLi3.onmouseover = function(){
			dowLi.style.backgroundColor = '';
			dowLi.style.color = '';
			view.style.display = '';
		}
	}
	box.onclick = function(ev){
		var del = document.getElementsByClassName("false")[0];
		if(ridow.style.display == 'none'){
			ev.cancelBubble = true;
		}
		if(del!=undefined){
			for (var i = 0; i < dls.length; i++) {
				dls[i].onOff = false;
			}
		}else{
			for (var i = 0; i < dls.length; i++) {
				dls[i].onOff = true;
			}
		}
	}

function dowri(){
	for (var i = 0; i < dls.length; i++) {
		dls[i].index = i;
		dls[i].oncontextmenu = function(ev){
			var del = document.getElementsByClassName("false")[0]
			if(del!=undefined){
				del.onclick();
			}
			//
			for (var j = 0; j < dls.length; j++) {
				as[j].onOff = false;
				as[j].onclick();
				as[j].style.display = '';
				dls[j].style.borderColor = '';
				dls[j].style.backgroundColor = '';
				if(switchs.index==1){
					as[j].style.display = 'block';
					dls[j].style.borderColor = 'rgba(242,246,253,1)';
				}
			}
			//
			ridow.innerHTML = '';
			ev.cancelBubble = true;
			ev.preventDefault();
			var dowLi = document.createElement("li");
			var dowLi2 = document.createElement("li");
			var dowLi3 = document.createElement("li");
			dowLi.innerHTML = '打开';
			dowLi2.innerHTML = '删除';
			dowLi3.innerHTML = '重命名';
			ridow.appendChild(dowLi);
			ridow.appendChild(dowLi2);
			ridow.appendChild(dowLi3);
			
			ridow.style.display = 'block';
			ridow.style.left = ev.clientX + 'px';
			ridow.style.top = ev.clientY + 'px';
			ridow.oncontextmenu = function(ev){
				ev.preventDefault();
			}
			
			as[this.index].onOff = true;
			as[this.index].onclick();
			as[this.index].style.display = 'block';
			this.style.borderColor = 'rgba(144,195,253,1)';
			this.style.backgroundColor = '#f1f5fa';
			
			var _thiss = this;
			
			dowLi.onclick = function(){
				_thiss.onOff = true;
				_thiss.ondblclick();
				ridow.style.display = 'none';
				checkTxt.innerHTML = '全选';
			}
			dowLi2.onclick = function(){
				delet.onclick();
				ridow.style.display = 'none';
				checkTxt.innerHTML = '全选';
			}
			dowLi3.onclick = function(){
				rename.onclick();
				ridow.style.display = 'none';
				checkTxt.innerHTML = '全选';
			}
		}
		dls[i].onclick = function(ev){
			if(ridow.style.display == 'none'){
				ev.cancelBubble = true;
			}
		}
	}
}	
	
	document.onclick = function(ev){
		if(ev.target.parentNode != ridow){
			ridow.style.display = '';
			view.style.display = '';
			checkAll.onOff = true;
		}
	}
