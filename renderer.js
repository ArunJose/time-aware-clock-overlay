const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("settingsForm");
  const intervalInput = document.getElementById("intervalSeconds");
  const durationInput = document.getElementById("durationSeconds");

  // Request initial settings
  ipcRenderer.send("get-settings");

  ipcRenderer.on("settings", (event, settings) => {
    intervalInput.value = settings.intervalSeconds;
    durationInput.value = settings.durationSeconds;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const newSettings = {
      intervalSeconds: parseInt(intervalInput.value),
      durationSeconds: parseInt(durationInput.value),
    };
    ipcRenderer.send("update-settings", newSettings);
  });
});
