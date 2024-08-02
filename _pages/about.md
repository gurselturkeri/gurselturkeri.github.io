---
permalink: /
title: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---


<link rel="stylesheet" type="text/css" href="assets/css/collapse.css">


<div style="text-align: center;">
  <pre id="terminal-text" style="display: inline-block; font-family: 'Courier New', Courier, monospace; font-size: 1.5em;"></pre>
</div>




<p><i>I am a highly motivated Mechanical Engineering graduate from Gaziantep University, where I proudly ranked second in my class. With hands-on experience gained from a range of projects and internships, I am eager to apply my technical skills and problem-solving abilities in a stimulating and innovative environment.</i></p>


<div class="framed-container">
  <figure class="framed-item">
    <img src="images/av.gif" alt="av" class="framed">
    <figcaption>Robotaxi Competations - Kocaeli,Türkiye (2022)</figcaption>
  </figure>
  <figure class="framed-item">
    <img src="images/panda.JPG" alt="panda" class="framed">
    <figcaption>METU ROMER ChessMate Project - Ankara,Türkiye (2023)</figcaption>
  </figure>
</div>

<div class="framed-container">
  <figure class="framed-item">
    <img src="images/detection.jpg" alt="av" class="framed">
    <figcaption>Traffic Sign Detection using YOLOv4 Darknet and TensorRT Optimization - Gaziantep, Türkiye</figcaption>
  </figure>
  <figure class="framed-item">
    <img src="images/autoware_test.gif" alt="panda" class="framed">
    <figcaption>Autoware Testing after the Mapping Process </figcaption>
  </figure>
</div>





<div style="text-align: center;">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/zP3rmQ06xFE?si=Wtg2WROBjUeUV6k-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>



<script>
document.addEventListener("DOMContentLoaded", function() {
  const terminalText = document.getElementById("terminal-text");
  const commands = ["ROS", "Gazebo"];
  let commandIndex = 0;
  let charIndex = 0;
  let typing = true;

  function type() {
    if (typing) {
      if (charIndex < commands[commandIndex].length) {
        terminalText.textContent += commands[commandIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 150);
      } else {
        typing = false;
        setTimeout(type, 1500);
      }
    } else {
      if (charIndex > 0) {
        terminalText.textContent = terminalText.textContent.slice(0, -1);
        charIndex--;
        setTimeout(type, 100);
      } else {
        typing = true;
        commandIndex = (commandIndex + 1) % commands.length;
        setTimeout(type, 500);
      }
    }
  }

  type();
});
</script>
