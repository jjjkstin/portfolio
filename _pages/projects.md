---
layout: page
title: projects
permalink: /projects/
description: Ventures, research, and other work I have led or contributed to.
nav: true
nav_order: 2
---

<!-- pages/projects.md: vertical timeline, newest first (styles in _sass/_custom.scss) -->

{% assign items = site.projects | sort: "start" | reverse %}

<ol class="timeline">
  {% for project in items %}
    <li class="timeline-item">
      <div class="timeline-date">{{ project.when }}</div>
      <div class="timeline-content">
        <h3 class="timeline-title">
          <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
        </h3>
        <p class="timeline-desc">{{ project.description }}</p>
        <span class="timeline-tag">{{ project.category }}</span>
      </div>
    </li>
  {% endfor %}
</ol>
