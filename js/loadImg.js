define(function(require, exports, module) {
	return function loadImg (imgUrl,loadComplete){
		var len = imgUrl.length;
		var num = 0;
		var checkLoad = function(){
			num++;
			if( num == len ){
				loadComplete();
			}
		}
		var checkImg = function(url){
			var val= url;
			var img=new Image();
			if(img.readyState){
				img.onreadystatechange = function(){
					if(img.readyState=="complete"||img.readyState=="loaded"){
						checkLoad();
					}
				}
			}else{
				img.onload=function(){
					if(img.complete==true){
						checkLoad();
					}
				}
			}
			img.src=val;
		}
		for( var i = 0; i < len; i++ ){
			checkImg(imgUrl[i]);
		}
	}
});