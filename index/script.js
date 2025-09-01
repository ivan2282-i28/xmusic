document.addEventListener('DOMContentLoaded', () => {
    const api = '';
    let allMedia = [];
    let myTracks = [];
    let moderationTracks = [];
    let currentTrackIndex = -1;
    let isDragging = false;
    let currentUser = null;
    let userFavorites = [];
    let repeatMode = false;
    const audioPlayer = new Audio();
    const videoPlayer = document.getElementById('backgroundVideo');
    let activeMediaElement = audioPlayer;
    let currentPlaylist = [];

    // --- Paging variables ---
    let currentPage = 1;
    const tracksPerPage = 30;
    let isLoading = false;
    let currentCategoryId = null;
    let myTracksCurrentPage = 1;
    let myTracksIsLoading = false;
    let searchCurrentPage = 1;
    let searchIsLoading = false;
    let currentSearchQuery = '';
    let searchTimeout;

    // --- Visualizer variables ---
    let audioContext;
    let analyser;
    let dataArray;
    let animationFrameId;
    let visualizerInitialized = false;

    // --- LocalStorage Keys ---
    const ACCESS_TOKEN_KEY = "access_token";
    const REFRESH_TOKEN_KEY = "refresh_token";
    const VOLUME_KEY = "volume_level";
    const UI_OPACITY_KEY = "ui_opacity";
    const PLAYER_STYLE_KEY = "player_style";
    const BLUR_ENABLED_KEY = "blur_enabled";

    // --- DOM Elements ---
    const mainContent = document.querySelector('.main-content');
    const allGridContainer = document.getElementById('allGridContainer');
    const homeView = document.getElementById('homeView');
    const searchInput = document.getElementById('searchInput');
    const player = document.querySelector('.player');
    const videoBackgroundContainer = document.getElementById('videoBackgroundContainer');
    
    // Player elements (Default)
    const playerDefaultStyle = document.querySelector('.player-style-default');
    const playerHeader = document.querySelector('.player-header');
    const playerCover = document.getElementById('playerCover');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const repeatBtn = document.getElementById('repeatBtn');
    const favoritePlayerBtn = document.getElementById('favoritePlayerBtn');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressFilled = document.querySelector('.progress-filled');
    const progressThumb = document.querySelector('.progress-thumb');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeBar = document.getElementById('volumeBar');

    // Player elements (Copy)
    const playerCopyStyle = document.querySelector('.player-style-copy');
    const copyPlayerCover = document.getElementById('copyPlayerCover');
    const copyPlayerTitle = document.getElementById('copyPlayerTitle');
    const copyPlayerArtist = document.getElementById('copyPlayerArtist');
    const copyPlayPauseBtn = document.getElementById('copyPlayPauseBtn');
    const copyPlayIcon = document.getElementById('copyPlayIcon');
    const copyPauseIcon = document.getElementById('copyPauseIcon');
    const copyFavoriteBtn = document.getElementById('copyFavoriteBtn');
    const copyProgressBarContainer = document.querySelector('.copy-progress-bar-container');
    const copyProgressFilled = document.querySelector('.copy-progress-filled');
    const copyVolumeBar = document.getElementById('copyVolumeBar');
    
    // Search elements
    const searchView = document.getElementById('searchView');
    const searchResultsGrid = document.getElementById('searchResultsGrid');

    // Profile elements
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userRole = document.getElementById('userRole');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Creator Studio elements
    const creatorStudioBtn = document.getElementById('creatorStudioBtn');
    const backToXMusicBtn = document.getElementById('backToXMusicBtn');
    const xmusicNav = document.getElementById('xmusicNav');
    const xcreatorNav = document.getElementById('xcreatorNav');
    const myTracksSection = document.getElementById('myTracksSection');
    const analyticsSection = document.getElementById('analyticsSection');
    const myTracksBtn = document.getElementById('myTracksBtn');
    const analyticsBtn = document.getElementById('analyticsBtn');
    const creatorHomeBtn = document.getElementById('creatorHomeBtn');
    
    // Equalizer
    const equalizer = document.getElementById('equalizer');
    const equalizerBars = document.querySelectorAll('.equalizer-bar');

    // Modals
    const modals = document.querySelectorAll('.modal');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const settingsModal = document.getElementById('settingsModal');
    const uploadModal = document.getElementById('uploadModal');
    
    // --- Initialize ---

    const init = () => {
        setupEventListeners();
        loadSettings();
        checkAuth();
        fetchInitialData();
    };

    // --- API & Data Fetching ---

    const fetchWithAuth = async (url, options = {}) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        options.headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
        
        let response = await fetch(url, options);
        
        if (response.status === 401) {
            console.warn("Token expired or invalid. Logging out.");
            handleLogout();
            throw new Error("Unauthorized");
        }
        return response;
    };

    const fetchInitialData = async () => {
        try {
            const [bestTracksRes, allTracksRes] = await Promise.all([
                fetch(`${api}/api/tracks/best`),
                fetch(`${api}/api/tracks?page=1&per_page=${tracksPerPage}`)
            ]);
            
            const bestTracks = await bestTracksRes.json();
            const allTracks = await allTracksRes.json();
            
            allMedia = [...bestTracks, ...allTracks.filter(t => !bestTracks.some(bt => bt.id === t.id))];
            
            renderMediaInContainer(allGridContainer, bestTracks, 'scroll-container');
            
            if (currentUser) {
                fetchFavorites();
                fetchXrecomen();
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };
    
    const fetchMoreTracks = async (container, urlBuilder) => {
        if (isLoading) return;
        isLoading = true;
        
        const url = urlBuilder(currentPage);
        try {
            const res = await fetch(url); // No auth needed for public track lists
            const newTracks = await res.json();
            if (newTracks.length > 0) {
                const newUniqueTracks = newTracks.filter(nt => !allMedia.some(et => et.id === nt.id));
                allMedia.push(...newUniqueTracks);
                renderMediaInContainer(container, newUniqueTracks);
                currentPage++;
            }
        } catch (error) {
            console.error('Error fetching more tracks:', error);
        } finally {
            isLoading = false;
        }
    };

    // --- UI Rendering ---

    const renderMediaInContainer = (container, media, containerType = 'grid-container') => {
        if (!container) return;
        if (containerType === 'scroll-container') {
             container.innerHTML = ''; // Clear for horizontal scroll
        }
        
        media.forEach(item => {
            if (!item || !item.title || !item.file) return;

            const trackIndex = allMedia.findIndex(t => t.id === item.id);
            if (trackIndex === -1) return;

            const isFavorite = currentUser ? userFavorites.includes(item.file) : false;
            const card = document.createElement('div');
            card.className = `card ${item.type === 'video' ? 'card--video' : ''}`;
            card.dataset.index = trackIndex;
            card.dataset.id = item.id;
            card.dataset.categoryId = item.category_id;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="/fon/${item.cover}" onerror="this.src='/fon/default.png';" class="card-image" alt="${item.title}">
                    ${currentUser ? `<button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-file="${item.file}" title="Favorite">❤</button>` : ''}
                </div>
                <p class="card-title">${item.title}</p>
                <p class="card-artist">${item.artist || item.creator_name}</p>
            `;
            container.appendChild(card);
        });
    };

    // --- Player Logic ---

    const playMedia = async (index) => {
        if (index < 0 || index >= currentPlaylist.length) return;
        
        currentTrackIndex = index;
        const item = currentPlaylist[index];

        if (!visualizerInitialized) initVisualizer();
        
        videoBackgroundContainer.classList.remove('visible');
        activeMediaElement.pause();

        playerHeader.classList.add('fading');
        setTimeout(() => {
            // Update both players
            [playerCover, copyPlayerCover].forEach(el => el.src = `/fon/${item.cover}`);
            [playerTitle, copyPlayerTitle].forEach(el => el.textContent = item.title);
            [playerArtist, copyPlayerArtist].forEach(el => el.textContent = `by ${item.artist || item.creator_name}`);

            if (item.type === 'audio') {
                activeMediaElement = audioPlayer;
                activeMediaElement.src = `/music/${item.file}`;
            } else {
                activeMediaElement = videoPlayer;
                activeMediaElement.src = `/video/${item.file}`;
                videoBackgroundContainer.classList.add('visible');
            }

            activeMediaElement.play().catch(e => console.error("Playback error:", e));
            playerHeader.classList.remove('fading');
        }, 150);
        
        updateFavoriteStatusInPlayer(item.file);

        // Update playback stats
        if (currentUser) {
            try {
                await fetchWithAuth(`${api}/api/update-playback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser.id, trackId: item.id, duration: item.duration || 0 })
                });
            } catch (e) { /* Fail silently */ }
        }
    };
    
    const updatePlayerUI = (state) => {
        const isPlaying = state === 'play';
        playIcon.style.display = isPlaying ? 'none' : 'block';
        pauseIcon.style.display = isPlaying ? 'block' : 'none';
        copyPlayIcon.style.display = isPlaying ? 'none' : 'block';
        copyPauseIcon.style.display = isPlaying ? 'block' : 'none';
        
        if (isPlaying) {
            if (audioContext && audioContext.state === 'suspended') audioContext.resume();
            equalizer.style.display = 'flex';
            renderVisualizer();
        } else {
            equalizer.style.display = 'none';
            cancelAnimationFrame(animationFrameId);
        }
    };

    // --- Authentication ---

    const checkAuth = () => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            updateUIForAuth(JSON.parse(user));
        } else {
            updateUIForAuth(null);
        }
    };

    const updateUIForAuth = (user) => {
        currentUser = user;
        const loggedIn = !!user;
        
        loginBtn.style.display = loggedIn ? 'none' : 'block';
        userProfile.style.display = loggedIn ? 'flex' : 'none';
        logoutBtn.style.display = loggedIn ? 'block' : 'none';
        creatorStudioBtn.style.display = loggedIn ? 'block' : 'none';
        
        if (loggedIn) {
            userAvatar.textContent = user.username.charAt(0).toUpperCase();
            welcomeMessage.textContent = `Hello, ${user.username}!`;
            userRole.textContent = `Role: ${user.role}`;
            
            const isCreatorOrAdmin = user.role === 'creator' || user.role === 'admin';
            myTracksBtn.style.display = isCreatorOrAdmin ? 'flex' : 'none';
            analyticsBtn.style.display = isCreatorOrAdmin ? 'flex' : 'none';
            creatorHomeBtn.style.display = isCreatorOrAdmin ? 'none' : 'flex';

        } else {
            myTracksBtn.style.display = 'none';
            analyticsBtn.style.display = 'none';
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('currentUser');
        updateUIForAuth(null);
        toggleCreatorMode(false);
    };

    // --- Settings ---

    const loadSettings = () => {
        const savedOpacity = localStorage.getItem(UI_OPACITY_KEY) || 0.6;
        document.documentElement.style.setProperty('--ui-opacity', savedOpacity);

        const savedBlur = localStorage.getItem(BLUR_ENABLED_KEY) !== 'false';
        document.documentElement.style.setProperty('--blur-value', savedBlur ? '12px' : '0px');

        const savedVolume = localStorage.getItem(VOLUME_KEY) || 1;
        audioPlayer.volume = videoPlayer.volume = parseFloat(savedVolume);
        [volumeBar, copyVolumeBar].forEach(bar => bar.value = savedVolume);
        
        const savedStyle = localStorage.getItem(PLAYER_STYLE_KEY) || 'default';
        applyPlayerStyle(savedStyle);
    };
    
    const applyPlayerStyle = (style) => {
        player.className = 'player'; // Reset classes
        player.classList.add(`player--${style}`);
    };
    
    // --- UI Interaction & Views ---
    
    const switchView = (viewId) => {
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
        const viewToShow = document.getElementById(viewId);
        if (viewToShow) {
            viewToShow.classList.add('active-view');
        }
    };

    const toggleCreatorMode = (enable) => {
        document.body.classList.toggle('creator-mode', enable);
        xmusicNav.style.display = enable ? 'none' : 'flex';
        xcreatorNav.style.display = enable ? 'flex' : 'none';
        
        if (enable) {
            activeMediaElement.pause();
            videoBackgroundContainer.classList.remove('visible');
            switchView('creatorView');
            document.querySelectorAll('#creatorView .creator-main-section').forEach(sec => sec.style.display = 'none');
            
            if (currentUser && (currentUser.role === 'creator' || currentUser.role === 'admin')) {
                myTracksSection.style.display = 'block';
                // fetchMyTracks();
            } else {
                 // show apply screen
            }
        } else {
            switchView('homeView');
            fetchInitialData();
        }
    };
    
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    };

    const closeModal = (modal) => {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300);
    };

    // --- Visualizer ---

    const initVisualizer = () => {
        if (visualizerInitialized) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const audioSource = audioContext.createMediaElementSource(audioPlayer);
        const videoSource = audioContext.createMediaElementSource(videoPlayer);
        
        audioSource.connect(analyser);
        videoSource.connect(analyser);
        analyser.connect(audioContext.destination);
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        visualizerInitialized = true;
    };

    const renderVisualizer = () => {
        animationFrameId = requestAnimationFrame(renderVisualizer);
        analyser.getByteFrequencyData(dataArray);
        
        const barCount = equalizerBars.length;
        for (let i = 0; i < barCount; i++) {
            const barHeight = dataArray[Math.floor(i * (analyser.frequencyBinCount / barCount))];
            equalizerBars[i].style.height = `${Math.max(5, (barHeight / 255) * 100)}%`;
        }
    };
    
    // --- Event Listeners Setup ---

    const setupEventListeners = () => {
        // Player Controls
        [playPauseBtn, copyPlayPauseBtn].forEach(btn => btn.addEventListener('click', () => {
            activeMediaElement.paused ? activeMediaElement.play() : activeMediaElement.pause();
        }));

        [audioPlayer, videoPlayer].forEach(el => {
            el.addEventListener('play', () => updatePlayerUI('play'));
            el.addEventListener('pause', () => updatePlayerUI('pause'));
            el.addEventListener('ended', () => { if (!repeatMode) playMedia((currentTrackIndex + 1) % currentPlaylist.length); });
            el.addEventListener('timeupdate', () => {
                 if (!isDragging && el.duration) {
                    const progress = (el.currentTime / el.duration) * 100 || 0;
                    progressFilled.style.width = `${progress}%`;
                    progressThumb.style.left = `${progress}%`;
                    copyProgressFilled.style.width = `${progress}%`;
                }
                currentTimeEl.textContent = formatTime(el.currentTime);
            });
             el.addEventListener('loadedmetadata', () => {
                durationEl.textContent = formatTime(el.duration);
            });
        });
        
        // --- 3D Card Effect ---
        mainContent.addEventListener('mousemove', (e) => {
            if (!e.target.closest('.card')) return;
            const card = e.target.closest('.card');
            const { top, left, width, height } = card.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;
            const rotateX = -1 * (y - height / 2) / (height / 2) * 10; // Max rotation 10deg
            const rotateY = (x - width / 2) / (width / 2) * 10;
            
            card.style.setProperty('--rotateX', `${rotateX}deg`);
            card.style.setProperty('--rotateY', `${rotateY}deg`);
        });

        mainContent.addEventListener('mouseleave', (e) => {
             if (!e.target.closest('.card')) return;
             const card = e.target.closest('.card');
             card.style.setProperty('--rotateX', '0deg');
             card.style.setProperty('--rotateY', '0deg');
        }, true);


        // --- Click Delegations ---
        document.body.addEventListener('click', e => {
            const card = e.target.closest('.card');
            const favoriteBtn = e.target.closest('.favorite-btn');
            
            if (favoriteBtn) {
                e.stopPropagation();
                // Handle favorite logic
            } else if (card) {
                const clickedId = parseInt(card.dataset.id, 10);
                const categoryId = card.dataset.categoryId === 'null' ? null : parseInt(card.dataset.categoryId, 10);
                
                // CONTEXTUAL PLAYLIST CREATION
                if (document.getElementById('specificCategoryView').classList.contains('active-view') && categoryId) {
                    currentPlaylist = allMedia.filter(track => track.category_id === categoryId);
                } else {
                    currentPlaylist = [...allMedia]; // Fallback to all loaded media
                }
                
                const newIndex = currentPlaylist.findIndex(t => t.id === clickedId);
                if (newIndex !== -1) playMedia(newIndex);
            }
            
            // Modal handling
            if (e.target.closest('.login-btn')) openModal('loginModal');
            if (e.target.closest('.settings-btn')) openModal('settingsModal');
            if (e.target.closest('.close-btn')) closeModal(e.target.closest('.modal'));
            
            // Navigation
            if(e.target.closest('#navHome')) switchView('homeView');
            if(e.target.closest('#creatorStudioBtn')) toggleCreatorMode(true);
            if(e.target.closest('#backToXMusicBtn')) toggleCreatorMode(false);
        });
        
        // Close modal on outside click
        modals.forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) closeModal(modal);
            });
        });
        
        // Logout
        logoutBtn.addEventListener('click', handleLogout);
    };

    // --- Helpers ---
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- Start the App ---
    init();
});