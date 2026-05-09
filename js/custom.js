// Gunakan event listener agar script jalan SETELAH semua elemen HTML muncul
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");

    /* Accordion Logic */
    var acc = document.getElementsByClassName("accordion");
    for (var i = 0; i < acc.length; i++) {
        acc[i].onclick = function() {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            } 
        };
    }
});

/* Dropdown Functions (Global agar bisa dipanggil via onclick di HTML) */
window.myFunction = function() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.filterFunction = function() {
    const input = document.getElementById("myInput");
    const filter = input.value.toUpperCase();
    const div = document.getElementById("myDropdown");
    const a = div.getElementsByTagName("a");
    for (let i = 0; i < a.length; i++) {
        let txtValue = a[i].textContent || a[i].innerText;
        a[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
}

/* Sidebar Functions */
window.w3_open = function() {
    document.getElementById("mySidebar").style.display = "block";
}
window.w3_close = function() {
    document.getElementById("mySidebar").style.display = "none";
}

/* Fix Print Function agar tidak menyebabkan error */
window.printPage = function() {
    if (window.android && window.android.webView) {
        window.android.webView.print();
    } else {
        window.print(); // Fallback ke print browser standar
    }
}
