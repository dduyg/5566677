---
layout: default
title: Tags
permalink: /tags/
---

# 🏷 All Tags

<ul>
  {% assign all_tags = site.notes | map: "tags" | join: "," | split: "," | uniq | sort %}
  {% for tag in all_tags %}
    <li>
      <a href="{{ '/tags/' | append: tag | append: '/' | relative_url }}">{{ tag }}</a>
    </li>
  {% endfor %}
</ul>
