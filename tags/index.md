---
layout: default
title: All Tags
permalink: /tags/
---

# All Tags

<div id="tag-network" style="height: 600px; border: 1px solid #ccc;"></div>

<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<script>
  const tagCounts = {};

  {% for note in site.notes %}
    {% if note.published != false %}
      {% for tag in note.tags %}
        tagCounts["{{ tag | escape }}"] = (tagCounts["{{ tag | escape }}"] || 0) + 1;
      {% endfor %}
    {% endif %}
  {% endfor %}

  const nodes = [];
  for (const [tag, count] of Object.entries(tagCounts)) {
    nodes.push({
      id: tag,
      label: tag,
      value: count,
      title: `${count} note${count > 1 ? 's' : ''}`
    });
  }

  const data = {
    nodes: new vis.DataSet(nodes),
    edges: []
  };

  const options = {
    nodes: {
      shape: 'dot',
      scaling: {
        min: 5,
        max: 50
      },
      font: {
        size: 16,
        color: '#333'
      }
    },
    physics: {
      stabilization: true
    }
  };

  const network = new vis.Network(document.getElementById('tag-network'), data, options);

  network.on('click', function (params) {
    if (params.nodes.length > 0) {
      const tag = params.nodes[0];
      window.location.href = '/tags/' + encodeURIComponent(tag) + '/';
    }
  });
</script>
