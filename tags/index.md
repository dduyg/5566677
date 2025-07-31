---
layout: default
title: All Tags
permalink: /tags/
---

<h1>🏷 Tag Graph</h1>
<div id="tag-network" style="height: 600px; border: 1px solid #ccc;"></div>

<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<script>
  const nodes = [
    {% assign all_tags = "" | split: "" %}
    {% for note in site.notes %}
      {% if note.published != false %}
        {% for tag in note.tags %}
          {% assign all_tags = all_tags | push: tag %}
        {% endfor %}
      {% endif %}
    {% endfor %}

    {% assign unique_tags = all_tags | uniq %}
    {% for tag in unique_tags %}
      {% assign tagged_notes = site.notes | where_exp: "note", "note.published != false and note.tags contains '" | append: tag | append: "'" %}
      { id: '{{ tag }}', label: '{{ tag }}', value: {{ tagged_notes | size }}, title: '{{ tagged_notes | size }} note(s)' },
    {% endfor %}
  ];

  const data = {
    nodes: new vis.DataSet(nodes),
    edges: [] // or omit for a clean layout
  };

  const options = {
    nodes: {
      shape: 'dot',
      scaling: { min: 5, max: 50 },
      font: { size: 14, color: '#333' }
    },
    layout: {
      improvedLayout: true
    },
    physics: {
      stabilization: true
    }
  };

  const network = new vis.Network(document.getElementById("tag-network"), data, options);

  network.on("click", function (params) {
    if (params.nodes.length > 0) {
      const tag = params.nodes[0];
      window.location.href = "/tags/" + encodeURIComponent(tag) + "/";
    }
  });
</script>
