---
layout: default
title: All Categories
permalink: /categories/
---

<h1>📂 All Categories</h1>

<ul>
{% assign categories_list = "" | split: "" %}

{% for note in site.notes %}
  {% if note.published != false %}
    {% for category in note.categories %}
      {% unless categories_list contains category %}
        {% assign categories_list = categories_list | push: category %}
      {% endunless %}
    {% endfor %}
  {% endif %}
{% endfor %}

{% assign sorted_categories = categories_list | sort %}

{% for category in sorted_categories %}
  {% assign related_notes = site.notes | where_exp: "note", "note.published != false and note.categories contains category" %}
  <li>
    <a href="{{ '/categories/' | append: category | append: '/' | relative_url }}">{{ category }}</a>
    ({{ related_notes | size }} item{% if related_notes | size != 1 %}s{% endif %})
  </li>
{% endfor %}
</ul>
