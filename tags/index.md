---
layout: default
title: Tag Graph
permalink: /tags/
---

<h1>All Tags</h1>
<div id="network" style="width: 100%; height: 600px; border: 1px solid var(--gray); border-radius: 12px; margin-top: 1rem;"></div>

<link href="https://unpkg.com/vis-network/styles/vis-network.css" rel="stylesheet" />
<script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const root = document.documentElement;
    const vars = getComputedStyle(root);

    const nodeColor = vars.getPropertyValue('--gray').trim();
    const edgeColor = vars.getPropertyValue('--link').trim();
    const textColor = vars.getPropertyValue('--text').trim();
    const centerColor = vars.getPropertyValue('--secondary').trim();
    const highlightColor = vars.getPropertyValue('--highlight').trim();

    const nodes = new vis.DataSet([
      {
        id: 'center',
        label: '',
        value: 30,
        color: {
          background: centerColor,
          border: centerColor
        },
        font: { color: textColor },
        physics: false,
        fixed: true
      }
    ]);

    const tagIds = [];

    {% assign tag_names = "" | split: "" %}
    {% for note in site.notes %}
      {% if note.published != false and note.tags %}
        {% for tag in note.tags %}
          {% assign slug = tag | slugify %}
          {% unless tag_names contains slug %}
            {% assign tag_names = tag_names | push: slug %}
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
            tagIds.push("{{ slug }}");
          {% endunless %}
        {% endfor %}
      {% endif %}
    {% endfor %}

    const edges = [];

    // connect each tag to the center
    tagIds.forEach(id => {
      edges.push({
        from: 'center',
        to: id,
        dashes: true,
        color: { color: edgeColor },
        width: 1.2,
        smooth: false
      });
    });

    // connect tags to each other
    for (let i = 0; i < tagIds.length; i++) {
      for (let j = i + 1; j < tagIds.length; j++) {
        edges.push({
          from: tagIds[i],
          to: tagIds[j],
          dashes: true,
          color: { color: edgeColor },
          width: 0.8,
          smooth: false
        });
      }
    }

    const container = document.getElementById("network");

    const data = {
      nodes: nodes,
      edges: edges
    };

    const options = {
      layout: { improvedLayout: true },
      physics: {
        barnesHut: {
          gravitationalConstant: -10000,
          springLength: 180,
          springConstant: 0.04
        },
        stabilization: true
      },
      interaction: {
        hover: true,
        dragNodes: true,
        zoomView: true
      },
      edges: {
        smooth: false
      },
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
      }
    };

    const network = new vis.Network(container, data, options);

    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        const id = params.nodes[0];
        const node = nodes.get(id);
        if (node.href) {
          // highlight the clicked node
          nodes.update({
            id: id,
            color: {
              background: highlightColor,
              border: highlightColor
            }
          });
          // navigate after short delay so it’s visible
          setTimeout(() => {
            window.location.href = node.href;
          }, 150);
        }
      }
    });
  });
</script>
