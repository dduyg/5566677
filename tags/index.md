---
layout: default
title: Tag Graph
permalink: /tags/
---

<h1>All Tags</h1>
<div id="network" style="width: 100%; height: 600px; border: 1px solid var(--tertiary); margin-top: 2rem;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const vars = getComputedStyle(root);

  const tagData = [
    {% for tag in site.tags %}
      {
        name: {{ tag[0] | jsonify }},
        count: {{ tag[1].size }},
        url: {{ '/tags/' | append: tag[0] | slugify | append: '/' | relative_url | jsonify }}
      }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ];

  if (tagData.length === 0) return;

  const nodes = new vis.DataSet();
  const edges = [];

  const bgColor = vars.getPropertyValue('--secondary').trim();
  const borderColor = vars.getPropertyValue('--tertiary').trim();
  const edgeColor = vars.getPropertyValue('--darkgray').trim();
  const labelColor = edgeColor;
  const highlightColor = vars.getPropertyValue('--highlight').trim();

  const counts = tagData.map(t => t.count);
  const minSize = 6;
  const maxSize = 16;
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  tagData.forEach(tag => {
    const size = minSize + ((tag.count - minCount) / (maxCount - minCount || 1)) * (maxSize - minSize);
    nodes.add({
      id: tag.name,
      label: tag.name,
      value: size,
      href: tag.url,
      color: {
        background: bgColor,
        border: borderColor
      },
      font: {
        face: "IBM Plex Mono",
        color: labelColor,
        vadjust: 8,
        size: 14
      }
    });
  });

  // Connect every tag to every tag (web network)
  for (let i = 0; i < tagData.length; i++) {
    for (let j = i + 1; j < tagData.length; j++) {
      edges.push({
        from: tagData[i].name,
        to: tagData[j].name,
        color: {
          color: edgeColor,
          opacity: 0.3
        },
        width: 0.6,
        dashes: true
      });
    }
  }

  const container = document.getElementById("network");
  const data = { nodes, edges };
  const options = {
    layout: { improvedLayout: true, randomSeed: 42 },
    interaction: { hover: true },
    physics: { enabled: false },
    nodes: {
      shape: "dot",
      scaling: {
        min: minSize,
        max: maxSize
      }
    },
    edges: { smooth: false }
  };

  const network = new vis.Network(container, data, options);

  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      const id = params.nodes[0];
      const node = nodes.get(id);
      nodes.update({
        id,
        color: {
          background: highlightColor,
          border: highlightColor
        }
      });
      if (node.href) {
        setTimeout(() => {
          window.location.href = node.href;
        }, 150);
      }
    }
  });
});
</script>
