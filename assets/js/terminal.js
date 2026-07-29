/* Terminal typing animation for the homepage hero.
   Safe no-op on pages without #terminal-text. */
(function () {
  var el = document.getElementById("terminal-text");
  if (!el) return;

  var lines = [
    "$ whoami",
    "  gursel_turkeri // autonomous driving field application engineer",
    "$ ./init autonomous_systems",
    "  loading modules: ROS2 · C++ · perception · control · slam",
    "  calibrating sensors: camera · lidar · gnss ... OK",
    "$ status",
    "  robotics | mechatronics | autonomous vehicles :: ONLINE"
  ];

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Render final text instantly when motion is reduced.
  if (reduce) {
    el.textContent = lines.join("\n") + "\n";
    var c0 = document.createElement("span");
    c0.className = "cursor";
    c0.textContent = "█";
    el.appendChild(c0);
    return;
  }

  var cursor = document.createElement("span");
  cursor.className = "cursor";
  cursor.textContent = "█";

  var body = document.createTextNode("");
  el.textContent = "";
  el.appendChild(body);
  el.appendChild(cursor);

  var li = 0, ci = 0;

  function typeChar() {
    if (li >= lines.length) return; // done, leave cursor blinking
    var line = lines[li];
    if (ci <= line.length) {
      body.nodeValue += line.charAt(ci - 1) || "";
      ci++;
      setTimeout(typeChar, line.charAt(ci - 2) === " " ? 22 : 34);
    } else {
      body.nodeValue += "\n";
      li++; ci = 0;
      setTimeout(typeChar, 420);
    }
  }

  setTimeout(typeChar, 500);
})();
