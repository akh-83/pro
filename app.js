const SUPABASE_URL = 'https://apnmlbvefruhagufmpfc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QE6JAl1XxmOR_0cjGXEJ3g_GvOII0fY';
let supabase = null;
try {
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
} catch (e) {
    console.error("Supabase init error");
}

const ADMIN_ID = '8543137368';

var tgApp = null;
try { tgApp = window.Telegram ? window.Telegram.WebApp : null; } catch(e) {}

var isCloudStorageSupported = tgApp && tgApp.isVersionAtLeast && tgApp.isVersionAtLeast('6.9');
var isAdmin = false;
var viewingWorkerId = null; 
var currentWorkerId = null;
try {
    currentWorkerId = localStorage.getItem('kkn_worker_id') || null;
} catch (e) {}
var adminUsersList = [];

var dbFirstName = "";
var dbLastName = "";

if (tgApp && tgApp.initDataUnsafe && tgApp.initDataUnsafe.user) {
    if (tgApp.initDataUnsafe.user.id == ADMIN_ID) isAdmin = true;
}

function showNetworkError() {
    const banner = document.getElementById('networkErrorBanner');
    if (banner) {
        banner.style.display = 'block';
        setTimeout(() => { banner.style.display = 'none'; }, 3000);
    }
}

// Безопасные функции для работы с DOM (чтобы не крашилось, если элемента нет)
function sText(id, text) { let el = document.getElementById(id); if (el && text !== undefined) el.textContent = text; }
function sHtml(id, html) { let el = document.getElementById(id); if (el && html !== undefined) el.innerHTML = html; }
function sPlace(id, text) { let el = document.getElementById(id); if (el && text !== undefined) el.placeholder = text; }

async function apiCall(action, payload = {}) {
    if (!supabase) {
        showNetworkError();
        return { status: 'error', message: 'No Supabase' };
    }
    
    const tgUser = tgApp?.initDataUnsafe?.user;
    const uid = tgUser?.id || 'local';
    const wid = viewingWorkerId || currentWorkerId || 'unknown';

    try {
        if (action === 'getUserData') {
            const targetUid = payload.user_id || uid;
            const { data } = await supabase.from('workers').select('*').eq('tg_id', targetUid.toString()).maybeSingle();
            const { count } = await supabase.from('workers').select('*', { count: 'exact', head: true });
            
            if (data) {
                return { status: 'success', worker_id: data.worker_id, first_name: data.first_name, last_name: data.last_name, total_users: count || 0 };
            }
            return { status: 'success', worker_id: null, total_users: count || 0 };
        }

        if (action === 'registerUser') {
            const workerId = payload.worker_id;
            const { data: exist } = await supabase.from('workers').select('*').eq('worker_id', workerId).maybeSingle();
            
            const tgFirstName = tgUser?.first_name || '';
            const tgLastName = tgUser?.last_name || '';

            if (exist) {
                await supabase.from('workers').update({ 
                    tg_id: uid.toString(),
                    first_name: exist.first_name || tgFirstName,
                    last_name: exist.last_name || tgLastName
                }).eq('worker_id', workerId);
            } else {
                await supabase.from('workers').insert([{ 
                    tg_id: uid.toString(), 
                    worker_id: workerId,
                    first_name: tgFirstName,
                    last_name: tgLastName
                }]);
            }
            const { count } = await supabase.from('workers').select('*', { count: 'exact', head: true });
            return { status: 'success', total_users: count || 0 };
        }

        if (action === 'updateProfile') {
            const { old_worker_id, new_worker_id, first_name, last_name } = payload;
            await supabase.from('workers').update({ worker_id: new_worker_id, first_name: first_name, last_name: last_name }).eq('worker_id', old_worker_id);
            return { status: 'success' };
        }

        if (action === 'getData') {
            const targetWid = payload.worker_id || wid;
            if (targetWid === 'unknown') return { status: 'success', history: [], rcpHistory: [], rcpState: null };

            const { data: uData } = await supabase.from('workers').select('*').eq('worker_id', targetWid).maybeSingle();
            
            if (!uData && !viewingWorkerId) {
                const tgFirstName = tgUser?.first_name || '';
                const tgLastName = tgUser?.last_name || '';
                await supabase.from('workers').insert([{ 
                    tg_id: uid.toString(), 
                    worker_id: targetWid,
                    first_name: tgFirstName,
                    last_name: tgLastName
                }]);
            }

            const { data: hData } = await supabase.from('time_history').select('*').eq('worker_id', targetWid);
            const { data: pData } = await supabase.from('pro_history').select('*').eq('worker_id', targetWid);
            const { count } = await supabase.from('workers').select('*', { count: 'exact', head: true });

            let rcpHist = [];
            let rcpSt = null;
            let hist = [];

            if (hData) {
                hData.forEach(r => {
                    if (!r.end_time || r.end_time === "") {
                        rcpSt = { dateStr: r.date_str, start: r.start_time, end: null, timestamp: Date.now() };
                    } else {
                        rcpHist.push({ dateStr: r.date_str, start: r.start_time, end: r.end_time, durationSec: (r.total_hours * 3600), timestamp: Date.now() });
                    }
                });
            }

            if (pData) {
                pData.forEach(r => {
                    hist.push({
                        dateStr: r.date_str, pro: r.pro_n, pos: r.pos_num, qty: r.qty,
                        start: r.start_time, end: r.end_time, stan: r.stan, uwagi: r.uwagi, result: parseFloat(r.result_percent) || 0
                    });
                });
            }

            return {
                status: 'success',
                history: hist, rcpHistory: rcpHist, rcpState: rcpSt,
                first_name: uData ? uData.first_name : (tgUser?.first_name || ""), 
                last_name: uData ? uData.last_name : (tgUser?.last_name || ""),
                total_users: count || 0
            };
        }

        if (action === 'saveRCP') {
            const targetWid = payload.worker_id || wid;
            await supabase.from('time_history').delete().eq('worker_id', targetWid);
            
            let toInsert = [];
            if (payload.history) payload.history.forEach(r => {
                toInsert.push({ worker_id: targetWid, date_str: r.dateStr, start_time: r.start, end_time: r.end, total_hours: Math.round(r.durationSec / 3600) });
            });
            if (payload.state) {
                toInsert.push({ worker_id: targetWid, date_str: payload.state.dateStr, start_time: payload.state.start, end_time: "", total_hours: null });
            }
            if (toInsert.length > 0) await supabase.from('time_history').insert(toInsert);
            return { status: 'success' };
        }

        if (action === 'saveHistory') {
            const targetWid = payload.worker_id || wid;
            await supabase.from('pro_history').delete().eq('worker_id', targetWid);
            
            let toInsert = [];
            if (payload.history) payload.history.forEach(r => {
                toInsert.push({
                    worker_id: targetWid, date_str: r.dateStr, pro_n: r.pro, pos_num: r.pos,
                    qty: r.qty, start_time: r.start, end_time: r.end, stan: r.stan, uwagi: r.uwagi, result_percent: r.result
                });
            });
            if (toInsert.length > 0) await supabase.from('pro_history').insert(toInsert);
            return { status: 'success' };
        }

        if (action === 'getAllUsers') {
            const { data } = await supabase.from('workers').select('*');
            let usersArr = data ? data.map(u => ({ tg_id: u.tg_id, worker_id: u.worker_id, first_name: u.first_name, last_name: u.last_name })) : [];
            return { status: 'success', users: usersArr };
        }

        if (action === 'deleteAllUsers') {
            await supabase.from('workers').delete().neq('id', 0);
            return { status: 'success' };
        }

        if (action === 'deleteUser') {
            await supabase.from('workers').delete().eq('worker_id', payload.target_worker_id);
            return { status: 'success' };
        }

        if (action === 'sendHelp') return { status: 'success' };

    } catch(e) {
        showNetworkError();
        return { status: 'error', message: e.toString() };
    }
    return { status: 'success' };
}

// Фоновый синхронизатор (Синхронизация локалки в облако)
async function syncOfflineData() {
    if (!supabase || !currentWorkerId) return;
    try {
        let localHist = JSON.parse(localStorage.getItem('kkn_history_v2'));
        let localRcp = JSON.parse(localStorage.getItem('kkn_rcp_v1'));
        
        if (localHist && localHist.length > 0) {
            await apiCall('saveHistory', { history: localHist });
        }
        if (localRcp && (localRcp.history || localRcp.state)) {
            await apiCall('saveRCP', localRcp);
        }
    } catch(e) {}
}

