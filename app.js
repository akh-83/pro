// === НАСТРОЙКИ БАЗЫ ДАННЫХ SUPABASE ===
// ВСТАВЬ СЮДА СВОИ КЛЮЧИ!
const SUPABASE_URL = 'https://apnmlbvefruhagufmpfc.supabase.co';
const SUPABASE_KEY = 'sb_publishable_QE6JAl1XxmOR_0cjGXEJ3g_GvOII0fY';

// Инициализируем подключение к базе
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// НОВЫЙ ДВИЖОК: Полностью заменяет старый apiCall
async function apiCall(action, data) {
    try {
        const workerId = String(data.worker_id || "");
        const tgId = String(data.user_id || "");

        // 1. ПОЛУЧЕНИЕ ДАННЫХ ЮЗЕРА ПРИ ВХОДЕ
        if (action === 'getUserData') {
            const { data: user, error } = await _sb.from('workers').select('*').eq('tg_id', tgId).single();
            if (error && error.code !== 'PGRST116') throw error; // PGRST116 - это норма, значит юзер просто новый
            
            return {
                status: 'success',
                worker_id: user ? user.worker_id : null,
                first_name: user ? user.first_name : "",
                last_name: user ? user.last_name : ""
            };
        }

        // 2. РЕГИСТРАЦИЯ
        if (action === 'registerUser') {
            const { data: exist } = await _sb.from('workers').select('*').eq('worker_id', workerId).single();
            if (exist) {
                // Если номер уже есть, просто привязываем Telegram ID
                await _sb.from('workers').update({ tg_id: tgId }).eq('worker_id', workerId);
            } else {
                // Создаем нового работягу
                await _sb.from('workers').insert([{ tg_id: tgId, worker_id: workerId }]);
            }
            return { status: 'success' };
        }

        // 3. ОБНОВЛЕНИЕ ПРОФИЛЯ (ИМЯ/ФАМИЛИЯ)
        if (action === 'updateProfile') {
            const oldId = String(data.old_worker_id);
            const newId = String(data.new_worker_id);
            
            await _sb.from('workers').update({
                worker_id: newId,
                first_name: data.first_name,
                last_name: data.last_name
            }).eq('worker_id', oldId);
            
            // Если он сменил RCP N, обновляем его и в других таблицах
            if (oldId !== newId) {
                await _sb.from('time_history').update({ worker_id: newId }).eq('worker_id', oldId);
                await _sb.from('pro_history').update({ worker_id: newId }).eq('worker_id', oldId);
            }
            return { status: 'success' };
        }

        // 4. ЗАГРУЗКА ВСЕЙ ИСТОРИИ И НОРМЫ
        if (action === 'getData') {
            const { data: rcpData } = await _sb.from('time_history').select('*').eq('worker_id', workerId);
            const { data: proData } = await _sb.from('pro_history').select('*').eq('worker_id', workerId);

            let rcpHist = [];
            let rcpSt = null;
            (rcpData || []).forEach(row => {
                if (!row.end_time) {
                    rcpSt = { dateStr: row.date_str, start: row.start_time, end: null, timestamp: new Date().getTime() };
                } else {
                    rcpHist.push({ 
                        dateStr: row.date_str, 
                        start: row.start_time, 
                        end: row.end_time, 
                        durationSec: (parseFloat(row.total_hours) || 0) * 3600, 
                        timestamp: new Date().getTime() 
                    });
                }
            });

            let hist = [];
            (proData || []).forEach(row => {
                hist.push({
                    dateStr: row.date_str,
                    pro: row.pro_n,
                    pos: row.pos_num,
                    qty: row.qty,
                    start: row.start_time,
                    end: row.end_time,
                    stan: row.stan,
                    uwagi: row.uwagi,
                    result: parseFloat(row.result_percent) || 0
                });
            });

            return { status: 'success', history: hist, rcpHistory: rcpHist, rcpState: rcpSt };
        }

        // 5. СОХРАНЕНИЕ РАБОЧЕГО ВРЕМЕНИ
        if (action === 'saveRCP') {
            // Удаляем старые записи юзера и пишем свежий массив (работает как часы)
            await _sb.from('time_history').delete().eq('worker_id', workerId);
            
            const rcpH = data.history || [];
            const rcpS = data.state || null;
            let insertData = [];

            rcpH.forEach(item => {
                insertData.push({
                    worker_id: workerId,
                    date_str: item.dateStr,
                    start_time: item.start,
                    end_time: item.end,
                    total_hours: Math.round((item.durationSec || 0) / 3600)
                });
            });

            if (rcpS) {
                insertData.push({ worker_id: workerId, date_str: rcpS.dateStr, start_time: rcpS.start });
            }

            if (insertData.length > 0) {
                await _sb.from('time_history').insert(insertData);
            }
            return { status: 'success' };
        }

        // 6. СОХРАНЕНИЕ НОРМЫ (PRO)
        if (action === 'saveHistory') {
            await _sb.from('pro_history').delete().eq('worker_id', workerId);
            
            const h = data.history || [];
            let insertData = [];

            h.forEach(item => {
                insertData.push({
                    worker_id: workerId,
                    date_str: item.dateStr,
                    pro_n: item.pro,
                    pos_num: item.pos,
                    qty: item.qty,
                    start_time: item.start,
                    end_time: item.end,
                    stan: item.stan,
                    uwagi: item.uwagi,
                    result_percent: item.result
                });
            });

            if (insertData.length > 0) {
                await _sb.from('pro_history').insert(insertData);
            }
            return { status: 'success' };
        }

        return { status: 'success' };
    } catch (err) {
        console.error("ОШИБКА БАЗЫ ДАННЫХ SUPABASE:", err);
        return { status: 'error', message: err.message };
    }
}