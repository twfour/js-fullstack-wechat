var express = require('express');
var router = express.Router();
const crypto=require('crypto');

/* GET home page. */
router.get('/wechat/hello', function(req, res, next) {
  res.render('index', { title: 'Hello wechat from aliyun ECS -->Express' });
});

const token ='A1aflZhWoRX0TmQObt0Z';



const handleWechatRequest = function(req,res,next){
        //const  {signature, timestamp,nonce,echostr}  = req.query;
        const signature=req.query.signature;
        const timestamp=req.query.timestamp;
        const nonce=req.query.nonce;
        const echostr=req.query.echostr;

        if(!signature||!timestamp||!nonce){
                return res.send('invalid request');
        }

	if(req.method == 'POST'){
		console.log('handleWechatRequest.post:',{body:req.body , query:req.query})
	}
	if(req.method == 'GET'){
		console.log('handleWechatRequest.get:',req.body);
		if(!echostr){
		return res.send('invalid request');}
	}
        const params=[token,timestamp,nonce];
        params.sort();

        const str= params.join('');
        const hash= crypto.createHash('sha1');
        const sign= hash.update(params.join('')).digest('hex');

        if(signature == sign) {
		if(req.method=='GET'){
		
        res.send(echostr?echostr:'invalid request');
        }else{
  	const tousername=req.body.xml.tousername[0].toString();		
  	const fromusername=req.body.xml.fromusername[0].toString();		
  	const createtime= Math.round(Date.now()/1000);		
  	const msgtype=req.body.xml.msgtype[0].toString();		
  	const content=req.body.xml.content[0].toString();		
  	//const msgid=body.xml.msgid[0].toString();		
	const response='<xml><ToUserName><![CDATA[ogFI-xIKS9i-fWyUPRQ-inVbXo8U]]></ToUserName><FromUserName><![CDATA[gh_c7ef7b217a41]]></FromUserName><CreateTime>${createtime}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[hello]]></Content></xml>';
	//const response='response';
	console.log('params are',tousername);
	console.log('params are',fromusername);
	console.log('params are',msgtype);
	res.set('Content-Type','text/xml');
	res.send(response);
	}}else{
        res.send('invalid request');
        }


};

router.get('/api/wechat',handleWechatRequest);
router.post('/api/wechat',handleWechatRequest);

module.exports = router;
