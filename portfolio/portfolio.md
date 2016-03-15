---
layout: page
title: Portfolio
permalink: /portfolio/
tags: root
---

<div>
{% for my_page in site.pages %}
    {% if my_page.tags == 'portfolio' %}
        {% capture intro_url %}intros/{{ my_page.id }}-intro.html{% endcapture %}
        {% include {{ intro_url }} %}
        <p>{{ my_page.excerpt }}</p>
        <a class="page-link" href="{{ my_page.url | prepend: site.baseurl }}">{{ my_page.title }}</a>
    {% endif %}
{% endfor %}
</div>