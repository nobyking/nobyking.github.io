var switchs = document.getElementsByClassName("switch")[0];
var son = true;
	switchs.onOff = true;
	switchs.onclick = function(){
		if(!son){
			return;
		}
		if(this.onOff){
			this.index = 1;
			this.style.backgroundImage = 'url(img/switch2-ico.png)';
			for (var i = 0; i < dls.length; i++) {
				dls[i].className = 'box_folder';
				dls[i].style.width = '100%';
				dls[i].style.height = '44px';
				dls[i].style.margin = '0';
				dls[i].style.marginBottom = '2px';
				dls[i].style.border = '1px solid #90c3fd';
				dls[i].style.borderColor = 'rgba(242,246,253,1)';
				dls[i].style.borderLeft = 'none';
				dls[i].style.borderRight = 'none';
				dls[i].style.borderRadius = '0px';
				dls[i].style.textAlign = 'left';
				as[i].style.width = '12px';
				as[i].style.height = '12px';
				as[i].style.border = '1px solid #cacaca';
				as[i].style.backgroundImage = 'none';
				as[i].style.display = 'block';
				as[i].style.top = '14px';
				as[i].style.left = '16px';
				
				var dt = dls[i].children[0];
				var dd = dls[i].children[1];
				var dt_a = dt.children[0];
				dt.style.margin = '12px 0 0 43px';
				dt.style.width = '38px';
				dt.className = 'fl';
				dt_a.style.width = '26px';
				dt_a.style.height = '21px';
				dt_a.style.backgroundSize = 'cover';
				dd.style.marginTop = '15px';
				
				if(!as[i].onOff){
					as[i].style.backgroundImage = 'url(img/checkbox_ico.png)';
					dls[i].style.borderColor = 'rgba(144,195,253,1)';
				}
			}
			
			checkTxt.innerHTML = '文件名';
//			console.log(222)
			this.onOff = !this.onOff;
		}else{
			this.index = 0;
			this.style.backgroundImage = 'url(img/switch-ico.png)';
			for (var i = 0; i < dls.length; i++) {
				dls[i].className = 'box_folder fl';
				dls[i].style.width = '120px';
				dls[i].style.height = '127px';
				dls[i].style.margin = '3px 0 0 6px';
				dls[i].style.border = '1px solid #90c3fd';
				dls[i].style.borderColor = 'rgba(241,245,250,0)';
				dls[i].style.borderRadius = '4px';
				dls[i].style.textAlign = 'center';
				as[i].style.width = '19px';
				as[i].style.height = '19px';
				as[i].style.border = 'none';
				as[i].style.backgroundImage = 'url(img/ycheck.png)';
				as[i].style.display = 'none';
				as[i].style.top = '5px';
				as[i].style.left = '6px';
				
				var dts = dls[i].children[0];
				var dds = dls[i].children[1];
				var dts_a = dts.children[0];
				dts.style.margin = '28px 0 15px';
				dts.style.width = '';
				dts.className = '';
				dts_a.style.width = '56px';
				dts_a.style.height = '46px';
				dts_a.style.backgroundSize = 'auto';
				dds.style.marginTop = '0';
				
				if(!as[i].onOff){
					as[i].style.backgroundImage = 'url(img/ycheck2.png)';
					as[i].style.display = 'block';
					dls[i].style.borderColor = 'rgba(144,195,253,1)';
				}
			}

			checkTxt.innerHTML = '全选';
//			console.log(333)
			this.onOff = !this.onOff;
		}
	}
