// === ГЛОБАЛЬНЫЙ ПЕРЕХВАТЧИК ОШИБОК (ЧТОБЫ НЕ ВИСЕЛО В СЛЕПУЮ) ===
window.onerror = function(msg, url, line) {
    alert("КРИТИЧЕСКАЯ ОШИБКА: " + msg + "\nСтрока: " + line + "\nСделайте скриншот!");
    return false;
};

// === НАСТРОЙКИ SUPABASE ===
var SUPABASE_URL = 'https://apnmlbvefruhagufmpfc.supabase.co';
var SUPABASE_KEY = 'sb_publishable_QE6JAl1XxmOR_0cjGXEJ3g_GvOII0fY';
var supabase = null;
try {
    if (window.supabase) supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch(e) { alert("Ошибка инициализации БД: " + e.message); }

var ADMIN_ID = '8543137368';

// === СЛОВАРЬ ПЕРЕВОДОВ ===
var tr = {
  'Pyc': {
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    labels: { qty:'Количество штук', tpi:'Время на 1 штуку', prep:'Подготовка', prepSub:'15 минут к норме', start:'Начало', end:'Окончание', active:'АКТИВНО', inactive:'НЕ АКТИВНО' },
    btns: { calc:'Рассчитать', info:'Инструкция', cancel:'Отмена', done:'Готово', pick:'Время', saveRes:'Сохранить результат', search:'Поиск', skip:'Пропустить' },
    stats: { success:'Успеваемость', zone:'Вы сейчас находитесь в зоне:', plan:'План окончания:', norm:'Норма на всё:', spent1:'Затрачено на 1 шт:', spentNorm:'Время затрачено:', fact:'Факт. окончание:', qtyPerHour:'Кол. в час:', forThisTime:'За это время:' },
    legend: ['Риск', 'Не плохо', 'Норма'], zones: { risk: 'Красная зона риска', orange: 'Оранжевая зона', green: 'Зелёная зона', over: 'Красная зона' },
    msgs: { fail: 'ВЫ НЕ СПРАВЛЯЕТЕСЬ!', push: 'ПОДНАЖМИТЕ!', good: 'Хороший темп ТАК ДЕРЖАТЬ!', over: 'ВЫ ПРЕВЫШАЕТЕ НОРМУ!' },
    instrNorm: [
      {t: 'Главная страница', c: 'Отображается статус RCP, календарь и статистика.'},
      {t: 'История', c: 'Список всех ваших сохраненных расчетов. Можно искать по PRO, удалять записи.'},
      {t: 'Калькулятор', c: 'Введите количество штук, время на 1 штуку, начало и окончание. Нажмите "Рассчитать".'},
      {t: 'Рабочее время', c: 'Ваш табель рабочего времени.'}
    ],
    saveModal: { title: 'Сохранение результата', pro: 'PRO', stan: 'Номер Stanowiska', type: 'Вид работы', btnSave: 'Сохранить', btnCancel: 'Отмена', date: 'Дата' },
    workTime: { thisMonth: 'Ваши рабочие часы:', thisMonthDash: 'За этот месяц:', lastMonth: 'В прошлом месяце:', h: 'ч.', search: 'Поиск по PRO', uwagi: 'Uwagi (заметки)' },
    rcp: { title: 'Регистрация RCP', desc: 'Укажите время начала работы', startBtn: 'Подтвердить', closeTitle: 'Закрыть рабочее время', startedAt: 'Начато в:', closeBtn: 'Завершить', closedToday: 'За сегодня.' },
    dash: { empty: 'Истории пока нет.', title: 'УСПЕВАЕМОСТЬ', zonePrefix: 'Зона:', cal: 'Календарь', noData: 'Нет данных', dyn: 'Динамика успеваемости', hist: 'История нормы', days: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'], date: 'число', lblDate: 'Дата:', lblStart: 'Начало', lblEnd: 'Окончание', lblAvg: 'Среднее %', types: { t1: 'Сварка ручная', t2: 'Сварка на обротнице', t3: 'Поправка' }, saved: 'Сохранено!', confirmDel: 'Удалить эту запись?', matches: 'Найдено совпадений', pcs: 'шт.', settings: 'Настройки', yes: 'Да', no: 'Нет', stanLabel: 'Место', fillFields: 'Заполните все поля!' },
    rcpTabTitle: 'Рабочее время (RCP)', editRcp: 'Редактирование RCP', reStart: 'Начало', reEnd: 'Окончание', del: 'Удалить',
    proLabel: 'цифры и -', rcpWorkerNum: 'Рабочий номер', helpBtn: 'Помощь', helpTitle: 'Помощь', helpPlaceholder: 'Опишите проблему...', helpSend: 'Отправить', helpSent: 'Сообщение отправлено!',
    auth: { title: 'Авторизация', desc: 'Введите рабочий номер', btn: 'Войти', confirmWorker: 'Подтвердите ввод: ' },
    admin: { title: 'Админ Панель', back: 'Выйти', users: 'Пользователи', resetData: 'Сбросить данные', resetConfirm: 'Удалить ВСЕ локальные данные?', resetSuccess: 'Данные сброшены!', deleteAll: 'Удалить всех', deleteUser: 'Удалить', deleteConfirm: 'Удалить пользователя?' },
    profSet: { title: 'Настройки профиля', worker: 'Рабочий номер', fname: 'Имя', lname: 'Фамилия' }
  }
};

// Безопасное получение данных из Telegram
var tgApp = window.Telegram ? window.Telegram.WebApp : null;
var tgUser = (tgApp && tgApp.initDataUnsafe && tgApp.initDataUnsafe.user) ? tgApp.initDataUnsafe.user : null;

var isAdmin = false;
if (tgUser && tgUser.id.toString() === ADMIN_ID) { isAdmin = true; }

var viewingWorkerId = null;
var currentWorkerId = null;
try { currentWorkerId = localStorage.getItem('kkn_worker_id'); } catch(e) {}

var adminUsersList = [];
var dbFirstName = "";
var dbLastName = "";
var currentLang = 'Pyc';
var savedHistory = [];
var rcpHistory = [];
var rcpState = null;
var pendingSaveData = null;
var editIndex = -1;
var currentRcpDate = new Date();
var currentMainCalDate = new Date();
var editingRcpDateStr = null;

// Вспомогательные функции
function getTodayStr() { return new Date().toLocaleDateString('ru-RU'); }
function getNowTime() { var now = new Date(); var h = now.getHours(); var m = now.getMinutes(); return (h<10?'0':'')+h + ':' + (m<10?'0':'')+m; }
function el(id) { return document.getElementById(id); }
function setText(id, txt) { var e = el(id); if (e) e.textContent = txt; }
function setDisplay(id, d) { var e = el(id); if (e) e.style.display = d; }
function getVal(id) { var e = el(id); return e ? e.value : ''; }

function updateHeader() {
  var nameToDisplay = currentWorkerId ? "№ " + currentWorkerId : "Пользователь";
  var fullName = (dbFirstName + " " + dbLastName).trim();
  if (fullName) nameToDisplay = fullName;
  if (isAdmin && viewingWorkerId) nameToDisplay = "Worker № " + viewingWorkerId;
  setText('profileName', nameToDisplay);
}

// === БЕЗОПАСНЫЙ API CALL (С ЗАЩИТОЙ ОТ ПАДЕНИЙ БД) ===
async function apiCall(action, payload) {
  if (!payload) payload = {};
  var uid = tgUser ? tgUser.id.toString() : 'local';
  var wid = viewingWorkerId || currentWorkerId || 'unknown';

  if (!supabase) {
      return { status: 'error', message: 'Библиотека БД не загружена. Проверьте интернет.' };
  }

  try {
    if (action === 'getUserData') {
      var res = await supabase.from('workers').select('*').eq('tg_id', uid).single();
      if (res.data) {
        var totalUsers = 0;
        if (uid === ADMIN_ID) {
          var countRes = await supabase.from('workers').select('*', { count: 'exact', head: true });
          totalUsers = countRes.count || 0;
        }
        return { status: 'success', worker_id: res.data.worker_id, first_name: res.data.first_name, last_name: res.data.last_name, total_users: totalUsers };
      }
      return { status: 'error', message: 'Not found' };
    }

    if (action === 'registerUser') {
      var upsertRes = await supabase.from('workers').upsert({
        tg_id: uid, worker_id: payload.worker_id,
        first_name: tgUser ? tgUser.first_name : '', last_name: tgUser ? tgUser.last_name : ''
      }, { onConflict: 'tg_id' });
      if (upsertRes.error) throw upsertRes.error;
      return { status: 'success', total_users: 0 };
    }

    if (action === 'getData') {
      var targetWid = payload.worker_id || wid;
      var userData = await supabase.from('workers').select('*').eq('worker_id', targetWid).single();
      var histData = await supabase.from('pro_history').select('*').eq('worker_id', targetWid).order('created_at', { ascending: false });
      var rcpData = await supabase.from('time_history').select('*').eq('worker_id', targetWid).order('created_at', { ascending: true });
      
      if (histData.error) throw histData.error;
      
      var formattedHistory = [];
      if (histData.data) {
          for(var i=0; i<histData.data.length; i++) {
              var r = histData.data[i];
              formattedHistory.push({
                  dateStr: r.date_str, pro: r.pro_n, stan: r.stan, wTypeKey: r.work_type, uwagi: r.uwagi,
                  qty: r.qty, start: r.start_time, end: r.end_time, prep: r.is_prep, result: r.result_percent,
                  type: r.calc_type || (r.qty ? 'norm' : 'percent'), timestamp: new Date(r.created_at).getTime()
              });
          }
      }

      var rcpHistoryList = [];
      var currentRcpState = null;
      if (rcpData.data) {
          for(var j=0; j<rcpData.data.length; j++) {
              var rr = rcpData.data[j];
              if (rr.end_time) rcpHistoryList.push({ dateStr: rr.date_str, start: rr.start_time, end: rr.end_time, durationSec: rr.duration_sec, timestamp: new Date(rr.created_at).getTime() });
              else currentRcpState = { dateStr: rr.date_str, start: rr.start_time, end: null, timestamp: new Date(rr.created_at).getTime(), workerNum: targetWid };
          }
      }
      return { status: 'success', first_name: userData.data ? userData.data.first_name : '', last_name: userData.data ? userData.data.last_name : '', history: formattedHistory, rcpHistory: rcpHistoryList, rcpState: currentRcpState };
    }

    if (action === 'saveHistory') {
      var records = payload.history || [];
      await supabase.from('pro_history').delete().eq('worker_id', wid);
      if (records.length > 0) {
        var insertData = [];
        for(var k=0; k<records.length; k++) {
            var rec = records[k];
            insertData.push({ worker_id: wid, date_str: rec.dateStr, pro_n: rec.pro, pos_num: rec.posNumber || null, qty: rec.qty, start_time: rec.start, end_time: rec.end, stan: rec.stan, uwagi: rec.uwagi, result_percent: rec.result, work_type: rec.wTypeKey, is_prep: rec.prep || false, calc_type: rec.type, created_at: new Date(rec.timestamp || Date.now()).toISOString() });
        }
        var insertRes = await supabase.from('pro_history').insert(insertData);
        if (insertRes.error) throw insertRes.error;
      }
      return { status: 'success' };
    }

    if (action === 'saveRCP') {
      await supabase.from('time_history').delete().eq('worker_id', wid);
      var iData = [];
      if (payload.history && payload.history.length > 0) {
          for(var l=0; l<payload.history.length; l++) {
              var p = payload.history[l];
              iData.push({ worker_id: wid, date_str: p.dateStr, start_time: p.start, end_time: p.end, duration_sec: p.durationSec, created_at: new Date(p.timestamp || Date.now()).toISOString() });
          }
      }
      if (payload.state) iData.push({ worker_id: wid, date_str: payload.state.dateStr, start_time: payload.state.start, end_time: null, duration_sec: null, created_at: new Date(payload.state.timestamp || Date.now()).toISOString() });
      if (iData.length > 0) {
          var tRes = await supabase.from('time_history').insert(iData);
          if (tRes.error) throw tRes.error;
      }
      return { status: 'success' };
    }

    return { status: 'success' };
  } catch(e) {
    console.error(e);
    return { status: 'error', message: e.message || "Ошибка сервера" };
  }
}

function sortSavedHistory() {
  savedHistory.sort(function(a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
}

function switchMainTab(tabId, elem) {
  var contents = document.querySelectorAll('.main-tab-content');
  for(var i=0; i<contents.length; i++) contents[i].classList.remove('active');
  var items = document.querySelectorAll('.nav-item');
  for(var j=0; j<items.length; j++) items[j].classList.remove('active');
  
  var target = el(tabId);
  if (target) target.classList.add('active');
  if (elem) elem.classList.add('active');
}

// === ТОЧКА ВХОДА ===
async function checkAuth() {
  if (isAdmin && !viewingWorkerId) { loadAdminUsers(); return; }
  setText('globalUserCount', "Подключение...");

  var res = await apiCall('getUserData');
  if (res && res.status === 'success') {
    if (res.worker_id) {
      currentWorkerId = res.worker_id;
      try { localStorage.setItem('kkn_worker_id', currentWorkerId); } catch(e){}
    }
    dbFirstName = res.first_name || "";
    dbLastName = res.last_name || "";
    if (res.total_users !== undefined) setText('globalUserCount', "users: " + res.total_users);
  } else {
    setText('globalUserCount', "БД недоступна");
  }

  if (!currentWorkerId) {
      setDisplay('authOverlay', 'flex');
      setLang('Pyc');
  } else {
      updateHeader();
      initAppData();
  }
}

async function saveWorkerId() {
  var val = getVal('authWorkerInput');
  var t = tr['Pyc'];
  if (!val) { alert(t.dash.fillFields || "Введите номер!"); return; }
  
  var btn = el('a_btn');
  if(btn) { btn.textContent = "..."; btn.disabled = true; }
  
  var res = await apiCall('registerUser', { worker_id: val });
  if (res && res.status === 'error') {
      alert("Ошибка сети. Попробуйте еще раз.");
      if(btn) { btn.textContent = "Войти"; btn.disabled = false; }
      return;
  }

  currentWorkerId = val;
  try { localStorage.setItem('kkn_worker_id', val); } catch(e){}
  setDisplay('authOverlay', 'none');
  updateHeader();
  initAppData();
}

async function initAppData() {
  if (!currentWorkerId && !viewingWorkerId) { afterDataLoad(); return; }
  var elCount = el('globalUserCount');
  var prevCount = elCount ? elCount.textContent : "users: 0";
  setText('globalUserCount', "Загрузка данных...");

  var res = await apiCall('getData');
  if (res && res.status === 'success') {
    savedHistory = res.history || [];
    rcpHistory = res.rcpHistory || [];
    rcpState = res.rcpState || null;
    dbFirstName = res.first_name || "";
    dbLastName = res.last_name || "";
    setText('globalUserCount', prevCount); // Возвращаем количество
    sortSavedHistory();
  } else {
    savedHistory = []; rcpHistory = []; rcpState = null;
    setText('globalUserCount', "Ошибка БД");
    alert("Данные не загружены. Проверьте интернет или Supabase.");
  }
  afterDataLoad();
}

function afterDataLoad() {
  updateHeader();
  checkRCP();
  openProfile();
  filterHistory();
  renderRcpTab();
}

function checkRCP() {
  if(isAdmin && !viewingWorkerId) return;
  var today = getTodayStr();
  if (rcpState && rcpState.dateStr !== today && !rcpState.end) {
    rcpState.end = "Auto (8h)";
    rcpHistory.push({ dateStr: rcpState.dateStr, start: rcpState.start, end: rcpState.end, durationSec: 28800, timestamp: rcpState.timestamp });
  }
  if (!rcpState || rcpState.dateStr !== today) {
    setText('rcpTodayDate', today);
    setText('rcpStartTime', getNowTime());
    setDisplay('rcpOverlay', 'flex');
  } else {
    setDisplay('rcpOverlay', 'none');
  }
}

function saveRCPData() { apiCall('saveRCP', { state: rcpState, history: rcpHistory }); }
function confirmRCPStart() {
  var sTime = el('rcpStartTime') ? el('rcpStartTime').textContent : getNowTime();
  rcpState = { dateStr: getTodayStr(), start: sTime, end: null, timestamp: Date.now(), workerNum: currentWorkerId };
  saveRCPData();
  setDisplay('rcpOverlay', 'none');
  openProfile();
}
function confirmRCPEnd() {
  var eTime = getNowTime();
  var s = parseToSec(rcpState.start); var e = parseToSec(eTime);
  var durationSec = e >= s ? e - s : (86400 - s) + e;
  rcpState.end = eTime;
  rcpHistory.push({ dateStr: rcpState.dateStr, start: rcpState.start, end: rcpState.end, durationSec: durationSec, timestamp: rcpState.timestamp });
  saveRCPData(); openProfile();
}

function getWorkHoursStats() {
  var tThis = 0, tLast = 0;
  var cm = new Date().getMonth(); var lm = cm === 0 ? 11 : cm - 1;
  for(var i=0; i<rcpHistory.length; i++) {
      var r = rcpHistory[i];
      var d = new Date(r.timestamp).getMonth();
      if (d === cm) tThis += r.durationSec || 0;
      else if (d === lm) tLast += r.durationSec || 0;
  }
  return { thisMonth: Math.round(tThis / 3600), lastMonth: Math.round(tLast / 3600) };
}

function openProfile() {
  var t = tr['Pyc'];
  var container = el('profileHistoryContent');
  if (!container) return;
  if (isAdmin && !viewingWorkerId) return;

  var displayM = currentMainCalDate.getMonth();
  var monthRecords = [];
  var sumEff = 0;

  for(var i=0; i<savedHistory.length; i++) {
      var rec = savedHistory[i];
      var p = (rec.dateStr || "").split('.');
      if (p.length === 3 && parseInt(p[1],10)-1 === displayM) {
          monthRecords.push(rec);
          sumEff += rec.result;
      }
  }

  var monthAvg = monthRecords.length > 0 ? Math.round(sumEff / monthRecords.length) : 0;
  var mClr = monthAvg < 65 ? "#f06767" : monthAvg < 75 ? "#ff9800" : "#3cd4a0";
  var stats = getWorkHoursStats();

  var html = "<div style='width:100%; box-sizing:border-box;'>";
  
  if (rcpState && !rcpState.end) {
      html += "<div class='dash-section-title' style='text-align:center;'>Смена открыта: " + rcpState.start + "</div>" +
              "<button class='btn btn-calc' style='width:100%; background:#ff9800; border:none; margin-bottom:15px;' onclick='confirmRCPEnd()'>Завершить смену</button>";
  } else if (rcpState && rcpState.end) {
      html += "<div style='text-align:center; color:#3cd4a0; margin-bottom:15px; font-weight:bold;'>Смена завершена: " + rcpState.start + " - " + rcpState.end + "</div>";
  }

  html += "<div style='display:flex; justify-content:space-between; background:#232a3b; padding:15px; border-radius:12px; margin-bottom:20px;'>" +
          "<div><span style='color:#8b949e; font-size:13px;'>Часов за месяц:</span><br><b style='color:#3cd4a0; font-size:18px;'>" + stats.thisMonth + " ч.</b></div>" +
          "</div>";

  html += "<div style='background:#232a3b; border-radius:12px; padding:20px; text-align:center;'>" +
          "<div style='font-size:46px; font-weight:bold; color:" + mClr + ";'>" + monthAvg + "%</div>" +
          "<div style='color:#8b949e;'>Средняя успеваемость</div>" +
          "</div>";

  html += "</div>";
  container.innerHTML = html;
}

function setLang(lang) {
  var t = tr['Pyc'];
  setText('l_qty', t.labels.qty); setText('l_tpi', t.labels.tpi); setText('l_prep', t.labels.prep);
  setText('l_start', t.labels.start); setText('l_end', t.labels.end); setText('b_calc', t.btns.calc);
  setText('rcp_title', t.rcp.title); setText('rcp_btn_start', t.rcp.startBtn);
  if (currentWorkerId) { updateHeader(); openProfile(); filterHistory(); }
}

var isPrepActive = false, activeField = null, shortFormat = false;
function initWheel(id, max) {
  var w = el(id); if(!w) return;
  w.innerHTML = '<div class="spacer"></div>';
  for (var i=0; i<=max; i++) { var d = document.createElement('div'); d.textContent = (i < 10 ? "0" : "") + i; w.appendChild(d); }
  w.innerHTML += '<div class="spacer"></div>';
  w.onscroll = function() {
    var idx = Math.round(w.scrollTop/40);
    var items = w.querySelectorAll('div:not(.spacer)');
    for(var j=0; j<items.length; j++) { if(j===idx) items[j].classList.add('selected'); else items[j].classList.remove('selected'); }
  };
}

function openPicker(id, isShort) {
  activeField = id; shortFormat = isShort;
  setDisplay('sWheel', shortFormat ? 'none' : 'block');
  setDisplay('pickerOverlay', 'flex');
}
function closePicker() { setDisplay('pickerOverlay', 'none'); }
function confirmPicker() {
  var hEl = document.querySelector('#hWheel .selected'), mEl = document.querySelector('#mWheel .selected'), sEl = document.querySelector('#sWheel .selected');
  var h = hEl ? hEl.textContent : "00", m = mEl ? mEl.textContent : "00", s = sEl ? sEl.textContent : "00";
  setText(activeField, shortFormat ? h + ":" + m : h + ":" + m + ":" + s);
  closePicker();
}

function togglePrep() { isPrepActive = !isPrepActive; updatePrepStatus(); }
function updatePrepStatus() {
  setDisplay('radioDot', isPrepActive ? 'block' : 'none');
  var pt = el('prepToggle'); if (pt) { if(isPrepActive) pt.classList.add('active'); else pt.classList.remove('active'); }
}

function parseToSec(str) { var p = str.split(':').map(Number); return p.length === 3 ? p[0]*3600 + p[1]*60 + p[2] : p[0]*3600 + p[1]*60; }
function formatTime(s) { var h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = Math.round(s%60); return (h<10?"0":"")+h+":"+(m<10?"0":"")+m+":"+(sec<10?"0":"")+sec; }

function calculate() {
  var q = parseFloat(getVal('quantity')) || 0; if (!q) return;
  var tpi = parseToSec(el('timePerItem') ? el('timePerItem').textContent : "00:00:30");
  var prep = isPrepActive ? 900 : 0; var norm = (q * tpi) + prep;
  var startStr = el('startTime') ? el('startTime').textContent : "08:00";
  var start = parseToSec(startStr);
  var endStr = el('endTime') ? el('endTime').textContent : "16:00:00";
  var eff = 0;
  
  if (endStr !== "00:00:00" && endStr !== "00:00") {
    var FactS = parseToSec(endStr); var FactT = FactS >= start ? FactS - start : (86400 - start) + FactS;
    if (FactT > 0) eff = Math.round((norm / FactT) * 100);
    pendingSaveData = { type: 'norm', result: eff, qty: q, start: startStr, end: endStr, prep: isPrepActive, tpi: tpi };
  }
  
  var clr = eff < 65 ? "#f06767" : eff < 75 ? "#ff9800" : "#3cd4a0";
  var html = "<div style='background:#232a3b; padding:20px; border-radius:12px; text-align:center; margin-top:20px;'>" +
             "<h2 style='color:" + clr + "; margin:0; font-size:40px;'>" + eff + "%</h2>" +
             "<p style='color:#8b949e; margin-top:5px;'>Итоговая успеваемость</p>" +
             "<button class='btn btn-calc' style='width:100%; margin-top:15px;' onclick='openModal(\"saveModalOverlay\")'>Сохранить результат</button>" +
             "</div>";
  var resEl = el('result'); if (resEl) { resEl.innerHTML = html; window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}); }
}

function openModal(id) { setDisplay(id, 'flex'); }
function closeModal(id) { setDisplay(id, 'none'); }

function confirmSave() {
  var proVal = getVal('savePro'), stanVal = getVal('saveStanowisko');
  if(!proVal || !stanVal) { alert("Заполните PRO и Stanowisko!"); return; }

  var record = {
      pro: proVal, stan: stanVal, wTypeKey: getVal('saveWorkType'), uwagi: getVal('saveUwagi'),
      timestamp: Date.now(), dateStr: getTodayStr(),
      qty: pendingSaveData.qty, start: pendingSaveData.start, end: pendingSaveData.end, prep: pendingSaveData.prep, result: pendingSaveData.result, tpi: pendingSaveData.tpi
  };
  savedHistory.unshift(record);
  apiCall('saveHistory', { history: savedHistory });
  closeModal('saveModalOverlay');
  alert("Успешно сохранено!");
  openProfile(); filterHistory();
}

window.filterHistory = function() {
    var val = getVal('proSearchInput').replace(/[^0-9\-]/g, '');
    var container = el('historyCardsContainer'); if(!container) return;
    var html = "";
    for(var i=0; i<savedHistory.length; i++) {
        var item = savedHistory[i];
        if (val && (item.pro||"").replace(/[^0-9\-]/g, '').indexOf(val) === -1) continue;
        var clr = item.result < 65 ? "#f06767" : item.result < 75 ? "#ff9800" : "#3cd4a0";
        html += "<div class='hist-card' style='padding:15px; display:flex; justify-content:space-between; align-items:center;'>" +
                "<div><b style='color:#fff;'>PRO-" + item.pro + "</b><br><small style='color:#8b949e;'>" + item.dateStr + "</small></div>" +
                "<div style='font-size:20px; font-weight:bold; color:" + clr + ";'>" + item.result + "%</div>" +
                "</div>";
    }
    container.innerHTML = html || "<div style='color:#8b949e; padding:20px; text-align:center;'>Нет данных</div>";
}

document.addEventListener('DOMContentLoaded', function() {
    initWheel('hWheel', 23); initWheel('mWheel', 59); initWheel('sWheel', 59);
    checkAuth();
});
