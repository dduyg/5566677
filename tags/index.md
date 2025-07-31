---
layout: default
title: All Tags
permalink: /tags/
---

<h1>🏷 All Tags</h1>

<ul>
  {% for note in site.notes %}
    {% if note.published != false and note.tags %}
      {% for tag in note.tags %}
        <li><a href="{{ '/tags/' | append: tag | append: '/' | relative_url }}">{{ tag }}</a></li>
      {% endfor %}
    {% endif %}
  {% endfor %}
</ul>
