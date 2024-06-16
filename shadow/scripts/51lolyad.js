var body = $response.body;
var data = body.replace("s.NF$.length!==0","!1");
body = data.replace("J.bwh(r,s.c)","var m3url=s.c\ns.c=m3url.replace('120play','long').replace('10play','long')\nJ.bwh(r,s.c)");
console.log('修改后数据：',body);
$done({body:body});
