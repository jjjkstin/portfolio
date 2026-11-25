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
      <div class="timeline-content timeline-card" role="link" tabindex="0" data-href="{{ project.url | relative_url }}">
        <h3 class="timeline-title">{{ project.title }}</h3>
        <p class="timeline-desc">{{ project.description }}</p>
        <div class="timeline-footer">
          <span class="timeline-tag">{{ project.category }}</span>
          <span class="timeline-more" aria-hidden="true">Read more →</span>
        </div>
      </div>
    </li>
  {% endfor %}
</ol>

<script>
  // Cards navigate via JS (not <a href>) so the browser doesn't show a URL preview on hover.
  document.querySelectorAll(".timeline-card[data-href]").forEach(function (card) {
    function go(e) {
      var url = card.dataset.href;
      if (e.metaKey || e.ctrlKey || e.button === 1) window.open(url, "_blank", "noopener");
      else window.location.href = url;
    }
    card.addEventListener("click", go);
    card.addEventListener("auxclick", function (e) {
      if (e.button === 1) go(e);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter") go(e);
    });
  });
</script>
