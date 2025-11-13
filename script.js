/* ===============================
🎓 STUDYBELL — Pendamping Belajar
================================= */

// === Elemen DOM ===
const clock = document.getElementById('clock');
const toast = document.getElementById('toast');
const stopBtn = document.getElementById('stopBtn');

// === Variabel global ===
let level = 1;
let points = 0;
let pomodoroTimer = null;
let alarmAudio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

// Minta izin notifikasi
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// === Tampilkan Jam Realtime ===
setInterval(() => {
  const now = new Date();
  clock.textContent = now.toLocaleString('id-ID', {
    weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  checkAlarms(now);
}, 1000);

// === Toast Notification ===
function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => toast.style.display = 'none', 3000);
}

// === Tambah Tugas ===
function addTask() {
  const name = document.getElementById('taskInput').value;
  const date = document.getElementById('taskDate').value;
  const time = document.getElementById('taskTime').value;
  const day = document.getElementById('taskDay').value;

  if (!name || !date || !time || !day) {
    showToast('Lengkapi semua kolom tugas!');
    return;
  }

  const newTask = { name, date, time, day: parseInt(day), done: false };
  tasks.push(newTask);
  localStorage.setItem('tasks', JSON.stringify(tasks));

  document.getElementById('taskInput').value = '';
  renderTasks();
  showToast('Tugas ditambahkan!');
}

// === Render Daftar Tugas ===
function renderTasks() {
  const list = document.getElementById('taskList');
  list.innerHTML = '';

  if (tasks.length === 0) {
    list.innerHTML = '<p style="opacity:0.6;">Belum ada tugas.</p>';
    return;
  }

  const dayNames = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  tasks.forEach((t, i) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.innerHTML = `
      <strong>${t.name}</strong><br>
      ${t.date} • ${t.time} (${dayNames[t.day] || "-"})
      <br><button onclick="deleteTask(${i})">Hapus</button>
    `;
    list.appendChild(li);
  });
}

// === Hapus Tugas ===
function deleteTask(i) {
  tasks.splice(i, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
  showToast('Tugas dihapus!');
}

// === Alarm ===
function checkAlarms(now) {
  tasks.forEach(t => {
    const taskDateTime = new Date(`${t.date}T${t.time}`);
    if (
      !t.done &&
      now.getDay() == t.day &&
      now.getFullYear() == taskDateTime.getFullYear() &&
      now.getMonth() == taskDateTime.getMonth() &&
      now.getDate() == taskDateTime.getDate() &&
      now.getHours() == taskDateTime.getHours() &&
      now.getMinutes() == taskDateTime.getMinutes()
    ) {
      playAlarm(t.name);
      t.done = true;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
}

function playAlarm(taskName) {
  alarmAudio.loop = true;
  alarmAudio.play();
  stopBtn.style.display = 'inline-block';
  showToast(`⏰ Waktunya: ${taskName}`);
}

function stopAlarm() {
  alarmAudio.pause();
  alarmAudio.currentTime = 0;
  stopBtn.style.display = 'none';
  showToast('Alarm dimatikan');
}

// === Pomodoro ===
function startPomodoro() {
  if (pomodoroTimer) clearTimeout(pomodoroTimer);
  showToast('Fokus dimulai 25 menit!');
  document.getElementById('pomodoroStatus').textContent = 'Sedang fokus...';
  pomodoroTimer = setTimeout(() => {
    playAlarm('Sesi Fokus Selesai');
    document.getElementById('pomodoroStatus').textContent = 'Selesai! Istirahat dulu!';
  }, 25 * 60 * 1000);
}

// === Motivasi ===
const quotes = [
  "Belajar hari ini, panen esok hari!",
  "Kegigihanmu hari ini adalah kesuksesanmu nanti.",
  "Jangan menyerah, kamu semakin dekat dengan impianmu!",
  "Sedikit demi sedikit, hasil besar akan tercipta.",
  "Belajar adalah investasi terbaik untuk masa depanmu",
  "Jangan pernah berhenti belajar, karena hidup tak pernah berhenti memberikan pelajaran.",
  "Pendidikan bukanlah segala-galanya, namun segala-galanya dimulai dari pendidikan."

];

function showQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  document.getElementById('quoteBox').textContent = q;
}

// === Jalankan saat halaman dimuat ===
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  showQuote();
});

function showNotification(title, message) {
  // Jika izin belum diberikan
  if (Notification.permission !== "granted") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification(title, {
          body: message,
          icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png" // bisa diganti ikon kamu
        });
      }
    });
  } else {
    // Jika izin sudah ada
    new Notification(title, {
      body: message,
      icon: "https://cdn-icons-png.flaticon.com/512/1827/1827370.png"
    });
  }
}
alarmAudio.play();
showToast("⏰ Alarm berbunyi!");

showNotification("Alarm Belajar", "Waktunya belajar sekarang!");

const schedule = [
  {
    day: "Senin",
    lessons: [
      { subject: "Matematika", start: "07:00", end: "08:30", teacher: "Bu Rina" },
      { subject: "Bahasa Indonesia", start: "08:45", end: "10:15", teacher: "Pak Arif" },
      { subject: "IPA", start: "10:30", end: "12:00", teacher: "Bu Sinta" }
    ]
  },
  {
    day: "Selasa",
    lessons: [
      { subject: "IPS", start: "07:00", end: "08:30", teacher: "Pak Joko" },
      { subject: "Bahasa Inggris", start: "08:45", end: "10:15", teacher: "Bu Lilis" }
    ]
  },
];
localStorage.setItem('schedule', JSON.stringify(schedule));

const todayLessons = getTodaySchedule();
console.log("Jadwal hari ini:", todayLessons);
