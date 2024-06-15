var obj = $response.body;
if(obj.length!==0){
  obj = obj.replace("s.NF$.length!==0","!1")；
  obj = obj.replace("J.bwh(r,s.c)","var m3url=s.c,s.c=m3url.replace(m3url.split('.')[0],'https://long'),J.bwh(r,s.c)");
}
$done({body:obj});
