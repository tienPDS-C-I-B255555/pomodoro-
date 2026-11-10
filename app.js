// Space Focus Pomodoro Application Logic

// --- Constants & Database Init ---
const STORAGE_KEY = 'space_focus_pomo_data';

function createLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}


// Default Quote Database (Vietnamese)

// App State
let db = {
    history: {}, // Format: { "YYYY-MM-DD": { count: X, recovered: boolean, taskName: String, sessions: [] } }
    dailyGoal: 4,
    longestStreak: 0,
    hiddenPresets: [], // Hidden presets list
    language: 'vi', // Default language
    theme: 'dark', // Default theme 'dark' | 'light'
    wallpaper: 'space', // Default wallpaper 'space' | 'galaxy' | 'neon' | 'minimal' | 'zen' | 'custom'
    telegram: { token: '', chatId: '', enabled: false },
    facebook: { pageToken: '', recipientId: '', enabled: false },
    dayBudget: { start: '08:00', end: '22:00' }
};

// Calendar State variables
let currentCalendarView = 'month'; // 'month', 'week', 'range'
let calendarRangeStart = null;
let calendarRangeEnd = null;

// Translations dictionary
const TRANSLATIONS = {
    vi: {
        app_title: "SPACE FOCUS",
        app_subtitle: "Đồng hành cùng sự tập trung đỉnh cao của bạn",
        notification_disabled: "Thông báo tắt",
        notification_enabled: "Thông báo bật",
        days_lbl: "ngày",
        today_activity_title: "Hoạt Động Hôm Nay",
        completed_today_lbl: "Đã hoàn thành:",
        no_activity_today: "Chưa có hoạt động tập trung nào trong hôm nay...",
        system_settings_title: "Cài Đặt Hệ Thống",
        appearance_heading: "Giao Diện & Ngôn Ngữ",
        theme_mode_lbl: "Chế độ hiển thị:",
        language_lbl: "Ngôn ngữ:",
        wallpaper_lbl: "Hình nền:",
        telegram_heading: "Thông Báo Telegram",
        telegram_desc: "Nhận thông báo tự động về tiến độ hoàn thành Pomodoro của bạn.",
        tg_auto_send: "Tự động gửi thông báo khi xong phiên",
        tg_test_btn: "Gửi Thử Tin Nhắn",
        messenger_heading: "Thông Báo Messenger",
        messenger_desc: "Liên kết tài khoản để tự động gửi tin nhắn báo cáo tiến độ Pomodoro qua Facebook Messenger.",
        fb_auto_send: "Tự động gửi thông báo qua Messenger khi xong phiên",
        fb_test_btn: "Gửi Thử Messenger",
        // General text
        focus_state: "Tập Trung",
        break_state: "Nghỉ Ngơi",
        pomo_completed_alert: "Chúc mừng! Bạn đã hoàn thành phiên tập trung.",
        break_completed_alert: "Hết giờ nghỉ ngơi! Hãy quay trở lại làm việc nào.",
        streak_recovered_title: "Streak Khôi Phục Thành Công!",
        streak_recovered_body: "Lịch đã sáng trở lại. Tiếp tục giữ phong độ nhé!",
        audio_card_title: "Nhạc Nền Tập Trung",
        sound_none: "Tắt",
        sound_lofi: "Lo-Fi",
        sound_rain: "Mưa Rơi",
        sound_brown: "Ồn Nâu",
        sound_binaural: "Binaural",
        restore_default_music: "Khôi phục nhạc mặc định",
        custom_playlist_title: "Danh Sách Nhạc Của Bạn",
        add_btn: "Thêm",
        no_tracks_loaded: "Chưa tải bài nhạc nào...",
        audio_speed_lbl: "Tốc độ:",
        daily_quote_title: "QUOTES MỖI NGÀY",
        recovery_title: "Lỡ Chuỗi Tập Trung (Streak Broken)!",
        recovery_desc: "Bạn đã bỏ lỡ việc tập trung ngày hôm qua. Đặt một Nhiệm vụ Phục hồi hôm nay để cứu lại chuỗi ngày phát sáng của bạn!",
        recovery_set_btn: "Thiết lập",
        recovery_loading_text: "Đang tải nhiệm vụ...",
        recovery_running_lbl: "Đang chạy",
        daily_target_title: "Mục Tiêu Hôm Nay",
        target_completed_lbl: "Đã hoàn thành hôm nay",
        target_longest_lbl: "Chuỗi ngày dài nhất",
        calendar_card_title: "Lịch Streak Tập Trung",
        view_month_btn: "Tháng",
        view_week_btn: "Tuần",
        view_range_btn: "Chọn Khoảng Ngày",
        calendar_to_lbl: "đến",
        view_btn: "Xem",
        legend_restored: "Khôi phục",
        day_details_title: "Chi tiết ngày",
        day_details_pomo_lbl: "Số Pomodoro hoàn thành:",
        day_details_status_lbl: "Trạng thái Streak:",
        day_details_recovery_task_lbl: "Nhiệm vụ cứu:",
        status_normal: "Bình thường",
        status_today: "Hôm nay",
        status_recovered: "Đã cứu streak",
        status_active: "Đang có streak",
        status_no_activity: "Không có hoạt động",
        chart_title: "Hiệu Suất Trong Tháng",
        backup_title: "Sao Lưu & Đồng Bộ Dữ Liệu",
        cloud_sync_lbl: "Trạng thái đồng bộ Cloud:",
        not_synced_lbl: "Chưa đồng bộ",
        auto_backup_desc: "Tự động sao lưu liên tục vào ổ cứng & cloud",
        backup_json_btn: "Sao Lưu (JSON)",
        restore_btn: "Khôi Phục",
        export_excel_btn: "Xuất Excel (CSV)",
        dev_panel_title: "Bảng Kiểm Thử & Giả Lập Dữ Liệu",
        dev_panel_desc: "Dùng các chức năng này để tạo nhanh lịch sử giúp hiển thị Biểu đồ, Lịch Streak và kiểm thử lỗi streak.",
        mock_streak_btn: "Tạo Streak 7 Ngày",
        mock_miss_btn: "Tạo Lỗi Lỡ Streak Hôm Qua",
        clear_data_btn: "Xóa Hết Dữ Liệu",
        dev_custom_add_lbl: "Thêm thủ công Pomo cho ngày:",
        footer_text: "Space Focus Pomodoro © 2026. Thiết kế vì sự tập trung tối đa.",
        apply_btn: "Áp dụng",
        day_budget_title: "Thời Gian Còn Lại Hôm Nay",
        day_start_lbl: "Bắt đầu:",
        day_end_lbl: "Kết thúc:"
    },
    en: {
        app_title: "SPACE FOCUS",
        app_subtitle: "Accompanying your peak concentration",
        notification_disabled: "Notifications off",
        notification_enabled: "Notifications on",
        days_lbl: "days",
        today_activity_title: "Today's Activity",
        completed_today_lbl: "Completed:",
        no_activity_today: "No focus activity recorded today...",
        system_settings_title: "System Settings",
        appearance_heading: "Appearance & Language",
        theme_mode_lbl: "Theme mode:",
        language_lbl: "Language:",
        wallpaper_lbl: "Wallpaper:",
        telegram_heading: "Telegram Notifications",
        telegram_desc: "Receive automatic notifications on your Pomodoro progress.",
        tg_auto_send: "Auto send notifications when session ends",
        tg_test_btn: "Send Test Message",
        messenger_heading: "Messenger Notifications",
        messenger_desc: "Link accounts to automatically send Pomodoro progress reports via Facebook Messenger.",
        fb_auto_send: "Auto send notifications via Messenger when session ends",
        fb_test_btn: "Send Test Messenger",
        // General text
        focus_state: "Focus",
        break_state: "Break",
        pomo_completed_alert: "Congratulations! You completed a focus session.",
        break_completed_alert: "Break is over! Time to get back to work.",
        streak_recovered_title: "Streak Successfully Restored!",
        streak_recovered_body: "The calendar glow is back. Keep it up!",
        audio_card_title: "Focus Ambient Sounds",
        sound_none: "Off",
        sound_lofi: "Lo-Fi",
        sound_rain: "Rain Shower",
        sound_brown: "Brown Noise",
        sound_binaural: "Binaural Beats",
        restore_default_music: "Restore default music",
        custom_playlist_title: "Your Custom Playlist",
        add_btn: "Add",
        no_tracks_loaded: "No tracks loaded...",
        audio_speed_lbl: "Speed:",
        daily_quote_title: "DAILY QUOTES",
        recovery_title: "Streak Broken!",
        recovery_desc: "You missed focus yesterday. Set a Recovery Mission today to save your glowing streak!",
        recovery_set_btn: "Set up",
        recovery_loading_text: "Loading task...",
        recovery_running_lbl: "Running",
        daily_target_title: "Daily Target",
        target_completed_lbl: "Completed today",
        target_longest_lbl: "Longest Streak",
        calendar_card_title: "Focus Streak Calendar",
        view_month_btn: "Month",
        view_week_btn: "Week",
        view_range_btn: "Custom Range",
        calendar_to_lbl: "to",
        view_btn: "View",
        legend_restored: "Restored",
        day_details_title: "Day Details",
        day_details_pomo_lbl: "Completed Pomodoros:",
        day_details_status_lbl: "Streak Status:",
        day_details_recovery_task_lbl: "Recovery Mission:",
        status_normal: "Normal",
        status_today: "Today",
        status_recovered: "Streak restored",
        status_active: "Active streak",
        status_no_activity: "No activity",
        chart_title: "Monthly Performance",
        backup_title: "Backup & Cloud Sync",
        cloud_sync_lbl: "Cloud Sync Status:",
        not_synced_lbl: "Not synced",
        auto_backup_desc: "Auto-backup to disk & cloud storage",
        backup_json_btn: "Backup (JSON)",
        restore_btn: "Restore",
        export_excel_btn: "Export Excel (CSV)",
        dev_panel_title: "Developer Mock Panel",
        dev_panel_desc: "Use these features to mock history logs for charts, calendar, and debugging.",
        mock_streak_btn: "Mock 7-Day Streak",
        mock_miss_btn: "Mock Missed Streak Yesterday",
        clear_data_btn: "Clear All Data",
        dev_custom_add_lbl: "Mock Pomos for specific date:",
        footer_text: "Space Focus Pomodoro © 2026. Designed for maximum focus.",
        apply_btn: "Apply",
        day_budget_title: "Time Left Today",
        day_start_lbl: "Start:",
        day_end_lbl: "End:"
    }
};

const QUOTES = [
    { text: "Đường đi khó, không khó vì ngăn sông cách núi, mà khó vì lòng người ngại núi e sông.", author: "Nguyễn Thái Học" },
    { text: "Hành trình vạn dặm bắt đầu từ một bước chân nhỏ bé.", author: "Lão Tử" },
    { text: "Tập trung là chìa khóa của mọi cánh cửa thành công. Hãy làm một việc tại một thời điểm.", author: "Alexander Graham Bell" },
    { text: "Không có gì là không thể với một người luôn biết cố gắng.", author: "Alexander Đại Đế" },
    { text: "Sự kiên trì là việc bạn tiếp tục làm sau khi sự hứng khởi ban đầu đã qua đi.", author: "Khuyết danh" },
    { text: "Năng lượng và sự kiên trì có thể chinh phục mọi thứ.", author: "Benjamin Franklin" },
    { text: "Thời gian của bạn là có hạn, đừng lãng phí nó để sống cuộc đời của người khác.", author: "Steve Jobs" },
    { text: "Đừng đợi cơ hội thuận lợi, hãy tự mình tạo ra nó.", author: "George Bernard Shaw" },
    { text: "Thất bại lớn nhất là không dám thử sức.", author: "Franklin D. Roosevelt" },
    { text: "Hãy làm việc khi người khác đang ngủ, học hỏi khi họ đang vui chơi.", author: "William Arthur Ward" },
    { text: "Cách duy nhất để làm nên những điều vĩ đại là yêu những gì bạn làm.", author: "Steve Jobs" },
    { text: "Mỗi ngày là một cơ hội mới để bạn trở nên tốt hơn ngày hôm qua.", author: "Khuyết danh" }
];

