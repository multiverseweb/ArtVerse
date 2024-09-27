var calander = document.getElementById("calander");

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
