const toggleBtn = document.getElementById('theme-toggle');
const iconWrapper = document.getElementById('icon-wrapper');

const darkIcon = `
  <svg id="theme-icon" viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36.0001" r="30"
            stroke="var(--link)"
            fill="var(--link)"
            stroke-linejoin="round"
            stroke-width="2" />
  </svg>
`;

const lightIcon = `
  <svg id="theme-icon" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M14,24A10,10,0,0,0,24,34V14A10,10,0,0,0,14,24Z"></path>
    <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM6,24A18.1,18.1,0,0,1,24,6v8a10,10,0,0,1,0,20v8A18.1,18.1,0,0,1,6,24Z"></path>
  </svg>
`;

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  localStorage.setItem('theme', mode);

  // Animate fade/shrink out
  iconWrapper.classList.add('icon-transition-out');

  setTimeout(() => {
    // Swap SVG icon
    iconWrapper.innerHTML = mode === 'dark' ? darkIcon : lightIcon;

    // Animate fade/scale in
    iconWrapper.classList.remove('icon-transition-out');
    iconWrapper.classList.add('icon-transition-in');

    // Clean up after animation
    setTimeout(() => {
      iconWrapper.classList.remove('icon-transition-in');
    }, 300);
  }, 200);
}

// On page load
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Toggle theme on click
toggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  setTheme(next);
});
