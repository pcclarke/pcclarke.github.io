---
layout: page
title: Portfolio
permalink: /portfolio/
tags: root
---

<div class="trigger">
{% for my_page in site.pages %}
    {% if my_page.tags == 'portfolio' %}
    <a class="page-link" href="{{ my_page.url | prepend: site.baseurl }}">{{ my_page.title }}</a>
    {% endif %}
{% endfor %}
</div>