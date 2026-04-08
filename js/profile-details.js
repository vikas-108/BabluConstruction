const container = document.getElementById("profileContainer");

const params = new URLSearchParams(window.location.search);
const profileId = params.get("id");

const SERVER_BASE = "https://api.buildskil.com";

async function loadProfile() {
  if (!profileId) {
    container.innerHTML = "<p>Profile not found</p>";
    return;
  }

  try {
    const res = await fetch(`${SERVER_BASE}/api/profiles/${profileId}`);

    if (!res.ok) {
      container.innerHTML = "<p>Profile not available</p>";
      return;
    }

    const p = await res.json();
    renderProfile(p);

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Server error</p>";
  }
}

function renderProfile(p) {

  const mediaUrl = p.media?.startsWith("http")
    ? p.media
    : SERVER_BASE + p.media;

  container.innerHTML = `

  <section class="profile-hero">

    <div class="hero-media">
      ${
        p.mediaType === "video"
          ? `<video src="${mediaUrl}" controls></video>`
          : `<img src="${SERVER_BASE + p.media}?v=${Date.now()}" alt="${p.name}" />`
      }
    </div>

    <div class="hero-info">
      <h1>
        ${p.name}
        ${p.verified ? `<span class="verify-badge">✔ Verified</span>` : ""}
      </h1>

      <span class="badge">${p.role || ""}, ${p.category || ""}</span>

      <div class="meta">
        <span>⭐ ${p.experience || "—"} yrs</span>
        <span>📍 ${p.location || ""}, ${p.state || ""}, ${p.district || ""}</span>
      </div>

      <div class="profile-actions">
        <a href="tel:${p.phone}" class="btn call">📞 Call</a>
        <a href="https://wa.me/${p.phone.replace(/\D/g,"")}" target="_blank" class="btn whatsapp">🟢 WhatsApp</a>
      </div>

    </div>
  </section>


  <section class="profile-details">

    <h3>About Work</h3>
    <p>${p.description || "No details available"}</p>

    ${
      p.skills?.length
        ? `
        <h3>Skills</h3>
        <div class="skills">
          ${p.skills.map(s=>`<span>${s}</span>`).join("")}
        </div>`
        : ""
    }
    ${p.languages?.length ? `<h3>Languages</h3><p>${p.languages.join(", ")}</p>` : ""}
    </section>
    ${
      p.album?.length
        ? `
         <section class="profile-gallery">
        <h3>Work Gallery</h3>
        <div class="gallery">
          ${p.album.map(img=>`<img src="${SERVER_BASE + img}" />`).join("")}
        </div>
         </section>`
        : ""
    }
  `;
 // ✅ After rendering, set up infinite scroll
  const profileDetails = document.querySelector('.profile-details');
  if (!profileDetails) return;

  // Duplicate content for seamless loop
  profileDetails.innerHTML += profileDetails.innerHTML;

  let isPaused = false;
  let scrollInterval;

  function startAutoScroll() {
    scrollInterval = setInterval(() => {
      if (!isPaused) {
        profileDetails.scrollLeft += 1;

        // ✅ Reset halfway through, not at the very end
        if (profileDetails.scrollLeft >= profileDetails.scrollWidth / 2) {
          profileDetails.scrollLeft = 0;
        }
      }
    }, 20); // adjust speed here
  }

  // Pause on hover/touch
  profileDetails.addEventListener('mouseenter', () => { isPaused = true; });
  profileDetails.addEventListener('mouseleave', () => { isPaused = false; });
  profileDetails.addEventListener('touchstart', () => { isPaused = true; });
  profileDetails.addEventListener('touchend', () => { isPaused = false; });

  startAutoScroll();
const galleryImages = document.querySelectorAll('.gallery img');
const albumSources = Array.from(galleryImages).map(img => img.src);

galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => {
    let currentIndex = index;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';

    // Fullscreen image
    const fullImg = document.createElement('img');
    fullImg.src = albumSources[currentIndex];
    overlay.appendChild(fullImg);

    // Navigation arrows
    const prevBtn = document.createElement('div');
    prevBtn.className = 'nav prev';
    prevBtn.textContent = '‹';
    const nextBtn = document.createElement('div');
    nextBtn.className = 'nav next';
    nextBtn.textContent = '›';
    overlay.appendChild(prevBtn);
    overlay.appendChild(nextBtn);

    document.body.appendChild(overlay);

    // Close on background click
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.remove();
    });

    // Navigation handlers
    function showImage(i) {
      currentIndex = (i + albumSources.length) % albumSources.length;
      fullImg.src = albumSources[currentIndex];
    }
    prevBtn.addEventListener('click', e => {
      e.stopPropagation();
      showImage(currentIndex - 1);
    });
    nextBtn.addEventListener('click', e => {
      e.stopPropagation();
      showImage(currentIndex + 1);
    });

    // Swipe support (mobile)
   // Swipe support (mobile)
let startX = 0;
overlay.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
}, { passive: true });

overlay.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  if (endX - startX > 50) showImage(currentIndex - 1); // swipe right
  if (startX - endX > 50) showImage(currentIndex + 1); // swipe left
}, { passive: true });

    // Keyboard support
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') overlay.remove();
      if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(currentIndex + 1);
    }, { once: true });
  });
});

}


loadProfile();
