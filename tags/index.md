---
layout: default
title: All Tags
permalink: /tags/
---

<h1>🏷 All Tags</h1>
<div id="tag-graph" style="border: 1px solid var(--tertiary); height: 60vh; margin-top: 2rem;"></div>

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
          {% assign node_size = tag_count | times: 1.5 | plus: 3 %}
          {% if node_size > 12 %}
            {% assign node_size = 12 %}
          {% endif %}
          {% if node_size < 5 %}
            {% assign node_size = 5 %}
          {% endif %}
          nodes.add({
            id: "{{ slug }}",
            label: "{{ tag }}",
            value: {{ node_size }},
            color: {
              background: bgColor,
              border: borderColor,
              highlight: {
                background: highlightColor,
                border: borderColor
              }
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

  // Connect all tags with dashed edges
  for (let i = 0; i < tagIds.length; i++) {
    for (let j = i + 1; j < tagIds.length; j++) {
      edges.push({
        id: `${tagIds[i]}-${tagIds[j]}`,
        from: tagIds[i],
        to: tagIds[j],
        color: {
          color: edgeColor,
          opacity: 0.5
        },
        width: 0.7,
        dashes: [2, 4]
      });
    }
  }

  const container = document.getElementById("tag-graph");
  const data = { nodes, edges: new vis.DataSet(edges) };

  const options = {
    layout: {
      improvedLayout: true
    },
    physics: {
      enabled: true,
      solver: 'forceAtlas2Based',
      forceAtlas2Based: {
        gravitationalConstant: -50,
        springLength: 100,
        springConstant: 0.02
      },
      stabilization: {
        iterations: 150
      }
    },
    interaction: {
      hover: true,
      dragNodes: true,
      zoomView: true
    },
    nodes: {
      shape: "dot",
      scaling: {
        min: 5,
        max: 12
      },
      borderWidth: 2
    },
    edges: {
      smooth: false
    }
  };

  const network = new vis.Network(container, data, options);

  // On click: slightly bold connected lines, no color change
  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      const id = params.nodes[0];
      const node = nodes.get(id);
      const connectedEdges = network.getConnectedEdges(id);

      // Bold the lines slightly
      connectedEdges.forEach(eId => {
        const original = data.edges.get(eId);
        data.edges.update({
          id: eId,
          width: 1.5 // Slight increase only
        });
      });

      if (node.href) {
        setTimeout(() => {
          window.location.href = node.href;
        }, 100);
      }
    }
  });
});
</script>