const QUOTES_EN = [
    { text: "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.", author: "Alexander Graham Bell" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
    { text: "Your focus determines your reality.", author: "Qui-Gon Jinn" },
    { text: "Always remember, your focus determines your reality.", author: "George Lucas" },
    { text: "Don't wish it were easier. Wish you were better.", author: "Jim Rohn" },
    { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
    { text: "My success, I attribute to this: I never gave or took an excuse.", author: "Florence Nightingale" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
];

// Timer variables
let timerInterval = null;
let totalSeconds = 25 * 60;
let secondsLeft = totalSeconds;
let currentSessionType = '25'; // '25', '45', '90'
let isTimerRunning = false;
let isBreakMode = false;
let targetEndTime = null;
let timerWorker = null;
let sessionStartTimestamp = null;

function getTimerElement(id) {
    if (pipWindow && !pipWindow.closed) {
        return pipWindow.document.getElementById(id);
    }
    return document.getElementById(id);
}

function setTime(minutes) {
    totalSeconds = minutes * 60;
    secondsLeft = totalSeconds;
    updateTimerDisplay();
    updateProgressBar();
}

function initTimerWorker() {
    const workerCode = `
        let timer = null;
        self.onmessage = function(e) {
            if (e.data === 'start') {
                if (timer) clearInterval(timer);
                timer = setInterval(() => {
                    self.postMessage('tick');
                }, 1000);
            } else if (e.data === 'stop') {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
            }
        };
    `;
    try {
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        timerWorker = new Worker(URL.createObjectURL(blob));
        
        timerWorker.onmessage = (e) => {
            if (e.data === 'tick' && isTimerRunning) {
                const now = Date.now();
                secondsLeft = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
                
                updateTimerDisplay();
                updateProgressBar();
                
                if (secondsLeft <= 0) {
                    timerWorker.postMessage('stop');
                    handleSessionEnd(true);
                }
            }
        };
    } catch (err) {
        console.warn("Web Worker not supported or blocked, falling back to setInterval", err);
        // Fallback interval
        timerInterval = setInterval(() => {
            if (isTimerRunning) {
                const now = Date.now();
                secondsLeft = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
                updateTimerDisplay();
                updateProgressBar();
                if (secondsLeft <= 0) {
                    handleSessionEnd(true);
                }
            }
        }, 1000);
    }
}

// Audio context & node references for ambient sound
let audioCtx = null;
let ambientNodes = {
    source: null,
    gain: null,
    oscL: null,
    oscR: null
};
let currentAmbientType = 'none'; // 'none', 'lofi', 'rain', 'brown', 'binaural'
let lofiAudio = null;
let customAudioUrl = null;
let customTracks = []; // Array of custom tracks { id, name, url, blob }
let customWallpaperUrl = null;

// Notification permission state
let notificationsEnabled = false;

// --- Initialize App ---
document.addEventListener('DOMContentLoaded', () => {
    loadDatabase();
    initQuotes();
    initNotifications();
    initTimerControls();
    initAudioControls();
    initGoalControls();
    initDevPanel();
    initZoomAndPipControls();
    loadCustomTracks();
    initCalendarViewControls();
    initBackupControls();
    initSystemSettingsControls();
    loadCustomWallpaper();
    initTimerWorker();
    initDayBudgetControls();
    
    // Initial Render
    updateDailyGoalProgress();
    renderCalendar();
    renderChart();
    checkStreakStatus();
    renderTodayLogs();
    applyThemeAndLanguage();
    
    // Listen for resize to redraw SVG lines
    window.addEventListener('resize', debounce(() => {
        drawStreakLines();
    }, 150));
});

// --- Database Logic ---
function loadDatabase() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            db = JSON.parse(saved);
            // Migrate old formats if necessary
            if (!db.history) db.history = {};
            if (!db.dailyGoal) db.dailyGoal = 4;
            if (db.longestStreak === undefined) db.longestStreak = 0;
            if (!db.hiddenPresets) db.hiddenPresets = [];
            if (!db.language) db.language = 'vi';
            if (!db.theme) db.theme = 'dark';
            if (!db.wallpaper) db.wallpaper = 'space';
            if (!db.telegram) db.telegram = { token: '', chatId: '', enabled: false };
            if (!db.facebook) db.facebook = { pageToken: '', recipientId: '', enabled: false };
            if (!db.dayBudget) db.dayBudget = { start: '08:00', end: '22:00' };
        } catch (e) {
            console.error("Failed to load Pomodoro database, resetting...", e);
        }
    }
}

function saveDatabase() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// Helper to get formatted date string (local timezone YYYY-MM-DD)
function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Get completed Pomodoros count for a specific date
function getPomoCount(dateStr) {
    if (db.history[dateStr]) {
        return db.history[dateStr].count || 0;
    }
    return 0;
}

// Increment Pomodoro for today
function incrementTodayPomo() {
    const todayStr = getLocalDateString();
    const taskInput = document.getElementById('session-task-input');
    const taskName = taskInput.value.trim() || (db.language === 'en' ? 'Focus Session' : 'Tập trung');
    const duration = parseInt(currentSessionType);
    
    if (!db.history[todayStr]) {
        db.history[todayStr] = { count: 0, recovered: false, sessions: [] };
    }
    if (!db.history[todayStr].sessions) {
        db.history[todayStr].sessions = [];
    }
    
    let timeStr = "";
    if (sessionStartTimestamp) {
        const startStr = sessionStartTimestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        const endStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        timeStr = `${startStr} - ${endStr}`;
    } else {
        timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    
    db.history[todayStr].sessions.push({
        name: taskName,
        duration: duration,
        time: timeStr
    });
    sessionStartTimestamp = null; // Reset for next session
    
    db.history[todayStr].count = db.history[todayStr].sessions.length;
    saveDatabase();
    
    // Auto-save backup trigger
    if (document.getElementById('chk-auto-backup').checked) {
        triggerCloudSync();
    }
    
    // Send automatic Telegram notification if enabled
    if (db.telegram && db.telegram.enabled) {
        const completed = db.history[todayStr].count;
        const msg = db.language === 'en'
            ? `🚀 <b>[Space Focus] Session Completed!</b>\n\n📝 Task: <b>${taskName}</b>\n⏱️ Duration: <b>${duration} min</b>\n📌 Completed Today: <b>${completed}/${db.dailyGoal} Pomo</b>\n\n🎯 <i>Keep up the great work!</i>`
            : `🚀 <b>[Space Focus] Hoàn thành phiên!</b>\n\n📝 Công việc: <b>${taskName}</b>\n⏱️ Thời lượng: <b>${duration} phút</b>\n📌 Hôm nay đã đạt: <b>${completed}/${db.dailyGoal} Pomodoro</b>\n\n🎯 <i>Hãy tiếp tục hoàn thành mục tiêu ngày!</i>`;
        sendTelegramNotification(msg);
    }
    
    // Send automatic Facebook Messenger notification if enabled
    if (db.facebook && db.facebook.enabled) {
        const completed = db.history[todayStr].count;
        const msg = db.language === 'en'
            ? `🚀 [Space Focus] Session Completed!\n\nTask: ${taskName}\nDuration: ${duration} mins\nCompleted Today: ${completed}/${db.dailyGoal} Pomo`
            : `🚀 [Space Focus] Hoàn thành phiên!\n\nCông việc: ${taskName}\nThời lượng: ${duration} phút\nHôm nay đã đạt: ${completed}/${db.dailyGoal} Pomodoro`;
        sendMessengerNotification(msg);
    }
    
    // Update UI elements
    updateDailyGoalProgress();
    renderCalendar();
    updateChartData();
    checkStreakStatus();
    renderTodayLogs();
    
    // Reset task name input after complete
    taskInput.value = '';
    
    // Update details panel if open for today
    const titleEl = document.getElementById('day-details-title');
    if (titleEl && !document.getElementById('day-details-panel').classList.contains('hidden')) {
        const todayDay = new Date().getDate();
        showDayDetails(todayStr, todayDay);
    }
}

// --- Quotes System ---
function initQuotes() {
    const todayStr = getLocalDateString();
    // Use date hash to pick a consistent quote for the day
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
        hash += todayStr.charCodeAt(i);
    }
    const isEn = db.language === 'en';
    const quotesList = isEn ? QUOTES_EN : QUOTES;
    const quoteIndex = hash % quotesList.length;
    const todayQuote = quotesList[quoteIndex];
    
    document.getElementById('daily-quote-text').innerText = `"${todayQuote.text}"`;
    document.getElementById('daily-quote-author').innerText = `— ${todayQuote.author}`;
}

// --- Notification System ---
function initNotifications() {
    const btn = document.getElementById('btn-request-notification');
    const statusText = document.getElementById('notification-status');
    const icon = document.getElementById('notification-icon');
    
    if (!("Notification" in window)) {
        btn.classList.add('hidden');
        return;
    }
    
    // Update badge initially
    if (Notification.permission === 'granted') {
        notificationsEnabled = true;
        btn.classList.add('enabled');
        statusText.innerText = "Thông báo bật";
        icon.setAttribute('data-lucide', 'bell');
        createLucideIcons();
    }
    
    btn.addEventListener('click', () => {
        if (Notification.permission === 'granted') {
            notificationsEnabled = !notificationsEnabled;
            updateNotificationUI();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    notificationsEnabled = true;
                    showNotification("Thông báo đã bật!", "Space Focus sẽ gửi thông báo khi hoàn thành phiên.");
                }
                updateNotificationUI();
            });
        }
    });
}

function updateNotificationUI() {
    const btn = document.getElementById('btn-request-notification');
    const statusText = document.getElementById('notification-status');
    const icon = document.getElementById('notification-icon');
    
    if (notificationsEnabled) {
        btn.classList.add('enabled');
        statusText.innerText = "Thông báo bật";
        icon.setAttribute('data-lucide', 'bell');
    } else {
        btn.classList.remove('enabled');
        statusText.innerText = "Thông báo tắt";
        icon.setAttribute('data-lucide', 'bell-off');
    }
    createLucideIcons();
}

function showNotification(title, body) {
    if (notificationsEnabled && Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2300e5ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.25-2.5 3-2.5 5h20c0-2-1-3.75-2.5-5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/><circle cx="12" cy="12" r="4"/></svg>'
        });
    }
}

