/* ==========================================================================
   XMusic - style.css (обновленная версия)
   - Совместим с index.html из проекта (все id/class сохранены)
   - Включает: общие переменные, базовые стили, layout, sidebar, main,
     плеер (default и copy), модалки, creator-mode, admin, а также
     расширенный набор утилит и анимаций.
   - Файл преднамеренно детализирован, содержит множество вариаций и
     responsive правил для гибкой настройки. 
   ========================================================================== */

/* ==========================================================================
   Table of contents (sections)
   1.  :root variables
   2.  Reset / base
   3.  Utility classes (colors, spacing, typography)
   4.  Layout: app-container, sidebar, main
   5.  Header / Search
   6.  Sections, grids, cards
   7.  Player (default + copy)
   8.  Equalizer / visualizer
   9.  Modals
   10. Creator-mode and admin
   11. Forms / Upload UI
   12. Animations / keyframes
   13. Accessibility improvements
   14. Extensive responsive rules
   15. Large block of helper classes (margins/paddings/borders) for design system
   ========================================================================== */

/* ==========================================================================
   1. Root variables
   ========================================================================== */
:root {
  /* Brand */
  --brand-1: #9147FF;            /* primary purple */
  --brand-2: #00BFFF;            /* bright cyan */
  --brand-gradient-1: linear-gradient(135deg, #9147FF 0%, #00BFFF 100%);
  --brand-gradient-2: linear-gradient(135deg, rgba(145,71,255,0.18), rgba(0,191,255,0.08));
  --brand-accent: #FFD166;       /* accent for highlights */

  /* Dark background surfaces */
  --bg-900: #07060A;
  --bg-800: #0E0E10;
  --bg-700: #141418;
  --panel: rgba(20, 18, 25, 0.6);
  --glass-1: rgba(255,255,255,0.03);
  --glass-2: rgba(255,255,255,0.02);
  --glass-3: rgba(255,255,255,0.015);

  /* Light surfaces (creator mode) */
  --light-bg: #F4F6F9;
  --light-panel: #FFFFFF;
  --light-border: #E6E9EF;

  /* Text */
  --text-primary: #EDEEF2;
  --text-secondary: #AAB0B7;
  --text-muted: #8A9097;
  --muted-2: #6F757A;

  /* Borders and shadows */
  --border: rgba(255,255,255,0.06);
  --soft-border: rgba(255,255,255,0.03);
  --shadow-1: 0 6px 30px rgba(2,6,23,0.6);
  --shadow-2: 0 10px 40px rgba(2,6,23,0.65);

  /* Sizes */
  --sidebar-width: 240px;
  --sidebar-collapsed-width: 76px;
  --player-width-default: 380px;
  --player-height-default: 220px;
  --player-height-copy: 90px;

  /* Misc */
  --radius-1: 12px;
  --radius-2: 10px;
  --radius-3: 6px;
  --ui-opacity: 0.6;
  --blur-value: 8px;

  /* Accessibility */
  --focus-ring: 0 0 0 4px rgba(145,71,255,0.12);

  /* utility colors */
  --success: #4CAF50;
  --danger: #FF6B6B;
  --warning: #FFC107;
  --info: #2196F3;

  /* transition */
  --ease-fast: cubic-bezier(.2,.9,.2,1);
  --ease-medium: cubic-bezier(.22,.9,.3,1);

  /* font */
  --font-family: 'Inter', system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  --mono-font: "SFMono-Regular", Menlo, Monaco, "Roboto Mono", "Courier New", monospace;
}

/* ==========================================================================
   2. Reset / base
   ========================================================================== */
*,
*::before,
*::after {
  box-sizing: border-box;
}
html, body {
  height: 100%;
  background: var(--bg-900);
  color: var(--text-primary);
  font-family: var(--font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.38;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
img {
  max-width: 100%;
  display: block;
}
a {
  color: inherit;
  text-decoration: none;
}
button {
  font-family: inherit;
  -webkit-font-smoothing: inherit;
}
:focus {
  outline: none;
  box-shadow: var(--focus-ring);
  border-radius: 6px;
}

/* ==========================================================================
   3. Utilities (colors, typography snippets)
   ========================================================================== */
/* Typography */
.h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); }
.h2 { font-size: 22px; font-weight: 700; color: var(--text-primary); }
.h3 { font-size: 18px; font-weight: 600; color: var(--text-primary); }
.lead { font-size: 15px; color: var(--text-secondary); }

/* Helpers */
.hidden { display: none !important; }
.visually-hidden { position: absolute !important; height: 1px; width: 1px; overflow: hidden; clip: rect(1px,1px,1px,1px); white-space: nowrap; }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; border-radius: 8px; padding: 10px 14px; font-weight: 700; border: none; }
.btn-primary { background: var(--brand-1); color: #fff; box-shadow: 0 8px 24px rgba(145,71,255,0.18); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(145,71,255,0.22); }
.btn-ghost { background: transparent; border: 1px solid var(--soft-border); color: var(--text-primary); padding: 8px 12px; }
.icon-btn { background: transparent; border: none; padding: 8px; display: inline-flex; align-items: center; justify-content:center; border-radius: 8px; color: var(--text-secondary); }

/* Color utility */
.text-muted { color: var(--text-muted); }
.text-secondary { color: var(--text-secondary); }
.text-primary { color: var(--text-primary); }
.bg-panel { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid var(--soft-border); }

/* Flex */
.row { display: flex; gap: 12px; align-items: center; }
.col { display: flex; flex-direction: column; gap: 12px; }

/* Grid helper */
.grid {
  display: grid;
  gap: 16px;
}
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

/* ==========================================================================
   4. Layout: app-container, sidebar, main
   ========================================================================== */
.app-container {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  height: 100vh;
  gap: 0;
  align-items: stretch;
}

/* Sidebar */
.sidebar {
  background: linear-gradient(180deg, rgba(14,14,18,0.8), rgba(10,10,12,0.75));
  padding: 22px;
  border-right: 1px solid var(--border);
  backdrop-filter: blur(var(--blur-value));
  z-index: 30;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: var(--sidebar-width);
  transition: min-width 280ms var(--ease-fast), background-color 280ms var(--ease-fast), transform 280ms var(--ease-fast);
}
.sidebar.collapsed {
  min-width: var(--sidebar-collapsed-width);
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.logo {
  font-weight: 800;
  font-size: 1.6rem;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.logo-small {
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--text-secondary);
}
.sidebar .main-nav { display: flex; flex-direction: column; gap: 8px; margin-top: 18px; }
.nav-link {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  color: var(--text-secondary);
  font-weight: 600;
  transition: background 200ms var(--ease-fast), color 200ms var(--ease-fast), transform 200ms var(--ease-fast);
}
.nav-link:hover {
  background: rgba(255,255,255,0.02);
  color: var(--text-primary);
  transform: translateX(6px);
}
.nav-link.active {
  background: linear-gradient(90deg, rgba(145,71,255,0.14), rgba(0,191,255,0.06));
  color: var(--text-primary);
  box-shadow: 0 6px 18px rgba(145,71,255,0.06);
  border-left: 3px solid var(--brand-1);
  padding-left: 10px;
}

/* Sidebar footer */
.sidebar-footer {
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.user-profile {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.006));
  border: 1px solid var(--soft-border);
}
.user-info-container {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(180deg,#e06fff,#7cc2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #fff;
  font-size: 16px;
}

/* Main content area */
.main-content {
  padding: 20px 32px;
  overflow-y: auto;
  height: 100vh;
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005));
  transition: background 280ms var(--ease-fast);
}

