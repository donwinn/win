// ==UserScript==
// @name         CSDN移动端
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化页面
// @author       You
// @match        https://*.csdn.net/*
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_addStyle
// ==/UserScript==

//解除复制限制
document.querySelectorAll("style").forEach((s)=>{if((s.innerText||"").indexOf('#content_views pre')>-1){s.parentElement.removeChild(s)}});
//小程序打开按钮
GM_addStyle('.feed-Sign-weixin {display:none !important}');
