// Shared bottom navigation, injected into every page.
// Highlights the current page automatically based on the filename.

const NAV_ITEMS = [
    {
        page: 'index.html',
        label: 'Home',
        svg: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>',
    },
{
        page: 'about.html',
        label: 'About',
        svg: '<svg width="20" height="20" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>',
    },
    {
        page: 'experience.html',
        label: 'Experience',
        svg: '<svg width="20" height="20" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM9 13a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"/></svg>',
    },
    {
        page: 'blog.html',
        label: 'Blog',
        svg: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M2 4a2 2 0 012-2h3.5a1 1 0 01.8.4l1.4 1.8a1 1 0 00.8.4H16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"/><path d="M7 9l-1.5 1L7 11M13 9l1.5 1L13 11" stroke="currentcolor" stroke-width="1.2" fill="none"/></svg>',
    },
    {
        page: 'contact.html',
        label: 'Contact',
        svg: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>',
    },
];

function currentPage() {
    const path = window.location.pathname;
    const file = path.substring(path.lastIndexOf('/') + 1);
    return file === '' ? 'index.html' : file;
}

function buildNav() {
    const active = currentPage();
    const nav = document.createElement('div');
    nav.className = 'bottom-nav';

    nav.innerHTML = NAV_ITEMS.map(item => {
        const cls = item.page === active ? 'nav-btn-active' : 'nav-btn';
        return `
            <div class="${cls}">
                <a href="${item.page}" class="nav-link"><span class="nav-link-hidden">${item.label}</span></a>
                ${item.svg}
                <span class="nav-label">${item.label}</span>
            </div>`;
    }).join('');

    document.body.appendChild(nav);
}

document.addEventListener('DOMContentLoaded', buildNav);






(function () {
    // Top-to-bottom order of your pages. Edit to match your nav.
    var ORDER = ['index', 'about', 'experience', 'campus', 'blog', 'contact'];
    var DURATION = 450;
    var SHIFT = '40vh'; // how far the page slides vertically

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function pageName(path) {
        var file = path.split('/').pop().replace('.html', '');
        return file === '' ? 'index' : file;
    }

    // Everything in <body> that moves: skip scripts and fixed elements (the nav)
    function movers() {
        return Array.prototype.filter.call(document.body.children, function (el) {
            if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return false;
            return getComputedStyle(el).position !== 'fixed';
        });
    }

    function slide(els, from, to, done) {
        var last;
        els.forEach(function (el) {
            last = el.animate(
                [
                    { transform: 'translateY(' + from + ')', opacity: from === '0px' ? 1 : 0 },
                    { transform: 'translateY(' + to + ')', opacity: to === '0px' ? 1 : 0 }
                ],
                { duration: DURATION, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' }
            );
        });
        if (last && done) last.onfinish = done;
        else if (done) done();
    }

    // Slide IN on arrival
    document.addEventListener('DOMContentLoaded', function () {
        var dir = sessionStorage.getItem('slideDir');
        sessionStorage.removeItem('slideDir');
        if (!dir) return;
        document.documentElement.style.overflowY = 'hidden';
        // Going down the nav: new page rises up from below. Going up: drops in from above.
        slide(movers(), dir === '1' ? SHIFT : '-' + SHIFT, '0px', function () {
            document.documentElement.style.overflowY = '';
        });
    });

    // Slide OUT on click
    document.addEventListener('click', function (e) {
        var a = e.target.closest('a[href]');
        if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        if (a.target === '_blank' || a.origin !== location.origin) return;
        if (!/\.html$|\/$/.test(a.pathname)) return;

        var from = ORDER.indexOf(pageName(location.pathname));
        var to = ORDER.indexOf(pageName(a.pathname));
        if (to === -1 || from === to) return;

        e.preventDefault();
        var dir = to > from ? 1 : -1; // 1 = going down the nav
        sessionStorage.setItem('slideDir', String(dir));
        document.documentElement.style.overflowY = 'hidden';
        // Going down: current page moves up and out. Going up: moves down and out.
        slide(movers(), '0px', (dir === 1 ? '-' : '') + SHIFT, function () {
            window.location.href = a.href;
        });
    });

    // Back/forward cache: reset if the browser restores a slid-out page
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) location.reload();
    });
})();