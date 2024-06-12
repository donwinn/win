var obj = $response.body;
if(Object.keys(obj).length!==0){
  obj = obj.replace("s.NF$.length!==0","false").replace("J.bwh(r,s.c)","J.bwh(r,s.c.replace(s.c.split('.')[0].split('//')[1],'long'))");
}
console.log('TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
$done({body:obj});
