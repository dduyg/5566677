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
    const centerColor = vars.getPropertyValue('--accent').trim();
    const highlightColor = vars.getPropertyValue('--highlight').trim();

    const tagCounts = {};
    {% for note in site.notes %}
      {% if note.published != false and note.tags %}
        {% for tag in note.tags %}
          {% assign slug = tag | slugify %}
          {% if tagCounts[slug] %}
            {% assign tagCounts[slug] = tagCounts[slug] | plus: 1 %}
          {% else %}
            {% assign tagCounts[slug] = 1 %}
          {% endif %}
        {% endfor %}
      {% endif %}
    {% endfor %}

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

    {% assign seen_tags = "" | split: "" %}
    {% for note in site.notes %}
      {% if note.published != false and note.tags %}
        {% for tag in note.tags %}
          {% assign slug = tag | slugify %}
          {% unless seen_tags contains slug %}
            {% assign seen_tags = seen_tags | push: slug %}
            {% assign tag_count = 0 %}
            {% for other_note in site.notes %}
              {% if other_note.published != false and other_note.tags contains tag %}
                {% assign tag_count = tag_count | plus: 1 %}
              {% endif %}
            {% endfor %}
            {% assign node_size = tag_count | times: 3 | plus: 10 %}
            {% if node_size > 29 %}
              {% assign node_size = 29 %}
            {% endif %}
            {% if node_size < 15 %}
              {% assign node_size = 15 %}
            {% endif %}
            nodes.add({
              id: "{{ slug }}",
              label: "{{ tag }}",
              value: {{ node_size }},
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
          min: 15,
          max: 30
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
          nodes.update({
            id: id,
            color: {
              background: highlightColor,
              border: highlightColor
            }
          });
          setTimeout(() => {
            window.location.href = node.href;
          }, 150);
        }
      }
    });
  });
</script>