/* ==========================================================================
   5. Header / Search
   ========================================================================== */
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.main-header h1 {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
}
.header-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}
.search-bar-wrapper {
  width: 420px;
  max-width: 54vw;
}
#searchInput {
  width: 100%;
  height: 44px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid var(--soft-border);
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.004));
  color: var(--text-primary);
  font-size: 14px;
  transition: box-shadow 180ms var(--ease-fast), border-color 180ms var(--ease-fast);
}
#searchInput:focus {
  border-color: rgba(145,71,255,0.35);
  box-shadow: 0 6px 24px rgba(145,71,255,0.06);
}

/* ==========================================================================
   6. Sections, grids, cards
   ========================================================================== */
.section {
  margin-bottom: 34px;
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 14px;
  color: var(--text-primary);
}
.scroll-container {
  display: flex;
  gap: 18px;
  overflow-x: auto;
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch;
}
.scroll-container::-webkit-scrollbar { height: 8px; }
.scroll-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius: 999px; }

.card {
  width: 180px;
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.006));
  border-radius: var(--radius-1);
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.02);
  transition: transform 160ms var(--ease-fast), box-shadow 160ms var(--ease-fast);
  cursor: pointer;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 30px rgba(7,6,10,0.45);
}
.card-image-wrapper { position: relative; }
.card-image {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
}
.card-title { font-weight: 700; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-artist { font-size: 13px; color: var(--text-secondary); }

/* featured card (hero) */
.featured-card {
  display: flex;
  gap: 22px;
  align-items: center;
  padding: 22px;
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border: 1px solid rgba(255,255,255,0.02);
  box-shadow: 0 10px 40px rgba(2,6,23,0.6);
}
.featured-card .card-image-wrapper { width: 200px; flex: 0 0 200px; height: 200px; }
.featured-card-info .card-title { font-size: 26px; font-weight: 800; color: var(--text-primary); }
.featured-card-info .featured-meta { color: var(--text-secondary); margin-bottom: 6px; }

/* collection / category cards */
.collection-card, .category-card {
  min-width: 180px;
  height: 160px;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 6px;
  background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.008));
  border: 1px solid rgba(255,255,255,0.02);
  cursor: pointer;
}
.collection-card:hover, .category-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(2,6,23,0.6);
}

