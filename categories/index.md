---
layout: default
title: All Categories
permalink: /categories/
---

# 📂 All Categories

<ul>
  {% assign all_categories = "" | split: "" %}
  {% for note in site.notes %}
    {% if note.published != false %}
      {% for cat in note.categories %}
        {% unless all_categories contains cat %}
          {% assign all_categories = all_categories | push: cat %}
        {% endunless %}
      {% endfor %}
    {% endif %}
  {% endfor %}

  {% assign sorted_categories = all_categories | sort %}

  {% for category in sorted_categories %}
    {% assign categorized_notes = site.notes | where_exp: "note", "note.published != false and note.categories contains category" %}
    <li>
      <a href="{{ '/categories/' | append: category | append: '/' | relative_url }}">{{ category }}</a>
      ({{ categorized_notes | size }} item{% if categorized_notes | size != 1 %}s{% endif %})
    </li>
  {% endfor %}
</ul>
