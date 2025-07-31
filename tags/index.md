---
layout: default
title: Tags Network
permalink: /tags/
---

# All Tags

<div id="network" style="width: 100%; height: 600px; border: 1px solid #ccc;"></div>

<script src="https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.js"></script>
<link href="https://unpkg.com/vis-network@9.1.2/dist/vis-network.min.css" rel="stylesheet" />

<script>
const nodes = [];
const edges = [];
const tagCounts = {};
const tagPairs = {};

// 1. Collect all tags and their co-occurrence
{% assign all_tags = "" | split: "" %}
{% assign notes = site.notes | where_exp: "n", "n.published != false" %}
{% for note in notes %}
  {% assign tags = note.tags %}
  {% for tag in tags %}
    {% unless all_tags contains tag %}
      {% assign all_tags = all_tags | push: tag %}
    {% endunless %}
    tagCounts["{{ tag | slugify }}"] = (tagCounts["{{ tag | slugify }}"] || 0) + 1;
  {% endfor %}

  // Register co-occurrence pairs
  {% for tag1 in tags %}
    {% for tag2 in tags %}
      {% if tag1 != tag2 %}
        const key = ["{{ tag1 | slugify }}", "{{ tag2 | slugify }}"].sort().join("::");
        tagPairs[key] = (tagPairs[key] || 0) + 1;
      {% endif %}
    {% endfor %}
  {% endfor %}
{% endfor %}

// 2. Add tag nodes
{% for tag in all_tags %}
  nodes.push({
    id: "{{ tag | slugify }}",
    label: "{{ tag }}",
    value: Math.min(tagCounts["{{ tag | slugify }}"], 10),
    group: "tag"
  });
{% endfor %}

// 3. Add edges between co-used tags
for (const key in tagPairs) {
  const [tagA, tagB] = key.split("::");
  const weight = Math.min(tagPairs[key], 3);
  edges.push({
    from: tagA,
    to: tagB,
    width: weight
  });
}

const data = {
  nodes: new vis.DataSet(nodes),
  edges: new vis.DataSet(edges)
};

const options = {
  nodes: {
    shape: "dot",
    scaling: { min: 1, max: 10 },
    font: { size: 14 }
  },
  edges: {
    color: "#ccc",
    smooth: true
  },
  groups: {
    tag: {
      color: { background: "#27ae60", border: "#1e8449" }
    }
  },
  physics: {
    barnesHut: {
      gravitationalConstant: -2000,
      springLength: 100,
      springConstant: 0.04
    },
    stabilization: { iterations: 250 }
  }
};

const network = new vis.Network(document.getElementById("network"), data, options);
</script>
