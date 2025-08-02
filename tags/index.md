---
layout: default
title: Tags
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
          {% assign node_size = tag_count | plus: 6 %}
          {% if node_size > 16 %}
            {% assign node_size = 16 %}
          {% endif %}
          {% if node_size < 8 %}
            {% assign node_size = 8 %}
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
              size: 14,
              face: "IBM Plex Mono",
              vadjust: 8
            },
            href: "{{ '/tags/' | append: slug | append: '/' | relative_url }}"
          });
          tagIds.push("{{ slug }}");
        {% endunless %}
      {% endfor %}
    {% endif %}
  {% endfor %}

  // Full web mesh
  for (let i = 0; i < tagIds.length; i++) {
    for (let j = i + 1; j < tagIds.length; j++) {
      edges.push({
        from: tagIds[i],
        to: tagIds[j],
        color: {
          color: edgeColor,
          opacity: 0.5
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
    physics: {
      enabled: false
    },
    interaction: {
      hover: true,
      dragNodes: false,
      zoomView: true
    },
    nodes: {
      shape: "dot",
      scaling: {
        min: 8,
        max: 16
      }
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
