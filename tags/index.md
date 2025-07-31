---
layout: default
title: Tags Web
permalink: /tags/
---

<h1>🏷 Tags Network</h1>
<div id="tag-network" style="height: 600px; border: 1px solid var(--gray); border-radius: 8px;"></div>

<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<script>
  const centerId = 'center-node';

  // Count notes per tag
  const tagCounts = {};
  {% for note in site.notes %}
    {% if note.published != false %}
      {% for tag in note.tags %}
        {% assign tag_str = tag | downcase %}
        {% if tagCounts[tag_str] %}
          tagCounts[tag_str]++;
        {% else %}
          tagCounts[tag_str] = 1;
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}

  // Prepare nodes
  const nodes = [
    {
      id: centerId,
      label: '',
      size: 40,
      color: {
        background: 'var(--secondary)',
        border: 'var(--secondary)'
      },
      borderWidth: 3,
      physics: false
    }
  ];

  Object.keys(tagCounts).forEach(tag => {
    const count = tagCounts[tag];
    nodes.push({
      id: tag,
      label: tag,
      size: 20 + count * 3,
      color: {
        background: 'var(--gray)',
        border: 'var(--darkgray)'
      },
      font: { color: 'var(--text)' },
      url: '/tags/' + tag + '/'
    });
  });

  // Create edges
  const edges = [];

  const tagList = Object.keys(tagCounts);

  // 1. Connect center to all tags
  tagList.forEach(tag => {
    edges.push({
      from: centerId,
      to: tag,
      dashes: true,
      color: { color: 'var(--darkgray)' }
    });
  });

  // 2. Connect all tags to all other tags (fully connected mesh)
  for (let i = 0; i < tagList.length; i++) {
    for (let j = i + 1; j < tagList.length; j++) {
      edges.push({
        from: tagList[i],
        to: tagList[j],
        dashes: true,
        color: { color: 'var(--darkgray)' }
      });
    }
  }

  const container = document.getElementById('tag-network');
  const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
  const options = {
    nodes: {
      shape: 'dot',
      font: { size: 16 },
    },
    layout: { improvedLayout: true },
    physics: {
      stabilization: true,
      barnesHut: {
        centralGravity: 0.3,
        springLength: tagList.length > 10 ? 120 : 180
      }
    },
    interaction: { hover: true },
  };

  const network = new vis.Network(container, data, options);

  network.on("click", function (params) {
    const id = params.nodes[0];
    const node = nodes.find(n => n.id === id);
    if (node && node.url) {
      window.location.href = node.url;
    }
  });
</script>
