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
    const highlightColor = vars.getPropertyValue('--lightgray').trim();

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

    tags.forEach(tag => {
      const slug = "{{ '/tags/' | append: tag | slugify | append: '/' | relative_url }}";
      const count = tagCounts[tag];
      let size = Math.round((count * 1.4) + 4);
      if (size > 14) size = 14;
      if (size < 6) size = 6;

      nodes.add({
        id: tag,
        label: tag,
        value: size,
        shape: "dot",
        font: {
          face: "IBM Plex Mono",
          color: borderColor,
          size: 11,  // font-size
          vadjust: -4,    // move *closer* to dot
          bold: true       
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
            opacity: 0.7
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
        zoomView: true,
        dragView: true
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
          min: 6,
          max: 14
        }
      },
      edges: {
        smooth: false
      }
    };

    const network = new vis.Network(container, data, options);

    // Node click → go to tag page
    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodes.get(nodeId);
        if (node.href) {
          // Optional small delay
          setTimeout(() => {
            window.location.href = node.href;
          }, 150);
        }
      }
    });
  });
</script>
