import {Router, Route, IndexRoute, useRouterHistory} from 'react-router';
/*import PagePushContent from '../components/page-push-content';
import Ua from '../components/utils/ua';*/
import TypeContent from './type_content';
import CommentTypeContent from './comment_type_content';

var ActivityPage = React.createClass({
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
    GetRequest() { 
        var url = location.search; //获取url中"?"符后的字串 
        var theRequest = new Object(); 
        if (url.indexOf("?") != -1) { 
            var str = url.substr(1); 
            let strs = str.split("&"); 
            for(var i = 0; i < strs.length; i ++) { 
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
            } 
        } 
        return theRequest; 
    },

    //微信配置接口
    getWechatConfig(){

        let self = this;
        let _url = window.location.href;
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {url:_url},
            url: 'http://hd.wecut.com/api/wx/token.php',
            success: function(res){
                self.wechatConfig(res.data);
            }
        });
    },

    //微信分享配置
    wechatConfig(configData){
          //获取微信wx.config的配置信息接口
          console.log(configData,'weChatJsConfig');
          var apiList = ['onMenuShareTimeline', 'onMenuShareAppMessage'];
           wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId:  configData.appId, // 必填，公众号的唯一标识
                timestamp: configData.timestamp, // 必填，生成签名的时间戳
                nonceStr: configData.nonceStr, // 必填，生成签名的随机串
                signature: configData.signature,// 必填，签名，见附录1
                jsApiList: apiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
          wx.ready(function(){
            wx.checkJsApi({
                jsApiList: apiList, // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function(res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    console.log(res,'wx');
                }
            });

            let title='分享赢iphone',
                link = 'www.wecut.com',
                image = '';

            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接
                imgUrl: image, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: 'wecut', // 分享描述
                link: link, // 分享链接
                imgUrl: image, // 分享图标
                type: 'link', // 分享类型,music、video或link，不填默认为link
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
    },

    getInitialState: function () {

        return {
        	source: {},
            featuretule: [],
            open_mask: false
        };
    },
    componentDidMount: function () {

       let self = this;

       let _id_data = this.GetRequest();
       let _tid = _id_data['tid'] || '26137527';

       this.getActivityData(_tid);
       

        this.getWechatConfig();//微信配置接口

       
        window.cur_page = 0;
        self.scrollHandle(); //up pull刷新

    },
    componentWillReceiveProps(nextprops){
       
    },
    componentDidUpdate(){
        
    },
    /*请求数据*/
    getActivityData(_tid){

        let self = this;
        
        $.ajax({    
            dataType: 'json',
            data: {
                    tid:_tid
                },
            url: 'http://hd.wecut.com/api/share/worksdetail.php',
            success: function(res){
                    self.setState({
                        source: res.data,
                        featuretule: res.data.featuretule
                    })
                }
        });
    },


    //up pull刷新
    scrollHandle(){

        let self = this;
        
        $("#app-root").scroll(function(){
            var $this =$(this),  
                 viewH =$(this).height(),//可见高度  
                 contentH =$(this).get(0).scrollHeight,//内容高度  
                 scrollTop =$(this).scrollTop();//滚动高度  
                 if(contentH>viewH){
                    $('.loadMore').show();
                    if((contentH - viewH - scrollTop) == 0) { //到达底部100px时,加载新内容  
                    //if(scrollTop/(contentH -viewH)>=0.95){ //到达底部100px时,加载新内容
                        
                        cur_page++;
                        setTimeout(function(){self.getPageData(cur_page)},1000);  
                        
                    }else{
                        return;
                    }
                 }
                
        })
    
    },

    //分页
    getPageData(_page){

        let self = this;

        $.ajax({
            dataType: 'json',
            data: {
                page: _page
            },
            url: 'http://hd.wecut.com/api/share/featureworks.php',
            success: function (res) {
                var _data = res.data;

                if(_data.length>0){
                    let featuretule = self.state.featuretule;
                    let _featuretule = featuretule.concat(_data);
                    self.setState({
                        featuretule: _featuretule
                    })
                }else{
                    $('.loadMore').hide();
                }

            }
        });
    },

    goLink(_tid){
        console.log(_tid);
        this.getActivityData(_tid);
    },

    isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    },

    openAppAttention(_id){

        let isWeiXin = this.isWeiXin();
        if(isWeiXin){
            this.setState({
                open_mask: true
            })
        }else{
            let which_app = platform();
            console.log(which_app,_id);
            if(which_app=='iOS'){
                window.location.href = 'wecut://itms-apps://opentule?tid='+_id;
            }
            if(which_app=="Android"){
                window.location.href = 'wecut://wekaka.app/opentule?tid='+_id;
            }
        }
    },
    maskHandle(){
        this.setState({
            open_mask: false
        })
    },
        
    render: function () {

    	/*let self = this;
    	if(this.state.loading){
    		return (
    				<p className="loading_section"></p>
    			)
    	}*/

        let self = this;
        let source = this.state.source,
            comments = source.comments||[],
            featuretule = this.state.featuretule||[],
            likeDatas = source.likeDatas||[],
            tule = source.tule||{},
            user = source.user||{};
    	console.log(featuretule);
        return (
            <div>
                <div className="container">
                <div className="centerContainer">
                    <div className="panel">

                        <div className="panelHeader">
                            <img className="icon" src={user.uavatar} />
                            <div className="nicknameSect">
                                <p className="nickname">{user.uname}</p>
                                <p className="beLike"><i className="icon-heart" ></i>Ta被LIKE过<span className="likeNum">{user.likenum}</span>次</p>
                            </div>
                            <div className="follow" onClick={self.openAppAttention.bind(null,tule.id)}><i className="icon-plus"></i>关注</div>
                        </div>

                        <TypeContent source={source} /> 

                        <div className="panelDesc">
                            <p className="_dec">{tule.desc}</p>
                        </div>
                        <div className="panelLike">
                            <span className="icon-heart-empty heartIcon " ></span>
                            <ul className="likeList">
                            {
                                likeDatas.map(function(item,key){
                                    return (
                                        <li key={key}><img className="likeIcon" src={item.uAvatar} alt=""/></li>
                                    )
                                })
                            }
                            </ul>
                            <span className="likeNum">{tule.likecount}</span>
                        </div>
                    </div>
                    
                    <CommentTypeContent source={source} />

                    <div className="guessYouLikeContainer"> 
                        <div className="guessYouLike">你可能会感兴趣的图</div>
                    </div>
                    <div className="picContainer ">
                        <ul id="pic_list" className="picList loadMoreGrid" >
                        {
                            featuretule.map(function(item,key){
                                return(
                                    <li className="picGrid" key={key} onClick={self.goLink.bind(null,item.id)}>
                                        <a><img className="pic" src={item.purl} /></a>
                                    </li>
                                )
                            })
                        }
                        </ul>
                    </div>
                    <div className="loadMore">加载更多</div>

                    <div className={this.state.open_mask?"mask shown":"mask hidden"} onClick={this.maskHandle}>
                        <p className="mask_dec">戳右上角，选择 <span className="open_this">"在其他浏览器中打开"</span> </p>
                        <p className="mask_dec">不见不散哦！</p>
                    </div>
                </div>
                </div>
                
            </div>
        );
    }
});

module.exports = ActivityPage;