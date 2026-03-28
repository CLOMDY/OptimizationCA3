// navbar.js - UNOPTIMIZED: Separate file for simple functionality

document.addEventListener('DOMContentLoaded', function() {
    var navbar = document.querySelector('.navbar');
    var hamburger = document.querySelector('.hamburger');
    var navLinks = document.querySelector('.nav-links');
    
    // Navbar scroll effect
    // UNOPTIMIZED: No throttle on scroll event
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'white';
            navLinks.style.padding = '2rem';
            navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            navLinks.style.zIndex = '999';
        });
    }
    
    // Close mobile menu on link click
    var navLinkItems = document.querySelectorAll('.nav-links a');
    navLinkItems.forEach(function(link) {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.style.display = 'none';
            }
        });
    });
    
    // UNOPTIMIZED: Polling for scroll position
    setInterval(function() {
        var scrollPos = window.pageYOffset;
        // Unnecessary repeated check
        if (scrollPos > 100) {
            document.body.style.paddingTop = '80px';
        }
    }, 500);
});
