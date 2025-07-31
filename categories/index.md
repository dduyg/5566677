---
layout: default
title: Categories Web
permalink: /categories/
---

<h1>All Categories</h1>
<div id="category-network" style="height: 600px; border: 1px solid var(--gray); border-radius: 8px;"></div>

<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
<script>
  const centerId = 'center-node';

  // Prepare categories with counts
  const categoryCounts = {};
  {% for note in site.notes %}
    {% if note.published != false %}
      {% for category in note.categories %}
        {% assign category_str = category | downcase %}
        {% if categoryCounts[category_str] %}
          categoryCounts[category_str]++;
        {% else %}
          categoryCounts[category_str] = 1;
        {% endif %}
      {% endfor %}
    {% endif %}
  {% endfor %}

  // Create node list
  const nodes = [
    {
      id: centerId,
      label: '',
      size: 30,
      color: {
        background: 'var(--secondary)',
        border: 'var(--secondary)',
      },
      borderWidth: 2,
      physics: false
    }
  ];

  Object.keys(categoryCounts).forEach(cat => {
    const count = categoryCounts[cat];
    nodes.push({
      id: cat,
      label: cat,
      size: 20 + count * 3,
      color: {
        background: 'var(--gray)',
        border: 'var(--darkgray)'
      },
      font: { color: 'var(--text)' },
      url: '/categories/' + cat + '/'
    });
  });

  // Create full-mesh edges + connect to center
  const edges = [];

  // Center to each category
  Object.keys(categoryCounts).forEach(cat => {
    edges.push({
      from: centerId,
      to: cat,
      dashes: true,
      color: { color: 'var(--darkgray)' }
    });
  });

  // Every category to every other category
  const categoryList = Object.keys(categoryCounts);
  for (let i = 0; i < categoryList.length; i++) {
    for (let j = i + 1; j < categoryList.length; j++) {
      edges.push({
        from: categoryList[i],
        to: categoryList[j],
        dashes: true,
        color: { color: 'var(--darkgray)' }
      });
    }
  }

  const container = document.getElementById('category-network');
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
        springLength: 150
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
