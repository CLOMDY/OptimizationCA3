// filter.js - Portfolio filter functionality

document.addEventListener('DOMContentLoaded', function() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (!filterBtns.length) return;
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Remove active from all
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            
            var filter = btn.dataset.filter;
            
            portfolioItems.forEach(function(item) {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
