const properties = [
  {
    id: 1,
    title: "Greenview Orchard Plot",
    location: "Pollachi, Coimbatore",
    type: "Agricultural",
    area: 2.4,
    areaUnit: "acres",
    price: 4800000,
    priceLabel: "₹48 lakh",
    image: "image-farm",
    details: "A gently sloping orchard plot with road access and open views. Listing information and document availability are provided by the owner.",
    documents: "Owner-provided title document · Survey details"
  },
  {
    id: 2,
    title: "Meadowline Estate",
    location: "Saravanampatti, Coimbatore",
    type: "Residential",
    area: 2.1,
    areaUnit: "acres",
    price: 6250000,
    priceLabel: "₹62.5 lakh",
    image: "image-hills",
    details: "A spacious parcel in a growing residential area. Review the listing details and ask the owner for any additional information you need.",
    documents: "Owner-provided title document · Location plan"
  },
  {
    id: 3,
    title: "Riverside Green Acres",
    location: "Mettupalayam, Coimbatore",
    type: "Agricultural",
    area: 4.8,
    areaUnit: "acres",
    price: 9100000,
    priceLabel: "₹91 lakh",
    image: "image-lake",
    details: "A broad agricultural parcel with a scenic setting. LandSure helps organize the listing; please conduct independent legal and site checks.",
    documents: "Owner-provided title document · Land tax receipt"
  },
  {
    id: 4,
    title: "Cedar Grove Farmland",
    location: "Annur, Coimbatore",
    type: "Agricultural",
    area: 3.2,
    areaUnit: "acres",
    price: 5600000,
    priceLabel: "₹56 lakh",
    image: "image-field",
    details: "Open countryside land with a clear plot outline in the listing. Contact the owner to clarify access, utilities, and current land use.",
    documents: "Owner-provided title document · Survey details"
  },
  {
    id: 5,
    title: "Northgate Business Parcel",
    location: "Avinashi Road, Coimbatore",
    type: "Commercial",
    area: 1.6,
    areaUnit: "acres",
    price: 7800000,
    priceLabel: "₹78 lakh",
    image: "image-orchard",
    details: "A commercial-use listing near a major corridor. Verify permitted use, road access, and local requirements with the relevant authorities.",
    documents: "Owner-provided title document · Survey details"
  },
  {
    id: 6,
    title: "Hillcrest Homestead",
    location: "Karamadai, Coimbatore",
    type: "Residential",
    area: 1.2,
    areaUnit: "acres",
    price: 3900000,
    priceLabel: "₹39 lakh",
    image: "image-estate",
    details: "A quiet homestead-sized parcel among green foothills. Reach out to the owner for current availability and property particulars.",
    documents: "Owner-provided title document · Location plan"
  }
];

const propertyGrid = document.querySelector("#property-grid");
const emptyState = document.querySelector("#empty-state");
const propertyModal = document.querySelector("#property-modal");
const signinModal = document.querySelector("#signin-modal");
const toast = document.querySelector("#toast");
let activeType = "All";
let locationQuery = "";
let favorites = new Set();
let toastTimer;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

function getVisibleProperties() {
  const query = locationQuery.trim().toLowerCase();
  const matches = properties.filter((property) => {
    const matchesType = activeType === "All" || property.type === activeType;
    const matchesLocation = !query || property.location.toLowerCase().includes(query);
    return matchesType && matchesLocation;
  });
  const sort = document.querySelector("#sort-listings").value;
  if (sort === "price-low") matches.sort((a, b) => a.price - b.price);
  if (sort === "price-high") matches.sort((a, b) => b.price - a.price);
  if (sort === "area-large") matches.sort((a, b) => b.area - a.area);
  return matches;
}

