const months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const selectedDiv = document.getElementById("year");
const selectedDiv1 = document.getElementById("month");
const selectedDiv2 = document.getElementById("day");
const selectedDiv3 = document.getElementById("month1");
const selectedDiv4 = document.getElementById("day1");
const op = document.getElementById("m_d");
const op1 = document.getElementById("n_b");
const loader = document.getElementById("loader");
const calcBtn = document.getElementById("calc-btn");
const app = document.querySelector(".app");
const toastContainer = document.getElementById("toast-container");

const dobDay = document.getElementById("dob-day");
const dobMonth = document.getElementById("dob-month");
const dobYear = document.getElementById("dob-year");
const todayDateInput = document.getElementById("today_date");
const todayDisplay = document.getElementById("today_display");

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDate = today.getDate();

const toastIcons = {
  success: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>',
  error: '<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/></svg>',
};

function pad(n) {
  return String(n).padStart(2, "0");
}

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function daysInMonth(month, year) {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return months[month - 1];
}

function formatDisplayDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function setTodayDate() {
  const iso = `${currentYear}-${pad(currentMonth)}-${pad(currentDate)}`;
  todayDateInput.value = iso;
  todayDisplay.textContent = formatDisplayDate(today);
}

function populateYears() {
  for (let y = currentYear; y >= 1900; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    dobYear.appendChild(opt);
  }
}

function populateMonths() {
  monthNames.forEach((name, i) => {
    const opt = document.createElement("option");
    opt.value = i + 1;
    opt.textContent = name;
    dobMonth.appendChild(opt);
  });
}

function populateDays() {
  const year = parseInt(dobYear.value, 10);
  const month = parseInt(dobMonth.value, 10);
  const prevDay = parseInt(dobDay.value, 10);
  const maxDay = year && month ? daysInMonth(month, year) : 31;

  dobDay.innerHTML = '<option value="" disabled selected>Day</option>';
  for (let d = 1; d <= maxDay; d++) {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    dobDay.appendChild(opt);
  }

  if (prevDay && prevDay <= maxDay) {
    dobDay.value = prevDay;
  }
}

function getBirthDateString() {
  const y = dobYear.value;
  const m = dobMonth.value;
  const d = dobDay.value;
  if (!y || !m || !d) return "";
  return `${y}-${pad(m)}-${pad(d)}`;
}

function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `${toastIcons[type] || toastIcons.success}<span>${message}</span>`;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function updateScrollState() {
  const needsScroll = app.scrollHeight > app.clientHeight + 1;
  app.classList.toggle("is-scrollable", needsScroll);
}

function showLoader() {
  loader.classList.add("active");
  loader.setAttribute("aria-hidden", "false");
  calcBtn.disabled = true;
}

function hideLoader() {
  loader.classList.remove("active");
  loader.setAttribute("aria-hidden", "true");
  calcBtn.disabled = false;
}

function runCalculation() {
  const myBirth = getBirthDateString();
  const todayDateValue = todayDateInput.value;

  if (!myBirth) {
    showToast("Please select your full date of birth.", "error");
    return false;
  }

  if (myBirth > todayDateValue) {
    showToast("Birthdate cannot be in the future.", "error");
    return false;
  }

  const inputDate = new Date(myBirth + "T00:00:00");
  let birthMonth, birthDate, birthYear;
  const birthDetails = {
    date: inputDate.getDate(),
    month: inputDate.getMonth() + 1,
    year: inputDate.getFullYear(),
  };

  months[1] = isLeapYear(currentYear) ? 29 : 28;

  birthYear = currentYear - birthDetails.year;
  if (currentMonth >= birthDetails.month) {
    birthMonth = currentMonth - birthDetails.month;
  } else {
    birthYear--;
    birthMonth = 12 + currentMonth - birthDetails.month;
  }
  if (currentDate >= birthDetails.date) {
    birthDate = currentDate - birthDetails.date;
  } else {
    birthMonth--;
    const days = months[currentMonth - 2];
    birthDate = days + currentDate - birthDetails.date;
    if (birthMonth < 0) {
      birthMonth = 11;
      birthYear--;
    }
  }

  selectedDiv.innerText = birthYear;
  selectedDiv1.innerText = birthMonth;
  selectedDiv2.innerText = birthDate;
  selectedDiv3.innerText = 11 - birthMonth;
  selectedDiv4.innerText = months[currentMonth] - birthDate;
  op.style.opacity = "1";
  op1.style.opacity = "1";

  showToast(`You are ${birthYear} years, ${birthMonth} months, and ${birthDate} days old.`, "success");
  return true;
}

function ageCalculate() {
  const myBirth = getBirthDateString();

  if (!myBirth) {
    showToast("Please select your full date of birth.", "error");
    return;
  }

  if (myBirth > todayDateInput.value) {
    showToast("Birthdate cannot be in the future.", "error");
    return;
  }

  showLoader();
  setTimeout(() => {
    runCalculation();
    hideLoader();
    updateScrollState();
  }, 900);
}

populateYears();
populateMonths();
populateDays();
setTodayDate();
updateScrollState();

dobMonth.addEventListener("change", populateDays);
dobYear.addEventListener("change", populateDays);
calcBtn.addEventListener("click", ageCalculate);
window.addEventListener("resize", updateScrollState);
