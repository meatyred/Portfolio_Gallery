const track = document.getElementById("image-track");
const cards = [...track.getElementsByClassName("card")];
const viewer = document.getElementById("viewer");
const viewer_image = document.getElementById("viewer-image");
const viewer_text = document.getElementById("viewer-text");
const viewer_strip = document.getElementById("viewer-strip");

let mouseDownAt = 0;
let previous_x = 0;
let target_x = 0;
let current_x = 0;
let has_drag = false;
let active_index = 0;

const portfolioSections = [
  {
    title: "My Portfolio",
    body: `
      <p>Welcome to my portfolio website. This is my home page.</p>
      <ul>
        <li><strong>Full Name:</strong> Teodulfo M. Capagngan</li>
        <li><strong>Introduction:</strong> A student in interest of game development</li>
      </ul>
    `
  },
  {
    title: "About Me",
    body: `
      <p>Background information about me, my interests, and my goals.</p>
      <ul>
        <li><strong>Education:</strong> Far Eastern University Institute of Technology</li>
        <li><strong>Interests:</strong> Games, Coding, Reading, Watching</li>
        <li><strong>Goals:</strong> To make a game that I am passionate about, and learn more methods of programing</li>
      </ul>
    `
  },
  {
    title: "Projects",
    body: `
      <p>These are some of the projects I can include in my portfolio.</p>
      <ul>
        <li><strong>Parallax Gallery</strong> — draggable image gallery with smooth motion (<a href="https://meatyred.github.io/Parallax/" target="_blank" rel="noopener noreferrer">meatyred.github.io/Parallax/</a>)</li>
        <li><strong>Portfolio Website</strong> — personal website portfolio with a steam themed aesthetic</li>
        <li><strong>Point and Click</strong> — I made a point and click horror game (<a href="https://meatyred.itch.io/super-alpha-version" target="_blank" rel="noopener noreferrer">meatyred.itch.io/super-alpha-version</a>)</li>
        <li><strong>Portals</strong> — I made a Portal project (<a href="https://meatyred.itch.io/portals-d" target="_blank" rel="noopener noreferrer">meatyred.itch.io/portals-d</a>)</li>
        <li><strong>Platformer</strong> — I made a Platformer project (<a href="https://meatyred.itch.io/platform-testing" target="_blank" rel="noopener noreferrer">meatyred.itch.io/platform-testing</a>) USE CODE — 1128 —</li>
      </ul>
    `
  },
  {
    title: "Resume / Experience",
    body: `
      <p>My education and experience summary.</p>
      <ul>
        <li><strong>Far Eastern University Institute of Technology</strong> — 2025 to present</li>
        <li><strong>NU Fairview</strong> — 2023 to 2025</li>
        <li><strong>St Mary's school of novaliches</strong> — 2019 to 2023</li>
        <li><strong>Work Experience:</strong> I work odd-jobs like editing for PhilHealth and polishing a website for the work Immersion I was in.</li>
      </ul>
    `
  },
  {
    title: "Contact",
    body: `
      <p>You can contact me through the following:</p>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:tmcapagngsr@fit.edu.ph">tmcapagngsr@fit.edu.ph</a></li>
        <li><strong>GitHub:</strong> <a href="https://github.com/meatyred" target="_blank" rel="noopener noreferrer">github.com/meatyred</a></li>
        <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/teodulfo-capagngan-8158702b9/" target="_blank" rel="noopener noreferrer">www.linkedin.com/in/teodulfo-capagngan-8158702b9/</a></li>
      </ul>
    `
  }
];

const get_bounds = () => {
  const first_card = cards[0];
  const last_card = cards[cards.length - 1];
  const first_center = first_card.offsetLeft + first_card.offsetWidth / 2;
  const last_center = last_card.offsetLeft + last_card.offsetWidth / 2;
  const track_center = track.scrollWidth / 2;

  return {
    min: track_center - last_center,
    max: track_center - first_center
  };
};

const sync_viewer_strip = () => {
  [...viewer_strip.children].forEach((thumb, index) => {
    thumb.classList.toggle("active", index === active_index);
  });
};

const build_viewer_strip = () => {
  viewer_strip.innerHTML = "";

  cards.forEach((card, index) => {
    const img = card.querySelector(".image");
    const thumb = document.createElement("img");
    thumb.className = "viewer-thumb";
    thumb.src = img.src;
    thumb.alt = img.alt || "";

    thumb.addEventListener("click", (e) => {
      e.stopPropagation();
      open_viewer(index);
    });

    viewer_strip.appendChild(thumb);
  });
};

