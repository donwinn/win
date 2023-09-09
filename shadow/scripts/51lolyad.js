var obj = $response.body;
if(obj){
  obj = obj.replace("s.NF$.length!==0","s.NF$.length==0");
  $done({body:obj});
}