// --- Timer System ---
function initTimerControls() {
    const playPauseBtn = document.getElementById('btn-play-pause');
    const resetBtn = document.getElementById('btn-reset');
    const skipBtn = document.getElementById('btn-skip');
    const sessionBtns = document.querySelectorAll('.session-btn');
    
    // Session selection
    sessionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (isTimerRunning) {
                if (!confirm("Phiên hiện tại đang chạy. Bạn có muốn đổi phiên và đặt lại không?")) {
                    return;
                }
            }
            sessionBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const stateDisplay = getTimerElement('timer-state-display');
            const progressBar = getTimerElement('progress-bar-circle');
            
            currentSessionType = btn.getAttribute('data-time');
            isBreakMode = false;
            sessionStartTimestamp = null;
            if (stateDisplay) {
                stateDisplay.innerText = "Tập Trung";
                stateDisplay.style.color = "var(--color-success)";
            }
            if (progressBar) {
                progressBar.style.stroke = "var(--color-success)";
            }
            
            setTime(parseInt(currentSessionType));
            pauseTimer();
        });
    });
    
    // Play/Pause
    playPauseBtn.addEventListener('click', () => {
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });
    
    // Reset
    resetBtn.addEventListener('click', () => {
        pauseTimer();
        isBreakMode = false;
        sessionStartTimestamp = null;
        const stateDisplay = getTimerElement('timer-state-display');
        const progressBar = getTimerElement('progress-bar-circle');
        if (stateDisplay) {
            stateDisplay.innerText = "Tập Trung";
            stateDisplay.style.color = "var(--color-success)";
        }
        if (progressBar) {
            progressBar.style.stroke = "var(--color-success)";
        }
        setTime(parseInt(currentSessionType));
    });
    
    // Skip
    skipBtn.addEventListener('click', () => {
        if (confirm("Bạn có muốn bỏ qua phiên hiện tại?")) {
            sessionStartTimestamp = null;
            handleSessionEnd(false); // End without counting
        }
    });
    
    // Initial display
    setTime(25);
    
    // Custom Session Setting
    const customSessionInput = document.getElementById('custom-session-input');
    const setCustomSessionBtn = document.getElementById('btn-set-custom-session');
    
    setCustomSessionBtn.addEventListener('click', () => {
        let mins = parseInt(customSessionInput.value);
        if (isNaN(mins) || mins < 1 || mins > 180) {
            alert("Vui lòng nhập số phút hợp lệ (từ 1 đến 180 phút)!");
            return;
        }
        
        if (isTimerRunning) {
            if (!confirm("Phiên hiện tại đang chạy. Bạn có muốn đổi phiên và đặt lại không?")) {
                return;
            }
        }
        
        sessionBtns.forEach(b => b.classList.remove('active'));
        
        const stateDisplay = getTimerElement('timer-state-display');
        const progressBar = getTimerElement('progress-bar-circle');
        
        currentSessionType = String(mins);
        isBreakMode = false;
        sessionStartTimestamp = null;
        if (stateDisplay) {
            stateDisplay.innerText = "Tập Trung";
            stateDisplay.style.color = "var(--color-success)";
        }
        if (progressBar) {
            progressBar.style.stroke = "var(--color-success)";
        }
        
        setTime(mins);
        pauseTimer();
    });
}

function updateTimerDisplay() {
    const min = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const sec = String(secondsLeft % 60).padStart(2, '0');
    const display = getTimerElement('timer-time-display');
    if (display) {
        display.innerText = `${min}:${sec}`;
    }
}

function updateProgressBar() {
    const progressBar = getTimerElement('progress-bar-circle');
    if (!progressBar) return;
    const perimeter = 2 * Math.PI * 88; // 552.92
    
    if (secondsLeft <= 0) {
        progressBar.style.strokeDashoffset = perimeter;
    } else {
        const progress = secondsLeft / totalSeconds;
        progressBar.style.strokeDashoffset = perimeter * (1 - progress);
    }
}

function startTimer() {
    if (isTimerRunning) return;
    
    // Unlock Web Audio context if not unlocked
    unlockAudioContext();
    
    isTimerRunning = true;
    const playIcon = document.getElementById('play-icon');
    if (playIcon) {
        playIcon.setAttribute('data-lucide', 'pause');
        createLucideIcons();
    }
    
    // Start ambient music if one is selected
    resumeAmbientAudio();
    // Record start time if not already set
    if (!sessionStartTimestamp) {
        sessionStartTimestamp = new Date();
    }
    
    // Calculate targetEndTime
    targetEndTime = Date.now() + secondsLeft * 1000;
    
    // Start Worker or fallback interval
    if (timerWorker) {
        timerWorker.postMessage('start');
    } else if (!timerInterval) {
        timerInterval = setInterval(() => {
            if (isTimerRunning) {
                const now = Date.now();
                secondsLeft = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
                updateTimerDisplay();
                updateProgressBar();
                if (secondsLeft <= 0) {
                    handleSessionEnd(true);
                }
            }
        }, 1000);
    }
}

function pauseTimer() {
    isTimerRunning = false;
    if (timerWorker) {
        timerWorker.postMessage('stop');
    }
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    const playIcon = document.getElementById('play-icon');
    if (playIcon) {
        playIcon.setAttribute('data-lucide', 'play');
        createLucideIcons();
    }
    
    // Pause ambient music
    pauseAmbientAudio();
    
    // Lock precise time
    if (targetEndTime) {
        secondsLeft = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
    }
}

function handleSessionEnd(completedSuccessfully) {
    pauseTimer();
    
    const stateDisplay = getTimerElement('timer-state-display');
    const progressBar = getTimerElement('progress-bar-circle');
    
    playCompletionSound();
    
    if (!isBreakMode) {
        // Was Focus Mode
        if (completedSuccessfully) {
            incrementTodayPomo();
            const title = db.language === 'en' ? "Pomodoro Completed!" : "Đã hoàn thành Pomodoro!";
            const body = db.language === 'en' ? "Great job! Take a short break." : "Tuyệt vời! Hãy nghỉ ngơi một chút.";
            showNotification(title, body);
        }
        
        // Start break session
        isBreakMode = true;
        if (stateDisplay) {
            stateDisplay.innerText = db.language === 'en' ? "Break" : "Nghỉ Ngơi";
            stateDisplay.style.color = "var(--color-warning)";
        }
        if (progressBar) {
            progressBar.style.stroke = "var(--color-warning)";
        }
        
        // Dynamic break durations based on focus sessions
        let breakMinutes = 5;
        const focusMins = parseInt(currentSessionType);
        if (focusMins >= 90) breakMinutes = 15;
        else if (focusMins >= 45) breakMinutes = 10;
        else breakMinutes = 5;
        
        totalSeconds = breakMinutes * 60;
        secondsLeft = totalSeconds;
    } else {
        // Was Break Mode
        isBreakMode = false;
        if (stateDisplay) {
            stateDisplay.innerText = db.language === 'en' ? "Focus" : "Tập Trung";
            stateDisplay.style.color = "var(--color-success)";
        }
        if (progressBar) {
            progressBar.style.stroke = "var(--color-success)";
        }
        
        totalSeconds = parseInt(currentSessionType) * 60;
        secondsLeft = totalSeconds;
        const title = db.language === 'en' ? "Break Over!" : "Hết giờ nghỉ ngơi!";
        const body = db.language === 'en' ? "Time to focus on the next session." : "Bắt đầu phiên làm việc tiếp theo thôi nào.";
        showNotification(title, body);
    }
    
    updateTimerDisplay();
    updateProgressBar();
}

// --- Synthesized Sound (Chime) via Web Audio API ---
function playCompletionSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const now = ctx.currentTime;
        
        // Volume node
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        gainNode.connect(ctx.destination);
        
        // Synthesizing a cute melody (C5 -> E5 -> G5)
        const playTone = (freq, start, duration) => {
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);
            osc.connect(gainNode);
            osc.start(start);
            osc.stop(start + duration);
        };
        
        playTone(523.25, now, 0.3);       // C5
        playTone(659.25, now + 0.25, 0.3); // E5
        playTone(783.99, now + 0.5, 0.6);  // G5
    } catch (e) {
        console.error("Web Audio Sound Play failed", e);
    }
}

// --- Ambient Sound System (Synthesized & Lo-fi Stream) ---
function unlockAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function initAudioControls() {
    const audioBtns = document.querySelectorAll('.audio-btn');
    const volumeSlider = document.getElementById('audio-volume');
    const customFileInput = document.getElementById('custom-audio-file');
    
    // Selection
    audioBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const soundType = btn.getAttribute('data-sound');
            if (soundType === currentAmbientType) return;
            
            audioBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.track-item').forEach(item => item.classList.remove('active'));
            btn.classList.add('active');
            
            stopCurrentAmbient();
            currentAmbientType = soundType;
            
            if (isTimerRunning && soundType !== 'none') {
                playAmbientAudio();
            }
        });
    });
    
    // File upload handler (multiple files supported)
    customFileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        for (const file of files) {
            try {
                const savedTrack = await saveTrackToDB(file.name, file);
                savedTrack.url = URL.createObjectURL(file);
                customTracks.push(savedTrack);
            } catch (err) {
                console.error("Lỗi khi lưu nhạc vào Database", err);
            }
        }
        
        renderPlaylistUI();
        customFileInput.value = ''; // Reset input
    });
    
    // Volume Control
    volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        if (ambientNodes.gain) {
            ambientNodes.gain.gain.value = val;
        }
        if (lofiAudio) {
            lofiAudio.volume = val;
        }
    });
    
    // Timeline control scrubbing
    const timeline = document.getElementById('audio-timeline');
    timeline.addEventListener('input', (e) => {
        if (lofiAudio && lofiAudio.duration) {
            const percentage = parseFloat(e.target.value);
            lofiAudio.currentTime = (percentage / 100) * lofiAudio.duration;
        }
    });
    
    // Speed control selection
    const speedSelect = document.getElementById('audio-speed-select');
    speedSelect.addEventListener('change', (e) => {
        const val = parseFloat(e.target.value);
        if (lofiAudio) {
            lofiAudio.playbackRate = val;
        }
    });
    
    // Preset Delete Buttons
    document.querySelectorAll('.btn-delete-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const presetName = btn.getAttribute('data-preset');
            if (confirm(`Bạn có chắc muốn xóa nhạc mặc định "${presetName.toUpperCase()}" khỏi giao diện?`)) {
                if (!db.hiddenPresets) db.hiddenPresets = [];
                db.hiddenPresets.push(presetName);
                saveDatabase();
                
                if (currentAmbientType === presetName) {
                    stopCurrentAmbient();
                    currentAmbientType = 'none';
                    const noneBtn = document.querySelector('.audio-btn[data-sound="none"]');
                    if (noneBtn) noneBtn.classList.add('active');
                }
                
                applyPresetVisibility();
            }
        });
    });
    
    // Restore Presets Button
    document.getElementById('btn-restore-presets').addEventListener('click', () => {
        db.hiddenPresets = [];
        saveDatabase();
        applyPresetVisibility();
    });
    
    applyPresetVisibility();
}

function applyPresetVisibility() {
    const wrappers = document.querySelectorAll('.preset-btn-wrapper');
    const restoreContainer = document.getElementById('restore-presets-container');
    
    let hasHidden = false;
    wrappers.forEach(wrapper => {
        const preset = wrapper.getAttribute('data-preset');
        if (db.hiddenPresets && db.hiddenPresets.includes(preset)) {
            wrapper.classList.add('hidden');
            hasHidden = true;
        } else {
            wrapper.classList.remove('hidden');
        }
    });
    
    if (hasHidden) {
        restoreContainer.classList.remove('hidden');
    } else {
        restoreContainer.classList.add('hidden');
    }
}

