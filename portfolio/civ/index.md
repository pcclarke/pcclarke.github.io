---
layout: page
id: civ
title: Civilization 4 Technology Wheel
excerpt: A redesign of the technology trees in Sid Meier's Civilization for accuracy and clarity.
permalink: /portfolio/civ/
tags: portfolio
---

<div class="piece">
    <div id="civFeature" class="feature">
        <img src="{{ site.baseurl }}/portfolio/civ/civ_poster_final.jpg" />
    </div>

    <div class="block">
        <div class="overview">
            <h3>Overview</h3>
            <p>A personal project to redesign a complex tree diagram with many overlapping lines and confusing symbols. Designed a circular graph to separate out relationships into arcs and spokes.</p>
            <h4>Role</h4>
            <ul>
                <li>Visual design</li>
                <li>Development</li>
            </ul>
            <h4>Technologies Used</h4>
            <ul>
                <li>Adobe Illustrator</li>
                <li>Java (Processing)</li>
                <li>JavaScript (D3.js)</li>
            </ul>
            <p class="link"><a href="http://pcclarke.github.io/civ-techs/">View the Interactive Data Visualization</a></p>
        </div>
    </div>

    <div class="block">
        <div class="left">
            <p>This started off innocuously, as a Christmas present for my father. He's a long-time fan of Civilization 4, and I thought it would be nice for him to have a copy on his wall, made more legible and more clearly labeled than the the one that came in the box.</p>
        </div>
        <div class="clear"></div>
    </div>

    <div class="block">
        <div class="left">
            <img src="civ_original.jpg" class="lesser" />
        </div>
        <div class="right">
            <p>The original technology tree appears to be a linear path from left to right. However, the arrows have different meanings. One arrow is a mandatory path, two are different options. Some paths aren't even shown as lines, instead they are indicated by icons in the upper right of each box.</p> 
        </div>
        <div class="clear"></div>
    </div>

    <div class="block">
        <div class="left">
            <p>However, once I started trying to understand the workings of the technology tree, I realized this was actually one of the most complex tree structures I had ever encountered. It’s a non-linear tree with many overlapping paths, more like a maze than a tree. The original designer’s approach was to hide this, making the chart look much simpler than it actually was. My first attempt at a design was to reveal the hidden paths and organize them.</p>
        </div>
        <div class="clear"></div>
    </div>

    <div class="block">
        <div class="left">
            <img src="civ_poster_draft1.jpg" class="lesser" />
        </div>
        <div class="right">
            <p>A first try at redesigning the tree, showing all of the paths that were hidden and identifying optional paths by colour. A major improvement in consistency, but much more of a maze.</p> 
        </div>
        <div class="clear"></div>
    </div>

    <div class="block">
        <div class="left">
            <p>The biggest issue I identified with this first draft was that the paths were often extremely long, which made it very likely that they would overlap. I tried shifting the positions of the technologies around, with little luck doing better. Some brief experiments with algorithms to optimize the nodes suggested there wasn’t much to gain. So instead, I tried wrapping the nodes around in a circle.</p>
        </div>
        <div class="clear"></div>
    </div>

    <div class="block">
        <div class="left">
            <img src="civ_poster_draft2.jpg" class="lesser" />
        </div>
        <div class="right">
            <p>I’ve gone from a maze to a hairball. Not much progress, it seemed.</p> 
        </div>
        <div class="clear"></div>
    </div>

    <div class="block">
        <div class="left">
            <p>Finally, it hit on me to try merging the circle and tree concepts into one: this allowed for me to create a visually clear arrangement for the paths with a minimum amount of space. It also made for a good visual metaphor, showing the progress of technology in game as spokes in a wheel.</p>
        </div>
        <div class="clear"></div>
    </div>

    <div class="block">
        <div class="left">
            <img src="civ_interactive_icons.jpg" class="lesser" />
        </div>
        <div class="right">
            <p>The current interactive version of the technology wheel.</p> 
        </div>
        <div class="clear"></div>
    </div>
</div>