var body = $response.body;
var data = body.replace("s.NF$.length!==0","!1");
body = data.replace("p.e7(0,\"oauth_id\")","null");
console.log('修改后数据：',body);
$done({body:body});
