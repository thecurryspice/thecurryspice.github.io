---
layout: page
title: tutorials
permalink: /tutorials/
description: Materials for courses you taught. Replace this text with your description.
nav: true
nav_order: 6
---

<!-- pages/tutorials.md -->
<div class="tutorials">
{% if site.enable_tutorial_categories and page.display_categories %}
  <!-- Display categorized tutorials -->
  {% for category in page.display_categories %}
  <a id="{{ category }}" href=".#{{ category }}">
    <h2 class="category">{{ category }}</h2>
  </a>
  {% assign categorized_tutorials = site.tutorials | where: "category", category %}
  {% assign sorted_tutorials = categorized_tutorials | sort: "time" %}
  <!-- Generate cards for each tutorial -->
  {% if page.horizontal %}
  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for tutorial in sorted_tutorials %}
      {% include tutorials_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for tutorial in sorted_tutorials %}
      {% include tutorials.liquid %}
    {% endfor %}
  </div>
  {% endif %}
  {% endfor %}

{% else %}

<!-- Display tutorials without categories -->

{% assign sorted_tutorials = site.tutorials | sort: "importance" %}

  <!-- Generate cards for each tutorial -->

{% if page.horizontal %}

  <div class="container">
    <div class="row row-cols-1 row-cols-md-2">
    {% for tutorial in sorted_tutorials %}
      {% include tutorials_horizontal.liquid %}
    {% endfor %}
    </div>
  </div>
  {% else %}
  <div class="row row-cols-1 row-cols-md-3">
    {% for tutorial in sorted_tutorials %}
      {% include tutorials.liquid %}
    {% endfor %}
  </div>
  {% endif %}
{% endif %}
</div>
