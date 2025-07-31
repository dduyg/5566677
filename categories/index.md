---
layout: default
title: All Categories
permalink: /categories/
---

<h1>📂 All Categories</h1>

{% assign category_map = "" %}

<ul>
  {% for note in site.notes %}
    {% if note.published != false %}
      {% for cat in note.categories %}
        {% assign category_key = cat | append: ',' %}
        {% unless category_map contains category_key %}
          {% assign category_map = category_map | append: category_key %}

          {% assign categorized_notes = site.notes | where_exp: "n", "n.published != false and n.categories contains cat" %}
          <li>
            <a href="{{ '/categories/' | append: cat | append: '/' | relative_url }}">{{ cat }}</a>
            ({{ categorized_notes | size }} item{% if categorized_notes | size != 1 %}s{% endif %})
          </li>
        {% endunless %}
      {% endfor %}
    {% endif %}
  {% endfor %}
</ul>
