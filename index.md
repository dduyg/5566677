---
layout: default
title: Home
permalink: /
---

# 🌱 Welcome to My Digital Garden

## 🆕 Recent Notes

<ul>
  {% assign notes = site.notes | where_exp: "n", "n.published != false and n.last_modified_at" | sort: "last_modified_at" | reverse %}
  {% for note in notes limit:5 %}
    <li>
      <a href="{{ note.url | relative_url }}">{{ note.title }}</a>
      <small style="color: #888;">({{ note.last_modified_at | date: "%b %d, %Y" }})</small>
    </li>
  {% endfor %}
</ul>
