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

  const bgColor = vars.getPropertyValue('--secondary').trim();
  const borderColor = vars.getPropertyValue('--tertiary').trim();
  const edgeColor = vars.getPropertyValue('--darkgray').trim();
  const labelColor = edgeColor;
  const highlightColor = vars.getPropertyValue('--highlight').trim();

  const nodes = new vis.DataSet();
  const edges = [];
  const tagIds = [];

  // Inject tag counts safely
  const tagStats = {{ site.tags | jsonify }};

  const minSize = 6;
  const maxSize = 16;

  const tagNames = Object.keys(tagStats);
  if (tagNames.length === 0) return;

  const counts = tagNames.map(tag => tagStats[tag].length);
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);

  // Create nodes
  tagNames.forEach(tag => {
    const count = tagStats[tag].length;
    const size = minSize + ((count - minCount) / (maxCount - minCount || 1)) * (maxSize - minSize);
    const slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    nodes.add({
      id: slug,
      label: tag,
      value: size,
      color: {
        background: bgColor,
        border: borderColor
      },
      font: {
        color: labelColor,
        size: 14,
        face: "IBM Plex Mono",
        vadjust: 8
      },
      href: "{{ '/tags/' | relative_url }}" + slug + "/"
    });

    tagIds.push(slug);
  });

  // Fully connect nodes
  for (let i = 0; i < tagIds.length; i++) {
    for (let j = i + 1; j < tagIds.length; j++) {
      edges.push({
        from: tagIds[i],
        to: tagIds[j],
        color: {
          color: edgeColor,
          opacity: 0.4
        },
        width: 0.6,
        dashes: true
      });
    }
  }

  const container = document.getElementById("network");
  const data = { nodes, edges };

  const options = {
    layout: {
      improvedLayout: true,
      randomSeed: 13
    },
    physics: { enabled: false },
    interaction: {
      hover: true,
      dragNodes: false,
      zoomView: true
    },
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
      if (node.href) {
        nodes.update({
          id: id,
          color: {
            background: highlightColor,
            border: highlightColor
          }
        });
        setTimeout(() => {
          window.location.href = node.href;
        }, 150);
      }
    }
  });
});
</script>