function renderProperties() {
  const visible = getVisibleProperties();
  propertyGrid.innerHTML = visible.map((property) => `
    <article class="property-card">
      <div class="property-image ${property.image}" role="img" aria-label="Green landscape near ${escapeHtml(property.location)}">
        <span class="listing-tag">${escapeHtml(property.type)} land</span>
        <button class="favorite-button ${favorites.has(property.id) ? "is-favorite" : ""}" type="button" data-favorite="${property.id}" aria-label="${favorites.has(property.id) ? "Remove from" : "Add to"} saved properties" aria-pressed="${favorites.has(property.id)}">${favorites.has(property.id) ? "♥" : "♡"}</button>
      </div>
      <div class="property-body">
        <div class="property-title-row">
          <div><h3 class="property-title">${escapeHtml(property.title)}</h3><div class="property-location"><span aria-hidden="true">⌖</span> ${escapeHtml(property.location)}</div></div>
          <div class="property-price">${escapeHtml(property.priceLabel)}<small>Asking price</small></div>
        </div>
        <div class="property-meta"><span><b aria-hidden="true">▱</b> ${property.area} ${escapeHtml(property.areaUnit)}</span><span><b aria-hidden="true">▤</b> Details listed</span></div>
        <div class="property-card-bottom"><span class="doc-label"><span aria-hidden="true">✓</span> Documents available</span><button class="details-button" type="button" data-property="${property.id}">View details <span aria-hidden="true">→</span></button></div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = visible.length > 0;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

function openProperty(propertyId) {
  const property = properties.find((item) => item.id === Number(propertyId));
  if (!property) return;
  document.querySelector("#property-modal-content").innerHTML = `
    <div class="property-modal-photo property-image ${property.image}" role="img" aria-label="Green landscape near ${escapeHtml(property.location)}"></div>
    <div class="property-modal-info">
      <span class="listing-tag">${escapeHtml(property.type)} land</span>
      <h2 id="property-modal-title">${escapeHtml(property.title)}</h2>
      <p class="modal-location"><span aria-hidden="true">⌖</span> ${escapeHtml(property.location)}</p>
      <div class="modal-meta"><span>▱ &nbsp;${property.area} ${escapeHtml(property.areaUnit)}</span><span>▤ &nbsp;Documents available</span></div>
      <div class="modal-price">${escapeHtml(property.priceLabel)} <small>Asking price · ${escapeHtml(formatPrice(property.price))}</small></div>
      <p class="modal-description">${escapeHtml(property.details)}</p>
      <div class="modal-documents"><strong>Documents listed by the owner</strong><span>${escapeHtml(property.documents)}</span></div>
      <button class="button button-primary modal-request" type="button" data-request="${property.id}">Send a purchase request <span aria-hidden="true">→</span></button>
    </div>
  `;
  propertyModal.showModal();
  document.body.classList.add("modal-open");
}

function closeDialog(dialog) {
  if (dialog.open) dialog.close();
  if (!document.querySelector("dialog[open]")) document.body.classList.remove("modal-open");
}

document.querySelector("#current-year").textContent = new Date().getFullYear();
renderProperties();

document.querySelectorAll(".filter-pill").forEach((button) => {
  button.addEventListener("click", () => {
    activeType = button.dataset.filter;
    document.querySelectorAll(".filter-pill").forEach((pill) => pill.classList.toggle("is-active", pill === button));
    renderProperties();
  });
});

document.querySelector("#sort-listings").addEventListener("change", renderProperties);

document.querySelector("#hero-search").addEventListener("submit", (event) => {
  event.preventDefault();
  locationQuery = document.querySelector("#hero-location").value;
  const selectedType = document.querySelector("#hero-type").value;
  activeType = selectedType || "All";
  document.querySelectorAll(".filter-pill").forEach((pill) => pill.classList.toggle("is-active", pill.dataset.filter === activeType));
  renderProperties();
  document.querySelector("#properties").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#view-all-link").addEventListener("click", () => {
  locationQuery = "";
  document.querySelector("#hero-location").value = "";
  document.querySelector("#hero-type").value = "";
  activeType = "All";
  document.querySelectorAll(".filter-pill").forEach((pill) => pill.classList.toggle("is-active", pill.dataset.filter === "All"));
  renderProperties();
});

propertyGrid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    renderProperties();
    showToast(favorites.has(id) ? "Saved to your favorites." : "Removed from your favorites.");
    return;
  }
  const detailsButton = event.target.closest("[data-property]");
  if (detailsButton) openProperty(detailsButton.dataset.property);
});

document.querySelector("#property-modal-content").addEventListener("click", (event) => {
  const requestButton = event.target.closest("[data-request]");
  if (!requestButton) return;
  const property = properties.find((item) => item.id === Number(requestButton.dataset.request));
  closeDialog(propertyModal);
  if (property) showToast(`Request preview started for ${property.title}. Sign-in is needed to continue.`);
});

document.querySelectorAll("[data-open-modal='signin']").forEach((button) => {
  button.addEventListener("click", () => {
    signinModal.showModal();
    document.body.classList.add("modal-open");
  });
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.querySelector(".modal-close").addEventListener("click", () => closeDialog(dialog));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
  dialog.addEventListener("close", () => {
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("modal-open");
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const desktopNav = document.querySelector(".desktop-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = desktopNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
desktopNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  desktopNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const fileInput = document.querySelector("#document-upload");
const uploadZone = document.querySelector("#upload-zone");
const uploadTitle = document.querySelector("#upload-title");
const uploadDescription = document.querySelector("#upload-description");
const verificationFeedback = document.querySelector("#verification-feedback");
const maxFileSize = 10 * 1024 * 1024;
const allowedExtensions = /\.(pdf|png|jpe?g)$/i;

function handleDocument(file) {
  if (!file) return;
  if (!allowedExtensions.test(file.name)) {
    verificationFeedback.textContent = "Choose a PDF, JPG, or PNG document.";
    return;
  }
  if (file.size > maxFileSize) {
    verificationFeedback.textContent = "That file is larger than 10 MB. Choose a smaller document.";
    return;
  }
  uploadTitle.textContent = escapeHtml(file.name);
  uploadDescription.textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB · Ready for a review demo`;
  verificationFeedback.textContent = "File selected locally. Document analysis is not connected in this preview.";
}

fileInput.addEventListener("change", () => handleDocument(fileInput.files[0]));
["dragenter", "dragover"].forEach((eventName) => uploadZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  uploadZone.classList.add("is-dragging");
}));
["dragleave", "drop"].forEach((eventName) => uploadZone.addEventListener(eventName, (event) => {
  event.preventDefault();
  uploadZone.classList.remove("is-dragging");
}));
uploadZone.addEventListener("drop", (event) => handleDocument(event.dataTransfer.files[0]));
