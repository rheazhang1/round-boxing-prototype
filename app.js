(() => {
  'use strict';
  const KEY = 'round-boxing-prototype-v1';
  const { lessons, units } = window.ROUND_DATA;
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icons = {
    tree: '<circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><circle cx="12" cy="12" r="2"/><path d="M12 6v4m-1 4-5 3m7-3 5 3"/>',
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
  function defaultState(blank = true) {
    return {
      skillProgress: {}, skillEvidence: [], evidenceDrafts: {}, focusSkill: 101, coachMessages: [], coachDraft: '',
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
      merged.skillProgress = saved.skillProgress || {};
      merged.skillEvidence = Array.isArray(saved.skillEvidence) ? saved.skillEvidence : [];
      merged.evidenceDrafts = saved.evidenceDrafts || {};
      merged.coachMessages = Array.isArray(saved.coachMessages) ? saved.coachMessages : [];
      // v0.1 drafts become durable records without changing IDs or existing progress.
      if (merged.draft) {
        const index = merged.records.findIndex(r => r.id === merged.draft.id);
        if (index < 0) merged.records.unshift({ ...merged.draft });
        else merged.records[index] = { ...merged.records[index], ...merged.draft };
      }
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
  let lessonTab = 'points', unitFilter = null, growthTab = 'evidence', historyFilter = 'all';
  let settingsOpen = false, specialtyOpen = false;
  let quizAnswer = null, quizChecked = false, lessonPlaying = false;
  let setup = { lessonId: state.lastLesson, rounds: 3, seconds: 30, equipment: '徒手', recording: false, voice: false, type: '课程练习', ...(state.preferences || {}), ...(state.pendingSetup || {}) };
  let review = { reflection: '', effort: 2, note: '' };
  let lastTick = performance.now(), toastTimeout, modalTrigger = null;
  const reflectionLabels = { steady: '这次比较顺畅', repeat: '还需要再练', revisit: '回看要点', pending: '未填写自评' };
  const reflectionDescriptions = { pending: '计时和回合已保存，可以随时补充自评。', steady: '继续保持，下一次在同一任务中再确认。', repeat: '保留当前任务，下一回合继续关注一个要点。', revisit: '先回到课程要点，再做一次短练习。' };

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
    $('#topbar').innerHTML = title ? `<button class="icon-btn" data-action="go" data-route="${back}" aria-label="返回">${icon('back')}</button><span class="top-title">${title}</span>${extra || '<span style="width:30px"></span>'}` : `<a href="#/home" class="app-logo" aria-label="ROUND 首页">ROUND<b>•</b></a><button class="avatar" data-action="go" data-route="/profile" aria-label="个人与设备">${esc(state.profile.name.slice(0, 1))}</button>`;
  }
  function navigation(active) {
    const items = [['home', 'tree', '技能树'], ['train', 'glove', '训练'], ['coach', 'spark', 'AI教练'], ['growth', 'chart', '成长']];
    if(active==='learn')active='home';
    $('#navigation').hidden = active === 'session';
    $('#navigation').style.display = active === 'session' ? 'none' : 'grid';
    $('#navigation').innerHTML = items.map(([id, ico, label]) => `<button class="nav-item ${active === id ? 'active' : ''}" data-action="go" data-route="/${id}" ${active === id ? 'aria-current="page"' : ''}>${icon(ico)}<span>${label}</span></button>`).join('');
  }
  function resumeCard() {
    if (!state.workout) return '';
    return `<div class="resume"><span>有一段未结束的练习<br><small>第 ${state.workout.round} 回合 · 已暂停</small></span><button data-action="go" data-route="/session">继续训练</button></div>`;
  }
  function isPractice(r) {
    return r.source === '体验记录' && !r.accelerated && r.seconds > 0;
  }
  function skillRecords(id) {
    return state.records.filter(r => isPractice(r) && r.type !== '自由回合' && r.title !== '自由回合' && r.lessonId === Number(id));
  }
  function practiceComplete(id) {
    return skillRecords(id).some(r => r.rounds >= r.totalRounds);
  }
  function flowSteps(active) {
    return `<div class="flow-steps" aria-label="练习流程">${['看要点','练一遍','留记录'].map((name,i)=>`<span class="${i===active?'current':''}"><b>${i+1}</b>${name}</span>`).join('<i>›</i>')}</div>`;
  }
  function persistDraft() {
    if (!state.draft) return;
    const index = state.records.findIndex(r => r.id === state.draft.id);
    if (index < 0) state.records.unshift({ ...state.draft });
    else state.records[index] = { ...state.records[index], ...state.draft };
  }
  function feedbackLabel(r) { return reflectionLabels[r.reflection] || reflectionLabels.pending; }
  function feedbackDescription(r) { return reflectionDescriptions[r.reflection] || reflectionDescriptions.pending; }
  function weekTarget() { return Number(state.profile.days.match(/\d+/)?.[0]) || 3; }
  function recommendation() {
    const recent = state.records.find(r => isPractice(r) && r.type !== '自由回合' && r.title !== '自由回合');
    if (recent && ['repeat','revisit'].includes(recent.reflection)) return { lesson:getLesson(recent.lessonId), revisit:recent.reflection==='revisit', recent, reason:recent.reflection==='revisit'?'根据上次自评，先回看要点。':'根据上次自评，继续巩固同一个重点。' };
    const lesson = lessons.find(l => !state.learned.includes(l.id) || !practiceComplete(l.id)) || getLesson(state.lastLesson);
    return { lesson, revisit:false, recent, reason:state.learned.includes(lesson.id)?'已学过这节课，接下来把要点练一遍。':'按基础路线推荐，也可以自行选择课程。' };
  }

  function weekRecords() {
    const now = new Date(`${today()}T12:00:00+08:00`); now.setUTCDate(now.getUTCDate() - (now.getUTCDay()+6)%7);
    const first = dayKey(now);
    return state.records.filter(r => isPractice(r) && dayKey(r.date) >= first && dayKey(r.date) <= today());
  }
  const pathData = window.ROUND_PATH;
  const pathSkills = pathData.skills;
  const getSkill = id => pathSkills.find(s => s.id === Number(id));
  let skillTab = 'knowledge', treeDomain = '技术', coachSkill = Number(state.coachSkill)||null;
  const stages = ['未探索','已理解','练习中','已点亮'];
  function skillProgress(id) { return state.skillProgress[id] || {}; }
  function evidenceFor(id) { return state.skillEvidence.filter(e => e.skillId === Number(id)); }
  function skillStage(id) {
    if(evidenceFor(id).length) return 3;
    if(skillRecords(id).length) return 2;
    return skillProgress(id).understood ? 1 : 0;
  }
  function focusedSkill() { return getSkill(state.focusSkill) || pathSkills.find(s=>skillStage(s.id)<3) || pathSkills[0]; }
  function statusBadge(id) { const n=skillStage(id); return badge(stages[n],n===3?'lit':n?'orange':''); }
  function sourceLinks(s) {
    return `<details class="disclosure source-detail"><summary>参考资料与内容说明</summary><p>本页为自主编排的学习卡，待教练审校。练习步骤与点亮清单用于记录观察，不是协会认证标准。</p>${pathData.sources.map(r=>`<a class="source-link" href="${r.url}" target="_blank" rel="noopener noreferrer">${esc(r.title)} ${icon('arrow',15)}</a><p class="tiny muted">${s.sourcePages} · 2022 版<br>外部资料用于查阅，本页核心内容可直接阅读。</p>`).join('')}</details>`;
  }
  function treePage() {
    topbar();navigation('home');
    const f=focusedSkill(),count=pathSkills.filter(s=>skillStage(s.id)===3).length;
    const domains=['技术','身体','战术','风格'];
    const domainCopy={身体:['为动作提供支持','力量、速度、协调与耐力将按测评条件记录。当前先观察站架中的平衡，不把身体能力换算成统一分数。'],战术:['从动作，走向选择','本路径的距离控制节点是战术入口：观察距离，选择调整、出手或等待。'],风格:['逐渐找到自己的打法','后续连接外围控制、压迫与反击。先积累技术和情境证据，再探索适合自己的组织方式。']};
    return `<div class="intro tree-intro"><span class="eyebrow">BUILD YOUR BOXING</span><h1>让拳击技能生长。</h1><p>理解它，练习它，留下点亮的证据。</p></div>${resumeCard()}
      <div class="domain-switch" aria-label="知识主干">${domains.map(d=>`<button class="chip ${treeDomain===d?'active':''}" data-action="tree-domain" data-value="${d}" aria-pressed="${treeDomain===d}">${d}</button>`).join('')}</div>
      ${treeDomain!=='技术'?`<section class="domain-note"><span class="eyebrow">${treeDomain==='战术'?'TACTICAL DECISIONS':'EXPLORATION'}</span><h2>${domainCopy[treeDomain][0]}</h2><p>${domainCopy[treeDomain][1]}</p>${treeDomain==='战术'?button('进入距离控制 '+icon('arrow',16),'open-skill','primary full','data-id="104"'):'<span class="tiny muted">知识分支规划中 · 当前可体验下方基础路径</span>'}</section>`:''}
      <section class="focus-card"><div class="between"><span class="eyebrow">正在攻克</span>${statusBadge(f.id)}</div><button class="focus-link" data-action="open-skill" data-id="${f.id}"><span><h2>${f.title}</h2><p>${f.subtitle}</p></span>${icon('arrow',23)}</button><div class="focus-footer"><span>${skillRecords(f.id).length} 次计时练习 · ${evidenceFor(f.id).length} 条验证</span><button data-action="coach-context" data-id="${f.id}">${icon('spark',14)} 问教练</button></div></section>
      <section class="section tree-section"><div class="section-head"><div><h2>${pathData.title}</h2><p class="tiny muted">基础路径 01 · 连线表示建议顺序</p></div><span class="path-count">${count}<small> / 4 点亮</small></span></div>
      <ol class="skill-tree">${pathSkills.map((s,i)=>`<li class="tree-step ${skillStage(s.id)===3?'is-lit':''} ${s.id===f.id?'is-focus':''}"><span class="tree-index" aria-hidden="true">${skillStage(s.id)===3?'✓':String(i+1).padStart(2,'0')}</span><button class="tree-node" data-action="open-skill" data-id="${s.id}"><span class="between"><span class="tiny muted">${s.domain} · ${s.short}</span>${statusBadge(s.id)}</span><h3>${s.title}</h3><p>${s.subtitle}</p><span class="tree-node-footer">知识 · 练习 · 点亮标准 ${icon('chevron',15)}</span></button></li>`).join('')}</ol><p class="support-copy">所有节点均可探索。点亮记录验证条件与来源，<br>不以课时、打卡或练习次数代替能力判断。</p></section>`;
  }
  function skillPage(id) {
    const s=getSkill(id);if(!s)return emptyFlow('未找到这个节点','回到技能树选择一个节点。','/home','回到技能树');
    topbar('基础路径 · '+String(pathSkills.indexOf(s)+1).padStart(2,'0'),'/home');navigation('home');
    const evidence=evidenceFor(id),stage=skillStage(id),previous=getSkill(s.prerequisite),next=pathSkills[pathSkills.indexOf(s)+1];
    const intro=`<div class="skill-heading"><div class="between"><span class="eyebrow">${s.domain} / ${s.short}</span>${statusBadge(id)}</div><h1>${s.title}</h1><p>${s.subtitle}</p><button class="text-link" data-action="focus-skill" data-id="${id}">${state.focusSkill===s.id?'✓ 当前攻克节点':'设为正在攻克'}</button></div>`;
    const tabs=`<div class="tabs skill-tabs" role="tablist" aria-label="技能内容">${[['knowledge','知识'],['practice','练习'],['criteria','点亮标准']].map(([key,label])=>`<button class="tab ${skillTab===key?'active':''}" role="tab" aria-selected="${skillTab===key}" data-action="skill-tab" data-tab="${key}">${label}</button>`).join('')}</div>`;
    let body='';
    if(skillTab==='knowledge') body=`<section class="knowledge-block"><h2>为什么要练它</h2><p>${s.purpose}</p></section>${previous?`<button class="prerequisite" data-action="open-skill" data-id="${previous.id}"><span>建议先了解：${previous.title}</span>${icon('chevron',15)}</button>`:'<div class="prerequisite"><span>路径起点 · 无前置节点</span>'+icon('flag',16)+'</div>'}<div class="principle-strip"><span>观察起点</span><i>→</i><span>完成任务</span><i>→</i><span>恢复准备</span></div><section class="knowledge-block"><h2>三个观察重点</h2>${s.points.map((p,i)=>`<div class="point"><span>0${i+1}</span><div>${p}</div></div>`).join('')}<p class="muted">${s.why}</p></section><details class="disclosure"><summary>常见问题，怎样观察</summary>${s.mistakes.map(m=>`<div class="mistake"><h3>${m.symptom}</h3><p>${m.observe}</p></div>`).join('')}</details><details class="disclosure" ${quizChecked?'open':''}><summary>检查一下理解 <span class="muted">选做</span></summary><div class="quiz-panel"><h3>${s.question}</h3>${s.choices.map((c,i)=>`<button class="quiz-choice ${quizAnswer===i?'selected':''}" data-action="answer" data-id="${i}" aria-pressed="${quizAnswer===i}"><span>${String.fromCharCode(65+i)}</span>${c}</button>`).join('')}${quizChecked?`<p class="quiz-result ${quizAnswer!==s.answer?'wrong':''}" role="status">${quizAnswer===s.answer?'理解正确。':'再想一想。'}${s.questionWhy}</p>`:button('检查答案','check-answer','secondary full',quizAnswer===null?'disabled':'')}</div></details>${sourceLinks(s)}<div class="flow-actions">${button((stage?'回顾完成，看看怎么练':'我已理解，看看怎么练')+' '+icon('arrow',16),'understand-skill','primary full',`data-id="${id}"`)}<p class="support-copy">记录为“已理解”，不会直接点亮技能。</p></div>`;
    else if(skillTab==='practice')body=`<div class="note">${icon('target',18)}<span>本次只选一个练习。计时记录会关联到这个节点。</span></div>${s.drills.map((d,i)=>`<section class="drill-card"><span class="eyebrow">PRACTICE 0${i+1}</span><h2>${d.title}</h2><p class="tiny muted">${d.setting}</p><ol>${d.steps.map(t=>`<li>${t}</li>`).join('')}</ol><div class="drill-cue">${icon('target',17)}<span>${d.cue}</span></div>${button('开始这项练习 '+icon('arrow',16),'skill-drill','primary full',`data-id="${id}" data-drill="${i}"`)}</section>`).join('')}<p class="support-copy">配合与打靶任务需教练安排；可先做徒手版本。<br>计时完成只记录经历，不自动点亮。</p>`;
    else body=`<div class="criteria-intro"><h2>什么情况下，可以点亮？</h2><p>理解用途，完成下列观察，再记录一次具体情境和反馈。计时与次数不作为通关标准。</p></div><ol class="criteria-list">${s.criteria.map(c=>`<li>${icon('check',17)}<span>${c}</span></li>`).join('')}</ol><p class="note">${s.boundary}</p><div class="stage-legend"><span>未探索</span><i>→</i><span>已理解</span><i>→</i><span>练习中</span><i>→</i><span>已点亮</span></div>${button('记录验证，点亮节点 '+icon('spark',17),'go','primary full',`data-route="/evidence/${id}"`)}<p class="support-copy">自评与教练反馈分开标注。此处不进行自动能力认证。</p>${evidence.length?`<section class="section"><h2>这个节点的验证</h2>${evidence.map(e=>evidenceCard(e)).join('')}</section>`:''}`;
    return intro+tabs+`<div role="tabpanel">${body}</div><div class="skill-bottom"><button class="text-link" data-action="coach-context" data-id="${id}">${icon('spark',17)} 围绕这个节点问教练</button>${next?`<button class="next-path" data-action="open-skill" data-id="${next.id}"><div><span class="tiny muted">关联下一步 · 随时可探索</span><h3>${next.title}</h3><p>${s.nextUse}</p></div>${icon('chevron',17)}</button>`:''}</div>`;
  }
  function evidenceCard(e) {
    const s=getSkill(e.skillId),record=state.records.find(r=>r.id===e.recordId);
    return `<article class="evidence-card"><div class="between"><span class="badge lit">${e.source==='coach'?'教练反馈 · 本人转录':'自评记录'}</span><span class="tiny muted">${cnDate(e.date)}</span></div><h3>${s?.title||'技能记录'}</h3><p class="evidence-context">${esc(e.context)}</p><p class="saved-note">${esc(e.note)}</p>${e.coach?`<p class="tiny muted">反馈者：${esc(e.coach)} · 未核验身份</p>`:''}${record?`<button class="text-link" data-action="record" data-id="${esc(record.id)}">关联练习 · ${readableTime(record.seconds)} ${icon('chevron',14)}</button>`:`<p class="tiny muted">${e.recordId==='offline'?'线下练习 · 本人手动记录':'原关联计时已删除，验证文字保留'}</p>`}<div class="between evidence-footer"><button class="text-link" data-action="open-skill" data-id="${e.skillId}">回到节点 ${icon('chevron',14)}</button><button class="text-link" data-action="revoke-evidence" data-id="${e.id}">撤回此验证</button></div></article>`;
  }
  function evidencePage(id) {
    const s=getSkill(id);if(!s)return treePage();
    topbar('记录一次验证','/skill/'+id);navigation('home');
    const d=state.evidenceDrafts[id]||{}, records=skillRecords(id),checked=d.checks||[];
    return `<div class="intro"><span class="eyebrow">EVIDENCE, NOT A SCORE</span><h1>${s.title}</h1><p>只记录实际观察到的表现。不确定的项目可以留待下一次。</p></div><form id="evidence-form" data-skill="${id}"><fieldset class="observation-list"><legend>逐项确认观察标准</legend>${s.criteria.map((c,i)=>`<label><input type="checkbox" name="criterion" value="${i}" ${checked.includes(String(i))?'checked':''}><span>${c}</span></label>`).join('')}</fieldset><label class="field-label" for="evidence-record">练习来源</label><select class="input" id="evidence-record" name="recordId"><option value="offline">线下练习 · 手动记录</option>${records.map(r=>`<option value="${esc(r.id)}" ${d.recordId===r.id?'selected':''}>${cnDate(r.date)} · ${readableTime(r.seconds)} · ${esc(r.drillTitle||r.title)}</option>`).join('')}</select><p class="tiny muted">演示快进与自由回合不会列为这个技能的练习证据。</p><label class="field-label" for="evidence-context">验证条件</label><input id="evidence-context" class="input" name="context" maxlength="160" required placeholder="${s.contextHint}" value="${esc(d.context||'')}"><label class="field-label" for="evidence-source">反馈来源</label><select id="evidence-source" class="input" name="source"><option value="self" ${d.source!=='coach'?'selected':''}>自评 · 本人观察</option><option value="coach" ${d.source==='coach'?'selected':''}>教练反馈 · 由本人转录</option></select><label class="field-label" for="evidence-coach">教练称呼 <span class="muted">转录教练反馈时填写</span></label><input id="evidence-coach" class="input" name="coach" maxlength="40" value="${esc(d.coach||'')}" placeholder="无需填写联系方式"><label class="field-label" for="evidence-note">观察记录 / 教练原话</label><textarea id="evidence-note" class="input" name="note" maxlength="600" required placeholder="写下当时怎样做、观察到了什么，以及仍需巩固的地方。">${esc(d.note||'')}</textarea><label class="attestation"><input type="checkbox" name="attested" ${d.attested?'checked':''}><span>我已实际完成上述情境，并按实际观察填写；这是有条件的记录，不是能力认证。</span></label><p class="form-error" id="evidence-error" role="alert"></p><button class="button primary full" type="submit">保存验证并点亮 ${icon('spark',18)}</button><p class="support-copy">${skillProgress(id).understood?'已记录知识理解。':'请先在知识页确认理解，再提交点亮。'}<br>草稿自动保存在当前浏览器。</p></form>`;
  }
  function saveEvidence(id,draft) {
    const s=getSkill(id);
    if(!s)return '节点不存在。';
    if(!skillProgress(id).understood)return '请先回到知识页确认理解，再记录验证。';
    if(!s.criteria.every((_,i)=>(draft.checks||[]).includes(String(i))))return '请逐项确认观察标准；尚未做到的项目可以继续练习。';
    if(!(draft.context||'').trim()||!(draft.note||'').trim())return '请填写验证条件和具体观察。';
    if(!draft.attested)return '请确认记录来自你实际完成的情境。';
    if(!['self','coach'].includes(draft.source))return '请选择反馈来源。';
    if(draft.source==='coach'&&!(draft.coach||'').trim())return '请填写教练称呼，便于以后回顾反馈来源。';
    if(draft.recordId!=='offline'&&!skillRecords(id).some(r=>r.id===draft.recordId))return '所选练习已不存在或属于演示记录，请重新选择来源。';
    state.skillEvidence.unshift({ id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),skillId:Number(id),date:new Date().toISOString(),context:draft.context.trim().slice(0,160),note:draft.note.trim().slice(0,600),source:draft.source,coach:draft.source==='coach'?draft.coach.trim().slice(0,40):'',recordId:draft.recordId,checks:[...draft.checks],attested:true,rubricVersion:1 });
    delete state.evidenceDrafts[id];save();return '';
  }
  function pathTrainPage() {
    topbar();navigation('train');const f=focusedSkill();
    return `${resumeCard()}<div class="intro"><span class="eyebrow">PRACTICE WITH PURPOSE</span><h1>练一个明确的能力。</h1><p>从技能出发，选择本次要观察的重点。</p></div><section class="training-hero">${badge('正在攻克','dark')}<h2>${f.title}</h2><p>${f.drills[0].cue}</p>${button('选择配套练习 '+icon('arrow',17),'open-practice','primary full',`data-id="${f.id}"`)}</section><section class="section"><div class="section-head"><h2>基础路径练习</h2><span class="tiny muted">4 个节点</span></div>${pathSkills.map(s=>`<button class="task-card" data-action="open-practice" data-id="${s.id}"><span class="task-icon">${icon(s.pose==='step'?'foot':'target',22)}</span><span class="grow"><h3>${s.title}</h3><p>${s.drills.length} 种练法 · ${stages[skillStage(s.id)]}</p></span>${icon('chevron',16)}</button>`).join('')}</section><button class="task-card" data-action="prepare" data-id="${f.id}" data-type="自由回合"><span class="task-icon orange">${icon('clock',22)}</span><span class="grow"><h3>自由回合</h3><p>保留计时，不归入单项技能验证</p></span>${icon('chevron',16)}</button><p class="support-copy">无需设备即可体验。计时和实际动作表现分别记录。</p>`;
  }
  function pathGrowthPage() {
    topbar();navigation('growth');const lit=pathSkills.filter(s=>skillStage(s.id)===3).length,practices=state.records.filter(isPractice);
    let content='';
    if(growthTab==='evidence')content=state.skillEvidence.length?state.skillEvidence.map(evidenceCard).join(''):`<div class="empty">${icon('spark',29)}<h3>让进步有据可查</h3><p>完成节点观察标准后，记录条件和反馈，留下第一条验证。</p>${button('查看点亮标准','open-criteria','primary full',`data-id="${focusedSkill().id}"`)}</div>`;
    else if(growthTab==='skills')content=pathSkills.map(s=>`<button class="skill-row" data-action="open-skill" data-id="${s.id}"><span class="task-icon">${icon(skillStage(s.id)===3?'check':'target',20)}</span><span class="grow"><h3>${s.title}</h3><p>${skillRecords(s.id).length} 次计时 · ${evidenceFor(s.id).length} 条验证</p></span>${statusBadge(s.id)}</button>`).join('');
    else content=state.records.length?`<div class="history-list">${historyRows(state.records)}</div>`:`<div class="empty">${icon('book',29)}<h3>练过的，都可以留下</h3><p>从技能进入练习，结束后计时与回合会自动保存。</p>${button('选择一个练习','go','primary full','data-route="/train"')}</div>`;
    return `<div class="intro"><span class="eyebrow">PROGRESS WITH EVIDENCE</span><h1>看见能力怎样生长。</h1><p>理解、练习和情境验证，分别记录。</p></div><section class="growth-overview"><div><strong>${lit}<small> / 4</small></strong><span>节点点亮</span></div><div><strong>${state.skillEvidence.length}</strong><span>情境验证</span></div><div><strong>${practices.length}</strong><span>计时练习</span></div></section><p class="support-copy">点亮依据手动填写的观察，来源清楚标注。<br>示例与演示快进不计入计时练习。</p><div class="tabs" role="tablist" aria-label="成长内容">${[['evidence','验证记录'],['skills','技能变化'],['history','练习历史']].map(([key,label])=>`<button class="tab ${growthTab===key?'active':''}" role="tab" aria-selected="${growthTab===key}" data-action="growth-tab" data-tab="${key}">${label}</button>`).join('')}</div><div role="tabpanel">${content}</div>`;
  }
  function coachReply(question,id) {
    const selected=getSkill(id)||focusedSkill(),q=question.trim();
    const matches=pathSkills.map(s=>({s,n:(q.includes(s.title)?10:0)+s.keywords.filter(k=>q.includes(k)).length})).sort((a,b)=>b.n-a.n);
    const scoped=/怎么练|怎样练|点亮|标准|下一步|这个|本节点|理解|重点|卡住|为什么/.test(q);
    if(!matches[0].n&&!scoped)return {skillId:selected.id,question:q,kind:'unknown',text:'目前只收录这条基础路径，未检索到足够相关的内容。可以选择一个节点，再问“怎么练”或“怎样点亮”；其他问题请先记下，与教练讨论。'};
    const s=matches[0].n?matches[0].s:selected;
    let text,kind='knowledge';
    if(/点亮|标准|掌握|验证/.test(q)){kind='criteria';text=`${s.title}当前为「${stages[skillStage(s.id)]}」。需要先理解知识，再在具体条件下逐项观察：\n${s.criteria.map((c,i)=>`${i+1}. ${c}`).join('\n')}\n${s.boundary}`;}
    else if(/怎么练|怎样练|下一步|练习/.test(q)){kind='practice';const d=s.drills[0];text=`可以从「${d.title}」开始。\n${d.steps.map((t,i)=>`${i+1}. ${t}`).join('\n')}\n观察重点：${d.cue}\n这是一项节点练习建议，没有评估你当前的实际动作。`;}
    else {text=`${s.purpose}\n\n可以检查：${s.points.join('\n')}\n\n如果你遇到「${s.mistakes[0].symptom}」：${s.mistakes[0].observe}\n这些是知识卡中的观察方向，不能据此确定你的具体问题。`;}
    return {skillId:s.id,question:q,text,kind};
  }
  function askCoach(question) {
    const q=question.trim().slice(0,400);if(!q)return;
    const reply=coachReply(q,coachSkill||focusedSkill().id);coachSkill=reply.skillId;state.coachSkill=coachSkill;
    state.coachMessages.push({...reply,date:new Date().toISOString()});
    state.coachMessages=state.coachMessages.slice(-20);state.coachDraft='';save();render(false);
    $('#coach-answer-end')?.scrollIntoView({block:'end',behavior:'smooth'});
  }
  function coachPage() {
    topbar();navigation('coach');const s=getSkill(coachSkill)||focusedSkill();
    return `<div class="intro"><span class="eyebrow">YOUR CORNER</span><h1>把问题，问得更具体。</h1><p>围绕一个节点，理解要点与下一步。</p></div><div class="coach-disclosure">${icon('spark',18)}<span><strong>知识库助手 · 原型</strong><br>本地检索 4 个节点，尚未接入大模型。<br>不读取视频，不自动评价动作。</span></div><label class="field-label" for="coach-skill">当前讨论的技能</label><select class="input" id="coach-skill">${pathSkills.map(x=>`<option value="${x.id}" ${x.id===s.id?'selected':''}>${x.title}</option>`).join('')}</select><div class="coach-prompts">${['这个节点怎么练？','怎样才能点亮？','这个节点的重点是什么？'].map(q=>`<button data-action="coach-prompt" data-value="${q}">${q} ${icon('arrow',14)}</button>`).join('')}</div><div class="coach-conversation" aria-live="polite">${state.coachMessages.map(m=>`<div class="question-bubble">${esc(m.question)}</div><article class="answer-bubble"><span class="eyebrow">${m.kind==='unknown'?'检索范围说明':'知识卡检索 · '+getSkill(m.skillId).title}</span><p>${esc(m.text)}</p>${m.kind==='unknown'?'':`<button class="text-link" data-action="${m.kind==='practice'?'open-practice':m.kind==='criteria'?'open-criteria':'open-skill'}" data-id="${m.skillId}">查看对应知识卡 ${icon('chevron',14)}</button><a class="tiny source-link" href="${pathData.sources[0].url}" target="_blank" rel="noopener noreferrer">参考来源：England Boxing · ${getSkill(m.skillId).sourcePages}</a><span class="tiny muted">练习和点亮清单为本原型编排，待教练审校。</span>`}</article>`).join('')}<div id="coach-answer-end"></div></div><form id="coach-form" class="coach-composer"><label class="field-label" for="coach-question">你的问题</label><textarea id="coach-question" name="question" class="input" maxlength="400" required placeholder="例如：移动中刺拳为什么容易失衡？">${esc(state.coachDraft||'')}</textarea><button class="button primary full" type="submit">查找相关知识 ${icon('arrow',17)}</button></form><p class="support-copy">问题仅保存在当前浏览器，不发送给外部 AI 服务。</p>`;
  }

  function homePage() { return treePage(); }
  function learnPage() {
    topbar(); navigation('learn');
    const rec = recommendation(), current = unitFilter === null ? rec.lesson.unit : unitFilter;
    return `<div class="intro"><span class="eyebrow">LEARN WITH A PATH</span><h1>一步一步，建立基础。</h1><p>每节短课，一个重点，接着练一遍。</p></div><div class="learning-overview"><div><span class="small muted">基础入门</span><h3>已学 ${state.learned.length} / ${lessons.length} 节</h3></div><button class="text-link" data-action="lesson" data-id="${rec.lesson.id}">继续第 ${rec.lesson.id} 课 ${icon('arrow',16)}</button><div class="progress-track"><span style="width:${state.learned.length/lessons.length*100}%"></span></div></div>
    <div class="unit-list">${units.map((u,i)=>{const list=lessons.filter(l=>l.unit===i), count=list.filter(l=>state.learned.includes(l.id)).length;return `<section class="unit-block ${current===i?'open':''}"><button class="unit-heading" data-action="unit" data-id="${i}" aria-expanded="${current===i}"><span class="unit-index">0${i+1}</span><span class="grow"><h2>${u}</h2><small>${list.length} 节课 · 已学 ${count} 节</small></span>${icon(current===i?'check':'chevron',17)}</button>${current===i?`<div class="unit-lessons">${list.map(l=>{const learned=state.learned.includes(l.id), n=skillRecords(l.id).length;return `<button class="lesson-card ${l.id===rec.lesson.id?'recommended':''}" data-action="lesson" data-id="${l.id}"><span class="lesson-number ${learned?'done':''}">${learned?icon('check',18):String(l.id).padStart(2,'0')}</span><span class="lesson-copy"><h3>${l.title}</h3><p>${l.minutes} 分钟 · ${n?`练过 ${n} 次`:learned?'已学 · 待练习':'含配套练习'}</p></span>${icon('chevron',15)}</button>`;}).join('')}</div>`:''}</section>`;}).join('')}</div>
    <button class="next-path" data-action="path"><span>${icon('flag',20)}</span><div><h3>之后，还能学什么？</h3><p>组合运用 → 情境应用 → 风格与战术</p></div>${icon('chevron',16)}</button><p class="support-copy">课程可自由浏览，学习进度与能力评价分别记录。</p>`;
  }

  function lessonPage(id) {
    const l = getLesson(id); topbar('第 '+l.id+' 课 · '+units[l.unit],'/learn'); navigation('learn');
    const done = state.learned.includes(l.id);
    return `${flowSteps(0)}<div class="lesson-heading"><h1>${l.title}</h1><p class="small muted">${l.subtitle} · ${l.minutes} 分钟</p></div><div class="lesson-visual">${boxer(l.pose,lessonPlaying)}<span class="visual-caption">动作示意 · ${lessonPlaying?'播放中':'点击播放'}</span><button class="play-button" data-action="play-lesson" aria-label="${lessonPlaying?'暂停':'播放'}动作示意">${icon(lessonPlaying?'pause':'play',18)}</button></div><p class="visual-footer">示意动画用于原型体验，正式教学内容待教练审校。</p><section class="section"><h2>记住这几个要点</h2>${l.points.map((p,i)=>`<div class="point"><span>0${i+1}</span><div>${p}</div></div>`).join('')}</section><details class="disclosure"><summary>一个常见问题</summary><p>${l.mistake}</p></details><details class="disclosure" ${lessonTab==='quiz'?'open':''}><summary>检查一下理解 <span class="muted">选做</span></summary><div class="quiz-panel"><h3>${l.question}</h3>${l.choices.map((c,i)=>`<button class="quiz-choice ${quizAnswer===i?'selected':''}" data-action="answer" data-id="${i}" aria-pressed="${quizAnswer===i}"><span>${String.fromCharCode(65+i)}</span>${c}</button>`).join('')}${quizChecked?`<div class="quiz-result ${quizAnswer!==l.answer?'wrong':''}" role="status">${quizAnswer===l.answer?'理解正确，带着要点去练习。':l.points[2]}</div>`:button('检查答案','check-answer','secondary full',quizAnswer===null?'disabled':'')}</div></details><div class="flow-actions">${button((done?'再练一次':'学完了，去练习')+' '+icon('arrow',17),'complete-lesson','primary full',`data-id="${l.id}"`)}<p class="support-copy">配套回合练习 · 时长可以调整</p></div>`;
  }

  function trainPage() { return pathTrainPage(); }
  function prepare(id, type='课程练习') {
    if (state.workout) {
      modal('接着上一次的练习','<p>已有一段暂停的训练。可以继续，或在训练页结束后开始新的任务。</p>',button('继续训练','go','primary full','data-route="/session"')+button('稍后再练','close-modal','secondary full')); return;
    }
    persistDraft(); state.draft=null;
    const selected = Number(id) || recommendation().lesson.id;
    setup = { ...setup, lessonId:selected, type, drillIndex:null };
    if(getSkill(selected)&&type!=='自由回合')state.focusSkill=selected;
    settingsOpen=false; state.lastLesson=selected; state.pendingSetup={...setup}; save(); go('/setup/'+selected);
  }

  function setupPage(id) {
    setup.lessonId=getLesson(id).id;
    const l=getLesson(id), free=setup.type==='自由回合', drill=!free?getSkill(id)?.drills[setup.drillIndex]:null; topbar('训练准备','/train'); navigation('train');
    return `${flowSteps(1)}<div class="setup-heading"><span class="task-icon orange">${icon('glove',26)}</span><div><h1>${free?'自由回合':l.title}</h1><p>${esc(drill?.title||setup.type)} · ${esc(drill?.setting||setup.equipment+'可练')}</p></div></div><div class="note">${icon('target',19)}<span>${free?'为自己选一个重点，按自己的节奏练。':drill?.cue||l.points[2]}</span></div>${drill?'<ol class="setup-steps">'+drill.steps.map(t=>'<li>'+t+'</li>').join('')+'</ol>':''}<div class="session-plan"><div><strong>${setup.rounds}<small> 回合</small></strong><span>每回合 ${setup.seconds} 秒</span></div><div><strong>15<small> 秒</small></strong><span>回合间休息</span></div></div><div class="between plan-total"><span>预计 ${readableTime(setup.rounds*setup.seconds+(setup.rounds-1)*15)}</span><button class="text-link" data-action="setup-toggle" aria-expanded="${settingsOpen}">调整设置 ${icon('chevron',14)}</button></div>
    ${settingsOpen?`<div class="settings-panel"><div class="form-section"><span class="label">回合数量</span><div class="segmented">${[2,3,4].map(n=>`<button class="chip ${setup.rounds===n?'active':''}" data-action="setup-value" data-key="rounds" data-value="${n}" aria-pressed="${setup.rounds===n}">${n} 回合</button>`).join('')}</div></div><div class="form-section"><span class="label">每回合时长</span><div class="segmented">${[30,60,90].map(n=>`<button class="chip ${setup.seconds===n?'active':''}" data-action="setup-value" data-key="seconds" data-value="${n}" aria-pressed="${setup.seconds===n}">${n} 秒</button>`).join('')}</div></div><div class="form-section"><span class="label">练习器材</span><div class="segmented">${['徒手','普通沙袋'].map(value=>`<button class="chip ${setup.equipment===value?'active':''}" data-action="setup-value" data-key="equipment" data-value="${value}" aria-pressed="${setup.equipment===value}">${value}</button>`).join('')}</div></div><div class="setting-row"><div><h3>示意回放</h3><p>仅播放课程动画，不调用摄像头</p></div><button class="switch ${setup.recording?'on':''}" role="switch" aria-checked="${setup.recording}" aria-label="示意回放" data-action="toggle-setting" data-key="recording"></button></div></div>`:''}
    <button class="device-entry" data-action="devices">${icon('bluetooth',19)}<span>设备辅助 <small>${state.demoTarget?'墙靶模拟连接':'可选 · 无设备也能练'}</small></span>${icon('chevron',15)}</button><div class="flow-actions">${button('开始第一回合 '+icon('arrow',17),'start-session','primary full')}<p class="support-copy">结束后自动保存记录，自评可以稍后补充。</p></div>`;
  }

  function startSession() {
    if (state.workout) return;
    state.preferences = { rounds:setup.rounds, seconds:setup.seconds, equipment:setup.equipment, recording:setup.recording };
    state.pendingSetup=null;
    const l = getLesson(setup.lessonId);
    state.workout = { id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), lessonId: l.id, title: setup.type==='自由回合'?'自由回合':l.title, type:setup.type, drillIndex:setup.drillIndex, drillTitle:getSkill(l.id)?.drills[setup.drillIndex]?.title||'', cue:getSkill(l.id)?.drills[setup.drillIndex]?.cue||'', round:1, phase:'work', totalRounds:setup.rounds, secondsPerRound:setup.seconds, remainingMs:setup.seconds*1000, phaseTotal:setup.seconds, paused:false, activeMs:0, completed:0, equipment:setup.equipment, recording:setup.recording, voice:setup.voice, target:state.demoTarget, accelerated:false, startedAt:new Date().toISOString() };
    lastTick = performance.now(); save(); go('/session');
  }
  function sessionPage() {
    const w = state.workout;
    if (!w) return emptyFlow('还没有开始训练','去选择一项练习，再开始计时。','/train','选择训练');
    topbar('专注这一回合','/train',`<button class="icon-btn" data-action="session-info" aria-label="训练状态说明">${icon('info',18)}</button>`); navigation('session');
    $('#topbar [data-action="go"]').dataset.action = 'exit-session';
    const l = getLesson(w.lessonId), rest = w.phase==='rest';
    return `<div class="training-screen"><div class="round-label">ROUND ${String(w.round).padStart(2,'0')} / ${String(w.totalRounds).padStart(2,'0')}</div><div class="phase-title">${rest?'休息一下，再继续':esc(w.title)}</div><div class="timer-ring"><svg class="timer-svg" viewBox="0 0 240 240" aria-hidden="true"><circle class="timer-track" cx="120" cy="120" r="113"/><circle id="timer-progress" class="timer-progress" cx="120" cy="120" r="113" stroke-dasharray="710" stroke-dashoffset="0"/></svg><div><div class="time-main" id="timer-value">${time(Math.ceil(w.remainingMs/1000))}</div><div class="time-label" id="timer-state">${w.paused?'已暂停':rest?'恢复呼吸 · 准备下一回合':'跟着自己的节奏'}</div><div class="round-dots">${Array.from({length:w.totalRounds},(_,i)=>`<span class="${i<w.round?'active':''}"></span>`).join('')}</div></div></div><div class="cue">${icon(rest?'clock':'target',22)}<div><small>${rest?'下一回合的重点':w.voice?'提示文案 · 模拟语音':'这一回合，只记住'}</small><strong>${rest?'准备好后，再回到护架。':w.type==='自由回合'?'选择一个重点，按自己的节奏练。':w.cue||l.points[2]}</strong></div></div><div class="session-tags">${badge(w.equipment)}${w.recording?badge('示意回放已开启'):''}${w.target?badge('墙靶：模拟连接'):''}</div><div class="session-controls">${button(`${icon(w.paused?'play':'pause',18)} ${w.paused?'继续':'暂停'}`,'pause-session','white', 'id="pause-button"')}${button('结束','exit-session','outline')}</div><button class="skip-button" data-action="skip-phase">${rest?'跳过休息':'跳到下一阶段'} · 演示快进</button><p class="session-footer">计时真实运行，未采集动作或击打数据。<br>快进会标记为体验流程，不计入有效计时积累。</p></div>`;
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
    state.draft={ id:w.id, date:new Date().toISOString(), lessonId:w.lessonId, title:w.title, type:w.type, drillIndex:w.drillIndex, drillTitle:w.drillTitle||'', source:'体验记录', seconds:Math.floor(w.activeMs/1000), rounds:w.completed, totalRounds:w.totalRounds, equipment:w.equipment, accelerated:w.accelerated, recording:w.recording, target:w.target, reflection:'', effort:null, note:'' };
    persistDraft(); state.workout=null; review={reflection:'',effort:null,note:''}; save(); go('/review');
  }

  function emptyFlow(title, text, path, label) {
    topbar(title,'/home'); navigation('train');
    return `<div class="empty" style="margin-top:35px">${icon('info',30)}<h2>${title}</h2><p style="margin-top:12px">${text}</p>${button(label,'go','primary full',`data-route="${path}"`)}</div>`;
  }
  function reviewPage() {
    if(!state.draft) return emptyFlow('记录已经保存','可以在成长页回看，或开始下一次练习。','/growth','查看成长记录');
    const d=state.draft; review={reflection:d.reflection||'',effort:d.effort??null,note:d.note||''};
    topbar('本次练习','/growth'); navigation('growth');
    return `${flowSteps(2)}<div class="saved-heading"><span class="saved-check">${icon('check',23)}</span><div><h1>这一回合，已记下。</h1><p>${esc(d.title)}</p></div></div><div class="review-metrics"><span><strong>${readableTime(d.seconds)}</strong>实际计时</span><span><strong>${d.rounds} / ${d.totalRounds}</strong>已走过回合</span></div>${d.accelerated?'<div class="note orange">'+icon('info',18)+'<span>含演示快进，保留体验记录，不计入本周练习积累。</span></div>':''}<div class="section"><div class="section-head"><h2>这一轮，感觉如何？</h2><span class="tiny muted">可选</span></div>${['steady','repeat','revisit'].map(k=>`<button class="review-choice ${review.reflection===k?'selected':''}" data-action="reflection" data-value="${k}" aria-pressed="${review.reflection===k}"><span class="choice-mark">${review.reflection===k?'✓':''}</span><span><h3>${reflectionLabels[k]}</h3></span></button>`).join('')}</div><details class="disclosure"><summary>留一句话给下次的自己 <span class="muted">可选</span></summary><textarea id="review-note" class="input" maxlength="240" placeholder="下次想关注什么？">${esc(review.note)}</textarea><label class="effort-caption" for="effort">主观费力程度 <span id="effort-value">${review.effort?review.effort+'/5':'未填写'}</span></label><input class="effort" id="effort" type="range" min="1" max="5" value="${review.effort||2}"><div class="range-labels"><span>轻松</span><span>很费力</span></div></details>${getSkill(d.lessonId)&&d.type!=='自由回合'?`<div class="record-skill-link"><p>已关联「${getSkill(d.lessonId).title}」。计时与自评不会自动点亮。</p>${button('查看标准，记录验证','go','outline full',`data-route="/evidence/${d.lessonId}"`)}</div>`:''}${d.recording?`<button class="text-link" data-action="clip">${icon('play',16)} 回看课程示意</button>`:''}<div class="flow-actions">${button('完成，查看成长 '+icon('arrow',17),'save-review','primary full')}<p class="support-copy">${storageAvailable?'记录已保存在当前浏览器。':'浏览器存储不可用，记录暂存于本次打开期间。'}自评会帮助安排下一步。</p></div>`;
  }

  function saveReview() {
    if (!state.draft) return;
    Object.assign(state.draft,review); persistDraft(); state.draft=null;
    growthTab='history'; historyFilter='all'; save(); go('/growth');
  }

  function summaryPage(id) {
    const r=state.records.find(r=>r.id===id);
    if(!r)return emptyFlow('这条记录不存在','记录可能已重置。可以在成长页查看当前保存的记录。','/growth','查看成长');
    topbar('这一回合的收获','/growth'); navigation('growth');
    const next=r.reflection==='revisit'?'先回看要点，再练一次':r.reflection==='repeat'?'同一个重点，再练一次':'保持这个重点，下次再确认';
    return `<div class="success-icon">${icon('check',31)}</div><div class="success-title"><h1>这一回合，留下了。</h1><p>${esc(r.title)}<br>你的复盘已存入成长记录。</p></div><div class="report-grid"><div class="report-cell"><small>${r.source==='示例记录'?'示例时长':'实际运行的体验计时'}</small><strong>${Math.floor(r.seconds/60)}<span>分</span> ${r.seconds%60}<span>秒</span></strong></div><div class="report-cell"><small>已走过的回合流程</small><strong>${r.rounds}<span>/ ${r.totalRounds} 回合</span></strong></div></div><div class="card"><div class="between"><h3>你的自评</h3>${badge(r.source,'orange')}</div><p class="small" style="margin-top:12px">${feedbackLabel(r)}</p>${r.note?`<p class="saved-note muted">“${esc(r.note)}”</p>`:''}<p class="tiny muted" style="margin-top:12px">动作能力尚未测评；本次未采集真实设备数据。</p></div><div class="section"><div class="section-head"><h2>下一步，接着走</h2></div><div class="note">${icon('target',18)}<span>${next}。${getLesson(r.lessonId).points[2]}</span></div></div><div class="bottom-actions">${button('查看成长记录 '+icon('arrow',16),'show-history','primary full')}${button(r.reflection==='revisit'?'回看这节课程':'再练一次',r.reflection==='revisit'?'lesson':'prepare','outline full',`data-id="${r.lessonId}"`)}</div>`;
  }
  function historyRows(list) {
    return list.map(r=>{const date=new Date(r.date);return `<button class="record-row" data-action="record" data-id="${r.id}"><span class="record-date"><strong>${new Intl.DateTimeFormat('en',{timeZone:'Asia/Shanghai',day:'2-digit'}).format(date)}</strong><small>${new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'short'}).format(date)}</small></span><span class="grow"><h3>${esc(r.title)}</h3><p>${readableTime(r.seconds)} · ${r.rounds}/${r.totalRounds} 回合<br>${r.source==='示例记录'?'示例记录 · ':r.accelerated?'含演示快进 · ':''}${feedbackLabel(r)}</p></span>${icon('chevron',15)}</button>`;}).join('');
  }

  function growthPage() { return pathGrowthPage(); }
  function recordPage(id) {
    const r=state.records.find(r=>r.id===id); if(!r)return emptyFlow('记录不存在','这条记录可能已经重置或删除。','/growth','返回成长');
    topbar('练习记录','/growth'); navigation('growth');
    return `<div class="intro">${badge(r.source,r.source==='体验记录'?'orange':'')}<h1 style="margin-top:14px">${esc(r.title)}</h1><p>${cnDate(r.date)} · ${esc(r.equipment)}${r.accelerated?' · 含演示快进':''}</p></div><div class="report-grid" style="margin-top:0"><div class="report-cell"><small>${r.source==='示例记录'?'示例时长':'体验计时'}</small><strong>${Math.floor(r.seconds/60)}<span>分</span> ${r.seconds%60}<span>秒</span></strong></div><div class="report-cell"><small>回合流程</small><strong>${r.rounds}<span>/ ${r.totalRounds}</span></strong></div></div><div class="card"><div class="between"><h3>${feedbackLabel(r)}</h3>${badge(r.reflection?'来源：自评':'待补充自评')}</div><p class="small muted" style="margin-top:12px">${feedbackDescription(r)}</p><p class="tiny muted" style="margin-top:12px">主观费力程度 ${r.effort?r.effort+'/5':'未填写'}</p>${r.note?`<p class="saved-note">${esc(r.note)}</p>`:''}</div>${r.recording?`<button class="preview-clip" style="margin-top:17px" data-action="clip" data-id="${r.lessonId}"><span><span class="clip-play">${icon('play',14)}</span><h3>课程动作示意</h3><span class="tiny muted">本次未保存真实录像</span></span>${boxer(getLesson(r.lessonId).pose)}</button>`:''}<div class="note" style="margin-top:20px">${icon('info',17)}<span>这条记录${r.source==='示例记录'?'是预置演示内容':'来自原型交互'}。没有真实动作识别、拳力或鞋垫数据。节点验证另行记录情境和来源。</span></div><div class="bottom-actions">${r.source==='体验记录'?button(r.reflection?'调整自评':'补充自评','edit-review','primary full',`data-id="${r.id}"`):''}${button('按同一任务再练一次','prepare','outline full',`data-id="${r.lessonId}" data-type="${r.type==='自由回合'||r.title==='自由回合'?'自由回合':'课程练习'}"`)}${button('回看对应课程','lesson','outline full',`data-id="${r.lessonId}"`)}</div><button class="text-link" style="margin:18px auto 0;color:#aa6247" data-action="delete-record" data-id="${r.id}">删除这条本地记录</button>`;
  }
  function profilePage() {
    topbar('个人与设备','/home'); navigation('profile');
    return `<div class="profile-card"><span class="avatar">${esc(state.profile.name.slice(0,1))}</span><div><h1>${esc(state.profile.name)}</h1><p>${esc(state.profile.experience)} · ${esc(state.profile.stance)}</p></div></div><div class="card"><div class="between"><span class="tiny muted">我的训练目标</span>${badge('本地体验档案')}</div><h2 style="margin-top:10px">${esc(state.profile.goal)}</h2><p class="small muted" style="margin-top:8px">沿着技能路径，积累自己的训练证据。</p></div><div class="section card" style="padding:0 17px"><button class="menu-button" data-action="go" data-route="/profile/edit">${icon('user',18)}<span>调整个人档案</span>${icon('chevron',15)}</button><button class="menu-button" data-action="devices">${icon('bluetooth',18)}<span>设备与辅助记录</span><small>${state.demoTarget?'1 个模拟连接':'未接入真实设备'}</small>${icon('chevron',15)}</button><button class="menu-button" data-action="path">${icon('flag',18)}<span>完整发展路线</span>${icon('chevron',15)}</button></div><div class="section card" style="padding:0 17px"><button class="menu-button" data-action="export">${icon('download',18)}<span>导出本地体验记录</span>${icon('chevron',15)}</button><button class="menu-button" data-action="blank">${icon('user',18)}<span>清空本地体验进度</span>${icon('chevron',15)}</button><button class="menu-button" data-action="reset">${icon('reset',18)}<span>载入示例档案</span>${icon('chevron',15)}</button><button class="menu-button" data-action="about">${icon('info',18)}<span>关于这个原型</span>${icon('chevron',15)}</button></div><p class="support-copy">${storageAvailable?'进度仅保存在当前浏览器；清理浏览器数据会移除记录。':'浏览器存储不可用：当前进度只保留在本次打开期间。'}<br>ROUND · Prototype 0.3</p>`;
  }
  function editProfilePage() {
    topbar('个人档案','/profile'); navigation('profile'); const p=state.profile;
    const select=(key,label,options)=>`<div class="form-section"><label for="profile-${key}">${label}</label><select class="input" id="profile-${key}" name="${key}">${options.map(o=>`<option ${p[key]===o?'selected':''}>${o}</option>`).join('')}</select></div>`;
    return `<div class="intro"><h1>从你的起点开始。</h1><p>设置每周计划，记录自己的练习偏好。</p></div><form id="profile-form"><div class="form-section" style="margin-top:0"><label for="profile-name">怎么称呼你</label><input class="input" id="profile-name" name="name" maxlength="20" required value="${esc(p.name)}" autocomplete="nickname"></div>${select('experience','当前经验',['刚刚开始','有少量练习经验','正在跟随教练学习'])}${select('goal','当前目标',['扎实基本功','建立训练习惯','提高动作稳定性'])}${select('stance','目前使用的站架',['左脚在前','右脚在前','暂未确定'])}${select('days','希望每周安排',['每周 2 次','每周 3 次','每周 4 次'])}<div class="bottom-actions"><button class="button primary full" type="submit">保存档案 ${icon('check',16)}</button></div></form><p class="support-copy">站架信息作为自填偏好保存，不用于自动判断适合的打法。</p>`;
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
    else if(route.startsWith('/skill/'))html=skillPage(route.split('/')[2]);
    else if(route.startsWith('/evidence/'))html=evidencePage(route.split('/')[2]);
    else if(route==='/coach')html=coachPage();
    else if(route==='/learn')html=homePage();
    else if(route.startsWith('/lesson/'))html=getSkill(route.split('/')[2])?skillPage(route.split('/')[2]):lessonPage(route.split('/')[2]);
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
    if(a==='tree-domain'){treeDomain=value;render(false);}
    else if(['open-skill','open-practice','open-criteria'].includes(a)){
      skillTab=a==='open-practice'?'practice':a==='open-criteria'?'criteria':'knowledge';quizAnswer=null;quizChecked=false;go('/skill/'+id);
    }
    else if(a==='skill-tab'){skillTab=b.dataset.tab;render(false);}
    else if(a==='focus-skill'){state.focusSkill=Number(id);save();render(false);toast('已设为正在攻克的节点。');}
    else if(a==='understand-skill'){
      state.skillProgress[id]={...skillProgress(id),understood:true,understoodAt:new Date().toISOString()};save();skillTab='practice';render();toast('已记录理解，接下来选择一种练习。');
    }
    else if(a==='skill-drill'){
      if(state.workout){prepare(id);return;}
      prepare(id,'节点练习');setup.drillIndex=Number(b.dataset.drill);state.pendingSetup={...setup};save();
    }
    else if(a==='coach-context'){coachSkill=Number(id);state.coachSkill=coachSkill;save();go('/coach');}
    else if(a==='coach-prompt')askCoach(value);
    else if(a==='revoke-evidence')modal('撤回这条验证？','<p>删除这次手动验证。练习历史仍然保留；若没有其他验证，节点将恢复为已理解或练习中。</p>',button('确认撤回','confirm-revoke','primary full',`data-id="${id}"`)+button('保留','close-modal','secondary full'));
    else if(a==='confirm-revoke'){state.skillEvidence=state.skillEvidence.filter(e=>e.id!==id);save();closeModal();render(false);toast('已撤回验证，节点状态已更新。');}
    else if(a==='go')go(b.dataset.route);
    else if(a==='lesson'){lessonTab='points';quizAnswer=null;quizChecked=false;lessonPlaying=false;state.lastLesson=Number(id);save();go('/lesson/'+id);}
    else if(a==='unit'){unitFilter=Number(id)===(unitFilter===null?recommendation().lesson.unit:unitFilter)?-1:Number(id);render(false);}
    else if(a==='lesson-tab'){lessonTab=b.dataset.tab;render(false);}
    else if(a==='answer'){lessonTab='quiz';quizAnswer=Number(id);quizChecked=false;render(false);}
    else if(a==='check-answer'){lessonTab='quiz';quizChecked=true;render(false);}
    else if(a==='play-lesson'){lessonPlaying=!lessonPlaying;render(false);}
    else if(a==='complete-lesson'){
      const l=getLesson(id);
      if(!state.learned.includes(l.id))state.learned.push(l.id);
      save();prepare(l.id);toast('学习进度已记录，接下来练一遍。');
    }
    else if(a==='daily-task'){if(b.dataset.mode==='practice')prepare(id);else {lessonPlaying=false;quizAnswer=null;quizChecked=false;state.lastLesson=Number(id);save();go('/lesson/'+id);}}
    else if(a==='specialties'){specialtyOpen=!specialtyOpen;render(false);}
    else if(a==='setup-toggle'){settingsOpen=!settingsOpen;render(false);}
    else if(a==='edit-review'){const record=state.records.find(r=>r.id===id);if(record){state.draft={...record};save();go('/review');}}
    else if(a==='prepare')prepare(id,b.dataset.type||'课程练习');
    else if(a==='setup-value'){setup[b.dataset.key]=['rounds','seconds'].includes(b.dataset.key)?Number(value):value;state.pendingSetup={...setup};save();render(false);}
    else if(a==='toggle-setting'){setup[b.dataset.key]=!setup[b.dataset.key];render(false);}
    else if(a==='start-session')startSession();
    else if(a==='pause-session'){tick();if(state.workout){state.workout.paused=!state.workout.paused;lastTick=performance.now();save();render(false);}}
    else if(a==='skip-phase'){tick();nextPhase(true);}
    else if(a==='exit-session'){
      tick();if(!state.workout)return;state.workout.paused=true;save();render(false);
      modal('结束这一段练习？','<p>结束后自动保存已运行的计时和回合，自评可以稍后补充。</p>',button('结束并保存记录','finish-session','primary full')+button('继续练习','resume-session','secondary full'));
    }
    else if(a==='resume-session'){closeModal();if(state.workout){state.workout.paused=false;lastTick=performance.now();save();render(false);}}
    else if(a==='finish-session')finishSession();
    else if(a==='continue-pending')go(state.workout?'/session':'/review');
    else if(a==='reflection'){review.reflection=value;if(state.draft)Object.assign(state.draft,review);persistDraft();save();render(false);}
    else if(a==='save-review')saveReview();
    else if(a==='show-history'){growthTab='history';historyFilter='all';go('/growth');}
    else if(a==='growth-tab'){growthTab=b.dataset.tab;render(false);}
    else if(a==='history-filter'){historyFilter=value;render(false);}
    else if(a==='record')go('/record/'+id);
    else if(a==='skill'){
      const l=getLesson(id),n=skillRecords(l.id).length;
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
    else if(a==='about')modal('让技能，一项一项生长',`<p>ROUND 是拳击学习与训练的手机端交互原型。你可以体验技能树、节点练习、手动验证和成长记录。AI 教练页目前为本地知识检索，未接入大模型。</p><ul class="list-info"><li>课程与示意动画：原型内容，待教练审校。</li><li>预置记录：清楚标为“示例记录”。</li><li>本次操作：保存为“体验记录”。</li><li>相机、语音、设备：模拟，不采集真实数据。</li><li>进度：仅保存在当前浏览器，可导出或重置。</li></ul>`,button('开始体验','close-modal','primary full'));
    else if(a==='delete-record')modal('删除这条本地记录？','<p>只删除这条原型记录，不影响课程学习进度。删除前也可以在“个人与设备”中导出记录。</p>',button('确认删除','confirm-delete','primary full',`data-id="${id}"`)+button('保留记录','close-modal','secondary full'));
    else if(a==='confirm-delete'){state.records=state.records.filter(r=>r.id!==id);if(state.draft?.id===id)state.draft=null;save();growthTab='history';go('/growth');toast('本地记录已删除。');}
    else if(a==='reset'||a==='blank')modal(a==='blank'?'从空白档案开始？':'载入示例档案？','<p>这会替换当前浏览器中的原型进度、未完成练习和记录。需要保留时，请先导出。</p>',button('导出当前记录','export','outline full')+button(a==='blank'?'确认启用空白档案':'确认重置','confirm-reset','primary full',`data-value="${a}"`)+button('取消','close-modal','secondary full'));
    else if(a==='confirm-reset'){state=defaultState(value==='blank');save();quizAnswer=null;quizChecked=false;unitFilter=null;growthTab='history';setup={lessonId:1,rounds:3,seconds:30,equipment:'徒手',recording:false,voice:false,type:'课程练习'};go('/home');toast(value==='blank'?'已切换为新手空白档案。':'已恢复示例档案。');}
    else if(a==='export'){
      const payload={app:'ROUND prototype',exportedAt:new Date().toISOString(),notice:'交互原型记录，非真实硬件测量或能力认证',...state};
      const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const anchor=document.createElement('a');anchor.href=url;anchor.download=`ROUND-体验记录-${today()}.json`;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('已导出 JSON 格式的本地体验记录。');
    }
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='review-note'){review.note=e.target.value;if(state.draft)state.draft.note=review.note;persistDraft();save();}
    if(e.target.id==='effort'){review.effort=Number(e.target.value);$('#effort-value').textContent=review.effort+'/5';if(state.draft)state.draft.effort=review.effort;persistDraft();save();}
  });
  function readEvidenceForm(form) {
    const data=new FormData(form);
    return {checks:data.getAll('criterion'),recordId:String(data.get('recordId')||'offline'),context:String(data.get('context')||''),source:String(data.get('source')||'self'),coach:String(data.get('coach')||''),note:String(data.get('note')||''),attested:data.get('attested')!==null};
  }
  function persistEvidenceForm(e) {
    const form=e.target.closest?.('#evidence-form');
    if(form){state.evidenceDrafts[form.dataset.skill]=readEvidenceForm(form);save();}
  }
  document.addEventListener('input',e=>{persistEvidenceForm(e);if(e.target.id==='coach-question'){state.coachDraft=e.target.value;save();}});
  document.addEventListener('change',e=>{persistEvidenceForm(e);if(e.target.id==='coach-skill'){coachSkill=Number(e.target.value);state.coachSkill=coachSkill;save();render(false);}});
  document.addEventListener('submit',e=>{
    if(e.target.id==='evidence-form'){
      e.preventDefault();const id=Number(e.target.dataset.skill),error=saveEvidence(id,readEvidenceForm(e.target));
      if(error){$('#evidence-error').textContent=error;return;}
      e.target.querySelector('button[type="submit"]').disabled=true;growthTab='evidence';go('/growth');toast('节点已点亮，验证条件与来源已保存。');return;
    }
    if(e.target.id==='coach-form'){e.preventDefault();askCoach(String(new FormData(e.target).get('question')||''));return;}

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
