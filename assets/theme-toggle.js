const toggle = document.getElementById('theme-toggle');

const ICON_LIGHT = "data:image/svg+xml,%3Csvg viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg' fill='currentColor'%3E%3Cpath d='M14,24A10,10,0,0,0,24,34V14A10,10,0,0,0,14,24Z'/%3E%3Cpath d='M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM6,24A18.1,18.1,0,0,1,24,6v8a10,10,0,0,1,0,20v8A18.1,18.1,0,0,1,6,24Z'/%3E%3C/svg%3E";
const ICON_DARK = "data:image/svg+xml,%3Csvg fill='currentColor' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='matrix(0.10009,0,0,0.10009,511.942,319.993)'%3E%3Cpath d='M321.714,559.995C383.452,559.4 444.576,533.825 488.528,490.39C540.728,438.804 567.614,362.474 558.237,289.61C542.165,164.734 439.517,80 320.172,80C229.504,80 141.375,136.719 102.723,218.967C73.131,281.935 73.079,357.952 102.723,421.033C141.101,502.698 227.781,559.119 318.63,559.995C319.658,559.998 320.686,559.998 321.714,559.995ZM318.887,519.994C226.669,519.105 140.633,447.794 123.527,356.366C111.467,291.905 134.234,222.15 181.658,176.375C237.036,122.923 324.063,105.014 396.424,135.314C461.174,162.428 509.632,225.368 518.562,294.718C526.216,354.158 504.885,416.454 462.966,459.367C426.2,497.004 374.636,519.481 321.457,519.994C320.6,519.997 319.744,519.997 318.887,519.994Z'/%3E%3C/g%3E%3Cg transform='matrix(1.20036,0,0,1.20036,-108.995,-70.5272)'%3E%3Ccircle cx='543.992' cy='352' r='14.13'/%3E%3C/g%3E%3C/svg%3E";

function setIcon(theme) {
  toggle.style.backgroundImage = `url('${theme === "dark" ? ICON_DARK : ICON_LIGHT}')`;
}

function loadTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
  setIcon(theme);
}

toggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
    setIcon('light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    setIcon('dark');
  }
});

loadTheme();
