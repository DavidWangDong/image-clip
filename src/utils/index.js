const fixtPage = require('./fixtPage.js');
const Vue = require('./main.js');
require('../css/iconfont.css');
require('../css/animation.css');

var myVue=new Vue({
		el:'#app',
		data:{
			viewList:['page-first','page-second','page-three'],
			view:'page-first',
			modalView:'shuoMing',
		isShowModal:true,
		inpuMessage:'',
		resImg:'',
		scroller:null,
		scroller2:null,
		selectType:0,
		wxReadyFlag:false,
		wx:null,
		infoList:[
			{src:'http://n.sinaimg.cn/ah/865fe30d/20170927/Deng3.png',name:'常伴左右-安徽农金灯'},
			{src:'http://n.sinaimg.cn/ah/865fe30d/20170927/Deng2.png',name:'惊喜不断-社区e银行灯'},
			{src:'http://n.sinaimg.cn/ah/865fe30d/20170927/Deng1.png',name:'方便快捷-金农信e付灯'},
			{src:'http://n.sinaimg.cn/ah/865fe30d/20170927/Deng4.png',name:'行思坐忆-融融灯'},
		],
		selectedInfo:{src:'http://n.sinaimg.cn/ah/865fe30d/20170927/Deng1.png',name:'方便快捷-金农信e付灯'},
		voiceInfo:{
			localId:'',
			isRecording:false,
			serverId:'',
			isPlaying:false,
		},
		prePlay:false,
		readyUp:false,
		touchFlag:false,
		uploadInfo:{
			type:0,
			name:'<%= htmlWebpackPlugin.options.userName %>',
			uuid:'<%= htmlWebpackPlugin.options.userId %>',
			serverId:'',
			uid:''
		},
		list:[],
		currInfo:{
			type:0,
			name:'',
			uuid:'',
			serverId:''
		},
		playingLocalId:'',
		currUid:'<%= htmlWebpackPlugin.options.userId %>'
		},
		mounted:function(){
			var that=this;
			if (this.currUid){
				$.ajax({
			url:'./api.php?action=getVoiceByUid',
			data:{uid:this.currUid},
			type:'GET',
			dataType:'json',
			success:function(data){
					if (data.data){
						that.currInfo.type=data.data.type;
						that.currInfo.serverId=data.data.voice_id;
						that.currInfo.name=data.data.name;
						that.currInfo.uuid=data.data.uuid;
						setTimeout(function(){
							that.toNext();
							setTimeout(function(){
								that.showModal('other');
							},1500)
						})
					}
				}
			})
			}
		},
		created:function(){
			// 获取当前用户的数据
			var that=this;
			$.ajax({
			url:'./api.php?action=getVoice',
			data:{uid:'<%= htmlWebpackPlugin.options.userId %>'},
			type:'GET',
			dataType:'json',
			success:function(data){
				if (data.data){
					that.uploadInfo.type=data.data.type;
					that.uploadInfo.uid=data.data.id;
					that.uploadInfo.serverId=data.data.voice_id;
				}
			}
		})
		// 获取列表
		$.ajax({
			url:'./api.php?action=getList',
			data:{limit:10},
			type:'GET',
			dataType:'json',
			success:function(data){
				if (data.data&&data.data.length>0){
					data.data.forEach(function(val,index){
						that.list.push({type:val.type,name:val.name,uuid:val.uuid,serverId:val.voice_id})
					})
				}
			}
		})
		},
		directives:{
		scroll:{
			inserted:function(el,binding,vnode){
				
				vnode.context.scroller=new IScroll('#wrap',{
					scrollbars:false,
					scrollX:false,
					probeType: 3
				});
				vnode.context.isShowModal=false;
				vnode.context.modalView='';
				
			}
		},
		scrollx:{
			inserted:function(el,binding,vnode){
				
					vnode.context.scroller2=new IScroll('#wrap2',{
						scrollbars:false,
						scrollX:true,
						scrollY:false,
						probeType: 3,
						bounce:false,
						snap: true
					});
					vnode.context.scroller2.on('scrollEnd',function(){
						var index=this.currentPage.pageX;
						vnode.context.selectType=index;
						vnode.context.selectedInfo=JSON.parse(JSON.stringify(vnode.context.infoList[index]));
					})

			}
		}
	},
	filters:{
		showWord:function(flag){
			return flag?'试听我的录音':'长按录制我的思念/祝福(最多录制时长一分钟哦)';
		}
	},
		methods:{
			toNext:function(){
				var index=this.viewList.indexOf(this.view);
				if (index<this.viewList.length-1){
					this.view=this.viewList[index+1]
				}else{
					this.view=this.viewList[0];
				}

			},
			afterLeave:function(){
				this.showModal('detail');
			},
			slidePrev:function(){

				if (this.selectType>0){

					this.scroller2.goToPage(--this.selectType,0);
				}
			},
			slideNext:function(){
				console.log(this.selectType);
				if (this.selectType<this.scroller2.pages.length){
					this.scroller2.goToPage(++this.selectType,0);
				}
			},
			showModal : function(type){
				this.stopPlay();
			this.isShowModal=true;
			this.modalView=type;
			var that=this;
			if (type=='selectDeng'){
				setTimeout(function(){
					that.scroller2.refresh();
				},100)
			}
			if (type=="sureDeng"){
				this.clearInfo();
			}
			if (type=='shareMsg'&&this.share&&this.uploadInfo.uid){
				this.share(this.uploadInfo.uid);
			}
		},
		hideModal: function(){
			this.modalView='';
			this.isShowModal=false;
			
		},
		hideSelf:function(){
			var arr=['shareMsg'];
			if (arr.indexOf(this.modalView)>-1){
				this.hideModal();
			}
		},
		clearInfo:function(){
			this.voiceInfo={
				localId:'',
				isRecording:false,
				serverId:'',
				isPlaying:false,
			}
			this.prePlay=false
			this.readyUp=false
		},
		goback:function(){
			this.hideModal();
		},
		startRecord:function(){
			this.touchFlag=true;
			var  that =this;
			if (this.prePlay&&this.voiceInfo.localId!==''){
				if (!that.voiceInfo.localId){
					alert('尚未录音');
					return;
				}
				this.voiceInfo.isPlaying=true;
				this.playingLocalId=this.voiceInfo.localId;
				this.wx.playVoice({
			      localId: that.voiceInfo.localId
			    });
			    this.wx.onVoicePlayEnd({
				    complete: function (res) {
				      that.voiceInfo.isPlaying=false;
				    }
			    });
			    return;
			}
			setTimeout(function(){
				if (!that.touchFlag){
					return;
				}
				that.voiceInfo.isRecording=true;
				that.wx.startRecord({
			      cancel: function () {
			      	that.voiceInfo.isRecording=false;
			      }
			    });
			    that.wx.onVoiceRecordEnd({
				    complete: function (res) {	    	
				        that.voiceInfo.localId=res.localId;
				        that.voiceInfo.isRecording=false;
				        that.readyUp=true;
				        that.prePlay=true;
			            alert('录音完成');
				    }
				  });
			},200)
		},
		endRecord:function(){
			this.touchFlag=false;
			var that=this;
			if (this.prePlay){
				return;
			}
			if (!this.voiceInfo.isRecording){
				return;
			}
			this.wx.stopRecord({
		      success: function (res) {
		        that.voiceInfo.localId=res.localId;
		        that.voiceInfo.isRecording=false;
		        that.readyUp=true;
		        that.prePlay=true;
	            alert('录音完成');
		      },
		      fail: function (res) {
		        that.voiceInfo.isRecording=false;
		      }
		    });
		},
		uploadVoice:function(){
			this.uploadInfo.type=this.selectType;
			var that=this;
			this.wx.uploadVoice({
				localId:this.voiceInfo.localId,
				success:function(res){
					that.voiceInfo.serverId = res.serverId;
					that.uploadInfo.serverId = res.serverId;
					that.doSubForm();
				}
			});
		},
		share:function(){
		},
		doSubForm:function(){
			var  that=this;
			$.ajax({
				url:'./api.php?action=uploadVoice',
				data:{voiceID:this.uploadInfo.serverId,type:this.uploadInfo.type},
				type:'POST',
				dataType:'json',
				success:function(data){
					if (data.error!=0){
						return;
					}
					alert('上传成功！');
					that.uploadInfo.uid=data.data;
					that.showModal('preView');
				}
			})
			
		},
		stopAndhide:function(){
			this.hideModal();
			this.stopPlay();
		},
		stopPlay:function(){
			
			if (this.playingLocalId){
				this.wx.stopVoice({
					localId:this.playingLocalId
				})
				this.playingLocalId='';
			}

		},
		playServerSound:function(id){
			var that=this;
			if (id){
				console.log(id);
				this.wx.downloadVoice({
					serverId: id,
					success:function(res){
						that.playingLocalId=res.localId;
						var localId = res.localId;
						that.wx.playVoice({
					      localId: localId
					    });
					}
				})
			}
		}
		}
	})
	// wx.ready(function(){
	// 	myVue.wx=wx;
	// 	// myVue.share=function(){

	// 	// }
	// })
fixtPage();