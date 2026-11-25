---
layout: about
title: about
permalink: /
subtitle: >-
  <a href='https://www.princeton.edu/'>Princeton</a> '30 ·
  <span class="tagline" aria-hidden="true">Public &amp; International Affairs</span><span class="tagline-cursor" aria-hidden="true"></span>
  <span class="sr-only">Public and International Affairs, Statistics and Machine Learning, AI governance and policy, researcher, and founder of Koread</span>

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

Outside the classroom, I founded and led **Koread**, a Korean-American news platform with 18 team members across three continents. At Princeton, I'm on the Whitman College Council, copy edit for the _Nassau Weekly_, and take part in the James Madison Program UFF, Christian Union Nova, and WaWa United Soccer.

I speak English and Korean (bilingual) and Spanish (advanced).

<script>
  // Rotating typewriter tagline under the name (see .tagline in _sass/_custom.scss)
  (function () {
    var el = document.querySelector(".tagline");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var phrases = [
      "Public & International Affairs",
      "Statistics & Machine Learning",
      "AI governance & policy",
      "Social science researcher",
      "Founder of Koread",
    ];
    var i = 0, n = phrases[0].length, deleting = true;
    function tick() {
      var text = phrases[i];
      n += deleting ? -1 : 1;
      el.textContent = text.slice(0, n);
      var delay = deleting ? 35 : 70;
      if (!deleting && n === text.length) { deleting = true; delay = 2200; }
      else if (deleting && n === 0) { deleting = false; i = (i + 1) % phrases.length; text = phrases[i]; delay = 350; }
      setTimeout(tick, delay);
    }
    setTimeout(tick, 2500);
  })();
</script>
