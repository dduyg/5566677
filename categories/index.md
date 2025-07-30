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
    <li>
      <a href="{{ '/categories/' | append: category | append: '/' | relative_url }}">{{ category }}</a>
    </li>
  {% endfor %}
</ul>
