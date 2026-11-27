/* KD-404 // GOATCOUNTER NETWORK ACTIVITY */
(() => {
  'use strict';

  const shell = document.querySelector('.site-shell');
  const footer = shell && shell.querySelector('.site-footer');
  if (!shell || !footer || document.getElementById('kd-network-app')) return;

  const root = document.createElement('section');
  root.id = 'kd-network-app';
  root.className = 'kd-network-app';
  root.setAttribute('aria-label', 'Network activity');
  root.innerHTML =
    '<article class="kd-mini-card kd-network-card">' +
      '<header class="kd-mini-head">' +
        '<div><small>NETWORK ACTIVITY // SITE TELEMETRY</small>' +
        '<h2>VISITS RECEIVED</h2>' +
        '<p>PUBLIC TRAFFIC RECORD // KD-404</p></div>' +
        '<span class="kd-network-status" id="kd-network-status" role="status" aria-live="polite">● CONNECTING</span>' +
      '</header>' +
      '<div class="kd-network-content">' +
        '<div><span class="kd-network-count-label">TOTAL REGISTERED VISITS</span>' +
        '<strong class="kd-network-count" id="kd-network-count" aria-live="polite">—</strong></div>' +
        '<p class="kd-network-detail">A cumulative visit count for this site. Tracking starts when GoatCounter is connected.</p>' +
      '</div>' +
      '<footer class="kd-network-foot"><span>STASIS CITY NETWORK // KD-404</span>' +
        '<strong>COUNTING SINCE ACTIVATION</strong></footer>' +
    '</article>';

  footer.before(root);

  const countNode = root.querySelector('#kd-network-count');
  const statusNode = root.querySelector('#kd-network-status');
  const endpoint = 'https://knivesdevilish.goatcounter.com/counter/TOTAL.json';

  const loadPublicCount = async () => {
    try {
      const response = await fetch(endpoint, { mode: 'cors', cache: 'no-store' });
      if (!response.ok) throw new Error('Public counter unavailable');

      const data = await response.json();
      const count = typeof data.count === 'string' ? data.count : '';

      if (!count) throw new Error('No public count returned');

      countNode.textContent = count;
      statusNode.textContent = '● COUNTER ONLINE';
      root.dataset.state = 'online';
    } catch (error) {
      countNode.textContent = '—';
      statusNode.textContent = '● PUBLIC COUNT OFF';
      root.dataset.state = 'unavailable';
    }
  };

  const tracker = document.createElement('script');
  tracker.async = true;
  tracker.src = 'https://gc.zgo.at/count.js';
  tracker.setAttribute('data-goatcounter', 'https://knivesdevilish.goatcounter.com/count');
  tracker.addEventListener('load', () => {
    statusNode.textContent = '● TRACKING ONLINE';
    loadPublicCount();
  });
  tracker.addEventListener('error', () => {
    statusNode.textContent = '● TRACKER BLOCKED';
    loadPublicCount();
  });
  document.head.appendChild(tracker);
})();
