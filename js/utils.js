// utils.js - UNOPTIMIZED: Loaded on every page even if unused

// String utilities
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelCase(str) {
    return str.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
}

function kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Array utilities
function chunk(array, size) {
    var chunks = [];
    for (var i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

function unique(array) {
    return array.filter(function(value, index, self) {
        return self.indexOf(value) === index;
    });
}

function shuffle(array) {
    var arr = array.slice();
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

// Math utilities
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function map(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

// DOM utilities
function createElement(tag, classes, text) {
    var el = document.createElement(tag);
    if (classes) el.className = classes;
    if (text) el.textContent = text;
    return el;
}

function removeElement(el) {
    if (el && el.parentNode) {
        el.parentNode.removeChild(el);
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// Event utilities
function on(element, event, handler) {
    element.addEventListener(event, handler);
}

function off(element, event, handler) {
    element.removeEventListener(event, handler);
}

function once(element, event, handler) {
    function wrapper() {
        handler.apply(this, arguments);
        off(element, event, wrapper);
    }
    on(element, event, wrapper);
}

// HTTP utilities (unused but loaded)
function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(null, xhr.responseText);
        } else {
            callback(new Error('Request failed: ' + xhr.status));
        }
    };
    xhr.send();
}

function post(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            callback(new Error('Request failed: ' + xhr.status));
        }
    };
    xhr.send(JSON.stringify(data));
}

// Color utilities
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function(x) {
        return x.toString(16).padStart(2, '0');
    }).join('');
}

console.log('Utils loaded successfully');
