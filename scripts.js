// Theme toggle + simple data rendering
(() => {
  const root = document.documentElement;
  const key = 'theme';
  const saved = localStorage.getItem(key);
  if (saved) root.classList.toggle('light', saved === 'light');

  document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'themeToggle' || e.target.id === 'themeToggleMobile')) {
      const isLight = root.classList.toggle('light');
      localStorage.setItem(key, isLight ? 'light' : 'dark');
    }
  });

  // Render projects from JSON if #projectGrid exists
  const grid = document.getElementById('projectGrid');
  if (grid) {
    fetch('/data/projects.json')
      .then(r => r.json())
      .then(items => {
        grid.innerHTML = items.map(p => `
          <article class="project card">
            <h3>${p.title}</h3>
            <p>${p.summary}</p>
            <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join('')}</ul>
            ${p.link ? `<a class="link" href="${p.link}" target="_blank" rel="noopener">Open <i class="fas fa-external-link-alt"></i></a>` : ''}
          </article>
        `).join('');
      }).catch(() => grid.innerHTML = '<p>Could not load projects.</p>');
  }

  // Render posts from JSON if #postList exists
  const list = document.getElementById('postList');
  if (list) {
    fetch('/data/posts.json')
      .then(r => r.json())
      .then(items => {
        list.innerHTML = items.map(p => `
          <div class="item">
            <h3><a href="${p.url}">${p.title}</a></h3>
            <p class="sub">${p.excerpt}</p>
            <small>${p.date}</small>
          </div>
        `).join('');
      }).catch(() => list.innerHTML = '<p>Could not load posts.</p>');
  }
})();