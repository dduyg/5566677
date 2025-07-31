---
layout: default
title: All Categories
permalink: /categories/
---

<h1>📂 All Categories</h1>

<ul>
  {% for note in site.notes %}
    {% if note.published != false and note.categories %}
      {% for category in note.categories %}
        <li><a href="{{ '/categories/' | append: category | append: '/' | relative_url }}">{{ category }}</a></li>
      {% endfor %}
    {% endif %}
  {% endfor %}
</ul>
