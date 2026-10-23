(() => {
  'use strict';
  const KEY = 'round-boxing-prototype-v1';
  const { lessons, units } = window.ROUND_DATA;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icons = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    book: '<path d="M12 5v16M12 5C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z"/>',
    glove: '<path d="M6 14 4 11a3 3 0 0 1 1-4l2 2V6a3 3 0 0 1 3-3h5a4 4 0 0 1 4 4v5l-3 5H7zM7 17v4h9v-4M11 4v5M15 4v5"/>',
    chart: '<path d="M4 20V4M4 20h17M8 16v-4M13 16V8M18 16V5"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    back: '<path d="m14 5-7 7 7 7"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    play: '<path d="m8 4 12 8-12 8Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    spark: '<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>',
    camera: '<path d="M3 6h4l2-3h6l2 3h4v14H3Z"/><circle cx="12" cy="12" r="4"/>',
    bluetooth: '<path d="m6 6 12 12-6 4V2l6 4L6 18"/>',
    foot: '<path d="M8 3c4-2 6 1 6 5 0 5 5 7 4 11-1 4-9 3-11-1-2-4 1-5 1-8Z"/>',
    headphones: '<path d="M4 16v-4a8 8 0 0 1 16 0v4M4 12H2v8h5v-8ZM20 12h2v8h-5v-8Z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    flag: '<path d="M5 21V3c5-4 9 4 14 0v11c-5 4-9-4-14 0"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
    reset: '<path d="M3 4v6h6M3 10a9 9 0 1 1 1 8"/>',
    edit: '<path d="m4 16 12-12 4 4L8 20H4ZM13 7l4 4"/>',
    trash: '<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/>',
    volume: '<path d="M3 9h4l5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8M19 5a10 10 0 0 1 0 14"/>'
  };
  const icon = (name, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.target}</svg>`;
  const badge = (s, cls = '') => `<span class="badge ${cls}">${s}</span>`;
  const button = (label, action, cls = 'primary full', extra = '') => `<button class="button ${cls}" data-action="${action}" ${extra}>${label}</button>`;
  const getLesson = id => lessons.find(l => l.id === Number(id)) || lessons[2];
  const time = sec => `${String(Math.floor(Math.max(0, sec) / 60)).padStart(2, '0')}:${String(Math.floor(Math.max(0, sec) % 60)).padStart(2, '0')}`;
  const readableTime = sec => sec < 60 ? `${Math.floor(sec)} 秒` : `${Math.floor(sec / 60)} 分 ${Math.floor(sec % 60)} 秒`;
  const dayKey = date => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(date));
  const today = () => dayKey(new Date());
  const cnDate = date => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'long', day: 'numeric' }).format(new Date(date));
  function defaultState(blank = false) {
    return {
      version: 1, profile: { name: blank ? '新朋友' : '练习者', goal: '扎实基本功', experience: '刚刚开始', stance: '左脚在前', days: '每周 3 次' },
      learned: blank ? [] : [1, 2], lastLesson: blank ? 1 : 3,
      records: blank ? [] : [
        { id: 'demo-2', date: '2026-10-22T11:30:00+08:00', lessonId: 2, title: '找到你的站架', source: '示例记录', seconds: 300, rounds: 3, totalRounds: 3, reflection: 'repeat', effort: 2, note: '下次试着在移动结束后，再检查一下自己的站姿。', equipment: '徒手', accelerated: false, recording: false, target: false },
        { id: 'demo-1', date: '2026-10-21T19:00:00+08:00', lessonId: 1, title: '开始之前', source: '示例记录', seconds: 240, rounds: 2, totalRounds: 2, reflection: 'steady', effort: 2, note: '已经熟悉回合与休息流程。', equipment: '徒手', accelerated: false, recording: false, target: false }
      ], workout: null, draft: null, demoTarget: false
    };
  }
  let storageAvailable = true;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const saved = JSON.parse(raw);
      if (saved.version !== 1 || !Array.isArray(saved.records) || !Array.isArray(saved.learned) || !saved.profile) return defaultState();
      const merged = { ...defaultState(), ...saved };
      if (merged.workout) merged.workout.paused = true;
      return merged;
    } catch { storageAvailable = false; return defaultState(); }
  }
  let state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); storageAvailable = true; }
    catch { storageAvailable = false; }
  }
  let route = location.hash.slice(1) || '/home';
  let lessonTab = 'points', unitFilter = 0, growthTab = 'skills', historyFilter = 'all';
  let quizAnswer = null, quizChecked = false, lessonPlaying = false;
  let setup = { lessonId: state.lastLesson, rounds: 3, seconds: 30, equipment: '徒手', recording: true, voice: false, type: '课程练习' };
  let review = { reflection: '', effort: 2, note: '' };
  let lastTick = performance.now(), toastTimeout, modalTrigger = null;
  const reflectionLabels = { steady: '这次比较顺畅', repeat: '还需要再练', revisit: '想再看一次示范' };
  const reflectionDescriptions = { steady: '继续保持，下一次在同一任务中再确认。', repeat: '保留当前任务，下一回合继续关注一个要点。', revisit: '先回到课程要点，再做一次短练习。' };

  function boxer(pose = 'jab', playing = false) {
    const punch = pose === 'jab' || pose === 'cross';
    const frontArm = punch ? 'M123 88 150 82 179 77' : 'M123 88 143 105 151 77';
    const gloveX = punch ? 183 : 152, gloveY = punch ? 76 : 72;
    return `<svg class="boxer ${playing ? 'is-playing' : ''}" viewBox="0 0 240 230" fill="none" role="img" aria-label="拳击动作风格化示意，非技术测量"><ellipse cx="120" cy="216" rx="72" ry="7" fill="#8b9c72" opacity=".16"/><path d="M21 191H220M27 166H221" stroke="#9dab89" opacity=".2"/><circle cx="124" cy="101" r="72" stroke="#a5b091" opacity=".2"/><path d="M44 170 64 177M190 158l19-7" stroke="#8ea273" stroke-width="2"/><g class="athlete-body"><path d="m105 144-22 34-10 29M129 146l18 26 18 34" stroke="#20372b" stroke-width="18" stroke-linecap="round"/><path d="m72 206-14 9h28M163 205l16 10h-28" stroke="#293e2e" stroke-width="9" stroke-linecap="round"/><path d="m102 88-4 44 6 21h29l2-23-8-43" fill="#e7663e"/><path d="m97 131 36 1 3 21h-36Z" fill="#2f4834"/><path d="m112 61 1 20" stroke="#d3a580" stroke-width="12" stroke-linecap="round"/><path d="M99 44c0-15 28-17 29 1l-3 20-15 7-11-14Z" fill="#dfb391"/><path d="M98 48c-7-21 30-24 33-5l-10 2-9-7-6 12Z" fill="#293d2e"/><path d="m104 89-23 25-9-37" stroke="#dbad86" stroke-width="13" stroke-linecap="round"/><path d="m69 65 10 4 3 15-15 2-6-12Z" fill="#2d4633"/><path d="m69 82 13-2" stroke="#e7e9d8" stroke-width="4"/><g class="athlete-punch"><path d="${frontArm}" stroke="#dfb391" stroke-width="14" stroke-linecap="round"/><rect x="${gloveX - 10}" y="${gloveY - 10}" width="24" height="20" rx="8" fill="#304b36" transform="rotate(-10 ${gloveX} ${gloveY})"/><path d="m${gloveX - 9} ${gloveY - 5} 2 12" stroke="#e7e9d8" stroke-width="4"/></g></g><g class="motion-line" stroke="#dc7b4b" stroke-width="2" stroke-linecap="round"><path d="m201 65 13-5M204 77h15M201 89l12 5"/></g></svg>`;
  }
  function toast(msg) {
    $('#toast').textContent = msg;
    $('#toast').classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 2900);
  }
  function go(path) {
    closeModal();
    if (path === route) { render(); return; }
    location.hash = path;
  }
  function topbar(title = '', back = '/home', extra = '') {
    $('#topbar').className = `topbar${title ? ' detail' : ''}`;
    $('#topbar').innerHTML = title ? `<button class="icon-btn" data-action="go" data-route="${back}" aria-label="返回">${icon('back')}</button><span class="top-title">${title}</span>${extra || '<span style="width:30px"></span>'}` : `<a href="#/home" class="app-logo" aria-label="ROUND 首页">ROUND<b>•</b></a><button class="avatar" data-action="go" data-route="/profile" aria-label="我的档案">${esc(state.profile.name.slice(0, 1))}</button>`;
  }
  function navigation(active) {
    const items = [['home', 'home', '首页'], ['learn', 'book', '学习'], ['train', 'glove', '训练'], ['growth', 'chart', '成长'], ['profile', 'user', '我的']];
    $('#navigation').hidden = active === 'session';
    $('#navigation').style.display = active === 'session' ? 'none' : 'grid';
    $('#navigation').innerHTML = items.map(([id, ico, label]) => `<button class="nav-item ${active === id ? 'active' : ''}" data-action="go" data-route="/${id}" ${active === id ? 'aria-current="page"' : ''}>${icon(ico)}<span>${label}</span></button>`).join('');
  }
  function resumeCard() {
    if (state.workout) return `<div class="resume"><span>还有一段未结束的练习<br><small>已暂停 · 第 ${state.workout.round} 回合</small></span><button data-action="go" data-route="/session">继续练习</button></div>`;
    if (state.draft) return `<div class="resume"><span>有一段练习等待复盘<br><small>保存后会出现在成长记录</small></span><button data-action="go" data-route="/review">继续复盘</button></div>`;
    return '';
  }
  function recommendation() {
    const recent = state.records.find(r => r.source === '体验记录');
    if (recent && recent.reflection !== 'steady') return { lesson: getLesson(recent.lessonId), revisit: true, recent };
    return { lesson: getLesson(lessons.find(l => !state.learned.includes(l.id))?.id || state.lastLesson), revisit: false, recent };
  }
  function weekRecords() {
    const now = new Date(`${today()}T12:00:00+08:00`); now.setDate(now.getDate() - 6);
    const first = dayKey(now);
    return state.records.filter(r => dayKey(r.date) >= first && dayKey(r.date) <= today());
  }
  function homePage() {
    topbar(); navigation('home');
    const rec = recommendation(), l = rec.lesson;
    const records = weekRecords();
    return `${resumeCard()}<div class="intro"><span class="eyebrow">YOUR NEXT ROUND</span><h1>今天，把基础练扎实。</h1><p>你好，${esc(state.profile.name)}。${rec.revisit ? '从上次的复盘，找到今天的重点。' : '从一个动作开始，给进步一点耐心。'}</p></div>
    <section class="hero" aria-label="今日学习推荐"><div class="hero-copy">${badge(rec.revisit ? '根据上次自评推荐' : '今日推荐 · 基础技术', 'dark')}<h2>${rec.revisit ? '再练一次，<br>把节奏练稳。' : l.id===3 ? '一拳之后，<br>回到护架。' : '从一个动作，<br>建立好习惯。'}</h2><p>${esc(l.title)}<br>${rec.revisit ? '保留一个重点，再次尝试。' : esc(l.subtitle)}</p></div><div class="hero-art">${boxer(l.pose)}</div><div class="hero-bottom"><span class="hero-meta">${icon('clock', 13)} ${l.minutes} 分钟课程</span>${button(`${rec.revisit ? '回看课程' : '继续学习'} ${icon('arrow', 15)}`, 'lesson', 'white compact', `data-id="${l.id}"`)}</div></section>
    <div class="stats" aria-label="学习与记录统计"><div class="stat"><strong>${state.learned.length}<small>/12</small></strong><span>已学课程</span></div><div class="stat"><strong>${records.length}<small>次</small></strong><span>近 7 天记录</span></div><div class="stat"><strong>${Math.floor(records.reduce((a,r) => a+r.seconds,0)/60)}<small>分</small></strong><span>记录时长${records.some(r=>r.source==='示例记录')?' · 含示例':''}</span></div></div>
    <section class="section"><div class="section-head"><h2>把刚学的，练一遍</h2><button class="text-link" data-action="go" data-route="/train">全部训练 ${icon('chevron', 13)}</button></div><button class="task-card" data-action="prepare" data-id="${l.id}"><span class="task-icon orange">${icon('glove')}</span><span class="grow"><h3>${esc(l.title)} · 轻量练习</h3><p>3 回合 · 每回合 30 秒 · 徒手可练</p></span>${icon('chevron', 16)}</button></section>
    <section class="section"><div class="section-head"><h2>你的基础路线</h2><button class="text-link" data-action="path">查看路线 ${icon('chevron', 13)}</button></div><div class="card"><div class="between"><span class="small">从站架，到简单组合</span><span class="tiny muted">${state.learned.length}/12</span></div><div class="progress-track" style="margin-top:12px"><span style="width:${state.learned.length/12*100}%"></span></div><div class="path-preview"><span class="path-node active"><b>1</b>准备</span><span class="path-line"></span><span class="path-node"><b>2</b>直拳</span><span class="path-line"></span><span class="path-node"><b>3</b>步法</span><span class="path-line"></span><span class="path-node"><b>4</b>组合</span></div></div></section>
    <p class="support-copy">练习记录与能力测评分别记录 · 课程为原型示例</p>`;
  }
  function learnPage() {
    topbar(); navigation('learn');
    const list = lessons.filter(l => l.unit === unitFilter);
    return `<div class="intro"><span class="eyebrow">BUILD YOUR FOUNDATION</span><h1>一步一步，学会拳击。</h1><p>理解动作，也理解它在什么时候有用。</p></div><div class="progress-card"><div class="between"><div><span class="tiny muted">基础学习路线</span><h3 style="margin-top:6px">给每一次练习打好底子</h3></div><span class="progress-value">${state.learned.length}<small>/12</small></span></div><div class="progress-track"><span style="width:${state.learned.length/12*100}%"></span></div></div>
    <div class="unit-filter" aria-label="课程单元">${units.map((u,i) => `<button class="chip ${unitFilter===i?'active':''}" data-action="unit" data-id="${i}" aria-pressed="${unitFilter===i}">${u}</button>`).join('')}</div>
    <div class="section-head"><h2>${units[unitFilter]}</h2><span class="tiny muted">${list.length} 节短课</span></div>
    ${list.map(l => `<button class="lesson-card" data-action="lesson" data-id="${l.id}"><span class="lesson-number ${state.learned.includes(l.id)?'done':l.id===state.lastLesson?'current':''}">${state.learned.includes(l.id)?icon('check',18):String(l.id).padStart(2,'0')}</span><span class="lesson-copy"><h3>${l.title}</h3><p>${l.subtitle}<br>${l.minutes} 分钟 · ${state.learned.includes(l.id)?'已完成学习':'含配套练习'}</p></span>${icon('chevron',15)}</button>`).join('')}
    <div class="note" style="margin-top:19px">${icon('info',17)}<span>课程可以自由浏览。学习完成、练习经历和能力测评会分别记录。</span></div><button class="text-link" style="margin:12px auto" data-action="path">了解后续的风格与战术路线 ${icon('arrow',14)}</button>`;
  }
  function lessonPage(id) {
    const l = getLesson(id); topbar('课程详情','/learn'); navigation('learn');
    const done = state.learned.includes(l.id);
    let content = '';
    if (lessonTab === 'points') content = l.points.map((p,i) => `<div class="point"><span>0${i+1}</span><div>${p}</div></div>`).join('') + `<div class="note">${icon('target',17)}<span>练习重点：${l.points[2]}</span></div>`;
    if (lessonTab === 'mistake') content = `<div class="card"><h3>这一点，值得多留意</h3><p class="small muted" style="margin-top:12px">${l.mistake}</p></div><p class="small muted" style="margin-top:15px">复盘时，先挑选一个具体的检查点。可以记录自评，也可以请教练核对。</p>`;
    if (lessonTab === 'quiz') content = `<h3>${l.question}</h3>${l.choices.map((c,i) => `<button class="quiz-choice ${quizAnswer===i?'selected':''}" data-action="answer" data-id="${i}" aria-pressed="${quizAnswer===i}"><span>${String.fromCharCode(65+i)}</span>${c}</button>`).join('')}${quizChecked ? `<div class="quiz-result ${quizAnswer!==l.answer?'wrong':''}" role="status">${quizAnswer===l.answer?'理解正确。带着这个重点，去完成一次练习。':'再想一想：'+l.points[2]}</div>` : button('检查答案','check-answer','secondary full',quizAnswer===null?'disabled':'')}`;
    return `<div class="lesson-visual">${boxer(l.pose,lessonPlaying)}<span class="visual-caption">动作示意 · ${lessonPlaying?'播放中':'点击播放'}</span><button class="play-button" data-action="play-lesson" aria-label="${lessonPlaying?'暂停':'播放'}动作示意">${icon(lessonPlaying?'pause':'play',18)}</button></div><p class="visual-footer">风格化动画用于交互演示，非真人教学或动作评价。</p><div class="lesson-heading"><div class="row">${badge(`单元 ${l.unit+1} · 第 ${l.id} 课`)}${done?badge('已完成学习','green'):''}</div><h1>${l.title}</h1><p class="small muted">${l.subtitle} · ${l.minutes} 分钟</p></div><div class="tabs" role="tablist" aria-label="课程内容">${[['points','动作要点'],['mistake','常见问题'],['quiz','理解小测']].map(([id,label])=>`<button class="tab ${lessonTab===id?'active':''}" role="tab" aria-selected="${lessonTab===id}" data-action="lesson-tab" data-tab="${id}">${label}</button>`).join('')}</div><div class="lesson-content" role="tabpanel">${content}</div><div class="bottom-actions">${button(`${done?'再去练一次':'完成学习，去练习'} ${icon('arrow',16)}`,'complete-lesson','primary full',`data-id="${l.id}"`)}${!done?'<p class="tiny muted" style="text-align:center">完成理解小测后，记录本节学习进度。</p>':''}</div><p class="support-copy">示例教学内容 · 正式课程需经教练审校</p>`;
  }
  function trainPage() {
    topbar(); navigation('train'); const l = getLesson(state.lastLesson);
    return `${resumeCard()}<div class="intro"><span class="eyebrow">ONE FOCUS. EVERY ROUND.</span><h1>今天，带着重点练。</h1><p>给这一回合一个小目标。</p></div><section class="training-hero"><span class="round-number">03</span>${badge('课程配套练习','dark')}<h2>${l.title}</h2><p>${l.points[2]}</p><div class="row" style="margin-top:18px;color:#b2c7a7;font-size:11px">${icon('clock',14)} 3 回合 × 30 秒 <span>·</span> 徒手可练</div>${button(`开始准备 ${icon('arrow',16)}`,'prepare','primary full',`data-id="${l.id}"`)}</section>
    <section class="section"><div class="section-head"><h2>选择练习方式</h2></div><button class="task-card" data-action="prepare" data-id="6" data-type="专项练习"><span class="task-icon">${icon('target')}</span><span class="grow"><h3>专项练习 · 出拳后回防</h3><p>每回合只关注一个检查点</p></span>${icon('chevron',15)}</button><button class="task-card" data-action="prepare" data-id="12" data-type="阶段复测"><span class="task-icon">${icon('reset')}</span><span class="grow"><h3>再做一次，看看变化</h3><p>选择同一任务，留下新的记录</p></span>${icon('chevron',15)}</button><button class="task-card" data-action="prepare" data-id="3" data-type="自由回合"><span class="task-icon orange">${icon('clock')}</span><span class="grow"><h3>自由回合</h3><p>按自己的节奏 · 计时与自我复盘</p></span>${icon('chevron',15)}</button></section>
    <section class="section"><div class="section-head"><h2>设备，为练习多一点信息</h2></div><button class="card between" style="width:100%;text-align:left" data-action="devices"><span class="row">${icon('bluetooth',18)}<span class="small">查看可接入设备</span></span>${icon('chevron',15)}</button><p class="support-copy">没有专用硬件，也可以完成基础学习与训练。</p></section>`;
  }
  function prepare(id, type = '课程练习') {
    if (state.workout || state.draft) {
      modal('先接上上一次的练习', '<p>上一段练习还有未完成的流程。继续后再开始新练习，记录会更完整。</p>', button('继续未完成的流程','continue-pending','primary full')+button('稍后再练','close-modal','secondary full'));
      return;
    }
    const selected = Number(id) || 3;
    setup = { ...setup, lessonId: selected, type };
    state.lastLesson = selected; save(); go('/setup/'+selected);
  }
  function setupPage(id) {
    setup.lessonId = getLesson(id).id;
    const l = getLesson(id); topbar('训练准备','/train'); navigation('train');
    return `<div class="setup-heading"><span class="task-icon orange">${icon('glove',26)}</span><div><h1>${setup.type==='自由回合'?'自由回合':l.title}</h1><p>${setup.type} · ${setup.type==='自由回合'?'本次只记录计时与自评':l.subtitle}</p></div></div><div class="note">${icon('target',18)}<span>${setup.type==='自由回合'?'为自己选一个简单的关注点，训练结束后记下来。':l.points[2]}</span></div>
    <div class="form-section"><span class="label">练几个回合？</span><div class="segmented">${[2,3,4].map(n=>`<button class="chip ${setup.rounds===n?'active':''}" data-action="setup-value" data-key="rounds" data-value="${n}" aria-pressed="${setup.rounds===n}">${n} 回合</button>`).join('')}</div></div>
    <div class="form-section"><span class="label">每回合时长</span><div class="segmented">${[30,60,90].map(n=>`<button class="chip ${setup.seconds===n?'active':''}" data-action="setup-value" data-key="seconds" data-value="${n}" aria-pressed="${setup.seconds===n}">${n} 秒</button>`).join('')}</div><p class="tiny muted" style="margin-top:8px">回合间休息 15 秒 · 原型采用短时长便于体验</p></div>
    <div class="form-section"><span class="label">今天在哪里练？</span><div class="segmented">${['徒手','普通沙袋'].map(s=>`<button class="chip ${setup.equipment===s?'active':''}" data-action="setup-value" data-key="equipment" data-value="${s}" aria-pressed="${setup.equipment===s}">${s}</button>`).join('')}</div></div>
    <section class="form-section"><span class="label">辅助记录</span><div class="card" style="padding:4px 15px"><div class="setting-row"><div><h3>演示录像</h3><p>使用动画片段体验回放，不调用摄像头</p></div><button class="switch ${setup.recording?'on':''}" role="switch" aria-checked="${setup.recording}" aria-label="演示录像" data-action="toggle-setting" data-key="recording"></button></div><div class="setting-row"><div><h3>语音提示预览</h3><p>通过提示文案演示，不播放声音</p></div><button class="switch ${setup.voice?'on':''}" role="switch" aria-checked="${setup.voice}" aria-label="语音提示预览" data-action="toggle-setting" data-key="voice"></button></div></div></section>
    <div class="device-row"><span class="task-icon" style="width:38px;height:38px">${icon('target',20)}</span><span class="grow"><h3>智能墙靶</h3><p>${state.demoTarget?'已模拟连接 · 不产生测量数据':'可选设备 · 当前未接入'}</p></span><button class="text-link" data-action="devices">${state.demoTarget?'管理':'模拟连接'}</button></div><div class="summary-strip"><span>预计流程时长</span><strong>${readableTime(setup.rounds*setup.seconds+(setup.rounds-1)*15)}</strong></div>${button(`进入第一回合 ${icon('arrow',16)}`,'start-session','primary full')}<p class="support-copy">可以暂停、提前结束或使用演示快进。</p>`;
  }
  function startSession() {
    if (state.workout || state.draft) return;
    const l = getLesson(setup.lessonId);
    state.workout = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), lessonId: l.id, title: setup.type==='自由回合'?'自由回合':l.title, type:setup.type, round:1, phase:'work', totalRounds:setup.rounds, secondsPerRound:setup.seconds, remainingMs:setup.seconds*1000, phaseTotal:setup.seconds, paused:false, activeMs:0, completed:0, equipment:setup.equipment, recording:setup.recording, voice:setup.voice, target:state.demoTarget, accelerated:false, startedAt:new Date().toISOString() };
    lastTick = performance.now(); save(); go('/session');
  }
  function sessionPage() {
    const w = state.workout;
    if (!w) return emptyFlow('还没有开始训练','去选择一项练习，再开始计时。','/train','选择训练');
    topbar('专注这一回合','/train',`<button class="icon-btn" data-action="session-info" aria-label="训练状态说明">${icon('info',18)}</button>`); navigation('session');
    $('#topbar [data-action="go"]').dataset.action = 'exit-session';
    const l = getLesson(w.lessonId), rest = w.phase==='rest';
    return `<div class="training-screen"><div class="round-label">ROUND ${String(w.round).padStart(2,'0')} / ${String(w.totalRounds).padStart(2,'0')}</div><div class="phase-title">${rest?'休息一下，再继续':esc(w.title)}</div><div class="timer-ring"><svg class="timer-svg" viewBox="0 0 240 240" aria-hidden="true"><circle class="timer-track" cx="120" cy="120" r="113"/><circle id="timer-progress" class="timer-progress" cx="120" cy="120" r="113" stroke-dasharray="710" stroke-dashoffset="0"/></svg><div><div class="time-main" id="timer-value">${time(Math.ceil(w.remainingMs/1000))}</div><div class="time-label" id="timer-state">${w.paused?'已暂停':rest?'恢复呼吸 · 准备下一回合':'跟着自己的节奏'}</div><div class="round-dots">${Array.from({length:w.totalRounds},(_,i)=>`<span class="${i<w.round?'active':''}"></span>`).join('')}</div></div></div><div class="cue">${icon(rest?'clock':'target',22)}<div><small>${rest?'下一回合的重点':w.voice?'提示文案 · 模拟语音':'这一回合，只记住'}</small><strong>${rest?'准备好后，再回到护架。':w.type==='自由回合'?'选择一个重点，按自己的节奏练。':l.points[2]}</strong></div></div><div class="session-tags">${badge(w.equipment)}${badge(w.recording?'录像：演示片段':'录像：未开启')}${w.target?badge('墙靶：模拟连接'):''}</div><div class="session-controls">${button(`${icon(w.paused?'play':'pause',18)} ${w.paused?'继续':'暂停'}`,'pause-session','white', 'id="pause-button"')}${button('结束并复盘','exit-session','outline')}</div><button class="skip-button" data-action="skip-phase">${rest?'跳过休息':'跳到下一阶段'} · 演示快进</button><p class="session-footer">计时真实运行，未采集动作或击打数据。<br>快进会标记为体验流程，不计入真实训练完成。</p></div>`;
  }
  function tick() {
    const now = performance.now(), dt = Math.max(0,now-lastTick); lastTick = now;
    const w = state.workout;
    if (!w || w.paused || route!=='/session' || document.hidden) return;
    // Preserve active time only; never count a suspended tab or skipped phase as training.
    const consumed = Math.min(dt, w.remainingMs);
    w.remainingMs = Math.max(0,w.remainingMs-consumed);
    if (w.phase==='work') w.activeMs += consumed;
    if ($('#timer-value')) $('#timer-value').textContent = time(Math.ceil(w.remainingMs/1000));
    if ($('#timer-progress')) $('#timer-progress').style.strokeDashoffset = String(710*(1-w.remainingMs/(w.phaseTotal*1000)));
    if (w.remainingMs<=0) nextPhase(false);
    else save();
  }
  function nextPhase(skip) {
    const w = state.workout; if (!w) return;
    if (skip) w.accelerated = true;
    if (w.phase==='work') {
      w.completed = w.round;
      if (w.round>=w.totalRounds) { finishSession(); return; }
      w.phase='rest'; w.remainingMs=15000; w.phaseTotal=15;
    } else { w.round++; w.phase='work'; w.remainingMs=w.secondsPerRound*1000; w.phaseTotal=w.secondsPerRound; }
    lastTick=performance.now(); save(); render();
  }
  function finishSession() {
    const w=state.workout; if(!w)return;
    state.draft={ id:w.id, date:new Date().toISOString(), lessonId:w.lessonId, title:w.title, source:'体验记录', seconds:Math.floor(w.activeMs/1000), rounds:w.completed, totalRounds:w.totalRounds, equipment:w.equipment, accelerated:w.accelerated, recording:w.recording, target:w.target, reflection:'', effort:2, note:'' };
    state.workout=null; review={reflection:'',effort:2,note:''}; save(); go('/review');
  }
  function emptyFlow(title, text, path, label) {
    topbar(title,'/home'); navigation('train');
    return `<div class="empty" style="margin-top:35px">${icon('info',30)}<h2>${title}</h2><p style="margin-top:12px">${text}</p>${button(label,'go','primary full',`data-route="${path}"`)}</div>`;
  }
  function reviewPage() {
    if(!state.draft) return emptyFlow('没有待保存的复盘','可以开始新的练习，或查看已保存的成长记录。','/growth','查看成长记录');
    const d=state.draft; review={reflection:d.reflection||'',effort:d.effort||2,note:d.note||''};
    topbar('训练复盘','/train'); navigation('train');
    return `<div class="intro"><span class="eyebrow">TAKE A MOMENT</span><h1>这一轮，你感觉如何？</h1><p>${esc(d.title)} · 记录一个真实的感受就好。</p><div class="review-stats"><span>回合流程 ${d.rounds}/${d.totalRounds}</span><span>体验计时 ${readableTime(d.seconds)}</span></div></div>${d.accelerated?'<div class="note orange">'+icon('info',17)+'<span>本次使用了演示快进。回合数表示体验流程，时长只包含实际运行的练习计时。</span></div>':''}${d.recording?`<button class="preview-clip" style="margin-top:16px" data-action="clip"><span><span class="clip-play">${icon('play',14)}</span><h3>回看动作示意</h3><span class="tiny muted">演示片段 · 非本次真实录像</span></span>${boxer(getLesson(d.lessonId).pose)}</button>`:''}
    <div class="form-section"><span class="label">这次的自我评价</span>${['steady','repeat','revisit'].map(k=>`<button class="review-choice ${review.reflection===k?'selected':''}" data-action="reflection" data-value="${k}" aria-pressed="${review.reflection===k}"><span class="choice-mark">${review.reflection===k?'✓':''}</span><span><h3>${reflectionLabels[k]}</h3><p>${reflectionDescriptions[k]}</p></span></button>`).join('')}</div>
    <div class="form-section"><div class="between"><label for="effort">本次主观费力程度</label><span class="tiny muted" id="effort-value">${review.effort}/5</span></div><input class="effort" id="effort" type="range" min="1" max="5" value="${review.effort}"><div class="range-labels"><span>轻松</span><span>很费力</span></div></div>
    <div class="form-section"><label for="review-note">给下次的自己留一句话 <span class="tiny muted">（可选）</span></label><textarea id="review-note" class="input" maxlength="240" placeholder="例如：下次先慢一点，留意收拳后的护架。">${esc(review.note)}</textarea></div><div class="bottom-actions">${button('保存复盘，看看积累 '+icon('arrow',16),'save-review','primary full',!review.reflection?'disabled':'')}</div><p class="support-copy">反馈来源：你的自评 · 能力状态仍为未测评</p>`;
  }
  function saveReview() {
    if (!state.draft || !review.reflection) return;
    const record={...state.draft,...review};
    if(!state.records.some(r=>r.id===record.id)) state.records.unshift(record);
    state.draft=null; state.lastLesson=record.lessonId; save(); go('/summary/'+record.id);
  }
  function summaryPage(id) {
    const r=state.records.find(r=>r.id===id);
    if(!r)return emptyFlow('这条记录不存在','记录可能已重置。可以在成长页查看当前保存的记录。','/growth','查看成长');
    topbar('这一回合的收获','/growth'); navigation('growth');
    const next=r.reflection==='revisit'?'先回看要点，再练一次':r.reflection==='repeat'?'同一个重点，再练一次':'保持这个重点，下次再确认';
    return `<div class="success-icon">${icon('check',31)}</div><div class="success-title"><h1>这一回合，留下了。</h1><p>${esc(r.title)}<br>你的复盘已存入成长记录。</p></div><div class="report-grid"><div class="report-cell"><small>${r.source==='示例记录'?'示例时长':'实际运行的体验计时'}</small><strong>${Math.floor(r.seconds/60)}<span>分</span> ${r.seconds%60}<span>秒</span></strong></div><div class="report-cell"><small>已走过的回合流程</small><strong>${r.rounds}<span>/ ${r.totalRounds} 回合</span></strong></div></div><div class="card"><div class="between"><h3>你的自评</h3>${badge(r.source,'orange')}</div><p class="small" style="margin-top:12px">${reflectionLabels[r.reflection]}</p>${r.note?`<p class="saved-note muted">“${esc(r.note)}”</p>`:''}<p class="tiny muted" style="margin-top:12px">动作能力尚未测评；本次未采集真实设备数据。</p></div><div class="section"><div class="section-head"><h2>下一步，接着走</h2></div><div class="note">${icon('target',18)}<span>${next}。${getLesson(r.lessonId).points[2]}</span></div></div><div class="bottom-actions">${button('查看成长记录 '+icon('arrow',16),'show-history','primary full')}${button(r.reflection==='revisit'?'回看这节课程':'再练一次',r.reflection==='revisit'?'lesson':'prepare','outline full',`data-id="${r.lessonId}"`)}</div>`;
  }
  function historyRows(list) {
    return list.map(r=>{const date=new Date(r.date);return `<button class="record-row" data-action="record" data-id="${r.id}"><span class="record-date"><strong>${new Intl.DateTimeFormat('en',{timeZone:'Asia/Shanghai',day:'2-digit'}).format(date)}</strong><small>${new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'short'}).format(date)}</small></span><span class="grow"><h3>${esc(r.title)}</h3><p>${readableTime(r.seconds)} · ${reflectionLabels[r.reflection]}<br>${r.accelerated?'含快进 · ':''}反馈来源：自评</p></span>${badge(r.source,r.source==='体验记录'?'orange':'')}${icon('chevron',14)}</button>`;}).join('');
  }
  function growthPage() {
    topbar(); navigation('growth');
    const recent=weekRecords();
    let content='';
    if(growthTab==='skills') {
      content=`<div class="section-head"><h2>我的基础能力</h2><span class="tiny muted">练过 ≠ 已通过测评</span></div>${[[2,'站架与护架'],[3,'刺拳与回防'],[4,'后手直拳'],[5,'基础组合'],[7,'前后移动'],[9,'基础防守']].map(([id,name])=>{const related=state.records.filter(r=>r.lessonId===id),n=related.length;return `<button class="skill-row" data-action="skill" data-id="${id}"><span class="task-icon" style="width:36px;height:36px">${icon(n?'check':'target',17)}</span><span class="grow"><h3>${name}</h3><p>${n?`${n} 次记录${related.some(r=>r.source==='示例记录')?' · 含原型示例':' · 来自交互体验'}`:'还没有相关练习记录'}</p></span><span class="skill-state ${n?'':'unknown'}">未测评</span>${icon('chevron',13)}</button>`;}).join('')}<div class="note">${icon('info',17)}<span>自评帮助选择下一步练习。能力是否掌握，需要另外的观察与评价。</span></div>`;
    } else {
      const list=historyFilter==='week'?recent:state.records;
      content=`<div class="section-head"><h2>每次练习，都有来路</h2></div><div class="chips" style="margin-bottom:8px">${[['all','全部'],['week','近 7 天']].map(([id,label])=>`<button class="chip ${historyFilter===id?'active':''}" data-action="history-filter" data-value="${id}" aria-pressed="${historyFilter===id}">${label}</button>`).join('')}</div>${list.length?historyRows(list):`<div class="empty" style="margin-top:18px">${icon('book',30)}<p>这里还没有记录。<br>完成一次练习并保存复盘，就能在这里回看。</p>${button('开始第一回合','go','primary full','data-route="/train"')}</div>`}`;
    }
    const bars=Array.from({length:7},(_,i)=>{let d=new Date(`${today()}T12:00:00+08:00`);d.setDate(d.getDate()-(6-i));let key=dayKey(d),n=state.records.filter(r=>dayKey(r.date)===key).length;return `<div class="day ${i===6?'today':''}"><span class="day-count">${n?n+' 次':''}</span><div class="bar-area"><span class="bar ${n?'filled':''}" style="height:${n?Math.min(60,18+n*16):4}px"></span></div><span class="day-label">${i===6?'今天':new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',weekday:'short'}).format(d)}</span></div>`;}).join('');
    return `<div class="intro"><span class="eyebrow">YOUR WORK, OVER TIME</span><h1>进步，藏在每次练习里。</h1><p>记录积累，也保留还没弄明白的地方。</p></div><div class="growth-banner">${badge('当前路线 · 基础入门','dark')}<h2>基础正在一点点建立</h2><p>学习完成 ${state.learned.length} 节 · 保存 ${state.records.length} 次记录</p><div class="progress-track"><span style="width:${state.learned.length/12*100}%"></span></div><div class="between"><span>课程进度</span><span>${state.learned.length} / 12</span></div></div><section class="section"><div class="section-head"><h2>近 7 天的积累</h2><span class="tiny muted">${recent.length} 次${recent.some(r=>r.source==='示例记录')?' · 含示例记录':''}</span></div><div class="activity" aria-label="近七天练习记录">${bars}</div></section><div class="tabs" role="tablist" aria-label="成长记录类型">${[['skills','能力档案'],['history','练习记录']].map(([id,label])=>`<button class="tab ${growthTab===id?'active':''}" role="tab" aria-selected="${growthTab===id}" data-action="growth-tab" data-tab="${id}">${label}</button>`).join('')}</div><div role="tabpanel">${content}</div>`;
  }
  function recordPage(id) {
    const r=state.records.find(r=>r.id===id); if(!r)return emptyFlow('记录不存在','这条记录可能已经重置或删除。','/growth','返回成长');
    topbar('练习记录','/growth'); navigation('growth');
    return `<div class="intro">${badge(r.source,r.source==='体验记录'?'orange':'')}<h1 style="margin-top:14px">${esc(r.title)}</h1><p>${cnDate(r.date)} · ${esc(r.equipment)}${r.accelerated?' · 含演示快进':''}</p></div><div class="report-grid" style="margin-top:0"><div class="report-cell"><small>${r.source==='示例记录'?'示例时长':'体验计时'}</small><strong>${Math.floor(r.seconds/60)}<span>分</span> ${r.seconds%60}<span>秒</span></strong></div><div class="report-cell"><small>回合流程</small><strong>${r.rounds}<span>/ ${r.totalRounds}</span></strong></div></div><div class="card"><div class="between"><h3>${reflectionLabels[r.reflection]}</h3>${badge('来源：自评')}</div><p class="small muted" style="margin-top:12px">${reflectionDescriptions[r.reflection]}</p><p class="tiny muted" style="margin-top:12px">主观费力程度 ${r.effort}/5</p>${r.note?`<p class="saved-note">${esc(r.note)}</p>`:''}</div>${r.recording?`<button class="preview-clip" style="margin-top:17px" data-action="clip" data-id="${r.lessonId}"><span><span class="clip-play">${icon('play',14)}</span><h3>课程动作示意</h3><span class="tiny muted">本次未保存真实录像</span></span>${boxer(getLesson(r.lessonId).pose)}</button>`:''}<div class="note" style="margin-top:20px">${icon('info',17)}<span>这条记录${r.source==='示例记录'?'是预置演示内容':'来自原型交互'}。没有真实动作识别、拳力或鞋垫数据，能力状态为未测评。</span></div><div class="bottom-actions">${button('按同一任务再练一次','prepare','primary full',`data-id="${r.lessonId}"`)}${button('回看对应课程','lesson','outline full',`data-id="${r.lessonId}"`)}</div><button class="text-link" style="margin:18px auto 0;color:#aa6247" data-action="delete-record" data-id="${r.id}">删除这条本地记录</button>`;
  }
  function profilePage() {
    topbar(); navigation('profile');
    return `<div class="profile-card"><span class="avatar">${esc(state.profile.name.slice(0,1))}</span><div><h1>${esc(state.profile.name)}</h1><p>${esc(state.profile.experience)} · ${esc(state.profile.stance)}</p></div></div><div class="card"><div class="between"><span class="tiny muted">我的训练目标</span>${badge('本地体验档案')}</div><h2 style="margin-top:10px">${esc(state.profile.goal)}</h2><p class="small muted" style="margin-top:8px">${esc(state.profile.days)} · 按自己的节奏前进</p></div><div class="section card" style="padding:0 17px"><button class="menu-button" data-action="go" data-route="/profile/edit">${icon('user',18)}<span>调整个人档案</span>${icon('chevron',15)}</button><button class="menu-button" data-action="devices">${icon('bluetooth',18)}<span>设备与辅助记录</span><small>${state.demoTarget?'1 个模拟连接':'未接入真实设备'}</small>${icon('chevron',15)}</button><button class="menu-button" data-action="path">${icon('flag',18)}<span>完整发展路线</span>${icon('chevron',15)}</button></div><div class="section card" style="padding:0 17px"><button class="menu-button" data-action="export">${icon('download',18)}<span>导出本地体验记录</span>${icon('chevron',15)}</button><button class="menu-button" data-action="blank">${icon('user',18)}<span>体验新手空白档案</span>${icon('chevron',15)}</button><button class="menu-button" data-action="reset">${icon('reset',18)}<span>重置为示例档案</span>${icon('chevron',15)}</button><button class="menu-button" data-action="about">${icon('info',18)}<span>关于这个原型</span>${icon('chevron',15)}</button></div><p class="support-copy">${storageAvailable?'进度仅保存在当前浏览器；清理浏览器数据会移除记录。':'浏览器存储不可用：当前进度只保留在本次打开期间。'}<br>ROUND · Prototype 0.1</p>`;
  }
  function editProfilePage() {
    topbar('个人档案','/profile'); navigation('profile'); const p=state.profile;
    const select=(key,label,options)=>`<div class="form-section"><label for="profile-${key}">${label}</label><select class="input" id="profile-${key}" name="${key}">${options.map(o=>`<option ${p[key]===o?'selected':''}>${o}</option>`).join('')}</select></div>`;
    return `<div class="intro"><h1>从你的起点开始。</h1><p>这些选择用于组织学习与练习建议。</p></div><form id="profile-form"><div class="form-section" style="margin-top:0"><label for="profile-name">怎么称呼你</label><input class="input" id="profile-name" name="name" maxlength="20" required value="${esc(p.name)}" autocomplete="nickname"></div>${select('experience','当前经验',['刚刚开始','有少量练习经验','正在跟随教练学习'])}${select('goal','当前目标',['扎实基本功','建立训练习惯','提高动作稳定性'])}${select('stance','目前使用的站架',['左脚在前','右脚在前','暂未确定'])}${select('days','希望每周安排',['每周 2 次','每周 3 次','每周 4 次'])}<div class="bottom-actions"><button class="button primary full" type="submit">保存档案 ${icon('check',16)}</button></div></form><p class="support-copy">站架信息作为自填偏好保存，不用于自动判断适合的打法。</p>`;
  }

  function modal(title, body, actions='') {
    modalTrigger=document.activeElement;
    $('#modal-root').innerHTML=`<div class="modal-backdrop"><section class="modal-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-title"><div class="sheet-handle"></div><div class="between"><h2 id="sheet-title">${title}</h2><button class="icon-btn" data-action="close-modal" aria-label="关闭弹窗">${icon('close',18)}</button></div>${body}${actions?`<div class="sheet-actions">${actions}</div>`:''}</section></div>`;
    $('#screen').inert=true; $('#navigation').inert=true; $('#topbar').inert=true;
    $('.modal-sheet button')?.focus();
  }
  function closeModal() {
    const existed=Boolean($('.modal-sheet'));
    $('#modal-root').innerHTML='';
    $('#screen').inert=false;$('#navigation').inert=false;$('#topbar').inert=false;
    if(existed&&modalTrigger?.isConnected)modalTrigger.focus();
  }
  function deviceModal() {
    modal('设备与辅助记录',`<p>先用手机完成基本流程。以下设备状态仅用于体验，不连接真实硬件。</p><div class="device-list"><div class="device-row">${icon('camera',22)}<span class="grow"><h3>手机 Camera</h3><p>动作示意回放 · 未调用摄像头</p></span>${badge('模拟')}</div><div class="device-row">${icon('target',22)}<span class="grow"><h3>智能墙靶</h3><p>${state.demoTarget?'已模拟连接 · 不采集击打数据':'首个硬件试点 · 体验连接状态'}</p></span><button class="chip ${state.demoTarget?'active':''}" data-action="toggle-target">${state.demoTarget?'断开模拟':'模拟连接'}</button></div><div class="device-row">${icon('foot',22)}<span class="grow"><h3>智能鞋垫</h3><p>局部足底负荷与时序</p></span>${badge('后续版本')}</div><div class="device-row">${icon('headphones',22)}<span class="grow"><h3>VR / 实体陪练</h3><p>情境选择与交互任务</p></span>${badge('后续版本')}</div></div>`,button('完成','close-modal','primary full'));
  }
  function pathModal() {
    modal('从基础，走向自己的打法',`<p>每项能力都可以有不同进度。训练经历、自评和实际测评分别保留。</p><div class="path-map">${[['准备与基础技术','站架、护架、直拳、步法与基础防守。','本版可体验'],['组合与移动','把单项动作连接起来，在移动中保持准备。','本版部分示例'],['情境应用','识别来拳与距离线索，练习选择和反应。','后续版本'],['风格探索','体验外线控制、压迫与反击等不同组织方式。','后续版本'],['战术适应','针对不同对手和情境，调整自己的选择。','后续版本']].map(([t,d,status],i)=>`<div class="path-map-item ${i===0?'current':''}"><span>${i+1}</span><div><h3>${t}</h3><p>${d}</p><span class="tiny muted">${status}</span></div></div>`).join('')}</div>`,button('继续基础学习','go','primary full','data-route="/learn"'));
  }
  function render(resetScroll=true) {
    const screen=$('#screen'), oldScroll=screen.scrollTop;
    $('#phone').classList.toggle('training',route==='/session'&&Boolean(state.workout));
    let html;
    if(route==='/home'||route==='/')html=homePage();
    else if(route==='/learn')html=learnPage();
    else if(route.startsWith('/lesson/'))html=lessonPage(route.split('/')[2]);
    else if(route==='/train')html=trainPage();
    else if(route.startsWith('/setup/'))html=setupPage(route.split('/')[2]);
    else if(route==='/session')html=sessionPage();
    else if(route==='/review')html=reviewPage();
    else if(route.startsWith('/summary/'))html=summaryPage(route.split('/')[2]);
    else if(route==='/growth')html=growthPage();
    else if(route.startsWith('/record/'))html=recordPage(route.split('/')[2]);
    else if(route==='/profile/edit')html=editProfilePage();
    else if(route==='/profile')html=profilePage();
    else {route='/home';html=homePage();}
    screen.innerHTML=html;
    screen.scrollTop=resetScroll?0:oldScroll;
    const step=route.includes('learn')||route.includes('lesson')?'learn':route==='/review'||route.includes('summary')?'review':route.includes('growth')||route.includes('record')?'growth':route.includes('train')||route.includes('setup')||route==='/session'?'train':'learn';
    document.querySelectorAll('.journey li').forEach(li=>li.classList.toggle('current',li.dataset.step===step));
    if(route==='/session'&&state.workout&&$('#timer-progress'))$('#timer-progress').style.strokeDashoffset=String(710*(1-state.workout.remainingMs/(state.workout.phaseTotal*1000)));
  }

  document.addEventListener('click',e=>{
    if(e.target.classList.contains('modal-backdrop')){closeModal();return;}
    const b=e.target.closest('[data-action]'); if(!b||b.disabled)return;
    const a=b.dataset.action, id=b.dataset.id, value=b.dataset.value;
    if(a==='go')go(b.dataset.route);
    else if(a==='lesson'){lessonTab='points';quizAnswer=null;quizChecked=false;lessonPlaying=false;state.lastLesson=Number(id);save();go('/lesson/'+id);}
    else if(a==='unit'){unitFilter=Number(id);render(false);}
    else if(a==='lesson-tab'){lessonTab=b.dataset.tab;render(false);}
    else if(a==='answer'){quizAnswer=Number(id);quizChecked=false;render(false);}
    else if(a==='check-answer'){quizChecked=true;render(false);}
    else if(a==='play-lesson'){lessonPlaying=!lessonPlaying;render(false);}
    else if(a==='complete-lesson'){
      const l=getLesson(id);
      if(!state.learned.includes(l.id)&&!(quizChecked&&quizAnswer===l.answer)){lessonTab='quiz';render(false);$('.tabs').scrollIntoView({block:'start',behavior:'smooth'});toast('先完成一个理解小测，再记录学习进度。');return;}
      if(!state.learned.includes(l.id))state.learned.push(l.id);
      save();prepare(l.id);toast('学习进度已记录，接下来练一遍。');
    }
    else if(a==='prepare')prepare(id,b.dataset.type||'课程练习');
    else if(a==='setup-value'){setup[b.dataset.key]=['rounds','seconds'].includes(b.dataset.key)?Number(value):value;render(false);}
    else if(a==='toggle-setting'){setup[b.dataset.key]=!setup[b.dataset.key];render(false);}
    else if(a==='start-session')startSession();
    else if(a==='pause-session'){tick();if(state.workout){state.workout.paused=!state.workout.paused;lastTick=performance.now();save();render(false);}}
    else if(a==='skip-phase'){tick();nextPhase(true);}
    else if(a==='exit-session'){
      tick();if(!state.workout)return;state.workout.paused=true;save();render(false);
      modal('结束这一段练习？','<p>已经运行的计时会保留。可以直接进入复盘，也可以继续练习。</p>',button('结束并进入复盘','finish-session','primary full')+button('继续练习','resume-session','secondary full'));
    }
    else if(a==='resume-session'){closeModal();if(state.workout){state.workout.paused=false;lastTick=performance.now();save();render(false);}}
    else if(a==='finish-session')finishSession();
    else if(a==='continue-pending')go(state.workout?'/session':'/review');
    else if(a==='reflection'){review.reflection=value;if(state.draft)Object.assign(state.draft,review);save();render(false);}
    else if(a==='save-review')saveReview();
    else if(a==='show-history'){growthTab='history';historyFilter='all';go('/growth');}
    else if(a==='growth-tab'){growthTab=b.dataset.tab;render(false);}
    else if(a==='history-filter'){historyFilter=value;render(false);}
    else if(a==='record')go('/record/'+id);
    else if(a==='skill'){
      const l=getLesson(id),n=state.records.filter(r=>r.lessonId===l.id).length;
      modal(l.title,`<p>${n?n+' 次相关记录':'尚无相关练习记录'} · 能力未测评</p><div class="note" style="margin-top:15px">${icon('info',18)}<span>完成课程与保存自评，不会自动把技能标记为掌握。</span></div><h3 style="margin-top:20px">下一次可以关注</h3>${l.points.map((p,i)=>`<div class="point"><span>${i+1}</span><div>${p}</div></div>`).join('')}`,button('学习对应课程','lesson','primary full',`data-id="${id}"`)+button('开始这项练习','prepare','outline full',`data-id="${id}"`));
    }
    else if(a==='clip'){
      const l=getLesson(id||state.draft?.lessonId||state.lastLesson);
      modal('动作示意回放',`<p>这是课程示意动画。原型没有拍摄、分析或保存你的真实视频。</p><div class="sheet-visual" id="clip-visual">${boxer(l.pose,true)}</div><p>${l.points[2]}</p>`,button('暂停示意','toggle-clip','secondary full','id="clip-toggle"')+button('回到复盘','close-modal','primary full'));
    }
    else if(a==='toggle-clip'){const art=$('#clip-visual .boxer');const playing=art.classList.toggle('is-playing');b.textContent=playing?'暂停示意':'继续播放';}
    else if(a==='devices')deviceModal();
    else if(a==='toggle-target'){state.demoTarget=!state.demoTarget;save();deviceModal();toast(state.demoTarget?'已模拟连接墙靶，未采集真实数据。':'已断开模拟连接。');}
    else if(a==='path')pathModal();
    else if(a==='close-modal'){closeModal();render(false);}
    else if(a==='session-info')modal('这是一段交互体验','<p>计时实际运行；动作示意、录像与墙靶连接均为模拟。使用快进时，仅记录实际运行的练习计时，不把跳过的时长计入记录。</p>',button('知道了','close-modal','primary full'));
    else if(a==='about')modal('把学习，接到下一回合',`<p>ROUND 是拳击学习与训练的手机端交互原型。你可以完整体验课程、回合练习、自我复盘和成长记录。</p><ul class="list-info"><li>课程与示意动画：原型内容，待教练审校。</li><li>预置记录：清楚标为“示例记录”。</li><li>本次操作：保存为“体验记录”。</li><li>相机、语音、设备：模拟，不采集真实数据。</li><li>进度：仅保存在当前浏览器，可导出或重置。</li></ul>`,button('开始体验','close-modal','primary full'));
    else if(a==='delete-record')modal('删除这条本地记录？','<p>只删除这条原型记录，不影响课程学习进度。删除前也可以在“我的”中导出记录。</p>',button('确认删除','confirm-delete','primary full',`data-id="${id}"`)+button('保留记录','close-modal','secondary full'));
    else if(a==='confirm-delete'){state.records=state.records.filter(r=>r.id!==id);save();growthTab='history';go('/growth');toast('本地记录已删除。');}
    else if(a==='reset'||a==='blank')modal(a==='blank'?'从空白档案开始？':'重置为示例档案？','<p>这会替换当前浏览器中的原型进度、未完成练习和记录。需要保留时，请先导出。</p>',button('导出当前记录','export','outline full')+button(a==='blank'?'确认启用空白档案':'确认重置','confirm-reset','primary full',`data-value="${a}"`)+button('取消','close-modal','secondary full'));
    else if(a==='confirm-reset'){state=defaultState(value==='blank');save();quizAnswer=null;quizChecked=false;unitFilter=0;growthTab='skills';go('/home');toast(value==='blank'?'已切换为新手空白档案。':'已恢复示例档案。');}
    else if(a==='export'){
      const payload={app:'ROUND prototype',exportedAt:new Date().toISOString(),notice:'交互原型记录，非真实硬件测量或能力认证',...state};
      const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const anchor=document.createElement('a');anchor.href=url;anchor.download=`ROUND-体验记录-${today()}.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已导出 JSON 格式的本地体验记录。');
    }
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='review-note'){review.note=e.target.value;if(state.draft)state.draft.note=review.note;save();}
    if(e.target.id==='effort'){review.effort=Number(e.target.value);$('#effort-value').textContent=review.effort+'/5';if(state.draft)state.draft.effort=review.effort;save();}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id!=='profile-form')return;
    e.preventDefault();const data=new FormData(e.target),name=String(data.get('name')).trim();
    if(!name){$('#profile-name').setCustomValidity('请填写一个称呼。');$('#profile-name').reportValidity();return;}
    state.profile={name,...Object.fromEntries(['experience','goal','stance','days'].map(k=>[k,String(data.get(k))]))};save();go('/profile');toast('档案已保存在当前浏览器。');
  });
  document.addEventListener('input',e=>{if(e.target.id==='profile-name')e.target.setCustomValidity('');});
  document.addEventListener('keydown',e=>{
    const sheet=$('.modal-sheet');if(!sheet)return;
    if(e.key==='Escape'){closeModal();render(false);}
    if(e.key==='Tab'){
      const focusable=Array.from(sheet.querySelectorAll('button:not(:disabled),a[href],input,select,textarea'));
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }
  });
  window.addEventListener('hashchange',()=>{
    const next=location.hash.slice(1)||'/home';
    if(route==='/session'&&next!=='/session'&&state.workout){state.workout.paused=true;save();}
    if(next!==route&&next.startsWith('/lesson/')){lessonTab='points';quizAnswer=null;quizChecked=false;lessonPlaying=false;}
    route=next;closeModal();lastTick=performance.now();render();$('#screen').focus({preventScroll:true});
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&state.workout&&!state.workout.paused){tick();state.workout.paused=true;save();if(route==='/session')render(false);}
    lastTick=performance.now();
  });
  window.addEventListener('pagehide',()=>{if(state.workout)state.workout.paused=true;save();});
  setInterval(tick,250);
  render();save();
})();