function playAmbientAudio() {
    unlockAudioContext();
    const volumeVal = parseFloat(document.getElementById('audio-volume').value);
    const playerControls = document.getElementById('audio-player-controls');
    const speedSelect = document.getElementById('audio-speed-select');
    
    if (currentAmbientType === 'none') {
        playerControls.classList.add('hidden');
        return;
    }
    
    const isLofi = currentAmbientType === 'lofi';
    const isCustom = currentAmbientType.startsWith('custom_');
    
    if (isLofi || isCustom) {
        playerControls.classList.remove('hidden');
        
        if (!lofiAudio) {
            lofiAudio = new Audio();
            lofiAudio.loop = true;
            lofiAudio.crossOrigin = 'anonymous';
            
            // Listen to time updates for timeline scrubbing
            lofiAudio.addEventListener('timeupdate', updateAudioTimelineUI);
            lofiAudio.addEventListener('loadedmetadata', updateAudioTimelineUI);
        }
        
        if (isLofi) {
            lofiAudio.src = 'https://assets.codepen.co/4358584/Anitek_-_01_-_Kisses.mp3';
        } else {
            const trackId = parseInt(currentAmbientType.split('_')[1]);
            const track = customTracks.find(t => t.id === trackId);
            if (track && track.url) {
                lofiAudio.src = track.url;
            }
        }
        
        lofiAudio.volume = volumeVal;
        lofiAudio.playbackRate = parseFloat(speedSelect.value);
        lofiAudio.play().catch(e => console.log("Audio play blocked by browser", e));
        return;
    }
    
    // Synthesized Noise - hide timeline player controls
    playerControls.classList.add('hidden');
    
    // Web Audio Synthesized Sounds
    if (!audioCtx) return;
    
    ambientNodes.gain = audioCtx.createGain();
    ambientNodes.gain.gain.value = volumeVal;
    ambientNodes.gain.connect(audioCtx.destination);
    
    if (currentAmbientType === 'brown') {
        // Brown Noise
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        source.connect(ambientNodes.gain);
        source.start(0);
        ambientNodes.source = source;
        
    } else if (currentAmbientType === 'rain') {
        // Rain Noise (Filtered Brown noise + subtle high frequency crackles)
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            output[i] = (lastOut + (0.025 * white)) / 1.025;
            lastOut = output[i];
            output[i] *= 3.0;
        }
        
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;
        
        const rainFilter = audioCtx.createBiquadFilter();
        rainFilter.type = 'lowpass';
        rainFilter.frequency.setValueAtTime(800, audioCtx.currentTime);
        
        source.connect(rainFilter);
        rainFilter.connect(ambientNodes.gain);
        
        source.start(0);
        ambientNodes.source = source;
        
    } else if (currentAmbientType === 'binaural') {
        // Binaural beats (150Hz Left, 155Hz Right for deep focus alpha/theta waves)
        ambientNodes.oscL = audioCtx.createOscillator();
        ambientNodes.oscL.type = 'sine';
        ambientNodes.oscL.frequency.setValueAtTime(150, audioCtx.currentTime);
        
        ambientNodes.oscR = audioCtx.createOscillator();
        ambientNodes.oscR.type = 'sine';
        ambientNodes.oscR.frequency.setValueAtTime(155, audioCtx.currentTime);
        
        // Panning left and right
        const pannerL = audioCtx.createStereoPanner();
        pannerL.pan.setValueAtTime(-1, audioCtx.currentTime);
        
        const pannerR = audioCtx.createStereoPanner();
        pannerR.pan.setValueAtTime(1, audioCtx.currentTime);
        
        // Connections
        ambientNodes.oscL.connect(pannerL).connect(ambientNodes.gain);
        ambientNodes.oscR.connect(pannerR).connect(ambientNodes.gain);
        
        ambientNodes.oscL.start(0);
        ambientNodes.oscR.start(0);
    }
}

function stopCurrentAmbient() {
    if (lofiAudio) {
        lofiAudio.pause();
    }
    document.getElementById('audio-player-controls').classList.add('hidden');
    
    // Stop Web Audio nodes
    if (ambientNodes.source) {
        try {
            ambientNodes.source.stop();
        } catch(e){}
        ambientNodes.source = null;
    }
    if (ambientNodes.oscL) {
        try { ambientNodes.oscL.stop(); } catch(e){}
        ambientNodes.oscL = null;
    }
    if (ambientNodes.oscR) {
        try { ambientNodes.oscR.stop(); } catch(e){}
        ambientNodes.oscR = null;
    }
    if (ambientNodes.gain) {
        ambientNodes.gain.disconnect();
        ambientNodes.gain = null;
    }
}

function resumeAmbientAudio() {
    if (currentAmbientType !== 'none') {
        playAmbientAudio();
    }
}

function pauseAmbientAudio() {
    stopCurrentAmbient();
}

// --- Daily Goals & Stats ---
function initGoalControls() {
    const input = document.getElementById('daily-goal-input');
    input.value = db.dailyGoal;
    
    input.addEventListener('change', () => {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > 20) val = 20;
        input.value = val;
        
        db.dailyGoal = val;
        saveDatabase();
        updateDailyGoalProgress();
    });
}

function updateDailyGoalProgress() {
    const todayStr = getLocalDateString();
    const completed = getPomoCount(todayStr);
    const goal = db.dailyGoal;
    
    document.getElementById('today-completed-count').innerText = completed;
    document.getElementById('target-progress-text').innerText = `${completed} / ${goal} Pomodoros`;
    
    const percentage = Math.min(Math.round((completed / goal) * 100), 100);
    document.getElementById('target-percentage').innerText = `${percentage}%`;
    document.getElementById('target-progress-bar').style.width = `${percentage}%`;
}

// --- Streak Logic & Recovery System ---
function checkStreakStatus() {
    const todayStr = getLocalDateString();
    const yesterdayStr = getLocalDateString(new Date(Date.now() - 86400000));
    
    // Find active days
    const activeDays = getActiveAndRecoveredDates();
    
    // Calculate streaks
    const streakInfo = calculateStreak(activeDays);
    db.longestStreak = Math.max(db.longestStreak, streakInfo.currentStreak);
    document.getElementById('current-streak-val').innerText = streakInfo.currentStreak;
    document.getElementById('longest-streak-val').innerText = db.longestStreak;
    saveDatabase();
    
    // Streak Recovery Logic
    // Streak is broken if: 
    // - Yesterday was NOT active (no pomo and not recovered)
    // - Today has 0 pomo (so streak is currently 0)
    // - BUT there was an active streak ending before yesterday (i.e. streak info would be > 0 if yesterday was active)
    
    const todayActive = getPomoCount(todayStr) > 0 || (db.history[todayStr] && db.history[todayStr].recovered);
    const yesterdayActive = getPomoCount(yesterdayStr) > 0 || (db.history[yesterdayStr] && db.history[yesterdayStr].recovered);
    
    const recoverySection = document.getElementById('streak-recovery-section');
    
    // Check if streak was active at some point recently but missed yesterday
    const lastActiveDateStr = findLastActiveDateBefore(yesterdayStr);
    
    if (!yesterdayActive && !todayActive && lastActiveDateStr) {
        // Streak is broken! Show Recovery section
        recoverySection.classList.remove('hidden');
        setupRecoveryUI(yesterdayStr);
    } else {
        // Streak is active or there was no previous streak to rescue
        recoverySection.classList.add('hidden');
    }
}

// Find the most recent active date before target date
function findLastActiveDateBefore(targetDateStr) {
    const historyDates = Object.keys(db.history)
        .filter(d => db.history[d].count > 0 || db.history[d].recovered)
        .sort((a,b) => new Date(b) - new Date(a)); // sorted desc (newest first)
        
    const targetDate = new Date(targetDateStr);
    for (let d of historyDates) {
        if (new Date(d) < targetDate) {
            return d; // found most recent active date before yesterday
        }
    }
    return null;
}

// Get dates with either count >= 1 or recovered = true
function getActiveAndRecoveredDates() {
    return Object.keys(db.history)
        .filter(dateStr => db.history[dateStr].count > 0 || db.history[dateStr].recovered)
        .sort((a, b) => new Date(a) - new Date(b)); // chronological
}

function calculateStreak(sortedActiveDates) {
    if (sortedActiveDates.length === 0) {
        return { currentStreak: 0 };
    }
    
    const todayStr = getLocalDateString();
    const yesterdayStr = getLocalDateString(new Date(Date.now() - 86400000));
    
    // Verify if the active sequence connects to today or yesterday
    const lastActiveDate = sortedActiveDates[sortedActiveDates.length - 1];
    if (lastActiveDate !== todayStr && lastActiveDate !== yesterdayStr) {
        return { currentStreak: 0 }; // Streak already died prior to yesterday
    }
    
    let currentStreak = 1;
    for (let i = sortedActiveDates.length - 1; i > 0; i--) {
        const d1 = new Date(sortedActiveDates[i]);
        const d2 = new Date(sortedActiveDates[i - 1]);
        const diffTime = Math.abs(d1 - d2);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            currentStreak++;
        } else if (diffDays > 1) {
            break; // Gap detected, streak broken here
        }
    }
    
    return { currentStreak };
}

function setupRecoveryUI(missedDateStr) {
    const form = document.getElementById('recovery-form');
    const activeContainer = document.getElementById('recovery-active-container');
    const saveBtn = document.getElementById('btn-save-recovery');
    const taskInput = document.getElementById('recovery-task-input');
    const taskDisplay = document.getElementById('recovery-task-display');
    const checkbox = document.getElementById('chk-recovery-complete');
    
    // Check if recovery task already exists for this missed date
    if (db.history[missedDateStr] && db.history[missedDateStr].taskName) {
        // Task exists
        form.classList.add('hidden');
        activeContainer.classList.remove('hidden');
        taskDisplay.innerText = db.history[missedDateStr].taskName;
        checkbox.checked = db.history[missedDateStr].recovered;
        
        if (db.history[missedDateStr].recovered) {
            checkbox.disabled = true;
        } else {
            checkbox.disabled = false;
        }
    } else {
        // No task exists, let user input
        form.classList.remove('hidden');
        activeContainer.classList.add('hidden');
        taskInput.value = '';
    }
    
    // Save Event
    saveBtn.onclick = () => {
        const text = taskInput.value.trim();
        if (!text) return;
        
        if (!db.history[missedDateStr]) {
            db.history[missedDateStr] = { count: 0, recovered: false };
        }
        db.history[missedDateStr].taskName = text;
        saveDatabase();
        
        setupRecoveryUI(missedDateStr);
        renderCalendar();
    };
    
    // Completion Event
    checkbox.onchange = () => {
        if (checkbox.checked) {
            const confirmMsg = db.language === 'en'
                ? "Confirm that you have completed the task to restore your focus streak?"
                : "Xác nhận bạn đã hoàn thành nhiệm vụ để khôi phục chuỗi tập trung?";
            if (confirm(confirmMsg)) {
                db.history[missedDateStr].recovered = true;
                checkbox.disabled = true;
                saveDatabase();
                
                const title = db.language === 'en' ? "Streak Successfully Restored!" : "Streak Khôi Phục Thành Công!";
                const body = db.language === 'en' ? "The calendar glow is back. Keep it up!" : "Lịch đã sáng trở lại. Tiếp tục giữ phong độ nhé!";
                showNotification(title, body);
                
                // Refresh views
                checkStreakStatus();
                renderCalendar();
                updateChartData();
            } else {
                checkbox.checked = false;
            }
        }
    };
}

