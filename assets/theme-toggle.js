const toggleBtn = document.getElementById('theme-toggle');
const icon = document.getElementById('theme-icon');

const darkIcon = `
  <svg viewBox="0 0 72 72" xmlns="http://www.w3.org/2000/svg">
    <circle cx="36" cy="36.0001" r="30" stroke="var(--link)" stroke-linejoin="round" stroke-width="2" fill="none"/>
  </svg>
`;

const lightIcon = `
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M14,24A10,10,0,0,0,24,34V14A10,10,0,0,0,14,24Z"></path>
    <path d="M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM6,24A18.1,18.1,0,0,1,24,6v8a10,10,0,0,1,0,20v8A18.1,18.1,0,0,1,6,24Z"></path>
  </svg>
`;

function setTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
  icon.innerHTML = mode === 'dark' ? darkIcon : lightIcon;
  localStorage.setItem('theme', mode);
}

// On load: use saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

toggleBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const nextTheme = current === 'light' ? 'dark' : 'light';
  setTheme(nextTheme);
});
