const subjectFiles = [
  "Control.json", "Digital.json", "ElectricalMachines.json", "ElectronicDevices.json",
  "EMFT.json", "Measurement.json", "Microprocessor.json", "Network.json",
  "PowerElectronics.json", "PowerSystems.json", "Utilization.json"
];

let totalSecondsAll = 0;
let remainingSecondsAll = 0;
let totalLectures = 0;
let completedLectures = 0;

function parseDuration(durationStr) {
  const time = { hrs: 0, mins: 0, secs: 0 };
  const parts = durationStr.split(/\s+/);
  for (let i = 0; i < parts.length; i++) {
    const val = parseInt(parts[i]);
    if (!isNaN(val)) {
      if (parts[i + 1]?.startsWith('hr')) time.hrs = val;
      if (parts[i + 1]?.startsWith('min')) time.mins = val;
      if (parts[i + 1]?.startsWith('sec')) time.secs = val;
    }
  }
  return (time.hrs * 3600) + (time.mins * 60) + time.secs;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs} hrs ${mins} mins ${secs} secs`;
}

// function updateRemainingDisplay() {
//   document.getElementById("remainingTime").innerText = formatTime(remainingSecondsAll);
// }

function updateRemainingDisplay() {
  const unchecked = document.querySelectorAll('.lecture-item input[type=checkbox]:not(:checked)').length;
  document.getElementById("remainingTime").innerText = `${formatTime(remainingSecondsAll)} — 📚 ${unchecked} lectures remaining`;
}


function updateTotalDisplay() {
  document.getElementById("totalTime").innerText = formatTime(totalSecondsAll);
  updateRemainingDisplay();
}

function saveProgress(key, checked, remark = null) {
  let data = JSON.parse(localStorage.getItem("lectureProgress") || "{}");
  if (!data[key]) data[key] = {};
  data[key].checked = checked;
  if (remark !== null) data[key].remark = remark;
  localStorage.setItem("lectureProgress", JSON.stringify(data));
}

function loadProgress() {
  return JSON.parse(localStorage.getItem("lectureProgress") || "{}");
}

// === Reset Progress Button ===
document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your progress?")) {
    localStorage.removeItem("lectureProgress");
    location.reload();
  }
});

function formatSubjectName(key) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').trim();
}

async function loadSubjects() {
  const container = document.getElementById("subjectsContainer");
  const savedProgress = loadProgress();
  const sortedFiles = [...subjectFiles].sort();

  totalSecondsAll = 0;
  remainingSecondsAll = 0;
  totalLectures = 0;
  completedLectures = 0;

  for (const file of sortedFiles) {
    try {
      const res = await fetch(file);
      const lectures = await res.json();
      const subjectKey = file.replace('.json', '');
      const subjectName = formatSubjectName(subjectKey);

      let subjectTotal = 0;
      let subjectRemaining = 0;

      const subjectDiv = document.createElement("div");
      subjectDiv.className = "subject";
      subjectDiv.dataset.lectures = lectures.length;

      // const title = document.createElement("div");
      // title.className = "subject-title";
      ////////////////////////////
      // title.innerText = subjectName;

      const uncheckedCount = lectures.filter((_, idx) => {
  const key = `${subjectKey}_${idx}`;
  return !(savedProgress[key]?.checked);
}).length;

// title.innerText = `${subjectName} (${uncheckedCount} remaining)`;
///////////////////////////////////////////////////////

//////////asa/



// const title = document.createElement("div");
// title.className = "subject-title";
// title.style.display = "flex";
// title.style.justifyContent = "space-between";
// title.style.alignItems = "center";

// const nameSpan = document.createElement("span");
// nameSpan.innerText = subjectName;

// const countSpan = document.createElement("span");
// countSpan.className = "lecture-remaining-count";
// countSpan.innerText = `${uncheckedCount} remaining`;

// title.appendChild(nameSpan);
// title.appendChild(countSpan);

///////////saa/

const title = document.createElement("div");
title.className = "subject-title";

const nameSpan = document.createElement("span");
nameSpan.className = "subject-name";
nameSpan.innerText = subjectName;

const countSpan = document.createElement("div");
countSpan.className = "lecture-remaining-count";
countSpan.innerText = `${uncheckedCount} remaining`;

title.appendChild(nameSpan);
title.appendChild(countSpan);



//////da//

      const remainingEl = document.createElement("div");
      remainingEl.className = "remaining";

      const progressBar = document.createElement("div");
      progressBar.className = "progress-bar";

      const progressInner = document.createElement("div");
      progressInner.className = "progress";

      const progressPercent = document.createElement("div");
      progressPercent.className = "progress-percent";

      progressBar.appendChild(progressInner);
      progressBar.appendChild(progressPercent);

      const lectureList = document.createElement("div");
      lectureList.className = "lectures";
      lectureList.style.display = "none";

      for (let i = 0; i < lectures.length; i++) {
        const lecture = lectures[i];
        const sec = parseDuration(lecture.duration);
        subjectTotal += sec;
        totalLectures++;

        const row = document.createElement("div");
        row.className = "lecture-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const uniqueKey = `${subjectKey}_${i}`;
        checkbox.dataset.seconds = sec;
        checkbox.dataset.key = uniqueKey;

        const saved = savedProgress[uniqueKey] || {};

        if (saved.checked) {
          checkbox.checked = true;
          completedLectures++;
        } else {
          subjectRemaining += sec;
        }

        const label = document.createElement("label");
        label.innerHTML = `<strong>${lecture.title}</strong> <span style="color:#ffc107;">(${lecture.duration})</span>`;

        // Remark input
        const remarkInput = document.createElement("input");
        remarkInput.type = "text";
        remarkInput.placeholder = "Add a remark...";
        remarkInput.className = "remark-input";
        remarkInput.value = saved.remark || "";

        remarkInput.addEventListener("input", () => {
          saveProgress(uniqueKey, checkbox.checked, remarkInput.value);
        });

        checkbox.addEventListener("change", () => {
          saveProgress(uniqueKey, checkbox.checked, remarkInput.value);

          // Recalculate remaining time for this subject
          let newSubjectRemaining = 0;
          const checkboxes = lectureList.querySelectorAll("input[type=checkbox]");
          checkboxes.forEach(cb => {
            if (!cb.checked) newSubjectRemaining += parseInt(cb.dataset.seconds);
          });
          subjectRemaining = newSubjectRemaining;

          // Recalculate overall remaining seconds globally
          remainingSecondsAll = 0;
          document.querySelectorAll('.lecture-item input[type=checkbox]').forEach(cb => {
            if (!cb.checked) remainingSecondsAll += parseInt(cb.dataset.seconds);
          });

          updateProgressBar();
          updateRemainingDisplay();
          remainingEl.innerText = `Remaining: ${formatTime(subjectRemaining)}`;
          updateOverallProgress();
        });

        row.appendChild(checkbox);
        row.appendChild(label);
        row.appendChild(remarkInput);
        lectureList.appendChild(row);
      }

      remainingSecondsAll += subjectRemaining;
      totalSecondsAll += subjectTotal;

      function updateProgressBar() {
        const percent = 100 - Math.round((subjectRemaining / subjectTotal) * 100);
        subjectDiv.dataset.percent = percent;
        subjectDiv.dataset.total = subjectTotal;
        progressInner.style.width = percent + "%";
        progressPercent.innerText = `${percent}%`;
      }

      updateProgressBar();
      updateOverallProgress();
      remainingEl.innerText = `Remaining: ${formatTime(subjectRemaining)}`;

      subjectDiv.addEventListener("click", (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (document.body.classList.contains("grid-view")) {
          document.body.classList.remove("grid-view");
          document.getElementById("viewToggle").innerText = "🔁 Grid View";
          document.querySelectorAll(".lectures").forEach(lec => lec.style.display = "none");
          lectureList.style.display = "block";
          setTimeout(() => {
            subjectDiv.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        } else {
          lectureList.style.display = lectureList.style.display === "block" ? "none" : "block";
        }
      });

      subjectDiv.appendChild(title);
      subjectDiv.appendChild(progressBar);
      subjectDiv.appendChild(remainingEl);
      subjectDiv.appendChild(lectureList);
      container.appendChild(subjectDiv);

    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
    }
  }
  updateTotalDisplay();
}

loadSubjects();

document.getElementById("viewToggle").addEventListener("click", () => {
  const body = document.body;
  const btn = document.getElementById("viewToggle");
  const isGrid = body.classList.toggle("grid-view");
  btn.innerText = isGrid ? "🔁 List View" : "🔁 Grid View";
});

function updateOverallProgress() {
  const percent = totalLectures ? Math.round((completedLectures / totalLectures) * 100) : 0;
  document.getElementById("totalProgressInner").style.width = percent + "%";
  document.getElementById("totalProgressPercent").innerText = `${percent}%`;

  const totalTimeStr = formatTime(totalSecondsAll);
  const doneTime = totalSecondsAll - remainingSecondsAll;
  const doneTimeStr = formatTime(doneTime);

  document.getElementById("overallStats").innerText =
    `${completedLectures}/${totalLectures} lectures done — ${doneTimeStr} / ${totalTimeStr}`;
}

// === Subject Search ===
document.getElementById("searchBar").addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase();
  const subjects = document.querySelectorAll(".subject");
  subjects.forEach(sub => {
    const title = sub.querySelector(".subject-title").innerText.toLowerCase();
    sub.style.display = title.includes(query) ? "block" : "none";
  });
});

// === Sort Subjects ===
document.getElementById("sortOptions").addEventListener("change", () => {
  const container = document.getElementById("subjectsContainer");
  const subjects = Array.from(container.children);
  const type = document.getElementById("sortOptions").value;

  subjects.sort((a, b) => {
    const aProgress = parseInt(a.dataset.percent);
    const bProgress = parseInt(b.dataset.percent);
    const aTime = parseInt(a.dataset.total);
    const bTime = parseInt(b.dataset.total);
    const aLectures = parseInt(a.dataset.lectures);
    const bLectures = parseInt(b.dataset.lectures);

    switch (type) {
      case "completion": return bProgress - aProgress;
      case "duration": return bTime - aTime;
      case "lectures": return bLectures - aLectures;
      default: return 0;
    }
  });

  container.innerHTML = "";
  subjects.forEach(el => container.appendChild(el));
});

// Export Progress
document.getElementById("exportProgress").addEventListener("click", () => {
  const data = JSON.stringify(JSON.parse(localStorage.getItem("lectureProgress") || "{}"), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "progress.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import Progress
document.getElementById("importProgress").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const importedData = JSON.parse(evt.target.result);
      localStorage.setItem("lectureProgress", JSON.stringify(importedData));
      alert("Import successful! Reloading...");
      location.reload();
    } catch {
      alert("Invalid JSON file.");
    }
  };
  reader.readAsText(file);
});