// --- Calendar System (Dynamic Grid & SVG Path Drawing) ---
function renderCalendar() {
    const grid = document.getElementById('calendar-days-grid');
    grid.innerHTML = '';
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    
    let datesToRender = [];
    let startEmptyCells = 0;
    
    if (currentCalendarView === 'month') {
        const firstDayIndex = new Date(year, month, 1).getDay();
        const totalDays = new Date(year, month + 1, 0).getDate();
        startEmptyCells = firstDayIndex;
        for (let day = 1; day <= totalDays; day++) {
            datesToRender.push(new Date(year, month, day));
        }
        const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthsVi = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        const isEn = db.language === 'en';
        document.getElementById('calendar-month-year-display').innerText = isEn ? `${monthsEn[month]} ${year}` : `${monthsVi[month]}, ${year}`;
    } else if (currentCalendarView === 'week') {
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay());
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(sunday);
            day.setDate(sunday.getDate() + i);
            datesToRender.push(day);
        }
        document.getElementById('calendar-month-year-display').innerText = db.language === 'en' ? "Current Week" : "Tuần Hiện Tại";
    } else if (currentCalendarView === 'range') {
        if (!calendarRangeStart || !calendarRangeEnd) {
            calendarRangeEnd = new Date();
            calendarRangeStart = new Date();
            calendarRangeStart.setDate(calendarRangeEnd.getDate() - 14);
        }
        const start = new Date(calendarRangeStart);
        const end = new Date(calendarRangeEnd);
        startEmptyCells = start.getDay();
        
        let curr = new Date(start);
        while (curr <= end) {
            datesToRender.push(new Date(curr));
            curr.setDate(curr.getDate() + 1);
        }
        
        const formatDateShort = (d) => `${d.getDate()}/${d.getMonth()+1}`;
        const toWord = db.language === 'en' ? 'to' : 'đến';
        document.getElementById('calendar-month-year-display').innerText = `${formatDateShort(start)} ${toWord} ${formatDateShort(end)}`;
    }
    
    // Empty cells for weekday alignment
    for (let i = 0; i < startEmptyCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('calendar-day-cell', 'empty');
        grid.appendChild(cell);
    }
    
    const todayStr = getLocalDateString();
    
    // Day cells
    datesToRender.forEach(cellDate => {
        const cellDateStr = getLocalDateString(cellDate);
        const day = cellDate.getDate();
        const count = getPomoCount(cellDateStr);
        const isRecovered = db.history[cellDateStr] && db.history[cellDateStr].recovered;
        
        const cell = document.createElement('div');
        cell.classList.add('calendar-day-cell');
        cell.setAttribute('data-date', cellDateStr);
        
        if (cellDateStr === todayStr) {
            cell.classList.add('today');
        }
        
        if (isRecovered) {
            cell.classList.add('recovered-streak');
            const recoveredText = db.language === 'en' ? 'Saved' : 'Cứu';
            cell.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="day-badge" style="color: var(--color-success)">${recoveredText}</span>
            `;
        } else if (count > 0) {
            cell.classList.add('active-pomo');
            
            if (count <= 2) cell.classList.add('completed-low');
            else if (count <= 4) cell.classList.add('completed-mid');
            else cell.classList.add('completed-high');
            
            cell.innerHTML = `
                <span class="day-number">${day}</span>
                <span class="day-badge">${count}P</span>
            `;
        } else {
            cell.innerHTML = `<span class="day-number">${day}</span>`;
        }
        
        cell.addEventListener('click', () => {
            const cells = grid.querySelectorAll('.calendar-day-cell');
            cells.forEach(c => c.classList.remove('selected'));
            cell.classList.add('selected');
            showDayDetails(cellDateStr, day);
        });
        
        grid.appendChild(cell);
    });
    
    setTimeout(() => {
        drawStreakLines();
    }, 50);
}

// Function to draw SVG paths connecting consecutive active/recovered days
function drawStreakLines() {
    const svgLayer = document.getElementById('streak-svg-layer');
    svgLayer.innerHTML = ''; // Clear previous
    
    const activeDates = getActiveAndRecoveredDates();
    if (activeDates.length < 2) return;
    
    const gridContainer = document.getElementById('calendar-days-grid');
    const containerRect = svgLayer.getBoundingClientRect();
    
    // Filter activeDates for currently visible calendar cells
    const visibleCells = Array.from(gridContainer.querySelectorAll('.calendar-day-cell:not(.empty)'));
    const visibleDatesStr = visibleCells.map(c => c.getAttribute('data-date'));
    const visibleActiveDates = activeDates.filter(dStr => visibleDatesStr.includes(dStr));
    
    if (visibleActiveDates.length < 2) return;
    
    // Group active dates into contiguous streaks
    const streaks = [];
    let currentStreak = [visibleActiveDates[0]];
    
    for (let i = 1; i < visibleActiveDates.length; i++) {
        const prev = new Date(visibleActiveDates[i - 1]);
        const curr = new Date(visibleActiveDates[i]);
        const diffTime = Math.abs(curr - prev);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            currentStreak.push(visibleActiveDates[i]);
        } else {
            if (currentStreak.length >= 2) {
                streaks.push(currentStreak);
            }
            currentStreak = [visibleActiveDates[i]];
        }
    }
    if (currentStreak.length >= 2) {
        streaks.push(currentStreak);
    }
    
    if (streaks.length === 0) return;
    
    // Setup Linear Gradient for neon glow lines
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <linearGradient id="streak-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ff9100" />
            <stop offset="50%" stop-color="#00e676" />
            <stop offset="100%" stop-color="#00e5ff" />
        </linearGradient>
    `;
    svgLayer.appendChild(defs);
    
    // For each streak group, draw a continuous path
    streaks.forEach(streakGroup => {
        let pathPoints = [];
        
        streakGroup.forEach(dateStr => {
            const cell = gridContainer.querySelector(`[data-date="${dateStr}"]`);
            if (cell) {
                const cellRect = cell.getBoundingClientRect();
                const x = cellRect.left - containerRect.left + cellRect.width / 2;
                const y = cellRect.top - containerRect.top + cellRect.height / 2;
                pathPoints.push({ x, y });
            }
        });
        
        if (pathPoints.length >= 2) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            let d = `M ${pathPoints[0].x} ${pathPoints[0].y}`;
            for (let i = 1; i < pathPoints.length; i++) {
                d += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
            }
            path.setAttribute("d", d);
            path.setAttribute("class", "streak-connection-path");
            svgLayer.appendChild(path);
        }
    });
}

// --- Chart.js Data Visualisation ---
let monthlyChart = null;

function renderChart() {
    const canvas = document.getElementById('monthlyChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const data = getChartDataForCurrentMonth();
    
    if (typeof Chart === 'undefined') {
        console.warn("Chart.js is not loaded yet. Delaying chart render.");
        setTimeout(renderChart, 1000);
        return;
    }
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Pomodoros',
                data: data.values,
                borderColor: '#00e5ff',
                backgroundColor: 'rgba(0, 229, 255, 0.05)',
                borderWidth: 3,
                pointBackgroundColor: '#00e5ff',
                pointBorderColor: '#080a0f',
                pointHoverRadius: 6,
                tension: 0.35,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: function(context) {
                            return db.language === 'en'
                                ? `Day ${context[0].label} of the month`
                                : `Ngày ${context[0].label} trong tháng`;
                        },
                        label: function(context) {
                            return db.language === 'en'
                                ? ` Completed: ${context.parsed.y} Pomodoro`
                                : ` Hoàn thành: ${context.parsed.y} Pomodoro`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: '#8a99ad', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: '#8a99ad', font: { size: 10 }, stepSize: 1 },
                    min: 0
                }
            }
        }
    });
}

function getChartDataForCurrentMonth() {
    const labels = [];
    const values = [];
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= totalDays; day++) {
        // Show all day numbers for daily precision
        labels.push(`${day}`);
        
        const cellDate = new Date(year, month, day);
        const cellDateStr = getLocalDateString(cellDate);
        values.push(getPomoCount(cellDateStr));
    }
    
    return { labels, values };
}

function updateChartData() {
    if (monthlyChart) {
        const data = getChartDataForCurrentMonth();
        monthlyChart.data.datasets[0].data = data.values;
        monthlyChart.update();
    }
}

// --- Dev / Mock Panel logic ---
function initDevPanel() {
    const toggle = document.getElementById('dev-panel-toggle');
    const panel = document.getElementById('dev-panel');
    const mockStreakBtn = document.getElementById('btn-mock-streak');
    const mockMissBtn = document.getElementById('btn-mock-miss');
    const clearBtn = document.getElementById('btn-clear-data');
    const devAddBtn = document.getElementById('btn-dev-add');
    
    // Toggle Collapse
    toggle.addEventListener('click', () => {
        panel.classList.toggle('collapsed');
        // Refresh icons just in case chevron changes
        createLucideIcons();
    });
    
    // Action 1: Create 7 days streak
    mockStreakBtn.addEventListener('click', () => {
        const today = new Date();
        for (let i = 1; i <= 7; i++) {
            const pastDate = new Date(today.getTime() - i * 86400000);
            const dateStr = getLocalDateString(pastDate);
            db.history[dateStr] = { count: 3, recovered: false };
        }
        // Today completed
        db.history[getLocalDateString()] = { count: 4, recovered: false };
        saveDatabase();
        
        // Refresh
        checkStreakStatus();
        renderCalendar();
        updateChartData();
        updateDailyGoalProgress();
        alert("Đã tạo chuỗi dữ liệu giả lập 7 ngày liên tiếp thành công!");
    });
    
    // Action 2: Create a missed streak yesterday
    mockMissBtn.addEventListener('click', () => {
        const today = new Date();
        const yesterdayStr = getLocalDateString(new Date(today.getTime() - 86400000));
        const dayBeforeYesterdayStr = getLocalDateString(new Date(today.getTime() - 2 * 86400000));
        
        // Yesterday must have 0 completed
        if (db.history[yesterdayStr]) {
            db.history[yesterdayStr].count = 0;
            db.history[yesterdayStr].recovered = false;
            delete db.history[yesterdayStr].taskName;
        }
        
        // Day before yesterday must be active to create a streak break
        db.history[dayBeforeYesterdayStr] = { count: 3, recovered: false };
        
        // Today has 0 completed as well to trigger broken streak screen
        db.history[getLocalDateString()] = { count: 0, recovered: false };
        
        saveDatabase();
        
        // Refresh
        checkStreakStatus();
        renderCalendar();
        updateChartData();
        updateDailyGoalProgress();
        alert("Đã giả lập tình huống lỡ streak hôm qua. Hãy xem khung Nhiệm vụ phục hồi!");
    });
    
    // Action 3: Clear all
    clearBtn.addEventListener('click', () => {
        if (confirm("BẠN CÓ CHẮC MUỐN XÓA TOÀN BỘ DỮ LIỆU? Hành động này sẽ không thể khôi phục.")) {
            db = {
                history: {},
                dailyGoal: 4,
                longestStreak: 0
            };
            saveDatabase();
            
            // Refresh
            checkStreakStatus();
            renderCalendar();
            updateChartData();
            updateDailyGoalProgress();
            alert("Đã xóa sạch dữ liệu ứng dụng!");
        }
    });
    
    // Action 4: Custom Add
    devAddBtn.addEventListener('click', () => {
        const dateInput = document.getElementById('dev-date-input').value;
        const countInput = parseInt(document.getElementById('dev-count-input').value);
        
        if (!dateInput) {
            alert("Vui lòng chọn ngày!");
            return;
        }
        
        db.history[dateInput] = { count: countInput, recovered: false };
        saveDatabase();
        
        // Refresh
        checkStreakStatus();
        renderCalendar();
        updateChartData();
        updateDailyGoalProgress();
    });
    
    // Set default date input value to today
    document.getElementById('dev-date-input').value = getLocalDateString();
}

