---
layout: default
title: All Tags
permalink: /tags/
---

# 🏷 All Tags

<ul>
  {% assign all_tags = "" | split: "" %}
  {% for note in site.notes %}
    {% if note.published != false %}
      {% for tag in note.tags %}
        {% unless all_tags contains tag %}
          {% assign all_tags = all_tags | push: tag %}
        {% endunless %}
      {% endfor %}
    {% endif %}
  {% endfor %}

  {% assign sorted_tags = all_tags | sort %}

  {% for tag in sorted_tags %}
    <li>
      <a href="{{ '/tags/' | append: tag | append: '/' | relative_url }}">{{ tag }}</a>
    </li>
  {% endfor %}
</ul>
