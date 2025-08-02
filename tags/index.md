---
layout: default
title: Tag Graph
permalink: /tags/
---

<h1>All Tags</h1>
<div id="network" style="width: 100%; height: 600px; border: 1px solid var(--tertiary); border-radius: 12px; margin-top: 1rem;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
  const root = document.documentElement;
  const vars = getComputedStyle(root);

  const nodeColor = vars.getPropertyValue('--lightgray').trim();
  const edgeColor = vars.getPropertyValue('--darkgray').trim();
  const textColor = nodeColor;
  const centerColor = vars.getPropertyValue('--secondary').trim();
  const highlightColor = vars.getPropertyValue('--highlight').trim();

  const tagCounts = {};
  {% for note in site.notes %}
    {% if note.published != false and note.tags %}
      {% for tag in note.tags %}
        {% assign slug = tag | slugify %}
        {% if tagCounts[slug] %}
          {% assign tagCounts[slug] = tagCounts[slug] | plus: 1 %}
        {% else %}
          {% assign tagCounts[slug] = 1 %}
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}

  const nodes = new vis.DataSet([
    {
      id: 'center',
      label: '',
      value: 30,
      color: {
        background: centerColor,
        border: centerColor
      },
      font: { color: textColor },
      physics: false,
      fixed: true,
      shadow: true
    }
  ]);

  const tagIds = [];

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
          {% assign node_size = tag_count | times: 1 | plus: 10 %}
          {% if node_size > 24 %}
            {% assign node_size = 24 %}
          {% endif %}
          {% if node_size < 12 %}
            {% assign node_size = 12 %}
          {% endif %}
          nodes.add({
            id: "{{ slug }}",
            label: "{{ tag }}",
            value: {{ node_size }},
            color: {
              background: nodeColor,
              border: nodeColor
            },
            font: { color: textColor },
            href: "{{ '/tags/' | append: slug | append: '/' | relative_url }}",
            shadow: true
          });
          tagIds.push("{{ slug }}");
        {% endunless %}
      {% endfor %}
    {% endif %}
  {% endfor %}

  const edges = [];

  // Connect all tags to center
  tagIds.forEach(id => {
    edges.push({
      from: 'center',
      to: id,
      color: { color: edgeColor },
      width: 1,
      smooth: false
    });
  });

  // Connect all tags to each other
  for (let i = 0; i < tagIds.length; i++) {
    for (let j = i + 1; j < tagIds.length; j++) {
      edges.push({
        from: tagIds[i],
        to: tagIds[j],
        color: { color: edgeColor },
        width: 0.6,
        smooth: false
      });
    }
  }

  const container = document.getElementById("network");

  const data = { nodes: nodes, edges: edges };

  const options = {
    layout: { improvedLayout: true },
    physics: {
      barnesHut: {
        gravitationalConstant: -9000,
        springLength: 140,
        springConstant: 0.03
      },
      stabilization: true
    },
    interaction: {
      hover: true,
      dragNodes: true,
      zoomView: true
    },
    nodes: {
      shape: "dot",
      scaling: { min: 12, max: 24 },
      font: {
        size: 13,
        color: textColor,
        strokeWidth: 0
      },
      shadow: true
    },
    edges: {
      smooth: false,
      shadow: false
    }
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
