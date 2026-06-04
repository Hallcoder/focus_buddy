// Prevent back button from leaving the blocked page
history.replaceState(null, "", window.location.href);
history.pushState(null, "", window.location.href);
window.addEventListener("popstate", function() {
  history.pushState(null, "", window.location.href);
});

// Sanitize text to prevent XSS when inserting into DOM
function sanitize(str) {
  var div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

var quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "You will never always be motivated. You have to learn to be disciplined.", author: "Unknown" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements.", author: "John C. Maxwell" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Starve your distractions, feed your focus.", author: "Unknown" },
  { text: "Lack of direction, not lack of time, is the problem.", author: "Zig Ziglar" },
  { text: "Productivity is never an accident. It is always the result of a commitment to excellence.", author: "Paul J. Meyer" },
  { text: "Where focus goes, energy flows.", author: "Tony Robbins" },
  { text: "The main thing is to keep the main thing the main thing.", author: "Stephen Covey" }
];

// Parse blocked site from URL params
var params = new URLSearchParams(window.location.search);
var blockedSite = params.get("site") || "Unknown site";

// Display sanitized domain
document.getElementById("blocked-domain").textContent = blockedSite;

// Pick and display a random quote
var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
document.getElementById("quote-text").textContent = "\u201C" + randomQuote.text + "\u201D";
document.getElementById("quote-author").textContent = "\u2014 " + randomQuote.author;
