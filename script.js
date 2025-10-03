document.addEventListener("DOMContentLoaded", function () {
  // Get all needed DOM elements
  const form = document.getElementById("checkInForm");
  const nameInput = document.getElementById("attendeeName");
  const teamSelect = document.getElementById("teamSelect");
  const progressBar = document.getElementById("progressBar");
  const attendeeCount = document.getElementById("attendeeCount");
  const maxCount = 50;

  // Load attendee list from localStorage
  let attendeeListArr = [];
  try {
    attendeeListArr = JSON.parse(localStorage.getItem("attendeeList")) || [];
  } catch (e) {
    attendeeListArr = [];
  }

  // Function to update attendee list in the UI
  function updateAttendeeList() {
    const attendeeList = document.getElementById("attendeeList");
    attendeeList.innerHTML = "";
    if (attendeeListArr.length === 0) {
      const placeholder = document.createElement("li");
      placeholder.textContent = "No attendees checked in yet.";
      placeholder.style.color = "#888";
      attendeeList.appendChild(placeholder);
    } else {
      for (let i = 0; i < attendeeListArr.length; i++) {
        const item = document.createElement("li");
        item.textContent = `${attendeeListArr[i].name} (${attendeeListArr[i].team})`;
        attendeeList.appendChild(item);
      }
    }
    console.log("Attendee list updated:", attendeeListArr);
  }
  updateAttendeeList();

  // Load saved data from localStorage
  let count = parseInt(localStorage.getItem("checkInCount")) || 0;
  let teamCounts = {
    water: parseInt(localStorage.getItem("waterCount")) || 0,
    zero: parseInt(localStorage.getItem("zeroCount")) || 0,
    power: parseInt(localStorage.getItem("powerCount")) || 0,
  };

  // Update UI with saved data
  function updateProgressBar(count, maxCount) {
    const percent = (count / maxCount) * 100;
    progressBar.style.width = `${percent}%`;
    attendeeCount.textContent = count;
  }
  updateProgressBar(count, maxCount);
  document.getElementById("waterCount").textContent = teamCounts.water;
  document.getElementById("zeroCount").textContent = teamCounts.zero;
  document.getElementById("powerCount").textContent = teamCounts.power;

  // Create the welcome message but do not add it to the page yet
  let welcomeMessage = null;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    //Get form values
    const name = nameInput.value.trim();
    const team = teamSelect.value;
    const teamName = teamSelect.selectedOptions[0].text;

    //increment count
    count++;
    teamCounts[team]++;

    // Add to attendee list and save
    attendeeListArr.push({ name: name, team: teamName });
    localStorage.setItem("attendeeList", JSON.stringify(attendeeListArr));
    updateAttendeeList();

    // Save to localStorage
    localStorage.setItem("checkInCount", count);
    localStorage.setItem("waterCount", teamCounts.water);
    localStorage.setItem("zeroCount", teamCounts.zero);
    localStorage.setItem("powerCount", teamCounts.power);

    //Update team counter
    const teamCounter = document.getElementById(team + "Count");
    if (teamCounter) {
      teamCounter.textContent = teamCounts[team];
    }

    // Update progress bar and attendee count
    updateProgressBar(count, maxCount);

    // Show welcome message
    if (!welcomeMessage) {
      welcomeMessage = document.createElement("div");
      welcomeMessage.id = "welcome-message";
      welcomeMessage.style.backgroundColor = "#e0f2ff";
      welcomeMessage.style.padding = "16px";
      welcomeMessage.style.borderRadius = "8px";
      welcomeMessage.style.marginBottom = "16px";
      welcomeMessage.style.fontWeight = "bold";
      welcomeMessage.style.fontSize = "1.2em";
      const checkInSection = document.getElementById("check-in-section");
      if (checkInSection) {
        checkInSection.parentNode.insertBefore(welcomeMessage, checkInSection);
      }
    }
    welcomeMessage.textContent = `Welcome, ${name} from ${teamName}!`;

    form.reset();
  });

  // Reset button functionality
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      // Clear localStorage
      localStorage.removeItem("checkInCount");
      localStorage.removeItem("waterCount");
      localStorage.removeItem("zeroCount");
      localStorage.removeItem("powerCount");
      localStorage.removeItem("attendeeList");

      // Reset variables
      count = 0;
      teamCounts = { water: 0, zero: 0, power: 0 };
      attendeeListArr = [];

      // Reset UI
      updateProgressBar(count, maxCount);
      document.getElementById("waterCount").textContent = 0;
      document.getElementById("zeroCount").textContent = 0;
      document.getElementById("powerCount").textContent = 0;
      updateAttendeeList();

      // Remove welcome message if present
      const welcomeMsgEl = document.getElementById("welcome-message");
      if (welcomeMsgEl) {
        welcomeMsgEl.remove();
      }
    });
  }
});
