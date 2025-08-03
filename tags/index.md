---
layout: default
title: Tag Graph
permalink: /tags/
---

<h1>🏷 All Tags</h1>
<div id="network" style="width: 100%; height: 60vh; border: 1px solid var(--tertiary); margin-top: 2rem;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const vars = getComputedStyle(root);

  const bgColor = vars.getPropertyValue('--secondary').trim();
  const borderColor = vars.getPropertyValue('--tertiary').trim();
  const edgeColor = vars.getPropertyValue('--darkgray').trim();
  const labelColor = vars.getPropertyValue('--darkgray').trim();
  const highlightColor = vars.getPropertyValue('--highlight').trim();

  const nodes = new vis.DataSet();
  const edges = [];
  const tagIds = [];

  // Build tag nodes
  {% assign seen_tags = "" | split: "" %}
  {% for note in site.notes %}
    {% if note.published != false and note.tags %}
      {% for tag in note.tags %}
        {% assign slug = tag | slugify %}
        {% unless seen_tags contains slug %}
          {% assign seen_tags = seen_tags | push: slug %}
          {% assign tag_count = 0 %}
          {% for other_note in site.notes %}
            {% if other_note.published != false and other_note.tags contains tag %}
              {% assign tag_count = tag_count | plus: 1 %}
            {% endif %}
          {% endfor %}
          {% assign node_size = tag_count | times: 1.5 | plus: 4 %}
          {% if node_size > 16 %}
            {% assign node_size = 16 %}
          {% endif %}
          {% if node_size < 6 %}
            {% assign node_size = 6 %}
          {% endif %}
          nodes.add({
            id: "{{ slug }}",
            label: "{{ tag }}",
            value: {{ node_size }},
            color: {
              background: bgColor,
              border: borderColor
            },
            font: {
              color: labelColor,
              face: "IBM Plex Mono",
              size: 12,
              vadjust: 6
            },
            href: "{{ '/tags/' | append: slug | append: '/' | relative_url }}"
          });
          tagIds.push("{{ slug }}");
        {% endunless %}
      {% endfor %}
    {% endif %}
  {% endfor %}

  // Create dashed connections between all tags
  for (let i = 0; i < tagIds.length; i++) {
    for (let j = i + 1; j < tagIds.length; j++) {
      edges.push({
        from: tagIds[i],
        to: tagIds[j],
        color: {
          color: edgeColor,
          opacity: 0.4
        },
        width: 1,
        dashes: [3, 3]
      });
    }
  }

  const container = document.getElementById("network");
  const data = { nodes, edges };

  const options = {
    layout: {
      improvedLayout: true
    },
    physics: {
      enabled: true,
      stabilization: {
        iterations: 200,
        updateInterval: 25
      },
      solver: "forceAtlas2Based"
    },
    interaction: {
      hover: true,
      dragNodes: true,
      zoomView: true
    },
    nodes: {
      shape: "dot",
      scaling: {
        min: 6,
        max: 16
      },
      borderWidth: 2
    },
    edges: {
      smooth: false
    }
  };

  const network = new vis.Network(container, data, options);

  // Click to highlight and navigate
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
