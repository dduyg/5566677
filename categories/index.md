---
layout: default
title: Categories Graph
permalink: /categories/
---

<h1>All Categories</h1>
<div id="network" style="width: 100%; height: 600px; border: 1px solid var(--gray); border-radius: 12px;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const vars = getComputedStyle(document.documentElement);
    const textColor = vars.getPropertyValue('--text').trim();
    const nodeColor = vars.getPropertyValue('--gray').trim();
    const edgeColor = vars.getPropertyValue('--link').trim();

    // Central hub node (invisible label, big dot)
    const nodes = new vis.DataSet([
      {
        id: 'center',
        label: '',
        value: 30,
        color: {
          background: nodeColor,
          border: nodeColor
        },
        font: { color: textColor },
        physics: false
      },
    ]);

    const categories = [];

    // Build category list and nodes
    {% assign all_categories = "" | split: "" %}
    {% for note in site.notes %}
      {% if note.published != false and note.categories %}
        {% for cat in note.categories %}
          {% assign slug = cat | slugify %}
          {% unless all_categories contains slug %}
            {% assign all_categories = all_categories | push: slug %}
            categories.push({ id: "{{ slug }}", label: "{{ cat }}" });
          {% endunless %}
        {% endfor %}
      {% endif %}
    {% endfor %}

    // Add nodes
    categories.forEach(cat => {
      nodes.add({
        id: cat.id,
        label: cat.label,
        value: 5,
        color: {
          background: nodeColor,
          border: nodeColor
        },
        font: { color: textColor }
      });
    });

    // Edges: center to each category
    const edges = categories.map(cat => ({
      from: 'center',
      to: cat.id,
      dashes: true,
      color: { color: edgeColor },
      width: 1.5
    }));

    // Edges: between every category (to form mesh network)
    for (let i = 0; i < categories.length; i++) {
      for (let j = i + 1; j < categories.length; j++) {
        edges.push({
          from: categories[i].id,
          to: categories[j].id,
          dashes: true,
          color: { color: edgeColor },
          width: 0.5
        });
      }
    }

    const container = document.getElementById("network");
    const data = { nodes: nodes, edges: edges };
    const options = {
      nodes: {
        shape: "dot",
        scaling: { min: 5, max: 15 },
        font: { size: 14, color: textColor }
      },
      layout: { improvedLayout: true },
      physics: {
        barnesHut: {
          gravitationalConstant: -9000,
          springLength: 100,
          springConstant: 0.05
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
