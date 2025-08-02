---
layout: default
title: Tag Graph
permalink: /tags/
---

<h1>All Tags</h1>


<pre>
{{ site.tags | jsonify }}
</pre>

<div id="network" style="width: 100%; height: 600px; border: 1px solid var(--tertiary); margin-top: 2rem;"></div>

<!-- Load Vis Network -->
<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const style = getComputedStyle(root);

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

  const minSize = 8;
  const maxSize = 20;
  const minCount = Math.min(...tagData.map(t => t.count));
  const maxCount = Math.max(...tagData.map(t => t.count));

  tagData.forEach(tag => {
    const size = minSize + ((tag.count - minCount) / (maxCount - minCount || 1)) * (maxSize - minSize);

    nodes.add({
      id: tag.name,
      label: tag.name,
      value: size,
      href: tag.url,
      shape: "dot",
      color: {
        background: style.getPropertyValue("--secondary").trim(),
        border: style.getPropertyValue("--tertiary").trim()
      },
      font: {
        face: "IBM Plex Mono",
        color: style.getPropertyValue("--darkgray").trim(),
        size: 14,
        vadjust: 8
      }
    });
  });

  // Connect every node to every other (full mesh)
  for (let i = 0; i < tagData.length; i++) {
    for (let j = i + 1; j < tagData.length; j++) {
      edges.push({
        from: tagData[i].name,
        to: tagData[j].name,
        dashes: true,
        color: {
          color: style.getPropertyValue("--darkgray").trim(),
          opacity: 0.4
        },
        width: 0.6
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
      borderWidth: 1,
      shadow: false
    },
    edges: {
      smooth: false
    }
  };

  const network = new vis.Network(container, data, options);

  // Make nodes clickable
  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      const node = nodes.get(params.nodes[0]);
      window.location.href = node.href;
    }
  });
});
</script>
