// === НАСТРОЙКИ SUPABASE ===
const SUPABASE_URL = 'https://apnmlbvefruhagufmpfc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QE6JAl1XxmOR_0cjGXEJ3g_GvOII0fY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const ADMIN_ID = '8543137368';

// === СЛОВАРЬ ПЕРЕВОДОВ ===
const tr = {
  'Pyc': {
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    labels: { qty:'Количество штук', tpi:'Время на 1 штуку', prep:'Подготовка', prepSub:'15 минут к норме', start:'Начало', end:'Окончание', active:'АКТИВНО', inactive:'НЕ АКТИВНО' },
    btns: { calc:'Рассчитать', info:'Инструкция', cancel:'Отмена', done:'Готово', pick:'Время', saveRes:'Сохранить результат', search:'Поиск', skip:'Пропустить' },
    stats: { success:'Успеваемость', zone:'Вы сейчас находитесь в зоне:', plan:'План окончания:', norm:'Норма на всё:', spent1:'Затрачено на 1 шт:', spentNorm:'Время затрачено:', fact:'Факт. окончание:', qtyPerHour:'Кол. в час:', forThisTime:'За это время:' },
    legend: ['Риск', 'Не плохо', 'Норма'], zones: { risk: 'Красная зона риска', orange: 'Оранжевая зона', green: 'Зелёная зона', over: 'Красная зона' },
    msgs: { fail: 'ВЫ НЕ СПРАВЛЯЕТЕСЬ!', push: 'ПОДНАЖМИТЕ!', good: 'Хороший темп ТАК ДЕРЖАТЬ!', over: 'ВЫ ПРЕВЫШАЕТЕ НОРМУ!' },
    instrNorm: [
      {t: 'Вкладки приложения', c: 'Приложение состоит из 5 вкладок: Главная, История, Калькулятор, Рабочее время (RCP) и Инструкция.'},
      {t: 'Главная страница', c: 'Здесь отображается ваш текущий статус RCP, календарь со средним процентом успеваемости за дни, статистика за месяц и график успеваемости.'},
      {t: 'История работы', c: 'Список всех ваших сохраненных расчетов. Вы можете искать по PRO, редактировать и удалять записи.'},
      {t: 'Калькулятор', c: 'Введите количество штук, время на 1 штуку, время начала и окончания. Нажмите "Рассчитать", чтобы увидеть процент.'},
      {t: 'Рабочее время (RCP)', c: 'Ваш табель рабочего времени. При входе открывается смена, где нужно указать рабочий номер.'}
    ],
    saveModal: { title: 'Сохранение результата', pro: 'PRO', stan: 'Номер Stanowiska', type: 'Вид работы', btnSave: 'Сохранить', btnCancel: 'Отмена', date: 'Дата' },
    workTime: { thisMonth: 'Ваши рабочие часы: ', thisMonthDash: 'За этот месяц:', lastMonth: 'В прошлом месяце:', h: 'ч.', search: 'Поиск по PRO', uwagi: 'Uwagi (заметки)' },
    rcp: { title: 'Регистрация RCP', desc: 'Укажите время начала работы', startBtn: 'Подтвердить', closeTitle: 'Закрыть рабочее время', startedAt: 'Начато в:', closeBtn: 'Завершить', closedToday: 'За сегодня.' },
    dash: { empty: 'Истории сохранений пока нет.', title: 'УСПЕВАЕМОСТЬ', zonePrefix: 'Вы сейчас находитесь в зоне:', cal: 'Календарь', noData: 'Нет данных', dyn: 'Динамика успеваемости', hist: 'История нормы', days: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'], date: 'число', lblDate: 'Дата:', lblStart: 'Время начала', lblEnd: 'Время окончания', lblAvg: 'Среднее по %', types: { t1: 'Сварка ручная', t2: 'Сварка на обротнице', t3: 'Поправка' }, saved: 'Успешно сохранено!', confirmDel: 'Удалить эту запись?', matches: 'Найдено совпадений', pcs: 'шт.', settings: 'Настройки профиля', yes: 'Да', no: 'Нет', stanLabel: 'Рабочее место', fillFields: 'Заполните поля!' },
    rcpTabTitle: 'Рабочее время (RCP)', editRcp: 'Редактирование RCP', reStart: 'Время начала', reEnd: 'Время окончания', del: 'Удалить',
    proLabel: 'цифры и -', rcpWorkerNum: 'Рабочий номер', helpBtn: 'Помощь', helpTitle: 'Помощь', helpPlaceholder: 'Опишите проблему...', helpSend: 'Отправить', helpSent: 'Сообщение отправлено!',
    auth: { title: 'Авторизация', desc: 'Введите ваш рабочий номер', btn: 'Войти', confirmWorker: 'Подтвердите правильность ввода: ' },
    admin: { title: 'Панель Администратора', back: 'Выйти из профиля', users: 'Пользователи', resetData: 'Сбросить данные', resetConfirm: 'Удалить ВСЕ локальные данные?', resetSuccess: 'Данные сброшены!', deleteAll: 'Удалить всех', deleteUser: 'Удалить', deleteConfirm: 'Вы уверены, что хотите удалить эти данные?' },
    profSet: { title: 'Настройки профиля', worker: 'Рабочий номер', fname: 'Имя', lname: 'Фамилия' }
  },
  'Eng': { months: ['January','February','March','April','May','June','July','August','September','October','November','December'], labels: { qty:'Quantity', tpi:'Time per item', prep:'Preparation', prepSub:'15 min to norm', start:'Start', end:'End', active:'ACTIVE', inactive:'INACTIVE' }, btns: { calc:'Calculate', info:'Instruction', cancel:'Cancel', done:'Done', pick:'Time', saveRes:'Save Result', search:'Search', skip:'Skip' }, stats: { success:'Efficiency', zone:'Zone:', plan:'Plan:', norm:'Norm:', spent1:'Spent per 1:', spentNorm:'Spent:', fact:'Fact:', qtyPerHour:'Qty/h:', forThisTime:'For this time:' }, legend: ['Risk','Not bad','Normal'], zones: { risk:'Red Zone', orange:'Orange Zone', green:'Green Zone', over:'Over' }, msgs: { fail:'FAIL!', push:'PUSH!', good:'GOOD!', over:'OVER!' }, instrNorm: [], saveModal: { title:'Save Result', pro:'PRO', stan:'Workplace Number', type:'Type of work', btnSave:'Save', btnCancel:'Cancel', date:'Date' }, workTime: { thisMonth:'Your work hours:', thisMonthDash:'For this month:', lastMonth:'Last month:', h:'h.', search:'Search PRO', uwagi:'Notes' }, rcp: { title:'RCP Registration', desc:'Specify work start time', startBtn:'Confirm', closeTitle:'Close work time', startedAt:'Started at:', closeBtn:'End', closedToday:'For today.' }, dash: { empty:'No history yet.', title:'EFFICIENCY', zonePrefix:'Current zone:', cal:'Calendar', noData:'No Data', dyn:'Performance Dynamics', hist:'Norm History', days:['Mo','Tu','We','Th','Fr','Sa','Su'], date:'date', lblDate:'Date:', lblStart:'Start time', lblEnd:'End time', lblAvg:'Average %', types:{ t1:'Manual welding', t2:'Rotary welding', t3:'Correction' }, saved:'Saved successfully!', confirmDel:'Delete this record?', matches:'Matches found', pcs:'pcs.', settings:'Profile Settings', yes:'Yes', no:'No', stanLabel:'Workplace', fillFields:'Fill in all fields!' }, rcpTabTitle:'Work Time (RCP)', editRcp:'Edit RCP', reStart:'Start time', reEnd:'End time', del:'Delete', proLabel:'numbers and -', rcpWorkerNum:'Work number', helpBtn:'Help', helpTitle:'Help Form', helpPlaceholder:'Describe your problem...', helpSend:'Send', helpSent:'Message sent!', auth: { title:'Authorization', desc:'Enter your work number', btn:'Login', confirmWorker:'Confirm the entered work number: ' }, admin: { title:'Admin Panel', back:'Exit profile', users:'Users', resetData:'Reset data', resetConfirm:'Delete ALL local data?', resetSuccess:'Data reset!', deleteAll:'Delete all', deleteUser:'Delete', deleteConfirm:'Are you sure?' }, profSet: { title:'Profile Settings', worker:'Work Number', fname:'First Name', lname:'Last Name' } },
  'Pol': { months: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec','Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'], labels: { qty:'Ilość sztuk', tpi:'Czas na 1 szt', prep:'Przygotowanie', prepSub:'15 min', start:'Początek', end:'Koniec', active:'AKTYWNE', inactive:'NIE AKTYWNE' }, btns: { calc:'Oblicz', info:'Instrukcja', cancel:'Anuluj', done:'Gotowe', pick:'Czas', saveRes:'Zapisz wynik', search:'Szukaj', skip:'Pomiń' }, stats: { success:'Wydajność', zone:'Strefa:', plan:'Plan:', norm:'Norma:', spent1:'Czas/szt:', spentNorm:'Czas zużyty:', fact:'Fakt:', qtyPerHour:'Il/godz:', forThisTime:'W tym czasie:' }, legend: ['Ryzyko','Nieźle','Norma'], zones: { risk:'Ryzyko', orange:'Pomarańczowa', green:'Zielona', over:'Nadmiar' }, msgs: { fail:'ŹLE!', push:'SZYBCIEJ!', good:'DOBRZE!', over:'ZA DUŻO!' }, instrNorm: [], saveModal: { title:'Zapisz wynik', pro:'PRO', stan:'Numer Stanowiska', type:'Rodzaj pracy', btnSave:'Zapisz', btnCancel:'Anuluj', date:'Data' }, workTime: { thisMonth:'Twoje godziny pracy:', thisMonthDash:'W tym miesiącu:', lastMonth:'W zeszłym miesiącu:', h:'godz.', search:'Szukaj PRO', uwagi:'Uwagi' }, rcp: { title:'Rejestracja RCP', desc:'Podaj czas rozpoczęcia pracy', startBtn:'Zatwierdź', closeTitle:'Zamknij czas pracy', startedAt:'Rozpoczęto o:', closeBtn:'Zakończ', closedToday:'Za dzisiaj.' }, dash: { empty:'Brak historii.', title:'WYDAJNOŚĆ', zonePrefix:'Obecna strefa:', cal:'Kalendarz', noData:'Brak danych', dyn:'Dynamika wydajności', hist:'Historia Normy', days:['Pn','Wt','Śr','Cz','Pt','Sb','Nd'], date:'dzień', lblDate:'Data:', lblStart:'Czas rozpoczęcia', lblEnd:'Czas zakończenia', lblAvg:'Średnia %', types:{ t1:'Spawanie ręczne', t2:'Spawanie na obrotnicę', t3:'Poprawka' }, saved:'Zapisano!', confirmDel:'Usunąć ten wpis?', matches:'Znaleziono dopasowań', pcs:'szt.', settings:'Ustawienia profilu', yes:'Tak', no:'Nie', stanLabel:'Stanowisko', fillFields:'Wypełnij pola!' }, rcpTabTitle:'Czas pracy (RCP)', editRcp:'Edycja RCP', reStart:'Czas rozpoczęcia', reEnd:'Czas zakończenia', del:'Usuń', proLabel:'cyfry i -', rcpWorkerNum:'Numer roboczy', helpBtn:'Pomoc', helpTitle:'Formularz Pomocy', helpPlaceholder:'Opisz swój problem...', helpSend:'Wyślij', helpSent:'Wiadomość wysłana!', auth: { title:'Autoryzacja', desc:'Wpisz numer roboczy', btn:'Zaloguj się', confirmWorker:'Potwierdź wprowadzony numer roboczy: ' }, admin: { title:'Panel administratora', back:'Wyjdź z profilu', users:'Użytkownicy', resetData:'Zresetuj dane', resetConfirm:'Usunąć WSZYSTKIE dane lokalne?', resetSuccess:'Dane zresetowane!', deleteAll:'Usuń wszystkich', deleteUser:'Usuń', deleteConfirm:'Na pewno usunąć?' }, profSet: { title:'Ustawienia profilu', worker:'Numer roboczy', fname:'Imię', lname:'Nazwisko' } },
  'Esp': { months: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'], labels: { qty:'Cantidad', tpi:'Tiempo/pza', prep:'Preparación', prepSub:'15 min', start:'Inicio', end:'Fin', active:'ACTIVO', inactive:'INACTIVO' }, btns: { calc:'Calcular', info:'Info', cancel:'Cancelar', done:'Hecho', pick:'Tiempo', saveRes:'Guardar result', search:'Buscar', skip:'Omitir' }, stats: { success:'Eficiencia', zone:'Zona:', plan:'Plan:', norm:'Norma:', spent1:'Gasto/pza:', spentNorm:'Tiempo:', fact:'Fin real:', qtyPerHour:'Cant/h:', forThisTime:'En este tiempo:' }, legend: ['Riesgo','Regular','Normal'], zones: { risk:'Riesgo', orange:'Naranja', green:'Verde', over:'Exceso' }, msgs: { fail:'MAL!', push:'MAS RAPIDO!', good:'BIEN!', over:'EXCESO!' }, instrNorm: [], saveModal: { title:'Guardar Resultado', pro:'PRO', stan:'Número de Puesto', type:'Tipo de trabajo', btnSave:'Guardar', btnCancel:'Cancelar', date:'Fecha' }, workTime: { thisMonth:'Tus horas de trabajo:', thisMonthDash:'Para este mes:', lastMonth:'El mes pasado:', h:'h.', search:'Buscar PRO', uwagi:'Notas' }, rcp: { title:'Registro RCP', desc:'Indique hora de inicio', startBtn:'Confirmar', closeTitle:'Cerrar tiempo', startedAt:'Iniciado a las:', closeBtn:'Terminar', closedToday:'Por hoy.' }, dash: { empty:'Aún no hay historia.', title:'EFICIENCIA', zonePrefix:'Zona actual:', cal:'Calendario', noData:'Sin datos', dyn:'Dinámica de rendimiento', hist:'Historia de Norma', days:['Lu','Ma','Mi','Ju','Vi','Sa','Do'], date:'día', lblDate:'Fecha:', lblStart:'Hora de inicio', lblEnd:'Hora de fin', lblAvg:'Promedio %', types:{ t1:'Soldadura manual', t2:'Soldadura rotativa', t3:'Corrección' }, saved:'Guardado con éxito!', confirmDel:'¿Borrar este registro?', matches:'Coincidencias', pcs:'pzas.', settings:'Configuración de perfil', yes:'Sí', no:'No', stanLabel:'Puesto', fillFields:'¡Rellena los campos!' }, rcpTabTitle:'Tiempo de trabajo (RCP)', editRcp:'Editar RCP', reStart:'Hora de inicio', reEnd:'Hora de fin', del:'Eliminar', proLabel:'números y -', rcpWorkerNum:'Número de trabajo', helpBtn:'Ayuda', helpTitle:'Formulario de Ayuda', helpPlaceholder:'Describe tu problema...', helpSend:'Enviar', helpSent:'¡Mensaje enviado!', auth: { title:'Autorización', desc:'Ingrese su número de trabajo', btn:'Iniciar sesión', confirmWorker:'Confirme el número: ' }, admin: { title:'Panel de administrador', back:'Salir', users:'Usuarios', resetData:'Restablecer datos', resetConfirm:'¿Eliminar TODOS los datos locales?', resetSuccess:'¡Datos restablecidos!', deleteAll:'Eliminar todos', deleteUser:'Eliminar', deleteConfirm:'¿Estás seguro?' }, profSet: { title:'Configuración del perfil', worker:'Número de trabajo', fname:'Nombre', lname:'Apellido' } },
  'Ukr': { months: ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'], labels: { qty:'Кількість', tpi:'Час на 1 шт', prep:'Підготовка', prepSub:'15 хв', start:'Початок', end:'Закінчення', active:'АКТИВНО', inactive:'НЕ АКТИВНО' }, btns: { calc:'Розрахувати', info:'Інфо', cancel:'Відміна', done:'Готово', pick:'Час', saveRes:'Зберегти результат', search:'Пошук', skip:'Пропустити' }, stats: { success:'Успішність', zone:'Зона:', plan:'План:', norm:'Норма:', spent1:'Час на 1 шт:', spentNorm:'Витрачено:', fact:'Факт:', qtyPerHour:'Кільк/год:', forThisTime:'За цей час:' }, legend: ['Ризик','Не погано','Норма'], zones: { risk:'Ризик', orange:'Помаранчева', green:'Зелена', over:'Перебір' }, msgs: { fail:'ПОГАНО!', push:'ШВИДШЕ!', good:'ДОБРЕ!', over:'ПЕРЕБІР!' }, instrNorm: [], saveModal: { title:'Збереження результату', pro:'PRO', stan:'Номер Stanowiska', type:'Вид роботи', btnSave:'Зберегти', btnCancel:'Відміна', date:'Дата' }, workTime: { thisMonth:'Ваші робочі години:', thisMonthDash:'За цей місяць:', lastMonth:'Минулого місяця:', h:'год.', search:'Пошук по PRO', uwagi:'Uwagi (нотатки)' }, rcp: { title:'Реєстрація RCP', desc:'Вкажіть час початку роботи', startBtn:'Підтвердити', closeTitle:'Закрити робочий час', startedAt:'Розпочато о:', closeBtn:'Завершити', closedToday:'За сьогодні.' }, dash: { empty:'Історії поки немає.', title:'УСПІШНІСТЬ', zonePrefix:'Ви зараз у зоні:', cal:'Календар', noData:'Немає даних', dyn:'Динаміка успішності', hist:'Історія норми', days:['Пн','Вт','Ср','Чт','Пт','Сб','Нд'], date:'число', lblDate:'Дата:', lblStart:'Час початку', lblEnd:'Час закінчення', lblAvg:'Середнє по %', types:{ t1:'Зварювання ручне', t2:'Зварювання на обертачі', t3:'Поправка' }, saved:'Успішно збережено!', confirmDel:'Видалити цей запис?', matches:'Знайдено збігів', pcs:'шт.', settings:'Налаштування профілю', yes:'Так', no:'Ні', stanLabel:'Робоче місце', fillFields:'Заповніть поля!' }, rcpTabTitle:'Робочий час (RCP)', editRcp:'Редагування RCP', reStart:'Час початку', reEnd:'Час закінчення', del:'Видалити', proLabel:'цифри та -', rcpWorkerNum:'Робочий номер', helpBtn:'Допомога', helpTitle:'Допомога', helpPlaceholder:'Опишіть проблему...', helpSend:'Відправити', helpSent:'Повідомлення надіслано!', auth: { title:'Авторизація', desc:'Введіть робочий номер', btn:'Увійти', confirmWorker:'Підтвердіть робочий номер: ' }, admin: { title:'Панель Адміністратора', back:'Вийти з профілю', users:'Користувачі', resetData:'Скинути дані', resetConfirm:'Видалити ВСІ локальні дані?', resetSuccess:'Дані скинуто!', deleteAll:'Видалити всіх', deleteUser:'Видалити', deleteConfirm:'Ви впевнені?' }, profSet: { title:'Налаштування профілю', worker:'Робочий номер', fname:'Ім\'я', lname:'Прізвище' } }
};

// === БАЗОВЫЕ ПЕРЕМЕННЫЕ ===
var tgApp = window.Telegram ? window.Telegram.WebApp : null;
var isCloudStorageSupported = tgApp && tgApp.isVersionAtLeast && tgApp.isVersionAtLeast('6.9');
var isAdmin = false;
var viewingWorkerId = null;
var currentWorkerId = localStorage.getItem('kkn_worker_id') || null;
var adminUsersList = [];
var dbFirstName = "";
var dbLastName = "";

if (tgApp && tgApp.initDataUnsafe && tgApp.initDataUnsafe.user) {
  if (tgApp.initDataUnsafe.user.id.toString() === ADMIN_ID) isAdmin = true;
} else {
  if (window.location.search.includes('admin=true')) isAdmin = true;
}

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
  let el = document.getElementById('profileName');
  if (el) el.textContent = nameToDisplay;
}

// === API SUPABASE ===
async function apiCall(action, payload = {}) {
  const uid = tgApp?.initDataUnsafe?.user?.id || 'local';
  const wid = viewingWorkerId || currentWorkerId || 'unknown';
  try {
    if (action === 'getUserData') {
      const { data, error } = await supabase.from('workers').select('*').eq('tg_id', uid.toString()).single();
      if (data) {
        let totalUsers = 0;
        if (uid.toString() === ADMIN_ID) {
          const { count } = await supabase.from('workers').select('*', { count: 'exact', head: true });
          totalUsers = count || 0;
        }
        return { status: 'success', worker_id: data.worker_id, first_name: data.first_name, last_name: data.last_name, total_users: totalUsers };
      }
      return { status: 'error', message: 'Not found' };
    }
    if (action === 'registerUser') {
      const { error } = await supabase.from('workers').upsert({
        tg_id: uid.toString(),
        worker_id: payload.worker_id,
        first_name: tgApp?.initDataUnsafe?.user?.first_name || '',
        last_name: tgApp?.initDataUnsafe?.user?.last_name || ''
      }, { onConflict: 'tg_id' });
      if (error) throw error;
      let totalUsers = 0;
      if (uid.toString() === ADMIN_ID) {
        const { count } = await supabase.from('workers').select('*', { count: 'exact', head: true });
        totalUsers = count || 0;
      }
      return { status: 'success', total_users: totalUsers };
    }
    if (action === 'getData') {
      const targetWid = payload.worker_id || wid;
      const { data: userData, error: e1 } = await supabase.from('workers').select('*').eq('worker_id', targetWid).single();
      const { data: histData, error: e2 } = await supabase.from('pro_history').select('*').eq('worker_id', targetWid).order('created_at', { ascending: false });
      const { data: rcpData, error: e3 } = await supabase.from('time_history').select('*').eq('worker_id', targetWid).order('created_at', { ascending: true });
      
      if (e2 || e3) throw (e2 || e3);
      
      let formattedHistory = (histData || []).map(r => ({
        dateStr: r.date_str, pro: r.pro_n, stan: r.stan, wTypeKey: r.work_type, uwagi: r.uwagi,
        qty: r.qty, start: r.start_time, end: r.end_time, prep: r.is_prep, result: r.result_percent,
        type: r.calc_type || (r.qty ? 'norm' : 'percent'), timestamp: new Date(r.created_at).getTime()
      }));

      let rcpHistoryList = [];
      let currentRcpState = null;
      (rcpData || []).forEach(r => {
        if (r.end_time) {
          rcpHistoryList.push({ dateStr: r.date_str, start: r.start_time, end: r.end_time, durationSec: r.duration_sec, timestamp: new Date(r.created_at).getTime() });
        } else {
          currentRcpState = { dateStr: r.date_str, start: r.start_time, end: null, timestamp: new Date(r.created_at).getTime(), workerNum: targetWid };
        }
      });
      return { status: 'success', first_name: userData?.first_name || '', last_name: userData?.last_name || '', history: formattedHistory, rcpHistory: rcpHistoryList, rcpState: currentRcpState };
    }
    if (action === 'saveHistory') {
      const records = payload.history || [];
      await supabase.from('pro_history').delete().eq('worker_id', wid);
      if (records.length > 0) {
        const insertData = records.map(r => ({
          worker_id: wid, date_str: r.dateStr, pro_n: r.pro, pos_num: r.posNumber || null, qty: r.qty,
          start_time: r.start, end_time: r.end, stan: r.stan, uwagi: r.uwagi, result_percent: r.result,
          work_type: r.wTypeKey, is_prep: r.prep || false, calc_type: r.type, created_at: new Date(r.timestamp || Date.now()).toISOString()
        }));
        const { error } = await supabase.from('pro_history').insert(insertData);
        if (error) throw error;
      }
      return { status: 'success' };
    }
    if (action === 'saveRCP') {
      await supabase.from('time_history').delete().eq('worker_id', wid);
      let insertData = [];
      if (payload.history && payload.history.length > 0) {
        insertData = insertData.concat(payload.history.map(r => ({
          worker_id: wid, date_str: r.dateStr, start_time: r.start, end_time: r.end, duration_sec: r.durationSec, created_at: new Date(r.timestamp || Date.now()).toISOString()
        })));
      }
      if (payload.state) {
        insertData.push({ worker_id: wid, date_str: payload.state.dateStr, start_time: payload.state.start, end_time: null, duration_sec: null, created_at: new Date(payload.state.timestamp || Date.now()).toISOString() });
      }
      if (insertData.length > 0) {
        const { error } = await supabase.from('time_history').insert(insertData);
        if (error) throw error;
      }
      return { status: 'success' };
    }
    if (action === 'updateProfile') {
      const { error } = await supabase.from('workers').update({ worker_id: payload.new_worker_id, first_name: payload.first_name, last_name: payload.last_name }).eq('worker_id', payload.old_worker_id);
      if (error) throw error;
      if (payload.old_worker_id !== payload.new_worker_id) {
        await supabase.from('pro_history').update({ worker_id: payload.new_worker_id }).eq('worker_id', payload.old_worker_id);
        await supabase.from('time_history').update({ worker_id: payload.new_worker_id }).eq('worker_id', payload.old_worker_id);
      }
      return { status: 'success' };
    }
    if (action === 'getAllUsers') {
      if (uid.toString() !== ADMIN_ID && !isAdmin) return { status: 'error' };
      const { data } = await supabase.from('workers').select('*');
      return { status: 'success', users: data };
    }
    if (action === 'deleteAllUsers') {
      if (uid.toString() !== ADMIN_ID && !isAdmin) return { status: 'error' };
      await supabase.from('workers').delete().neq('tg_id', ADMIN_ID);
      await supabase.from('pro_history').delete().neq('worker_id', currentWorkerId);
      await supabase.from('time_history').delete().neq('worker_id', currentWorkerId);
      return { status: 'success' };
    }
    if (action === 'deleteUser') {
      if (uid.toString() !== ADMIN_ID && !isAdmin) return { status: 'error' };
      const target = payload.target_worker_id;
      await supabase.from('workers').delete().eq('worker_id', target);
      await supabase.from('pro_history').delete().eq('worker_id', target);
      await supabase.from('time_history').delete().eq('worker_id', target);
      return { status: 'success' };
    }
    return { status: 'success' };
  } catch(e) {
    console.error("Supabase Error: ", e);
    return { status: 'error', message: e.message || e.toString() };
  }
}

function sortSavedHistory() {
  savedHistory.sort(function(a, b) {
    let pA = (a.dateStr || "").split('.'); let pB = (b.dateStr || "").split('.');
    let tA = (a.start || "").split(':'); let tB = (b.start || "").split(':');
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
  const now = new Date(); const cm = now.getMonth(), cy = now.getFullYear();
  let lm = cm === 0 ? 11 : cm - 1; let ly = cm === 0 ? cy - 1 : cy;
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

// === ИСПРАВЛЕННАЯ ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ===
function switchMainTab(tabId, el) {
  document.querySelectorAll('.main-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  const tab = document.getElementById(tabId);
  if (tab) tab.classList.add('active');
  if (el) el.classList.add('active');
}

async function checkAuth() {
  if (isAdmin && !viewingWorkerId) {
    loadAdminUsers();
    return;
  }
  let el = document.getElementById('globalUserCount');
  if (el) el.textContent = "Загрузка...";

  let res = await apiCall('getUserData');
  if (res && res.status === 'success') {
    if (res.worker_id) {
      currentWorkerId = res.worker_id;
      localStorage.setItem('kkn_worker_id', currentWorkerId);
    }
    if (res.first_name) dbFirstName = res.first_name;
    if (res.last_name) dbLastName = res.last_name;
    if (res.total_users !== undefined && el) {
      el.textContent = "users: " + res.total_users;
    }
  } else {
    if (el) el.textContent = "Ошибка сети/БД";
  }

  if (!currentWorkerId) currentWorkerId = localStorage.getItem('kkn_worker_id') || null;

  if (!currentWorkerId) {
    document.getElementById('authOverlay').style.display = 'flex';
    setLang(currentLang);
  } else {
    updateHeader();
    initAppData();
  }
}

async function saveWorkerId() {
  const val = document.getElementById('authWorkerInput').value;
  const t = tr[currentLang];
  if (!val) {
    if(tgApp && tgApp.showAlert) tgApp.showAlert(t.dash.fillFields || "Введите номер!"); else alert(t.dash.fillFields || "Введите номер!");
    return;
  }
  let confirmMsg = (t.auth.confirmWorker || "Подтвердите правильность ввода: ") + val;
  if (!confirm(confirmMsg)) return;

  let btn = document.getElementById('a_btn');
  btn.textContent = "..."; btn.disabled = true;
  let res = await apiCall('registerUser', { worker_id: val });
  btn.textContent = t.auth.btn; btn.disabled = false;

  if (res && res.status === 'error') {
    alert("Ошибка регистрации: " + res.message);
    return;
  }
  if (res && res.total_users !== undefined) {
    let el = document.getElementById('globalUserCount');
    if (el) el.textContent = "users: " + res.total_users;
  }

  currentWorkerId = val;
  localStorage.setItem('kkn_worker_id', val);
  document.getElementById('authOverlay').style.display = 'none';
  updateHeader();
  initAppData();
}

async function initAppData() {
  if (!currentWorkerId && !viewingWorkerId) { afterDataLoad(); return; }
  let el = document.getElementById('globalUserCount');
  let prevCountText = el ? el.textContent : "users: 0";
  if (el) el.textContent = "Загрузка данных...";

  let res = await apiCall('getData');
  if (res && res.status === 'success') {
    savedHistory = res.history || [];
    rcpHistory = res.rcpHistory || [];
    rcpState = res.rcpState || null;
    if (res.first_name) dbFirstName = res.first_name; else dbFirstName = "";
    if (res.last_name) dbLastName = res.last_name; else dbLastName = "";
    if (res.total_users !== undefined && el) {
      el.textContent = "users: " + res.total_users;
    } else if (el && prevCountText !== "Загрузка данных...") {
      el.textContent = prevCountText;
    }
    sortSavedHistory();
  } else {
    savedHistory = []; rcpHistory = []; rcpState = null;
    if (el) el.textContent = "Ошибка подключения";
    alert("Не удалось загрузить данные с сервера. Проверьте подключение или БД Supabase.");
  }
  afterDataLoad();
}

function afterDataLoad() {
  if (isAdmin && !viewingWorkerId) {
    let el = document.getElementById('globalUserCount');
    if (el) el.textContent = "Admin Mode";
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
  let el = document.getElementById('rcpOverlay');
  if (!rcpState || rcpState.dateStr !== today) {
    let d = document.getElementById('rcpTodayDate'); if (d) d.textContent = today;
    let s = document.getElementById('rcpStartTime'); if (s) s.textContent = getNowTime();
    if (el) el.style.display = 'flex';
  } else {
    if (el) el.style.display = 'none';
  }
}

function saveRCPData() { apiCall('saveRCP', { state: rcpState, history: rcpHistory }); }
function confirmRCPStart() {
  const sTime = document.getElementById('rcpStartTime').textContent;
  rcpState = { dateStr: getTodayStr(), start: sTime, end: null, timestamp: Date.now(), workerNum: currentWorkerId };
  saveRCPData();
  document.getElementById('rcpOverlay').style.display = 'none';
  openProfile();
}
function confirmRCPEnd() {
  const eTimeEl = document.getElementById('rcpEndTime') || { textContent: getNowTime() };
  const eTime = eTimeEl.textContent;
  const s = parseToSec(rcpState.start); const e = parseToSec(eTime);
  const durationSec = e >= s ? e - s : (86400 - s) + e;
  rcpState.end = eTime;
  rcpHistory.push({ dateStr: rcpState.dateStr, start: rcpState.start, end: rcpState.end, durationSec: durationSec, timestamp: rcpState.timestamp });
  saveRCPData();
  openProfile();
}
function changeRcpMonth(offset) { currentRcpDate.setMonth(currentRcpDate.getMonth() + offset); renderRcpTab(); }

function renderRcpTab() {
  const t = tr[currentLang];
  const y = currentRcpDate.getFullYear(); const m = currentRcpDate.getMonth();
  let ml = document.getElementById('rcpMonthLabel'); if (ml) ml.textContent = t.months[m] + " " + y;
  const stats = getWorkHoursStats();
  let whHtml = `<div style='display:flex; justify-content:space-between; align-items:center; width: 100%; background: #232a3b; border: 1px solid #343e50; border-radius: 12px; padding: 15px; margin-bottom: 15px; box-sizing:border-box;'>
    <div style='text-align:left;'><span style='color:#8b949e; font-size:13px;'>${t.workTime.thisMonth}</span><br><b style='color:#3cd4a0; font-size:18px;'>${stats.thisMonth} ${t.workTime.h}</b></div>
    <div style='text-align:right;'><span style='color:#8b949e; font-size:13px;'>${t.workTime.lastMonth}</span><br><b style='color:#fff; font-size:18px;'>${stats.lastMonth} ${t.workTime.h}</b></div>
  </div>`;
  let elWh = document.getElementById('rcpTabHours'); if (elWh) elWh.innerHTML = whHtml;

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  let calHtml = `<div class='cal-grid'>
    <div class='cal-header'>${t.dash.days[0]}</div><div class='cal-header'>${t.dash.days[1]}</div><div class='cal-header'>${t.dash.days[2]}</div><div class='cal-header'>${t.dash.days[3]}</div><div class='cal-header'>${t.dash.days[4]}</div><div class='cal-header'>${t.dash.days[5]}</div><div class='cal-header'>${t.dash.days[6]}</div>`;
  let firstDay = new Date(y, m, 1).getDay(); firstDay = firstDay === 0 ? 7 : firstDay;
  for(let i=1; i < firstDay; i++) calHtml += `<div></div>`;

  let rcpMap = {};
  rcpHistory.forEach(r => rcpMap[r.dateStr] = r);
  if (rcpState && rcpState.dateStr) rcpMap[rcpState.dateStr] = rcpState;

  let cardsHtml = "";
  for(let i=1; i <= daysInMonth; i++) {
    let checkDate = new Date(y, m, i); let checkDateStr = checkDate.toLocaleDateString('ru-RU');
    let hasData = rcpMap[checkDateStr]; let isToday = (checkDateStr === getTodayStr());
    let dayClass = 'cal-day'; let dayStyle = '';
    if (hasData) { dayClass += ' active'; dayStyle = 'background:#4e73df;';
      let dur = hasData.durationSec || (hasData.end === "Auto (8h)" ? 28800 : 0);
      if (dur === undefined) {
        let sSec = parseToSec(hasData.start); let eSec = parseToSec(hasData.end || getNowTime());
        dur = eSec >= sSec ? eSec - sSec : (86400 - sSec) + eSec;
      }
      let hrs = Math.round(dur / 3600);
      cardsHtml += `<div class='hist-card' style='margin-bottom:8px; cursor:${isAdmin ? 'pointer' : 'default'};' ${isAdmin ? `onclick='openRcpEdit("${checkDateStr}")'` : ''}>
        <div style='display:flex; justify-content:space-between; align-items:center;'>
          <div style='flex:1; text-align:left; color:#fff; font-size:16px;'>${checkDateStr}</div>
          <div style='flex:1; text-align:center; color:#3cd4a0; font-size:16px;'>${hrs} ${t.workTime.h}</div>
          <div style='flex:1; text-align:right; color:#3cd4a0; font-size:16px;'>${hasData.start} - ${hasData.end ? hasData.end : '...'}</div>
        </div>
      </div>`;
    } else if (isToday) { dayClass += ' active'; dayStyle = 'background:#343e50; border: 1px solid #4e73df;'; }
    calHtml += `<div class='${dayClass}' style='${dayStyle}; cursor:${isAdmin ? 'pointer' : 'default'};' ${isAdmin ? `onclick='openRcpEdit("${checkDateStr}")'` : ''}>${i}</div>`;
  }
  calHtml += "</div>";
  let elCal = document.getElementById('rcpTabCalendar'); if (elCal) elCal.innerHTML = calHtml;
  if (!cardsHtml) cardsHtml = `<div style='text-align:center; color:#8b949e; margin-top:20px;'>${t.dash.noData}</div>`;
  let elCards = document.getElementById('rcpTabCards'); if (elCards) elCards.innerHTML = cardsHtml;
}

function openRcpEdit(dateStr) {
  if (!isAdmin) return;
  editingRcpDateStr = dateStr;
  document.getElementById('re_date').textContent = dateStr;
  let existing = rcpHistory.find(r => r.dateStr === dateStr);
  if (!existing && rcpState && rcpState.dateStr === dateStr) existing = rcpState;
  if (existing) {
    document.getElementById('re_start').textContent = existing.start;
    document.getElementById('re_end').textContent = existing.end ? existing.end : getNowTime();
    document.getElementById('re_btn_del').style.display = 'block';
  } else {
    document.getElementById('re_start').textContent = "08:00";
    document.getElementById('re_end').textContent = "16:00";
    document.getElementById('re_btn_del').style.display = 'none';
  }
  openModal('rcpEditModalOverlay');
}

function saveRcpEdit() {
  let start = document.getElementById('re_start').textContent;
  let end = document.getElementById('re_end').textContent;
  let sSec = parseToSec(start); let eSec = parseToSec(end);
  let dur = eSec >= sSec ? eSec - sSec : (86400 - sSec) + eSec;
  if (rcpState && rcpState.dateStr === editingRcpDateStr) {
    rcpState.start = start; rcpState.end = end;
    rcpHistory.push({ dateStr: rcpState.dateStr, start: rcpState.start, end: rcpState.end, durationSec: dur, timestamp: rcpState.timestamp });
    rcpState = null;
  } else {
    let idx = rcpHistory.findIndex(r => r.dateStr === editingRcpDateStr);
    if (idx > -1) { rcpHistory[idx].start = start; rcpHistory[idx].end = end; rcpHistory[idx].durationSec = dur; }
    else {
      let parts = editingRcpDateStr.split('.');
      let ts = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00`).getTime();
      rcpHistory.push({ dateStr: editingRcpDateStr, start: start, end: end, durationSec: dur, timestamp: ts });
    }
  }
  saveRCPData(); closeModal('rcpEditModalOverlay'); renderRcpTab(); openProfile();
}

function deleteRcpEdit() {
  const t = tr[currentLang];
  if (confirm(t.dash.confirmDel)) {
    if (rcpState && rcpState.dateStr === editingRcpDateStr) { rcpState = null; }
    else { let idx = rcpHistory.findIndex(r => r.dateStr === editingRcpDateStr); if (idx > -1) rcpHistory.splice(idx, 1); }
    saveRCPData(); closeModal('rcpEditModalOverlay'); renderRcpTab(); openProfile();
  }
}

let isSavePrepActive = false;
function toggleSavePrep() {
  isSavePrepActive = !isSavePrepActive;
  document.getElementById('saveRadioDot').style.display = isSavePrepActive ? 'block' : 'none';
  document.getElementById('savePrepToggle').classList.toggle('active', isSavePrepActive);
}

function openSaveModal(isEdit, idx) {
  if (isEdit && !isAdmin) return;
  editIndex = isEdit ? idx : -1;
  if (!isEdit && !pendingSaveData) return;
  let rec = isEdit ? savedHistory[idx] : pendingSaveData;
  document.getElementById('saveDate').value = rec.dateStr || getTodayStr();
  document.getElementById('savePro').value = rec.pro || "";
  document.getElementById('saveStanowisko').value = rec.stan || "";
  const wTypeSelect = document.getElementById('saveWorkType'); if (wTypeSelect) wTypeSelect.value = rec.wTypeKey || 't1';
  document.getElementById('saveUwagi').value = rec.uwagi || "";
  document.getElementById('saveQty').value = rec.qty || "";
  document.getElementById('saveStart').textContent = rec.start || "08:00";
  document.getElementById('saveEnd').textContent = rec.end || "16:00:00";
  isSavePrepActive = rec.prep || false;
  document.getElementById('saveRadioDot').style.display = isSavePrepActive ? 'block' : 'none';
  document.getElementById('savePrepToggle').classList.toggle('active', isSavePrepActive);
  openModal('saveModalOverlay');
}

function confirmSave() {
  const dateVal = document.getElementById('saveDate').value || getTodayStr();
  const proVal = document.getElementById('savePro').value;
  const stanVal = document.getElementById('saveStanowisko').value;
  const wTypeSelect = document.getElementById('saveWorkType');
  const wTypeKey = wTypeSelect ? wTypeSelect.value : 't1';
  const uwagiVal = document.getElementById('saveUwagi').value;
  const qtyVal = parseFloat(document.getElementById('saveQty').value) || 0;
  const startVal = document.getElementById('saveStart').textContent;
  const endVal = document.getElementById('saveEnd').textContent;
  const t = tr[currentLang];

  if(!proVal || !stanVal) {
    if(tgApp && tgApp.showAlert) tgApp.showAlert(t.dash.fillFields); else alert(t.dash.fillFields); return;
  }

  let recToCalculate = editIndex > -1 ? savedHistory[editIndex] : pendingSaveData;
  let eff = recToCalculate.result; let finalTpi = recToCalculate.tpi;
  if (qtyVal > 0 && startVal && endVal && endVal !== "00:00:00") {
    let oldTpi = recToCalculate.tpi;
    if (oldTpi === undefined || oldTpi === null) {
      let FactS = parseToSec(recToCalculate.end); let FactStart = parseToSec(recToCalculate.start);
      let FactT = FactS >= FactStart ? FactS - FactStart : (86400 - FactStart) + FactS;
      let oldNorm = FactT * (recToCalculate.result / 100);
      oldTpi = (oldNorm - (recToCalculate.prep ? 900 : 0)) / (recToCalculate.qty || 1);
      if (oldTpi < 0) oldTpi = 0;
    }
    let newPrepVal = isSavePrepActive ? 900 : 0;
    let newNorm = (qtyVal * oldTpi) + newPrepVal;
    let newFactS = parseToSec(endVal); let newFactStart = parseToSec(startVal);
    let newFactT = newFactS >= newFactStart ? newFactS - newFactStart : (86400 - newFactStart) + newFactS;
    if (newFactT > 0) eff = Math.round((newNorm / newFactT) * 100); else eff = 0;
    finalTpi = oldTpi;
  }

  if (editIndex > -1) {
    savedHistory[editIndex] = { ...savedHistory[editIndex], dateStr: dateVal, pro: proVal, stan: stanVal, wTypeKey, uwagi: uwagiVal, qty: qtyVal, start: startVal, end: endVal, prep: isSavePrepActive, result: eff, tpi: finalTpi };
  } else {
    const record = Object.assign({}, pendingSaveData, { pro: proVal, stan: stanVal, wTypeKey, uwagi: uwagiVal, timestamp: Date.now(), dateStr: dateVal, qty: qtyVal, start: startVal, end: endVal, prep: isSavePrepActive, result: eff, tpi: finalTpi });
    savedHistory.unshift(record);
    if (savedHistory.length > 500) savedHistory.pop();
  }
  sortSavedHistory(); apiCall('saveHistory', { history: savedHistory });
  closeModal('saveModalOverlay'); openProfile(); filterHistory();
  if (!isAdmin) { if(tgApp && tgApp.showAlert) tgApp.showAlert(t.dash.saved); else alert(t.dash.saved); }
}

function deleteRecord(idx) {
  if (!isAdmin) return;
  const t = tr[currentLang];
  if (confirm(t.dash.confirmDel)) {
    savedHistory.splice(idx, 1); apiCall('saveHistory', { history: savedHistory }); openProfile(); filterHistory();
  }
}

function getColorForPercent(p) { return p < 65 ? "#f06767" : p < 75 ? "#ff9800" : "#3cd4a0"; }

window.filterHistory = function() {
  if(!document.getElementById('proSearchInput')) return;
  renderHistoryCards(document.getElementById('proSearchInput').value);
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
    let typeText = item.wTypeKey ? t.dash.types[item.wTypeKey] : (item.wType || t.dash.types['t1']);
    let innerRows = item.type === 'norm' ?
      `<div class='hc-row'><span>${t.dash.lblDate}</span><span>${item.dateStr}</span></div><div class='hc-row'><span>${t.dash.lblStart}</span><span>${item.start}</span></div><div class='hc-row'><span>${t.dash.lblEnd}</span><span>${item.end}</span></div>` :
      `<div class='hc-row'><span>${t.dash.lblDate}</span><span>${item.dateStr} (${t.dash.lblAvg})</span></div>`;
    if (item.uwagi) innerRows += `<div class='hc-row'><span style='color:#ff9800'>${t.workTime.uwagi}:</span><span style='text-align:right; max-width:65%; word-break:break-word;'>${item.uwagi}</span></div>`;
    let footerAdd = item.type === 'norm' ? `<span>${t.dash.settings} <span style='color:${item.prep ? '#3cd4a0' : '#8b949e'}'>${item.prep ? t.dash.yes : t.dash.no}</span></span>` : "";
    let qtyAdd = item.qty ? `<div style='background:#1b222d; padding:4px 10px; border-radius:6px; color:#e6edf3;'>${item.qty} ${t.dash.pcs}</div>` : "";
    let modernBtns = "";
    if (isAdmin) {
      modernBtns = `<div class='hc-actions' style='margin:0; display:flex; gap:8px; align-items:center;'>
        <span class='hc-act-btn' style='background:rgba(88, 166, 255, 0.1); color:#58a6ff; padding:8px; border-radius:8px; display:flex;' onclick='event.stopPropagation(); openSaveModal(true, ${idx})'><svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path><path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path></svg></span>
        <span class='hc-act-btn' style='background:rgba(240, 103, 103, 0.1); color:#f06767; padding:8px; border-radius:8px; display:flex;' onclick='event.stopPropagation(); deleteRecord(${idx})'><svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='3 6 5 6 21 6'></polyline><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'></path><line x1='10' y1='11' x2='10' y2='17'></line><line x1='14' y1='11' x2='14' y2='17'></line></svg></span>
      </div>`;
    }
    let qtyText = item.qty ? `<div style='font-size:14px; color:#e6edf3; white-space:nowrap; margin-right:5px;'>${item.qty} ${t.dash.pcs}</div>` : "";
    let proText = item.pro ? "PRO-" + item.pro : "PRO-...";
    html += `<div class='hist-card' style='padding:15px 12px; cursor:pointer;' onclick='toggleHistoryCard(this)'>
      <div class='hc-collapsed' style='display:flex; align-items:center; width:100%;'>
        <div style='flex:1; font-size:14px; text-align:left; word-break:break-all; color:#fff; font-weight:bold;'>${proText}</div>
        ${qtyText}
        <div style='font-size:16px; font-weight:bold; color:${iClr}; margin:0 5px;'>${item.result}%</div>
        ${modernBtns}
      </div>
      <div class='hc-expanded' style='display:none; padding-top:15px; margin-top:15px; border-top:1px solid #343e50;'>
        <div class='hc-top'>
          <div style='flex:1; text-align:left;'><div class='hc-pro'>${proText}</div><div class='hc-type'>${typeText}</div></div>
          <div style='display:flex; flex-direction:column; align-items:flex-end;'>
            ${modernBtns}
            <div class='hc-stan' style='margin-top:10px;'><small style='color:#8b949e'>${t.dash.stanLabel}</small><br><b style='color:#fff; font-size:16px'>${item.stan}</b></div>
          </div>
        </div>
        ${innerRows}
        <div class='hc-progress-bg'><div class='hc-progress-fill' style='width:${Math.min(item.result, 100)}%; background:${iClr}'></div></div>
        <div class='hc-footer'>
          <span style='color:${iClr}; font-weight:bold; font-size:18px;'>${item.result}%</span>
          ${footerAdd}${qtyAdd}
        </div>
      </div>
    </div>`;
  });

  if (html === "") html = `<div class='history-empty' style='color:#8b949e; margin-top:20px;'>${t.dash.noData}</div>`;
  container.innerHTML = html;
  if (countContainer) {
    if (filterStr !== "") { countContainer.style.display = 'block'; countContainer.textContent = (t.dash.matches || 'Найдено совпадений') + ": " + matchCount; }
    else countContainer.style.display = 'none';
  }
}

function toggleHistoryCard(cardEl) {
  let exp = cardEl.querySelector('.hc-expanded');
  if (!exp) return;
  let isOpening = exp.style.display === 'none';
  let container = document.getElementById('historyCardsContainer');
  if (container) {
    container.querySelectorAll('.hist-card').forEach(function(card) {
      let cCol = card.querySelector('.hc-collapsed'); let cExp = card.querySelector('.hc-expanded');
      if (cExp && cCol) { cExp.style.display = 'none'; cCol.style.display = 'flex'; }
    });
  }
  if (isOpening) { exp.style.display = 'block'; let col = cardEl.querySelector('.hc-collapsed'); if (col) col.style.display = 'none'; }
}

function changeMainMonth(offset) { currentMainCalDate.setMonth(currentMainCalDate.getMonth() + offset); openProfile(); }

function resetAllLocalData() {
  const t = tr[currentLang];
  if (!confirm(t.admin.resetConfirm)) return;
  localStorage.removeItem('kkn_worker_id'); localStorage.removeItem('kkn_history_v2'); localStorage.removeItem('kkn_rcp_v1');
  if (isCloudStorageSupported) {
    tgApp.CloudStorage.removeItem('kkn_history_v2', ()=>{});
    tgApp.CloudStorage.removeItem('kkn_rcp_v1', ()=>{});
  }
  currentWorkerId = null; savedHistory = []; rcpHistory = []; rcpState = null;
  if (tgApp && tgApp.showAlert) tgApp.showAlert(t.admin.resetSuccess, ()=>window.location.reload());
  else { alert(t.admin.resetSuccess); window.location.reload(); }
}

async function adminDeleteAllUsers() { const t = tr[currentLang]; if (confirm(t.admin.deleteConfirm)) { await apiCall('deleteAllUsers'); loadAdminUsers(); } }
async function adminDeleteUser(wId) { const t = tr[currentLang]; if (confirm(t.admin.deleteConfirm)) { await apiCall('deleteUser', { target_worker_id: wId }); exitAdminView(); } }

window.toggleAdminUserCard = function(el) {
  let details = el.querySelector('.admin-user-details'); let icon = el.querySelector('.icon-arrow');
  if (details.style.display === 'none') { details.style.display = 'block'; icon.textContent = '▲'; }
  else { details.style.display = 'none'; icon.textContent = '▼'; }
}

async function loadAdminUsers() {
  const t = tr[currentLang];
  const container = document.getElementById('profileHistoryContent');
  container.innerHTML = "<div class='history-card'><h2 style='color:#fff; margin-bottom:5px;'>"+t.admin.title+"</h2><p style='color:#8b949e;'>Loading...</p></div>";
  let res = await apiCall('getAllUsers');
  adminUsersList = (res && res.users) ? res.users : [];
  let uHtml = `<h2 style='color:#fff; margin-bottom:5px;'>${t.admin.title}</h2>
    <div style='display:flex; gap:10px; margin-bottom:15px; width:100%; box-sizing:border-box;'>
      <button class='btn btn-info' style='flex:1; background:#f06767; border-color:#f06767; font-size:13px; padding:10px;' onclick='resetAllLocalData()'>${t.admin.resetData}</button>
      <button class='btn btn-info' style='flex:1; background:#f06767; border-color:#f06767; font-size:13px; padding:10px;' onclick='adminDeleteAllUsers()'>${t.admin.deleteAll}</button>
    </div>
    <p style='color:#8b949e; margin-top:0;'>${t.admin.users}: ${adminUsersList.length}</p>
    <div class='admin-grid' style='width:100%; box-sizing:border-box; display:flex; flex-direction:column; gap:10px;'>`;
  adminUsersList.forEach(u => {
    let wId = u.worker_id || 'N/A'; let tId = u.tg_id || '---'; let fN = u.first_name || ''; let lN = u.last_name || '';
    let displayName = (fN || lN) ? (fN + " " + lN).trim() : "Worker " + wId;
    uHtml += `<div class='admin-card' style='text-align:left; cursor:pointer; padding:15px;' onclick='toggleAdminUserCard(this)'>
      <div style='display:flex; justify-content:space-between; align-items:center;'>
        <b style='color:#fff;'>${displayName} (№ ${wId})</b><span class='icon-arrow' style='font-size:12px; color:#8b949e;'>▼</span>
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
  container.innerHTML = uHtml;
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
    } else { savedHistory = []; rcpHistory = []; rcpState = null; }
    sortSavedHistory(); openProfile(); filterHistory(); renderRcpTab();
  });
}
function exitAdminView() { viewingWorkerId = null; loadAdminUsers(); }

window.openProfileSettings = function() {
  document.getElementById('psWorkerInput').value = viewingWorkerId || currentWorkerId || "";
  document.getElementById('psFirstNameInput').value = dbFirstName || "";
  document.getElementById('psLastNameInput').value = dbLastName || "";
  openModal('profileSettingsModalOverlay');
};

window.saveProfileSettings = async function() {
  const newWorkerId = document.getElementById('psWorkerInput').value;
  const newFName = document.getElementById('psFirstNameInput').value;
  const newLName = document.getElementById('psLastNameInput').value;
  const t = tr[currentLang];
  if (!newWorkerId) { if(tgApp && tgApp.showAlert) tgApp.showAlert(t.dash.fillFields); else alert(t.dash.fillFields); return; }
  let btn = document.getElementById('ps_btn_save'); btn.disabled = true; btn.textContent = "...";
  let targetId = viewingWorkerId || currentWorkerId;
  let res = await apiCall('updateProfile', { old_worker_id: targetId, new_worker_id: newWorkerId, first_name: newFName, last_name: newLName });
  btn.disabled = false; btn.textContent = t.saveModal.btnSave || "Сохранить";
  if (res && res.status === 'success') {
    if (!viewingWorkerId) { currentWorkerId = newWorkerId; localStorage.setItem('kkn_worker_id', newWorkerId); }
    else { viewingWorkerId = newWorkerId; }
    dbFirstName = newFName; dbLastName = newLName;
    closeModal('profileSettingsModalOverlay'); updateHeader(); openProfile();
  }
};

function openProfile() {
  const t = tr[currentLang];
  const container = document.getElementById('profileHistoryContent');
  if (!container) return;
  if (isAdmin && !viewingWorkerId) { loadAdminUsers(); return; }
  const displayY = currentMainCalDate.getFullYear(); const displayM = currentMainCalDate.getMonth();
  const monthRecords = []; const dayAverages = {};
  savedHistory.forEach(function(r) {
    if (r.dateStr) {
      let parts = r.dateStr.split('.');
      if (parts.length === 3) {
        let dY = parseInt(parts[2], 10); let dM = parseInt(parts[1], 10) - 1; let dD = parseInt(parts[0], 10);
        if (dM === displayM && dY === displayY) {
          monthRecords.push(r); if(!dayAverages[dD]) dayAverages[dD] = []; dayAverages[dD].push(r.result);
        }
      }
    }
  });
  let monthAvg = 0;
  if (monthRecords.length > 0) { const sum = monthRecords.reduce(function(a, b) { return a + b.result; }, 0); monthAvg = Math.round(sum / monthRecords.length); }
  const mClr = getColorForPercent(monthAvg);
  const mOff = 440 - (440 * Math.min(monthAvg, 100)) / 100;
  let mZn = monthAvg < 65 ? t.zones.risk : monthAvg < 75 ? t.zones.orange : t.zones.green;
  let mMsg = monthAvg < 65 ? t.msgs.fail : monthAvg < 75 ? t.msgs.push : t.msgs.good;

  let rcpBlockHtml = "";
  if (rcpState && rcpState.dateStr === getTodayStr() && !rcpState.end) {
    let sSec = parseToSec(rcpState.start); let eSec = parseToSec(getNowTime());
    let diff = eSec >= sSec ? eSec - sSec : (86400 - sSec) + eSec;
    let todayHrs = Math.round(diff / 3600);
    rcpBlockHtml = `<div class='dash-section-title' style='text-align:center; margin-bottom:10px; width: 100%; box-sizing:border-box;'>${t.rcp.closeTitle}</div>
      <div class='chart-container' style='margin: 0 auto 10px; width: 220px; height: 220px;'>
        <svg class='chart-svg' viewBox='0 0 200 200'><circle class='chart-bg' cx='100' cy='100' r='90'/><circle class='chart-fill' cx='100' cy='100' r='90' style='stroke:#58a6ff; stroke-dasharray:565; stroke-dashoffset:0;'/></svg>
        <div class='chart-text' style='display:flex; flex-direction:column; align-items:center; width:100%;'>
          <span style='font-size:12px; color:#8b949e;'>${t.rcp.startedAt} <b style='color:#58a6ff; font-size:14px;'>${rcpState.start}</b></span>
          <b style='font-size:32px; color:#fff; margin:4px 0 10px;'>${todayHrs} ${t.workTime.h}</b>
          <button class='btn btn-calc' style='padding:6px 12px; font-size:14px; font-weight:bold; min-height:0; width:auto; border-radius:8px; background:#ff9800; border-color:#ff9800; color:#fff;' onclick='confirmRCPEnd()'>${t.rcp.closeBtn}</button>
        </div>
      </div>`;
  } else if (rcpState && rcpState.dateStr === getTodayStr() && rcpState.end) {
    let sSec = parseToSec(rcpState.start); let eSec = parseToSec(rcpState.end);
    let diff = eSec >= sSec ? eSec - sSec : (86400 - sSec) + eSec;
    let todayHrs = Math.round(diff / 3600);
    rcpBlockHtml = `<div class='chart-container' style='margin: 0 auto 10px; width: 220px; height: 220px;'>
      <svg class='chart-svg' viewBox='0 0 200 200'><circle class='chart-bg' cx='100' cy='100' r='90'/><circle class='chart-fill' cx='100' cy='100' r='90' style='stroke:#3cd4a0; stroke-dasharray:565; stroke-dashoffset:0;'/></svg>
      <div class='chart-text' style='display:flex; flex-direction:column; align-items:center; width:100%;'>
        <span style='color:#3cd4a0; font-size:14px; font-weight:bold; text-align:center;'>${t.rcp.closedToday}</span>
        <b style='font-size:32px; color:#fff; margin:6px 0;'>${todayHrs} ${t.workTime.h}</b>
        <span style='color:#3cd4a0; font-size:16px; font-weight:bold;'>${rcpState.start} - ${rcpState.end}</span>
      </div>
    </div>`;
  }
  const stats = getWorkHoursStats();
  rcpBlockHtml += `<div style='display:flex; justify-content:space-between; align-items:center; width: 100%; background: #232a3b; border: 1px solid #343e50; border-radius: 12px; padding: 15px; margin-bottom: 20px; box-sizing:border-box;'>
    <div style='text-align:left;'><span style='color:#8b949e; font-size:13px;'>${t.workTime.thisMonthDash}</span><br><b style='color:#3cd4a0; font-size:18px;'>${stats.thisMonth} ${t.workTime.h}</b></div>
    <div style='text-align:right;'><span style='color:#8b949e; font-size:13px;'>${t.workTime.lastMonth}</span><br><b style='color:#fff; font-size:18px;'>${stats.lastMonth} ${t.workTime.h}</b></div>
  </div>`;

  const daysInMonth = new Date(displayY, displayM + 1, 0).getDate();
  let calHtml = `<div style='display:flex; justify-content:space-between; align-items:center; width: 100%; background:#232a3b; padding:10px 15px; border-radius:12px; border:1px solid #343e50; margin-bottom:15px; box-sizing:border-box;'>
    <button onclick='changeMainMonth(-1)' style='background:none; border:none; color:#58a6ff; font-size:22px; cursor:pointer;'>&#9664;</button>
    <b style='font-size:16px; color:#fff;'>${t.months[displayM]} ${displayY}</b>
    <button onclick='changeMainMonth(1)' style='background:none; border:none; color:#58a6ff; font-size:22px; cursor:pointer;'>&#9654;</button>
  </div>
  <div class='dash-section-title' style='width:100%; box-sizing:border-box;'>${t.dash.cal} (${monthRecords.length > 0 ? '1 - ' + daysInMonth : t.dash.noData})</div>
  <div class='cal-grid'><div class='cal-header'>${t.dash.days[0]}</div><div class='cal-header'>${t.dash.days[1]}</div><div class='cal-header'>${t.dash.days[2]}</div><div class='cal-header'>${t.dash.days[3]}</div><div class='cal-header'>${t.dash.days[4]}</div><div class='cal-header'>${t.dash.days[5]}</div><div class='cal-header'>${t.dash.days[6]}</div>`;
  let firstDay = new Date(displayY, displayM, 1).getDay(); firstDay = firstDay === 0 ? 7 : firstDay;
  for(let i=1; i < firstDay; i++) calHtml += `<div></div>`;
  let rcpMap = {}; rcpHistory.forEach(r => rcpMap[r.dateStr] = r); if (rcpState && rcpState.dateStr) rcpMap[rcpState.dateStr] = rcpState;
  for(let i=1; i <= daysInMonth; i++) {
    let checkDate = new Date(displayY, displayM, i); let checkDateStr = checkDate.toLocaleDateString('ru-RU');
    let hasData = rcpMap[checkDateStr]; let isToday = (checkDateStr === getTodayStr());
    let dayClass = 'cal-day'; let dayStyle = '';
    if (hasData) { dayClass += ' active'; dayStyle = 'background:#4e73df;'; }
    else if (isToday) { dayClass += ' active'; dayStyle = 'background:#343e50; border: 1px solid #4e73df;'; }
    calHtml += `<div class='${dayClass}' style='${dayStyle}; cursor:${isAdmin ? 'pointer' : 'default'};' ${isAdmin ? `onclick='openRcpEdit("${checkDateStr}")'` : ''}>${i}</div>`;
  }
  calHtml += "</div>";

  let chartHtml = '';
  const activeDays = Object.keys(dayAverages).sort(function(a,b){return a-b});
  if (activeDays.length > 1) {
    let points = ""; const width = 300; const height = 100; const xStep = width / (activeDays.length - 1);
    activeDays.forEach(function(day, index) {
      let val = Math.round(dayAverages[day].reduce(function(a,b){return a+b},0)/dayAverages[day].length);
      if (val > 100) val = 100; let x = index * xStep; let y = height - ((val / 100) * height);
      points += x + "," + y + " ";
    });
    chartHtml = `<div class='dash-section-title' style='margin-top:20px; width:100%; box-sizing:border-box;'>${t.dash.dyn}</div>
      <div class='chart-box'><svg viewBox='0 -10 300 120' class='line-chart-svg'>
        <line x1='0' y1='0' x2='300' y2='0' class='chart-grid-line'/><line x1='0' y1='50' x2='300' y2='50' class='chart-grid-line'/><line x1='0' y1='100' x2='300' y2='100' class='chart-grid-line'/>
        <polyline points='${points.trim()}' class='line-path'/>
      </svg><div class='chart-labels'><span>${activeDays[0]} ${t.dash.date}</span><span>${activeDays[activeDays.length-1]} ${t.dash.date}</span></div></div>`;
  }

  let topBtns = "<div style='display:flex; gap:10px; margin-bottom:15px; width: 100%; box-sizing: border-box;'>";
  if (isAdmin && viewingWorkerId) {
    topBtns += `<button class='btn btn-info' style='flex:1; font-size:14px; padding:10px;' onclick='exitAdminView()'>${t.admin.back}</button>`;
    topBtns += `<button class='btn btn-info' style='flex:1; font-size:14px; padding:10px; border-color:#58a6ff; color:#58a6ff;' onclick='openProfileSettings()'>${t.profSet.title}</button>`;
  } else {
    topBtns += `<button class='btn btn-info' style='width:100%; font-size:14px; padding:10px; border-color:#58a6ff; color:#58a6ff;' onclick='openProfileSettings()'>${t.profSet.title}</button>`;
  }
  topBtns += "</div>";

  container.innerHTML = `<div class='profile-dashboard'>${topBtns}${rcpBlockHtml}${calHtml}
    <div style='background:#232a3b; border-radius:12px; padding:20px; border:1px solid #343e50; text-align:center; margin-bottom: 20px; margin-top: 15px; width: 100%; box-sizing: border-box;'>
      <div class='chart-container' style='margin: 0 auto 10px;'>
        <svg class='chart-svg' viewBox='0 0 160 160'><circle class='chart-bg' cx='80' cy='80' r='70'/><circle class='chart-fill' cx='80' cy='80' r='70' style='stroke:${mClr}; stroke-dasharray:440; stroke-dashoffset:${monthAvg === 0 ? 440 : mOff};'/></svg>
        <div class='chart-text'><span class='chart-percent' style='color:${mClr}'>${monthAvg}%</span><span class='chart-label'>${t.dash.title}</span></div>
      </div>
      <div style='background: rgba(0,0,0,0.2); padding:10px; border-radius:8px; margin-top:10px;'>
        <span style='color:#8b949e; font-size:14px;'>${t.dash.zonePrefix}</span><br>
        <b style='color:#fff; font-size:16px;'>${mZn}</b><br>
        <b style='color:${mClr}; font-size:14px;'>${mMsg}</b>
      </div>
    </div>${chartHtml}</div>`;
}

function setLang(lang) {
  currentLang = lang;
  const t = tr[lang] || tr['Eng'];
  const els = [
    ['l_qty', t.labels.qty], ['l_tpi', t.labels.tpi], ['l_prep', t.labels.prep], ['l_prepSub', t.labels.prepSub],
    ['l_start', t.labels.start], ['l_end', t.labels.end], ['b_calc', t.btns.calc], ['p_cancel', t.btns.cancel],
    ['p_done', t.btns.done], ['p_title', t.btns.pick], ['rcp_title', t.rcp.title], ['rcp_desc', t.rcp.desc],
    ['rcp_btn_start', t.rcp.startBtn], ['rcp_btn_skip', t.btns.skip], ['a_title', t.auth.title], ['a_desc', t.auth.desc],
    ['a_btn', t.auth.btn], ['s_title', t.saveModal.title], ['s_pro', 'PRO (' + t.proLabel + ')'],
    ['btn_help', t.helpBtn], ['h_title', t.helpTitle], ['h_btn_send', t.helpSend], ['h_btn_cancel', t.saveModal.btnCancel],
    ['ps_title', t.profSet.title], ['ps_l_worker', t.profSet.worker], ['ps_l_fname', t.profSet.fname],
    ['ps_l_lname', t.profSet.lname], ['ps_btn_save', t.saveModal.btnSave], ['ps_btn_cancel', t.saveModal.btnCancel],
    ['s_qty_lbl', t.labels.qty], ['s_start_lbl', t.labels.start], ['s_end_lbl', t.labels.end], ['s_prep_lbl', t.labels.prep],
    ['s_stan', t.saveModal.stan], ['s_type', t.saveModal.type], ['s_uwagi', t.workTime.uwagi],
    ['s_btn_save', t.saveModal.btnSave], ['s_btn_cancel', t.saveModal.btnCancel], ['s_date', t.saveModal.date || 'Дата'],
    ['i_title_info', t.btns.info], ['t_hist_title', t.dash.hist], ['b_search', t.btns.search],
    ['re_title', t.editRcp], ['re_l_start', t.reStart], ['re_l_end', t.reEnd], ['re_btn_del', t.del],
    ['re_btn_save', t.saveModal.btnSave], ['re_btn_cancel', t.saveModal.btnCancel], ['t_rcp_title', t.rcpTabTitle]
  ];
  els.forEach(([id, txt]) => { let e = document.getElementById(id); if (e) e.textContent = txt; });

  let authInp = document.getElementById('authWorkerInput'); if (authInp) authInp.placeholder = "12345";
  let helpInp = document.getElementById('helpTextInput'); if (helpInp) helpInp.placeholder = t.helpPlaceholder;
  let sInp = document.getElementById('proSearchInput'); if (sInp) sInp.placeholder = t.workTime.search;

  const sel = document.getElementById('saveWorkType');
  if (sel) sel.innerHTML = `<option value="t1">${t.dash.types.t1}</option><option value="t2">${t.dash.types.t2}</option><option value="t3">${t.dash.types.t3}</option>`;
  
  updatePrepStatus();
  let htmlNorm = '';
  t.instrNorm.forEach(function(item) {
    htmlNorm += `<div class='prep-card' style='margin-bottom:10px; cursor:pointer;' onclick='toggleAccordion(this)'>
      <div style='display:flex; justify-content:space-between; align-items:center;'><b>${item.t}</b><span style='font-size:12px; color:#58a6ff;'>▼</span></div>
    </div><div class='instr-white' style='display:none; padding:10px; color:#8b949e;'>${item.c}</div>`;
  });
  let instr = document.getElementById('instructionContentNorm'); if (instr) instr.innerHTML = htmlNorm;
  if (currentWorkerId || viewingWorkerId) { updateHeader(); openProfile(); filterHistory(); renderRcpTab(); }
  let res = document.getElementById('result'); if (res && res.innerHTML !== "") calculate();
}

let isPrepActive = false, activeField = null, shortFormat = false;
function initWheel(id, max) {
  const w = document.getElementById(id); if(!w) return;
  w.innerHTML = '<div class="spacer"></div>';
  for (let i=0; i<=max; i++) { let d = document.createElement('div'); d.textContent = (i < 10 ? "0" : "") + i; w.appendChild(d); }
  w.innerHTML += '<div class="spacer"></div>';
  w.onscroll = function() {
    let idx = Math.round(w.scrollTop/40);
    w.querySelectorAll('div:not(.spacer)').forEach(function(item, i) {
      item.classList.toggle('selected', i === idx);
    });
  };
}

document.addEventListener('DOMContentLoaded', function() {
  initWheel('hWheel', 23); initWheel('mWheel', 59); initWheel('sWheel', 59);
  let tgLang = 'ru';
  if (tgApp && tgApp.initDataUnsafe && tgApp.initDataUnsafe.user && tgApp.initDataUnsafe.user.language_code) {
    tgLang = tgApp.initDataUnsafe.user.language_code.toLowerCase().substring(0, 2);
  }
  const langMap = { 'ru': 'Pyc', 'en': 'Eng', 'pl': 'Pol', 'es': 'Esp', 'uk': 'Ukr' };
  setLang(langMap[tgLang] || 'Pyc');
  checkAuth();
});

function openPicker(id, isShort) {
  activeField = id; shortFormat = isShort || false;
  document.getElementById('sWheel').style.display = shortFormat ? 'none' : 'block';
  document.getElementById('pickerOverlay').style.display = 'flex';
}
function closePicker() { document.getElementById('pickerOverlay').style.display = 'none'; }
function confirmPicker() {
  const hEl = document.querySelector('#hWheel .selected');
  const mEl = document.querySelector('#mWheel .selected');
  const sEl = document.querySelector('#sWheel .selected');
  const h = hEl ? hEl.textContent : "00";
  const m = mEl ? mEl.textContent : "00";
  const s = sEl ? sEl.textContent : "00";
  document.getElementById(activeField).textContent = shortFormat ? (h + ":" + m) : (h + ":" + m + ":" + s);
  closePicker();
}

function togglePrep() { isPrepActive = !isPrepActive; updatePrepStatus(); }
function updatePrepStatus() {
  const t = tr[currentLang];
  document.getElementById('radioDot').style.display = isPrepActive ? 'block' : 'none';
  document.getElementById('prepToggle').classList.toggle('active', isPrepActive);
  let sl = document.getElementById('statusLabel');
  if (sl) { sl.textContent = isPrepActive ? t.labels.active : t.labels.inactive; sl.style.color = isPrepActive ? '#3cd4a0' : '#8b949e'; }
}

function parseToSec(str) { let p = str.split(':').map(Number); return p.length === 3 ? p[0]*3600 + p[1]*60 + p[2] : p[0]*3600 + p[1]*60; }
function formatTime(s) { let h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = Math.round(s%60); return (h<10?"0":"") + h + ":" + (m<10?"0":"") + m + ":" + (sec<10?"0":"") + sec; }

function calculate() {
  const q = parseFloat(document.getElementById('quantity').value) || 0; if (!q) return;
  const t = tr[currentLang];
  const tpi = parseToSec(document.getElementById('timePerItem').textContent);
  const prep = isPrepActive ? 900 : 0; const norm = (q * tpi) + prep;
  const startStr = document.getElementById('startTime').textContent;
  const start = parseToSec(startStr); const plan = formatTime((start + norm) % 86400);
  const endStr = document.getElementById('endTime').textContent;
  let eff = 0, spent = "--:--:--", spentPer = "--:--:--", neededQty = 0;
  if (endStr !== "00:00:00") {
    let FactS = parseToSec(endStr); let FactT = FactS >= start ? FactS - start : (86400 - start) + FactS;
    eff = Math.round((norm / FactT) * 100); spent = formatTime(FactT);
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
  let html = `<div class="chart-container" style="margin:0 auto 20px;">
    <svg class="chart-svg" viewBox="0 0 160 160"><circle class="chart-bg" cx="80" cy="80" r="70"/><circle class="chart-fill" cx="80" cy="80" r="70" style="stroke:${clr}; stroke-dasharray:440; stroke-dashoffset:${eff===0?440:off};"/></svg>
    <div class="chart-text"><span class="chart-percent" style="color:${clr}">${eff}%</span><span class="chart-label">${t.stats.success}</span></div>
  </div>
  <div class="status-alert ${alrt}" style="text-align:center;"><b>${zn}</b><br><span style="font-size:14px;">${msg}</span></div>
  <div class="legend"><div class="legend-item"><div class="legend-dot" style="background:#f06767"></div>${t.legend[0]}</div><div class="legend-item"><div class="legend-dot" style="background:#ff9800"></div>${t.legend[1]}</div><div class="legend-item"><div class="legend-dot" style="background:#3cd4a0"></div>${t.legend[2]}</div></div>
  <div class="stat-list">
    <div class="stat-item"><div class="item-label"><div class="dot" style="background:#58a6ff"></div>${t.stats.plan}</div><b>${plan}</b></div>
    <div class="stat-item"><div class="item-label"><div class="dot" style="background:#3cd4a0"></div>${t.stats.norm}</div><b>${formatTime(norm)}</b></div>
    <div class="stat-item"><div class="item-label"><div class="dot" style="background:#8b949e"></div>${t.stats.qtyPerHour}</div><b>${maxQph} ${t.dash.pcs||"шт."}</b></div>
    <div class="stat-item"><div class="item-label"><div class="dot" style="background:#58a6ff"></div>${t.stats.forThisTime}</div><b>${neededQty} ${t.dash.pcs||"шт."}</b></div>
    <div class="stat-item"><div class="item-label"><div class="dot" style="background:#ff9800"></div>${t.stats.spent1}</div><b>${spentPer}</b></div>
    <div class="stat-item"><div class="item-label"><div class="dot" style="background:#f06767"></div>${t.stats.spentNorm}</div><b>${spent}</b></div>
    <div class="stat-item"><div class="item-label"><div class="dot" style="background:#8b949e"></div>${t.stats.fact}</div><b>${endStr}</b></div>
  </div>`;
  if (endStr !== "00:00:00") html += `<button class="btn btn-save-res" onclick="openSaveModal(false)">${t.btns.saveRes}</button>`;
  html += "</div>";
  document.getElementById('result').innerHTML = html;
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function openModal(modalId) { let el = document.getElementById(modalId); if (el) el.style.display = 'flex'; }
function closeModal(modalId) { let el = document.getElementById(modalId); if (el) el.style.display = 'none'; }
function toggleAccordion(el) { let c = el.nextElementSibling; if (c) c.style.display = (c.style.display === 'none' ? 'block' : 'none'); }