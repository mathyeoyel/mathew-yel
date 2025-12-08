// ============================================================================
// DEBUG CONSOLE HELPER - Header Layout Troubleshooting
// ============================================================================
// 
// HOW TO USE:
// 1. Add this to your HTML: <script src="/debug-header.js"></script>
// 2. Add class="debug-layout" to <body> tag
// 3. Open DevTools Console
// 4. View layout diagnostic information
// 
// ============================================================================

console.log("%c🔍 HEADER DEBUG HELPER LOADED", "color: lime; font-size: 16px; font-weight: bold;");
console.log("%cAdd 'debug-layout' class to <body> to visualize layout boxes", "color: yellow;");

// Check for misalignment issues on load
window.addEventListener('DOMContentLoaded', function() {
  if (document.body.classList.contains('debug-layout')) {
    const nav = document.querySelector('.site-nav');
    const logo = document.querySelector('.logo');
    const container = document.querySelector('.container.nav');
    
    if (nav && logo) {
      const navStyles = window.getComputedStyle(nav);
      const logoStyles = window.getComputedStyle(logo);
      const containerStyles = window.getComputedStyle(container);
      
      console.group("📊 Layout Debug Info");
      
      console.log("%cContainer Info:", "font-weight: bold; color: cyan;");
      console.log("  Display:", containerStyles.display);
      console.log("  Grid Template Columns:", containerStyles.gridTemplateColumns);
      console.log("  Gap:", containerStyles.gap);
      
      console.log("%cLogo Info:", "font-weight: bold; color: orange;");
      console.log("  Grid Column:", logoStyles.gridColumn);
      console.log("  Margin:", logoStyles.margin);
      console.log("  Padding:", logoStyles.padding);
      
      console.log("%cNav Info:", "font-weight: bold; color: cyan;");
      console.log("  Grid Column:", navStyles.gridColumn);
      console.log("  Justify Self:", navStyles.justifySelf);
      console.log("  Margin:", `${navStyles.marginTop} ${navStyles.marginRight} ${navStyles.marginBottom} ${navStyles.marginLeft}`);
      console.log("  Padding:", navStyles.padding);
      console.log("  Position:", navStyles.position);
      console.log("  Display:", navStyles.display);
      
      console.groupEnd();
      
      // Check for global nav a margin override
      if (navStyles.marginLeft !== '0px') {
        console.group("%c⚠️ WARNING: MISALIGNMENT DETECTED", "color: red; font-weight: bold; font-size: 14px;");
        console.log(".site-nav has non-zero margin-left:", navStyles.marginLeft);
        console.log("This is likely caused by global 'nav a {margin-left:18px}' selector!");
        console.log("Solution: Add margin: 0 !important to .site-nav");
        console.groupEnd();
      } else {
        console.log("%c✅ No margin issues detected", "color: green; font-weight: bold;");
      }
      
      // Check grid column assignment
      if (navStyles.gridColumn !== '3') {
        console.warn("⚠️ .site-nav is not in grid column 3!");
        console.warn("Current:", navStyles.gridColumn);
      }
      
      if (navStyles.justifySelf !== 'end') {
        console.warn("⚠️ .site-nav justify-self is not 'end'!");
        console.warn("Current:", navStyles.justifySelf);
      }
    } else {
      console.error("❌ Could not find .site-nav or .logo elements!");
    }
  }
});

// Create a global debug function
window.debugHeader = function() {
  const nav = document.querySelector('.site-nav');
  const logo = document.querySelector('.logo');
  const container = document.querySelector('.container.nav');
  const hamburger = document.querySelector('.nav-toggle');
  
  console.clear();
  console.log("%c🔍 MANUAL HEADER DEBUG", "color: lime; font-size: 18px; font-weight: bold;");
  console.log("");
  
  console.group("🎯 Element Bounding Boxes");
  console.log("Logo:", logo?.getBoundingClientRect());
  console.log("Nav:", nav?.getBoundingClientRect());
  console.log("Container:", container?.getBoundingClientRect());
  console.log("Hamburger:", hamburger?.getBoundingClientRect());
  console.groupEnd();
  
  console.group("🎨 Computed Styles");
  if (nav) {
    const styles = window.getComputedStyle(nav);
    console.table({
      'display': styles.display,
      'position': styles.position,
      'grid-column': styles.gridColumn,
      'justify-self': styles.justifySelf,
      'margin-left': styles.marginLeft,
      'margin-right': styles.marginRight,
      'padding-left': styles.paddingLeft,
      'padding-right': styles.paddingRight,
      'transform': styles.transform
    });
  }
  console.groupEnd();
  
  console.log("");
  console.log("%cRun window.debugHeader() anytime to see this info", "color: yellow;");
};

console.log("%cRun window.debugHeader() to see detailed layout info", "color: yellow;");
