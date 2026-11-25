---
layout: about
title: about
permalink: /
subtitle: Public and International Affairs + Machine Learning @ <a href='https://www.princeton.edu/'>Princeton University</a>

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>Princeton University</p>
    <p>Class of 2030</p>
    <p>Princeton, NJ</p>

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page

announcements:
  enabled: false # includes a list of news items
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

latest_posts:
  enabled: false
  scrollable: true # adds a vertical scroll bar if there are more than 3 new posts items
  limit: 3 # leave blank to include all the blog posts
---

Hi, I'm JaeHa (Justin) Kim, a member of Princeton University's Class of 2030 and an intended A.B. candidate in **Public and International Affairs**, with prospective minors in **Statistics & Machine Learning** and **Finance**.

I'm interested in how data and policy intersect, especially around immigrant communities, identity, and mental health. As a research intern at the CHAMP Lab at Teachers College, Columbia University, and the SLAAY Lab at Montclair State University, I studied the experiences of Asian American and Latino youth and families, using R for quantitative analysis. That work led to a coauthored peer-reviewed paper on racial discrimination, resilience, and mental health among Asian American youth, and to my own case study of a DACA recipient's journey in the United States.

Looking ahead, I'm especially interested in **AI governance and AI policymaking**. I'm currently writing an independent paper on AI-generated animation and what it means for art, including the emotional value of AI-generated artworks in the future.

Outside the classroom, I founded and led **Koread**, a Korean-American news platform with 18 team members across three continents. At Princeton, I'm on the Whitman College Council, copy edit for the _Nassau Weekly_, and take part in the James Madison Program UFF, Christian Union Nova, and WaWa United Soccer. I've also mentored students in SAT and college prep, as well as in violin and music production.

I speak English and Korean (bilingual) and Spanish (advanced).

Outside of academics, you'll find me playing soccer and volleyball, DJing, or heading off on spontaneous side quests.

<div class="impact-stats">
  <div class="stat"><span class="stat-num" data-target="40000" data-suffix="+">40,000+</span><span class="stat-label">Koread views</span></div>
  <div class="stat"><span class="stat-num" data-target="30" data-suffix="+">30+</span><span class="stat-label">students mentored</span></div>
  <div class="stat"><span class="stat-num" data-target="2">2</span><span class="stat-label">publications</span></div>
  <div class="stat"><span class="stat-num" data-target="9999" data-final="∞">∞</span><span class="stat-label">things left to learn</span></div>
</div>

<script>
  // Count the impact stats up once when they scroll into view (styles in _sass/_custom.scss)
  (function () {
    var row = document.querySelector(".impact-stats");
    if (!row || !("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var nums = row.querySelectorAll(".stat-num");
    function render(el, v) {
      el.textContent = Math.round(v).toLocaleString("en-US") + (el.dataset.suffix || "");
    }
    nums.forEach(function (el) {
      el.setAttribute("aria-label", el.textContent);
      if (el.dataset.final) el.classList.add("is-counting");
      render(el, 0);
    });
    var io = new IntersectionObserver(
      function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        var start = null;
        function frame(t) {
          if (start === null) start = t;
          var p = Math.min((t - start) / 1200, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          nums.forEach(function (el) {
            // data-final swaps in a non-numeric ending (the ∞ joke) once counting finishes
            if (p === 1 && el.dataset.final) {
              el.textContent = el.dataset.final;
              el.classList.remove("is-counting");
            }
            else render(el, eased * Number(el.dataset.target));
          });
          if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      },
      { threshold: 0.4 }
    );
    io.observe(row);
  })();
</script>
