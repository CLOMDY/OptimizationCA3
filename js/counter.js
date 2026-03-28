// counter.js - Animate counting numbers

document.addEventListener('DOMContentLoaded', function() {
    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-target'));
        var duration = 2000;
        var step = target / (duration / 16);
        var current = 0;
        
        var interval = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = Math.floor(current);
        }, 16);
    }
    
    var counters = document.querySelectorAll('.stat-num, .result-num');
    
    // UNOPTIMIZED: No IntersectionObserver, uses scroll event
    function checkCounters() {
        counters.forEach(function(counter) {
            if (counter.dataset.animated) return;
            var rect = counter.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                counter.dataset.animated = true;
                animateCounter(counter);
            }
        });
    }
    
    window.addEventListener('scroll', checkCounters);
    checkCounters();
});
