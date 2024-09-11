var obj = JSON.parse($response.body);
if(Object.keys(obj).length!==0){
   if (obj.data.attributes.adRead=='true'|obj.data.attributes.adRead==1){
       obj.data.attributes.adRead = 'false';
   }
};
$done({body:JSON.stringify(obj)});
