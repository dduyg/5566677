---
layout: default
title: Tag Graph
permalink: /tags/
---

<h1>All Tags</h1>
<div id="network" style="width: 100%; height: 600px; border: 1px solid var(--gray); border-radius: 12px; margin-top: 1rem;"></div>

<!-- vis-network scripts -->
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
    const centerColor = vars.getPropertyValue('--secondary').trim();

    // Initialize nodes with central node
    const nodes = new vis.DataSet([
      {
        id: 'center',
        label: '',
        value: 40,
        color: {
          background: centerColor,
          border: centerColor
        },
        physics: false,
        font: { color: textColor },
        fixed: true
      }
    ]);

    // Collect all unique tags
    {% assign all_tags = "" | split: "" %}
    {% for note in site.notes %}
      {% if note.published != false and note.tags %}
        {% for tag in note.tags %}
          {% assign slug = tag | slugify %}
          {% unless all_tags contains slug %}
            {% assign all_tags = all_tags | push: slug %}
            nodes.add({
              id: "{{ slug }}",
              label: "{{ tag }}",
              value: 10,
              color: {
                background: nodeColor,
                border: nodeColor
              },
              font: { color: textColor },
              href: "{{ '/tags/' | append: slug | append: '/' | relative_url }}"
            });
          {% endunless %}
        {% endfor %}
      {% endif %}
    {% endfor %}

    // Generate edges from center to each tag, and between tags
    const edges = [];

    const tagIds = nodes.getIds().filter(id => id !== "center");

    // Connect all tags to center
    tagIds.forEach(id => {
      edges.push({
        from: 'center',
        to: id,
        dashes: true,
        color: { color: edgeColor },
        width: 1.5
      });
    });

    // Connect all tags to each other (full mesh)
    for (let i = 0; i < tagIds.length; i++) {
      for (let j = i + 1; j < tagIds.length; j++) {
        edges.push({
          from: tagIds[i],
          to: tagIds[j],
          dashes: true,
          color: { color: edgeColor },
          width: 1
        });
      }
    }

    const container = document.getElementById("network");

    const data = { nodes: nodes, edges: edges };

    const options = {
      nodes: {
        shape: "dot",
        scaling: {
          min: 5,
          max: 20
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
          springLength: 160,
          springConstant: 0.04
        },
        stabilization: true
      },
      edges: {
        smooth: true
      },
      interaction: {
        hover: true,
        dragNodes: true,
        zoomView: true,
        tooltipDelay: 100
      }
    };

    const network = new vis.Network(container, data, options);

    // Make nodes clickable to their tag pages
    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const clickedId = params.nodes[0];
        const node = nodes.get(clickedId);
        if (node.href) {
          window.location.href = node.href;
        }
      }
    });
  });
</script>
