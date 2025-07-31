---
layout: default
title: Home
permalink: /
---

<h1 style="color: var(--accent);">marbleNodes</h1>

### Recent Notes
<ul>
  {% assign recent_notes = site.notes | sort: "last_modified_at" | reverse %}
  {% for note in recent_notes limit: 5 %}
    {% if note.published != false %}
      <li>
        <a href="{{ note.url | relative_url }}">{{ note.title }} —
        <small>{{ note.last_modified_at | date: "%B %d, %Y" }}</small>
        </a>
      </li>
    {% endif %}
  {% endfor %}
</ul>
