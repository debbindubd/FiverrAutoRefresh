let countdownInterval;

function startCountdown(duration) {
  console.log("Starting countdown with duration:", duration);
  let timer = duration, minutes, seconds;
  countdownInterval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById('start').textContent = minutes + ":" + seconds;

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}

document.getElementById('start').addEventListener('click', () => {
  const interval = document.getElementById('interval').value * 1000;
  console.log("Starting auto-refresh with interval:", interval);
  chrome.runtime.sendMessage({action: "start", interval: interval}, response => {
    console.log("Response from background:", response);
    document.getElementById('status').textContent = response.status;
  });
  startCountdown(document.getElementById('interval').value);
});

document.getElementById('stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: "stop"}, response => {
    console.log("Response from background:", response);
    document.getElementById('status').textContent = response.status;
    clearInterval(countdownInterval);
    document.getElementById('start').textContent = "Start";
    document.getElementById('countdown').textContent = "";
  });
});