const open_viewer = (index) => {
  active_index = index;

  const img = cards[index].querySelector(".image");
  const rect = img.getBoundingClientRect();

  viewer_image.src = img.src;
  viewer_image.alt = img.alt || "";

  viewer_image.style.transition = "none";
  viewer_image.style.top = `${rect.top}px`;
  viewer_image.style.left = `${rect.left}px`;
  viewer_image.style.width = `${rect.width}px`;
  viewer_image.style.height = `${rect.height}px`;
  viewer_image.style.borderRadius = "0px";

  viewer_image.getBoundingClientRect();

  viewer.classList.add("show");
  document.body.classList.add("viewer-open");

  viewer_text.style.pointerEvents = "auto";
  sync_viewer_strip();

  const onOpenEnd = (e) => {
    if (e.propertyName !== "width") return;

    viewer_text.innerHTML = `
      <div class="viewer-panel">
        <h1>${portfolioSections[index].title}</h1>
        ${portfolioSections[index].body}
      </div>
    `;

    const panel = viewer_text.querySelector(".viewer-panel");
    requestAnimationFrame(() => {
      panel.classList.add("show");
    });

    viewer_image.removeEventListener("transitionend", onOpenEnd);
  };

  viewer_image.addEventListener("transitionend", onOpenEnd);

  requestAnimationFrame(() => {
    viewer_image.style.transition = "";
    viewer_image.style.top = "0px";
    viewer_image.style.left = "0px";
    viewer_image.style.width = "100vw";
    viewer_image.style.height = "100vh";
    viewer_image.style.borderRadius = "0px";
  });
};

const close_viewer = () => {
  const img = cards[active_index].querySelector(".image");
  const rect = img.getBoundingClientRect();

  const panel = viewer_text.querySelector(".viewer-panel");
  if (panel) {
    panel.classList.remove("show");
  }

  viewer_image.style.top = `${rect.top}px`;
  viewer_image.style.left = `${rect.left}px`;
  viewer_image.style.width = `${rect.width}px`;
  viewer_image.style.height = `${rect.height}px`;

  const onEnd = (e) => {
    if (e.propertyName !== "width") return;

    viewer.classList.remove("show");
    document.body.classList.remove("viewer-open");
    viewer_text.innerHTML = "";
    viewer_text.style.pointerEvents = "none";
    viewer_image.removeEventListener("transitionend", onEnd);
  };

  viewer_image.addEventListener("transitionend", onEnd);
};

const handleOnDown = (e) => {
  mouseDownAt = e.clientX;
  has_drag = false;

  if (viewer.classList.contains("show")) {
    close_viewer();
  }
};

const handleOnMove = (e) => {
  if (mouseDownAt === 0) return;

  const mouse_delta = mouseDownAt - e.clientX;
  const drag_strength = 2;

  if (Math.abs(mouse_delta) > 5) {
    has_drag = true;
  }

  let nextX = previous_x - (mouse_delta * drag_strength);

  const { min, max } = get_bounds();
  nextX = Math.max(Math.min(nextX, max), min);

  target_x = nextX;
};

const handleOnUp = () => {
  mouseDownAt = 0;
  previous_x = target_x;
};

function animate() {
  current_x += (target_x - current_x) * 0.05;

  track.style.transform = `translate(calc(-50% + ${current_x}px), -50%)`;

  const { min, max } = get_bounds();
  const center = (min + max) / 2;
  const half_range = Math.max(1, (max - min) / 2);
  const movement = (current_x - center) / half_range;
  const image_offset = 50 + movement * 35;

  for (const image of track.getElementsByClassName("image")) {
    image.style.objectPosition = `${image_offset}% center`;
  }

  requestAnimationFrame(animate);
}

animate();
build_viewer_strip();

cards.forEach((card, index) => {
  card.addEventListener("click", () => {
    if (has_drag) return;
    open_viewer(index);
  });
});

viewer.addEventListener("pointerdown", (e) => {
  if (e.target.closest(".viewer-strip")) return;
  close_viewer();
  handleOnDown(e);
});

/* touch + mouse events */
window.onmousedown = e => handleOnDown(e);
window.ontouchstart = e => handleOnDown(e.touches[0]);
window.onmouseup = () => handleOnUp();
window.ontouchend = () => handleOnUp();
window.onmousemove = e => handleOnMove(e);
window.ontouchmove = e => handleOnMove(e.touches[0]);