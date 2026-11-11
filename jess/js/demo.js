(function () {
    'use strict';

    /* ================= 配置区 ================= */
    var CFG = {
        loadingTimeout: 30,             // 加载超时（秒）
        loadingTimeoutReplayTimes:5,    // 加载超时自动重播次数
        heartTimeout: 10,               // 心跳超时（秒）
        heartTimeoutReplayTimes:5,      // 心跳超时自动重播次数
        probeTimeout: 8000,
        rebuildGap: 100,
        audioWait: 3000,
        decoderJs: './js/decoder.js',
        decodingDir: './js/',
        storeKey: 'jessibuca_last_url',
        storeMute: 'jessibuca_muted',
        storeVolume: 'jessibuca_volume',
        BeforVolume: 0,
        blockhost:['pl.ycscts.com']
    };

    /* ================= DOM ================= */
    function $(id) { return document.getElementById(id); }

    var videoArea = document.querySelector('.video-area');
    var containerEl = $('jessibuca-container');
    var urlInput = $('streamUrl');
    var playBtn = $('playBtn');
    var stopBtn = $('stopBtn');
    var muteBtn = $('muteBtn');
    var diagBtn = $('diagBtn');
    var statusLed = $('statusLed');
    var statusMsg = $('statusMsg');
    var toastEl = $('toastMsg');
    var pasteBtn = $('pasteUrlBtn');
    var parseBtn = $('parseUrlBtn');
    var dynBtns = $('dynBtns');

    /* ================= 状态 ================= */
    var player = null;
    var currentUrl = '';
    var muted = true;
    var manualStop = false;
    var toastTimer = null;
    var playSeq = 0;
    var hasAudio = null;
    var audioTimer = null;

    var listMode = false;
    var activeName = '';

    var ERR_TEXT = {
        playError: ['地址为空', '调用 play() 时 URL 是空的'],
        fetchError: ['HTTP 拉流失败', '多为跨域未放行、auth_key 过期(403) 或地址不可达'],
        websocketError: ['WS 拉流失败', 'ws/wss 地址错误，或服务端拒绝握手'],
        httpError: ['HTTP 状态异常', '服务器返回了非 2xx 状态码'],
        wasmDecodeError: ['软解失败', '码流编码不受支持，或 decoder.wasm 没加载到'],
        mediaSourceH265NotSupport: ['MSE 不支持 H.265', '浏览器 MSE 解不了 H.265'],
        webcodecsH265NotSupport: ['硬解不支持 H.265', '当前浏览器 WebCodecs 不支持 H.265'],
        webcodecsDecodeError: ['硬解失败', '正常应自动降级软解，仍失败请查码流'],
        notSupported: ['格式不支持', '容器或编码不被支持'],
        unknown: ['未知错误', '打开 F12 控制台看详细日志']
    };

    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    function tip(msg, isError) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.style.background = isError ? '#dc2626cc' : '#1e253ecc';
        toastEl.style.color = isError ? '#fff0e0' : '#c0d0ff';
        toastEl.style.borderColor = isError ? '#ff8a6f' : '#3d4570';
        toastEl.classList.toggle('at-top', !!isError);
        toastEl.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toastEl.classList.remove('show');
            setTimeout(function () { if (!toastEl.classList.contains('show')) toastEl.classList.remove('at-top'); }, 220);
        }, isError ? 4500 : 2200);
    }

    function setStatus(state, msg) {
        statusMsg.textContent = msg;
        statusLed.className = 'led';
        if (state === 'connecting') statusLed.classList.add('yellow');
        else if (state === 'playing') statusLed.classList.add('green');
        else if (state === 'error') statusLed.classList.add('red');
    }

    /* ================= 占位遮罩控制 ================= */
    function showPlaceholder(text) {
        var overlay = $('placeholderOverlay');
        var txt = $('placeholderText');
        if (txt) txt.textContent = text || '等待播放';
        if (overlay) overlay.classList.remove('hidden');
    }

    function hidePlaceholder() {
        var overlay = $('placeholderOverlay');
        if (overlay) overlay.classList.add('hidden');
    }

    /* ================= 容器与播放器实例 ================= */
    function freshContainer() {
        var old = document.getElementById('jessibuca-container');
        var next = document.createElement('div');
        next.id = 'jessibuca-container';
        next.style.width = '100%';
        next.style.height = '100%';

        if (old && old.parentNode) {
            old.parentNode.replaceChild(next, old);
        } else if (videoArea) {
            videoArea.appendChild(next);
        }
        containerEl = next;
        return next;
    }

    function initPlayer() {
        if (player) return player;

        if (!containerEl || !containerEl.parentNode) {
            freshContainer();
        }

        player = new Jessibuca({
            container: containerEl,
            autoplay: true,
            isResize: true,
            useMSE: false,
            useWCS: false,
            videoBuffer: 0.5,
            supportDblclickFullscreen: true,
            loadingText: '加载中...',
            decoder: CFG.decoderJs,
            decodingPath: CFG.decodingDir,
            showBandwidth: true,
            controlAutoHide: true,
            // loadingTimeoutReplay: true,
            loadingTimeout: CFG.loadingTimeout,
            loadingTimeoutReplayTimes:CFG.loadingTimeoutReplayTimes,
            // heartTimeoutReplay: true,
            heartTimeout: CFG.heartTimeout,
            heartTimeoutReplayTimes:CFG.heartTimeoutReplayTimes,
            isNotMute: !muted,
            debug: false,
            operateBtns: {
                fullscreen: true,
                screenshot: false,
                play: true,
                audio: true,
                recorder: false
            }
        });

        bindEvents();
        updateMuteBtn();
        return player;
    }

    async function readClipboardText() {
        if (!navigator.clipboard || !navigator.clipboard.readText) {
            tip('当前环境不支持一键读取剪贴板，请手动粘贴', true);
            return null;
        }
        try {
            var text = ((await navigator.clipboard.readText()) || '').trim();
            if (!text) { tip('📭 剪贴板为空', true); return null; }
            return text;
        } catch (err) {
            var msg = '无法读取剪贴板，请手动粘贴';
            if (err && err.name === 'NotAllowedError') msg = '🔒 剪贴板权限被拒，请手动 Ctrl+V';
            if (err && err.name === 'SecurityError') msg = '🔒 需要 HTTPS 或 localhost 才能读剪贴板';
            tip(msg, true);
            return null;
        }
    }

    function parseAddressList(text) {
        if (!text) return null;
        var t = String(text).replace(/^\uFEFF/, '').trim();
        if (t.charAt(0) !== '{') return null;

        var obj;
        try { obj = JSON.parse(t); } catch (e) { return null; }
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;

        var keys = Object.keys(obj);
        if (!keys.length) return null;

        var list = [];
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var v = obj[k];
            if (typeof v !== 'string' || !v.trim()) return null;
            var url = v.trim();
            if (!isAllowedHost(url)) continue;
            list.push({ name: k, url: v.trim() });
        }
        return list;
    }

    function isAllowedHost(url) {
        try {
            var u = new URL(url);
            return CFG.blockhost.includes(u.hostname.toLowerCase());
        } catch (e) {
            return false;
        }
    }

    function setListMode(on) {
        listMode = !!on;
        playBtn.style.display = on ? 'none' : '';
        stopBtn.style.display = on ? 'none' : '';
        dynBtns.style.display = on ? 'flex' : 'none';
        if (!on) dynBtns.innerHTML = '';
    }

    function exitListMode() {
        if (listMode) setListMode(false);
    }

    function highlightByName(name) {
        if (!dynBtns) return false;
        var btns = dynBtns.querySelectorAll('.dyn-btn');
        var found = false;
        for (var i = 0; i < btns.length; i++) {
            var on = !!name && btns[i].dataset.name === name;
            if (on) { btns[i].classList.add('active'); found = true; }
            else { btns[i].classList.remove('active'); }
        }
        return found;
    }

    function renderListButtons(list) {
        dynBtns.innerHTML = '';
        setListMode(true);

        var matchEl = null;

        list.forEach(function (item) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn dyn-btn';
            b.textContent = item.name;
            b.title = item.name + ' → ' + item.url;
            b.dataset.name = item.name;
            b.dataset.url = item.url;

            b.addEventListener('click', function () {
                if (player && currentUrl === item.url && activeName === item.name) {
                    stopPlay();
                    tip('已停止：' + item.name);
                    return;
                }
                startPlay(item.url, true, item.name);
            });

            dynBtns.appendChild(b);

            if (activeName && item.name === activeName && item.url === currentUrl) {
                matchEl = b;
            }
        });

        if (activeName && !matchEl) {
            activeName = '';
            if (player) setStatus('playing', '播放中');
        }
        if (matchEl) matchEl.classList.add('active');
    }

    async function parseAndPlayFromClipboard() {
        var text = await readClipboardText();
        if (!text) return;

        var list = parseAddressList(text);
        if (list) {
            if (!list.length) {
                tip('地址组里没有可播放的链接，未生成按钮', true);
                return;
            }
            renderListButtons(list);
            setStatus('idle', '已解析 ' + list.length + ' 个地址');
            tip('✅ 已解析 ' + list.length + ' 个地址，点击按钮即可播放');
            return;
        }

        if (/^(https?|wss?):\/\//i.test(text)) {
            exitListMode();
            urlInput.value = text;
            urlInput.dispatchEvent(new Event('input', { bubbles: true }));
            tip('剪贴板是单个地址，按普通模式播放');
            startPlay(text);
            return;
        }

        tip('剪贴板内容不是 {"名字":"地址"} 形式的地址组，也不是合法地址', true);
    }

    /* ================= auth_key 过期体检 ================= */
    function parseAuthKey(url) {
        var m = /[?&]auth_key=(\d{10})-/i.exec(url);
        if (!m) return null;
        var ts = Number(m[1]) * 1000;
        var d = new Date(ts);
        var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
        return {
            ts: ts,
            expired: Date.now() > ts,
            text: d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
                ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
        };
    }

    function probeStream(url) {
        var ac = new AbortController();
        var timer = setTimeout(function () { ac.abort(); }, CFG.probeTimeout);
        return fetch(url, {
            method: 'GET', mode: 'cors', cache: 'no-store',
            credentials: 'omit', signal: ac.signal
        }).then(function (res) {
            var info = {
                ok: res.ok, status: res.status,
                contentType: res.headers.get('content-type') || ''
            };
            ac.abort();
            return info;
        }).catch(function (err) {
            return {
                ok: false, status: 0,
                netError: (err && err.name ? err.name : 'Error') + ': ' + (err && err.message ? err.message : '')
            };
        }).then(function (r) { clearTimeout(timer); return r; });
    }

    function explainProbe(r, url) {
        if (r.status === 200) {
            return {
                ok: true, msg: '服务器返回 200，跨域也放行了。地址本身没问题，可点播放。' +
                    (r.contentType ? '（Content-Type: ' + r.contentType + '）' : '')
            };
        }
        if (r.status === 401 || r.status === 403) {
            var tk = parseAuthKey(url);
            return {
                ok: false, msg: '服务器返回 ' + r.status + '，链接被拒绝。' +
                    (tk ? 'auth_key 过期时间为 ' + tk.text +
                        (tk.expired ? '，已经过期，请回平台重新生成！' : '，尚未过期，检查签名/防盗链/白名单。') : '')
            };
        }
        if (r.status === 404) {
            return { ok: false, msg: '服务器返回 404，路径写错了，检查设备号、_b3 后缀和端口。' };
        }
        if (r.status === 0 && r.netError) {
            return {
                ok: false, msg: '请求在浏览器层就失败了（' + r.netError + '）。' +
                    '典型原因是跨域未放行或协议不一致（https 页面拉 http 流）。需用本地代理绕过。'
            };
        }
        return { ok: false, msg: '返回状态 ' + r.status + '，请对照 F12 Network 面板确认。' };
    }

    async function diagnose() {
        var url = urlInput.value.trim();
        if (!url) { tip('先填一个流地址再检测', true); return; }

        var tk = parseAuthKey(url);
        if (tk && tk.expired) tip('⚠️ auth_key 已于 ' + tk.text + ' 过期，这条链接必定失败', true);

        setStatus('connecting', '检测中...');
        tip('正在探测服务器响应头，请稍候...');
        diagBtn.disabled = true;
        try {
            var r = await probeStream(url);
            console.log('[probe]', url, r);
            var e = explainProbe(r, url);
            tip(e.msg, !e.ok);
            setStatus(e.ok ? 'idle' : 'error', e.ok ? '地址可用' : '检测未通过');
        } finally {
            diagBtn.disabled = false;
        }
    }

    function normalizeError(err) {
        if (!err) return { type: 'unknown', raw: '' };
        if (typeof err === 'string') return { type: err, raw: err };
        return {
            type: err.type || err.name || err.errorType || 'unknown',
            raw: err.message || err.msg || JSON.stringify(err)
        };
    }

    function handleError(err) {
        if (manualStop) {
            console.warn('[jessibuca error] 处于手动停止状态，忽略', err);
            return;
        }
        var info = normalizeError(err);
        var dict = ERR_TEXT[info.type] || ERR_TEXT.unknown;
        console.error('[jessibuca error]', info.type, err);

        setStatus('error', dict[0]);
        diagBtn.style.display = '';
        var extra = '';
        if (info.type === 'fetchError') {
            extra = ' 排查顺序：① 重新生成链接（auth_key 会过期）② 用「检测」看是否跨域 ③ 本地代理绕过';
        }
        tip('❌ ' + dict[0] + '：' + dict[1] + extra, true);
    }

    function applyMute(want) {
        if (!player) return false;

        var ok = false;
        try {
            if (want) {
                if (player.player.volume !== 0) { CFG.BeforVolume = Number(player.player.volume.toFixed(2)) }
                if (typeof player.mute === 'function') { player.mute(); ok = true; }
            } else {
                if (typeof player.cancelMute === 'function') { player.cancelMute(); ok = true; }
                if (typeof player.audioResume === 'function') { player.audioResume(); }
                if (typeof player.setVolume === 'function') { player.setVolume(CFG.BeforVolume || 0.2); ok = true; }
            }
        } catch (e) {
            console.warn('切换音量异常', e);
        }
        return ok;
    }

    function readRealMute() {
        if (!player) return null;
        try {
            if (typeof player.isMute === 'function') return !!player.isMute();
        } catch (e) { }
        return null;
    }

    function updateMuteBtn() {
        if (!muteBtn) return;
        muteBtn.textContent = muted ? '🔊取消静音' : '🔇静音';
        muteBtn.classList.toggle('is-muted', muted);
    }

    function toggleMute() {
        if (!player) {
            tip('播放器未启动，先点播放再静音', true);
            return;
        }

        var want = !muted;
        var applied = applyMute(want);

        if (!applied) {
            tip('当前播放器版本没有 mute / setVolume 方法，无法控制音量', true);
            return;
        }

        muted = want;
        try { localStorage.setItem(CFG.storeMute, muted ? '1' : '0'); } catch (e) { }
        updateMuteBtn();

        var real = readRealMute();
        if (real !== null && real !== muted) {
            muted = real;
            updateMuteBtn();
            tip('音量控制未生效（' + (real ? '仍为静音' : '仍非静音') + '），可能是流本身没有音轨', true);
            return;
        }

        if (!muted && hasAudio === false) {
            tip('已取消静音，但这条流没有音轨，所以听不到声音', true);
            return;
        }

        tip(muted ? '已静音' : (hasAudio === false ? '已取消静音（该流无音轨）' : '已取消静音'));
    }

    function saveVolume(v) {
        if (typeof v !== 'number') return;
        if (!(v > 0)) return;
        CFG.BeforVolume = Math.min(1, Math.max(0.01, v));
        clearTimeout(CFG._volSaveTimer);
        CFG._volSaveTimer = setTimeout(function () {
            try { localStorage.setItem(CFG.storeVolume, String(CFG.BeforVolume)); } catch (e) { }
        }, 300);
    }

    function startAudioTimer() {
        clearTimeout(audioTimer);
        audioTimer = setTimeout(function () {
            if (hasAudio === null) {
                hasAudio = false;
                console.warn('[音频] 未收到音轨信息，判定该流无音频');
            }
        }, CFG.audioWait);
    }

    function bindEvents() {
        player.on('volume', function (v) {
            if (v !== 0) {
                muted = false;
                updateMuteBtn();
            }
            if (!muted && v !== 0.5) {
                saveVolume(v);
            } else return
        });

        player.on('load', function () {

        });

        player.on('play', function () {
            hidePlaceholder();
            setStatus('playing', activeName ? ('播放中：' + activeName) : '播放中');
            if (muted) {
                applyMute(true)
            } else player.setVolume(CFG.BeforVolume);
        });

        player.on('error', handleError);

        player.on('timeout', function () {
            if (manualStop) return;
            console.warn('[事件] 流超时');
            diagBtn.style.display = '';
            tip(`⚠️连接超时，播放器将在${CFG.loadingTimeout}秒后自动重试`, true);
            showPlaceholder(`连接超时,${CFG.loadingTimeout}秒后自动重试`);
            try {
                player.destroy();
                player = null;
                setTimeout(() => startPlay(currentUrl), CFG.loadingTimeout*1000);
            } catch (e) {console.warn('销毁旧播放器异常', e);}
        });

        player.on('audioInfo', function (info) {
            hasAudio = true;
            console.log('[事件] 音频信息', info);
        });

        player.on('videoInfo', function (info) { console.log('[事件] 视频信息', info); });
        player.on('loadmetadata', function () { console.log('[事件] 已获取流元信息'); });
    }

    async function startPlay(url, isobjmode, name) {
        url = (url || '').trim();
        if (!url) { tip('❌ 请输入有效的直播流地址', true); return; }
        if (typeof Jessibuca === 'undefined') {
            setStatus('error', '库加载失败');
            tip('❌ Jessibuca 未加载，请检查 ./js/jessibuca_v3.3.27.js 路径', true);
            return;
        }

        manualStop = false;
        if (isobjmode) {
            activeName = name || '';
            highlightByName(activeName);
        }

        var tk = parseAuthKey(url);
        if (tk && tk.expired) tip('⚠️该链接 auth_key 已于 ' + tk.text + ' 过期，播放大概率直接 403', true);

        var seq = ++playSeq;

        currentUrl = url;
        urlInput.value = url;
        try { localStorage.setItem(CFG.storeKey, url); } catch (e) { }

        clearTimeout(audioTimer);
        audioTimer = null;
        hasAudio = null;

        hidePlaceholder();
        setStatus('connecting', '正在加载...' + (activeName ? '（' + activeName + '）' : ''));

        try {
            if (!player) {
                initPlayer();
            }
            if (seq !== playSeq) return;

            startAudioTimer();

            var p = player.play(url);
            if (p && typeof p.catch === 'function') {
                p.catch(function (e) {
                    console.warn('play() 调用失败', e);
                    handleError(normalizeError(e).raw || e);
                });
            }
        } catch (e) {}
    }

    function stopPlay() {
        manualStop = true;
        playSeq++;

        clearTimeout(audioTimer);
        audioTimer = null;
        hasAudio = null;

        currentUrl = '';
        activeName = '';
        highlightByName('');

        if (player) {
            try {
                if (typeof player.pause === 'function') player.pause();
            } catch (e) {
                console.warn('停止播放异常', e);
            }
        }

        showPlaceholder('播放已停止');
        setStatus('idle', listMode ? '已停止，点上方按钮继续' : '已停止');
    }

    /* ================= 粘贴单个地址 ================= */
    async function pasteFromClipboard() {
        var text = await readClipboardText();
        if (!text) { urlInput.focus(); return}
        if(currentUrl === text) {return}
        exitListMode();
        urlInput.value = text;
        urlInput.dispatchEvent(new Event('input', { bubbles: true }));
        urlInput.focus();
        urlInput.setSelectionRange(text.length, text.length);
        startPlay(text);
    }

    /* ================= 初始化 ================= */
    function init() {
        var param = new URLSearchParams(location.search).get('url');
        if (param) {
            urlInput.value = param;
        } else {
            try {
                var last = localStorage.getItem(CFG.storeKey);
                if (last) urlInput.value = last;
            } catch (e) { }
        }

        try {
            var v0 = parseFloat(localStorage.getItem(CFG.storeVolume));
            if (!isNaN(v0) && v0 > 0 && v0 <= 1) CFG.BeforVolume = v0;
            if (localStorage.getItem(CFG.storeMute) === '1') muted = true;
        } catch (e) { }

        freshContainer();
        initPlayer();

        showPlaceholder('请输入 FLV / WS 地址后点击播放');
        setStatus('idle', '待机');

        playBtn.addEventListener('click', function () { startPlay(urlInput.value); });
        stopBtn.addEventListener('click', stopPlay);
        muteBtn.addEventListener('click', toggleMute);
        diagBtn.addEventListener('click', diagnose);

        if (parseBtn) {
            parseBtn.addEventListener('click', function (e) {
                e.preventDefault();
                parseAndPlayFromClipboard();
            });
        }

        if (pasteBtn) {
            pasteBtn.setAttribute('title', '从剪贴板粘贴单个地址并直接播放');
            pasteBtn.addEventListener('click', function (e) {
                e.preventDefault();
                pasteFromClipboard();
            });
        }

        urlInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); startPlay(urlInput.value); }
        });

        urlInput.addEventListener('click', async function () {
            var text = urlInput.value.trim();
            if (!text) return;

            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(text);
                    tip('📋地址已复制');
                } else {
                    urlInput.select();
                    var successful = document.execCommand('copy');
                    if (successful) {
                        tip('📋地址已复制');
                    } else {
                        tip('❌ 复制失败，请手动选择复制', true);
                    }
                    var len = text.length;
                    urlInput.setSelectionRange(len, len);
                }
            } catch (err) {
                console.warn('复制异常', err);
                if (err.name === 'NotAllowedError' || err.name === 'SecurityError') {
                    tip('🔒 剪贴板权限被拒或非 HTTPS 环境，无法自动复制', true);
                } else {
                    tip('❌ 复制失败，请手动选择复制', true);
                }
            }
        });

        if (location.protocol === 'file:') {
            var warn = document.createElement('div');
            warn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#f59e0b;' +
                'color:#000;padding:8px 14px;border-radius:20px;font-size:11px;' +
                'font-weight:bold;z-index:9999;max-width:80vw;line-height:1.6;';
            warn.textContent = '⚠️ file:// 协议会让 wasm 和跨域请求失效，请用 http-server 启动本地服务';
            document.body.appendChild(warn);
        }

        window.addEventListener('beforeunload', function () {
            try { if (player) player.destroy(); } catch (e) { }
        });
    }
    init();
})();
