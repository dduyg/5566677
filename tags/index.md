---
layout: default
title: Tags Network
permalink: /tags/
---

<h1>🏷 Tags Network</h1>
<div id="network" style="width: 100%; height: 600px;"></div>

<!-- Include Vis Network JS & CSS -->
<script src="https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.js"></script>
<link href="https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.css" rel="stylesheet" />

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const tags = [
      {% assign all_tags = site.tags | sort %}
      {% for tag in all_tags %}
        { id: "{{ tag[0] | slugify }}", label: "{{ tag[0] }}", value: {{ tag[1].size }} },
      {% endfor %}
    ];

    const nodeCount = tags.length;
    const springLength = nodeCount <= 10 ? 300 : nodeCount <= 20 ? 200 : 100;

    const edges = [];
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        edges.push({ from: tags[i].id, to: tags[j].id, color: '#ddd' });
      }
    }

    const data = {
      nodes: new vis.DataSet(tags),
      edges: new vis.DataSet(edges)
    };

    const options = {
      nodes: {
        shape: "dot",
        scaling: { min: 5, max: 20 },
        font: { size: 14 }
      },
      edges: {
        smooth: true
      },
      physics: {
        barnesHut: {
          springLength: springLength,
          gravitationalConstant: -2000
        },
        stabilization: { iterations: 200 }
      }
    };

    new vis.Network(document.getElementById("network"), data, options);
  });
</script>
