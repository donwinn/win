var body = $response.body;
var data = body.replace("s.NF$.length!==0","!1");
body = data.replace("J.bwh(r,s.c)","J.bwh(r,s.c.replace(s.c.split('.')[0].split('//')[1],'long'))");
console.log('修改后数据：',body);
$done({body:body});
