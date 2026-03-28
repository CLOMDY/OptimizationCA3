// animations.js - UNOPTIMIZED: Duplicate scroll handler, no RequestAnimationFrame

document.addEventListener('DOMContentLoaded', function() {
    
    // UNOPTIMIZED: Another scroll listener (duplicates main.js)
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;
        
        // Parallax effect on hero
        var hero = document.querySelector('.hero-bg-img');
        if (hero) {
            hero.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
        }
        
        // UNOPTIMIZED: Forced reflow in scroll handler
        var sections = document.querySelectorAll('section');
        sections.forEach(function(section) {
            var rect = section.getBoundingClientRect();
            var opacity = Math.min(1, (window.innerHeight - rect.top) / 200);
            if (opacity > 0) {
                // section.style.opacity = opacity; // disabled but code still runs
            }
        });
    });
    
    // Image loading effects
    var images = document.querySelectorAll('img');
    images.forEach(function(img) {
        // UNOPTIMIZED: Adding listeners to all images
        img.addEventListener('load', function() {
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.5s ease';
        });
        img.addEventListener('error', function() {
            img.style.display = 'none';
        });
    });
    
    // Hover ripple effect (computationally heavy)
    var cards = document.querySelectorAll('.feature-card, .testimonial-card, .team-card');
    cards.forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            // Forcing style recalculation on every mousemove
            card.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(102,126,234,0.05) 0%, white 60%)';
        });
        card.addEventListener('mouseleave', function() {
            card.style.background = 'white';
        });
    });
    
    // UNOPTIMIZED: Polling animation
    var tick = 0;
    setInterval(function() {
        tick++;
        // Unnecessary periodic DOM check
        var logoIcon = document.querySelector('.logo-icon');
        if (logoIcon && tick % 10 === 0) {
            // Just doing a pointless check every 500ms
            var computed = window.getComputedStyle(logoIcon);
        }
    }, 50);
});
