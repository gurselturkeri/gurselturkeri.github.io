---
permalink: /
title: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---



<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terminal Text Animation</title>
    <style>
        .terminal-container {
            font-family: monospace; /* Gives a terminal-like appearance */
            white-space: nowrap; /* Prevents text from wrapping */
            overflow: hidden; /* Hides the overflowing text */
            border-right: 2px solid #00ff00; /* Cursor effect */
            width: 24ch; /* Adjust width as needed */
            animation: blink-caret 0.75s step-end infinite;
        }

        @keyframes blink-caret {
            from, to {
                border-color: transparent;
            }
            50% {
                border-color: #00ff00;
            }
        }
    </style>
</head>
<body>
    <div class="terminal-container">
        <div class="terminal-text" id="terminalText"></div>
    </div>

    <script>
        const texts = ["ROS", "Gazebo"];
        let index = 0;
        let textIndex = 0;
        let isDeleting = false;
        const speed = 150; // Speed of typing/deleting

        function type() {
            const terminalText = document.getElementById('terminalText');
            const currentText = texts[index];

            if (isDeleting) {
                terminalText.textContent = currentText.slice(0, textIndex--);
            } else {
                terminalText.textContent = currentText.slice(0, textIndex++);
            }

            if (!isDeleting && textIndex === currentText.length) {
                setTimeout(() => { isDeleting = true; }, 2000);
            } else if (isDeleting && textIndex === 0) {
                isDeleting = false;
                index = (index + 1) % texts.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, speed);
            }
        }

        type();
    </script>
</body>



<link rel="stylesheet" type="text/css" href="assets/css/collapse.css">

<div class="profile-container">
  <!-- Your profile content here -->
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


