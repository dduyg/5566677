---
layout: default
title: All Tags
permalink: /tags/
---

<h1>All Tags</h1>
<div id="tag-graph" style="border:1px solid var(--tertiary); height: 600px;"></div>

<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" type="text/css" />

<script>
  const tagCounts = {};
  {% for note in site.notes %}
    {% if note.published != false and note.tags %}
      {% for tag in note.tags %}
        tagCounts["{{ tag }}"] = (tagCounts["{{ tag }}"] || 0) + 1;
      {% endfor %}
    {% endif %}
  {% endfor %}

  const tags = Object.keys(tagCounts);
  const nodes = tags.map(tag => {
    const count = tagCounts[tag];
    const size = Math.min(30, Math.max(10, count * 5)); // Minimum 10, max 30
    return {
      id: tag,
      label: tag,
      value: size,
      shape: 'dot',
      font: {
        face: 'IBM Plex Mono',
        color: 'var(--darkgray)'
      },
      color: {
        background: 'var(--secondary)',
        border: 'var(--tertiary)',
        highlight: {
          background: 'var(--highlight)',
          border: 'var(--tertiary)'
        }
      }
    };
  });

  const edges = [];
  for (let i = 0; i < tags.length; i++) {
    for (let j = i + 1; j < tags.length; j++) {
      edges.push({ from: tags[i], to: tags[j], dashes: true, color: 'var(--darkgray)' });
    }
  }

  const data = {
    nodes: new vis.DataSet(nodes),
    edges: new vis.DataSet(edges)
  };

  const options = {
    interaction: { hover: true },
    nodes: {
      borderWidth: 2,
    },
    edges: {
      width: 1,
      smooth: false
    },
    physics: {
      stabilization: true
    }
  };

  const container = document.getElementById('tag-graph');
  const network = new vis.Network(container, data, options);

  // On click, go to the tag page
  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      const tag = params.nodes[0];
      window.location.href = `/tags/${tag}/`;
    }
  });
</script>
