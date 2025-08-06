const toggleBtn = document.getElementById('theme-toggle');

// Restore previous theme and spin state
const savedTheme = localStorage.getItem('theme') || 'light';
const isDark = savedTheme === 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (isDark) {
  toggleBtn.classList.add('spin');
}

toggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';

  // Update theme and store it
  document.documentElement.setAttribute('data-theme', nextTheme);
  localStorage.setItem('theme', nextTheme);

  // Spin the icon
  toggleBtn.classList.toggle('spin');
});
