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
    const highlightColor = vars.getPropertyValue('--lightgray').trim();

    // --- Precomputed tag data injected by Liquid
    const tagData = {
      {% assign all_tags = "" | split: "" %}
      {% for note in site.notes %}
        {% if note.published != false and note.tags %}
          {% for tag in note.tags %}
            {% assign all_tags = all_tags | push: tag %}
          {% endfor %}
        {% endif %}
      {% endfor %}
      {% assign unique_tags = all_tags | uniq | sort %}
      {% for tag in unique_tags %}
        "{{ tag }}": {
          count: {{ all_tags | where: "tag", tag | size }},
          slug: "{{ '/tags/' | append: tag | slugify | append: '/' | relative_url }}"
        }{% unless forloop.last %},{% endunless %}
      {% endfor %}
    };

    const nodes = new vis.DataSet();
    const edges = [];
    const tags = Object.keys(tagData);

    tags.forEach(tag => {
      const count = tagData[tag].count;
      const slug = tagData[tag].slug;
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

    // Fully connect all tags for now
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

    // Enable click to visit tag page
    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = nodes.get(nodeId);
        if (node.href) {
          setTimeout(() => {
            window.location.href = node.href;
          }, 100);
        }
      }
    });
  });
</script>

<style>
  #tag-graph canvas {
    font-weight: bold !important;
  }
</style>
