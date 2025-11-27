/* ------------------------------------------------------------------
   Hero loader for posts and pages
   Loads hero.jsx if the "visited" cookie doesn't exist
------------------------------------------------------------------ */

// Check if visited cookie exists
if (!readCookie('visited')) {
  // Create root div for hero if it doesn't exist
  if (!document.getElementById('root')) {
    const rootDiv = document.createElement('div');
    rootDiv.id = 'root';
    document.body.insertBefore(rootDiv, document.body.firstChild);
  }

  // Load and execute hero.jsx
  const script = document.createElement('script');
  script.type = 'text/babel';
  script.setAttribute('data-presets', 'env,react');
  script.src = window.HERO_SCRIPT_PATH || '/js/hero.jsx';
  document.body.appendChild(script);
}
