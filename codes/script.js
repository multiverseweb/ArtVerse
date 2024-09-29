var calander = document.getElementById("calander");
var container = document.querySelector('.container'); // Select container for scrolling

// Toggle calendar visibility
function toggleCalendar() {
    if (window.innerWidth < 700) {
        if (calander.style.marginLeft === "-50vw") {
            calander.style.marginLeft = "0";
        } else {
            calander.style.marginLeft = "-50vw";
        }
    } else {
        if (calander.style.marginLeft === "-10vw") {
            calander.style.marginLeft = "0";
        } else {
            calander.style.marginLeft = "-10vw";
        }
    }
}

// Scroll container to the selected year (horizontal for desktop, vertical for mobile)
function scrollToYear(yearId) {
    var yearElement = document.getElementById(yearId);

    if (yearElement) {
        if (window.innerWidth < 700) { 
            // For mobile (vertical layout)
            yearElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            // For desktop (horizontal layout)
            container.scrollTo({
                left: yearElement.offsetLeft,  // Scroll horizontally to the year section
                behavior: 'smooth'
            });
        }
    }
}

// Attach click events to all year links in the calendar
document.querySelectorAll('.calander a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();  // Prevent default anchor behavior
        var yearId = this.getAttribute('href').substring(1);  // Get the year ID (e.g., "2024")
        scrollToYear(yearId);  // Scroll to the year section
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
closeModal.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking anywhere outside the image
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Attach click events to all artwork images for modal
document.querySelectorAll('.art').forEach(image => {
    image.addEventListener('click', function() {
        var imgSrc = this.src;  // Get image source
        var caption = this.nextElementSibling.querySelector('.name').innerText;  // Get image caption
        openArtworkModal(imgSrc, caption);
    });
});
