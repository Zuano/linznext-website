// Renders the version page from neuigkeiten.json — the same file the apps and store texts use.
// Baut die Versionsseite aus neuigkeiten.json — derselben Datei, aus der App und Store-Texte kommen.
(function () {
    var root = document.getElementById('releases');
    if (!root) return;
    var lang = root.getAttribute('data-lang') === 'en' ? 'en' : 'de';
    var src = root.getAttribute('data-src');

    var T = {
        de: { version: 'Version', locale: 'de-AT', error: 'Die Neuigkeiten konnten gerade nicht geladen werden. Bitte später noch einmal versuchen.',
              all: 'Alle', apple: 'iPhone & Apple Watch', android: 'Android', none: 'Für diese Auswahl gibt es in dieser Version keine Neuerungen.',
              tags: { apple: 'iPhone', watch: 'Apple Watch', android: 'Android' } },
        en: { version: 'Version', locale: 'en-GB', error: 'The news could not be loaded right now. Please try again later.',
              all: 'All', apple: 'iPhone & Apple Watch', android: 'Android', none: 'No changes for this selection in this version.',
              tags: { apple: 'iPhone', watch: 'Apple Watch', android: 'Android' } }
    }[lang];

    // Which platform filter is active / Welcher Plattform-Filter aktiv ist
    var FILTERS = { all: null, apple: ['apple', 'watch'], android: ['android'] };
    var releases = [];
    var active = 'all';

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function formatDate(iso) {
        var parts = iso.split('-');
        var date = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2]));
        return date.toLocaleDateString(T.locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
    }

    function matches(point, filter) {
        if (!filter || !point.plattformen) return true;
        return point.plattformen.some(function (p) { return filter.indexOf(p) !== -1; });
    }

    function render() {
        root.innerHTML = '';
        var filter = FILTERS[active];
        releases.forEach(function (release) {
            var points = release.punkte.filter(function (p) { return matches(p, filter); });
            if (!points.length) return;

            var card = el('article', 'release');
            var head = el('div', 'release-head');
            head.appendChild(el('h2', 'release-version', T.version + ' ' + release.version));
            var time = el('time', 'release-date', formatDate(release.datum));
            time.setAttribute('datetime', release.datum);
            head.appendChild(time);
            card.appendChild(head);

            var list = el('ul', 'release-points');
            points.forEach(function (point) {
                var li = el('li');
                li.appendChild(el('span', 'point-text', point[lang]));
                (point.plattformen || []).forEach(function (p) {
                    li.appendChild(el('span', 'platform-tag', T.tags[p] || p));
                });
                list.appendChild(li);
            });
            card.appendChild(list);
            root.appendChild(card);
        });
        if (!root.children.length) root.appendChild(el('p', 'release-note', T.none));
    }

    function buildFilter() {
        var bar = document.getElementById('platform-filter');
        if (!bar) return;
        ['all', 'apple', 'android'].forEach(function (key) {
            var button = el('button', 'filter-chip', T[key]);
            button.type = 'button';
            button.setAttribute('aria-pressed', key === active ? 'true' : 'false');
            button.addEventListener('click', function () {
                active = key;
                Array.prototype.forEach.call(bar.children, function (b) { b.setAttribute('aria-pressed', 'false'); });
                button.setAttribute('aria-pressed', 'true');
                render();
            });
            bar.appendChild(button);
        });
    }

    fetch(src, { cache: 'no-cache' })
        .then(function (response) {
            if (!response.ok) throw new Error(response.status);
            return response.json();
        })
        .then(function (data) {
            releases = data.versionen || [];
            buildFilter();
            render();
        })
        .catch(function () {
            root.innerHTML = '';
            root.appendChild(el('p', 'release-note', T.error));
        });
})();
