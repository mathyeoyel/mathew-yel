// Dynamic content loading system + Theme toggle
(() => {
  const root = document.documentElement;
  const key = 'theme';
  const saved = localStorage.getItem(key);
  if (saved) root.classList.toggle('light', saved === 'light');

  // Theme toggle functionality
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = root.classList.toggle('light');
      localStorage.setItem(key, isLight ? 'light' : 'dark');
    });
  }

  // Mobile navigation toggle
  const hamburger = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-links');
  
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
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

    // Close menu when clicking nav links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('show');
      });
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
    fetch('/data/blogs.json')
      .then(r => r.json())
      .then(items => {
        // Filter only published blogs
        const publishedBlogs = items.filter(item => item.status === 'published' || item.published === true);
        
        if (publishedBlogs.length === 0) {
          postList.innerHTML = '<div class="item"><p class="sub">No blog posts available yet. Check back soon!</p></div>';
          return;
        }

        // Sort blogs by date (newest first)
        publishedBlogs.sort((a, b) => new Date(b.date) - new Date(a.date));

        postList.innerHTML = publishedBlogs.map(p => `
          <article class="blog-post item">
            ${p.image ? `<div class="post-image">
              <img src="${p.image}" alt="${p.title}" loading="lazy">
            </div>` : ''}
            <div class="post-content">
              <h3><a href="${p.slug ? `/blog/post.html?slug=${p.slug}` : '#'}">${p.title}</a></h3>
              <p class="sub">${p.excerpt}</p>
              ${p.content ? `<div class="post-preview">${p.content.substring(0, 200)}${p.content.length > 200 ? '...' : ''}</div>` : ''}
              <div class="post-meta">
                <time datetime="${p.date}">${new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                ${p.category ? `<span class="category">${p.category}</span>` : ''}
                ${p.readingTime ? `<span class="reading-time">${p.readingTime} min read</span>` : ''}
                ${p.tags && p.tags.length > 0 ? `<div class="tags">${p.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
              </div>
              ${p.slug ? `<a class="read-more" href="/blog/post.html?slug=${p.slug}">Read more <i class="fas fa-arrow-right"></i></a>` : ''}
            </div>
          </article>
        `).join('');
      })
      .catch(() => {
        // Fallback to posts.json if blogs.json doesn't exist
        fetch('/data/posts.json')
          .then(r => r.json())
          .then(items => {
            if (items.length === 0) {
              postList.innerHTML = '<div class="item"><p class="sub">No blog posts available yet. Check back soon!</p></div>';
              return;
            }

            postList.innerHTML = items.map(p => `
              <article class="blog-post item">
                ${p.image ? `<div class="post-image">
                  <img src="${p.image}" alt="${p.title}" loading="lazy">
                </div>` : ''}
                <div class="post-content">
                  <h3><a href="${p.slug ? `/blog/post.html?slug=${p.slug}` : '#'}">${p.title}</a></h3>
                  <p class="sub">${p.excerpt}</p>
                  ${p.content ? `<div class="post-preview">${p.content.substring(0, 200)}${p.content.length > 200 ? '...' : ''}</div>` : ''}
                  <div class="post-meta">
                    <time datetime="${p.date}">${new Date(p.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    ${p.category ? `<span class="category">${p.category}</span>` : ''}
                    ${p.tags && p.tags.length > 0 ? `<div class="tags">${p.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                  </div>
                  ${p.slug ? `<a class="read-more" href="/blog/post.html?slug=${p.slug}">Read more <i class="fas fa-arrow-right"></i></a>` : ''}
                </div>
              </article>
            `).join('');
          })
          .catch(() => postList.innerHTML = '<p>Could not load blog posts.</p>');
      });
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

  // Dynamic Hero Section Renderer
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    Promise.all([
      fetch('/data/personal.json').then(r => r.json()),
      fetch('/data/social.json').then(r => r.json()),
      fetch('/data/projects.json').then(r => r.json())
    ])
    .then(([personalData, socialData, projectsData]) => {
      // Update hero text content
      if (personalData.hero) {
        const heroH1 = heroSection.querySelector('.hero-text h1');
        const heroSubtitle = heroSection.querySelector('.hero-subtitle');
        const heroDescription = heroSection.querySelector('.hero-description');
        
        if (heroH1 && personalData.hero.name) {
          heroH1.innerHTML = `Hi, I'm <span class="accent">${personalData.hero.name}</span>.`;
        }
        
        if (heroSubtitle && personalData.hero.title) {
          // Use the title directly for the subtitle
          heroSubtitle.textContent = personalData.hero.title.split('•')[0].trim() + '.';
        }
        
        if (heroDescription && personalData.hero.description) {
          heroDescription.textContent = personalData.hero.description;
        }
        
        // Update CTA buttons
        if (personalData.hero.cta) {
          const primaryBtn = heroSection.querySelector('.btn-hero-primary');
          const secondaryBtn = heroSection.querySelector('.btn-hero-secondary');
          
          if (primaryBtn && personalData.hero.cta.primary) {
            primaryBtn.textContent = personalData.hero.cta.primary.text;
            primaryBtn.href = personalData.hero.cta.primary.link;
          }
          
          if (secondaryBtn && personalData.hero.cta.secondary) {
            secondaryBtn.textContent = personalData.hero.cta.secondary.text;
            secondaryBtn.href = personalData.hero.cta.secondary.link;
          }
        }
        
        // Update hero info (location, university, languages)
        if (personalData.hero.quickInfo) {
          const heroInfo = heroSection.querySelector('.hero-info');
          if (heroInfo) {
            heroInfo.innerHTML = personalData.hero.quickInfo.map(info => 
              `<p><i class="${info.icon}"></i> ${info.text}</p>`
            ).join('');
          }
        }
        
        // Update hero image
        if (personalData.hero.image) {
          const heroPicture = heroSection.querySelector('.hero-image');
          const heroImg = heroSection.querySelector('.hero-image-wrapper img');
          
          if (heroPicture && heroImg) {
            // Clear all source elements so browser uses img src directly
            const sources = heroPicture.querySelectorAll('source');
            sources.forEach(source => {
              source.srcset = personalData.hero.image;
            });
            
            // Update img element
            heroImg.src = personalData.hero.image;
            heroImg.alt = personalData.hero.name + ' - ' + personalData.hero.title;
          }
        }
      }
      
      // Fallback: Update hero links with social data if not in personal.json
      const portfolioLink = heroSection.querySelector('a[href*="yelosegraphics"]');
      const linkedinLink = heroSection.querySelector('a[href*="linkedin"]');
      
      if (portfolioLink && socialData.portfolio) {
        portfolioLink.href = socialData.portfolio;
      }
      
      if (linkedinLink && socialData.linkedin) {
        linkedinLink.href = socialData.linkedin;
      }
    })
    .catch(error => {
      console.error('Error loading hero section:', error);
    });
  }
})();