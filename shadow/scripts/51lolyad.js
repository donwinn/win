var obj = $response.body;
if(obj.length!==0){
  obj = obj.replace("s.NF$.length!==0","!1")；
  obj = obj.replace("J.bwh(r,s.c)","s.c=s.c.replace(s.c.split('.')[0].split('//')[1],'long'),J.bwh(r,s.c)");
}
$done({body:obj});
