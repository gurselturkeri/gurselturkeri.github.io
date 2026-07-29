/* Animated background: robot path planning (RRT) for the robotic theme.
   Draws a growing rapidly-exploring random tree that navigates around
   obstacles from start to goal, highlights the solved path, then sends a
   robot marker along it before regenerating. Subtle, behind all content. */
(function () {
  "use strict";

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var canvas = document.createElement("canvas");
  canvas.id = "planner-bg";
  var s = canvas.style;
  s.position = "fixed";
  s.inset = "0";
  s.width = "100%";
  s.height = "100%";
  s.zIndex = "-1";
  s.pointerEvents = "none";
  s.opacity = "0.8";
  document.body.appendChild(canvas);

  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);

  var CYAN = "34,211,238";
  var GREEN = "0,255,156";
  var STEEL = "120,140,160";

  var nodes, obstacles, goal, start, solvedPath, state, robotT, holdUntil;
  var RL, RR, RT, RB; // planning region bounds (upper-middle band)
  var MAX_NODES = 620, STEP = 26, GOAL_R = 30, EXT_PER_FRAME = 3;

  function rand(a, b) { return a + Math.random() * (b - a); }
  function dist2(a, b) { var dx = a.x - b.x, dy = a.y - b.y; return dx * dx + dy * dy; }

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    reset();
    if (reduce) staticFrame();
  }

  function pointInObstacles(p) {
    for (var i = 0; i < obstacles.length; i++) {
      var o = obstacles[i];
      if (p.x >= o.x - 6 && p.x <= o.x + o.w + 6 &&
          p.y >= o.y - 6 && p.y <= o.y + o.h + 6) return true;
    }
    return false;
  }

  function segHitsObstacles(a, b) {
    var steps = Math.ceil(Math.sqrt(dist2(a, b)) / 8);
    for (var i = 1; i <= steps; i++) {
      var t = i / steps;
      if (pointInObstacles({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })) return true;
    }
    return false;
  }

  function reset() {
    // Keep the scene in the upper part of the viewport, spanning nearly
    // the full width so it also shows in the margins beside the content.
    RL = W * 0.03; RR = W * 0.97;
    RT = H * 0.05; RB = H * 0.50;
    var bandH = RB - RT;

    obstacles = [];
    var count = W < 640 ? 3 : 5;
    for (var i = 0; i < count; i++) {
      var w = rand(70, 180), h = rand(46, Math.min(140, bandH * 0.45));
      obstacles.push({
        x: rand(RL + 30, RR - w - 30),
        y: rand(RT + bandH * 0.12, RB - h - 4),
        w: w, h: h
      });
    }
    start = { x: rand(RL, RL + W * 0.05), y: rand(RB - bandH * 0.18, RB), parent: -1 };
    goal = { x: rand(RR - W * 0.05, RR), y: rand(RT, RT + bandH * 0.22) };
    if (pointInObstacles(start)) start.y = RB;
    nodes = [start];
    solvedPath = null;
    robotT = 0;
    state = "growing";
  }

  function nearest(p) {
    var bi = 0, bd = Infinity;
    for (var i = 0; i < nodes.length; i++) {
      var d = dist2(nodes[i], p);
      if (d < bd) { bd = d; bi = i; }
    }
    return bi;
  }

  function extend() {
    var sample = Math.random() < 0.08 ? goal : { x: rand(RL, RR), y: rand(RT, RB) };
    var ni = nearest(sample);
    var n = nodes[ni];
    var ang = Math.atan2(sample.y - n.y, sample.x - n.x);
    var np = { x: n.x + Math.cos(ang) * STEP, y: n.y + Math.sin(ang) * STEP, parent: ni };
    if (np.x < RL - STEP || np.x > RR + STEP || np.y < RT - STEP || np.y > RB + STEP) return;
    if (pointInObstacles(np) || segHitsObstacles(n, np)) return;
    nodes.push(np);
    if (dist2(np, goal) < GOAL_R * GOAL_R) buildPath(nodes.length - 1);
  }

  function buildPath(idx) {
    var path = [];
    while (idx !== -1) { path.push(nodes[idx]); idx = nodes[idx].parent; }
    solvedPath = path.reverse();
    state = "travel";
  }

  function drawObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
      var o = obstacles[i];
      ctx.fillStyle = "rgba(" + STEEL + ",0.05)";
      ctx.strokeStyle = "rgba(" + STEEL + ",0.22)";
      ctx.lineWidth = 1;
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeRect(o.x, o.y, o.w, o.h);
      // corner ticks
      ctx.strokeStyle = "rgba(" + CYAN + ",0.28)";
      var t = 8;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y + t); ctx.lineTo(o.x, o.y); ctx.lineTo(o.x + t, o.y);
      ctx.moveTo(o.x + o.w - t, o.y + o.h); ctx.lineTo(o.x + o.w, o.y + o.h); ctx.lineTo(o.x + o.w, o.y + o.h - t);
      ctx.stroke();
    }
  }

  function drawTree() {
    ctx.strokeStyle = "rgba(" + CYAN + ",0.28)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var i = 1; i < nodes.length; i++) {
      var n = nodes[i], p = nodes[n.parent];
      ctx.moveTo(p.x, p.y); ctx.lineTo(n.x, n.y);
    }
    ctx.stroke();
    // frontier dots (last few nodes)
    ctx.fillStyle = "rgba(" + CYAN + ",0.7)";
    for (var j = Math.max(1, nodes.length - 6); j < nodes.length; j++) {
      ctx.beginPath(); ctx.arc(nodes[j].x, nodes[j].y, 1.6, 0, 6.2832); ctx.fill();
    }
  }

  function drawMarkers() {
    // start
    ctx.strokeStyle = "rgba(" + GREEN + ",0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(start.x, start.y, 6, 0, 6.2832); ctx.stroke();
    // goal (crosshair)
    ctx.strokeStyle = "rgba(" + CYAN + ",0.8)";
    ctx.beginPath();
    ctx.arc(goal.x, goal.y, 9, 0, 6.2832);
    ctx.moveTo(goal.x - 13, goal.y); ctx.lineTo(goal.x + 13, goal.y);
    ctx.moveTo(goal.x, goal.y - 13); ctx.lineTo(goal.x, goal.y + 13);
    ctx.stroke();
  }

  function drawPath(progress) {
    if (!solvedPath) return;
    var n = solvedPath.length;
    ctx.strokeStyle = "rgba(" + GREEN + ",0.85)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(" + GREEN + ",0.6)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(solvedPath[0].x, solvedPath[0].y);
    var upto = progress == null ? n - 1 : Math.min(n - 1, Math.floor(progress * (n - 1)));
    for (var i = 1; i <= upto; i++) ctx.lineTo(solvedPath[i].x, solvedPath[i].y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    if (progress != null) {
      var seg = progress * (n - 1);
      var i0 = Math.min(n - 2, Math.floor(seg)), f = seg - i0;
      var a = solvedPath[i0], b = solvedPath[i0 + 1] || a;
      var rx = a.x + (b.x - a.x) * f, ry = a.y + (b.y - a.y) * f;
      ctx.fillStyle = "rgba(" + GREEN + ",1)";
      ctx.shadowColor = "rgba(" + GREEN + ",0.9)";
      ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(rx, ry, 4, 0, 6.2832); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    drawObstacles();

    if (state === "growing") {
      for (var i = 0; i < EXT_PER_FRAME && state === "growing"; i++) {
        extend();
        if (nodes.length >= MAX_NODES) { reset(); break; }
      }
      drawTree();
    } else if (state === "travel") {
      drawTree();
      robotT += 0.006;
      drawPath(Math.min(1, robotT));
      if (robotT >= 1) { state = "hold"; holdUntil = performance.now() + 2200; }
    } else if (state === "hold") {
      drawTree();
      drawPath(null);
      // moving pulse along solved path
      var p = ((performance.now() / 1600) % 1);
      drawPath(p);
      if (performance.now() > holdUntil) reset();
    }

    drawMarkers();
    requestAnimationFrame(frame);
  }

  function staticFrame() {
    // Grow to completion instantly, draw one solved frame, no loop.
    var guard = 0;
    while (state === "growing" && guard++ < 4000) {
      extend();
      if (nodes.length >= MAX_NODES) break;
    }
    ctx.clearRect(0, 0, W, H);
    drawObstacles();
    drawTree();
    drawPath(null);
    drawMarkers();
  }

  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt); rt = setTimeout(resize, 200);
  });

  resize();
  if (!reduce) requestAnimationFrame(frame);
})();