/* ==========================================================================
   7. Player (default + copy)
   ========================================================================== */

/* Player base */
.player {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100;
  background: rgba(20,18,25,0.85);
  border-radius: 14px;
  padding: 18px;
  width: var(--player-width-default);
  height: var(--player-height-default);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-2);
  border: 1px solid var(--soft-border);
  transition: transform 200ms var(--ease-medium), background 200ms var(--ease-fast), right 220ms var(--ease-fast);
}
.player.creator-mode { background: var(--light-panel); border-color: var(--light-border); color: var(--bg-900); }

/* Player default style */
.player-style-default {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  align-items: center;
}
.player-header {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
}
.track-info { display: flex; align-items: center; gap: 12px; flex: 1; min-width: 0; }
.track-info img { width: 62px; height: 62px; border-radius: 8px; object-fit: cover; }
.track-info .title { font-weight: 700; font-size: 15px; color: var(--text-primary); }
.track-info .artist { font-size: 13px; color: var(--text-secondary); }

/* control buttons & progress */
.control-buttons-and-progress { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.control-buttons { display: flex; align-items: center; justify-content: center; gap: 16px; width: 100%; }
.control-btn, .play-button { background: transparent; border: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; padding: 8px; border-radius: 10px; }
.play-button { width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(180deg,var(--brand-1),#6f3de0); box-shadow: 0 10px 30px rgba(145,71,255,0.18); }
.play-button svg { width: 26px; height: 26px; fill: #fff; }

.progress-bar { display: flex; align-items: center; gap: 10px; width: 100%; }
.progress-bar span { color: var(--text-secondary); font-size: 12px; width: 42px; text-align: center; }
.progress-bar-container { position: relative; flex: 1; height: 8px; border-radius: 999px; background: rgba(255,255,255,0.03); cursor: pointer; }
.progress-track { position: absolute; left:0; right:0; top: 50%; transform: translateY(-50%); height: 6px; border-radius: 999px; background: rgba(255,255,255,0.04); }
.progress-filled { position: absolute; left: 0; top: 50%; transform: translateY(-50%); height: 6px; border-radius: 999px; width: 0; background: var(--brand-1); box-shadow: 0 6px 24px rgba(145,71,255,0.16); }
.progress-thumb { position: absolute; width: 14px; height: 14px; background: #fff; border-radius: 50%; left: 0; top: 50%; transform: translate(-50%,-50%); box-shadow: 0 6px 12px rgba(2,6,23,0.4); }

/* volume */
.volume-controls { display: flex; align-items: center; gap: 10px; margin-top: 6px; }
.volume-controls input[type="range"] { width: 120px; }

/* favorite button */
#favoritePlayerBtn { font-size: 18px; color: var(--text-secondary); background: transparent; border: none; cursor: pointer; }
#favoritePlayerBtn.favorited { color: #ff6b6b; transform: scale(1.06); }

/* Player copy (compact horizontal) */
.player.player--copy {
  left: 50%;
  transform: translateX(-50%);
  right: auto;
  width: 820px;
  height: var(--player-height-copy);
  padding: 10px;
  border-radius: 12px;
}
.player-style-copy { display: none; }
.player.player--copy .player-style-copy { display: flex; flex-direction: column; width: 100%; height: 100%; justify-content: space-between; }
.copy-player-body { display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: center; gap: 10px; width: 100%; padding: 0 16px; }
.copy-track-info { display: flex; gap: 12px; align-items: center; justify-self: start; }
#copyPlayerCover { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; }

/* copy main controls */
.copy-main-controls { display:flex; align-items:center; justify-content:center; gap: 12px; }
.copy-progress-bar-container { width: calc(100% - 48px); height: 4px; background: rgba(255,255,255,0.03); border-radius: 999px; margin: 0 24px; }
.copy-progress-filled { height: 100%; width: 0; background: var(--text-primary); border-radius: 999px; }

/* ==========================================================================
   8. Equalizer / visualizer
   ========================================================================== */
.equalizer { display: flex; align-items: flex-end; gap: 6px; height: 56px; }
.equalizer-bar {
  width: 6px;
  height: 10%;
  background: linear-gradient(180deg, var(--brand-1), #00bfff);
  border-radius: 3px;
  transition: height 120ms linear;
  transform-origin: bottom center;
}

/* Animation for idle pulse */
@keyframes equalizer-idle {
  0% { opacity: 0.8; transform: scaleY(0.85); }
  50% { opacity: 1; transform: scaleY(1.15); }
  100% { opacity: 0.8; transform: scaleY(0.85); }
}
.equalizer-bar.idle { animation: equalizer-idle 1.2s infinite ease-in-out; }

/* ==========================================================================
   9. Modals
   ========================================================================== */
.modal {
  display: none;
  position: fixed;
  z-index: 220;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(4,4,6,0.6);
  backdrop-filter: blur(6px);
  align-items: center;
  justify-content: center;
}
.modal .modal-content {
  width: 95%;
  max-width: 980px;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius: 12px;
  padding: 22px;
  border: 1px solid rgba(255,255,255,0.02);
  box-shadow: 0 20px 60px rgba(2,6,23,0.7);
  position: relative;
}
.modal .close-btn {
  position: absolute;
  top: 14px;
  right: 14px;
  background: transparent;
  border: none;
  font-size: 22px;
  color: var(--text-secondary);
  cursor: pointer;
}
.modal h2 { font-size: 20px; margin-bottom: 12px; }

/* Specialized small modal (login/register) */
.modal .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.modal input[type="text"], .modal input[type="password"], .modal input[type="email"], .modal select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.03);
  background: rgba(255,255,255,0.01);
  color: var(--text-primary);
}

/* Video modal specific */
.video-modal-content { width: min(1200px, 92%); max-height: 90vh; background: #000; padding: 8px; border-radius: 8px; }
#videoPlayerModal { width: 100%; height: auto; display: block; background: black; }

/* ==========================================================================
   10. Creator-mode and Admin
   ========================================================================== */
body.creator-mode {
  background: var(--light-bg);
  color: var(--bg-900);
}
.creator-mode .sidebar { background: var(--light-panel); border-right: 1px solid var(--light-border); color: var(--bg-900); }
.creator-mode .main-content { background: var(--light-bg); color: var(--bg-900); }
.creator-mode .card { background: var(--light-panel); border: 1px solid var(--light-border); box-shadow: none; }
.creator-mode .player { background: var(--light-panel); color: var(--bg-900); border: 1px solid var(--light-border); box-shadow: 0 8px 20px rgba(0,0,0,0.06); }

/* admin cards */
.admin-card { background: linear-gradient(180deg,#fff,#fff); border-radius: 10px; padding: 16px; border: 1px solid var(--light-border); box-shadow: 0 6px 20px rgba(2,6,23,0.04); }
.admin-card h3 { font-weight: 700; color: var(--bg-900); }

/* ==========================================================================
   11. Forms / Upload UI
   ========================================================================== */
.upload-modal-container { max-width: 980px; width: 100%; }
.upload-area { display:flex; gap:18px; }
.upload-box { flex: 1; min-height: 160px; display:flex; align-items:center; justify-content:center; border-radius: 12px; border: 2px dashed rgba(255,255,255,0.03); padding: 12px; cursor: pointer; background: rgba(255,255,255,0.01); }
.upload-box.dragover { border-color: rgba(145,71,255,0.28); background: rgba(145,71,255,0.02); box-shadow: 0 8px 32px rgba(145,71,255,0.04); }
.cover-preview { width: 100%; height: 100%; object-fit: cover; border-radius: 10px; }
.upload-progress-fill { height: 100%; width: 0; background: linear-gradient(90deg,var(--brand-1),#ffb86b); border-radius: 6px; transition: width 280ms var(--ease-medium); }

/* ==========================================================================
   12. Animations / keyframes
   ========================================================================== */
@keyframes float-up { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); } 100% { transform: scale(1); } }
@keyframes pop-in { 0% { opacity: 0; transform: scale(.96);} 100% { opacity:1; transform: scale(1);} }

/* subtle hover micro interactions */
.card:hover { animation: float-up 420ms ease-in-out; }

/* notification badge */
.badge {
  display:inline-flex; align-items:center; justify-content:center; min-width:24px; height:24px; border-radius:999px; padding: 0 8px; background: var(--danger); color: #fff; font-weight:700; font-size:12px;
}

/* ==========================================================================
   13. Accessibility improvements
   ========================================================================== */
[role="button"] { cursor: pointer; }
[aria-hidden="true"] { pointer-events: none; opacity: 0.001; }
:focus-visible { box-shadow: var(--focus-ring); outline: none; }

/* ==========================================================================
   14. Responsive rules
   ========================================================================== */
@media (max-width: 1100px) {
  .app-container { grid-template-columns: var(--sidebar-collapsed-width) 1fr; }
  .sidebar { min-width: var(--sidebar-collapsed-width); padding: 12px; }
  .main-content { padding: 16px; }
  #searchInput { width: 320px; max-width: 40vw; }
  .player { right: 12px; left: 12px; width: auto; bottom: 12px; }
  .featured-card { flex-direction: column; gap: 12px; align-items: flex-start; }
}
@media (max-width: 760px) {
  .app-container { grid-template-columns: 1fr; }
  .sidebar { position: fixed; left: 0; top: 0; bottom: 0; height: 100vh; transform: translateX(-110%); transition: transform 280ms var(--ease-fast); z-index: 200; }
  .sidebar.open { transform: translateX(0); }
  .main-content { margin-left: 0; padding: 16px; height: calc(100vh - 70px); }
  .scroll-container { gap: 12px; }
  .card { width: 46vw; }
  #searchInput { width: 100%; }
  .player { left: 50%; transform: translateX(-50%); width: calc(100% - 32px); right: auto; padding: 12px; }
}

/* ==========================================================================
   15. Helper classes: spacing, borders, text utilities (extended)
   - The following block includes a large set of utilities for margins/paddings
     and other tiny helpers to reach design-system coverage.
   ========================================================================== */

/* Margin utilities (m-0 .. m-64) */
.m-0{margin:0 !important}.m-2{margin:2px !important}.m-4{margin:4px !important}.m-6{margin:6px !important}
.m-8{margin:8px !important}.m-10{margin:10px !important}.m-12{margin:12px !important}.m-14{margin:14px !important}
.m-16{margin:16px !important}.m-18{margin:18px !important}.m-20{margin:20px !important}.m-24{margin:24px !important}
.m-28{margin:28px !important}.m-32{margin:32px !important}.m-36{margin:36px !important}.m-40{margin:40px !important}
.m-48{margin:48px !important}.m-56{margin:56px !important}.m-64{margin:64px !important}

/* Margin axis */
.mt-0{margin-top:0 !important}.mt-4{margin-top:4px !important}.mt-8{margin-top:8px !important}.mt-12{margin-top:12px !important}
.mb-0{margin-bottom:0 !important}.mb-4{margin-bottom:4px !important}.mb-8{margin-bottom:8px !important}.mb-12{margin-bottom:12px !important}
.ml-0{margin-left:0 !important}.ml-8{margin-left:8px !important}.ml-16{margin-left:16px !important}
.mr-0{margin-right:0 !important}.mr-8{margin-right:8px !important}.mr-16{margin-right:16px !important}

/* Padding utilities (p-0 .. p-64) */
.p-0{padding:0 !important}.p-2{padding:2px !important}.p-4{padding:4px !important}.p-8{padding:8px !important}
.p-12{padding:12px !important}.p-16{padding:16px !important}.p-20{padding:20px !important}.p-24{padding:24px !important}
.px-4{padding-left:4px !important;padding-right:4px !important}.py-6{padding-top:6px !important;padding-bottom:6px !important}

/* Text align */
.ta-left{text-align:left}.ta-center{text-align:center}.ta-right{text-align:right}

/* Display */
.d-block{display:block}.d-inline{display:inline}.d-inline-flex{display:inline-flex}.d-flex{display:flex}

/* Border radius utilities */
.rounded{border-radius:var(--radius-1)}.rounded-sm{border-radius:8px}.rounded-lg{border-radius:16px}.rounded-full{border-radius:9999px}

/* Width / height helpers */
.w-100{width:100%}.h-100{height:100%}.w-auto{width:auto}.h-auto{height:auto}
.w-80{width:80%}.w-60{width:60%}.w-40{width:40%}

/* Text helpers */
.text-ellipsis{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.uppercase{text-transform:uppercase}.lowercase{text-transform:lowercase}.capitalize{text-transform:capitalize}

/* Flex helpers */
.flex-center{display:flex;align-items:center;justify-content:center}
.flex-between{display:flex;align-items:center;justify-content:space-between}

/* z-index helpers */
.z-0{z-index:0}.z-10{z-index:10}.z-20{z-index:20}.z-30{z-index:30}.z-40{z-index:40}.z-50{z-index:50}

/* Borders */
.border { border: 1px solid var(--soft-border); }
.border-top { border-top: 1px solid var(--soft-border); }
.border-bottom { border-bottom: 1px solid var(--soft-border); }

/* ==========================================================================
   16. Extensive component variants (many lines to let you tune styles)
   - Below are multiple visual variants for cards, collections and player
     states. They are intentionally verbose to allow picking a look.
   ========================================================================== */

/* Card visual variants */
.card-variant-1 { background: linear-gradient(180deg, rgba(145,71,255,0.04), rgba(0,191,255,0.02)); border: 1px solid rgba(145,71,255,0.06); }
.card-variant-2 { background: linear-gradient(180deg, rgba(0,191,255,0.03), rgba(145,71,255,0.01)); border: 1px solid rgba(0,191,255,0.04); }
.card-variant-3 { background: linear-gradient(180deg, rgba(255,209,102,0.03), rgba(255,209,102,0.01)); border: 1px solid rgba(255,209,102,0.03); }
.card-variant-4 { background: linear-gradient(180deg, rgba(76,182,255,0.02), rgba(76,182,255,0.01)); border: 1px solid rgba(76,182,255,0.03); }
.card-variant-5 { background: linear-gradient(180deg, rgba(255,107,107,0.02), rgba(255,107,107,0.01)); border: 1px solid rgba(255,107,107,0.03); }

/* Collection variants */
.collection-variant-1 { background-image: url('/fon/collection-1.jpg'); background-size: cover; color: #fff; }
.collection-variant-2 { background-image: linear-gradient(135deg, rgba(145,71,255,0.26), rgba(0,191,255,0.12)); color: #fff; }

/* Player visual states */
.player-state-playing { box-shadow: 0 14px 44px rgba(145,71,255,0.18); transform: translateY(-2px); }
.player-state-paused { opacity: 0.96; transform: translateY(0); }

/* Progress color themes */
.progress-theme-1 .progress-filled { background: linear-gradient(90deg,var(--brand-1),#ffb86b); }
.progress-theme-2 .progress-filled { background: linear-gradient(90deg,#00bfff,#6fffe9); }

/* ==========================================================================
   17. Long list of micro utilities for spacing and layout (repeated)
   - This large block gives many fine-grained classes for quick composition.
   ========================================================================== */

/* micro-gap x1..x30 for components */
.gap-2{gap:2px}.gap-4{gap:4px}.gap-6{gap:6px}.gap-8{gap:8px}.gap-10{gap:10px}
.gap-12{gap:12px}.gap-14{gap:14px}.gap-16{gap:16px}.gap-18{gap:18px}.gap-20{gap:20px}
.gap-22{gap:22px}.gap-24{gap:24px}.gap-26{gap:26px}.gap-28{gap:28px}.gap-30{gap:30px}

/* tiny width helpers (for icons, badges) */
.w-6{width:6px}.w-8{width:8px}.w-10{width:10px}.w-12{width:12px}.w-14{width:14px}.w-16{width:16px}
.h-6{height:6px}.h-8{height:8px}.h-10{height:10px}.h-12{height:12px}.h-14{height:14px}.h-16{height:16px}

/* ==========================================================================
   18. Extra: "theme" classes and color swatches for quick tuning
   ========================================================================== */
.theme-dark { --bg-900: #07060A; --text-primary: #EDEEF2; --panel: rgba(18,16,22,0.6); }
.theme-light { --bg-900: #F7F8FA; --text-primary: #111827; --panel: rgba(255,255,255,0.9); }

/* quick colored backgrounds */
.bg-brand { background: var(--brand-gradient-1); color: white; }
.bg-cyan { background: #00BFFF; color: white; }
.bg-soft { background: rgba(255,255,255,0.02); }

/* ==========================================================================
   19. Large fallback / compatibility block
   - vendor prefixes and fallbacks for older browsers
   ========================================================================== */

@supports (-webkit-backdrop-filter: none) or (backdrop-filter: blur(0px)) {
  .sidebar, .main-content, .player { -webkit-backdrop-filter: blur(var(--blur-value)); backdrop-filter: blur(var(--blur-value)); }
}
@media (prefers-reduced-motion: reduce) {
  .card, .player, .equalizer-bar, .featured-card { transition: none !important; animation: none !important; }
}

/* ==========================================================================
   20. Debugging helpers (only used in dev; remove or hide in production)
   ========================================================================== */
.debug-outline * { outline: 1px dashed rgba(255,0,0,0.06); }

/* ==========================================================================
   END OF FILE
   ========================================================================== */

/* ==========================================================================
   NOTE:
   - Этот файл даёт широкую базу стилей и множество вспомогательных классов.
   - Если нужно, могу:
     1) Сжать/минифицировать файл для production.
     2) Удалить лишние утилиты, чтобы сократить размер.
     3) Подправить конкретные элементы (например, обложки треков, модалки или
        анимацию equalizer) — пришлите пожелания, и я внесу правки.
   ========================================================================== */