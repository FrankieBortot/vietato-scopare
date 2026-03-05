
const curatedProfiles = Array.isArray(window.curatedProfiles) ? window.curatedProfiles : [];
const defaultTidalTrackId = "192088477";

const photoClasses = [
  "polaroid polaroid--main",
  "polaroid polaroid--alt-1",
  "polaroid polaroid--alt-2",
  "polaroid polaroid--alt-3",
];

const profilesStackEl = document.getElementById("profiles-stack");

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function applyPolaroidJitter(frame, index) {
  if (index === 0) {
    frame.style.setProperty("--jitter-x", `${randomRange(-3, 3).toFixed(1)}px`);
    frame.style.setProperty("--jitter-y", `${randomRange(-3, 3).toFixed(1)}px`);
    frame.style.setProperty("--jitter-rot", `${randomRange(-3.2, 3.2).toFixed(2)}deg`);
    return;
  }

  frame.style.setProperty("--jitter-x", `${randomRange(-8, 8).toFixed(1)}px`);
  frame.style.setProperty("--jitter-y", `${randomRange(-10, 10).toFixed(1)}px`);
  frame.style.setProperty("--jitter-rot", `${randomRange(-4.4, 4.4).toFixed(2)}deg`);
}

function applyMobilePolaroidTilt(frame) {
  frame.style.setProperty("--mobile-tilt", `${randomRange(-10, 10).toFixed(2)}deg`);
}

function createProfileCard(profile) {
  const card = document.createElement("article");
  card.className = "profile-card";
  card.id = `profile-${profile.id}`;

  const photos = document.createElement("aside");
  photos.className = "profile-photos collage";
  photos.setAttribute("aria-label", `Foto di ${profile.name}`);

  profile.photos.slice(0, 4).forEach((photo, index) => {
    const frame = document.createElement("figure");
    frame.className = photoClasses[index] || "polaroid";
    applyPolaroidJitter(frame, index);
    applyMobilePolaroidTilt(frame);

    const image = document.createElement("img");
    image.src = photo;
    image.alt = `${profile.name} - foto ${index + 1}`;
    image.loading = "lazy";
    image.decoding = "async";

    frame.appendChild(image);
    photos.appendChild(frame);
  });

  const content = document.createElement("div");
  content.className = "profile-content";

  const head = document.createElement("header");
  head.className = "profile-content__head";
  const body = document.createElement("div");
  body.className = "profile-body";

  const title = document.createElement("h2");
  title.textContent = profile.name;

  const meta = document.createElement("p");
  meta.className = "profile-meta";
  meta.textContent = `🍓 ${profile.age} anni · ${profile.city}`;

  head.append(title, meta);

  const bio = document.createElement("p");
  bio.className = "profile-bio";
  bio.textContent = profile.bio;

  const highlights = document.createDocumentFragment();
  profile.highlights.forEach((highlight) => {
    const item = document.createElement("p");
    item.className = "profile-highlight";

    const icon = document.createElement("span");
    icon.className = "highlight-icon";
    icon.setAttribute("aria-hidden", "true");

    const iconImage = document.createElement("img");
    iconImage.src = "./assets/peach.svg";
    iconImage.alt = "";
    iconImage.decoding = "async";
    iconImage.loading = "lazy";

    icon.appendChild(iconImage);
    item.append(icon, document.createTextNode(highlight));
    highlights.appendChild(item);
  });

  const tidalTrackId = profile.tidalTrackId || defaultTidalTrackId;
  const tidalPlayer = document.createElement("section");
  tidalPlayer.className = "profile-tidal";

  const tidalFrame = document.createElement("iframe");
  tidalFrame.src = `https://embed.tidal.com/tracks/${encodeURIComponent(tidalTrackId)}`;
  tidalFrame.width = "500";
  tidalFrame.height = "120";
  tidalFrame.allow =
    "encrypted-media; fullscreen; clipboard-write https://embed.tidal.com; web-share";
  tidalFrame.sandbox =
    "allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox";
  tidalFrame.style.colorScheme = "light dark";
  tidalFrame.title = "TIDAL Embed Player";
  tidalFrame.loading = "lazy";

  tidalPlayer.appendChild(tidalFrame);

  const questionSection = document.createElement("section");
  questionSection.className = "profile-question";

  const questionLabel = document.createElement("p");
  questionLabel.className = "profile-question__label";
  questionLabel.textContent = "Vuole assolutamente sapere";

  const questionText = document.createElement("p");
  questionText.className = "profile-question__text";
  questionText.textContent = profile.question;

  const replyButton = document.createElement("button");
  replyButton.type = "button";
  replyButton.className = "btn";
  replyButton.textContent = `Rispondi a ${profile.name.toLowerCase()}`;

  questionSection.append(questionLabel, questionText, replyButton);
  body.append(bio, highlights, tidalPlayer, questionSection);
  content.append(head, body);

  card.append(photos, content);
  return card;
}

function renderProfiles() {
  profilesStackEl.innerHTML = "";
  curatedProfiles.forEach((profile) => {
    profilesStackEl.appendChild(createProfileCard(profile));
  });
}

function updateActivePolaroid(collage) {
  const polaroids = Array.from(collage.querySelectorAll(".polaroid"));
  if (!polaroids.length) {
    return;
  }

  const centerX = collage.scrollLeft + collage.clientWidth / 2;
  let active = polaroids[0];
  let minDistance = Infinity;

  polaroids.forEach((polaroid) => {
    const polaroidCenter = polaroid.offsetLeft + polaroid.offsetWidth / 2;
    const distance = Math.abs(polaroidCenter - centerX);
    if (distance < minDistance) {
      minDistance = distance;
      active = polaroid;
    }
  });

  polaroids.forEach((polaroid) => {
    polaroid.classList.toggle("is-active", polaroid === active);
  });

  return active;
}

function centerPolaroid(collage, polaroid) {
  if (!polaroid) {
    return;
  }

  const target =
    polaroid.offsetLeft - (collage.clientWidth - polaroid.offsetWidth) / 2;
  const maxScroll = collage.scrollWidth - collage.clientWidth;
  const nextScrollLeft = Math.max(0, Math.min(target, Math.max(0, maxScroll)));
  collage.scrollLeft = nextScrollLeft;
}

function initMobileCollageBehavior() {
  const collages = Array.from(document.querySelectorAll(".profile-photos"));

  collages.forEach((collage) => {
    let ticking = false;

    collage.addEventListener(
      "scroll",
      () => {
        if (ticking) {
          return;
        }

        ticking = true;
        requestAnimationFrame(() => {
          updateActivePolaroid(collage);
          ticking = false;
        });
      },
      { passive: true }
    );

    requestAnimationFrame(() => {
      const active = updateActivePolaroid(collage);
      centerPolaroid(collage, active);
    });
  });

  window.addEventListener("resize", () => {
    collages.forEach((collage) => {
      const active = updateActivePolaroid(collage);
      centerPolaroid(collage, active);
    });
  });
}

renderProfiles();
initMobileCollageBehavior();
