// Add this at the top of your file
let isModalShowing = false;

// Utility function to extract the base domain from a URL
function extractBaseDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    return domain.startsWith("www.") ? domain.substring(4) : domain; // Remove "www."
  } catch (e) {
    console.error("Error parsing URL:", url, e);
    return "";
  }
}

// Remove the notifyAndCloseTab function and replace with this:
function requestTabClose(url: string) {
  console.log("Requesting tab close");
  chrome.runtime.sendMessage({
    action: "closeTab",
    url: url
  });
}

// Add this function to create and show a custom modal
function showBlockedSiteModal(url: string) {
  if (isModalShowing) {
    console.log("Modal already showing, skipping...");
    return;
  }
  
  isModalShowing = true;
  
  // Create modal container with styles
  const modal = document.createElement('div');
  modal.id = 'blocked-site-modal';
  modal.innerHTML = `
    <div class="blocked-modal-content">
      <div class="blocked-modal-header">
        <h2>⚠️ Site Blocked</h2>
        <button class="close-button" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="blocked-modal-body">
        <p>This website has been blocked according to your settings.</p>
        <p>You will be redirected in <span id="countdown">3</span> seconds.</p>
      </div>
    </div>
  `;

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = `
    #blocked-site-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      animation: fadeIn 0.3s ease-in-out;
    }

    .blocked-modal-content {
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      width: 90%;
      animation: slideIn 0.3s ease-in-out;
    }

    .blocked-modal-header {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }

    .blocked-modal-header h2 {
      margin: 0;
      color: #e74c3c;
      font-size: 24px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .blocked-modal-body {
      color: #333;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .blocked-modal-body p {
      margin: 10px 0;
      line-height: 1.5;
    }

    #countdown {
      font-weight: bold;
      color: #e74c3c;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  // Append modal and styles to document
  document.head.appendChild(styles);
  document.body.appendChild(modal);

  // Countdown timer
  let countdown = 3;
  const countdownElement = modal.querySelector('#countdown');
  
  const timer = setInterval(() => {
    countdown--;
    if (countdownElement) {
      countdownElement.textContent = countdown.toString();
    }
    if (countdown <= 0) {
      clearInterval(timer);
      modal.style.animation = 'fadeOut 0.3s ease-in-out';
      setTimeout(() => {
        modal.remove();
        isModalShowing = false; // Reset the flag
        requestTabClose(url);
      }, 300);
    }
  }, 1000);
}

// Update the message listener to use the modal instead of alert
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);

  if (message.action === "siteBlocked") {
    console.log("Blocked site detected:", message.url);
    showBlockedSiteModal(message.url);
  }

  if (message.action === "userLoggedIn") {
    console.log("User logged in (content.js), userId:", message.userId);
  }
});

// Update the observer callback to use the modal
const observer = new MutationObserver(() => {
  const currentUrl = window.location.href;
  chrome.runtime.sendMessage(
    { action: "checkBlockedUrl", url: currentUrl },
    (response) => {
      if (response?.isBlocked) {
        console.log("Blocked site detected:", currentUrl);
        showBlockedSiteModal(currentUrl);
      }
    }
  );
});

// Start observing URL changes
observer.observe(document, { subtree: true, childList: true });

export {};
