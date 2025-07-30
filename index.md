---
layout: default
title: Home
permalink: /
---

# 🌱 Welcome to My Digital Garden

## 🆕 Recent Notes

<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at" | reverse %}
  {% for note in recent_notes limit: 5 %}
    {% if note.published != false %}
      <li>
        <a href="{{ note.url | relative_url }}">{{ note.title }}</a>
        <small>— Last modified: {{ note.last_modified_at }}</small>
      </li>
    {% endif %}
  {% endfor %}
</ul>
