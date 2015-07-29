/*
@author:Leo
@email:984018099@qq.com
@create date:2013.10.20
*/
define(function(require, exports, module) {
	var loadImg=require("loadImg");
	//加载图片资源
	var imgUrl=[
		"images/play/bg.jpg",
		"images/play/bg2.png",
		"images/play/bg3.png",
		"images/play/bg4.png",
		"images/play/bg5.png",
		"images/play/bt-bg.png",
		"images/play/cloud.png",
		"images/play/pd1.png",
		"images/play/pd2.png",
		"images/play/pd3.png",
		"images/play/plane.png",
		"images/play/score.png",
		"images/play/time.png",
		"images/play/box_bg.png",
		"images/play/box1.png",
		"images/play/box2.png",
		"images/play/box3.png",
		"images/play/timming.png",
		"images/play/round.png"
	],
	complete=function(){
		$(".main").show();//资源加载完毕显示主界面
		var isSupportTouch= "ontouchend" in document? true : false;
		var oClick;
		if(isSupportTouch){oClick="tap";}else{oClick="click";}
		var Game={
			score:0,//得分
			add:0,//每个奖品的加分设定
			time:0,//游戏时间
			bottom:0,//飞机初始位置
			timer1:null,
			timer2:null,
			angle:0,//飞机倾斜角度
			speed:0,//礼物速度
			dy : 0,//飞机y轴变化系数
			gravity : 0,//飞机垂直加速度
			lastTime : 0, 
			b:false,
			isGameOver:false,
			init:function(){
				//初始化
				Game.score=0;;
				Game.add=3;
				Game.time=60;
				Game.bottom=600;
				Game.timer1=null;
				Game.timer2=null;
				Game.angle=0;
				Game.speed=10;
				Game.dy = -0.5;
				Game.gravity =.00098;
				Game.lastTime = 0;
				Game.b=false;
				Game.isGameOver=false;
				Game.gameReady();
				Game.gameStart();
			},
			gameReady:function(){
				$(".cloud").each(function(index) {
                    $(this).addClass("cloud-"+ (index+1));
                });
				$(".diff-bg").addClass("diffbg");
				$(".plane").css({
					"-webkit-transition":"2s all ease-in-out",
					"bottom":"600px",
					"left":"150px",
					"-webkit-transform":"rotate(-30deg)"
				});
				setTimeout(function(){
					$(".plane").css({
						"-webkit-transition":"1s all ease-in-out",
						"-webkit-transform":"rotate(0deg)"
					});
				},1000);
			},
			gameStart:function(){
				var $plane=$(".plane");
				$(".time span").text("00:"+Game.time);
				setTimeout(function(){
					$(".app").on(oClick,function(e){
						if(!Game.isGameOver){
						    var e=e||event;
							e.stopPropagation();
							Game.b = true;
							Game.dy = -0.5;
							//Game.bottom+=150;
							Game.angle=-15;
							$(".plane").css({
								"-webkit-transition":"0.1 all linear",
								"bottom":Game.bottom,
								"-webkit-transform":"rotate(-15deg)"
							});
						}
					});
					Game.setTimer();
					//游戏时间控制器
					var imgArray=[1,2,3];
					Game.timer2=setInterval(function(){
						if(Game.time>0){
							Game.time--;
							$(".time span").text("00:"+Game.time);
							var $pdWrapper=$(".pd-wrapper");
							var rdSrcNum=Math.floor(Math.random()*3);
							if($(".gift").size()<3){
								var newGift=$("<img/>");
								newGift.attr("src","images/play/pd"+imgArray[rdSrcNum]+".png");
								newGift.addClass("gift");
								newGift.attr("type",imgArray[rdSrcNum]);
								$pdWrapper.append(newGift);
								newGift.css({top:parseInt(Math.random()*500-50)});
							}
							if(Game.time==45){
								Game.speed+=1;
								$(".diff-bg2").css({"opacity":1}).siblings().css({"opacity":0});
								$(".round").css({"background-position":"-302px 0"});
							}else if(Game.time==30){
								Game.speed+=1;
								$(".diff-bg3").css({"opacity":1}).siblings().css({"opacity":0});
								$(".round").css({"background-position":"-150px 0"});
							}else if(Game.time==15){
								Game.speed+=1;
								$(".diff-bg4").css({"opacity":1}).siblings().css({"opacity":0});
								$(".round").css({"background-position":"0 0"});
							}
						}else{
							//游戏结束 
							Game.gameOver();
						}
					},1000);
					//
				},2000);//延迟2秒让出场动画执行完毕
			},
			setTimer:function(){
				var $plane=$(".plane");
				Game.timer1=setInterval(function(){
					if(Game.b){
						if(Game.lastTime == 0){
							Game.lastTime = new Date().getTime();
						}
						var timeDiff = new Date().getTime() - Game.lastTime;
						Game.lastTime += timeDiff;					
						Game.dy += Game.gravity*timeDiff; 
						Game.bottom += (-timeDiff*Game.dy);
					}else{
							Game.bottom += -5;	
					}
					if(Game.bottom>120){
						$plane.css({
							"bottom":Game.bottom
						});
					}else{
						Game.bottom=120;
						$plane.css({
							"bottom":Game.bottom,
							"-webkit-transform":"rotate(0deg)"
						});
					}
					if(Game.angle<15){
						Game.angle++;
						$plane.css({
							"-webkit-transition":"none",
							"-webkit-transform":"rotate("+Game.angle+"deg)"
						});
					}
					//
					$(".gift").each(function(i) {
						var _this=$(this);
						var seftWidth=_this.width();
						var  selfLeft=_this.position().left-Game.speed;
						if(selfLeft < -seftWidth){
							_this.remove();	//礼物超出可视区域时移除
						}
						_this.css({left:selfLeft});
						//碰撞检测
						var oL=selfLeft
							 oR=oL+seftWidth,
							 oT=_this.position().top,
							 oB=oT+_this.height();
							 
						var pL=$plane.position().left,
							  pR=pL+$plane.width(),
							  pT=$plane.position().top,
							  pB=pT+$plane.height();
					/*	var oPosCenter=	[selfLeft+parseInt(seftWidth/2),_this.position().top+parseInt(_this.height()/2)];
						var pPosCenter=	[$plane.position().left+parseInt($plane.width()/2),$plane.position().top+parseInt($plane.height()/2)];
						var distance=Math.sqrt(Math.pow(oPosCenter[0]-pPosCenter[0],2)+Math.pow(oPosCenter[1]-pPosCenter[1],2));*/
						//distance < (seftWidth+$plane.width())/2-50
						if(pR-100>oL && pL<oR && pB-100>oT &&pT<oB+50){
							//发生碰撞
							Game.score+=Game.add;
							$(".plane-1").hide();
							$(".plane-2").show();
							setTimeout(function(){
								$(".plane-2").hide();
								$(".plane-1").show();
							},100);
							$(".score span").text(Game.score);
							_this.remove();
						}
						
					});	
					//遍历gift
				},30);
			},
			gameOver:function(){
				this.isGameOver=true;
				clearInterval(Game.timer1);
				clearInterval(Game.timer2);
				window.sessionStorage.score=Game.score;
				$(".cloud").each(function(index) {
					$(this).removeClass("cloud-"+(index+1));
				});
				$(".diff-bg").removeClass("diffbg").css({"opacity":1}).siblings().css({"opacity":0});
				$(".box-3 .game-score").text(Game.score);// 游戏剩余次数
				$(".box-3").show();
			}	
		}//Game
		function showTimming(){
			$(".timming").show();
			setTimeout(function(){
				$(".timming").css({"background-position":"-193px 0"});
				setTimeout(function(){
					$(".timming").css({"background-position":"-388px 0"});
					setTimeout(function(){
						$(".timming").css({"background-position":"-578px 0"});
						setTimeout(function(){
							$(".timming").hide();
							Game.init();
						},1000);	
					},1000);	
				},1000);	
			},1000);		
		}
		//点击按钮开始游戏
		$(".box-1 .start").on(oClick,function(){
			$(".box-1").hide();
			showTimming();
		});
		$(".box-3 .play-again").on(oClick,function(){
			$(".plane").css({
				"-webkit-transition":"none",
				"left":0,
				"bottom":120,
				"-webkit-transform":"rotate(0)"
			});
			$(".round").css({"background-position":"-445px 0"});
			$(".score span").text(0);
			$(".pd-wrapper").html("");
			showTimming();
			$(".box-3").hide();
		});
		$(".box-3 .share-score").on(oClick,function(){
			alert("暂未开放");
		});
		$(".box-3 .draw").on(oClick,function(){
			alert("暂未开放");
		});
		$(".box .close").on(oClick,function(){
			$(this).parents(".box").hide();	
		});
	}//loadimg complete
	loadImg(imgUrl,complete);
});