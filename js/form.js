// form.js - Contact form handling

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    
    // Real-time validation (unoptimized - runs on every keystroke)
    var inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(function(input) {
        input.addEventListener('keyup', function() {
            validateField(input);
        });
        input.addEventListener('blur', function() {
            validateField(input);
        });
    });
    
    function validateField(field) {
        var value = field.value.trim();
        var isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            field.style.borderColor = '#ef4444';
            field.style.background = '#fff5f5';
        } else if (field.type === 'email' && value) {
            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.style.borderColor = '#ef4444';
                field.style.background = '#fff5f5';
            } else {
                field.style.borderColor = '#22c55e';
                field.style.background = '#f0fdf4';
            }
        } else if (value) {
            field.style.borderColor = '#22c55e';
            field.style.background = '#f0fdf4';
        } else {
            field.style.borderColor = '#e8e8f0';
            field.style.background = '#f8f9ff';
        }
    }
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var allValid = true;
        var required = form.querySelectorAll('[required]');
        required.forEach(function(field) {
            if (!field.value.trim()) {
                validateField(field);
                allValid = false;
            }
        });
        
        if (!allValid) return;
        
        var submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(function() {
            submitBtn.textContent = '✓ Message Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            
            setTimeout(function() {
                submitBtn.textContent = 'Send Message →';
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                form.reset();
                inputs.forEach(function(input) {
                    input.style.borderColor = '#e8e8f0';
                    input.style.background = '#f8f9ff';
                });
            }, 3000);
        }, 1500);
    });
});
