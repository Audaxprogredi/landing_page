"use strict";

const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        toast.classList.add("md:block");
        toast.classList.add("hidden");

    }
};

const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://dawm2.readthedocs.io/es/latest/guias/guia08.html", "_blank");
        });
    }
};

(() => {
    showToast();
    showVideo();
})();