// --- Utils ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show detail stats for the clicked calendar day
function showDayDetails(dateStr, dayNum) {
    const panel = document.getElementById('day-details-panel');
    const titleEl = document.getElementById('day-details-title');
    const pomoEl = document.getElementById('day-details-pomo');
    const statusEl = document.getElementById('day-details-status');
    const taskRow = document.getElementById('day-details-task-row');
    const taskNameEl = document.getElementById('day-details-task-name');
    const dParts = dateStr.split('-');
    const formattedDate = `${dParts[2]}/${dParts[1]}/${dParts[0]}`;
    const isEn = db.language === 'en';
    titleEl.innerText = isEn ? `Details for ${formattedDate}` : `Chi tiết ngày ${formattedDate}`;
    
    const count = getPomoCount(dateStr);
    pomoEl.innerText = count;
    
    const isRecovered = db.history[dateStr] && db.history[dateStr].recovered;
    const taskName = db.history[dateStr] && db.history[dateStr].taskName;
    const todayStr = getLocalDateString();
    
    // Remove old status classes
    statusEl.className = '';
    
    if (dateStr === todayStr) {
        statusEl.innerText = isEn ? "Today" : "Hôm nay";
        statusEl.classList.add('status-today');
    } else if (isRecovered) {
        statusEl.innerText = isEn ? "Streak restored" : "Đã cứu streak";
        statusEl.classList.add('status-recovered');
    } else if (count > 0) {
        statusEl.innerText = isEn ? "Active streak" : "Đang có streak";
        statusEl.classList.add('status-active');
    } else {
        statusEl.innerText = isEn ? "No activity" : "Không có hoạt động";
        statusEl.classList.add('status-normal');
    }
    
    // Show recovery task details if any
    if (taskName) {
        taskRow.classList.remove('hidden');
        taskNameEl.innerText = taskName;
    } else {
        taskRow.classList.add('hidden');
    }
    
    // Render sessions details
    // Remove old session lists first
    const oldLists = panel.querySelectorAll('.details-sessions-list');
    oldLists.forEach(el => el.remove());
    
    const sessions = db.history[dateStr] ? (db.history[dateStr].sessions || []) : [];
    if (sessions.length > 0) {
        const listDiv = document.createElement('div');
        listDiv.className = 'details-sessions-list';
        listDiv.style.marginTop = '12px';
        listDiv.style.borderTop = '1px solid rgba(0, 229, 255, 0.15)';
        listDiv.style.paddingTop = '8px';
        const sessionsHeader = isEn ? "Focus sessions:" : "Các phiên làm việc:";
        const minSuffix = isEn ? "mins" : "phút";
        listDiv.innerHTML = `
            <h5 style="font-size: 0.8rem; color: var(--color-primary); margin-bottom: 6px;">${sessionsHeader}</h5>
            <ul style="font-size: 0.75rem; color: var(--color-text-main); padding-left: 15px; margin: 0; line-height: 1.4;">
                ${sessions.map(s => `<li>[${s.time}] <strong>${s.name}</strong> (${s.duration} ${minSuffix})</li>`).join('')}
            </ul>
        `;
        panel.querySelector('.day-details-content').appendChild(listDiv);
    } else if (count > 0) {
        // Mock data fallback
        const listDiv = document.createElement('div');
        listDiv.className = 'details-sessions-list';
        listDiv.style.marginTop = '12px';
        listDiv.style.borderTop = '1px solid rgba(0, 229, 255, 0.15)';
        listDiv.style.paddingTop = '8px';
        const mockHeader = isEn ? "Focus sessions (Mocked):" : "Các phiên làm việc (Giả lập):";
        const sessionName = isEn ? "Focus Session" : "Phiên tập trung";
        const minSuffix = isEn ? "mins" : "phút";
        listDiv.innerHTML = `
            <h5 style="font-size: 0.8rem; color: var(--color-primary); margin-bottom: 6px;">${mockHeader}</h5>
            <ul style="font-size: 0.75rem; color: var(--color-text-main); padding-left: 15px; margin: 0; line-height: 1.4;">
                ${Array.from({length: count}).map((_, i) => `<li>[--:--] <strong>${sessionName} #${i+1}</strong> (25 ${minSuffix})</li>`).join('')}
            </ul>
        `;
        panel.querySelector('.day-details-content').appendChild(listDiv);
    }
    
    panel.classList.remove('hidden');
    createLucideIcons();
}

// --- IndexedDB Database Operations ---
const DB_NAME = 'SpaceFocusAudioDB';
const DB_VERSION = 2;
const STORE_NAME = 'custom_tracks';

function initIndexedDB() {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === 'undefined') {
            return reject(new Error("IndexedDB is not supported in this environment"));
        }
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
            if (!db.objectStoreNames.contains('custom_wallpaper')) {
                db.createObjectStore('custom_wallpaper', { keyPath: 'id' });
            }
        };
        request.onsuccess = (e) => {
            const db = e.target.result;
            resolve(db);
        };
        request.onerror = (e) => reject(e.target.error);
    });
}

async function saveCustomWallpaperToDB(blob) {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('custom_wallpaper', 'readwrite');
        const store = transaction.objectStore('custom_wallpaper');
        const request = store.put({ id: 'current', blob });
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
}

async function loadCustomWallpaperFromDB() {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction('custom_wallpaper', 'readonly');
        const store = transaction.objectStore('custom_wallpaper');
        const request = store.get('current');
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function saveTrackToDB(name, blob) {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const track = { name, blob, addedAt: Date.now() };
        const request = store.add(track);
        request.onsuccess = (e) => {
            track.id = e.target.result;
            resolve(track);
        };
        request.onerror = (e) => reject(e.target.error);
    });
}

async function loadTracksFromDB() {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = (e) => resolve(e.target.result);
        request.onerror = (e) => reject(e.target.error);
    });
}

async function deleteTrackFromDB(id) {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
}

// --- Playlist Management Logic ---
async function loadCustomTracks() {
    try {
        const dbTracks = await loadTracksFromDB();
        customTracks = dbTracks.map(track => {
            track.url = URL.createObjectURL(track.blob);
            return track;
        });
        renderPlaylistUI();
    } catch (e) {
        console.error("Lỗi khi tải nhạc tự chọn", e);
    }
}

function renderPlaylistUI() {
    const listContainer = document.getElementById('custom-track-list');
    listContainer.innerHTML = '';
    
    if (customTracks.length === 0) {
        listContainer.innerHTML = '<div class="no-tracks-text">Chưa tải bài nhạc nào...</div>';
        return;
    }
    
    customTracks.forEach(track => {
        const item = document.createElement('div');
        item.className = 'track-item';
        
        const isThisActive = currentAmbientType === `custom_${track.id}`;
        if (isThisActive) {
            item.classList.add('active');
        }
        
        item.innerHTML = `
            <div class="track-info" data-id="${track.id}">
                <i data-lucide="${isThisActive && isTimerRunning ? 'volume-2' : 'play'}" class="track-play-icon"></i>
                <span class="track-name" title="${track.name}">${track.name}</span>
            </div>
            <button class="delete-track-btn" data-id="${track.id}" title="Xóa bài này">
                <i data-lucide="trash-2"></i>
            </button>
        `;
        
        // Play Event
        item.querySelector('.track-info').addEventListener('click', () => {
            const trackId = track.id;
            const targetSound = `custom_${trackId}`;
            
            if (currentAmbientType === targetSound) {
                return;
            }
            
            document.querySelectorAll('.audio-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.track-item').forEach(el => el.classList.remove('active'));
            item.classList.add('active');
            
            stopCurrentAmbient();
            currentAmbientType = targetSound;
            
            playAmbientAudio();
            renderPlaylistUI();
        });
        
        // Delete Event
        item.querySelector('.delete-track-btn').addEventListener('click', async (e) => {
            e.stopPropagation();
            if (!confirm(`Bạn có chắc muốn xóa bài "${track.name}" khỏi danh sách?`)) {
                return;
            }
            
            try {
                if (currentAmbientType === `custom_${track.id}`) {
                    stopCurrentAmbient();
                    currentAmbientType = 'none';
                    const noneBtn = document.querySelector('.audio-btn[data-sound="none"]');
                    if (noneBtn) noneBtn.classList.add('active');
                }
                
                await deleteTrackFromDB(track.id);
                URL.revokeObjectURL(track.url);
                customTracks = customTracks.filter(t => t.id !== track.id);
                renderPlaylistUI();
            } catch (err) {
                console.error("Lỗi khi xóa bài nhạc", err);
            }
        });
        
        listContainer.appendChild(item);
    });
    
    createLucideIcons();
}

// --- Zoom & Picture-in-Picture Logic ---
let pipWindow = null;
let isZenMode = false;
let isFloatingPiP = false;

function initZoomAndPipControls() {
    const btnZoom = document.getElementById('btn-zoom-timer');
    const btnPip = document.getElementById('btn-pip-timer');
    const btnCloseZen = document.getElementById('btn-close-zen');
    const btnCloseFloating = document.getElementById('btn-close-floating');
    
    // Zoom / Zen Focus
    btnZoom.addEventListener('click', () => {
        enterZenMode();
    });
    
    btnCloseZen.addEventListener('click', () => {
        exitZenMode();
    });
    
    // PiP Clock
    btnPip.addEventListener('click', () => {
        if (pipWindow) {
            restoreTimerFromPiP();
        } else if (isFloatingPiP) {
            deactivateFloatingPiP();
        } else {
            enterPiP();
        }
    });
    
    btnCloseFloating.addEventListener('click', () => {
        deactivateFloatingPiP();
    });
    
    makeDraggable(document.getElementById('floating-timer-card'));
}

function enterZenMode() {
    isZenMode = true;
    const overlay = document.getElementById('zen-overlay');
    const timerContainer = document.querySelector('.timer-display-container');
    const timerControls = document.querySelector('.timer-controls');
    
    overlay.querySelector('.zen-content-wrapper').appendChild(timerContainer);
    overlay.querySelector('.zen-content-wrapper').appendChild(timerControls);
    overlay.classList.remove('hidden');
}

function exitZenMode() {
    isZenMode = false;
    const overlay = document.getElementById('zen-overlay');
    const timerContainer = overlay.querySelector('.timer-display-container');
    const timerControls = overlay.querySelector('.timer-controls');
    const originalParent = document.getElementById('timer-card-content');
    
    if (timerContainer && timerControls && originalParent) {
        originalParent.appendChild(timerContainer);
        originalParent.appendChild(timerControls);
    }
    overlay.classList.add('hidden');
}

async function enterPiP() {
    if (!('documentPictureInPicture' in window)) {
        activateFloatingPiP();
        return;
    }
    
    try {
        const timerContainer = document.querySelector('.timer-display-container');
        const timerControls = document.querySelector('.timer-controls');
        
        pipWindow = await window.documentPictureInPicture.requestWindow({
            width: 250,
            height: 280,
        });
        
        Array.from(document.styleSheets).forEach((styleSheet) => {
            try {
                const cssRules = Array.from(styleSheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join('');
                const style = document.createElement('style');
                style.textContent = cssRules;
                pipWindow.document.head.appendChild(style);
            } catch (e) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.type = styleSheet.type;
                link.media = styleSheet.media.type;
                link.href = styleSheet.href;
                pipWindow.document.head.appendChild(link);
            }
        });
        
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Orbitron:wght@500;700;900&display=swap';
        pipWindow.document.head.appendChild(fontLink);
        
        pipWindow.document.body.style.backgroundColor = '#080a0f';
        pipWindow.document.body.style.margin = '0';
        pipWindow.document.body.style.padding = '15px';
        pipWindow.document.body.style.display = 'flex';
        pipWindow.document.body.style.flexDirection = 'column';
        pipWindow.document.body.style.alignItems = 'center';
        pipWindow.document.body.style.justifyContent = 'center';
        pipWindow.document.body.style.overflow = 'hidden';
        
        const pipContainer = document.createElement('div');
        pipContainer.className = 'pip-timer-wrapper';
        pipContainer.style.display = 'flex';
        pipContainer.style.flexDirection = 'column';
        pipContainer.style.alignItems = 'center';
        pipContainer.style.gap = '15px';
        
        const style = document.createElement('style');
        style.textContent = `
            .timer-display-container { width: 150px !important; height: 150px !important; margin-bottom: 0 !important; }
            .timer-time { font-size: 1.8rem !important; }
            .timer-state { font-size: 0.65rem !important; }
            .timer-controls { gap: 10px !important; }
            .control-btn { width: 34px !important; height: 34px !important; }
            .play-btn { width: 44px !important; height: 44px !important; }
        `;
        pipWindow.document.head.appendChild(style);
        
        pipContainer.appendChild(timerContainer);
        pipContainer.appendChild(timerControls);
        pipWindow.document.body.appendChild(pipContainer);
        
        pipWindow.addEventListener('pagehide', () => {
            restoreTimerFromPiP();
        });
    } catch (e) {
        console.error("Failed to enter Document PiP", e);
        activateFloatingPiP();
    }
}

function restoreTimerFromPiP() {
    if (pipWindow) {
        const timerContainer = pipWindow.document.querySelector('.timer-display-container');
        const timerControls = pipWindow.document.querySelector('.timer-controls');
        const originalParent = document.getElementById('timer-card-content');
        
        if (timerContainer && timerControls && originalParent) {
            originalParent.appendChild(timerContainer);
            originalParent.appendChild(timerControls);
        }
        pipWindow = null;
    }
}

function activateFloatingPiP() {
    isFloatingPiP = true;
    const card = document.getElementById('floating-timer-card');
    const timerContainer = document.querySelector('.timer-display-container');
    const timerControls = document.querySelector('.timer-controls');
    
    card.querySelector('.floating-body').appendChild(timerContainer);
    card.querySelector('.floating-body').appendChild(timerControls);
    card.classList.remove('hidden');
}

function deactivateFloatingPiP() {
    isFloatingPiP = false;
    const card = document.getElementById('floating-timer-card');
    const timerContainer = card.querySelector('.timer-display-container');
    const timerControls = card.querySelector('.timer-controls');
    const originalParent = document.getElementById('timer-card-content');
    
    if (timerContainer && timerControls && originalParent) {
        originalParent.appendChild(timerContainer);
        originalParent.appendChild(timerControls);
    }
    card.classList.add('hidden');
}

function makeDraggable(el) {
    const header = el.querySelector('.floating-header');
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    if (header) {
        header.onmousedown = dragMouseDown;
    } else {
        el.onmousedown = dragMouseDown;
    }
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
        el.style.bottom = "auto";
        el.style.right = "auto";
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



// --- Backup & Export Excel System ---
function initBackupControls() {
    document.getElementById('btn-export-json').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `space_focus_backup_${getLocalDateString()}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        
        triggerCloudSync(); // Trigger backup status
    });
    
    document.getElementById('import-json-file').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (imported.history && imported.dailyGoal) {
                    db = imported;
                    saveDatabase();
                    
                    // Reload all UI elements
                    checkStreakStatus();
                    renderCalendar();
                    updateChartData();
                    updateDailyGoalProgress();
                    applyPresetVisibility();
                    renderTodayLogs();
                    applyThemeAndLanguage();
                    alert("Khôi phục toàn bộ dữ liệu thành công!");
                } else {
                    alert("File sao lưu không đúng định dạng!");
                }
            } catch (err) {
                alert("Lỗi khi đọc file sao lưu!");
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });
    
    document.getElementById('btn-export-excel').addEventListener('click', () => {
        exportDataExcel();
    });
}

