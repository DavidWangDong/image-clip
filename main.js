var hm = require('./src/js/hammer.min.js') ;
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

		}
	}

	// 预览对象(即选择预览框)
	// 事件处理
	class Previewer {
		constructor () {

		}
	}
	// 剪切对象:包括1、图片对象，2、遮罩层对象
	// 事件处理

	// 图片对象

	// 遮罩层对象

	
	// 图片生成对象

})(window)