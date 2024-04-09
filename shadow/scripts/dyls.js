var url = $response.url,obj = JSON.parse($response.body);
if(url.includes('advert')){
    if(Object.keys(obj.data).length!==0){
        Object.keys(obj.data).forEach(key =>{
          obj.data[key] = {};
        });
    };
}else if(url.includes('index_recommend')){
    if(Object.keys(obj.data).length!==0){
        Object.keys(obj.data).forEach(key1 =>{
            if(obj.data[key1].layout == 'advert_self'){
                obj.data[key1].data = {};
            }else if(obj.data[key1].layout == 'index_recommend_carousel'){
                let list = []; 
                Object.keys(obj.data[key1].list).forEach(key2=>{
                    if(obj.data[key1].list[key2].type !== 3){
                        list.push(key2);
                    }
                });
                obj.data[key1].list=list;
            }
        });
    };
}
$done({body:JSON.stringify(obj)});
