---
layout: default
title: All Categories
permalink: /categories/
---

<h1>📂 All Categories</h1>

{% assign categories = "" | split: "" %}
<ul>
  {% for note in site.notes %}
    {% if note.published != false %}
      {% for cat in note.categories %}
        {% unless categories contains cat %}
          {% assign categories = categories | concat: [cat] %}

          {% assign count = 0 %}
          {% for n in site.notes %}
            {% if n.published != false %}
              {% for c in n.categories %}
                {% if c == cat %}
                  {% assign count = count | plus: 1 %}
                {% endif %}
              {% endfor %}
            {% endif %}
          {% endfor %}

          <li>
            <a href="{{ '/categories/' | append: cat | append: '/' | relative_url }}">{{ cat }}</a>
            ({{ count }} item{% if count != 1 %}s{% endif %})
          </li>
        {% endunless %}
      {% endfor %}
    {% endif %}
  {% endfor %}
</ul>