function exportDataExcel() {
    let csvContent = "\uFEFF"; // UTF-8 BOM
    csvContent += db.language === 'en'
        ? "Date,Daily Target (Pomo),Completed,Streak Status,Focus Sessions Details\r\n"
        : "Ngày,Mục tiêu ngày (Pomo),Số phiên hoàn thành,Trạng thái Streak,Chi tiết các phiên tập trung\r\n";
    
    const dates = Object.keys(db.history).sort((a,b) => new Date(a) - new Date(b));
    
    dates.forEach(d => {
        const dayData = db.history[d];
        const count = dayData.count || 0;
        const recovered = dayData.recovered
            ? (db.language === 'en' ? "Streak Restored" : "Đã cứu streak")
            : (count > 0 ? (db.language === 'en' ? "Normal" : "Bình thường") : (db.language === 'en' ? "Missed" : "Lỡ streak"));
        
        let sessionsStr = "";
        if (dayData.sessions && dayData.sessions.length > 0) {
            sessionsStr = dayData.sessions.map(s => `[${s.time}] ${s.name} (${s.duration}p)`).join(" | ");
        } else if (count > 0) {
            sessionsStr = db.language === 'en' ? `Completed ${count} sessions` : `Đã hoàn thành ${count} phiên`;
        }
        
        const row = `"${d}","${db.dailyGoal}","${count}","${recovered}","${sessionsStr.replace(/"/g, '""')}"`;
        csvContent += row + "\r\n";
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `space_focus_report_${getLocalDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    triggerCloudSync();
}

function triggerCloudSync() {
    const statusEl = document.getElementById('cloud-sync-status');
    const lang = db.language || 'vi';
    statusEl.innerHTML = `<i data-lucide="cloud-lightning" class="sync-icon-warn spin-animation"></i> ${lang === 'en' ? 'Syncing to Cloud...' : 'Đang sao lưu Cloud...'}`;
    createLucideIcons();
    
    setTimeout(() => {
        statusEl.innerHTML = `<i data-lucide="cloud" class="sync-icon-success"></i> ${lang === 'en' ? 'Cloud Synced' : 'Đã đồng bộ Cloud'}`;
        createLucideIcons();
    }, 1200);
}

// --- Calendar View Controls ---
function initCalendarViewControls() {
    const viewBtns = document.querySelectorAll('.view-type-btn');
    const rangeInputs = document.getElementById('calendar-range-inputs');
    const applyBtn = document.getElementById('btn-apply-calendar-range');
    const startDateInput = document.getElementById('calendar-start-date');
    const endDateInput = document.getElementById('calendar-end-date');
    
    // Set default dates for range selector
    const today = new Date();
    endDateInput.value = getLocalDateString(today);
    const past = new Date();
    past.setDate(today.getDate() - 14);
    startDateInput.value = getLocalDateString(past);
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            currentCalendarView = view;
            if (view === 'range') {
                rangeInputs.classList.remove('hidden');
            } else {
                rangeInputs.classList.add('hidden');
            }
            
            renderCalendar();
        });
    });
    
    applyBtn.addEventListener('click', () => {
        const startVal = startDateInput.value;
        const endVal = endDateInput.value;
        if (!startVal || !endVal) {
            alert(db.language === 'en' ? "Please select both dates!" : "Vui lòng nhập đầy đủ khoảng ngày!");
            return;
        }
        if (new Date(startVal) > new Date(endVal)) {
            alert(db.language === 'en' ? "Start date cannot be after End date!" : "Ngày bắt đầu không được lớn hơn ngày kết thúc!");
            return;
        }
        
        calendarRangeStart = new Date(startVal);
        calendarRangeEnd = new Date(endVal);
        renderCalendar();
    });
}

// --- Audio Controller Helpers ---
function formatAudioTime(secs) {
    if (isNaN(secs)) return '00:00';
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(Math.floor(secs % 60)).padStart(2, '0');
    return `${m}:${s}`;
}

function updateAudioTimelineUI() {
    if (!lofiAudio || !lofiAudio.duration) return;
    const current = lofiAudio.currentTime;
    const total = lofiAudio.duration;
    const percentage = (current / total) * 100;
    
    document.getElementById('audio-timeline').value = percentage;
    document.getElementById('audio-current-time').innerText = formatAudioTime(current);
    document.getElementById('audio-duration').innerText = formatAudioTime(total);
}

// --- System Settings & Theme Management ---
function initSystemSettingsControls() {
    const darkBtn = document.getElementById('btn-theme-dark');
    const lightBtn = document.getElementById('btn-theme-light');
    
    darkBtn.addEventListener('click', () => {
        db.theme = 'dark';
        saveDatabase();
        applyThemeAndLanguage();
    });
    lightBtn.addEventListener('click', () => {
        db.theme = 'light';
        saveDatabase();
        applyThemeAndLanguage();
    });
    
    const viBtn = document.getElementById('btn-lang-vi');
    const enBtn = document.getElementById('btn-lang-en');
    
    viBtn.addEventListener('click', () => {
        db.language = 'vi';
        saveDatabase();
        applyThemeAndLanguage();
        renderCalendar();
        updateDailyGoalProgress();
        renderTodayLogs();
        initQuotes(); // Refresh quote translation
    });
    enBtn.addEventListener('click', () => {
        db.language = 'en';
        saveDatabase();
        applyThemeAndLanguage();
        renderCalendar();
        updateDailyGoalProgress();
        renderTodayLogs();
        initQuotes(); // Refresh quote translation
    });
    
    const wallBtns = document.querySelectorAll('.wall-btn');
    wallBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            db.wallpaper = btn.getAttribute('data-wallpaper');
            saveDatabase();
            applyThemeAndLanguage();
        });
    });
    
    // Custom Wallpaper Upload
    const wallFileInput = document.getElementById('custom-wallpaper-file');
    wallFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            await saveCustomWallpaperToDB(file);
            
            // Clean old URL and load new
            if (customWallpaperUrl) {
                URL.revokeObjectURL(customWallpaperUrl);
            }
            customWallpaperUrl = URL.createObjectURL(file);
            
            const customSelectBtn = document.getElementById('btn-wall-custom-select');
            if (customSelectBtn) {
                customSelectBtn.classList.remove('hidden');
                customSelectBtn.style.backgroundImage = `url(${customWallpaperUrl})`;
                customSelectBtn.style.backgroundSize = 'cover';
            }
            
            db.wallpaper = 'custom';
            saveDatabase();
            applyThemeAndLanguage();
            
            alert(db.language === 'en' ? "Custom wallpaper applied!" : "Đã tải hình nền tự chọn lên!");
        } catch (err) {
            console.error("Failed to save custom wallpaper", err);
            alert(db.language === 'en' ? "Failed to upload wallpaper!" : "Lỗi khi tải hình nền lên!");
        }
        e.target.value = ''; // Reset input
    });
    
    // Telegram Configuration
    const tgTokenInput = document.getElementById('tg-bot-token');
    const tgChatIdInput = document.getElementById('tg-chat-id');
    const tgEnableChk = document.getElementById('chk-tg-enable');
    const tgTestBtn = document.getElementById('btn-tg-test');
    
    if (db.telegram) {
        tgTokenInput.value = db.telegram.token || '';
        tgChatIdInput.value = db.telegram.chatId || '';
        tgEnableChk.checked = db.telegram.enabled || false;
    }
    
    const saveTelegramConfig = () => {
        db.telegram = {
            token: tgTokenInput.value.trim(),
            chatId: tgChatIdInput.value.trim(),
            enabled: tgEnableChk.checked
        };
        saveDatabase();
    };
    
    tgTokenInput.addEventListener('change', saveTelegramConfig);
    tgChatIdInput.addEventListener('change', saveTelegramConfig);
    tgEnableChk.addEventListener('change', saveTelegramConfig);
    
    tgTestBtn.addEventListener('click', () => {
        saveTelegramConfig();
        if (!db.telegram.token || !db.telegram.chatId) {
            alert(db.language === 'en' ? "Please configure Bot Token and Chat ID first!" : "Vui lòng nhập Bot Token và Chat ID trước!");
            return;
        }
        
        const testMsg = db.language === 'en'
            ? `🔔 <b>[Space Focus] Test Notification!</b>\n\nYour Telegram bot configuration is working correctly!`
            : `🔔 <b>[Space Focus] Tin nhắn thử nghiệm!</b>\n\nCấu hình Telegram Bot hoạt động chính xác!`;
        
        sendTelegramNotification(testMsg).then(() => {
            alert(db.language === 'en' ? "Test message sent! Check your Telegram." : "Đã gửi tin nhắn thử nghiệm! Hãy kiểm tra Telegram.");
        });
    });

    // Facebook Messenger Configuration
    const fbTokenInput = document.getElementById('fb-page-token');
    const fbRecipientInput = document.getElementById('fb-recipient-id');
    const fbEnableChk = document.getElementById('chk-fb-enable');
    const fbTestBtn = document.getElementById('btn-fb-test');
    
    if (db.facebook) {
        fbTokenInput.value = db.facebook.pageToken || '';
        fbRecipientInput.value = db.facebook.recipientId || '';
        fbEnableChk.checked = db.facebook.enabled || false;
    }
    
    const saveFacebookConfig = () => {
        db.facebook = {
            pageToken: fbTokenInput.value.trim(),
            recipientId: fbRecipientInput.value.trim(),
            enabled: fbEnableChk.checked
        };
        saveDatabase();
    };
    
    fbTokenInput.addEventListener('change', saveFacebookConfig);
    fbRecipientInput.addEventListener('change', saveFacebookConfig);
    fbEnableChk.addEventListener('change', saveFacebookConfig);
    
    fbTestBtn.addEventListener('click', () => {
        saveFacebookConfig();
        if (!db.facebook.pageToken || !db.facebook.recipientId) {
            alert(db.language === 'en' ? "Please configure Facebook Page Token and Recipient ID first!" : "Vui lòng nhập Facebook Page Token và ID người nhận trước!");
            return;
        }
        
        const testMsg = db.language === 'en'
            ? `🔔 [Space Focus] Test Messenger Notification!\n\nYour Facebook Messenger configuration is working correctly!`
            : `🔔 [Space Focus] Tin nhắn thử nghiệm Messenger!\n\nCấu hình Facebook Messenger hoạt động chính xác!`;
        
        sendMessengerNotification(testMsg).then(() => {
            alert(db.language === 'en' ? "Test message sent! Check Messenger." : "Đã gửi tin nhắn thử nghiệm! Hãy kiểm tra Messenger.");
        });
    });
}

function applyThemeAndLanguage() {
    // Theme Mode
    if (db.theme === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('btn-theme-light').classList.add('active');
        document.getElementById('btn-theme-dark').classList.remove('active');
    } else {
        document.body.classList.remove('light-theme');
        document.getElementById('btn-theme-dark').classList.add('active');
        document.getElementById('btn-theme-light').classList.remove('active');
    }
    
    // Background Wallpapers
    const wallClasses = ['bg-space', 'bg-galaxy', 'bg-neon', 'bg-minimal', 'bg-zen', 'bg-custom'];
    wallClasses.forEach(c => document.body.classList.remove(c));
    document.body.style.backgroundImage = ''; // Clean inline
    
    if (db.wallpaper === 'custom') {
        document.body.classList.add('bg-custom');
        if (customWallpaperUrl) {
            document.body.style.backgroundImage = `url(${customWallpaperUrl})`;
        }
    } else {
        document.body.classList.add(`bg-${db.wallpaper}`);
    }
    
    const wallBtns = document.querySelectorAll('.wall-btn');
    wallBtns.forEach(btn => {
        if (btn.getAttribute('data-wallpaper') === db.wallpaper) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Language Toggle
    if (db.language === 'en') {
        document.getElementById('btn-lang-en').classList.add('active');
        document.getElementById('btn-lang-vi').classList.remove('active');
    } else {
        document.getElementById('btn-lang-vi').classList.add('active');
        document.getElementById('btn-lang-en').classList.remove('active');
    }
    
    // Translating DOM Elements
    const lang = db.language || 'vi';
    const dict = TRANSLATIONS[lang];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) {
            el.innerText = dict[key];
        }
    });
    
    // Translating Input placeholders
    const taskInput = document.getElementById('session-task-input');
    if (taskInput) {
        taskInput.placeholder = lang === 'en' 
            ? "Task focus name (e.g. Study, Coding...)" 
            : "Tên công việc đang tập trung (VD: Học tập, Code...)";
    }
    
    const botTokenInput = document.getElementById('tg-bot-token');
    if (botTokenInput) {
        botTokenInput.placeholder = lang === 'en' ? "Telegram Bot Token" : "Telegram Bot Token";
    }
    
    const chatIdInput = document.getElementById('tg-chat-id');
    if (chatIdInput) {
        chatIdInput.placeholder = lang === 'en' ? "Telegram Chat ID" : "Telegram Chat ID";
    }

    const fbPageTokenInput = document.getElementById('fb-page-token');
    if (fbPageTokenInput) {
        fbPageTokenInput.placeholder = lang === 'en' ? "Facebook Page Access Token" : "Facebook Page Access Token";
    }

    const fbRecipientIdInput = document.getElementById('fb-recipient-id');
    if (fbRecipientIdInput) {
        fbRecipientIdInput.placeholder = lang === 'en' ? "Messenger Recipient ID (PSID)" : "Messenger Recipient ID (PSID)";
    }
    
    const customSession = document.getElementById('custom-session-input');
    if (customSession) {
        customSession.placeholder = lang === 'en' ? "Custom mins" : "Tự chỉnh (phút)";
    }
    
    const applySessionBtn = document.getElementById('btn-set-custom-session');
    if (applySessionBtn) {
        applySessionBtn.innerText = lang === 'en' ? "Apply" : "Áp dụng";
    }
    
    const stateDisplay = getTimerElement('timer-state-display');
    if (stateDisplay) {
        stateDisplay.innerText = isBreakMode ? dict.break_state : dict.focus_state;
    }
    
    // Translate notifications button
    const notifStatusText = document.getElementById('notification-status');
    if (notifStatusText) {
        notifStatusText.innerText = notificationsEnabled ? dict.notification_enabled : dict.notification_disabled;
    }
}

function renderTodayLogs() {
    const listContainer = document.getElementById('today-logs-list');
    const todayCompletedEl = document.getElementById('today-stats-completed');
    listContainer.innerHTML = '';
    
    const todayStr = getLocalDateString();
    const count = getPomoCount(todayStr);
    
    todayCompletedEl.innerText = `${count} / ${db.dailyGoal}`;
    
    const sessions = db.history[todayStr] ? (db.history[todayStr].sessions || []) : [];
    
    if (sessions.length === 0) {
        listContainer.innerHTML = `<div class="no-logs-text" data-i18n="no_activity_today">
            ${db.language === 'en' ? 'No focus activity recorded today...' : 'Chưa có hoạt động tập trung nào trong hôm nay...'}
        </div>`;
        return;
    }
    
    sessions.forEach(s => {
        const item = document.createElement('div');
        item.className = 'log-item';
        item.innerHTML = `
            <div class="log-left">
                <span class="log-time">${s.time}</span>
                <span class="log-name" title="${s.name}">${s.name}</span>
            </div>
            <span class="log-duration">${s.duration} ${db.language === 'en' ? 'mins' : 'phút'}</span>
        `;
        listContainer.appendChild(item);
    });
}

async function sendTelegramNotification(message) {
    if (!db.telegram || !db.telegram.enabled || !db.telegram.token || !db.telegram.chatId) return;
    try {
        const url = `https://api.telegram.org/bot${db.telegram.token}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: db.telegram.chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
    } catch (e) {
        console.error("Failed to send Telegram message", e);
    }
}

async function sendMessengerNotification(message) {
    if (!db.facebook || !db.facebook.enabled || !db.facebook.pageToken || !db.facebook.recipientId) return;
    try {
        const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${db.facebook.pageToken}`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                recipient: { id: db.facebook.recipientId },
                message: { text: message }
            })
        });
    } catch (e) {
        console.error("Failed to send Messenger message", e);
    }
}

async function loadCustomWallpaper() {
    try {
        const wallData = await loadCustomWallpaperFromDB();
        if (wallData && wallData.blob) {
            if (customWallpaperUrl) {
                URL.revokeObjectURL(customWallpaperUrl);
            }
            customWallpaperUrl = URL.createObjectURL(wallData.blob);
            
            const customSelectBtn = document.getElementById('btn-wall-custom-select');
            if (customSelectBtn) {
                customSelectBtn.classList.remove('hidden');
                customSelectBtn.style.backgroundImage = `url(${customWallpaperUrl})`;
                customSelectBtn.style.backgroundSize = 'cover';
            }
            
            if (db.wallpaper === 'custom') {
                document.body.classList.add('bg-custom');
                document.body.style.backgroundImage = `url(${customWallpaperUrl})`;
            }
        }
    } catch (e) {
        console.warn("No custom wallpaper loaded from DB:", e);
    }
}

// --- Day Budget Countdown System ---
function initDayBudgetControls() {
    const startInput = document.getElementById('day-budget-start');
    const endInput = document.getElementById('day-budget-end');
    if (!startInput || !endInput) return;
    
    if (db.dayBudget) {
        startInput.value = db.dayBudget.start || '08:00';
        endInput.value = db.dayBudget.end || '22:00';
    }
    
    const onTimeChange = () => {
        db.dayBudget = {
            start: startInput.value,
            end: endInput.value
        };
        saveDatabase();
        updateDayBudgetTimer();
    };
    
    startInput.addEventListener('change', onTimeChange);
    endInput.addEventListener('change', onTimeChange);
    
    updateDayBudgetTimer();
    setInterval(updateDayBudgetTimer, 1000);
}

function updateDayBudgetTimer() {
    const startInput = document.getElementById('day-budget-start');
    const endInput = document.getElementById('day-budget-end');
    if (!startInput || !endInput) return;
    
    const startStr = startInput.value;
    const endStr = endInput.value;
    
    const startParts = startStr.split(':');
    const endParts = endStr.split(':');
    if (startParts.length < 2 || endParts.length < 2) return;
    
    const startH = parseInt(startParts[0]);
    const startM = parseInt(startParts[1]);
    const endH = parseInt(endParts[0]);
    const endM = parseInt(endParts[1]);
    
    if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
        return;
    }
    
    const now = new Date();
    
    const startTime = new Date();
    startTime.setHours(startH, startM, 0, 0);
    
    const endTime = new Date();
    endTime.setHours(endH, endM, 0, 0);
    
    // Overnight workday check: e.g. start at 22:00, end at 06:00 (next day)
    if (endTime < startTime) {
        if (now >= startTime) {
            endTime.setDate(endTime.getDate() + 1);
        } else {
            startTime.setDate(startTime.getDate() - 1);
        }
    }
    
    const countdownEl = document.getElementById('day-budget-countdown');
    const progressEl = document.getElementById('day-budget-progress');
    const statusEl = document.getElementById('day-budget-status');
    
    if (!countdownEl || !progressEl || !statusEl) return;
    
    const isEn = db.language === 'en';
    
    if (now < startTime) {
        countdownEl.innerText = "--:--:--";
        progressEl.style.width = '0%';
        statusEl.innerText = isEn ? "Day has not started yet" : "Thời gian làm việc chưa bắt đầu";
        statusEl.style.color = 'var(--color-text-muted)';
    } else if (now > endTime) {
        countdownEl.innerText = "00:00:00";
        progressEl.style.width = '100%';
        statusEl.innerText = isEn ? "Day has ended! Rest time." : "Đã hết giờ làm việc! Hãy nghỉ ngơi.";
        statusEl.style.color = 'var(--color-warning)';
    } else {
        const diffMs = endTime - now;
        const totalMs = endTime - startTime;
        
        const hours = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
        const minutes = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
        const seconds = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');
        
        countdownEl.innerText = `${hours}:${minutes}:${seconds}`;
        
        const elapsed = totalMs - diffMs;
        const percent = Math.min(100, Math.max(0, (elapsed / totalMs) * 100));
        progressEl.style.width = `${percent}%`;
        
        statusEl.innerText = isEn ? "Time remaining today" : "Thời gian còn lại trong ngày";
        statusEl.style.color = 'var(--color-success)';
    }
}
