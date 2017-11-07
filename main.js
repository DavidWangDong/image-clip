var hm = require('./src/js/hammer.min.js') ;
const tmpStrs = require("./src/template/test/test.ejs");
window.hammer = hm;
(function (global){
	var  requireList = ['jQuery','hammer'];
	!!!requireList.validator&&(requireList.validator=function(){
		let dependent = this.every((cj)=>{
			if (!!!window[cj]){
				return false;
			}
			return true;
		})
		if (!!!dependent){
			throw Error('此插件依赖jquery和hammer,请检查依赖');
			return;
		}
	})
	requireList.validator();
	// 事件对象
	// 事件定制
	class Eventer  {
		constructor (){
			this.listenerList={};
		}
		addListener (obj,types) {
			if (!!!obj.el||!!!types){
				return;
			}
			
			var hm = this.listenerList[obj.name];
			let elType = Object.prototype.toString.call(obj.el)
			let eventType = Object.prototype.toString.call(types)
			console.log(elType)
			if (elType === '[object HTMLDivElement]'&&!!!hm){
				hm = new hammer(obj.el);
			} else if (elType === '[object Array]' && !!!hm){
				hm = obj.el.map((index,param)=>{
					return new hammer(param);
				})
			}
			
			if (!!hm && Object.prototype.toString.call(hm) ==='[object Object]'){
				
				!!types.length&&types.forEach((event)=>{
					this.step(hm,'on',event,(function (ev) {
						this['onC' + event](ev);
					}).bind(obj))
				})
				!!!types.length && this.step(hm, 'on', types, (function (ev){
					this['onC' + types](ev);
				}).bind(obj));
			}

			if (!!hm && Object.prototype.toString.call(hm) === '[object Array]'){
				hm.forEach((item,index)=>{
					types.length && types.forEach((event) => {
						this.step(item, 'on', event, (function (ev) {
							this['onC' + event](ev,index);
						}).bind(obj))
					})
					!!!types.length && this.step(item, 'on', types, (function (ev) {
						this['onC' + types](ev,index);
					}).bind(obj));
				})
			}
			this.listenerList[obj.name] = hm;
			
		}
		step (hm,types,event,call) {
			console.log(event)
			hm[types](event,function(ev){
				call&&call(ev);
			})
		}
		removeListener (obj,types){

		}
		
	}

	// 预览对象(即选择预览框)
	// 事件处理(1、长按，2、点击)
	class Previewer {
		constructor (options) {
			this.el=options.el||document.getElementsByClassName('img-clip-preview')[0];
			this.width=parseInt(options.width)||$(this.el).width()||100;
			this.height=parseInt(options.height)||$(this.el).height()||100;
			this.name = Date.now()+'';
			this.src ='https://tvax4.sinaimg.cn/default/images/default_avatar_male_180.gif';
			this.hasChoosed = false;
			$(this.el).width(this.width)
			$(this.el).height(this.height)
			$(this.el).empty();
			$(this.el).append('<img width="100%" height="100%" src="'+this.src+'">')

		}

		onCtap (ev) {
			var input = $('<input type="file">');
			input.trigger('click');
			input.on('change',(e)=>{
				var f = e.target.files[0];
				var src = window.URL.createObjectURL(f);
				this.setSrc(src);
			})
		}

		onCpress (ev){

		}

		setSrc (news) {
			if (news == this.src){
				return;
			}
			$(this.el).find('img').attr('src',news);
			this.src=news;
		}
		
	}

	// 剪切对象:包括1、图片对象，2、遮罩层对象
	// 事件处理

	// 图片对象

	// 遮罩层对象



	
	// 图片生成对象



	// 协调对象
	class Oprator {
		constructor(options){
			this.options=options||{};
			this.event = new Eventer();
			this.preview = new Previewer(this.options);
			this.event.addListener(this.preview,['tap','press']);
		}
	}

	window.Oprator=Oprator;

})(window);


var myClip = new Oprator();
console.log(myClip.event);