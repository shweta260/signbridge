// ---------- Auth / view switching ----------
  let currentUser = null;
 
  function openAuth(tab){
    document.getElementById('authSection').scrollIntoView({behavior:'smooth'});
    switchTab(tab);
  }
  function switchTab(tab){
    const isLogin = tab === 'login';
    document.getElementById('tabLogin').classList.toggle('active', isLogin);
    document.getElementById('tabRegister').classList.toggle('active', !isLogin);
    document.getElementById('formLogin').classList.toggle('hidden', !isLogin);
    document.getElementById('formRegister').classList.toggle('hidden', isLogin);
    document.getElementById('formForgot').classList.add('hidden');
  }
 
  function showForgotForm(event){
    if(event) event.preventDefault();
    document.getElementById('formLogin').classList.add('hidden');
    document.getElementById('formRegister').classList.add('hidden');
    document.getElementById('formForgot').classList.remove('hidden');
    document.getElementById('tabLogin').classList.remove('active');
    document.getElementById('tabRegister').classList.remove('active');
  }
 
  function showLoginForm(event){
    if(event) event.preventDefault();
    switchTab('login');
  }
 
  async function handleForgotPassword(event){
    event.preventDefault();
    ['forgotEmailError','forgotPassError','forgotConfirmError'].forEach(id => {
      const el = document.getElementById(id);
      el.textContent = '';
      el.classList.remove('show');
    });
    document.getElementById('forgotError').style.display = 'none';
    document.getElementById('forgotSuccess').style.display = 'none';
 
    const email = document.getElementById('forgotEmail').value.trim();
    const newPassword = document.getElementById('forgotNewPass').value;
    const confirmPassword = document.getElementById('forgotConfirmPass').value;
 
    let hasError = false;
 
    if (!email.includes('@')) {
      showFieldError('forgotEmailError', 'Email must contain @.');
      hasError = true;
    }
 
    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!_\-.,]).{8,}$/.test(newPassword);
    if (!passwordValid) {
      showFieldError('forgotPassError', 'Invalid password.');
      hasError = true;
    }
 
    if (newPassword !== confirmPassword) {
      showFieldError('forgotConfirmError', 'Passwords do not match.');
      hasError = true;
    }
 
    if (hasError) return;
 
    const errorBox = document.getElementById('forgotError');
    const successBox = document.getElementById('forgotSuccess');
    try{
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, newPassword})
      });
      const data = await res.json();
 
      if(!data.success){
        errorBox.textContent = data.error || 'Could not reset password.';
        errorBox.style.display = 'block';
        return;
      }
 
      successBox.textContent = 'Password updated — you can log in now.';
      successBox.style.display = 'block';
      document.getElementById('forgotNewPass').value = '';
      document.getElementById('forgotConfirmPass').value = '';
    }catch(err){
      errorBox.textContent = 'Could not reach the server. Please try again.';
      errorBox.style.display = 'block';
    }
  }
 
  async function handleLogin(event){
    event.preventDefault();
    const errorBox = document.getElementById('loginError');
    errorBox.style.display = 'none';
 
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPass').value;
 
    try{
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
      });
      const data = await res.json();
 
      if(!data.success){
        errorBox.textContent = data.error || 'Login failed. Please try again.';
        errorBox.style.display = 'block';
        return;
      }
 
      currentUser = {id: data.userId, fullName: data.fullName, role: data.role};
      showDash();
    }catch(err){
      errorBox.textContent = 'Could not reach the server. Please try again.';
      errorBox.style.display = 'block';
    }
  }
 
  function showFieldError(id, message){
    const el = document.getElementById(id);
    el.textContent = message;
    el.classList.add('show');
  }
  function clearFieldErrors(){
    ['nameError','emailError','passwordError'].forEach(id => {
      const el = document.getElementById(id);
      el.textContent = '';
      el.classList.remove('show');
    });
    document.getElementById('registerError').style.display = 'none';
  }
 
  async function handleRegister(event){
    event.preventDefault();
    clearFieldErrors();
 
    const fullName = document.getElementById('regName').value.trim();
    const role = document.getElementById('regRole').value;
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPass').value;
 
    let hasError = false;
 
    if (fullName.split(/\s+/).filter(Boolean).length < 2) {
      showFieldError('nameError', 'Name must contain at least two words.');
      hasError = true;
    }
 
    if (!email.includes('@')) {
      showFieldError('emailError', 'Email must contain @.');
      hasError = true;
    }
 
    const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&+=!_\-.,]).{8,}$/.test(password);
    if (!passwordValid) {
      showFieldError('passwordError', 'Invalid password.');
      hasError = true;
    }
 
    if (hasError) return;
 
    const errorBox = document.getElementById('registerError');
    try{
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({fullName, role, email, passwordHash: password})
      });
      const data = await res.json();
 
      if(!data.success){
        errorBox.textContent = data.error || 'Registration failed. Please check your details.';
        errorBox.style.display = 'block';
        return;
      }
 
      currentUser = {id: data.userId, fullName: data.fullName, role};
      showDash();
    }catch(err){
      errorBox.textContent = 'Could not reach the server. Please try again.';
      errorBox.style.display = 'block';
    }
  }
 
  function showDash(){
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    document.getElementById('topActionsLanding').classList.add('hidden');
    document.getElementById('topActionsDash').classList.remove('hidden');
    const displayName = currentUser ? currentUser.fullName : 'demo_user';
    document.getElementById('topUserName').textContent = displayName;
    document.getElementById('sideUserName').textContent = displayName;
    showView('camera');
    window.scrollTo(0,0);
  }
  function logOut(){
    currentUser = null;
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('landing').classList.remove('hidden');
    document.getElementById('topActionsLanding').classList.remove('hidden');
    document.getElementById('topActionsDash').classList.add('hidden');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPass').value = '';
    document.getElementById('regName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPass').value = '';
    stopCamera();
    window.scrollTo(0,0);
  }
  function showView(name){
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById('view-' + name);
    if(target) target.classList.remove('hidden');
    document.querySelectorAll('.side-link').forEach(l => l.classList.toggle('active', l.dataset.view === name));
    if(name === 'history') loadHistory();
  }
 
  async function saveHistory(sourceType, originalInput, translatedOutput){
    try{
      await fetch('/api/history', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          userId: currentUser ? currentUser.id : null,
          sourceType, originalInput, translatedOutput
        })
      });
    }catch(e){
      console.error('Could not save history entry', e);
    }
  }
 
  async function loadHistory(){
    const body = document.getElementById('historyBody');
    body.innerHTML = '<tr><td colspan="4" style="color:var(--ink-soft);">Loading…</td></tr>';
    const typeMap = {
      camera: {cls:'cam', label:'Camera'},
      chat: {cls:'chat', label:'Chat'},
      phrase_library: {cls:'lib', label:'Library'},
      emergency: {cls:'emg', label:'Emergency'},
      practice: {cls:'prac', label:'Practice'}
    };
    try{
      const query = currentUser ? `?userId=${currentUser.id}` : '';
      const res = await fetch('/api/history' + query);
      const data = await res.json();
 
      if(!data.length){
        body.innerHTML = '<tr><td colspan="4" style="color:var(--ink-soft);">No translations yet — try Camera Translate, Text Chat, or the Phrase Library.</td></tr>';
        return;
      }
 
      body.innerHTML = '';
      data.slice().reverse().forEach(entry => {
        const date = new Date(entry.createdAt).toLocaleString([], {month:'short', day:'2-digit', hour:'2-digit', minute:'2-digit'});
        const meta = typeMap[entry.sourceType] || {cls:'cam', label: entry.sourceType};
        const original = entry.originalInput || '—';
        const row = document.createElement('tr');
        row.innerHTML = `
          <td class="mono">${date}</td>
          <td><span class="type-pill ${meta.cls}">${meta.label}</span></td>
          <td>${original}</td>
          <td>${entry.translatedOutput}</td>`;
        body.appendChild(row);
      });
    }catch(e){
      body.innerHTML = '<tr><td colspan="4" style="color:var(--coral);">Could not load history.</td></tr>';
    }
  }
 
  // ---------- Camera translate (multi-photo sentence builder) ----------
  let camStream = null;
  let sentenceWords = [];
 
  async function toggleCamera(){
    const btn = document.getElementById('camToggleBtn');
    if(camStream){ stopCamera(); return; }
    try{
      camStream = await navigator.mediaDevices.getUserMedia({video:true});
      document.getElementById('cameraPlaceholder').classList.add('hidden');
      const video = document.getElementById('cameraVideo');
      video.classList.remove('hidden');
      video.srcObject = camStream;
      btn.textContent = 'Stop camera';
      document.getElementById('captureBtn').classList.remove('hidden');
      if(sentenceWords.length){
        document.getElementById('clearSentenceBtn').classList.remove('hidden');
      }
      renderSentence();
    }catch(e){
      document.getElementById('outputText').textContent = 'Camera permission was not granted.';
    }
  }
  function stopCamera(){
    if(camStream){ camStream.getTracks().forEach(t=>t.stop()); camStream = null; }
    document.getElementById('cameraVideo').classList.add('hidden');
    document.getElementById('cameraPlaceholder').classList.remove('hidden');
    document.getElementById('camToggleBtn').textContent = 'Start camera';
    document.getElementById('captureBtn').classList.add('hidden');
  }
  function startCaptureCountdown(){
    const overlay = document.getElementById('countdownOverlay');
    const numberEl = document.getElementById('countdownNumber');
    let secondsLeft = 5;
 
    document.getElementById('captureBtn').disabled = true;
    overlay.classList.remove('hidden');
    numberEl.textContent = secondsLeft;
 
    const timer = setInterval(() => {
      secondsLeft -= 1;
      if(secondsLeft > 0){
        numberEl.textContent = secondsLeft;
      }else{
        clearInterval(timer);
        overlay.classList.add('hidden');
        document.getElementById('captureBtn').disabled = false;
        capturePhoto();
      }
    }, 1000);
  }
 
  function capturePhoto(){
    const video = document.getElementById('cameraVideo');
    const canvas = document.getElementById('captureCanvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    const thumbnailSrc = canvas.toDataURL('image/png');
 
    renderSentence('Analyzing gesture…');
 
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'capture.png');
 
      try {
        const res = await fetch('/api/translate', { method: 'POST', body: formData });
        const data = await res.json();
 
        if (data.phrase) {
          sentenceWords.push({text: data.phrase, image: thumbnailSrc, recognized: true});
          saveHistory('camera', '[signed]', data.phrase);
        } else {
          sentenceWords.push({text: data.message || 'Not recognized', image: thumbnailSrc, recognized: false});
        }
      } catch (err) {
        sentenceWords.push({text: 'Connection error', image: thumbnailSrc, recognized: false});
      }
      document.getElementById('clearSentenceBtn').classList.remove('hidden');
      renderSentence();
    }, 'image/png');
  }
 
  function renderSentence(loadingMessage){
    const el = document.getElementById('outputText');
    const strip = document.getElementById('photoStrip');
 
    strip.innerHTML = '';
    sentenceWords.forEach(word => {
      const chip = document.createElement('div');
      chip.className = 'photo-chip' + (word.recognized ? '' : ' unrecognized');
      chip.innerHTML = `<img src="${word.image}" alt="${word.text}"><span>${word.text}</span>`;
      strip.appendChild(chip);
    });
 
    if(loadingMessage){
      el.innerHTML = loadingMessage + '<span class="cursor"></span>';
      return;
    }
 
    if(!sentenceWords.length){
      el.innerHTML = 'Capture a photo to see its meaning<span class="cursor"></span>';
      return;
    }
 
    const sentence = sentenceWords.filter(w => w.recognized).map(w => w.text).join(' ');
    el.innerHTML = (sentence || 'No gestures recognized yet') + '<span class="cursor"></span>';
  }
 
  function clearSentence(){
    sentenceWords = [];
    document.getElementById('clearSentenceBtn').classList.add('hidden');
    renderSentence();
  }
 
  // ---------- Chat ----------
  function sendChat(){
    const input = document.getElementById('chatInput');
    if(!input.value.trim()) return;
    const messageText = input.value;
    const log = document.getElementById('chatLog');
    const time = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    const bubble = document.createElement('div');
    bubble.className = 'bubble me';
    bubble.innerHTML = messageText + '<span class="t">'+time+'</span>';
    log.appendChild(bubble);
    input.value = '';
    log.scrollTop = log.scrollHeight;
    saveHistory('chat', messageText, '[shown as sign]');
  }
 
  // ---------- Phrase library ----------
  let phrases = [];
  async function loadPhrases(){
    try{
      const res = await fetch('/api/phrases');
      const data = await res.json();
      phrases = data.map(p => ({cat: p.category, text: p.phraseText, image: p.gestureImagePath}));
      renderLibrary('all');
    }catch(e){
      console.error('Could not load phrases', e);
    }
  }
  function renderLibrary(filter){
    const grid = document.getElementById('libraryGrid');
    grid.innerHTML = '';
    phrases.filter(p => filter==='all' || p.cat===filter).forEach(p=>{
      const card = document.createElement('div');
      card.className = 'phrase-card';
      card.innerHTML = `
        <div class="badge lg outline">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M14 26V13a2.4 2.4 0 0 1 4.8 0v9"/><path d="M18.8 22V9.5a2.4 2.4 0 0 1 4.8 0V22"/><path d="M23.6 22V11a2.4 2.4 0 0 1 4.8 0v11"/><path d="M28.4 22.5v-6a2.4 2.4 0 0 1 4.8 0v11c0 6-4.6 11-11 11-3.6 0-5.8-1.4-7.6-3.6L9 27.4a2.3 2.3 0 0 1 3.4-3.1l1.6 1.6"/></svg>
        </div>
        <div class="tag">${p.cat}</div>
        <p>${p.text}</p>
        <div class="hint">Tap to preview gesture</div>`;
      card.onclick = () => { openGestureModal(p.text, p.image); saveHistory('phrase_library', null, p.text); };
      grid.appendChild(card);
    });
  }
  function filterLibrary(cat){
    document.querySelectorAll('#filterRow .chip').forEach(c=>c.classList.toggle('active', c.dataset.cat===cat));
    renderLibrary(cat);
  }
  loadPhrases();
 
  // ---------- Emergency ----------
  let emergencies = [];
  async function loadEmergencies(){
    try{
      const res = await fetch('/api/emergency');
      const data = await res.json();
      emergencies = data.map(e => ({label: e.label, text: e.phraseText, image: e.gestureImagePath, icon: 'M12 3 2 20h20L12 3z'}));
      renderEmergency();
    }catch(e){
      console.error('Could not load emergency phrases', e);
    }
  }
  function renderEmergency(){
    const grid = document.getElementById('emergencyGrid');
    grid.innerHTML = '';
    emergencies.forEach(e=>{
      const btn = document.createElement('button');
      btn.className = 'em-block';
      btn.innerHTML = `
        <span class="badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${e.icon}"/><line x1="12" y1="9" x2="12" y2="14"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg></span>
        <span>${e.label}</span>`;
      btn.onclick = () => { showEmConfirm(e.label); openGestureModal(e.text || e.label, e.image); saveHistory('emergency', null, e.text || e.label); };
      grid.appendChild(btn);
    });
  }
  function showEmConfirm(label){
    const box = document.getElementById('emConfirm');
    box.textContent = `"${label}" phrase is now shown full-screen for anyone nearby to read.`;
    box.classList.add('show');
  }
  loadEmergencies();
 
  // ---------- Gesture preview modal ----------
  function openGestureModal(caption, imagePath){
    const modal = document.getElementById('gestureModal');
    const img = document.getElementById('gestureModalImg');
    const cap = document.getElementById('gestureModalCaption');
    const empty = document.getElementById('gestureModalEmpty');
    cap.textContent = caption;
    if(imagePath){
      img.src = imagePath;
      img.classList.remove('hidden');
      empty.classList.add('hidden');
    }else{
      img.classList.add('hidden');
      empty.classList.remove('hidden');
    }
    modal.classList.remove('hidden');
  }
  function closeGestureModal(){
    document.getElementById('gestureModal').classList.add('hidden');
  }
 
  // ---------- Practice ----------
  function tryOnCamera(){
    showView('camera');
  }
  function markPractice(correct){
    const fb = document.getElementById('practiceFeedback');
    fb.className = 'feedback ' + (correct ? 'correct' : 'retry');
    fb.textContent = correct ? 'Nice work — that\'s the right gesture.' : 'Not quite — watch the gesture preview again and retry.';
    if(correct){
      const streak = document.getElementById('streakCount');
      streak.textContent = parseInt(streak.textContent) + 1;
    }
    const phraseText = document.getElementById('practicePhrase').textContent;
    saveHistory('practice', phraseText, correct ? 'Correct' : 'Retry');
  }
 
  // ---------- Accessibility ----------
  function toggleContrast(){
    const sw = document.getElementById('contrastSwitch');
    const on = document.body.classList.toggle('high-contrast');
    sw.classList.toggle('on', on);
    sw.setAttribute('aria-pressed', on);
  }
  function setFontScale(level){
    const zoomLevels = ['100%', '115%', '130%', '150%'];
    document.body.style.zoom = zoomLevels[level];
  }
 