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

function updateRemainingDisplay() {
  document.getElementById("remainingTime").innerText = formatTime(remainingSecondsAll);
}

function updateTotalDisplay() {
  document.getElementById("totalTime").innerText = formatTime(totalSecondsAll);
  updateRemainingDisplay();
}

function saveProgress(key, checked) {
  let data = JSON.parse(localStorage.getItem("lectureProgress") || "{}");
  data[key] = checked;
  localStorage.setItem("lectureProgress", JSON.stringify(data));
}

function loadProgress() {
  return JSON.parse(localStorage.getItem("lectureProgress") || "{}");
}

// === New Feature: Reset Progress ===
document.getElementById("resetProgress").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your progress?")) {
    localStorage.removeItem("lectureProgress");
    location.reload();
  }
});

// === Enhanced Subject Title Formatting ===
function formatSubjectName(key) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').trim();
}



// async function loadSubjects() {
//   const container = document.getElementById("subjectsContainer");
//   const savedProgress = loadProgress();
//   const sortedFiles = [...subjectFiles].sort();

//   for (const file of sortedFiles) {
//     try {
//       const res = await fetch(file);
//       const lectures = await res.json();
//       const subjectKey = file.replace('.json', '');
//       const subjectName = formatSubjectName(subjectKey);

//       let subjectTotal = 0;
//       let subjectRemaining = 0;

//       const subjectDiv = document.createElement("div");
//       subjectDiv.className = "subject";

//       const title = document.createElement("div");
//       title.className = "subject-title";
//       title.innerText = subjectName;

//       const remainingEl = document.createElement("div");
//       remainingEl.className = "remaining";

//       const progressBar = document.createElement("div");
//       progressBar.className = "progress-bar";

//       const progressInner = document.createElement("div");
//       progressInner.className = "progress";

//       const progressPercent = document.createElement("div");
//       progressPercent.className = "progress-percent";

//       progressBar.appendChild(progressInner);
//       progressBar.appendChild(progressPercent);

//       const lectureList = document.createElement("div");
//       lectureList.className = "lectures";
//       lectureList.style.display = "none"; // Make sure it's collapsed by default

//       for (let i = 0; i < lectures.length; i++) {
//         const lecture = lectures[i];
//         const sec = parseDuration(lecture.duration);
//         subjectTotal += sec;
//         totalLectures++;

//         const row = document.createElement("div");
//         row.className = "lecture-item";

//         const checkbox = document.createElement("input");
//         checkbox.type = "checkbox";
//         const uniqueKey = `${subjectKey}_${i}`;
//         checkbox.dataset.seconds = sec;
//         checkbox.dataset.key = uniqueKey;

//         if (savedProgress[uniqueKey]) {
//           checkbox.checked = true;
//           completedLectures++;
//         } else {
//           subjectRemaining += sec;
//         }

//         checkbox.addEventListener("change", (e) => {
//           const secs = parseInt(e.target.dataset.seconds);
//           const key = e.target.dataset.key;
//           if (e.target.checked) {
//             subjectRemaining -= secs;
//             remainingSecondsAll -= secs;
//             saveProgress(key, true);
//           } else {
//             subjectRemaining += secs;
//             remainingSecondsAll += secs;
//             saveProgress(key, false);
//           }
//           updateProgressBar();
//           updateRemainingDisplay();
//           remainingEl.innerText = `Remaining: ${formatTime(subjectRemaining)}`;
//         });

//         const label = document.createElement("label");
//         label.innerHTML = `<strong>${lecture.title}</strong> <span style="color:#ffc107;">(${lecture.duration})</span>`;


//         row.appendChild(checkbox);
//         row.appendChild(label);
//         lectureList.appendChild(row);
//       }

//       remainingSecondsAll += subjectRemaining;
//       totalSecondsAll += subjectTotal;

//       function updateProgressBar() {
//         const percent = 100 - Math.round((subjectRemaining / subjectTotal) * 100);
//         progressInner.style.width = percent + "%";
//         progressPercent.innerText = `${percent}%`;
//       }

//       updateProgressBar();
//       updateOverallProgress();
//       remainingEl.innerText = `Remaining: ${formatTime(subjectRemaining)}`;

//       // Expand/collapse entire div
//       subjectDiv.addEventListener("click", (e) => {
//         if (e.target.tagName === 'INPUT') return;
      
//         // If in grid view, switch to list view and scroll to subject
//         if (document.body.classList.contains("grid-view")) {
//           document.body.classList.remove("grid-view");
//           document.getElementById("viewToggle").innerText = "🔁 Grid View";
      
//           // Collapse all other subjects
//           document.querySelectorAll(".lectures").forEach(lec => lec.style.display = "none");
      
//           // Expand this one
//           lectureList.style.display = "block";
      
//           // Scroll into view
//           setTimeout(() => {
//             subjectDiv.scrollIntoView({ behavior: "smooth", block: "center" });
//           }, 100); // Small delay ensures DOM is updated
//         } else {
//           // Toggle in list view
//           lectureList.style.display = lectureList.style.display === "block" ? "none" : "block";
//         }
//       });

//       subjectDiv.appendChild(title);
//       subjectDiv.appendChild(progressBar);
//       subjectDiv.appendChild(remainingEl);
//       subjectDiv.appendChild(lectureList);
//       container.appendChild(subjectDiv);

//     } catch (err) {
//       console.error(`Failed to load ${file}:`, err);
//     }
//   }

//   updateTotalDisplay();
// }

async function loadSubjects() {
  const container = document.getElementById("subjectsContainer");
  const savedProgress = loadProgress();
  const sortedFiles = [...subjectFiles].sort();

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

      const title = document.createElement("div");
      title.className = "subject-title";
      title.innerText = subjectName;

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

        if (savedProgress[uniqueKey]) {
          checkbox.checked = true;
          completedLectures++;
        } else {
          subjectRemaining += sec;
        }

        checkbox.addEventListener("change", (e) => {
          const secs = parseInt(e.target.dataset.seconds);
          const key = e.target.dataset.key;
          if (e.target.checked) {
            subjectRemaining -= secs;
            remainingSecondsAll -= secs;
            saveProgress(key, true);
          } else {
            subjectRemaining += secs;
            remainingSecondsAll += secs;
            saveProgress(key, false);
          }
          updateProgressBar();
          updateRemainingDisplay();
          remainingEl.innerText = `Remaining: ${formatTime(subjectRemaining)}`;
        });

        const label = document.createElement("label");
        label.innerHTML = `<strong>${lecture.title}</strong> <span style="color:#ffc107;">(${lecture.duration})</span>`;

        row.appendChild(checkbox);
        row.appendChild(label);
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
        if (e.target.tagName === 'INPUT') return;
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
  const percent = Math.round((completedLectures / totalLectures) * 100);
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
  const data = localStorage.getItem("lectureProgress") || "{}";
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "lecture_progress.json";
  a.click();

  URL.revokeObjectURL(url);
});

// Trigger file input
document.getElementById("triggerImport").addEventListener("click", () => {
  document.getElementById("importProgress").click();
});

// Import Progress
document.getElementById("importProgress").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (typeof imported === "object" && !Array.isArray(imported)) {
        localStorage.setItem("lectureProgress", JSON.stringify(imported));
        alert("Progress imported successfully!");
        location.reload();
      } else {
        alert("Invalid progress file format.");
      }
    } catch (err) {
      alert("Failed to import progress: " + err.message);
    }
  };

  reader.readAsText(file);
});
