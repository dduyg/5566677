---
layout: default
title: Tags Web
permalink: /tags/
---

<h1>All Tags</h1>
<div id="tag-network" style="height: 600px; border: 1px solid var(--gray); border-radius: 8px;"></div>

<!-- vis-network library -->
<script src="https://unpkg.com/vis-network@9.1.2/standalone/umd/vis-network.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const centerId = 'center-node';
    const tagCounts = {};
    const tagUrls = {};

    {% assign published_notes = site.notes | where_exp: "note", "note.published != false" %}
    {% for note in published_notes %}
      {% for tag in note.tags %}
        {% assign tag_str = tag | downcase %}
        {% if tagCounts[tag_str] %}
          tagCounts[tag_str] += 1;
        {% else %}
          tagCounts[tag_str] = 1;
          tagUrls[tag_str] = '/tags/' + tag_str + '/';
        {% endif %}
      {% endfor %}
    {% endfor %}

    const tags = Object.keys(tagCounts);

    const nodes = [
      {
        id: centerId,
        label: '',
        size: 30,
        color: {
          background: getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
          border: getComputedStyle(document.documentElement).getPropertyValue('--secondary').trim(),
        },
        borderWidth: 3,
        physics: false
      }
    ];

    tags.forEach(tag => {
      nodes.push({
        id: tag,
        label: tag,
        size: 15 + tagCounts[tag] * 2,
        color: {
          background: getComputedStyle(document.documentElement).getPropertyValue('--gray').trim(),
          border: getComputedStyle(document.documentElement).getPropertyValue('--darkgray').trim()
        },
        font: { color: getComputedStyle(document.documentElement).getPropertyValue('--text').trim() },
        url: tagUrls[tag]
      });
    });

    const edges = [];

    // Center to each tag
    tags.forEach(tag => {
      edges.push({
        from: centerId,
        to: tag,
        dashes: true,
        color: { color: getComputedStyle(document.documentElement).getPropertyValue('--darkgray').trim() }
      });
    });

    // All tags to each other (fully connected)
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        edges.push({
          from: tags[i],
          to: tags[j],
          dashes: true,
          color: { color: getComputedStyle(document.documentElement).getPropertyValue('--darkgray').trim() }
        });
      }
    }

    const container = document.getElementById('tag-network');
    const data = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
    const options = {
      nodes: { shape: 'dot' },
      layout: { improvedLayout: true },
      physics: {
        stabilization: true,
        barnesHut: {
          centralGravity: 0.3,
          springLength: tags.length > 10 ? 100 : 180
        }
      },
      interaction: { hover: true }
    };

    const network = new vis.Network(container, data, options);

    // Make tags clickable
    network.on("click", function (params) {
      const nodeId = params.nodes[0];
      const node = nodes.find(n => n.id === nodeId);
      if (node && node.url) {
        window.location.href = node.url;
      }
    });
  });
</script>
