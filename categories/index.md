---
layout: default
title: Categories Network
permalink: /categories/
---

<h1>All Categories</h1>
<div id="network" style="width: 100%; height: 600px; border: 1px solid var(--gray); border-radius: 12px;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    const vars = getComputedStyle(document.documentElement);
    const textColor = vars.getPropertyValue('--text').trim();
    const nodeColor = vars.getPropertyValue('--gray').trim();
    const edgeColor = vars.getPropertyValue('--link').trim();
    const bgColor = vars.getPropertyValue('--bg').trim();

    // Central non-clickable node
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

    // Add category nodes
    {% assign category_list = "" | split: "" %}
    {% for note in site.notes %}
      {% if note.published != false and note.categories %}
        {% for cat in note.categories %}
          {% assign slug = cat | slugify %}
          {% unless category_list contains slug %}
            {% assign category_list = category_list | push: slug %}
            nodes.add({
              id: "{{ slug }}",
              label: "{{ cat }}",
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

    // Edges from center to each category
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
