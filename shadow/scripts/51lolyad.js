var body = $response.body;
var data = body.replace("s.NF$.length!==0","!1");
body = data.replace("p.e7(0,\"oauth_id\")","null").replace("b.r&&b.f","b.f=!1,b.r=!1,!1");
console.log('修改后数据：',body);
$done({body:body});