const tr = {
  'Pyc': {
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    labels: { qty:'Количество штук', tpi:'Время на 1 штуку', prep:'Подготовка', prepSub:'15 минут к норме', start:'Начало', end:'Окончание', active:'АКТИВНО', inactive:'НЕ АКТИВНО' },
    btns: { calc:'Рассчитать', info:'Инструкция', cancel:'Отмена', done:'Готово', pick:'Время', saveRes:'Сохранить результат', search:'Поиск' },
    stats: { success:'Успеваемость', zone:'Вы сейчас находитесь в зоне:', plan:'План окончания:', norm:'Норма на всё:', spent1:'Затрачено на 1 шт:', spentNorm:'Время затрачено:', fact:'Факт. окончание:', qtyPerHour:'Кол. в час:', forThisTime:'За это время:' },
    legend: ['Риск', 'Не плохо', 'Норма'], zones: { risk: 'Красная зона риска', orange: 'Оранжевая зона', green: 'Зелёная зона', over: 'Красная зона' },
    msgs: { fail: 'ВЫ НЕ СПРАВЛЯЕТЕСЬ!', push: 'ПОДНАЖМИТЕ!', good: 'Хороший темп ТАК ДЕРЖАТЬ!', over: 'ВЫ ПРЕВЫШАЕТЕ НОРМУ!' },
    instrNorm: [
        {t: 'Вкладки приложения', c: 'Приложение состоит из 5 вкладок: Главная, История, Калькулятор, Рабочее время (RCP) и Инструкция.'},
        {t: 'Главная страница', c: 'Здесь отображается ваш текущий статус RCP, календарь со средним процентом успеваемости за дни, статистика за месяц и график успеваемости.'},
        {t: 'История работы', c: 'Список всех ваших сохраненных расчетов. Вы можете искать по PRO (включая цифры и дефисы), редактировать и удалять записи. Сортировка идет от новых к старым.'},
        {t: 'Калькулятор', c: 'Введите количество штук, время на 1 штуку (из чертежа), время начала и окончания. Нажмите "Рассчитать", чтобы увидеть процент и зону.'},
        {t: 'Рабочее время (RCP)', c: 'Ваш табель рабочего времени. При входе открывается смена, где нужно указать рабочий номер. В календаре можно смотреть и редактировать отработанные часы за прошлые дни.'}
    ],
    saveModal: { title: 'Сохранение результата', pro: 'PRO', stan: 'Номер Stanowiska', type: 'Вид работы', btnSave: 'Сохранить', btnCancel: 'Отмена', date: 'Дата' },
    workTime: { thisMonth: 'Ваши рабочие часы:', thisMonthDash: 'За этот месяц:', lastMonth: 'В прошлом месяце:', h: 'ч.', search: 'Поиск по PRO', uwagi: 'Uwagi (заметки)' },
    rcp: { title: 'Регистрация RCP', desc: 'Укажите время начала работы', startBtn: 'Подтвердить', closeTitle: 'Закрыть рабочее время', startedAt: 'Начато в:', closeBtn: 'Завершить', closedToday: 'За сегодня.' },
    dash: { empty: 'Истории сохранений пока нет.', title: 'УСПЕВАЕМОСТЬ', zonePrefix: 'Вы сейчас находитесь в зоне:', cal: 'Календарь', noData: 'Нет данных', dyn: 'Динамика успеваемости', hist: 'История нормы', days: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'], date: 'число', lblDate: 'Дата:', lblStart: 'Время начала', lblEnd: 'Время окончания', lblAvg: 'Среднее по %', types: { t1: 'Сварка ручная', t2: 'Сварка на обротнице', t3: 'Поправка' }, saved: 'Успешно сохранено!', confirmDel: 'Удалить эту запись?', matches: 'Найдено совпадений', pcs: 'шт.', settings: 'Настройки профиля', yes: 'Да', no: 'Нет', stanLabel: 'Рабочее место', fillFields: 'Заполните поля!' },
    rcpTabTitle: 'Рабочее время (RCP)', editRcp: 'Редактирование RCP', reStart: 'Время начала', reEnd: 'Время окончания', del: 'Удалить',
    proLabel: 'цифры и -', rcpWorkerNum: 'Рабочий номер', helpBtn: 'Помощь', helpTitle: 'Помощь', helpPlaceholder: 'Опишите проблему...', helpSend: 'Отправить', helpSent: 'Сообщение отправлено!',
    auth: { title: 'Авторизация', desc: 'Введите ваш рабочий номер', btn: 'Войти', confirmWorker: 'Подтвердите правильность ввода рабочего номера: ' },
    admin: { title: 'Панель Администратора', back: 'Выйти из профиля', users: 'Пользователи', resetData: 'Сбросить данные', resetConfirm: 'Удалить ВСЕ локальные данные из браузера? Это действие необратимо!', resetSuccess: 'Данные сброшены! Перезапуск...', deleteAll: 'Удалить всех', deleteUser: 'Удалить', deleteConfirm: 'Вы уверены, что хотите удалить эти данные? Действие необратимо!' },
    profSet: { title: 'Настройки профиля', worker: 'Рабочий номер', fname: 'Имя', lname: 'Фамилия' }
  },
  'Eng': {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    labels: { qty:'Quantity', tpi:'Time per item', prep:'Preparation', prepSub:'15 min to norm', start:'Start', end:'End', active:'ACTIVE', inactive:'INACTIVE' },
    btns: { calc:'Calculate', info:'Instruction', cancel:'Cancel', done:'Done', pick:'Time', saveRes:'Save Result', search:'Search' },
    stats: { success:'Efficiency', zone:'Zone:', plan:'Plan:', norm:'Norm:', spent1:'Spent per 1:', spentNorm:'Spent:', fact:'Fact:', qtyPerHour:'Qty/h:', forThisTime:'For this time:' },
    legend: ['Risk', 'Not bad', 'Normal'], zones: { risk: 'Red Zone', Orange Zone', green: 'Green Zone', over: 'Over' },
    msgs: { fail: 'FAIL!', push: 'PUSH!', good: 'GOOD!', over: 'OVER!' }, 
    instrNorm: [
        {t: 'App Tabs', c: 'The app consists of 5 tabs: Main, History, Calculator, Work Time (RCP), and Instruction.'},
        {t: 'Main Page', c: 'Displays your current RCP status, a calendar with daily average percentage, monthly stats, and performance chart.'},
        {t: 'History', c: 'A list of all your saved calculations. You can search by PRO (including dashes), edit, and delete records. Sorted newest to oldest.'},
        {t: 'Calculator', c: 'Enter the quantity, time per item, start and end time. Click "Calculate" to see the percentage and performance zone.'},
        {t: 'Work Time (RCP)', c: 'Your timesheet. A shift opens on first login, requiring a work number. View and edit past hours in the calendar.'}
    ],
    saveModal: { title: 'Save Result', pro: 'PRO', stan: 'Workplace Number', type: 'Type of work', btnSave: 'Save', btnCancel: 'Cancel', date: 'Date' },
    workTime: { thisMonth: 'Your work hours:', thisMonthDash: 'For this month:', lastMonth: 'Last month:', h: 'h.', search: 'Search PRO', uwagi: 'Notes' },
    rcp: { title: 'RCP Registration', desc: 'Specify work start time', startBtn: 'Confirm', closeTitle: 'Close work time', startedAt: 'Started at:', closeBtn: 'End', closedToday: 'For today.' },
    dash: { empty: 'No history yet.', title: 'EFFICIENCY', zonePrefix: 'Current zone:', cal: 'Calendar', noData: 'No Data', dyn: 'Performance Dynamics', hist: 'Norm History', days: ['Mo','Tu','We','Th','Fr','Sa','Su'], date: 'date', lblDate: 'Date:', lblStart: 'Start time', lblEnd: 'End time', lblAvg: 'Average %', types: { t1: 'Manual welding', t2: 'Rotary welding', t3: 'Correction' }, saved: 'Saved successfully!', confirmDel: 'Delete this record?', matches: 'Matches found', pcs: 'pcs.', settings: 'Profile Settings', yes: 'Yes', no: 'No', stanLabel: 'Workplace', fillFields: 'Fill in all fields!' },
    rcpTabTitle: 'Work Time (RCP)', editRcp: 'Edit RCP', reStart: 'Start time', reEnd: 'End time', del: 'Delete',
    proLabel: 'numbers and -', rcpWorkerNum: 'Work number', helpBtn: 'Help', helpTitle: 'Help Form', helpPlaceholder: 'Describe your problem...', helpSend: 'Send', helpSent: 'Message sent!',
    auth: { title: 'Authorization', desc: 'Enter your work number', btn: 'Login', confirmWorker: 'Confirm the entered work number: ' },
    admin: { title: 'Admin Panel', back: 'Exit profile', users: 'Users', resetData: 'Reset data', resetConfirm: 'Delete ALL local data? Irreversible!', resetSuccess: 'Data reset! Restarting...', deleteAll: 'Delete all', deleteUser: 'Delete', deleteConfirm: 'Are you sure? Irreversible!' },
    profSet: { title: 'Profile Settings', worker: 'Work Number', fname: 'First Name', lname: 'Last Name' }
  }
};

let currentLang = 'Pyc';
let savedHistory = [];
let rcpHistory = [];
let rcpState = null;
let pendingSaveData = null; 
let editIndex = -1;

let currentRcpDate = new Date();
let currentMainCalDate = new Date(); 
let editingRcpDateStr = null;

function getTodayStr() { return new Date().toLocaleDateString('ru-RU'); }
function getNowTime() { const now = new Date(); let h = now.getHours(); let m = now.getMinutes(); return (h<10?'0':'')+h + ':' + (m<10?'0':'')+m; }

function updateHeader() {
    let nameToDisplay = currentWorkerId ? "№ " + currentWorkerId : "Пользователь";
    let fullName = (dbFirstName + " " + dbLastName).trim();
    if (fullName) nameToDisplay = fullName;
    
    if (isAdmin && viewingWorkerId) nameToDisplay = "Worker № " + viewingWorkerId;
    sText('profileName', nameToDisplay);
}

function sortSavedHistory() {
    savedHistory.sort(function(a, b) {
        let pA = (a.dateStr || "").split('.');
        let pB = (b.dateStr || "").split('.');
        let tA = (a.start || "").split(':');
        let tB = (b.start || "").split(':');
        
        let yA = parseInt(pA[2]) || 1970, mA = (parseInt(pA[1]) || 1) - 1, dA = parseInt(pA[0]) || 1;
        let hA = parseInt(tA[0]) || 0, minA = parseInt(tA[1]) || 0;
        let dateA = new Date(yA, mA, dA, hA, minA).getTime();
        
        let yB = parseInt(pB[2]) || 1970, mB = (parseInt(pB[1]) || 1) - 1, dB = parseInt(pB[0]) || 1;
        let hB = parseInt(tB[0]) || 0, minB = parseInt(tB[1]) || 0;
        let dateB = new Date(yB, mB, dB, hB, minB).getTime();
        
        return dateB - dateA;
    });
}

function getWorkHoursStats() {
    const now = new Date();
    const cm = now.getMonth(), cy = now.getFullYear();
    let lm = cm === 0 ? 11 : cm - 1;
    let ly = cm === 0 ? cy - 1 : cy;
    
    let tThis = 0, tLast = 0;
    rcpHistory.forEach(r => {
        let dur = r.durationSec;
        if (dur === undefined) {
            if (r.end === "Auto (8h)") dur = 28800;
            else if (r.start && r.end) {
                let s = parseToSec(r.start), e = parseToSec(r.end);
                dur = e >= s ? e - s : (86400 - s) + e;
            } else dur = 0;
        }
        const d = new Date(r.timestamp);
        if (d.getMonth() === cm && d.getFullYear() === cy) tThis += dur;
        else if (d.getMonth() === lm && d.getFullYear() === ly) tLast += dur;
    });
    if (rcpState && rcpState.dateStr === getTodayStr() && !rcpState.end) {
        const s = parseToSec(rcpState.start), e = parseToSec(getNowTime());
        tThis += (e >= s ? e - s : (86400 - s) + e);
    }
    return { thisMonth: Math.round(tThis / 3600), lastMonth: Math.round(tLast / 3600) };
}

function switchMainTab(tabId, el) {
    document.querySelectorAll('.main-tab-content').forEach(function(t) { t.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function(i) { i.classList.remove('active'); });
    let target = document.getElementById(tabId);
    if(target) target.classList.add('active');
    if (el) el.classList.add('active');
}

async function checkAuth() {
    if (isAdmin && !viewingWorkerId) {
        loadAdminUsers();
        return;
    }
    
    sText('globalUserCount', "Загрузка...");
    let tgId = tgApp?.initDataUnsafe?.user?.id || 'local';
    
    let res = await apiCall('getUserData', { user_id: tgId });
    if (res && res.status === 'success') {
        if (res.worker_id) {
            currentWorkerId = res.worker_id;
            try { localStorage.setItem('kkn_worker_id', currentWorkerId); } catch(e) {}
        }
        if (res.first_name) dbFirstName = res.first_name;
        if (res.last_name) dbLastName = res.last_name;
        
        if (res.total_users !== undefined) {
            sText('globalUserCount', "users: " + res.total_users);
        }
    } else {
        sText('globalUserCount', "users: 0");
    }

    if (!currentWorkerId) {
        try { currentWorkerId = localStorage.getItem('kkn_worker_id') || null; } catch(e) {}
    }

    if (!currentWorkerId) {
        let authO = document.getElementById('authOverlay');
        if (authO) authO.style.display = 'flex';
        setLang(currentLang);
    } else {
        updateHeader();
        initAppData();
    }
}

async function saveWorkerId() {
    let authInp = document.getElementById('authWorkerInput');
    const val = authInp ? authInp.value : null;
    const t = tr[currentLang];
    
    if (!val) {
        if(tgApp && tgApp.showAlert) tgApp.showAlert(t.dash.fillFields || "Введите номер!"); else alert(t.dash.fillFields || "Введите номер!");
        return;
    }
    
    let confirmMsg = (t.auth.confirmWorker || "Подтвердите: ") + val;
    if (!confirm(confirmMsg)) return;
    
    sText('a_btn', "...");
    let btn = document.getElementById('a_btn');
    if(btn) btn.disabled = true;

    let tgId = tgApp?.initDataUnsafe?.user?.id || 'local';
    let res = await apiCall('registerUser', { user_id: tgId, worker_id: val });
    
    if (res && res.total_users !== undefined) {
        sText('globalUserCount', "users: " + res.total_users);
    }

    sText('a_btn', t.auth.btn);
    if(btn) btn.disabled = false;

    currentWorkerId = val;
    try { localStorage.setItem('kkn_worker_id', val); } catch(e) {}
    
    let authO = document.getElementById('authOverlay');
    if (authO) authO.style.display = 'none';
    
    updateHeader();
    initAppData();
}

async function initAppData() {
    if (!currentWorkerId && !viewingWorkerId) {
        afterDataLoad();
        return;
    }

    let gCount = document.getElementById('globalUserCount');
    let prevCountText = gCount ? gCount.textContent : "";
    sText('globalUserCount', "Загрузка данных...");

    let res = await apiCall('getData');
    if (res && res.status === 'success') {
         savedHistory = res.history || [];
         rcpHistory = res.rcpHistory || [];
         rcpState = res.rcpState || null;
         
         if (res.first_name) dbFirstName = res.first_name; else dbFirstName = "";
         if (res.last_name) dbLastName = res.last_name; else dbLastName = "";
         
         if (res.total_users !== undefined) sText('globalUserCount', "users: " + res.total_users);
         else sText('globalUserCount', prevCountText !== "Загрузка данных..." ? prevCountText : "users: 0");
         sortSavedHistory();
         
         // Синхронизируем локальные изменения, если они есть
         syncOfflineData();
    } else {
         try {
             savedHistory = JSON.parse(localStorage.getItem('kkn_history_v2')) || [];
             let localRcp = JSON.parse(localStorage.getItem('kkn_rcp_v1')) || {};
             rcpHistory = localRcp.history || [];
             rcpState = localRcp.state || null;
         } catch(e) {
             savedHistory = [];
             rcpHistory = [];
             rcpState = null;
         }
         sText('globalUserCount', "Оффлайн");
    }

    afterDataLoad();
}

function afterDataLoad() {
    if (isAdmin && viewingWorkerId) {
        sText('globalUserCount', "Admin Mode");
    }
    updateHeader();
    checkRCP();
    openProfile();
    filterHistory();
    renderRcpTab();
}

function checkRCP() {
    if(isAdmin && !viewingWorkerId) return; 
    const today = getTodayStr();
    if (rcpState && rcpState.dateStr !== today && !rcpState.end) {
        rcpState.end = "Auto (8h)";
        rcpHistory.push({ dateStr: rcpState.dateStr, start: rcpState.start, end: rcpState.end, durationSec: 28800, timestamp: rcpState.timestamp });
    }
    if (!rcpState || rcpState.dateStr !== today) {
        sText('rcpTodayDate', today);
        sText('rcpStartTime', getNowTime());
        let o = document.getElementById('rcpOverlay');
        if(o) o.style.display = 'flex';
    } else {
        let o = document.getElementById('rcpOverlay');
        if(o) o.style.display = 'none';
    }
}

function saveRCPData() {
    const data = { state: rcpState, history: rcpHistory };
    try { localStorage.setItem('kkn_rcp_v1', JSON.stringify(data)); } catch(e) {}
    apiCall('saveRCP', data);
}

function confirmRCPStart() {
    const sEl = document.getElementById('rcpStartTime');
    const sTime = sEl ? sEl.textContent : getNowTime();
    rcpState = { dateStr: getTodayStr(), start: sTime, end: null, timestamp: Date.now(), workerNum: currentWorkerId };
    saveRCPData();
    let o = document.getElementById('rcpOverlay');
    if(o) o.style.display = 'none';
    openProfile();
}

function confirmRCPEnd() {
    const eTimeEl = document.getElementById('rcpEndTime');
    const eTime = eTimeEl ? eTimeEl.textContent : getNowTime();
    const s = parseToSec(rcpState.start);
    const e = parseToSec(eTime);
    const durationSec = e >= s ? e - s : (86400 - s) + e;

    rcpState.end = eTime;
    rcpHistory.push({ dateStr: rcpState.dateStr, start: rcpState.start, end: rcpState.end, durationSec: durationSec, timestamp: rcpState.timestamp });
    saveRCPData();
    openProfile();
}

function changeRcpMonth(offset) {
    currentRcpDate.setMonth(currentRcpDate.getMonth() + offset);
    renderRcpTab();
}

function renderRcpTab() {
    const t = tr[currentLang];
    const y = currentRcpDate.getFullYear();
    const m = currentRcpDate.getMonth();
    sText('rcpMonthLabel', t.months[m] + " " + y);

    const stats = getWorkHoursStats();
    let whHtml = 
        "<div style='display:flex; justify-content:space-between; align-items:center; width: 100%; background: #232a3b; border: 1px solid #343e50; border-radius: 12px; padding: 15px; margin-bottom: 15px; box-sizing:border-box;'>" +
            "<div style='text-align:left;'><span style='color:#8b949e; font-size:13px;'>" + t.workTime.thisMonth + "</span><br><b style='color:#3cd4a0; font-size:18px;'>" + stats.thisMonth + " " + t.workTime.h + "</b></div>" +
            "<div style='text-align:right;'><span style='color:#8b949e; font-size:13px;'>" + t.workTime.lastMonth + "</span><br><b style='color:#fff; font-size:18px;'>" + stats.lastMonth + " " + t.workTime.h + "</b></div>" +
        "</div>";
    sHtml('rcpTabHours', whHtml);

    const daysInMonth = new Date(y, m + 1, 0).getDate();
    let calHtml = "<div class='cal-grid'>" +
        "<div class='cal-header'>" + t.dash.days[0] + "</div><div class='cal-header'>" + t.dash.days[1] + "</div><div class='cal-header'>" + t.dash.days[2] + "</div><div class='cal-header'>" + t.dash.days[3] + "</div><div class='cal-header'>" + t.dash.days[4] + "</div><div class='cal-header'>" + t.dash.days[5] + "</div><div class='cal-header'>" + t.dash.days[6] + "</div>";
    
    let firstDay = new Date(y, m, 1).getDay();
    firstDay = firstDay === 0 ? 7 : firstDay; 
    for(let i=1; i<firstDay; i++) { calHtml += "<div></div>"; }

    let rcpMap = {};
    rcpHistory.forEach(r => rcpMap[r.dateStr] = r);
    if (rcpState && rcpState.dateStr) rcpMap[rcpState.dateStr] = rcpState; 

    let cardsHtml = "";

    for(let i=1; i<=daysInMonth; i++) {
        let checkDate = new Date(y, m, i);
        let checkDateStr = checkDate.toLocaleDateString('ru-RU');
        let hasData = rcpMap[checkDateStr];
        let isToday = (checkDateStr === getTodayStr());

        let dayClass = 'cal-day';
        let dayStyle = '';
        
        if (hasData) {
            dayClass += ' active';
            dayStyle = 'background:#4e73df;';
            
            let dur = hasData.durationSec;
            if (dur === undefined) {
                if (hasData.end === "Auto (8h)") dur = 28800;
                else {
                    let sSec = parseToSec(hasData.start);
                    let eSec = parseToSec(hasData.end || getNowTime());
                    dur = eSec >= sSec ? eSec - sSec : (86400 - sSec) + eSec;
                }
            }
            let hrs = Math.round(dur / 3600);
            
            cardsHtml += `<div class='hist-card' style='margin-bottom:8px; cursor:${isAdmin ? "pointer" : "default"};' ${isAdmin ? `onclick='openRcpEdit("${checkDateStr}")'` : ''}>
                <div style='display:flex; justify-content:space-between; align-items:center;'>
                    <div style='flex:1; text-align:left; color:#fff; font-size:16px;'>${checkDateStr}</div>
                    <div style='flex:1; text-align:center; color:#3cd4a0; font-size:16px;'>${hrs} ${t.workTime.h}</div>
                    <div style='flex:1; text-align:right; color:#3cd4a0; font-size:16px;'>${hasData.start} - ${hasData.end ? hasData.end : '...'}</div>
                </div>
            </div>`;
        } else if (isToday) {
            dayClass += ' active';
            dayStyle = 'background:#343e50; border: 1px solid #4e73df;';
        }

        calHtml += `<div class='${dayClass}' style='${dayStyle}; cursor:${isAdmin ? "pointer" : "default"};' ${isAdmin ? `onclick='openRcpEdit("${checkDateStr}")'` : ''}>${i}</div>`;
    }
    calHtml += "</div>";
    sHtml('rcpTabCalendar', calHtml);
    
    if (!cardsHtml) cardsHtml = `<div style='text-align:center; color:#8b949e; margin-top:20px;'>${t.dash.noData}</div>`;
    sHtml('rcpTabCards', cardsHtml);
}

function openRcpEdit(dateStr) {
    if (!isAdmin) return;
    editingRcpDateStr = dateStr;
    sText('re_date', dateStr);
    
    let existing = rcpHistory.find(r => r.dateStr === dateStr);
    if (!existing && rcpState && rcpState.dateStr === dateStr) existing = rcpState;

    let bDel = document.getElementById('re_btn_del');
    if (existing) {
        sText('re_start', existing.start);
        sText('re_end', existing.end ? existing.end : getNowTime());
        if(bDel) bDel.style.display = 'block';
    } else {
        sText('re_start', "08:00");
        sText('re_end', "16:00");
        if(bDel) bDel.style.display = 'none';
    }
    openModal('rcpEditModalOverlay');
}

function saveRcpEdit() {
    let sEl = document.getElementById('re_start');
    let eEl = document.getElementById('re_end');
    let start = sEl ? sEl.textContent : "08:00";
    let end = eEl ? eEl.textContent : "16:00";
    
    let sSec = parseToSec(start);
    let eSec = parseToSec(end);
    let dur = eSec >= sSec ? eSec - sSec : (86400 - sSec) + eSec;

    if (rcpState && rcpState.dateStr === editingRcpDateStr) {
        rcpState.start = start;
        rcpState.end = end;
        rcpHistory.push({ dateStr: rcpState.dateStr, start: rcpState.start, end: rcpState.end, durationSec: dur, timestamp: rcpState.timestamp });
        rcpState = null; 
    } else {
        let idx = rcpHistory.findIndex(r => r.dateStr === editingRcpDateStr);
        if (idx > -1) {
            rcpHistory[idx].start = start;
            rcpHistory[idx].end = end;
            rcpHistory[idx].durationSec = dur;
        } else {
            let parts = editingRcpDateStr.split('.');
            let ts = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00`).getTime();
            rcpHistory.push({ dateStr: editingRcpDateStr, start: start, end: end, durationSec: dur, timestamp: ts });
        }
    }
    saveRCPData();
    closeModal('rcpEditModalOverlay');
    renderRcpTab();
    openProfile();
}

function deleteRcpEdit() {
    const t = tr[currentLang];
    if (confirm(t.dash.confirmDel)) {
        if (rcpState && rcpState.dateStr === editingRcpDateStr) {
            rcpState = null;
        } else {
            let idx = rcpHistory.findIndex(r => r.dateStr === editingRcpDateStr);
            if (idx > -1) rcpHistory.splice(idx, 1);
        }
        saveRCPData();
        closeModal('rcpEditModalOverlay');
        renderRcpTab();
        openProfile();
    }
}

let isSavePrepActive = false;
function toggleSavePrep() {
    isSavePrepActive = !isSavePrepActive;
    let rDot = document.getElementById('saveRadioDot');
    let sTog = document.getElementById('savePrepToggle');
    if(rDot) rDot.style.display = isSavePrepActive ? 'block' : 'none';
    if(sTog) {
        if(isSavePrepActive) sTog.classList.add('active');
        else sTog.classList.remove('active');
    }
}

function openSaveModal(isEdit, idx) {
    if (isEdit && !isAdmin) return;

    editIndex = isEdit ? idx : -1;
    if (!isEdit && !pendingSaveData) return;
    
    let rec = isEdit ? savedHistory[idx] : pendingSaveData;
    
    let dEl = document.getElementById('saveDate');
    if(dEl) dEl.value = rec.dateStr || getTodayStr();
    
    let pEl = document.getElementById('savePro');
    if(pEl) pEl.value = rec.pro || "";
    
    let stEl = document.getElementById('saveStanowisko');
    if(stEl) stEl.value = rec.stan || "";
    
    let posEl = document.getElementById('savePosNumber');
    if(posEl) posEl.value = rec.pos || "";
    
    let uwEl = document.getElementById('saveUwagi');
    if(uwEl) uwEl.value = rec.uwagi || "";
    
    let qEl = document.getElementById('saveQty');
    if(qEl) qEl.value = rec.qty || "";
    
    sText('saveStart', rec.start || "08:00");
    sText('saveEnd', rec.end || "16:00:00");
    
    isSavePrepActive = rec.prep || false;
    let rDot = document.getElementById('saveRadioDot');
    let sTog = document.getElementById('savePrepToggle');
    if(rDot) rDot.style.display = isSavePrepActive ? 'block' : 'none';
    if(sTog) {
        if(isSavePrepActive) sTog.classList.add('active');
        else sTog.classList.remove('active');
    }
    
    openModal('saveModalOverlay');
}

function confirmSave() {
    let dEl = document.getElementById('saveDate');
    const dateVal = (dEl && dEl.value) ? dEl.value : getTodayStr();
    
    let pEl = document.getElementById('savePro');
    const proVal = pEl ? pEl.value : "";
    
    let stEl = document.getElementById('saveStanowisko');
    const stanVal = stEl ? stEl.value : "";
    
    let posEl = document.getElementById('savePosNumber');
    const posVal = posEl ? posEl.value : "";
    
    let uwEl = document.getElementById('saveUwagi');
    const uwagiVal = uwEl ? uwEl.value : "";
    
    let qEl = document.getElementById('saveQty');
    const qtyVal = qEl ? (parseFloat(qEl.value) || 0) : 0;
    
    let sEl = document.getElementById('saveStart');
    const startVal = sEl ? sEl.textContent : "00:00";
    
    let eEl = document.getElementById('saveEnd');
    const endVal = eEl ? eEl.textContent : "00:00:00";

    const t = tr[currentLang];

    if(!proVal || !stanVal) {
        if(tgApp && tgApp.showAlert) tgApp.showAlert(t.dash.fillFields); else alert(t.dash.fillFields);
        return;
    }

    let recToCalculate = editIndex > -1 ? savedHistory[editIndex] : pendingSaveData;
    let eff = recToCalculate ? recToCalculate.result : 0;
    let finalTpi = recToCalculate ? recToCalculate.tpi : 0;

    if (qtyVal > 0 && startVal && endVal && endVal !== "00:00:00" && recToCalculate) {
        let oldTpi = recToCalculate.tpi;
        if (oldTpi === undefined || oldTpi === null) {
            let FactS = parseToSec(recToCalculate.end);
            let FactStart = parseToSec(recToCalculate.start);
            let FactT = FactS >= FactStart ? FactS - FactStart : (86400 - FactStart) + FactS;
            let oldNorm = FactT * (recToCalculate.result / 100);
            oldTpi = (oldNorm - (recToCalculate.prep ? 900 : 0)) / (recToCalculate.qty || 1);
            if (oldTpi < 0) oldTpi = 0;
        }
        
        let newPrepVal = isSavePrepActive ? 900 : 0;
        let newNorm = (qtyVal * oldTpi) + newPrepVal;
        let newFactS = parseToSec(endVal);
        let newFactStart = parseToSec(startVal);
        let newFactT = newFactS >= newFactStart ? newFactS - newFactStart : (86400 - newFactStart) + newFactS;
        
        if (newFactT > 0) {
            eff = Math.round((newNorm / newFactT) * 100);
        } else {
            eff = 0;
        }
        finalTpi = oldTpi;
    }

    if (editIndex > -1) {
        savedHistory[editIndex].dateStr = dateVal;
        savedHistory[editIndex].pro = proVal;
        savedHistory[editIndex].stan = stanVal;
        savedHistory[editIndex].pos = posVal;
        savedHistory[editIndex].uwagi = uwagiVal;
        savedHistory[editIndex].qty = qtyVal;
        savedHistory[editIndex].start = startVal;
        savedHistory[editIndex].end = endVal;
        savedHistory[editIndex].prep = isSavePrepActive;
        savedHistory[editIndex].result = eff;
        savedHistory[editIndex].tpi = finalTpi;
    } else {
        const record = Object.assign({}, pendingSaveData, {
            pro: proVal, stan: stanVal, pos: posVal, uwagi: uwagiVal, timestamp: Date.now(), dateStr: dateVal,
            qty: qtyVal, start: startVal, end: endVal, prep: isSavePrepActive, result: eff, tpi: finalTpi 
        });
        savedHistory.unshift(record);
        if (savedHistory.length > 500) savedHistory.pop(); 
    }
    
    sortSavedHistory();
    try { localStorage.setItem('kkn_history_v2', JSON.stringify(savedHistory)); } catch(e) {}
    apiCall('saveHistory', { history: savedHistory });
    
    closeModal('saveModalOverlay');
    openProfile();
    filterHistory();
    
    if (!isAdmin) {
        if(tgApp && tgApp.showAlert) tgApp.showAlert(t.dash.saved); else alert(t.dash.saved);
    }
}

function deleteRecord(idx) {
    if (!isAdmin) return;
    const t = tr[currentLang];
    if (confirm(t.dash.confirmDel)) {
        savedHistory.splice(idx, 1);
        try { localStorage.setItem('kkn_history_v2', JSON.stringify(savedHistory)); } catch(e) {}
        apiCall('saveHistory', { history: savedHistory });
        openProfile(); 
        filterHistory();
    }
}

function getColorForPercent(p) { return p < 65 ? "#f06767" : p < 75 ? "#ff9800" : "#3cd4a0"; }

window.filterHistory = function() {
    let sEl = document.getElementById('proSearchInput');
    const val = sEl ? sEl.value : "";
    renderHistoryCards(val);
};

function renderHistoryCards(searchText) {
    const t = tr[currentLang];
    const container = document.getElementById('historyCardsContainer');
    const countContainer = document.getElementById('searchMatchCount');
    if (!container) return;
    
    let html = "";
    let filterStr = searchText ? searchText.replace(/[^0-9\-]/g, '') : "";
    let matchCount = 0;

    savedHistory.forEach(function(item, idx) {
        let itemPro = item.pro ? item.pro.replace(/[^0-9\-]/g, '') : "";
        if (filterStr && itemPro.indexOf(filterStr) === -1) return; 

        matchCount++;

        let iClr = getColorForPercent(item.result);
        let typeText = item.pos ? "Позиция " + item.pos : (item.wTypeKey ? t.dash.types[item.wTypeKey] : (item.wType || t.dash.types['t1']));

        let innerRows = item.type === 'norm' ? 
            "<div class='hc-row'><span>" + t.dash.lblDate + "</span> <span>" + item.dateStr + "</span></div>" +
            "<div class='hc-row'><span>" + t.dash.lblStart + "</span> <span>" + item.start + "</span></div>" +
            "<div class='hc-row'><span>" + t.dash.lblEnd + "</span> <span>" + item.end + "</span></div>" : 
            "<div class='hc-row'><span>" + t.dash.lblDate + "</span> <span>" + item.dateStr + " (" + t.dash.lblAvg + ")</span></div>";
            
        if (item.uwagi) innerRows += "<div class='hc-row'><span style='color:#ff9800'>" + t.workTime.uwagi + ":</span> <span style='text-align:right; max-width:65%; word-break:break-word;'>" + item.uwagi + "</span></div>";

        let footerAdd = item.type === 'norm' ? "<span>" + (t.dash.settings || "USTAWIENIA") + " <span style='color:" + (item.prep ? "#3cd4a0" : "#8b949e") + "'>" + (item.prep ? (t.dash.yes || "Tak") : (t.dash.no || "Nie")) + "</span></span>" : "";
        let qtyAdd = item.qty ? "<div style='background:#1b222d; padding:4px 10px; border-radius:6px; color:#e6edf3;'>" + item.qty + " " + (t.dash.pcs || "шт.") + "</div>" : "";

        let modernBtns = "";
        if (isAdmin) {
            modernBtns = "<div class='hc-actions' style='margin:0; display:flex; gap:8px; align-items:center;'>" +
                "<span class='hc-act-btn' style='background:rgba(88, 166, 255, 0.1); color:#58a6ff; padding:8px; border-radius:8px; display:flex;' onclick='event.stopPropagation(); openSaveModal(true, " + idx + ")'><svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path><path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path></svg></span>" +
                "<span class='hc-act-btn' style='background:rgba(240, 103, 103, 0.1); color:#f06767; padding:8px; border-radius:8px; display:flex;' onclick='event.stopPropagation(); deleteRecord(" + idx + ")'><svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'></polyline><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path><line x1='10' y1='11' x2='10' y2='17'></line><line x1='14' y1='11' x2='14' y2='17'></line></svg></span>" +
            "</div>";
        }

        let qtyText = item.qty ? "<div style='font-size:14px; color:#e6edf3; white-space:nowrap; margin-right:5px;'>" + item.qty + " " + (t.dash.pcs || "шт.") + "</div>" : "";
        let proText = item.pro ? "PRO-" + item.pro : "PRO-...";

        html += 
        "<div class='hist-card' style='padding:15px 12px; cursor:pointer;' onclick='toggleHistoryCard(this)'>" +
            "<div class='hc-collapsed' style='display:flex; align-items:center; width:100%;'>" +
                "<div style='flex:1; font-size:14px; text-align:left; word-break:break-all; color:#fff; font-weight:bold;'>" + proText + "</div>" +
                qtyText +
                "<div style='font-size:16px; font-weight:bold; color:" + iClr + "; margin:0 5px;'>" + item.result + "%</div>" +
                modernBtns +
            "</div>" +
            "<div class='hc-expanded' style='display:none; padding-top:15px; margin-top:15px; border-top:1px solid #343e50;'>" +
                "<div class='hc-top'>" +
                    "<div style='flex:1; text-align:left;'>" +
                        "<div class='hc-pro'>" + proText + "</div>" +
                        "<div class='hc-type'>" + typeText + "</div>" +
                    "</div>" +
                    "<div style='display:flex; flex-direction:column; align-items:flex-end;'>" +
                        modernBtns +
                        "<div class='hc-stan' style='margin-top:10px;'><small style='color:#8b949e'>" + (t.dash.stanLabel || "Stanowisko") + "</small><br><b style='color:#fff; font-size:16px'>" + item.stan + "</b></div>" +
                    "</div>" +
                "</div>" +
                innerRows +
                "<div class='hc-progress-bg'>" +
                    "<div class='hc-progress-fill' style='width:" + Math.min(item.result, 100) + "%; background:" + iClr + "'></div>" +
                "</div>" +
                "<div class='hc-footer'>" +
                    "<span style='color:" + iClr + "; font-weight:bold; font-size:18px;'>" + item.result + "%</span>" +
                    footerAdd + qtyAdd +
                "</div>" +
            "</div>" +
        "</div>";
    });

    if (html === "") html = "<div class='history-empty' style='color:#8b949e; margin-top:20px;'>" + t.dash.noData + "</div>";
    container.innerHTML = html;

    if (countContainer) {
        if (filterStr !== "") {
            countContainer.style.display = 'block';
            countContainer.textContent = (t.dash.matches || 'Найдено совпадений') + ": " + matchCount;
        } else {
            countContainer.style.display = 'none';
        }
    }
}

function toggleHistoryCard(cardEl) {
    let exp = cardEl.querySelector('.hc-expanded');
    if (!exp) return;
    let isOpening = exp.style.display === 'none';

    let container = document.getElementById('historyCardsContainer');
    if (container) {
        container.querySelectorAll('.hist-card').forEach(function(card) {
            let cCol = card.querySelector('.hc-collapsed');
            let cExp = card.querySelector('.hc-expanded');
            if (cExp && cCol) {
                cExp.style.display = 'none';
                cCol.style.display = 'flex';
            }
        });
    }

    if (isOpening) {
        exp.style.display = 'block';
        let col = cardEl.querySelector('.hc-collapsed');
        if (col) col.style.display = 'none';
    }
}

function changeMainMonth(offset) {
    currentMainCalDate.setMonth(currentMainCalDate.getMonth() + offset);
    openProfile();
}

function resetAllLocalData() {
    const t = tr[currentLang];
    if (!confirm(t.admin.resetConfirm)) return;
    
    try {
        localStorage.removeItem('kkn_worker_id');
        localStorage.removeItem('kkn_history_v2');
        localStorage.removeItem('kkn_rcp_v1');
    } catch(e) {}
    
    if (isCloudStorageSupported) {
        tgApp.CloudStorage.removeItem('kkn_history_v2', function(err, success) {});
        tgApp.CloudStorage.removeItem('kkn_rcp_v1', function(err, success) {});
    }
    
    currentWorkerId = null;
    savedHistory = [];
    rcpHistory = [];
    rcpState = null;
    
    if (tgApp && tgApp.showAlert) {
        tgApp.showAlert(t.admin.resetSuccess, function() {
            window.location.reload();
        });
    } else {
        alert(t.admin.resetSuccess);
        window.location.reload();
    }
}

async function adminDeleteAllUsers() {
    const t = tr[currentLang];
    if (confirm(t.admin.deleteConfirm)) {
        await apiCall('deleteAllUsers');
        loadAdminUsers();
    }
}

async function adminDeleteUser(wId) {
    const t = tr[currentLang];
    if (confirm(t.admin.deleteConfirm)) {
        await apiCall('deleteUser', { target_worker_id: wId });
        exitAdminView();
    }
}

window.toggleAdminUserCard = function(el) {
    let details = el.querySelector('.admin-user-details');
    let icon = el.querySelector('.icon-arrow');
    if (details.style.display === 'none') {
        details.style.display = 'block';
        icon.textContent = '▲';
    } else {
        details.style.display = 'none';
        icon.textContent = '▼';
    }
}

async function loadAdminUsers() {
    const t = tr[currentLang];
    sHtml('profileHistoryContent', "<h2 style='color:#fff;'>" + t.admin.title + "</h2><div style='color:#8b949e; margin-bottom:15px;'>Loading...</div>");
    
    let res = await apiCall('getAllUsers');
    if(res && res.users && res.users.length > 0) {
        adminUsersList = res.users;
    } else {
        adminUsersList = [];
    }
    
    let uHtml = "<h2 style='color:#fff; margin-bottom:5px;'>" + t.admin.title + "</h2>";
    
    uHtml += "<div style='display:flex; gap:10px; margin-bottom:15px; width:100%; box-sizing:border-box;'>";
    uHtml += "<button class='btn btn-info' style='flex:1; background:#f06767; border-color:#f06767; font-size:13px; padding:10px;' onclick='resetAllLocalData()'>" + t.admin.resetData + "</button>";
    uHtml += "<button class='btn btn-info' style='flex:1; background:#f06767; border-color:#f06767; font-size:13px; padding:10px;' onclick='adminDeleteAllUsers()'>" + t.admin.deleteAll + "</button>";
    uHtml += "</div>";

    uHtml += "<p style='color:#8b949e; margin-top:0;'>" + t.admin.users + ": " + adminUsersList.length + "</p><div class='admin-grid' style='width:100%; box-sizing:border-box; display:flex; flex-direction:column; gap:10px;'>";
    
    adminUsersList.forEach(u => {
        let wId = u.worker_id || 'N/A';
        let tId = u.tg_id || '---';
        let fN = u.first_name || '';
        let lN = u.last_name || '';
        let displayName = (fN || lN) ? (fN + " " + lN).trim() : "Worker " + wId;

        uHtml += `
        <div class='admin-card' style='text-align:left; cursor:pointer; padding:15px;' onclick='toggleAdminUserCard(this)'>
            <div style='display:flex; justify-content:space-between; align-items:center;'>
                <b style='color:#fff;'>${displayName} (№ ${wId})</b>
                <span class='icon-arrow' style='font-size:12px; color:#8b949e;'>▼</span>
            </div>
            <div class='admin-user-details' style='display:none; margin-top:15px; font-size:14px; font-weight:normal; border-top:1px solid #343e50; padding-top:15px; cursor:default;' onclick='event.stopPropagation()'>
                <div style='margin-bottom:4px;'><span style='color:#8b949e;'>RCP N:</span> <span style='color:#fff;'>${wId}</span></div>
                <div style='margin-bottom:4px;'><span style='color:#8b949e;'>ID TG:</span> <span style='color:#fff;'>${tId}</span></div>
                <div style='margin-bottom:4px;'><span style='color:#8b949e;'>Имя:</span> <span style='color:#fff;'>${fN}</span></div>
                <div style='margin-bottom:10px;'><span style='color:#8b949e;'>Фамилия:</span> <span style='color:#fff;'>${lN}</span></div>
                <div style='display:flex; gap:10px;'>
                    <button class='btn btn-calc' style='flex:1; padding:8px;' onclick='viewUser("${wId}")'>Вход</button>
                    <button class='btn btn-info' style='flex:1; padding:8px; background:#f06767; border-color:#f06767;' onclick='adminDeleteUser("${wId}")'>${t.del || 'Удалить'}</button>
                </div>
            </div>
        </div>`;
    });
    uHtml += "</div>";
    sHtml('profileHistoryContent', uHtml);
}

function viewUser(wId) {
    viewingWorkerId = wId;
    apiCall('getData', { worker_id: wId }).then(res => {
        if(res && res.status === 'success') {
             if(res.history) savedHistory = res.history;
             if(res.rcpHistory) rcpHistory = res.rcpHistory;
             if(res.rcpState) rcpState = res.rcpState;
             if(res.first_name) dbFirstName = res.first_name; else dbFirstName = "";
             if(res.last_name) dbLastName = res.last_name; else dbLastName = "";
        } else {
             savedHistory = []; rcpHistory = []; rcpState = null;
        }
        sortSavedHistory();
        openProfile();
        filterHistory();
        renderRcpTab();
    });
}

function exitAdminView() {
    viewingWorkerId = null;
    loadAdminUsers();
}

window.openProfileSettings = function() {
    sVal('psWorkerInput', viewingWorkerId || currentWorkerId || "");
    sVal('psFirstNameInput', dbFirstName || "");
    sVal('psLastNameInput', dbLastName || "");
    openModal('profileSettingsModalOverlay');
};

window.saveProfileSettings = async function() {
    let pEl = document.getElementById('psWorkerInput');
    const newWorkerId = pEl ? pEl.value : "";
    
    let fEl = document.getElementById('psFirstNameInput');
    const newFName = fEl ? fEl.value : "";
    
    let lEl = document.getElementById('psLastNameInput');
    const newLName = lEl ? lEl.value : "";
    
    const t = tr[currentLang];

    if (!newWorkerId) {
        if(tgApp && tgApp.showAlert) tgApp.showAlert(t.dash.fillFields); else alert(t.dash.fillFields);
        return;
    }

    let bEl = document.getElementById('ps_btn_save');
    if(bEl) { bEl.disabled = true; bEl.textContent = "..."; }

    let targetId = viewingWorkerId || currentWorkerId; 

    let res = await apiCall('updateProfile', { 
        old_worker_id: targetId, 
        new_worker_id: newWorkerId,
        first_name: newFName,
        last_name: newLName
    });

    if(bEl) { bEl.disabled = false; bEl.textContent = t.saveModal.btnSave || "Сохранить"; }

    if (res && res.status === 'success') {
        if (!viewingWorkerId) {
            currentWorkerId = newWorkerId;
            try { localStorage.setItem('kkn_worker_id', newWorkerId); } catch(e) {}
        } else {
            viewingWorkerId = newWorkerId;
        }
        dbFirstName = newFName;
        dbLastName = newLName;
        
        closeModal('profileSettingsModalOverlay');
        updateHeader();
        openProfile();
    }
};

function openProfile() {
    const t = tr[currentLang];
    const container = document.getElementById('profileHistoryContent');
    if (!container) return;
    
    if (isAdmin && !viewingWorkerId) {
        loadAdminUsers();
        return;
    }
    
    const displayY = currentMainCalDate.getFullYear();
    const displayM = currentMainCalDate.getMonth();
    
    const monthRecords = [];
    const dayAverages = {}; 

    savedHistory.forEach(function(r) {
        if (r.dateStr) {
            let parts = r.dateStr.split('.');
            if (parts.length === 3) {
                let dY = parseInt(parts[2], 10);
                let dM = parseInt(parts[1], 10) - 1;
                let dD = parseInt(parts[0], 10);

                if (dM === displayM && dY === displayY) {
                    monthRecords.push(r);
                    if(!dayAverages[dD]) dayAverages[dD] = [];
                    dayAverages[dD].push(r.result);
                }
            }
        }
    });

    let monthAvg = 0;
    if (monthRecords.length > 0) {
        const sum = monthRecords.reduce(function(a, b) { return a + b.result; }, 0);
        monthAvg = Math.round(sum / monthRecords.length);
    }
    const mClr = getColorForPercent(monthAvg);
    const mOff = 440 - (440 * Math.min(monthAvg, 100)) / 100;
    let mZn = monthAvg < 65 ? t.zones.risk : monthAvg < 75 ? t.zones.orange : t.zones.green;
    let mMsg = monthAvg < 65 ? t.msgs.fail : monthAvg < 75 ? t.msgs.push : t.msgs.good;

    let rcpBlockHtml = "";
    if (rcpState && rcpState.dateStr === getTodayStr() && !rcpState.end) {
        let sSec = parseToSec(rcpState.start);
        let eSec = parseToSec(getNowTime());
        let diff = eSec >= sSec ? eSec - sSec : (86400 - sSec) + eSec;
        let todayHrs = Math.round(diff / 3600);

        rcpBlockHtml = 
        "<div class='dash-section-title' style='text-align:center; margin-bottom:10px; width: 100%; box-sizing:border-box;'>" + t.rcp.closeTitle + "</div>" +
        "<div class='chart-container' style='margin: 0 auto 10px; width: 220px; height: 220px;'>" +
            "<svg class='chart-svg' viewBox='0 0 200 200'><circle class='chart-bg' cx='100' cy='100' r='90' /><circle class='chart-fill' cx='100' cy='100' r='90' style='stroke:#58a6ff; stroke-dasharray:565; stroke-dashoffset:0;' /></svg>" +
            "<div class='chart-text' style='display:flex; flex-direction:column; align-items:center; width:100%;'>" +
                "<span style='font-size:12px; color:#8b949e;'>" + t.rcp.startedAt + " <b style='color:#58a6ff; font-size:14px;'>" + rcpState.start + "</b></span>" +
                "<b style='font-size:32px; color:#fff; margin:4px 0 10px;'>" + todayHrs + " " + t.workTime.h + "</b>" +
                "<button class='btn btn-calc' style='padding:6px 12px; font-size:14px; font-weight:bold; min-height:0; width:auto; border-radius:8px; background:#ff9800; border-color:#ff9800; color:#fff;' onclick='confirmRCPEnd()'>" + t.rcp.closeBtn + "</button>" +
            "</div>" +
        "</div>";
    } else if (rcpState && rcpState.dateStr === getTodayStr() && rcpState.end) {
        let sSec = parseToSec(rcpState.start);
        let eSec = parseToSec(rcpState.end);
        let diff = eSec >= sSec ? eSec - sSec : (86400 - sSec) + eSec;
        let todayHrs = Math.round(diff / 3600);

        rcpBlockHtml = 
        "<div class='chart-container' style='margin: 0 auto 10px; width: 220px; height: 220px;'>" +
            "<svg class='chart-svg' viewBox='0 0 200 200'><circle class='chart-bg' cx='100' cy='100' r='90' /><circle class='chart-fill' cx='100' cy='100' r='90' style='stroke:#3cd4a0; stroke-dasharray:565; stroke-dashoffset:0;' /></svg>" +
            "<div class='chart-text' style='display:flex; flex-direction:column; align-items:center; width:100%;'>" +
                "<span style='color:#3cd4a0; font-size:14px; font-weight:bold; text-align:center;'>" + t.rcp.closedToday + "</span>" +
                "<b style='font-size:32px; color:#fff; margin:6px 0;'>" + todayHrs + " " + t.workTime.h + "</b>" +
                "<span style='color:#3cd4a0; font-size:16px; font-weight:bold;'>" + rcpState.start + " - " + rcpState.end + "</span>" +
            "</div>" +
        "</div>";
    }

    const stats = getWorkHoursStats();
    let homeWhHtml = 
        "<div style='display:flex; justify-content:space-between; align-items:center; width: 100%; background: #232a3b; border: 1px solid #343e50; border-radius: 12px; padding: 15px; margin-bottom: 20px; box-sizing:border-box;'>" +
            "<div style='text-align:left;'><span style='color:#8b949e; font-size:13px;'>" + t.workTime.thisMonthDash + "</span><br><b style='color:#3cd4a0; font-size:18px;'>" + stats.thisMonth + " " + t.workTime.h + "</b></div>" +
            "<div style='text-align:right;'><span style='color:#8b949e; font-size:13px;'>" + t.workTime.lastMonth + "</span><br><b style='color:#fff; font-size:18px;'>" + stats.lastMonth + " " + t.workTime.h + "</b></div>" +
        "</div>";
        
    rcpBlockHtml += homeWhHtml; 

    const daysInMonth = new Date(displayY, displayM + 1, 0).getDate();
    let calHtml = 
        "<div style='display:flex; justify-content:space-between; align-items:center; width: 100%; background:#232a3b; padding:10px 15px; border-radius:12px; border:1px solid #343e50; margin-bottom:15px; box-sizing:border-box;'>" +
            "<button onclick='changeMainMonth(-1)' style='background:none; border:none; color:#58a6ff; font-size:22px; cursor:pointer;'>&#9664;</button>" +
            "<b style='font-size:16px; color:#fff;'>" + t.months[displayM] + " " + displayY + "</b>" +
            "<button onclick='changeMainMonth(1)' style='background:none; border:none; color:#58a6ff; font-size:22px; cursor:pointer;'>&#9654;</button>" +
        "</div>" +
        "<div class='dash-section-title' style='width:100%; box-sizing:border-box;'>" + t.dash.cal + " (" + (monthRecords.length > 0 ? '1 - ' + daysInMonth : t.dash.noData) + ")</div>" +
        "<div class='cal-grid'>" +
        "<div class='cal-header'>" + t.dash.days[0] + "</div><div class='cal-header'>" + t.dash.days[1] + "</div><div class='cal-header'>" + t.dash.days[2] + "</div><div class='cal-header'>" + t.dash.days[3] + "</div><div class='cal-header'>" + t.dash.days[4] + "</div><div class='cal-header'>" + t.dash.days[5] + "</div><div class='cal-header'>" + t.dash.days[6] + "</div>";
    
    let firstDay = new Date(displayY, displayM, 1).getDay();
    firstDay = firstDay === 0 ? 7 : firstDay; 
    for(let i=1; i<firstDay; i++) { calHtml += "<div></div>"; }

    let rcpMap = {};
    rcpHistory.forEach(r => rcpMap[r.dateStr] = r);
    if (rcpState && rcpState.dateStr) rcpMap[rcpState.dateStr] = rcpState;

    for(let i=1; i<=daysInMonth; i++) {
        let checkDate = new Date(displayY, displayM, i);
        let checkDateStr = checkDate.toLocaleDateString('ru-RU');
        let hasData = rcpMap[checkDateStr];
        let isToday = (checkDateStr === getTodayStr());

        let dayClass = 'cal-day';
        let dayStyle = '';
        
        if (hasData) {
            dayClass += ' active';
            dayStyle = 'background:#4e73df;';
        } else if (isToday) {
            dayClass += ' active';
            dayStyle = 'background:#343e50; border: 1px solid #4e73df;';
        }

        calHtml += `<div class='${dayClass}' style='${dayStyle}; cursor:${isAdmin ? "pointer" : "default"};' ${isAdmin ? `onclick='openRcpEdit("${checkDateStr}")'` : ''}>${i}</div>`;
    }
    calHtml += "</div>";

    let chartHtml = '';
    const activeDays = Object.keys(dayAverages).sort(function(a,b){return a-b});
    if (activeDays.length > 1) {
        let points = "";
        const width = 300; const height = 100;
        const xStep = width / (activeDays.length - 1);
        activeDays.forEach(function(day, index) {
            let val = Math.round(dayAverages[day].reduce(function(a,b){return a+b},0)/dayAverages[day].length);
            if (val > 100) val = 100;
            let x = index * xStep;
            let y = height - ((val / 100) * height);
            points += x + "," + y + " ";
        });
        chartHtml = 
        "<div class='dash-section-title' style='margin-top:20px; width:100%; box-sizing:border-box;'>" + t.dash.dyn + "</div>" +
        "<div class='chart-box'>" +
            "<svg viewBox='0 -10 300 120' class='line-chart-svg'>" +
                "<line x1='0' y1='0' x2='300' y2='0' class='chart-grid-line'/>" +
                "<line x1='0' y1='50' x2='300' y2='50' class='chart-grid-line'/>" +
                "<line x1='0' y1='100' x2='300' y2='100' class='chart-grid-line'/>" +
                "<polyline points='" + points.trim() + "' class='line-path' />" +
            "</svg>" +
            "<div class='chart-labels'><span>" + activeDays[0] + " " + t.dash.date + "</span><span>" + activeDays[activeDays.length-1] + " " + t.dash.date + "</span></div>" +
        "</div>";
    }

    let topBtns = "<div style='display:flex; gap:10px; margin-bottom:15px; width: 100%; box-sizing: border-box;'>";
    if (isAdmin && viewingWorkerId) {
        topBtns += "<button class='btn btn-info' style='flex:1; font-size:14px; padding:10px;' onclick='exitAdminView()'>" + t.admin.back + "</button>";
        topBtns += "<button class='btn btn-info' style='flex:1; font-size:14px; padding:10px; border-color:#58a6ff; color:#58a6ff;' onclick='openProfileSettings()'>" + t.profSet.title + "</button>";
    } else {
        topBtns += "<button class='btn btn-info' style='width:100%; font-size:14px; padding:10px; border-color:#58a6ff; color:#58a6ff;' onclick='openProfileSettings()'>" + t.profSet.title + "</button>";
    }
    topBtns += "</div>";

    container.innerHTML = 
        "<div class='profile-dashboard'>" +
            topBtns +
            rcpBlockHtml +
            calHtml +
            "<div style='background:#232a3b; border-radius:12px; padding:20px; border:1px solid #343e50; text-align:center; margin-bottom: 20px; margin-top: 15px; width: 100%; box-sizing: border-box;'>" +
                "<div class='chart-container' style='margin: 0 auto 10px;'>" +
                    "<svg class='chart-svg' viewBox='0 0 160 160'><circle class='chart-bg' cx='80' cy='80' r='70' /><circle class='chart-fill' cx='80' cy='80' r='70' style='stroke:" + mClr + "; stroke-dasharray:440; stroke-dashoffset:" + (monthAvg === 0 ? 440 : mOff) + ";' /></svg>" +
                    "<div class='chart-text'><span class='chart-percent' style='color:" + mClr + "'>" + monthAvg + "%</span><span class='chart-label'>" + t.dash.title + "</span></div>" +
                "</div>" +
                "<div style='background: rgba(0,0,0,0.2); padding:10px; border-radius:8px; margin-top:10px;'>" +
                    "<span style='color:#8b949e; font-size:14px;'>" + t.dash.zonePrefix + "</span><br>" +
                    "<b style='color:#fff; font-size:16px;'>" + mZn + "</b><br>" +
                    "<b style='color:" + mClr + "; font-size:14px;'>" + mMsg + "</b>" +
                "</div>" +
            "</div>" +
            chartHtml +
        "</div>";
}

function sendHelp() {
    let tEl = document.getElementById('helpTextInput');
    let text = tEl ? tEl.value : "";
    if(!text.trim()) return;
    const t = tr[currentLang];
    
    apiCall('sendHelp', { message: text });
    
    if(tgApp && tgApp.showAlert) tgApp.showAlert(t.helpSent); else alert(t.helpSent);
    if(tEl) tEl.value = '';
    closeModal('helpModalOverlay');
}

function sVal(id, val) { let el = document.getElementById(id); if (el && val !== undefined) el.value = val; }

function setLang(lang) {
  currentLang = lang;
  const t = tr[lang] || tr['Eng'];
  
  sText('l_qty', t.labels.qty);
  sText('l_tpi', t.labels.tpi);
  sText('l_prep', t.labels.prep);
  sText('l_prepSub', t.labels.prepSub);
  sText('l_start', t.labels.start);
  sText('l_end', t.labels.end);
  sText('b_calc', t.btns.calc);
  sText('p_cancel', t.btns.cancel);
  sText('p_done', t.btns.done);
  sText('p_title', t.btns.pick);
  
  sText('rcp_title', t.rcp.title);
  sText('rcp_desc', t.rcp.desc);
  sText('rcp_btn_start', t.rcp.startBtn);

  sText('a_title', t.auth.title);
  sText('a_desc', t.auth.desc);
  sText('a_btn', t.auth.btn);

  sText('s_title', t.saveModal.title);
  sText('s_pro', 'PRO (' + t.proLabel + ')');
  sText('rcp_lbl_worker', t.rcpWorkerNum);
  sPlace('authWorkerInput', "12345");
  sText('btn_help', t.helpBtn);
  sText('h_title', t.helpTitle);
  sPlace('helpTextInput', t.helpPlaceholder);
  sText('h_btn_send', t.helpSend);
  sText('h_btn_cancel', t.saveModal.btnCancel);
  
  sText('ps_title', t.profSet.title);
  sText('ps_l_worker', t.profSet.worker);
  sText('ps_l_fname', t.profSet.fname);
  sText('ps_l_lname', t.profSet.lname);
  sText('ps_btn_save', t.saveModal.btnSave);
  sText('ps_btn_cancel', t.saveModal.btnCancel);

  sText('s_qty_lbl', t.labels.qty);
  sText('s_start_lbl', t.labels.start);
  sText('s_end_lbl', t.labels.end);
  sText('s_prep_lbl', t.labels.prep);
  sText('s_stan', t.saveModal.stan);
  sText('s_uwagi', t.workTime.uwagi);
  sText('s_btn_save', t.saveModal.btnSave);
  sText('s_btn_cancel', t.saveModal.btnCancel);
  sText('s_date', t.saveModal.date || 'Дата');

  sText('i_title_info', t.btns.info);
  sText('t_hist_title', t.dash.hist);
  sText('b_search', t.btns.search);

  sText('re_title', t.editRcp);
  sText('re_l_start', t.reStart);
  sText('re_l_end', t.reEnd);
  sText('re_btn_del', t.del);
  sText('re_btn_save', t.saveModal.btnSave);
  sText('re_btn_cancel', t.saveModal.btnCancel);
  
  sText('t_rcp_title', t.rcpTabTitle);

  sPlace('proSearchInput', t.workTime.search);

  updatePrepStatus();

  let htmlNorm = '';
  t.instrNorm.forEach(function(item) { 
      htmlNorm += "<div style='background:#232a3b; border-radius:8px; margin-bottom:8px; border:1px solid #343e50; box-sizing: border-box; width: 100%;'><div style='padding:16px; display:flex; justify-content:space-between; cursor:pointer; color:#58a6ff; font-size:17px;' onclick='toggleAccordion(this)'>" + item.t + " <span>▼</span></div><div class='instr-white' style='padding:0 16px 16px; display:none;'>" + item.c + "</div></div>"; 
  });
  sHtml('instructionContentNorm', htmlNorm);

  // Только если result существует и не пустой, делаем калькуляцию
  let rEl = document.getElementById('result');
  if(rEl && rEl.innerHTML !== "") calculate();

  if (currentWorkerId || viewingWorkerId) {
      updateHeader();
      openProfile();
      filterHistory();
      renderRcpTab();
  }
}

let isPrepActive = false, activeField = null, shortFormat = false;
function initWheel(id, max) {
  const w = document.getElementById(id); 
  if(!w) return;
  w.innerHTML = '<div class="spacer"></div>';
  for (let i=0; i<=max; i++) { 
      let d = document.createElement('div'); 
      d.textContent = (i < 10 ? "0" : "") + i; 
      w.appendChild(d); 
  }
  w.innerHTML += '<div class="spacer"></div>';
  w.onscroll = function() { 
      let idx = Math.round(w.scrollTop/40); 
      w.querySelectorAll('div:not(.spacer)').forEach(function(item, i) {
          if(i === idx) item.classList.add('selected');
          else item.classList.remove('selected');
      }); 
  };
}

// Отложенная инициализация колёсиков
document.addEventListener('DOMContentLoaded', function() {
    initWheel('hWheel', 23); initWheel('mWheel', 59); initWheel('sWheel', 59);
    
    let tgLang = 'en';
    if (tgApp && tgApp.initDataUnsafe && tgApp.initDataUnsafe.user && tgApp.initDataUnsafe.user.language_code) {
        tgLang = tgApp.initDataUnsafe.user.language_code.toLowerCase().substring(0, 2);
    }
    
    const langMap = { 'ru': 'Pyc', 'en': 'Eng', 'pl': 'Pol', 'es': 'Esp', 'uk': 'Ukr' };
    
    setLang(langMap[tgLang] || 'Eng');
    checkAuth();
});

function openPicker(id, isShort) { 
    activeField = id; 
    shortFormat = isShort || false; 
    let sw = document.getElementById('sWheel');
    if(sw) sw.style.display = shortFormat ? 'none' : 'block'; 
    let po = document.getElementById('pickerOverlay');
    if(po) po.style.display = 'flex'; 
}
function closePicker() { 
    let po = document.getElementById('pickerOverlay');
    if(po) po.style.display = 'none'; 
}
function confirmPicker() {
  const hEl = document.querySelector('#hWheel .selected');
  const mEl = document.querySelector('#mWheel .selected');
  const sEl = document.querySelector('#sWheel .selected');
  const h = hEl ? hEl.textContent : "00";
  const m = mEl ? mEl.textContent : "00";
  const s = sEl ? sEl.textContent : "00";
  sText(activeField, shortFormat ? (h + ":" + m) : (h + ":" + m + ":" + s)); 
  closePicker();
}
function togglePrep() { isPrepActive = !isPrepActive; updatePrepStatus(); }
function updatePrepStatus() {
  const t = tr[currentLang];
  let rDot = document.getElementById('radioDot');
  if(rDot) rDot.style.display = isPrepActive ? 'block' : 'none';
  let pTog = document.getElementById('prepToggle');
  if(pTog) {
      if(isPrepActive) pTog.classList.add('active');
      else pTog.classList.remove('active');
  }
  let sLbl = document.getElementById('statusLabel');
  if(sLbl) {
      sLbl.textContent = isPrepActive ? t.labels.active : t.labels.inactive;
      sLbl.style.color = isPrepActive ? '#3cd4a0' : '#8b949e';
  }
}
function parseToSec(str) { 
    if(!str) return 0;
    let p = str.split(':').map(Number); 
    return p.length === 3 ? p[0]*3600 + p[1]*60 + p[2] : p[0]*3600 + p[1]*60; 
}
function formatTime(s) { 
    let h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = Math.round(s%60); 
    return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (sec < 10 ? "0" : "") + sec; 
}

function calculate() {
  let qEl = document.getElementById('quantity');
  const q = qEl ? (parseFloat(qEl.value) || 0) : 0; 
  if (!q) return;
  
  const t = tr[currentLang];
  let tpiEl = document.getElementById('timePerItem');
  const tpi = tpiEl ? parseToSec(tpiEl.textContent) : 0;
  
  const prep = isPrepActive ? 900 : 0;
  const norm = (q * tpi) + prep;
  
  let stEl = document.getElementById('startTime');
  const startStr = stEl ? stEl.textContent : "00:00";
  const start = parseToSec(startStr);
  const plan = formatTime((start + norm) % 86400);
  
  let endEl = document.getElementById('endTime');
  const endStr = endEl ? endEl.textContent : "00:00:00";
  
  let eff = 0, spent = "--:--:--", spentPer = "--:--:--", neededQty = 0;
  
  if (endStr !== "00:00:00") { 
    let FactS = parseToSec(endStr), FactT = FactS >= start ? FactS - start : (86400 - start) + FactS; 
    eff = Math.round((norm / FactT) * 100); 
    spent = formatTime(FactT); 
    spentPer = formatTime((FactT - prep) / q); 
    neededQty = tpi > 0 ? Math.floor(Math.max(0, FactT - prep) / tpi) : 0;
    
    pendingSaveData = { type: 'norm', result: eff, qty: q, start: startStr, end: endStr, prep: isPrepActive, tpi: tpi };
  }

  let qph = tpi > 0 ? 3600 / tpi : 0, maxQph = Math.floor(qph);
  let clr = "#8b949e", zn = "---", msg = "", alrt = "";
  if (eff > 0) {
    if (eff < 65) { clr="#f06767"; zn=t.zones.risk; msg=t.msgs.fail; alrt="alert-red"; }
    else if (eff < 75) { clr="#ff9800"; zn=t.zones.orange; msg=t.msgs.push; alrt="alert-orange"; }
    else if (eff <= 100) { clr="#3cd4a0"; zn=t.zones.green; msg=t.msgs.good; alrt="alert-green"; }
    else { clr="#f06767"; zn=t.zones.over; msg=t.msgs.over; alrt="alert-red"; }
  }
  const off = 440 - (440 * Math.min(eff, 100)) / 100;
  
  let html = "<div class='history-card'><div class='chart-container'><svg class='chart-svg' viewBox='0 0 160 160'><circle class='chart-bg' cx='80' cy='80' r='70' /><circle class='chart-fill' cx='80' cy='80' r='70' style='stroke:" + clr + "; stroke-dasharray:440; stroke-dashoffset:" + off + ";' /></svg><div class='chart-text'><span class='chart-percent' style='color:" + clr + "'>" + eff + "%</span><span class='chart-label'>" + t.stats.success + "</span></div></div><div class='status-alert " + alrt + "'>" + t.stats.zone + " <b>" + zn + "</b><br>" + msg + "</div><div class='legend'><div class='legend-item'><div class='legend-dot' style='background:#f06767'></div>" + t.legend[0] + "</div><div class='legend-item'><div class='legend-dot' style='background:#ff9800'></div>" + t.legend[1] + "</div><div class='legend-item'><div class='legend-dot' style='background:#3cd4a0'></div>" + t.legend[2] + "</div></div><div class='stat-list'><div class='stat-item'><div class='item-label'><div class='dot' style='background:#3cd4a0'></div>" + t.stats.plan + "</div><b>" + plan + "</b></div><div class='stat-item'><div class='item-label'><div class='dot' style='background:#f06767'></div>" + t.stats.norm + "</div><b>" + formatTime(norm) + "</b></div><div class='stat-item'><div class='item-label'><div class='dot' style='background:#9c27b0'></div>" + t.stats.qtyPerHour + "</div><b>" + maxQph + " " + (t.dash.pcs||"шт.") + "</b></div><div class='stat-item'><div class='item-label'><div class='dot' style='background:#ffeb3b'></div>" + t.stats.forThisTime + "</div><b>" + neededQty + " " + (t.dash.pcs||"шт.") + "</b></div><div class='stat-item'><div class='item-label'><div class='dot' style='background:#00bcd4'></div>" + t.stats.spent1 + "</div><b>" + spentPer + "</b></div><div class='stat-item'><div class='item-label'><div class='dot' style='background:#4e73df'></div>" + t.stats.spentNorm + "</div><b>" + spent + "</b></div><div class='stat-item'><div class='item-label'><div class='dot' style='background:#ff9800'></div>" + t.stats.fact + "</div><b>" + endStr + "</b></div></div>";
  
  if (endStr !== "00:00:00") {
     html += "<button class='btn btn-save-res' onclick='openSaveModal(false, -1)'>" + t.btns.saveRes + "</button>";
  }
  html += "</div>";
  
  sHtml('result', html);
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function openModal(modalId) { let el = document.getElementById(modalId); if(el) el.style.display = 'flex'; }
function closeModal(modalId) { let el = document.getElementById(modalId); if(el) el.style.display = 'none'; }
function toggleAccordion(el) { let c = el.nextElementSibling; if(c) c.style.display = (c.style.display === 'none' ? 'block' : 'none'); }