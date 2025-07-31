---
layout: default
title: Tag Graph
permalink: /tags/
---

<h1>All Tags</h1>
<div id="tag-graph-container" style="height: 600px; position: relative; border: 1px solid var(--gray); border-radius: 8px;"></div>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const tagCounts = {};
    const tagUrls = {};

    {% assign published_notes = site.notes | where_exp: "note", "note.published != false" %}
    {% for note in published_notes %}
      {% for tag in note.tags %}
        {% assign tag_str = tag | downcase %}
        tagCounts["{{ tag_str }}"] = (tagCounts["{{ tag_str }}"] || 0) + 1;
        tagUrls["{{ tag_str }}"] = "/tags/{{ tag_str }}/";
      {% endfor %}
    {% endfor %}

    const tags = Object.keys(tagCounts);
    const container = document.getElementById("tag-graph-container");

    const width = container.clientWidth;
    const height = container.clientHeight;
    const center = { x: width / 2, y: height / 2 };

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";

    // Define central dot
    const centerCircle = document.createElementNS(svgNS, "circle");
    centerCircle.setAttribute("cx", center.x);
    centerCircle.setAttribute("cy", center.y);
    centerCircle.setAttribute("r", "20");
    centerCircle.setAttribute("fill", "var(--secondary)");
    svg.appendChild(centerCircle);

    const nodePositions = {};
    const radius = Math.min(width, height) / 2.5;
    const angleStep = (2 * Math.PI) / tags.length;

    // Compute tag node positions in a circle
    tags.forEach((tag, i) => {
      const angle = i * angleStep;
      const x = center.x + radius * Math.cos(angle);
      const y = center.y + radius * Math.sin(angle);
      nodePositions[tag] = { x, y };
    });

    // Draw edges to center
    tags.forEach((tag) => {
      const pos = nodePositions[tag];
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", center.x);
      line.setAttribute("y1", center.y);
      line.setAttribute("x2", pos.x);
      line.setAttribute("y2", pos.y);
      line.setAttribute("stroke", "var(--darkgray)");
      line.setAttribute("stroke-dasharray", "4 2");
      svg.appendChild(line);
    });

    // Draw inter-tag lines (web)
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        const a = nodePositions[tags[i]];
        const b = nodePositions[tags[j]];
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", a.x);
        line.setAttribute("y1", a.y);
        line.setAttribute("x2", b.x);
        line.setAttribute("y2", b.y);
        line.setAttribute("stroke", "var(--gray)");
        line.setAttribute("stroke-dasharray", "2 2");
        svg.appendChild(line);
      }
    }

    // Create tag circles
    tags.forEach((tag) => {
      const pos = nodePositions[tag];
      const circle = document.createElementNS(svgNS, "circle");
      const size = 8 + tagCounts[tag] * 2;
      circle.setAttribute("cx", pos.x);
      circle.setAttribute("cy", pos.y);
      circle.setAttribute("r", size);
      circle.setAttribute("fill", "var(--gray)");
      circle.setAttribute("stroke", "var(--darkgray)");
      circle.setAttribute("stroke-width", "1");

      circle.style.cursor = "pointer";
      circle.addEventListener("click", () => {
        window.location.href = tagUrls[tag];
      });

      svg.appendChild(circle);
    });

    container.appendChild(svg);
  });
</script>
