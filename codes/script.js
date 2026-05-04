console.log("+----------------+");
console.log("| Tejas Codes :D |");
console.log("+----------------+");

var yearEl = document.getElementById("year") || document.getElementsByClassName("year")[0];
if (yearEl) yearEl.innerHTML = new Date().getFullYear();

var calander = document.getElementById("calander");
var body = document.getElementById("body");
var container = document.querySelector(".container"); // Select container for scrolling
// Toggle calendar visibility
function toggleCalendar() {
  document.getElementById("BigContainer").scrollLeft = 0;
  document.getElementById("BigContainer").scrollTop = 0;
  if (calander.style.marginLeft === "-50vw") {
    calander.style.marginLeft = "0";
    document.getElementById("calanderImg").src = "artworks/close.png";
    document.getElementById("type").style.right = "-30px";
  } else {
    calander.style.marginLeft = "-50vw";
    document.getElementById("type").style.right = "-130px";
    document.getElementById("calanderImg").src = "artworks/calander.png";
  }
}

// Scroll container to the selected year (horizontal for desktop, vertical for mobile)
function scrollToYear(yearId) {
  var yearElement = document.getElementById(yearId);

  if (yearElement) {
    if (window.innerWidth < 700) {
      // For mobile (vertical layout)
      yearElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // For desktop (horizontal layout)
      container.scrollTo({
        left: yearElement.offsetLeft, // Scroll horizontally to the year section
        behavior: "smooth",
      });
    }
  }
}

// Attach click events to all year links in the calendar
document.querySelectorAll(".calander a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor behavior
    var yearId = this.getAttribute("href").substring(1); // Get the year ID (e.g., "2024")
    scrollToYear(yearId); // Scroll to the year section
  });
});

// Modal (Lightbox) functionality
var modal = document.getElementById("artModal");
var modalImg = document.getElementById("modalImage");
var captionText = document.getElementById("caption");
var closeModal = document.getElementsByClassName("close")[0];

// Function to open modal when an artwork is clicked
function openArtworkModal(imageSrc, caption) {
  modal.style.display = "block";
  modalImg.src = imageSrc;
  captionText.innerHTML = caption;
}

// Close modal when 'X' is clicked
closeModal.onclick = function () {
  modal.style.display = "none";
};

// Close the modal when clicking anywhere outside the image
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Attach click events to all artwork images for modal
document.querySelectorAll(".art").forEach((image) => {
  image.addEventListener("click", function () {
    var imgSrc = this.src; // Get image source
    var caption = this.nextElementSibling.querySelector(".name").innerText; // Get image caption
    openArtworkModal(imgSrc, caption);
  });
});

function scrollFunction() {
  const element = document.getElementById("feedbackSection");
  element.scrollIntoView({ behavior: "smooth" });
  document.getElementById("calanderImg").style.opacity = 0;
  document.getElementById("back").style.opacity = 1;
  body.style.overflowY = "hidden";
  calander.style.marginLeft = "-50vw";
  document.getElementById("calanderImg").src = "artworks/calander.png";
}

function display() {
  const element = document.getElementById("display");
  element.scrollIntoView({ behavior: "smooth" });
  document.getElementById("calanderImg").style.opacity = 1;
  if (window.matchMedia("(max-width: 700px)").matches) {
    body.style.overflowY = "scroll";
  }
  document.getElementById("back").style.opacity = 0;
}

display();

function checkFeedbackLength(input) {
  if (input.value.length < 10) {
    document.getElementById("feedbackError").style.opacity = "100%";
    return false;
  } else {
    document.getElementById("feedbackError").style.opacity = "0%";
    return true;
  }
}

document.querySelectorAll(".type a").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent immediate navigation

    // Fade out the current page's <section>
    const currentSection = document.querySelector("section");
    currentSection.classList.add("hidden");

    // Store the href in sessionStorage to navigate after fade-out
    sessionStorage.setItem("nextPage", this.href);

    // Wait for the fade-out to complete
    setTimeout(() => {
      // Navigate to the new page
      window.location.href = this.href;
    }, 300); // Matches the transition duration
  });
});

// Fade in the <section> of the new page on load
window.onload = function () {
  const newSection = document.querySelector("section");

  // Check if coming from another page
  if (sessionStorage.getItem("nextPage")) {
    newSection.classList.add("hidden"); // Start hidden
    setTimeout(() => {
      newSection.classList.remove("hidden"); // Fade in
    }, 0); // Slight delay to ensure transition
  }
};

function nft_review() {
  window.location.href = "index.html";
  setTimeout(() => {
    scrollFunction();
  }, 1000);
}

// Fetch and render reviews from Netlify Forms via serverless function
function loadReviews() {
  const tbody = document.getElementById("reviewsBody");
  if (!tbody) return;

  fetch("/.netlify/functions/get-reviews")
    .then((res) => {
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    })
    .then((reviews) => {
      if (!reviews || reviews.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; opacity:0.5;">No reviews yet. Be the first!</td></tr>`;
        return;
      }

      tbody.innerHTML = reviews
        .map((review) => {
          // Generate star display
          const stars = review.rating
            ? "★".repeat(review.rating) + "☆".repeat(5 - review.rating)
            : "—";
          const starColor = review.rating ? "color: gold;" : "opacity: 0.4;";

          return `<tr>
            <td>${escapeHtml(review.name)}</td>
            <td>${escapeHtml(review.message)}</td>
            <td style="${starColor}">${stars}</td>
          </tr>`;
        })
        .join("");
    })
    .catch((err) => {
      console.error("Failed to load reviews:", err);
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; opacity:0.5;">Could not load reviews.</td></tr>`;
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

// Load reviews on page load
loadReviews();
