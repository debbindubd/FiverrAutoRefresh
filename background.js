let refreshInterval = null;
let countdownInterval = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Received message:", request);
  if (request.action === "start") {
    if (refreshInterval) clearInterval(refreshInterval);
    if (countdownInterval) clearInterval(countdownInterval);
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        const interval = request.interval;
        refreshInterval = setInterval(() => {
          chrome.tabs.reload(tabId, () => {
            console.log("Tab reloaded:", tabId);
          });
        }, interval);
        startCountdown(interval / 1000);
        sendResponse({status: "started"});
      } else {
        sendResponse({status: "no active tab"});
      }
    });
  } else if (request.action === "stop") {
    if (refreshInterval) clearInterval(refreshInterval);
    if (countdownInterval) clearInterval(countdownInterval);
    chrome.action.setBadgeText({text: ""});
    sendResponse({status: "stopped"});
  }
  return true; // Keep the message channel open for sendResponse
});

function startCountdown(duration) {
  let timer = duration;
  countdownInterval = setInterval(() => {
    let minutes = parseInt(timer / 60, 10);
    let seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    chrome.action.setBadgeText({text: minutes + ":" + seconds});

    if (--timer < 0) {
      timer = duration;
    }
  }, 1000);
}
