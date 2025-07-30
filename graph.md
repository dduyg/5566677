---
layout: default
title: Graph View
permalink: /graph/
---

<h1>🕸 Graph View</h1>
<p>Click a node to open the note.</p>
<div id="mynetwork" style="height: 600px; border: 1px solid #ccc;"></div>

<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<script>
  const nodes = [
    {% for note in site.notes %}
      {% if note.published != false %}
        { id: '{{ note.url | relative_url }}', label: '{{ note.title | escape }}' },
      {% endif %}
    {% endfor %}
  ];

  const edges = [
    {% for note in site.notes %}
      {% if note.published != false %}
        {% assign content = note.content | downcase %}
        {% for other in site.notes %}
          {% if other.published != false and note.url != other.url and content contains other.title | downcase %}
            { from: '{{ note.url | relative_url }}', to: '{{ other.url | relative_url }}' },
          {% endif %}
        {% endfor %}
      {% endif %}
    {% endfor %}
  ];

  const container = document.getElementById('mynetwork');
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  const options = {
    nodes: { shape: 'dot', size: 14, font: { size: 16 } },
    edges: { arrows: 'to', color: '#888' },
    layout: { improvedLayout: true },
    physics: { stabilization: true }
  };

  const network = new vis.Network(container, data, options);
  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      window.location.href = params.nodes[0];
    }
  });
</script>
