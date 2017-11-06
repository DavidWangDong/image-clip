const Vue = require('../js/vue.min.js');
const fixtPage = require('./fixtPage.js');
console.log(Vue)
Vue.component('page-first',{
	template: '#page1',
	mounted:function(){
		fixtPage();
		
	},
	data:function(){
		return {
			scroller:null,
		}
	},
	
	methods:{
		
	}
})

Vue.component('page-second',{
	template: '#page2',
	data:function(){
		return {

		}
	},
	computed:{
		showLocation:function(){
			
			return this.$parent.uploadInfo.serverId?true:false;
		},
		getList:function(){
			return this.$parent.list;
		},
		
	},
	methods:{
		getSrc:function(type){
			console.log(type);
			return this.$parent.infoList[type].src;
		},
		showOther:function(val){
			this.$parent.currInfo=JSON.parse(JSON.stringify(val));
			this.$emit('showmodal','other');
		}
	}

})
module.exports=Vue;