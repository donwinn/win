var currentURL = $request.url,obj = JSON.parse($response.body);
if(currentURL.includes('advert')){
    if(Object.keys(obj.data).length!==0){
        Object.keys(obj.data).forEach(key =>{
          obj.data[key] = {};
        });
    };
}else if(currentURL.includes('index_recommend')){
    if(Object.keys(obj.data).length!==0){
        Object.keys(obj.data).forEach(key1 =>{
            if(obj.data[key1].layout == 'advert_self'){
                obj.data[key1].data.data = {};
            }else if(obj.data[key1].layout == 'index_recommend_carousel'){
                let relist = []; 
                Object.keys(obj.data[key1].list).forEach(key2=>{
                    if(obj.data[key1].list[key2].type !== 3){
                        relist.push(obj.data[key1].list[key2]);
                    }
                });
                obj.data[key1].list=relist;
            }
        });
    };
}
$done({body:JSON.stringify(obj)});
