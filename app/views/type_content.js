'use strict';

var TypeContent = React.createClass({

	/* getInitialState: function () {
        return {
        	source: this.props.source
        };
    },

    componentWillReceiveProps(nextprops){
        return {
        	source: nextprops.source
        };
    },*/

    componentDidMount: function () {

    },

    componentDidUpdate(){

    	let source = this.props.source,
            tule = source.tule||{}

        if(tule.mtype==8){
        	this.swipeVideoHandle();
        }
        if(tule.mtype==7){
        	this.videoPlayHandle();
        }
        if(tule.mtype==2){
        	this.musicPalyHandle();
        }
        if(tule.mtype==1){
        	
        }
 
    },

    videoPlayHandle(){
    	(function(){
            var inter;
            var query = function (selector){
                return document.querySelector(selector);
            };
            var video = query("#videoSource"), src = video.dataset.src;
            function _loadVideo(){
                var h = query(".videoBox > img").offsetHeight, w = query(".videoBox > img").offsetWidth;
                video.src = src;
                video.width = w;
                video.height = h;
                video.play();
                inter = setInterval(checkEnd, 300);
                query(".playBtn").style.opacity = "0";
                query(".playBtn").removeEventListener('click', _loadVideo, false);
                query(".playBtn").addEventListener('click', function(){
                    if(video.paused){
                        query(".playBtn").style.opacity = "0";
                        video.play();
                    } else{
                        query(".playBtn").style.opacity = "1";
                        video.pause();
                    }
                }, false);
            }
            query(".playBtn").addEventListener('click', _loadVideo, false);
            function checkEnd(){
                if(video.ended){
                    console.log("1");
                    clearInterval(inter);
                    query(".playBtn").style.opacity = "1";
                } else{
                    console.log("2");
                }
            }

        })();
    },

    musicPalyHandle(){
    	(function(){
    		function query(id){
				return document.getElementById(id);
			}
			var audio = query("record");
			var isNil = audio.getAttribute('src');
			if(isNil != ""){
				query("soundControlWrap").style.display = "block";
				//获取音频长度 复制tag 宽度变化
				var len = audio.duration;
				if(len <= 30){
					query("musicCtrl").style.width = "90px";
				} else if(len <= 60){
					query("musicCtrl").style.width = "105px";
				}else {
					query("musicCtrl").style.width = "120px";
				}
				query("musicCtrl").addEventListener('click', function(event){
					event.preventDefault();
					play();
				}, false);
			}

			function play(){

				var playing = audio.getAttribute("data-playing");
				if(playing == "pause"){
					audio.play();
					query("playStatus").className = "playing on";
					audio.setAttribute("data-playing", "play");
				} else if(playing == "play"){
					audio.pause();
					query("playStatus").className = "playing";
					audio.setAttribute("data-playing", "pause");
				}
			}
    	})()
    },

    swipeVideoHandle(){
    	var swiper = new Swiper('.swiper-container', {
			slidesPerView: 'auto',
			spaceBetween: 0,
			freeMode: true
		});

		(function(){
			var query = function (selector){
				return document.querySelector(selector);
			};
			var poster = query(".poster");
			var playBtn = query(".playBtn");
			var userHd =  query(".u-head > img");
			var userNm =  query(".u-name");

			var items = document.getElementsByClassName("swiper-slide");
			var iLen = items.length, x = 0, video = query("#video"), outInter;

			function _addCur(event){
				event.preventDefault();
				event.stopPropagation();
				var target = event.target || event.srcElement;
				var arr = [];

				for(var n = 0; n < iLen; n++){
					items[n].className = "swiper-slide";
					arr[n] = items[n];
				}
				x = arr.indexOf(target);
				target.className = "swiper-slide cur";
				poster.src = target.dataset.bg;
				_loadVideo();
			}

			function _autoCur(m){
				for(var i = 0; i< iLen; i++){
					items[i].className = "swiper-slide";
				}
				items[m].className = "swiper-slide cur";
				poster.src = items[m].dataset.bg;
				_loadVideo();
				outInter = setInterval(_regularCheck, 500);
			}

			function _regularCheck(){
				if(video.ended){
					if(x < iLen - 1){
						x = x + 1;
					} else {
						x = 0;
					}
					console.log(x);
					clearInterval(outInter);
					_autoCur(x);
				}
			}

			function _loadVideo(){
				var inter, current = query(".cur");

				var h = poster.offsetHeight, w = poster.offsetWidth;
				video.src = current.dataset.v;
				video.width = w;
				video.height = h;
				video.poster = poster.src;
				video.play();
				userHd.src = current.dataset.hd;
				userNm.innerHTML = current.dataset.nm;
				inter = setInterval(checkEnd, 300);
				playBtn.style.opacity = "0";
				playBtn.addEventListener('click', function(event){
					event.preventDefault();
					event.stopPropagation();
					var h = poster.offsetHeight, w = poster.offsetWidth;
					if(video.paused || video.seeking){
						playBtn.style.opacity = "0";
						video.width = w;
						video.height = h;
						video.play();
					} else{
						playBtn.style.opacity = "1";
						video.pause();
					}
				}, false);

				function checkEnd(){
					if(video.ended){
						video.width = 1;
						video.height = 1;
						playBtn.style.opacity = "1";
					}
				}
			}
			for(var i = 0;i < iLen; i++){
				items[i].style.backgroundImage = "url(" + items[i].dataset.bg + ")";
				items[i].addEventListener('click', _addCur, false);
			}
			poster.src = items[0].dataset.bg;
			userHd.src = items[0].dataset.hd;
			userNm.innerHTML = items[0].dataset.nm;
			for(var n = 0; n < iLen; n++){
				items[n].className = "swiper-slide";
			}
			items[0].className = "swiper-slide cur";
			playBtn.style.opacity = "0";

			_autoCur(x);

		})();
    },

    typeShow(){

		let source = this.props.source,
            comments = source.comments||[],
            featuretule = source.featuretule||[],
            likeDatas = source.likeDatas||[],
            tule = source.tule||{}, videos = tule.videos||[],video = tule.video||{}, audio = tule.audio||{},
            user = source.user||{};
    	console.log(source,'source');

    	//swipe video  mtype=8
    	let _swipe_video = (
    			<div>
    				<div className="listVideoWrap">
		                <div className="videoWrap">
		                    <img className="poster" src="" alt=""/>
		                    <video id="video" src="" width="1" height="1" webkit-playsinline></video>
		                    <div className="user-area">
		                        <div className="u-head"><img src="img/likeIcon.jpg" alt=""/></div>
		                        <div className="u-name">UserName</div>
		                    </div>
		                    <div className="playBtn"></div>
		                </div>
		                <div className="listWrap swiper-container">
		                    <div id="videoSwipe" className="swiper-wrapper">
		                    {
		                    	videos.map(function(item,key){
		                    		let _active = '';
									if(key==0){
										_active = 'cur';
									}else{
										_active = '';
									}
		                    		return (
		                    				<div className={"swiper-slide "+_active}
		                    					 data-bg={item.image} 
		                    					 data-hd={item.uavatar}
		                    					 data-nm={item.uname}
		                    					 data-v={item.url}
		                    					 key={key}
		                    					 >
		                					 </div>
		                    			)
		                    	})
		                    }
		                    </div>
		                </div>
		            </div>
    			</div>
    		)

		//video play mtype=7
		let _video_play = (
			<div className="videoContainer">
                <div className="videoBox">
                    <img src="img/shot.jpg" alt=""/>
                    <video id="videoSource" src="" data-src="movie.mp4" width="1"></video>
                    <div className="playBtn"></div>
                </div>
            </div>
		)

		//music play mtype=2
		let _music_play = (
			<div className="singlePicContainer">	
					<img className="singlePic" src={tule.purl} />
					<div id="soundControlWrap" className="soundControlWrap" style={{left: '31%', top: '72%'}}>
						<div className="shiningIcoWrap"></div>
						<div className="shiningIcoInner"></div>
						<div className="music-controls" id="musicCtrl">
							<div className="triAngle"></div>
							<div id="playStatus" className="playing"></div>
							<span>{audio.time}"</span>
						</div>
					</div>
					<audio id="record" data-playing="pause" preload="auto" src={audio.url}></audio>
				</div>
		)

		//pic show mtype=1
		let _pic_show = (
			<div className="singlePicContainer">	
					<img className="singlePic" src={tule.purl} />
					<div className="picTag">
						<img className="tagIcon" src="img/pd.png" /><span>{tule.chname}</span>
					</div>
				</div>
		)

		if(tule.mtype==8){
			return _swipe_video;
		}
		if(tule.mtype==7){
			return _video_play;
		}
		if(tule.mtype==2){
			return _music_play;
		}
		if(tule.mtype==1){
			return _pic_show;
		}
    },

    render: function () {
        return(
        		<div>
        			{this.typeShow()}
        		</div>
        	)
    }
});

module.exports = TypeContent;