/* ------------------------------------------------------------------
   Cookie utility functions
------------------------------------------------------------------ */

function createCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/* ------------------------------------------------------------------
   Hero loader for posts and pages
   Loads hero.jsx if the "visited" cookie doesn't exist
------------------------------------------------------------------ */

// Check if visited cookie exists
if (!readCookie("visited")) {
  // Create root div for hero if it doesn't exist
  if (!document.getElementById("root")) {
    const rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.insertBefore(rootDiv, document.body.firstChild);
  }

  // Find the article element and set initial opacity to 0
  const article = document.querySelector("article.post, article.page");
  if (article) {
    article.style.opacity = "0";
    article.style.transition = "opacity 1s ease-in";

    // Fade in the article content after 1.5 seconds
    setTimeout(() => {
      article.style.opacity = "1";
    }, 1500);
  }

  // Load and execute hero.jsx
  const script = document.createElement("script");
  script.type = "text/babel";
  script.setAttribute("data-presets", "env,react");
  script.src = window.HERO_SCRIPT_PATH || "/js/hero.jsx";
  document.body.appendChild(script);

  // Set the visited cookie for 30 days
  createCookie("visited", "true", 30);
}