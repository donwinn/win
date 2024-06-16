var body = $response.body;
var data = body.replace("s.NF$.length!==0","!1");//加载广告
body = data.replace("p.e7(0,\"oauth_id\")","null");//随机id
data = body.replace("r.fx=s==null?\"\":s","r.fx=s==null?\"\":s.replace(s.split(\"\.\")[0],\"https://long\")");//播放地址
console.log('修改后数据：',data);
$done({body:data});
