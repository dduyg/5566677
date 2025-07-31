---
layout: default
title: Tags Network
permalink: /tags/
---

<h1>All Tags</h1>
<div id="network" style="width: 100%; height: 600px; border: 1px solid #ccc;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const tags = [
      {% assign tag_list = "" | split: "" %}
      {% for note in site.notes %}
        {% if note.published != false and note.tags %}
          {% for tag in note.tags %}
            {% assign slug = tag | slugify %}
            {% unless tag_list contains slug %}
              {% assign tag_list = tag_list | push: slug %}
              {
                id: "{{ slug }}",
                label: "{{ tag }}",
                value: 1
              },
            {% endunless %}
          {% endfor %}
        {% endif %}
      {% endfor %}
    ];

    const edges = [];
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        edges.push({ from: tags[i].id, to: tags[j].id });
      }
    }

    const container = document.getElementById("network");
    const data = {
      nodes: new vis.DataSet(tags),
      edges: new vis.DataSet(edges)
    };

    const options = {
      nodes: {
        shape: "dot",
        scaling: { min: 5, max: 25 },
        font: { size: 14 }
      },
      edges: {
        smooth: true,
        color: { color: "#aaa" }
      },
      layout: {
        improvedLayout: true
      },
      physics: {
        barnesHut: {
          springLength: 100,
          gravitationalConstant: -1200
        },
        stabilization: true
      }
    };

    new vis.Network(container, data, options);
  });
</script>
