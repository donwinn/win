var body = $response.body;
if($request.url.includes('posts/')|$request.url.includes('wx-set')){
   var obj = JSON.parse(body);
   if (obj.data.attributes.adRead){
      obj.data.attributes.adRead = 'false';
   }else if(obj.data.attributes.adSwitch){
      obj.data.attributes.adSwitch = 'false';
      obj.data.attributes.jiliAd = '';
      obj.data.attributes.chapingAd = '';
      obj.data.attributes.videoAd = ''
   }
   body = JSON.stringify(obj);
};
$done({body});

