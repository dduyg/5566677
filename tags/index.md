---
layout: default
title: Tag Graph
permalink: /tags/
---

<h1>All Tags</h1>
<div id="tag-graph" style="border:1px solid var(--tertiary); height: 600px;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const vars = getComputedStyle(root);

    const bgColor = vars.getPropertyValue('--secondary').trim();
    const borderColor = vars.getPropertyValue('--tertiary').trim();
    const edgeColor = vars.getPropertyValue('--darkgray').trim();
    const labelColor = edgeColor;
    const highlightColor = vars.getPropertyValue('--highlight').trim();

    // Collect tag counts
    const tagCounts = {};
    {% for note in site.notes %}
      {% if note.published != false and note.tags %}
        {% for tag in note.tags %}
          tagCounts["{{ tag }}"] = (tagCounts["{{ tag }}"] || 0) + 1;
        {% endfor %}
      {% endif %}
    {% endfor %}

    const tags = Object.keys(tagCounts);
    const nodes = new vis.DataSet();
    const edges = [];

    // Add nodes
    tags.forEach(tag => {
      const slug = `/tags/${tag.replace(/\s+/g, '-').toLowerCase()}/`;
      const count = tagCounts[tag];

      let size = Math.round((count * 1.4) + 4);
      if (size > 13) size = 13;
      if (size < 7) size = 7;

      nodes.add({
        id: tag,
        label: tag,
        value: size,
        shape: "dot",
        font: {
          face: "IBM Plex Mono",
          color: labelColor,
          size: 11,
          vadjust: -4
        },
        color: {
          background: bgColor,
          border: borderColor,
          highlight: {
            background: highlightColor,
            border: borderColor
          }
        },
        href: slug
      });
    });

    // Connect every tag to every other tag with dashed edges
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        edges.push({
          from: tags[i],
          to: tags[j],
          dashes: true,
          color: {
            color: edgeColor,
            highlight: edgeColor,
            hover: edgeColor,
            opacity: 0.6
          },
          width: 1
        });
      }
    }

    const container = document.getElementById("tag-graph");
    const data = { nodes, edges };

    const options = {
      interaction: {
        hover: true,
        dragNodes: true,
        dragView: true,
        zoomView: true
      },
      physics: {
        enabled: true,
        solver: "barnesHut",
        barnesHut: {
          gravitationalConstant: -5000,
          springLength: 120,
          springConstant: 0.04,
          damping: 0.09
        },
        stabilization: false
      },
      nodes: {
        borderWidth: 2,
        scaling: {
          min: 7,
          max: 13
        }
      },
      edges: {
        smooth: false
      }
    };

    const network = new vis.Network(container, data, options);

    // Navigate to tag page when a node is clicked
    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodes.get(nodeId);
        if (node.href) {
          setTimeout(() => {
            window.location.href = node.href;
          }, 150);
        }
      }
    });
  });
</script>
