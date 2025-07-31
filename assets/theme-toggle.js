const toggleBtn = document.getElementById('theme-toggle');
const iconWrapper = document.getElementById('icon-wrapper');

function createLightIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 48 48");
  svg.setAttribute("width", "48");
  svg.setAttribute("height", "48");

  const path1 = document.createElementNS(svg.namespaceURI, "path");
  path1.setAttribute("d", "M14,24A10,10,0,0,0,24,34V14A10,10,0,0,0,14,24Z");

  const path2 = document.createElementNS(svg.namespaceURI, "path");
  path2.setAttribute("d", "M24,2A22,22,0,1,0,46,24,21.9,21.9,0,0,0,24,2ZM6,24A18.1,18.1,0,0,1,24,6v8a10,10,0,0,1,0,20v8A18.1,18.1,0,0,1,6,24Z");

  svg.appendChild(path1);
  svg.appendChild(path2);
  return svg;
}

function createDarkIcon() {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 72 72");
  svg.setAttribute("width", "48");
  svg.setAttribute("height", "48");

  const circle = document.createElementNS(svg.namespaceURI, "circle");
  circle.setAttribute("cx", "36");
  circle.setAttribute("cy", "36.0001");
  circle.setAttribute("r", "30");
  circle.setAttribute("stroke", "var(--link)");
  circle.setAttribute("fill", "var(--link)");
  circle.setAttribute("stroke-linejoin", "round");
  circle.setAttribute("stroke-width", "2");

  svg.appendChild(circle);
  return svg;
}

function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);

  iconWrapper.classList.add("icon-transition-out");

  setTimeout(() => {
    iconWrapper.innerHTML = ""; // Clear previous icon
    const newIcon = mode === "dark" ? createDarkIcon() : createLightIcon();
    iconWrapper.appendChild(newIcon);

    iconWrapper.classList.remove("icon-transition-out");
    iconWrapper.classList.add("icon-transition-in");

    setTimeout(() => {
      iconWrapper.classList.remove("icon-transition-in");
    }, 300);
  }, 200);
}

// Initialize
const savedTheme = localStorage.getItem("theme") || "light";
setTheme(savedTheme);

toggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  setTheme(next);
});
