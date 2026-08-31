const APP_TIME_ZONE = "America/Indiana/Indianapolis";

const schedule = [
  {
    type: "remote",
    badge: "REMOTE<br>27 天",
    title: "第一段 remote",
    description: "现在 → 9 月 25 日",
    start: "2026-08-31",
    end: "2026-09-24",
  },
  {
    type: "together",
    badge: "见面<br>5.5 天",
    title: "9 月 25 日 — 9 月 30 日",
    description: "5 天 + 1 晚，好好充电一下 ✨",
    start: "2026-09-25",
    end: "2026-09-30",
  },
  {
    type: "remote",
    badge: "REMOTE<br>15 天",
    title: "第二段 remote",
    description: "10 月 1 日 — 10 月 15 日，很快就到下一次见面。",
    start: "2026-10-01",
    end: "2026-10-15",
  },
  {
    type: "together",
    badge: "见面<br>12.5 天",
    title: "10 月 16 日 — 10 月 28 日",
    description: "12 天 + 1 晚，这次可以待很久 💜",
    start: "2026-10-16",
    end: "2026-10-28",
  },
  {
    type: "remote",
    badge: "REMOTE<br>22 天",
    title: "第三段 remote",
    description: "10 月 29 日 — 11 月 19 日，再坚持一段就到 11 月见面时间。",
    start: "2026-10-29",
    end: "2026-11-19",
  },
  {
    type: "together",
    badge: "见面<br>10.5 天",
    title: "11 月 20 日 — 11 月 29 日",
    description: "10 天 + 1 晚，离学期结束已经很近啦。",
    start: "2026-11-20",
    end: "2026-11-29",
  },
  {
    type: "remote",
    badge: "REMOTE<br>≤17 天",
    title: "最后一段 remote",
    description: "11 月 30 日 — 12 月 16 日，大概率少于 17 天。最后冲刺！",
    start: "2026-11-30",
    end: "2026-12-16",
  },
];

const START_DATE = "2026-08-31";
const END_DATE = "2026-12-17";

function getTodayInTimeZone(timeZone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function dateToUtcMs(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function daysBetween(start, end) {
  return Math.round((dateToUtcMs(end) - dateToUtcMs(start)) / 86400000);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function renderTimeline(today) {
  const timeline = document.getElementById("timeline");

  timeline.innerHTML = schedule
    .map((stage) => {
      const isCurrent = today >= stage.start && today <= stage.end;
      const isPast = today > stage.end;
      const classes = ["item", stage.type];

      if (isCurrent) classes.push("current");
      if (isPast) classes.push("past");

      return `
        <article class="${classes.join(" ")}">
          <div class="badge">${stage.badge}</div>
          <div class="content">
            <div class="title">${stage.title}</div>
            <div class="desc">${stage.description}</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function updateProgress(today) {
  const totalDays = daysBetween(START_DATE, END_DATE);
  const elapsedDays = daysBetween(START_DATE, today);
  const rawPercent = (elapsedDays / totalDays) * 100;
  const percent = clamp(rawPercent, 0, 100);
  const daysLeft = Math.max(0, daysBetween(today, END_DATE));

  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");
  const shell = document.getElementById("progressShell");
  const finale = document.getElementById("finale");

  shell.setAttribute("aria-valuenow", percent.toFixed(1));

  requestAnimationFrame(() => {
    bar.style.transition = "width 1.1s cubic-bezier(.22,.61,.36,1)";
    bar.style.width = `${percent.toFixed(2)}%`;
  });

  if (today >= END_DATE) {
    text.textContent = "🎉 已经到 12 月 17 日啦！";
    finale.classList.add("done");
  } else if (today < START_DATE) {
    text.textContent = "还没开始";
  } else {
    text.textContent = `已完成 ${percent.toFixed(1)}% · 还剩 ${daysLeft} 天`;
  }
}

function init() {
  const today = getTodayInTimeZone(APP_TIME_ZONE);
  renderTimeline(today);
  updateProgress(today);
}

init();
