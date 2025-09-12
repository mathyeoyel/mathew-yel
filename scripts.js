// Dynamic content loading system + Theme toggle
(() => {
  const root = document.documentElement;
  const key = 'theme';
  const saved = localStorage.getItem(key);
  if (saved) root.classList.toggle('light', saved === 'light');

  // Theme toggle functionality
  document.addEventListener('click', (e) => {
    if (e.target && (e.target.id === 'themeToggle' || e.target.id === 'themeToggleMobile')) {
      const isLight = root.classList.toggle('light');
      localStorage.setItem(key, isLight ? 'light' : 'dark');
    }
  });

  // Mobile navigation toggle
  const hamburger = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('show');
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('show');
      }
    });
  }

  // Dynamic Gallery Renderer
  const galleryContainer = document.getElementById('dynamicGallery');
  if (galleryContainer) {
    fetch('/data/gallery.json')
      .then(r => r.json())
      .then(data => {
        const section = document.createElement('section');
        section.id = 'gallery';
        section.className = 'container';
        
        section.innerHTML = `
          <h2>${data.title}</h2>
          <p class="sub">${data.subtitle}</p>
          <div class="photo-grid">
            ${data.items.map(item => `
              <div class="photo-item ${item.featured ? 'featured' : ''}">
                <picture>
                  <source srcset="${item.image}" type="image/jpeg">
                  <img src="${item.image}" alt="${item.alt}" loading="lazy">
                </picture>
                <div class="photo-caption">
                  <h4>${item.title}</h4>
                  <p>${item.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        `;
        
        galleryContainer.appendChild(section);
      })
      .catch(() => {
        galleryContainer.innerHTML = '<p>Could not load gallery.</p>';
      });
  }

  // Dynamic Awards Timeline Renderer
  const awardsContainer = document.getElementById('dynamicAwards');
  if (awardsContainer) {
    fetch('/data/awards.json')
      .then(r => r.json())
      .then(data => {
        const section = document.createElement('section');
        section.id = 'awards';
        section.className = 'container';
        
        section.innerHTML = `
          <h2>${data.title}</h2>
          <ul class="timeline">
            ${data.items.map(item => `
              <li>
                <div class="time">${item.year}</div>
                <div class="dot"></div>
                <div class="desc">
                  <strong>${item.title}</strong>, ${item.description}
                  ${item.link ? `<br><a href="${item.link}" target="_blank" rel="noopener">Learn more <i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
              </li>
            `).join('')}
          </ul>
        `;
        
        awardsContainer.appendChild(section);
      })
      .catch(() => {
        awardsContainer.innerHTML = '<p>Could not load awards.</p>';
      });
  }

  // Enhanced Projects Renderer
  const projectGrid = document.getElementById('projectGrid');
  if (projectGrid) {
    fetch('/data/projects.json')
      .then(r => r.json())
      .then(data => {
        // Update page title and subtitle if they exist
        const pageTitle = document.querySelector('h1, .page-title');
        const pageSubtitle = document.querySelector('.page-subtitle, .sub');
        
        if (pageTitle) pageTitle.textContent = data.title;
        if (pageSubtitle) pageSubtitle.textContent = data.subtitle;

        projectGrid.innerHTML = data.items.map(p => `
          <article class="project card ${p.featured ? 'featured' : ''}">
            ${p.image ? `<div class="project-image">
              <img src="${p.image}" alt="${p.title}" loading="lazy">
            </div>` : ''}
            <div class="project-content">
              <h3>${p.title}</h3>
              <p>${p.summary}</p>
              ${p.description ? `<p class="project-description">${p.description}</p>` : ''}
              <ul class="tags">${p.tags.map(t => `<li>${t}</li>`).join('')}</ul>
              <div class="project-meta">
                ${p.role ? `<span class="role">Role: ${p.role}</span>` : ''}
                ${p.status ? `<span class="status status-${p.status}">${p.status}</span>` : ''}
              </div>
              ${p.link && p.link !== '#' ? `<a class="link" href="${p.link}" target="_blank" rel="noopener">Open <i class="fas fa-external-link-alt"></i></a>` : ''}
            </div>
          </article>
        `).join('');
      })
      .catch(() => projectGrid.innerHTML = '<p>Could not load projects.</p>');
  }

  // Enhanced Posts Renderer
  const postList = document.getElementById('postList');
  if (postList) {
    fetch('/data/posts.json')
      .then(r => r.json())
      .then(items => {
        postList.innerHTML = items.map(p => `
          <div class="item">
            <h3><a href="${p.url}">${p.title}</a></h3>
            <p class="sub">${p.excerpt}</p>
            <div class="post-meta">
              <small>${p.date}</small>
              ${p.category ? `<span class="category">${p.category}</span>` : ''}
            </div>
          </div>
        `).join('');
      })
      .catch(() => postList.innerHTML = '<p>Could not load posts.</p>');
  }

  // Dynamic Skills Renderer (if skills section exists)
  const skillsContainer = document.getElementById('dynamicSkills');
  if (skillsContainer) {
    fetch('/data/skills.json')
      .then(r => r.json())
      .then(data => {
        const section = document.createElement('section');
        section.id = 'skills';
        section.className = 'container';
        
        section.innerHTML = `
          <h2>${data.title}</h2>
          <div class="skills-grid">
            ${data.categories.map(category => `
              <div class="skill-category">
                <h3>${category.name}</h3>
                <div class="skills-list">
                  ${category.skills.map(skill => `
                    <div class="skill-item">
                      <div class="skill-header">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level skill-level-${skill.level}">${skill.level}</span>
                      </div>
                      <p class="skill-description">${skill.description}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        `;
        
        skillsContainer.appendChild(section);
      })
      .catch(() => {
        skillsContainer.innerHTML = '<p>Could not load skills.</p>';
      });
  }
})();