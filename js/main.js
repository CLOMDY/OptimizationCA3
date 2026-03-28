// main.js - UNOPTIMIZED: No minification, synchronous loading

// Initialize everything on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('TechVista website loaded');
    
    // Initialize all modules
    initScrollAnimations();
    initFaqAccordion();
    initPortfolioFilter();
    initContactForm();
    
    // UNOPTIMIZED: Blocking heavy computation on load
    performHeavyComputation();
});

// Heavy computation that blocks main thread (intentionally slow)
function performHeavyComputation() {
    // UNOPTIMIZED: Doing unnecessary work on page load
    var result = 0;
    for (var i = 0; i < 1000000; i++) {
        result += Math.sqrt(i) * Math.cos(i);
    }
    console.log('Heavy computation done:', result);
    
    // Unnecessary DOM queries
    var allElements = document.querySelectorAll('*');
    allElements.forEach(function(el) {
        var style = window.getComputedStyle(el);
        // Forcing layout recalculation (reflow) repeatedly
        var height = el.offsetHeight;
        var width = el.offsetWidth;
    });
}

// Scroll Animations
function initScrollAnimations() {
    var animElements = document.querySelectorAll('.feature-card, .testimonial-card, .team-card, .portfolio-item, .mv-card, .showcase-item, .award-item');
    
    animElements.forEach(function(el, index) {
        el.classList.add('animate-on-scroll');
        el.classList.add('delay-' + ((index % 5) + 1));
    });
    
    function checkAnimations() {
        animElements.forEach(function(el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.classList.add('animated');
            }
        });
    }
    
    // UNOPTIMIZED: No throttling/debouncing on scroll handler
    window.addEventListener('scroll', checkAnimations);
    checkAnimations();
}

// FAQ Accordion
function initFaqAccordion() {
    // Also define global toggleFaq
}

function toggleFaq(element) {
    var faqItem = element.parentElement;
    var allFaqs = document.querySelectorAll('.faq-item');
    
    allFaqs.forEach(function(item) {
        if (item !== faqItem) {
            item.classList.remove('open');
        }
    });
    
    faqItem.classList.toggle('open');
}

// Portfolio Filter
function initPortfolioFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterBtns.length) return;
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            
            var filter = btn.dataset.filter;
            
            portfolioItems.forEach(function(item) {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'scaleIn 0.3s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Contact Form
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // UNOPTIMIZED: Doing heavy validation synchronously
        var fields = form.querySelectorAll('input, textarea, select');
        var isValid = true;
        
        fields.forEach(function(field) {
            if (field.hasAttribute('required') && !field.value.trim()) {
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '#667eea';
            }
        });
        
        if (isValid) {
            var submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            
            setTimeout(function() {
                submitBtn.textContent = 'Send Message →';
                submitBtn.style.background = '';
                form.reset();
            }, 3000);
        }
    });
}

// UNOPTIMIZED: Unused utility functions taking up space
function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

function debounce(func, wait) {
    var timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(func, wait);
    };
}

function throttle(func, limit) {
    var lastFunc, lastRan;
    return function() {
        if (!lastRan) {
            func.apply(this, arguments);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, arguments);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0;
        var v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function isEmailValid(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function setCookie(name, value, days) {
    var expires = '';
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch(e) {
        return null;
    }
}

function setLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch(e) {
        console.error('LocalStorage not available');
    }
}
