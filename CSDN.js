//移动端去除底部小程序打开按钮
GM_addStyle('.feed-Sign-weixin {display:none !important}');//小程序打开按钮
//解除复制限制
document.querySelectorAll("style").forEach((s)=>{if((s.innerText||"").indexOf('#content_views pre')>-1){s.parentElement.removeChild(s)}});
