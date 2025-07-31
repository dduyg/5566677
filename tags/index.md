---
layout: default
title: Tags Network
permalink: /tags/
---

<h1>All Tags</h1>
<div id="network" style="width: 100%; height: 600px; border: 1px solid var(--gray); border-radius: 12px;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    // Detect dark mode from data-theme attribute
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const vars = getComputedStyle(document.documentElement);
    const textColor = vars.getPropertyValue('--text').trim();
    const nodeColor = vars.getPropertyValue('--gray').trim();
    const edgeColor = vars.getPropertyValue('--link').trim();
    const bgColor = vars.getPropertyValue('--bg').trim();

    // Central invisible node
    const nodes = new vis.DataSet([
      {
        id: 'center',
        label: '',
        value: 30,
        color: {
          background: nodeColor,
          border: nodeColor,
        },
        font: { color: textColor },
        physics: false
      },
    ]);

    // Add tag nodes
    {% assign tag_list = "" | split: "" %}
    {% for note in site.notes %}
      {% if note.published != false and note.tags %}
        {% for tag in note.tags %}
          {% assign slug = tag | slugify %}
          {% unless tag_list contains slug %}
            {% assign tag_list = tag_list | push: slug %}
            nodes.add({
              id: "{{ slug }}",
              label: "{{ tag }}",
              value: 5,
              color: {
                background: nodeColor,
                border: nodeColor
              },
              font: { color: textColor }
            });
          {% endunless %}
        {% endfor %}
      {% endif %}
    {% endfor %}

    // Link all tags to central node
    const edges = [];
    nodes.forEach(function (node) {
      if (node.id !== 'center') {
        edges.push({
          from: 'center',
          to: node.id,
          dashes: true,
          color: { color: edgeColor },
          width: 1.5
        });
      }
    });

    const container = document.getElementById("network");

    const data = {
      nodes: nodes,
      edges: edges
    };

    const options = {
      nodes: {
        shape: "dot",
        scaling: {
          min: 5,
          max: 15
        },
        font: {
          size: 14,
          color: textColor
        }
      },
      layout: {
        improvedLayout: true
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -9000,
          springLength: 150,
          springConstant: 0.04
        },
        stabilization: true
      },
      edges: {
        smooth: true
      },
      interaction: {
        dragNodes: true,
        hover: true
      }
    };

    new vis.Network(container, data, options);
  });
</script>
