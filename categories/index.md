---
layout: default
title: Categories
permalink: /categories/
---


# 📂 All Categories

<ul>
  {% assign all_categories = site.notes | map: "categories" | join: "," | split: "," | uniq | sort %}
  {% for cat in all_categories %}
    <li>
      <a href="{{ '/categories/' | append: cat | append: '/' | relative_url }}">{{ cat }}</a>
    </li>
  {% endfor %}
</ul>
