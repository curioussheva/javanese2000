console.log("JavaScript from assets/js/script.js loaded!");

document.addEventListener('DOMContentLoaded', () => {
    const heading = document.querySelector('h1');
    if (heading) {
        heading.addEventListener('click', () => {
            alert('You clicked the heading!');
        });
    }
});