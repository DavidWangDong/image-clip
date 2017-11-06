module.exports=function fixHeight(){

	var _oh=window.innerHeight/1136;
	var _oW = window.innerWidth/640;//获取屏幕尺寸相对于设计稿尺寸比例
	var r=_oh<_oW?_oh:_oW;
	if(_oW>1){
		$('html').css('font-size','100px');//更改根尺寸
	}
	else{
		$('html').css('font-size',100*_oW+'px');//更改根尺寸
	}
	var _oW = document.body.offsetWidth / 640;
	
	$("body").height( window.innerHeight ); //修正整数页面高度
}