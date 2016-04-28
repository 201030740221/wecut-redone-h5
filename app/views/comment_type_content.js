'use strict';

var CommentTypeContent = React.createClass({

    componentDidMount: function () {

    },
    timeHandle(_date){
    	//计算出相差天数
		var days=Math.floor(_date/(24*3600*1000))
		 
		//计算出小时数
		var leave1=_date%(24*3600*1000)    //计算天数后剩余的毫秒数
		var hours=Math.floor(leave1/(3600*1000))
		//计算相差分钟数
		var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
		var minutes=Math.floor(leave2/(60*1000))
		 
		//计算相差秒数
		var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
		var seconds=Math.round(leave3/1000);
		console.log(" 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒")
		if(days>0){
			return days+'天';
		}
		if(hours>0){
			return hours+'小时';
		}
		if(minutes>0){
			return minutes+'分';
		}
		if(seconds>0){
			return seconds+'秒';
		}

    },

    typeShow(){

    	let self = this;
		let source = this.props.source,
            comments = source.comments||[],
            featuretule = source.featuretule||[],
            likeDatas = source.likeDatas||[],
            tule = source.tule||{},
            user = source.user||{}; 

        let _comment_node = (
                <div>
                    <div className="commentContainer">
                    {
                        comments.map(function(item,key){

                        	item = item||{};
                        	let rechangeimg = item.rechangeimg||[];

                        	let postTime = item.postTime,
                        		cur_date = new Date().getTime(),
                        		time_sec = Math.floor(cur_date/1000),
                        		_date=time_sec-postTime;
                        	let _time_show = self.timeHandle(_date);
                        	
                            return (
                                    <div className="comment" key={key}>
										<img className="commentIcon" src={item.uAvatar} />
										<div className="commentContent">
											<p className="commentNickname">{item.uNickname}</p>
											<div className="commentText commentPic">
												<span className="bot"></span>
											    <span className="top"></span>
											    <img src={item.coverImg} />
											    <div className="followUpContainer">
											    {
											    	rechangeimg.map(function(_item,_key){

											    		_item = _item||{};

											    		return (
											    			<div className="followUp" key={_key}>
														    	<img className="followUpIcon" src={_item.uAvatar} />
														    	<span className="followUpName">{_item.uNickname}</span>
														    	<img className="followUpPic" src={_item.coverImg} />	    
													    	</div>
											    		)
											    	})
											    }
											    </div>
											</div>
										</div>
										<span className="commentTime">{_time_show}前</span>
									</div>
                                )
                        })
                    }       
                    </div>
                    
                </div>
            )
        if(tule.mtype==8||tule.type==7){
            _comment_node = null;
        }

        return _comment_node
    },

    render: function () {
        return(
        		<div>
        			{this.typeShow()}
        		</div>
        	)
    }
});

module.exports = CommentTypeContent;