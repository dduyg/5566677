---
layout: default
title: All Tags
permalink: /tags/
---

<h1>🏷 All Tags</h1>

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
    {% assign tagged_notes = site.notes | where_exp: "note", "note.published != false and note.tags contains tag" %}
    <li>
      <a href="{{ '/tags/' | append: tag | append: '/' | relative_url }}">{{ tag }}</a>
      ({{ tagged_notes | size }} item{% if tagged_notes | size != 1 %}s{% endif %})
    </li>
  {% endfor %}
</ul>
