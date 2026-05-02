// assets/reader/js/custom.js

(function() {
    // 1. UI Helpers
    window.myFunction = function() {
        const dropdown = document.getElementById("myDropdown");
        if (dropdown) dropdown.classList.toggle("show");
    };

    window.w3_open = function() {
        const sidebar = document.getElementById("mySidebar");
        if (sidebar) sidebar.style.display = "block";
    };

    window.w3_close = function() {
        const sidebar = document.getElementById("mySidebar");
        if (sidebar) sidebar.style.display = "none";
    };

    // 2. LOGIKA PRINT (Improved)
    window.printPage = function() {
        if (!window.ReactNativeWebView) return;

        // Beritahu RN untuk menampilkan loading overlay
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'START_PRINT' }));

        try {
            var bodyClone = document.body.cloneNode(true);

            // Bersihkan elemen
            var selectors = ['#myDropdown', '#mySidebar', '.navbar', 'button', 'input', 'nav', 'script'];
            selectors.forEach(s => bodyClone.querySelectorAll(s).forEach(el => el.remove()));

            // Proses Gambar
            var originalImages = document.querySelectorAll('img');
            var clonedImages = bodyClone.querySelectorAll('img');

            for (let i = 0; i < originalImages.length; i++) {
                try {
                    // Coba Base64 dulu (Paling akurat)
                    var canvas = document.createElement('canvas');
                    canvas.width = originalImages[i].naturalWidth;
                    canvas.height = originalImages[i].naturalHeight;
                    canvas.getContext('2d').drawImage(originalImages[i], 0, 0);
                    var dataURL = canvas.toDataURL('image/jpeg', 0.7);

                    if (dataURL && dataURL !== 'data:,') {
                        clonedImages[i].src = dataURL;
                    } else {
                        throw new Error();
                    }
                } catch (e) {
                    // Fallback: Path Resolver untuk folder bertingkat
                    var rawSrc = originalImages[i].getAttribute('src');
                    var resolvedUrl = new URL(rawSrc, window.location.href).href;
                    var pathKey = 'assets/reader/';
                    var index = resolvedUrl.indexOf(pathKey);
                    
                    if (index !== -1) {
                        var relativePath = resolvedUrl.substring(index + pathKey.length);
                        clonedImages[i].src = 'file:///android_asset/reader/' + relativePath;
                    }
                }
            }

            // Kirim ke React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'PRINT',
                payload: bodyClone.innerHTML
            }));

        } catch (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'PRINT_ERROR',
                message: err.message
            }));
        }
    };

    window.print = window.printPage;

    // 3. Accordion
    function initAccordion() {
        var acc = document.getElementsByClassName("accordion");
        for (var i = 0; i < acc.length; i++) {
            acc[i].onclick = function() {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel) {
                    panel.style.maxHeight = panel.style.maxHeight ? null : panel.scrollHeight + "px";
                }
            };
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initAccordion();
    } else {
        document.addEventListener("DOMContentLoaded", initAccordion);
    }
})();
 