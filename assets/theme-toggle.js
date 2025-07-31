const toggleBtn = document.getElementById('theme-toggle');
const morphPath = document.getElementById('morph-path');

// Light mode icon: partial sun (half-moon shape)
const lightPath = "M50,20 A30,30 0 1,0 80,50 A20,30 0 1,1 50,20 Z";

// Dark mode icon: full filled circle
const darkPath = "M50,20 A30,30 0 1,0 50.0001,20 Z";

// Set initial theme and path
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
morphPath.setAttribute('d', savedTheme === 'dark' ? darkPath : lightPath);

// Morphing function
function morphTo(newPath) {
  const currentPath = morphPath.getAttribute('d');
  const interpolator = flubber.interpolate(currentPath, newPath);
  let frame = 0;
  const totalFrames = 30;

  function animate() {
    const progress = frame / totalFrames;
    morphPath.setAttribute('d', interpolator(progress));
    frame++;
    if (frame <= totalFrames) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

toggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // Morph icon
  const newPath = newTheme === 'dark' ? darkPath : lightPath;
  morphTo(newPath);
});
