---
layout: post
title: Experiences With Jekyll
date: 2017-06-19
tags: jekyll
category: blogpost
---

In short, I'm struggling with Jekyll and need a black theme.

## A Little Introduction

[Jekyll](https://jekyllrb.com) is a static site generator based on Ruby.
Since the site is static, there's no requirement of a database and timely maintenance. It cannot be hacked, because it's basic HTML and CSS.
So when I found out that Jekyll is blog-aware, I was impressed. It was as if all the onerous workload of making a decent site was transferred to a really cool platform.
Thing is, not so much. It's been a day of struggling with applying custom CSS to Jekyll's default theme [Minima](https://github.com/jekyll/minima).


## The Problem

Approximately 43 hours ago, I made the first commit and was greeted with, well, a *minimalist* page.
Now, I prefer minimalism as much as I prefer extra cheese on pizza as much as I prefer black over white.
Although it wasn't just about choosing colours, but editing the entire theme eventually, nonetheless, choosing colours was made simple by [this awesome page](http://www.flatuicolorpicker.com/).

I happily wrote a short `<site-root>/assets/main.scss` file with new colours, which consumed all of the negligible knowledge I boast of in CSS.

Without any trials on localhost, I pushed the edit to master. Bam! I was greeted with another *minimalist* page. You'll agree it was minimalist because honestly this is all that showed up on inspecting the page in Chrome.

```html
<html>
<head></head>
<body></body>
</html>
```

Now that, was disappointing.


## Troubleshooting

I generated another instance of the static site, this time locally, using:
```
jekyll serve --watch
```
The *--watch* makes Jekyll listen to changes so I didn't have to regenerate the page-build. Jekyll did it itself. See, Jekyll is awesome, maybe I'm the only one encountering problems.
The result was the output *with* the custom CSS, but without the posts. It simply did not process any posts!
It seems that whenever a custom CSS is applied, Jekyll finds some inconsistency with the default stylesheet and consequently does not processes the *markdown* files in the *posts* directory.
Mentioning markdown, I feel it's short, great and everyone must be familiar with it.

Troubleshooting has honestly been *Troubleaiming* for the past day, and I desperately hope to find what the problem is.
If you are reading this post without the site having an option to switch the theme, know it for sure that I've still not found a fix for this.
Because I may not be Batman, but I definitely like Black.

___
