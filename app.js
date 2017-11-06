var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var crypto = require('crypto');

var routes = require('./routes/index');
var users = require('./routes/users');
// var  DB = require('./utils/dataBase.js');
// var  logger = require('./utils/log.js');
var app = express();

var env=app.get('env');





// 热更新
if ('dev'===env){
  var  config=require('./webpack.config.js');
  
  var  webpack=require('webpack');
  var  webpackDevMiddleWare=require('webpack-dev-middleware');
  var  webpackHotMiddleWare=require('webpack-hot-middleware');
  var compiler = webpack(config);

  app.use(webpackDevMiddleWare(compiler,{
    publicPath:config.output.publicPath,
    noInfo:true,
    stats:{
      colors:true
    },
    quiet:false
  }));
  var hotMiddle = webpackHotMiddleWare(compiler,{
    log:false,
    heartBeat:2000
  });
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddle.publish({ action: 'reload' });  
        cb();  
      })  
  })  
  app.use(hotMiddle);
  app.listen(8000);
}else{

  let dbOp = new DB();
  let logs = new logger();
  console.log(dbOp.select().then((val)=>function(){
  	console.log(val);
  }).catch((err)=>{
  	console.log(err);
  }));
  dbOp.select('users');
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  // app.use(logger('pro'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(function(req,res,next){
    let  str = 
      `ip:地址为:${req.ip}`+'\r\n'+
      `originalUrl:请求链接:${req.originalUrl}`+'\r\n'+
      `path:请求地址:${req.path}`+'\r\n'+
      `query:请求参数(GET):${JSON.stringify(req.query)}`+'\r\n'+
      `body:请求参数(GET):${JSON.stringify(req.body)}`+'\r\n'+
      `params:参数:${JSON.stringify(req.params)}`+'\r\n'+
      `type:请求类型:${req.xhr?'ajax':'普通'}`+'\r\n'
        
    logs.loged(str+'\r\n\r\n');
    next();
  })
  app.use('/dist',express.static(__dirname+'/dist'));
  app.use('/', routes);
  app.use('/users', users);
  // app.get('/wx',function(req,res){
  // 	let {signature,timestamp,nonce,echostr} =  req.query;
  // 	let token = 'techerWeixin';
  // 	let list=[token,timestamp,nonce];
  // 	list.sort();
  // 	let tmpStr = list.join('');
  // 	let sha1 = crypto.createHash('sha1');
  // 	let hashCode = sha1.update(tmpStr,'utf-8').digest('hex');
  // 	hashCode == signature?res.end(echostr):res.end('false');
  // })
  // app.post('/wx',function(req,res){
  // 	console.log(req);
  // })

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

app.listen(8090);

}


module.exports = app;
