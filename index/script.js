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

    let audioContext;
    let analyser;
    let dataArray;
    let animationFrameId;
    let visualizerInitialized = false;

    const ACCESS_TOKEN_KEY = "access_token"
    const REFRESH_TOKEN_KEY = "refresh_token"
    const VOLUME_KEY = "volume_level"
    const UI_OPACITY_KEY = "ui_opacity";
    const PLAYER_STYLE_KEY = "player_style";
    const BLUR_ENABLED_KEY = "blur_enabled";

    const mainContent = document.querySelector('.main-content');
    const allGridContainer = document.getElementById('allGridContainer');
    const allCategoriesGrid = document.getElementById('allCategoriesGrid');
    const specificCategoryView = document.getElementById('specificCategoryView');
    const specificCategoryTitle = document.getElementById('specificCategoryTitle');
    const specificCategoryGrid = document.getElementById('specificCategoryGrid');
    const homeView = document.getElementById('homeView');
    const searchBarWrapper = document.querySelector('.search-bar-wrapper');
    const searchInput = document.getElementById('searchInput');
    const navHome = document.getElementById('navHome');
    const navCategories = document.getElementById('navCategories');
    const navFavorites = document.getElementById('navFavorites');
    const views = document.querySelectorAll('.view');
    const viewTitle = document.getElementById('viewTitle');
    const player = document.querySelector('.player');
    const videoBackgroundContainer = document.getElementById('videoBackgroundContainer');
    
    const playerDefaultStyle = document.querySelector('.player-style-default');
    const playerCover = document.getElementById('playerCover');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const favoritePlayerBtn = document.getElementById('favoritePlayerBtn');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressFilled = document.querySelector('.progress-filled');
    const progressThumb = document.querySelector('.progress-thumb');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeBar = document.getElementById('volumeBar');

    const playerCopyStyle = document.querySelector('.player-style-copy');
    const copyPlayerCover = document.getElementById('copyPlayerCover');
    const copyPlayerTitle = document.getElementById('copyPlayerTitle');
    const copyPlayerArtist = document.getElementById('copyPlayerArtist');
    const copyPlayPauseBtn = document.getElementById('copyPlayPauseBtn');
    const copyPlayIcon = document.getElementById('copyPlayIcon');
    const copyPauseIcon = document.getElementById('copyPauseIcon');
    const copyPrevBtn = document.getElementById('copyPrevBtn');
    const copyNextBtn = document.getElementById('copyNextBtn');
    const copyFavoriteBtn = document.getElementById('copyFavoriteBtn');
    const copyProgressBarContainer = document.querySelector('.copy-progress-bar-container');
    const copyProgressFilled = document.querySelector('.copy-progress-filled');
    const copyVolumeBar = document.getElementById('copyVolumeBar');

    const searchView = document.getElementById('searchView');
    const searchResultsGrid = document.getElementById('searchResultsGrid');
    const searchResultsTitle = document.getElementById('searchResultsTitle');

    const uploadModal = document.getElementById('uploadModal');
    const closeUploadBtn = uploadModal.querySelector('.close-btn');
    const uploadForm = document.getElementById('uploadForm');
    const uploadTypeRadios = document.querySelectorAll('input[name="uploadType"]');
    const uploadManager = document.getElementById('uploadManager');
    const uploadProgressBar = document.querySelector('.upload-progress-fill');
    const uploadStatusText = document.getElementById('uploadStatusText');
    const uploadSubmitBtn = document.querySelector('#uploadForm button[type="submit"]');
    const categorySelect = document.getElementById('categorySelect');
    const artistFields = document.getElementById('artistFields');
    const isForeignArtist = document.getElementById('isForeignArtist');
    const coverDropArea = document.getElementById('coverDropArea');
    const mediaDropArea = document.getElementById('mediaDropArea');
    const coverPreview = document.getElementById('coverPreview');
    const coverPlaceholder = document.getElementById('coverPlaceholder');
    const mediaFileName = document.getElementById('mediaFileName');
    const coverFileInput = document.getElementById('coverFile');
    const audioFileInput = document.getElementById('audioFile');
    const videoFileInput = document.getElementById('videoFile');

    const settingsModal = document.getElementById('settingsModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = settingsModal.querySelector('.close-btn');
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    const blurToggle = document.getElementById('blurToggle');

    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    const closeLoginBtn = loginModal.querySelector('.close-btn');
    const switchToRegisterBtn = document.getElementById('switchToRegister');
    const registerModal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    const closeRegisterBtn = registerModal.querySelector('.close-btn');
    const switchToLoginBtn = document.getElementById('switchToLogin');
    const favoritesView = document.getElementById('favoritesView');
    const favoritesGridContainer = document.getElementById('favoritesGridContainer');
    
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userRole = document.getElementById('userRole');
    const logoutBtn = document.getElementById('logoutBtn');

    const headerControls = document.querySelector('.header-controls');

    const creatorStudioBtn = document.getElementById('creatorStudioBtn');
    const backToXMusicBtn = document.getElementById('backToXMusicBtn');
    const xmusicNav = document.getElementById('xmusicNav');
    const xcreatorNav = document.getElementById('xcreatorNav');
    const xmusicLogo = document.getElementById('xmusicLogo');
    const xcreatorLogo = document.getElementById('xcreatorLogo');
    const creatorView = document.getElementById('creatorView');
    const creatorHomeSection = document.getElementById('creatorHomeSection');
    const myTracksSection = document.getElementById('myTracksSection');
    const analyticsSection = document.getElementById('analyticsSection');

    const creatorHomeBtn = document.getElementById('creatorHomeBtn');
    const myTracksBtn = document.getElementById('myTracksBtn');
    const analyticsBtn = document.getElementById('analyticsBtn');
    const adminApplicationsBtn = document.getElementById('adminApplicationsBtn');
    const adminUsersBtn = document.getElementById('adminUsersBtn');
    const adminModerationBtn = document.getElementById('adminModerationBtn');
    const adminStatsBtn = document.getElementById('adminStatsBtn');
    const adminCategoriesBtn = document.getElementById('adminCategoriesBtn');
    const adminLogsBtn = document.getElementById('adminLogsBtn');
    const adminApplicationsSection = document.getElementById('adminApplicationsSection');
    const adminUsersSection = document.getElementById('adminUsersSection');
    const adminModerationSection = document.getElementById('adminModerationSection');
    const adminStatsSection = document.getElementById('adminStatsSection');
    const adminCategoriesSection = document.getElementById('adminCategoriesSection');
    const adminLogsSection = document.getElementById('adminLogsSection');
    const applicationsList = document.getElementById('applicationsList');
    const usersList = document.getElementById('usersList');
    const moderationTracksList = document.getElementById('moderationTracksList');
    const statsContent = document.getElementById('statsContent');
    const passwordLogsTableBody = document.getElementById('passwordLogsTableBody');

    const applicationModal = document.getElementById('applicationModal');
    const closeApplicationBtn = applicationModal.querySelector('.close-btn');
    const applicationForm = document.getElementById('applicationForm');
    const applyBtn = document.getElementById('applyBtn');

    const videoModal = document.getElementById('videoModal');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const closeVideoBtn = document.getElementById('closeVideoBtn');

    const categoriesView = document.getElementById('categoriesView');

    const xrecomenSection = document.getElementById('xrecomenSection');
    const xrecomenBtn = document.getElementById('xrecomenBtn');
    const xrecomenTitle = document.querySelector('.xrecomen-title');
    const xrecomenSubtitle = document.querySelector('.xrecomen-subtitle');
    const youLikeSection = document.getElementById('youLikeSection');
    const youLikeGrid = document.getElementById('youLikeGrid');
    const favoriteCollectionsSection = document.getElementById('favoriteCollectionsSection');
    const favoriteCollectionsGrid = document.getElementById('favoriteCollectionsGrid');
    const nowPlayingText = document.getElementById('nowPlayingText');

    const moderationModal = document.getElementById('moderationModal');
    const closeModerationBtn = document.getElementById('closeModerationBtn');
    const moderationTitle = document.getElementById('moderationTitle');
    const moderationArtist = document.getElementById('moderationArtist');
    const moderationPlayer = document.getElementById('moderationPlayer');
    const moderationPlayerCover = document.getElementById('moderationPlayerCover');
    const moderationApproveBtn = document.getElementById('moderationApproveBtn');
    const moderationRejectBtn = document.getElementById('moderationRejectBtn');
    const moderationVideoPlayer = document.getElementById('moderationVideoPlayer');

    const analyticsChart = document.getElementById('analyticsChart');
    const analyticsTrackTableBody = document.getElementById('analyticsTrackTableBody');
    const totalPlaysEl = document.getElementById('totalPlays');

    const backToCategoriesBtn = document.getElementById('backToCategoriesBtn');
    
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
    const categoryForm = document.getElementById('categoryForm');
    const categoryIdInput = document.getElementById('categoryId');
    const categoryNameInput = document.getElementById('categoryName');
    const userSearchInput = document.getElementById('userSearchInput');
    const userSearchStatus = document.getElementById('userSearchStatus');
    const selectedUsersContainer = document.getElementById('selectedUsersContainer');
    let selectedUsers = [];
    
    const playerStyleButtons = document.querySelectorAll('.player-style-selector .style-btn');

    const equalizer = document.getElementById('equalizer');
    const equalizerBars = Array.from(document.querySelectorAll('.equalizer-bar'));

    const navYoutube = document.getElementById('navYoutube');
    const youtubeView = document.getElementById('youtubeView');
    const youtubeUrlInput = document.getElementById('youtubeUrlInput');
    const youtubeFetchBtn = document.getElementById('youtubeFetchBtn');
    const youtubeResultContainer = document.getElementById('youtubeResultContainer');
    const youtubeThumbnail = document.getElementById('youtubeThumbnail');
    const youtubeTitle = document.getElementById('youtubeTitle');
    const youtubeQualitySelect = document.getElementById('youtubeQualitySelect');
    const youtubeDownloadBtn = document.getElementById('youtubeDownloadBtn');
    const youtubeStatus = document.getElementById('youtubeStatus');

    let chartInstance = null;
    let playTimer;
    let userSearchTimeout;
    let currentTrack = null;
    
    const modals = [ uploadModal, settingsModal, loginModal, registerModal, applicationModal, videoModal, moderationModal, categoryModal ];
    modals.forEach(modal => { if (modal) modal.style.display = 'none'; });

    // === УЛУЧШЕНИЕ: ЛОГИКА АНИМАЦИИ ПРИ СКРОЛЛЕ ===
    const initScrollAnimations = () => {
        const observerOptions = {
            root: mainContent, // Наблюдаем внутри .main-content
            rootMargin: '0px',
            threshold: 0.1 // Срабатывать, когда 10% элемента видно
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Отключаем наблюдение после анимации
                }
            });
        }, observerOptions);

        // Назначаем наблюдение за всеми секциями
        const sections = document.querySelectorAll('.section, .featured-card');
        sections.forEach(section => observer.observe(section));
    };


    const initSummerCountdown = () => {
        const countdownContainer = document.getElementById('summerCountdown');
        const daysEl = document.getElementById('countdownDays');
        const hoursEl = document.getElementById('countdownHours');
        const minutesEl = document.getElementById('countdownMinutes');
        const secondsEl = document.getElementById('countdownSeconds');

        const targetDate = new Date('2026-06-01T00:00:00+03:00').getTime();
        const padZero = (num) => (num < 10 ? `0${num}` : num);

        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownContainer.innerHTML = '<span class="countdown-label">Лето наступило!</span>';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = days;
            hoursEl.textContent = padZero(hours);
            minutesEl.textContent = padZero(minutes);
            secondsEl.textContent = padZero(seconds);
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    };

    async function fetchWithAuth(url, options = {}) {
        const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        options.headers = options.headers || {};
        if (accessToken) {
            options.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        let response = await fetch(url, options);
        if (response.status === 401) {
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            alert("Authorization token error")
            localStorage.removeItem('currentUser');
            updateUIForAuth(null);
            toggleCreatorMode(false);
            loginModal.style.display = "flex"
        }
        return response;
    }

    function setTokens(accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    function clearTokens() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    const fetchInitialData = async () => {
        try {
            const bestTracksRes = await fetchWithAuth(`${api}/api/tracks/best`);
            const bestTracks = await bestTracksRes.json();
            
            allMedia = [...bestTracks]; 
            renderBestTracks(bestTracks);
            
            const allTracksRes = await fetchWithAuth(`${api}/api/tracks?page=1&per_page=${tracksPerPage}`);
            const allTracks = await allTracksRes.json();
            
            allMedia = [...allMedia, ...allTracks.filter(t => !allMedia.some(item => item.id === t.id))];
            
            if (currentUser) {
                fetchFavorites();
            }
            await fetchXrecomen();
            initScrollAnimations(); // Запускаем анимации после загрузки данных
            
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchMoreTracks = async () => {
        if (isLoading) return;
        isLoading = true;
        
        const url = `${api}/api/tracks?page=${currentPage}&per_page=${tracksPerPage}`;
        try {
            const res = await fetchWithAuth(url);
            const newTracks = await res.json();
            if (newTracks.length > 0) {
                const newTracksToAdd = newTracks.filter(newTrack => !allMedia.some(existingTrack => existingTrack.id === newTrack.id));
                allMedia.push(...newTracksToAdd);
                renderMediaInContainer(allGridContainer, newTracksToAdd);
                currentPage++;
            }
        } catch (error) {
            console.error('Error fetching more tracks:', error);
        } finally {
            isLoading = false;
        }
    };

    const fetchXrecomen = async () => {
        if (!currentUser) {
            // Логика для неавторизованного пользователя
            if (youLikeSection) youLikeSection.style.display = 'block';
            if (favoriteCollectionsSection) favoriteCollectionsSection.style.display = 'block';
            if (youLikeGrid) youLikeGrid.innerHTML = '<p>Войдите в аккаунт, чтобы увидеть рекомендации.</p>';
            if (favoriteCollectionsGrid) favoriteCollectionsGrid.innerHTML = '<p>Войдите, чтобы увидеть любимые подборки.</p>';

            const bestTracksResponse = await fetchWithAuth(`${api}/api/tracks/best`);
            if (bestTracksResponse.ok) {
                const bestTracks = await bestTracksResponse.json();
                if (bestTracks.length > 0) {
                    const randomTrack = bestTracks[Math.floor(Math.random() * bestTracks.length)];
                    renderXrecomen(randomTrack, true);
                }
            }
            return;
        }

        try {
            const response = await fetchWithAuth(`${api}/api/xrecomen/${currentUser.id}`);
            const data = await response.json();
            
            renderXrecomen(data.xrecomenTrack, false);

            if (youLikeGrid) {
                if (data.youLike && data.youLike.length > 0) {
                    const newTracks = data.youLike.filter(t => !allMedia.some(item => item.id === t.id));
                    allMedia.push(...newTracks);
                    renderMediaInContainer(youLikeGrid, data.youLike);
                } else {
                    youLikeGrid.innerHTML = '<p>Добавьте треки в избранное, чтобы мы могли составить рекомендации.</p>';
                }
            }

            if (favoriteCollectionsGrid) {
                if (data.favoriteCollections && data.favoriteCollections.length > 0) {
                     renderAllCategoriesOnMain(favoriteCollectionsGrid, 5);
                } else {
                    favoriteCollectionsGrid.innerHTML = '<p>Нет любимых подборок.</p>';
                }
            }

        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };
    
    // === УЛУЧШЕНИЕ: ОБНОВЛЕННАЯ ФУНКЦИЯ РЕНДЕРА XRECOMEN ===
    const renderXrecomen = (track, isRandom) => {
        if (!track) {
            xrecomenTitle.textContent = 'Xrecomen';
            xrecomenSubtitle.textContent = 'Лучший алгоритм подбора треков';
            xrecomenBtn.style.setProperty('--xrecomen-bg', `url('/fon/default.png')`);
            return;
        }
        
        const index = allMedia.findIndex(t => t.id === track.id);
        if (xrecomenBtn && index !== -1) {
            xrecomenBtn.dataset.index = index;
            xrecomenTitle.textContent = track.title;
            xrecomenSubtitle.textContent = isRandom ? 'Случайный трек' : `Возможно, вам понравится`;
            // Устанавливаем фон через CSS переменную для плавности
            xrecomenBtn.style.setProperty('--xrecomen-bg', `url('/fon/${track.cover}')`);
        }
    };


    const renderAllCategoriesOnMain = async (container, limit) => {
        try {
            const categoriesRes = await fetchWithAuth(`${api}/api/categories`);
            if (!categoriesRes.ok) throw new Error('Error fetching categories.');
            const categories = await categoriesRes.json();
            
            container.innerHTML = '';
            
            const allTracksCategory = { id: 'all', name: 'All Tracks' };
            const allCategories = [allTracksCategory, ...categories];
            
            const categoriesToRender = allCategories.slice(0, limit);
            
            if (categoriesToRender.length === 0) {
                container.innerHTML = '<p>No categories yet.</p>';
                return;
            }

            categoriesToRender.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'collection-card';
                card.dataset.categoryId = cat.id;
                card.innerHTML = `<h3>${cat.name}</h3>`;
                container.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            container.innerHTML = '<p>Could not load categories.</p>';
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesRes = await fetchWithAuth(`${api}/api/categories`);
            if (!categoriesRes.ok) throw new Error('Error fetching categories');
            const categoriesData = await categoriesRes.json();
            
            const allTracksCategory = { id: 'all', name: 'All Tracks' };
            const allCategories = [allTracksCategory, ...categoriesData];
            
            const categoriesToDisplay = allCategories; 

            if (allCategoriesGrid) {
                allCategoriesGrid.innerHTML = '';
                
                if (categoriesToDisplay.length === 0) {
                    allCategoriesGrid.innerHTML = '<p>No additional categories.</p>';
                    return;
                }

                categoriesToDisplay.forEach(cat => {
                    const card = document.createElement('div');
                    card.className = 'category-card';
                    card.dataset.categoryId = cat.id;
                    card.innerHTML = `<h3>${cat.name}</h3>`;
                    allCategoriesGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const fetchAndRenderCategoryTracks = async (categoryId) => {
        if (isLoading) return;
        isLoading = true;
        currentCategoryId = categoryId;
        currentPage = 1;
        allMedia = [];
        if (specificCategoryGrid) specificCategoryGrid.innerHTML = '';
        mainContent.removeEventListener('scroll', handleScroll);
        mainContent.addEventListener('scroll', handleScroll);
        await loadMoreTracks();
        isLoading = false;
    };

    const loadMoreTracks = async () => {
        if (isLoading) return;
        isLoading = true;

        try {
            const url = currentCategoryId === 'all'
                ? `${api}/api/tracks?page=${currentPage}&per_page=${tracksPerPage}`
                : `${api}/api/tracks?categoryId=${currentCategoryId}&page=${currentPage}&per_page=${tracksPerPage}`;

            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const newTracks = await response.json();
            
            const newTracksToAdd = newTracks.filter(newTrack => !allMedia.some(existingTrack => existingTrack.id === newTrack.id));
            allMedia.push(...newTracksToAdd);

            if (newTracksToAdd.length > 0) {
                if (specificCategoryGrid) {
                    renderMediaInContainer(specificCategoryGrid, newTracksToAdd);
                }
                currentPage++;
            } else {
                mainContent.removeEventListener('scroll', handleScroll);
            }
        } catch (error) {
            console.error('Error loading tracks:', error);
        } finally {
            isLoading = false;
        }
    };

    const startSearch = (query) => {
        if (searchIsLoading) return;
        currentSearchQuery = query;
        searchCurrentPage = 1;
        
        allMedia = []; 
        if(searchResultsGrid) searchResultsGrid.innerHTML = '';
        
        switchView('searchView', query);
        loadMoreSearchResults();
    };

    const loadMoreSearchResults = async () => {
        if (searchIsLoading || !currentSearchQuery) return;
        searchIsLoading = true;

        try {
            const url = `${api}/api/search?q=${encodeURIComponent(currentSearchQuery)}&page=${searchCurrentPage}&per_page=${tracksPerPage}`;
            const response = await fetchWithAuth(url);
            if (!response.ok) throw new Error('Network response for search failed');
            const newTracks = await response.json();
            
            if (newTracks.length > 0) {
                const newTracksToAdd = newTracks.filter(newTrack => !allMedia.some(existingTrack => existingTrack.id === newTrack.id));
                allMedia.push(...newTracksToAdd);
                renderMediaInContainer(searchResultsGrid, newTracksToAdd);
                searchCurrentPage++;
            } else {
                if (searchCurrentPage === 1) {
                    searchResultsGrid.innerHTML = `<p>Ничего не найдено по запросу "${currentSearchQuery}".</p>`;
                }
                mainContent.removeEventListener('scroll', handleScroll);
            }
        } catch (error) {
            console.error('Error during search:', error);
        } finally {
            searchIsLoading = false;
        }
    };

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = mainContent;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 500;

        const isHomeViewActive = homeView.classList.contains('active-view');
        const isCategoryViewActive = specificCategoryView.classList.contains('active-view');
        const isSearchViewActive = searchView.classList.contains('active-view');
        
        if (isHomeViewActive && isNearBottom && !isLoading) {
            fetchMoreTracks();
        } else if (isCategoryViewActive && isNearBottom && !isLoading) {
            loadMoreTracks();
        } else if (isSearchViewActive && isNearBottom && !searchIsLoading) {
            loadMoreSearchResults();
        }
    };

    const updateUIForAuth = (user) => {
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            if (loginBtn) loginBtn.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';
            if (userAvatar) userAvatar.textContent = user.username.charAt(0).toUpperCase();
            if (welcomeMessage) welcomeMessage.textContent = `Привет, ${user.username}!`;
            if (userRole) userRole.textContent = `Роль: ${user.role}`;

            if (navFavorites) navFavorites.style.display = 'flex';
            if (creatorStudioBtn) creatorStudioBtn.style.display = 'block';
            if (logoutBtn) logoutBtn.style.display = 'block';
            fetchFavorites();
            fetchXrecomen();

            if (user.role === 'creator' || user.role === 'admin') {
                if (myTracksBtn) myTracksBtn.style.display = 'flex';
                if (analyticsBtn) analyticsBtn.style.display = 'flex';
                if (creatorHomeBtn) creatorHomeBtn.style.display = 'none';
                fetchCreatorCategories();
            } else {
                if (creatorHomeBtn) creatorHomeBtn.style.display = 'flex';
            }

            if (user.role === 'admin') {
                document.querySelectorAll('.admin-section').forEach(btn => btn.style.display = 'flex');
            } else {
                document.querySelectorAll('.admin-section').forEach(btn => btn.style.display = 'none');
            }
        } else {
            currentUser = null;
            localStorage.removeItem('currentUser');
            if (loginBtn) loginBtn.style.display = 'block';
            if (userProfile) userProfile.style.display = 'none';
            if (navFavorites) navFavorites.style.display = 'none';
            if (creatorStudioBtn) creatorStudioBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'none';
            userFavorites = [];
            if (myTracksBtn) myTracksBtn.style.display = 'none';
            if (analyticsBtn) analyticsBtn.style.display = 'none';
            document.querySelectorAll('.admin-section').forEach(btn => btn.style.display = 'none');
            if (document.querySelector('.view.active-view').id === 'favoritesView') {
                switchView('homeView');
            }
            fetchXrecomen();
        }
    };

    const fetchCreatorCategories = async () => {
        if (!currentUser) return;
        try {
            const response = await fetchWithAuth(`${api}/api/creator/my-categories/${currentUser.id}`);
            if (!response.ok) throw new Error('Error fetching categories.');
            const categories = await response.json();
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Общая</option>';
                categories.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.id;
                    option.textContent = cat.name;
                    categorySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchFavorites = async () => {
        if (!currentUser) return;
        try {
            const response = await fetchWithAuth(`${api}/api/favorites`);
            if (!response.ok) throw new Error('Error fetching favorites.');
            userFavorites = await response.json();
            renderFavorites();
        } catch (error) {
            console.error(error);
        }
    };

    const renderFavorites = () => {
        const favoriteMedia = allMedia.filter(item => userFavorites.includes(item.file));
        if (favoritesGridContainer) {
            favoritesGridContainer.innerHTML = '';
            renderMediaInContainer(favoritesGridContainer, favoriteMedia);
        }
    };

    const renderBestTracks = (mediaToRender) => {
        if (allGridContainer) {
            allGridContainer.innerHTML = '';
            if (mediaToRender.length === 0) {
                allGridContainer.innerHTML = `<p>Здесь пока ничего нет.</p>`;
                return;
            }
            renderMediaInContainer(allGridContainer, mediaToRender);
        }
    };

    const renderMediaInContainer = (container, media) => {
        if (!container) return;
        const existingMediaIds = Array.from(container.children).map(card => parseInt(card.dataset.id));

        media.forEach((item) => {
            if (!item || !item.title || !item.file) {
                console.warn("Пропущен трек из-за неполных данных:", item);
                return;
            }
            if (existingMediaIds.includes(item.id)) {
                return;
            }

            const trackIndex = allMedia.findIndex(t => t.id === item.id);
            if (trackIndex === -1) {
                console.warn("Трек не найден в allMedia, карточка не создана:", item);
                return;
            }

            const isFavorite = currentUser ? userFavorites.includes(item.file) : false;
            const card = document.createElement('div');
            card.className = `card ${item.type === 'video' ? 'card--video' : ''}`;
            card.dataset.index = trackIndex;
            card.dataset.id = item.id;
            card.dataset.categoryId = item.category_id;

            let cardActionsHtml = '';
            if (currentUser && currentUser.role === 'admin') {
                cardActionsHtml = `
                    <div class="card-actions">
                        <button class="rename-btn" data-track-id="${item.id}" title="Переименовать"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/><path fill-rule="evenodd" d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg></button>
                        <button class="delete-btn" data-track-id="${item.id}" title="Удалить"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="/fon/${item.cover}" onerror="this.src='/fon/default.png';" class="card-image" alt="${item.title}">
                    ${cardActionsHtml}
                    ${currentUser ? `<button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-file="${item.file}" title="${isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}">❤</button>` : ''}
                </div>
                <p class="card-title">${item.title} ${item.type === 'video' ? '<span class="video-icon">🎥</span>' : ''}</p>
                <p class="card-artist">${item.artist || item.creator_name}</p>
            `;
            container.appendChild(card);
        });
    };
    
    // === УЛУЧШЕНИЕ: ОБНОВЛЕННАЯ ЛОГИКА СМЕНЫ ТРЕКА С АНИМАЦИЯМИ ===
    const playMedia = async (index) => {
        if (index < 0 || index >= currentPlaylist.length) return;
        
        currentTrack = currentPlaylist[index];
        currentTrackIndex = index;
        const item = currentTrack;
        
        hideVideo();
        activeMediaElement.pause();
        activeMediaElement.currentTime = 0;
        
        initVisualizer();

        if (nowPlayingText) {
            nowPlayingText.textContent = `Сейчас играет: ${item.title} - ${item.artist || item.creator_name}`;
        }
        
        // 1. Запускаем анимацию исчезновения
        [playerCover, copyPlayerCover].forEach(cover => cover.classList.add('fading-out'));
        
        // 2. Ждем завершения анимации (400ms, как в CSS)
        setTimeout(() => {
            // 3. Обновляем информацию и SRC
            [playerCover, copyPlayerCover].forEach(cover => cover.src = `/fon/${item.cover}`);
            playerTitle.textContent = item.title;
            playerArtist.textContent = item.artist || item.creator_name;
            copyPlayerTitle.textContent = item.title;
            copyPlayerArtist.textContent = item.artist || item.creator_name;
        
            if (item.type === 'audio') {
                activeMediaElement = audioPlayer;
                activeMediaElement.src = `/music/${item.file}`;
                hideVideo();
            } else if (item.type === 'video') {
                activeMediaElement = videoPlayer;
                activeMediaElement.src = `/video/${item.file}`;
                showVideo();
            }
            
            // 4. После смены SRC, запускаем воспроизведение и анимацию появления
            activeMediaElement.play().catch(e => console.error("Ошибка воспроизведения:", e));
            [playerCover, copyPlayerCover].forEach(cover => cover.classList.remove('fading-out'));

        }, 400); // Должно совпадать с transition-duration в CSS
        

        updateFavoriteStatus(item.file);

        if (playTimer) clearTimeout(playTimer);
        playTimer = setTimeout(async () => {
            if (currentUser && activeMediaElement.duration) {
                await fetchWithAuth(`${api}/api/update-playback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        trackId: item.id,
                        currentTime: activeMediaElement.currentTime,
                        duration: activeMediaElement.duration
                    })
                });
            }
        }, 5000);
    };


    const updateFavoriteStatus = (mediaFile) => {
        if (!currentUser) return;
        const isFavorite = userFavorites.includes(mediaFile);

        if (favoritePlayerBtn) {
            favoritePlayerBtn.classList.toggle('favorited', isFavorite);
            const heartIcon = favoritePlayerBtn.querySelector('svg');
            heartIcon.style.fill = isFavorite ? 'red' : 'none';
            heartIcon.style.stroke = isFavorite ? 'red' : 'currentColor';
            favoritePlayerBtn.title = isFavorite ? 'Удалить из избранного' : 'Добавить в избранное';
        }

        if (copyFavoriteBtn) {
            copyFavoriteBtn.classList.toggle('favorited', isFavorite);
            copyFavoriteBtn.title = isFavorite ? 'Удалить из избранного' : 'Добавить в избранное';
        }
    }
    
    const fetchMyTracks = async () => {
        if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) return;

        myTracks = [];
        myTracksCurrentPage = 1;
        myTracksIsLoading = false;
        
        myTracksSection.innerHTML = ''; 
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'submit-btn';
        uploadBtn.id = 'uploadTrackBtn';
        uploadBtn.textContent = 'Загрузить трек';
        uploadBtn.addEventListener('click', () => {
            if (uploadModal) uploadModal.style.display = 'flex';
        });

        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '15px';
        controlsDiv.style.flexWrap = 'wrap';
        controlsDiv.style.marginBottom = '20px';
        controlsDiv.appendChild(uploadBtn);
        myTracksSection.appendChild(controlsDiv);

        const myTracksGrid = document.createElement('div');
        myTracksGrid.className = 'grid-container';
        myTracksGrid.id = 'myTracksGrid';
        myTracksSection.appendChild(myTracksGrid);
        
        mainContent.addEventListener('scroll', handleMyTracksScroll);

        await loadMoreMyTracks();
    };

    const loadMoreMyTracks = async () => {
        if (myTracksIsLoading || !currentUser) return;
        myTracksIsLoading = true;

        try {
            const response = await fetchWithAuth(`${api}/api/creator/my-tracks/${currentUser.id}?page=${myTracksCurrentPage}&per_page=${tracksPerPage}`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const newTracks = await response.json();

            if (newTracks.length > 0) {
                myTracks.push(...newTracks);
                renderMyTracksChunk(newTracks);
                myTracksCurrentPage++;
            } else {
                mainContent.removeEventListener('scroll', handleMyTracksScroll);
                if (myTracks.length === 0) {
                     const myTracksGrid = document.getElementById('myTracksGrid');
                     if (myTracksGrid) {
                        myTracksGrid.innerHTML = `<p>Вы еще не загрузили ни одного трека.</p>`;
                     }
                }
            }
        } catch (error) {
            console.error('Ошибка загрузки ваших треков:', error);
        } finally {
            myTracksIsLoading = false;
        }
    };
    
    const renderMyTracksChunk = (tracksToRender) => {
        const myTracksGrid = document.getElementById('myTracksGrid');
        if (!myTracksGrid) return;
        
        tracksToRender.forEach(track => {
            const card = document.createElement('div');
            card.className = `card my-track-card ${track.type === 'video' ? 'card--video' : ''}`;
            card.dataset.trackId = track.id;
            if (!allMedia.some(t => t.id === track.id)) {
                allMedia.push(track);
            }
            const trackIndex = allMedia.findIndex(t => t.id === track.id);
            card.dataset.index = trackIndex;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="/fon/${track.cover}" onerror="this.src='/fon/default.png';" class="card-image" alt="${track.title}">
                </div>
                <p class="card-title">${track.title} ${track.type === 'video' ? '<span class="video-icon">🎥</span>' : ''}</p>
                <p class="card-artist">${track.artist || track.creator_name}</p>
                <div class="card-actions">
                    <button class="delete-my-track-btn" data-track-id="${track.id}">Удалить</button>
                </div>
            `;
            myTracksGrid.appendChild(card);
        });
    };

    const handleMyTracksScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = mainContent;
        const isActive = myTracksSection.style.display === 'block';
        if (isActive && scrollTop + clientHeight >= scrollHeight - 500 && !myTracksIsLoading) {
            loadMoreMyTracks();
        }
    };

    const fetchCreatorStats = async () => {
        if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) return;
        try {
            const response = await fetchWithAuth(`${api}/api/creator/stats/${currentUser.id}`);
            const stats = await response.json();

            if (totalPlaysEl) totalPlaysEl.textContent = stats.totalPlays;

            const ctx = analyticsChart.getContext('2d');
            const dates = stats.dailyPlays.map(d => d.date);
            const plays = stats.dailyPlays.map(d => d.count);

            if (chartInstance) {
                chartInstance.destroy();
            }

            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Прослушивания',
                        data: plays,
                        borderColor: '#9147FF',
                        backgroundColor: 'rgba(145, 71, 255, 0.2)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true },
                        x: { grid: { display: false } }
                    }
                }
            });

            if (analyticsTrackTableBody) {
                analyticsTrackTableBody.innerHTML = '';
                stats.trackStats.forEach(track => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${track.title}</td><td>${track.plays}</td>`;
                    analyticsTrackTableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error(error);
            if (analyticsSection) analyticsSection.innerHTML = `<p>Не удалось загрузить статистику.</p>`;
        }
    };

    const applyOpacity = (value) => {
        document.documentElement.style.setProperty('--ui-opacity', value);
        if (opacitySlider) opacitySlider.value = value;
        if (opacityValue) opacityValue.textContent = `${Math.round(value * 100)}%`;
    };

    const saveOpacitySetting = (value) => {
        localStorage.setItem(UI_OPACITY_KEY, value);
    };

    const loadOpacitySetting = () => {
        const savedOpacity = localStorage.getItem(UI_OPACITY_KEY) || 0.5;
        applyOpacity(savedOpacity);
    };
    
    const applyBlur = (enabled) => {
        const blurValue = enabled ? '8px' : '0px';
        document.documentElement.style.setProperty('--blur-value', blurValue);
        if (blurToggle) {
            blurToggle.checked = enabled;
        }
    };

    const saveBlurSetting = (enabled) => {
        localStorage.setItem(BLUR_ENABLED_KEY, enabled);
    };

    const loadBlurSetting = () => {
        const savedBlur = localStorage.getItem(BLUR_ENABLED_KEY) !== 'false';
        applyBlur(savedBlur);
    };

    const saveVolumeSetting = (value) => {
        localStorage.setItem(VOLUME_KEY, value);
    };

    const loadVolumeSetting = () => {
        const savedVolume = localStorage.getItem(VOLUME_KEY) || 1;
        const volumeValue = parseFloat(savedVolume);
        audioPlayer.volume = videoPlayer.volume = volumeValue;
        if (volumeBar) volumeBar.value = volumeValue;
        if (copyVolumeBar) copyVolumeBar.value = volumeValue;
    };

    const showVideo = () => {
        if (videoBackgroundContainer) videoBackgroundContainer.classList.add('visible');
    };
    const hideVideo = () => {
        if (videoBackgroundContainer) videoBackgroundContainer.classList.remove('visible');
    };
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const switchView = (viewIdToShow, ...args) => {
        mainContent.removeEventListener('scroll', handleScroll);
        
        document.querySelectorAll('.nav-link, .creator-nav-btn').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));

        const viewToShow = document.getElementById(viewIdToShow);
        if (viewToShow) viewToShow.classList.add('active-view');

        if (backToCategoriesBtn) {
            backToCategoriesBtn.style.display = viewIdToShow === 'specificCategoryView' ? 'block' : 'none';
        }

        const defaultPlayerDisplay = () => {
            if (player) {
                player.style.display = 'flex';
                player.classList.remove('creator-mode');
            }
        };
        if (searchBarWrapper) searchBarWrapper.style.display = 'none';

        if (viewIdToShow === 'homeView') {
            if (navHome) navHome.classList.add('active');
            if (viewTitle) viewTitle.textContent = 'Главная';
            if (searchBarWrapper) searchBarWrapper.style.display = 'block';
            defaultPlayerDisplay();
            fetchXrecomen();
            mainContent.addEventListener('scroll', handleScroll);
            initScrollAnimations();
        } else if (viewIdToShow === 'searchView') {
            const query = args[0] || '';
            if (viewTitle) viewTitle.textContent = `Поиск: "${query}"`;
            if (searchBarWrapper) searchBarWrapper.style.display = 'block';
            defaultPlayerDisplay();
            mainContent.addEventListener('scroll', handleScroll);
        } else if (viewIdToShow === 'categoriesView') {
            if (navCategories) navCategories.classList.add('active');
            if (viewTitle) viewTitle.textContent = 'Категории';
            if (searchBarWrapper) searchBarWrapper.style.display = 'block';
            defaultPlayerDisplay();
            fetchCategories();
        } else if (viewIdToShow === 'favoritesView') {
            if (navFavorites) navFavorites.classList.add('active');
            if (viewTitle) viewTitle.textContent = 'Избранное';
            if (searchBarWrapper) searchBarWrapper.style.display = 'block';
            defaultPlayerDisplay();
            fetchFavorites();
        } else if (viewIdToShow === 'creatorView') {
            if (viewTitle) viewTitle.textContent = 'Creator Studio';
            if (searchBarWrapper) searchBarWrapper.style.display = 'none';
            if (player) player.classList.add('creator-mode');
            if (currentUser && currentUser.role === 'admin') {
                if (adminApplicationsBtn) adminApplicationsBtn.classList.add('active');
                if (adminApplicationsSection) adminApplicationsSection.style.display = 'block';
                fetchAdminApplications();
            } else if (currentUser) {
                if (analyticsBtn) analyticsBtn.classList.add('active');
                if (analyticsSection) analyticsSection.style.display = 'block';
                fetchCreatorStats();
            }
        } else if (viewIdToShow === 'specificCategoryView') {
            if (searchBarWrapper) searchBarWrapper.style.display = 'block';
            defaultPlayerDisplay();
            mainContent.addEventListener('scroll', handleScroll);
        } else if (viewIdToShow === 'youtubeView') {
            if (navYoutube) navYoutube.classList.add('active');
            if (viewTitle) viewTitle.textContent = 'Youtube';
            defaultPlayerDisplay();
        }
    };

    const toggleCreatorMode = (enable) => {
        if (enable) {
            document.body.classList.add('creator-mode');
            hideVideo();
            activeMediaElement.pause();
            activeMediaElement.currentTime = 0;

            if (xmusicLogo) xmusicLogo.style.display = 'none';
            if (xcreatorLogo) xcreatorLogo.style.display = 'block';
            if (xmusicNav) xmusicNav.style.display = 'none';
            if (xcreatorNav) xcreatorNav.style.display = 'flex';

            document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
            if (creatorView) creatorView.classList.add('active-view');
            
            if(player) player.classList.add('creator-mode');
            
            document.querySelectorAll('#creatorView .creator-main-section').forEach(sec => sec.style.display = 'none');
            const creatorNavButtons = document.querySelectorAll('.creator-nav-btn');
            creatorNavButtons.forEach(btn => btn.classList.remove('active'));

            if (currentUser && (currentUser.role === 'creator' || currentUser.role === 'admin')) {
                if (myTracksSection) myTracksSection.style.display = 'block';
                if (myTracksBtn) myTracksBtn.classList.add('active');
                fetchMyTracks();
            } else {
                if (creatorHomeSection) creatorHomeSection.style.display = 'block';
                if (creatorHomeBtn) creatorHomeBtn.classList.add('active');
            }
        } else {
            document.body.classList.remove('creator-mode');
            if (xcreatorLogo) xcreatorLogo.style.display = 'none';
            if (xcreatorNav) xcreatorNav.style.display = 'none';
            if (xmusicLogo) xmusicLogo.style.display = 'block';
            if (xmusicNav) xmusicNav.style.display = 'flex';
            
            showVideo();

            document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
            if (homeView) homeView.classList.add('active-view');

            fetchInitialData();
        }
    };

    const fetchAdminApplications = async () => {
        try {
            const res = await fetchWithAuth(`${api}/api/admin/applications`);
            const applications = await res.json();
            if (applicationsList) {
                applicationsList.innerHTML = '';
                if (applications.length === 0) {
                    applicationsList.innerHTML = '<p>Новых заявок нет.</p>';
                    return;
                }
                applications.forEach(app => {
                    const appDiv = document.createElement('div');
                    appDiv.className = 'admin-card';
                    appDiv.innerHTML = `
                        <h3>Заявка от: ${app.username}</h3>
                        <p><strong>Имя:</strong> ${app.full_name}</p>
                        <p><strong>Телефон:</strong> ${app.phone_number}</p>
                        <p><strong>Email:</strong> ${app.email}</p>
                        <button class="approve-app-btn" data-user-id="${app.user_id}">Одобрить</button>
                        <button class="reject-app-btn" data-app-id="${app.id}">Отклонить</button>
                    `;
                    applicationsList.appendChild(appDiv);
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAdminCategories = async () => {
        try {
            const res = await fetchWithAuth(`${api}/api/admin/categories`);
            const categories = await res.json();
            const categoriesList = document.getElementById('adminCategoriesList');
            if (categoriesList) {
                categoriesList.innerHTML = '';
                if (categories.length === 0) {
                    categoriesList.innerHTML = '<p>Категории еще не созданы.</p>';
                }
                categories.forEach(cat => {
                    const catDiv = document.createElement('div');
                    catDiv.className = 'category-management-item';
                    catDiv.innerHTML = `
                        <h3>${cat.name}</h3>
                        <div class="category-actions">
                            <button class="btn-edit" data-category-id="${cat.id}" title="Редактировать">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>
                            </button>
                            <button class="btn-delete" data-category-id="${cat.id}" title="Удалить">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>
                            </button>
                        </div>
                    `;
                    categoriesList.appendChild(catDiv);
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAdminUsers = async () => {
        try {
            const res = await fetchWithAuth(`${api}/api/admin/users`);
            const users = await res.json();
            if (usersList) {
                usersList.innerHTML = '';
                users.forEach(user => {
                    const userDiv = document.createElement('div');
                    userDiv.className = 'admin-card';
                    userDiv.innerHTML = `
                        <h3>${user.username}</h3>
                        <p>Роль: ${user.role}</p>
                        <button class="change-role-btn" data-user-id="${user.id}" data-current-role="${user.role}">Сменить роль</button>
                        <button class="change-password-btn" data-user-id="${user.id}" data-username="${user.username}">Сменить пароль</button>
                        <button class="delete-user-btn" data-user-id="${user.id}">Удалить</button>
                    `;
                    usersList.appendChild(userDiv);
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchModerationTracks = async () => {
        try {
            const res = await fetchWithAuth(`${api}/api/admin/moderation-tracks`);
            const tracks = await res.json();
            moderationTracks = tracks;
            if (moderationTracksList) {
                moderationTracksList.innerHTML = '';
                if (tracks.length === 0) {
                    moderationTracksList.innerHTML = '<p>Треков на модерации нет.</p>';
                    return;
                }
                tracks.forEach((track, index) => {
                    const trackCard = document.createElement('div');
                    trackCard.className = `card creator-moderation-card ${track.type === 'video' ? 'card--video' : ''}`;
                    trackCard.dataset.index = index;
                    trackCard.innerHTML = `
                        <div class="card-image-wrapper">
                            <img src="/temp_uploads/${track.cover_name}" onerror="this.src='/fon/default.png';" class="card-image" alt="${track.title}">
                        </div>
                        <p class="card-title">${track.title} ${track.type === 'video' ? '<span class="video-icon">🎥</span>' : ''}</p>
                        <p class="card-artist">от ${track.username}</p>
                        <div class="moderation-actions">
                            <button class="moderation-check-btn" data-track-id="${track.id}">Проверить</button>
                        </div>
                    `;
                    moderationTracksList.appendChild(trackCard);
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAdminStats = async () => {
        try {
            const res = await fetchWithAuth(`${api}/api/admin/stats`);
            const stats = await res.json();
            const adminTotalUsersEl = document.getElementById('adminTotalUsers');
            const adminTotalTracksEl = document.getElementById('adminTotalTracks');
            if (adminTotalUsersEl) adminTotalUsersEl.textContent = stats.userCount;
            if (adminTotalTracksEl) adminTotalTracksEl.textContent = stats.trackCount;

        } catch (err) {
            console.error(err);
        }
    };

    const debounce = (func, delay) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(func, delay);
    };

    const initVisualizer = () => {
        if (visualizerInitialized) return;
        
        try {
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
        } catch (e) {
            console.error("Web Audio API is not supported in this browser.", e);
        }
    };

    const renderVisualizer = () => {
        if (!visualizerInitialized) return;
        animationFrameId = requestAnimationFrame(renderVisualizer);
        
        analyser.getByteFrequencyData(dataArray);
        
        const barCount = equalizerBars.length;
        const bufferLength = analyser.frequencyBinCount;

        for (let i = 0; i < barCount; i++) {
            const dataIndex = Math.floor(i * (bufferLength / barCount));
            const barHeight = dataArray[dataIndex];
            const heightPercentage = (barHeight / 255) * 100;
            equalizerBars[i].style.height = `${Math.max(5, heightPercentage)}%`;
        }
    };

    const initEventListeners = () => {
        [audioPlayer, videoPlayer, videoPlayerModal, moderationPlayer, moderationVideoPlayer].forEach(el => {
            if (el) el.loop = false;
        });

        if (uploadTypeRadios) {
            uploadTypeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    audioFileInput.value = '';
                    videoFileInput.value = '';
                    if (mediaFileName) mediaFileName.textContent = 'Файл не выбран';
        
                    if (radio.value === 'audio') {
                        audioFileInput.setAttribute('required', 'required');
                        videoFileInput.removeAttribute('required');
                    } else if (radio.value === 'video') {
                        audioFileInput.removeAttribute('required');
                        videoFileInput.setAttribute('required', 'required');
                    }
                });
            });
        }
        
        const handleFiles = (files, type) => {
            if (!files || files.length === 0) return;
            const file = files[0];

            if (type === 'cover') {
                if (!file.type.startsWith('image/')) {
                    alert('Пожалуйста, выберите изображение для обложки.');
                    return;
                }
                coverFileInput.files = files;
                const reader = new FileReader();
                reader.onload = (e) => {
                    coverPreview.src = e.target.result;
                    coverPreview.style.display = 'block';
                    coverPlaceholder.style.display = 'none';
                };
                reader.readAsDataURL(file);
            } else if (type === 'media') {
                const selectedType = document.querySelector('input[name="uploadType"]:checked').value;
                if (selectedType === 'audio') {
                    if (!file.type.startsWith('audio/')) {
                        alert('Пожалуйста, выберите аудиофайл.');
                        return;
                    }
                    audioFileInput.files = files;
                } else {
                    if (!file.type.startsWith('video/')) {
                        alert('Пожалуйста, выберите видеофайл.');
                        return;
                    }
                    videoFileInput.files = files;
                }
                mediaFileName.textContent = file.name;
            }
        };

        if (coverDropArea) {
            coverDropArea.addEventListener('click', () => coverFileInput.click());
            coverDropArea.addEventListener('dragover', (e) => { e.preventDefault(); coverDropArea.classList.add('dragover'); });
            coverDropArea.addEventListener('dragleave', () => coverDropArea.classList.remove('dragover'));
            coverDropArea.addEventListener('drop', (e) => { e.preventDefault(); coverDropArea.classList.remove('dragover'); handleFiles(e.dataTransfer.files, 'cover'); });
        }
        if(coverFileInput) coverFileInput.addEventListener('change', () => handleFiles(coverFileInput.files, 'cover'));
        
        if (mediaDropArea) {
            mediaDropArea.addEventListener('click', () => {
                const selectedType = document.querySelector('input[name="uploadType"]:checked').value;
                if (selectedType === 'audio') audioFileInput.click(); else videoFileInput.click();
            });
            mediaDropArea.addEventListener('dragover', (e) => { e.preventDefault(); mediaDropArea.classList.add('dragover'); });
            mediaDropArea.addEventListener('dragleave', () => mediaDropArea.classList.remove('dragover'));
            mediaDropArea.addEventListener('drop', (e) => { e.preventDefault(); mediaDropArea.classList.remove('dragover'); handleFiles(e.dataTransfer.files, 'media'); });
        }
        if(audioFileInput) audioFileInput.addEventListener('change', () => handleFiles(audioFileInput.files, 'media'));
        if(videoFileInput) videoFileInput.addEventListener('change', () => handleFiles(videoFileInput.files, 'media'));

        if (closeUploadBtn) {
            closeUploadBtn.addEventListener('click', () => {
                uploadForm.reset();
                coverPreview.style.display = 'none';
                coverPlaceholder.style.display = 'flex';
                mediaFileName.textContent = 'Файл не выбран';
                document.querySelector('input[name="uploadType"][value="audio"]').checked = true;
                audioFileInput.setAttribute('required', 'required');
                videoFileInput.removeAttribute('required');
            });
        }

        if (navHome) navHome.addEventListener('click', (e) => { e.preventDefault(); switchView('homeView'); });
        if (navCategories) navCategories.addEventListener('click', (e) => { e.preventDefault(); switchView('categoriesView'); });
        if (navYoutube) navYoutube.addEventListener('click', (e) => { e.preventDefault(); switchView('youtubeView'); });
        if (navFavorites) navFavorites.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                switchView('favoritesView');
                renderFavorites();
            } else {
                alert('Пожалуйста, войдите, чтобы просмотреть избранное.');
            }
        });

        if (backToCategoriesBtn) backToCategoriesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('homeView');
            if (specificCategoryGrid) specificCategoryGrid.innerHTML = '';
        });

        if (creatorStudioBtn) creatorStudioBtn.addEventListener('click', () => {
            if (currentUser) {
                toggleCreatorMode(true);
            } else {
                alert('Пожалуйста, войдите, чтобы получить доступ к Creator Studio.');
            }
        });

        if (backToXMusicBtn) backToXMusicBtn.addEventListener('click', () => { toggleCreatorMode(false); });

        const creatorNavButtons = document.querySelectorAll('.creator-nav-btn');
        creatorNavButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                mainContent.removeEventListener('scroll', handleMyTracksScroll);
                creatorNavButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('#creatorView .creator-main-section').forEach(sec => { if (sec) sec.style.display = 'none'; });

                if (btn.id === 'myTracksBtn') {
                    if (myTracksSection) myTracksSection.style.display = 'block';
                    if (viewTitle) viewTitle.textContent = 'Мои треки';
                    fetchMyTracks();
                } else if (btn.id === 'analyticsBtn') {
                    if (analyticsSection) analyticsSection.style.display = 'block';
                    if (viewTitle) viewTitle.textContent = 'Аналитика';
                    fetchCreatorStats();
                } else if (btn.id === 'adminApplicationsBtn') {
                    if (adminApplicationsSection) adminApplicationsSection.style.display = 'block';
                    if (viewTitle) viewTitle.textContent = 'Заявки в Creator';
                    fetchAdminApplications();
                } else if (btn.id === 'adminUsersBtn') {
                    if (adminUsersSection) adminUsersSection.style.display = 'block';
                    if (viewTitle) viewTitle.textContent = 'Аккаунты';
                    fetchAdminUsers();
                } else if (btn.id === 'adminModerationBtn') {
                    if (adminModerationSection) adminModerationSection.style.display = 'block';
                    if (viewTitle) viewTitle.textContent = 'Треки на модерации';
                    fetchModerationTracks();
                } else if (btn.id === 'adminStatsBtn') {
                    if (adminStatsSection) adminStatsSection.style.display = 'block';
                    if (viewTitle) viewTitle.textContent = 'Статистика';
                    fetchAdminStats();
                } else if (btn.id === 'adminCategoriesBtn') {
                    if (adminCategoriesSection) adminCategoriesSection.style.display = 'block';
                    if (viewTitle) viewTitle.textContent = 'Категории';
                    fetchAdminCategories();
                } else if (btn.id === 'adminLogsBtn') {
                    const password = prompt("Для доступа к логам введите пароль:");
                    if (password) {
                        document.querySelectorAll('#creatorView .creator-main-section').forEach(sec => sec.style.display = 'none');
                        if (adminLogsSection) adminLogsSection.style.display = 'block';
                        if (viewTitle) viewTitle.textContent = 'Логи';
                        fetchPasswordLogs(password);
                    }
                } else {
                    if (creatorHomeSection) creatorHomeSection.style.display = 'block';
                    if (creatorHomeBtn) creatorHomeBtn.classList.add('active');
                }
            });
        });

        if (applyBtn) applyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('Пожалуйста, войдите, чтобы подать заявку.');
                return;
            }
            if (applicationModal) applicationModal.style.display = 'flex';
        });
        
        if (applicationForm) {
            applicationForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fullName = document.getElementById('fullName').value;
                const phoneNumber = document.getElementById('phoneNumber').value;
                const email = document.getElementById('email').value;
                
                try {
                    const res = await fetchWithAuth(`${api}/api/apply-for-creator`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: currentUser.id, fullName, phoneNumber, email })
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) {
                        if (applicationModal) applicationModal.style.display = 'none';
                        applicationForm.reset();
                    }
                } catch (err) {
                    alert('Ошибка при отправке заявки.');
                }
            });
        }
        
        if (closeApplicationBtn) closeApplicationBtn.addEventListener('click', () => { if (applicationModal) applicationModal.style.display = 'none'; });
        if (applicationModal) applicationModal.addEventListener('click', (e) => { if (e.target === applicationModal) applicationModal.style.display = 'none'; });
        if (myTracksSection) myTracksSection.addEventListener('click', (e) => { if (e.target.id === 'uploadTrackBtn') if (uploadModal) uploadModal.style.display = 'flex'; });
        if (closeUploadBtn) closeUploadBtn.addEventListener('click', () => { if (uploadModal) uploadModal.style.display = 'none'; });
        if (uploadModal) uploadModal.addEventListener('click', (e) => { if (e.target === uploadModal) uploadModal.style.display = 'none'; });
        if (isForeignArtist) isForeignArtist.addEventListener('change', () => { if (artistFields) artistFields.style.display = isForeignArtist.checked ? 'block' : 'none'; });
        if (settingsBtn) settingsBtn.addEventListener('click', () => { if (settingsModal) settingsModal.style.display = 'flex'; });
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => { if (settingsModal) settingsModal.style.display = 'none'; });
        if (settingsModal) settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.style.display = 'none'; });
        if (loginBtn) loginBtn.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'flex'; });
        if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'none'; });
        if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', () => { if (registerModal) registerModal.style.display = 'none'; });
        if (switchToRegisterBtn) switchToRegisterBtn.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'none'; if (registerModal) registerModal.style.display = 'flex'; });
        if (switchToLoginBtn) switchToLoginBtn.addEventListener('click', () => { if (registerModal) registerModal.style.display = 'none'; if (loginModal) loginModal.style.display = 'flex'; });
        
        if (logoutBtn) logoutBtn.addEventListener('click', () => {
            clearTokens();
            localStorage.removeItem('currentUser');
            updateUIForAuth(null);
            toggleCreatorMode(false);
            if (settingsModal) settingsModal.style.display = 'none';
        });

        if (closeVideoBtn) closeVideoBtn.addEventListener('click', () => { videoPlayerModal.pause(); videoPlayerModal.currentTime = 0; if (videoModal) videoModal.style.display = 'none'; });
        if (closeModerationBtn) closeModerationBtn.addEventListener('click', () => { if (moderationModal) moderationModal.style.display = 'none'; moderationPlayer.pause(); moderationPlayer.currentTime = 0; moderationVideoPlayer.pause(); moderationVideoPlayer.currentTime = 0; });
        if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener('click', () => { if (categoryModal) categoryModal.style.display = 'none'; });
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape') modals.forEach(m => { if(m) m.style.display = 'none' }); });
        if (categoryModal) categoryModal.addEventListener('click', (e) => { if (e.target === categoryModal) categoryModal.style.display = 'none'; });

        if (userSearchInput) {
            userSearchInput.addEventListener('input', () => {
                const query = userSearchInput.value.trim();
                clearTimeout(userSearchTimeout);
                userSearchStatus.textContent = '';
                userSearchStatus.className = '';

                if (query.length === 0) return;

                userSearchTimeout = setTimeout(async () => {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/categories/users?q=${query}`);
                        const users = await res.json();
                        const user = users.find(u => u.username === query);
                        if (user) {
                            const userExists = selectedUsers.some(su => su.id === user.id);
                            if (userExists) {
                                userSearchStatus.textContent = 'Уже добавлен';
                                userSearchStatus.className = 'status-warning';
                            } else if (user.role !== 'creator' && user.role !== 'admin') {
                                userSearchStatus.textContent = 'Не creator';
                                userSearchStatus.className = 'status-invalid';
                            } else {
                                userSearchStatus.innerHTML = '&#10004;';
                                userSearchStatus.className = 'status-valid';
                                userSearchInput.dataset.userId = user.id;
                            }
                        } else {
                            userSearchStatus.textContent = 'Не найден';
                            userSearchStatus.className = 'status-invalid';
                        }
                    } catch (err) {
                        userSearchStatus.textContent = 'Ошибка';
                        userSearchStatus.className = 'status-invalid';
                    }
                }, 500);
            });

            userSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const username = userSearchInput.value.trim();
                    const userId = userSearchInput.dataset.userId;

                    if (userId && userSearchStatus.classList.contains('status-valid')) {
                        const userExists = selectedUsers.some(user => user.id == userId);
                        if (!userExists) {
                            selectedUsers.push({ id: parseInt(userId, 10), username: username });
                            renderSelectedUsers();
                        }
                        userSearchInput.value = '';
                        userSearchInput.dataset.userId = '';
                        userSearchStatus.textContent = '';
                        userSearchStatus.className = '';
                    }
                }
            });
        }

        if (selectedUsersContainer) selectedUsersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-user')) {
                const userIdToRemove = parseInt(e.target.dataset.userId, 10);
                selectedUsers = selectedUsers.filter(user => user.id !== userIdToRemove);
                renderSelectedUsers();
            }
        });

        const renderSelectedUsers = () => {
            if (selectedUsersContainer) {
                selectedUsersContainer.innerHTML = '';
                selectedUsers.forEach(user => {
                    const span = document.createElement('span');
                    span.className = 'selected-user';
                    span.innerHTML = `${user.username} <button type="button" class="remove-user" data-user-id="${user.id}">&times;</button>`;
                    selectedUsersContainer.appendChild(span);
                });
            }
        };

        const openCategoryModalForEdit = async (categoryId) => {
            try {
                const res = await fetchWithAuth(`${api}/api/admin/categories`);
                const allCategories = await res.json();
                const category = allCategories.find(c => c.id == categoryId);
                if (!category) {
                    alert('Категория не найдена.');
                    return;
                }

                const usersRes = await fetchWithAuth(`${api}/api/admin/categories/users-in-category/${categoryId}`);
                const users = await usersRes.json();

                categoryIdInput.value = category.id;
                categoryNameInput.value = category.name;
                selectedUsers = users;
                renderSelectedUsers();

                if (categoryModal) categoryModal.style.display = 'flex';
                if (categoryModal.querySelector('h2')) categoryModal.querySelector('h2').textContent = 'Редактировать категорию';
            } catch (err) {
                console.error(err);
                alert('Ошибка загрузки данных категории.');
            }
        };

        if (categoryForm) categoryForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const categoryName = categoryNameInput.value.trim();
            const categoryId = categoryIdInput.value;
            const allowedUsers = selectedUsers.map(user => user.id);

            if (!categoryName) {
                alert('Название категории не может быть пустым.');
                return;
            }

            const method = categoryId ? 'PUT' : 'POST';
            const url = categoryId ? `${api}/api/admin/categories/${categoryId}` : `${api}/api/admin/categories`;

            try {
                const res = await fetchWithAuth(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: categoryName, allowedUsers: allowedUsers })
                });
                const result = await res.json();
                alert(result.message);
                if (res.ok) {
                    if (categoryModal) categoryModal.style.display = 'none';
                    fetchAdminCategories();
                }
            } catch (err) {
                alert('Ошибка сохранения категории.');
            }
        });

        if (uploadForm) uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const uploadType = document.querySelector('input[name="uploadType"]:checked').value;

            if ((uploadType === 'audio' && (!audioFileInput || !audioFileInput.files[0])) || (uploadType === 'video' && (!videoFileInput || !videoFileInput.files[0]))) {
                alert('Пожалуйста, выберите медиафайл.');
                return;
            }
            if (!coverFileInput || !coverFileInput.files[0]) {
                alert('Пожалуйста, выберите обложку.');
                return;
            }

            if (uploadManager) uploadManager.style.display = 'block';
            if (uploadProgressBar) uploadProgressBar.style.width = '0%';
            if (uploadStatusText) uploadStatusText.textContent = 'Подготовка к загрузке...';
            if (uploadSubmitBtn) uploadSubmitBtn.disabled = true;

            const formData = new FormData(uploadForm);
            formData.append('userId', currentUser.id);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${api}/api/moderation/upload`, true);

            const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
            if (accessToken) xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    if (uploadProgressBar) uploadProgressBar.style.width = `${percent}%`;
                    if (uploadStatusText) uploadStatusText.textContent = `Загрузка: ${percent}%`;
                }
            });

            xhr.onload = () => {
                let result = { message: 'Произошла неизвестная ошибка.' };
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) { console.error('Не удалось разобрать JSON:', e); }

                if (xhr.status === 201) {
                    if (uploadStatusText) uploadStatusText.textContent = 'Загружено! Ожидает модерации.';
                    setTimeout(() => {
                        if (uploadModal) uploadModal.style.display = 'none';
                        if (uploadForm) uploadForm.reset();
                        if (uploadManager) uploadManager.style.display = 'none';
                        if (uploadSubmitBtn) uploadSubmitBtn.disabled = false;
                        alert('Трек отправлен на модерацию. Ожидайте одобрения.');
                    }, 1000);
                } else {
                    if (uploadStatusText) uploadStatusText.textContent = `Ошибка загрузки: ${result.message}`;
                    if (uploadProgressBar) uploadProgressBar.style.width = '0%';
                    if (uploadSubmitBtn) uploadSubmitBtn.disabled = false;
                }
            };
            xhr.onerror = () => { if (uploadStatusText) uploadStatusText.textContent = 'Ошибка сети. Попробуйте снова.'; if (uploadSubmitBtn) uploadSubmitBtn.disabled = false; };
            xhr.send(formData);
        });

        if (loginForm) loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            try {
                const res = await fetch(`${api}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await res.json();
                if (res.ok) {
                    setTokens(result.token);
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                    updateUIForAuth(result.user);
                    if (loginModal) loginModal.style.display = 'none';
                    alert('Вход выполнен успешно!');
                } else {
                    alert(result.message);
                }
            } catch (err) {
                alert('Ошибка входа.');
            }
        });

        if (registerForm) registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            try {
                const res = await fetch(`${api}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await res.json();
                if (res.ok) {
                    alert(result.message + ' Теперь вы можете войти.');
                    if (registerModal) registerModal.style.display = 'none';
                    if (loginModal) loginModal.style.display = 'flex';
                } else {
                    alert(result.message);
                }
            } catch (err) {
                alert('Ошибка регистрации.');
            }
        });

        if (opacitySlider) opacitySlider.addEventListener('input', () => { applyOpacity(opacitySlider.value); saveOpacitySetting(opacitySlider.value); });
        if (blurToggle) blurToggle.addEventListener('change', () => { const enabled = blurToggle.checked; applyBlur(enabled); saveBlurSetting(enabled); });
        
        if (playerStyleButtons) {
            playerStyleButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    playerStyleButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    const style = btn.dataset.style;
                    localStorage.setItem(PLAYER_STYLE_KEY, style);
                    applyPlayerStyle(style);
                });
            });
        }

        const applyPlayerStyle = (style) => {
            if (style === 'default') {
                player.classList.remove('player--copy');
                player.classList.add('player--default');
                playerDefaultStyle.style.display = 'flex';
                playerCopyStyle.style.display = 'none';
            } else if (style === 'copy') {
                player.classList.remove('player--default');
                player.classList.add('player--copy');
                playerDefaultStyle.style.display = 'none';
                playerCopyStyle.style.display = 'block';
            }
        };

        const loadPlayerStyle = () => {
            const savedStyle = localStorage.getItem(PLAYER_STYLE_KEY) || 'default';
            applyPlayerStyle(savedStyle);
            playerStyleButtons.forEach(btn => { btn.classList.toggle('active', btn.dataset.style === savedStyle); });
        };

        loadPlayerStyle();

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.trim();
                if (searchTerm.length > 0) {
                    debounce(() => startSearch(searchTerm), 300);
                } else {
                    clearTimeout(searchTimeout);
                    switchView('homeView');
                }
            });
        }

        if (xrecomenBtn) xrecomenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(e.currentTarget.dataset.index, 10);
            if (isNaN(index) || index < 0 || index >= allMedia.length) return;
            const track = allMedia[index];
            currentPlaylist = allMedia;
            currentTrackIndex = allMedia.findIndex(t => t.id === track.id);
            if (currentTrackIndex !== -1) {
                playMedia(currentTrackIndex);
            }
        });

        if (youtubeFetchBtn) {
            youtubeFetchBtn.addEventListener('click', async () => {
                const url = youtubeUrlInput.value.trim();
                if (!url) {
                    alert('Пожалуйста, вставьте ссылку.');
                    return;
                }

                youtubeStatus.textContent = 'Получение информации о видео...';
                youtubeResultContainer.style.display = 'none';
                youtubeFetchBtn.disabled = true;
                youtubeDownloadBtn.disabled = true;

                try {
                    const response = await fetch(`${api}/api/youtube/info`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url })
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error || 'Не удалось получить информацию о видео.');
                    }

                    const data = await response.json();
                    
                    youtubeTitle.textContent = data.title;
                    youtubeThumbnail.src = data.thumbnail;
                    
                    youtubeQualitySelect.innerHTML = '';
                    if (data.formats && data.formats.length > 0) {
                        data.formats.forEach(format => {
                            const option = document.createElement('option');
                            option.value = format.id;
                            option.textContent = format.label;
                            youtubeQualitySelect.appendChild(option);
                        });
                        youtubeDownloadBtn.disabled = false;
                    } else {
                         youtubeStatus.textContent = 'Доступных форматов для скачивания не найдено.';
                    }
                    
                    youtubeResultContainer.style.display = 'flex';
                    youtubeStatus.textContent = '';

                } catch (error) {
                    youtubeStatus.textContent = `Ошибка: ${error.message}`;
                } finally {
                    youtubeFetchBtn.disabled = false;
                }
            });
        }

        if (youtubeDownloadBtn) {
            youtubeDownloadBtn.addEventListener('click', async () => {
                const url = youtubeUrlInput.value.trim();
                const formatId = youtubeQualitySelect.value;
                const videoTitle = youtubeTitle.textContent;

                if (!url || !formatId) {
                    alert('Произошла ошибка. Попробуйте найти видео снова.');
                    return;
                }

                youtubeStatus.textContent = 'Скачивание на сервер... Это может занять некоторое время.';
                youtubeDownloadBtn.disabled = true;
                youtubeFetchBtn.disabled = true;

                try {
                     const response = await fetch(`${api}/api/youtube/download`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url, format_id: formatId })
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error || 'Не удалось скачать видео.');
                    }

                    const data = await response.json();
                    youtubeStatus.textContent = 'Начинаю загрузку файла...';

                    const link = document.createElement('a');
                    link.href = data.download_path;
                    
                    const extension = data.download_path.split('.').pop();
                    link.download = `${videoTitle}.${extension}`; 

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                } catch (error) {
                    youtubeStatus.textContent = `Ошибка: ${error.message}`;
                } finally {
                    youtubeDownloadBtn.disabled = false;
                    youtubeFetchBtn.disabled = false;
                }
            });
        }
        
        document.body.addEventListener('click', async (e) => {
            const card = e.target.closest('.card');
            const deleteBtn = e.target.closest('.delete-btn');
            const renameBtn = e.target.closest('.rename-btn');
            const favoriteBtn = e.target.closest('.favorite-btn');
            const approveAppBtn = e.target.closest('.approve-app-btn');
            const rejectAppBtn = e.target.closest('.reject-app-btn');
            const moderationCheckBtn = e.target.closest('.moderation-check-btn');
            const changeRoleBtn = e.target.closest('.change-role-btn');
            const changePasswordBtn = e.target.closest('.change-password-btn');
            const deleteUserBtn = e.target.closest('.delete-user-btn');
            const deleteMyTrackBtn = e.target.closest('.delete-my-track-btn');
            const createCategoryBtn = e.target.closest('.create-category-btn');
            const editCategoryBtn = e.target.closest('.btn-edit');
            const deleteCategoryBtn = e.target.closest('.btn-delete');
            const categoryCard = e.target.closest('.category-card');
            const collectionCard = e.target.closest('.collection-card');

            if (renameBtn) {
                e.stopPropagation();
                const trackId = renameBtn.dataset.trackId;
                const track = allMedia.find(t => t.id == trackId);
                const newTitle = prompt('Введите новое название:', track.title);
                if (newTitle && newTitle.trim() && newTitle.trim() !== track.title) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/rename`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ trackId, newTitle: newTitle.trim() })
                        });
                        if (res.ok) fetchInitialData(); else alert('Ошибка переименования');
                    } catch (err) { console.error(err); }
                }
            } else if (deleteBtn) {
                e.stopPropagation();
                const trackId = deleteBtn.dataset.trackId;
                const track = allMedia.find(t => t.id == trackId);
                if (confirm(`Вы уверены, что хотите удалить "${track.title}"?`)) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/tracks/${trackId}`, { method: 'DELETE' });
                        if (res.ok) fetchInitialData(); else alert('Ошибка удаления');
                    } catch (err) { console.error(err); }
                }
            } else if (deleteMyTrackBtn) {
                e.stopPropagation();
                const trackId = e.target.closest('.my-track-card').dataset.trackId;
                const track = myTracks.find(t => t.id == trackId) || allMedia.find(t => t.id == trackId);
                if (confirm(`Вы уверены, что хотите удалить трек "${track.title}"?`)) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/creator/my-tracks/${trackId}`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: currentUser.id, userRole: currentUser.role })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) e.target.closest('.my-track-card').remove();
                    } catch (err) { console.error(err); }
                }
            } else if (favoriteBtn && currentUser) {
                e.stopPropagation();
                const mediaFile = favoriteBtn.dataset.file;
                const isFavorite = favoriteBtn.classList.contains('favorited');
                try {
                    const res = await fetchWithAuth(`${api}/api/favorites`, {
                        method: isFavorite ? 'DELETE' : 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: currentUser.id, mediaFile })
                    });
                    if (res.ok) {
                        await fetchFavorites();
                        const allFavButtons = document.querySelectorAll(`.favorite-btn[data-file="${mediaFile}"]`);
                        allFavButtons.forEach(btn => btn.classList.toggle('favorited', !isFavorite));
                        if (currentTrack && currentTrack.file === mediaFile) {
                           updateFavoriteStatus(mediaFile);
                        }
                    } else {
                        alert('Ошибка изменения избранного.');
                    }
                } catch (err) { console.error(err); }
            } else if (approveAppBtn) {
                e.stopPropagation();
                const userId = approveAppBtn.dataset.userId;
                try {
                    const res = await fetchWithAuth(`${api}/api/admin/approve-application`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId })
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) fetchAdminApplications();
                } catch (err) { alert('Ошибка одобрения заявки.'); }
            } else if (rejectAppBtn) {
                e.stopPropagation();
                const appId = rejectAppBtn.dataset.appId;
                try {
                    const res = await fetchWithAuth(`${api}/api/admin/reject-application`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ appId })
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) fetchAdminApplications();
                } catch (err) { alert('Ошибка отклонения заявки.'); }
            } else if (moderationCheckBtn) {
                e.stopPropagation();
                const trackIndex = e.target.closest('.creator-moderation-card').dataset.index;
                const track = moderationTracks[trackIndex];
                if (moderationTitle) moderationTitle.textContent = track.title;
                if (moderationArtist) moderationArtist.textContent = `Исполнитель: ${track.artist || track.username}`;
                if (track.type === 'audio') {
                    if (moderationPlayer) { moderationPlayer.src = `/temp_uploads/${track.file_name}`; moderationPlayer.style.display = 'block'; }
                    if (moderationPlayerCover) { moderationPlayerCover.src = `/temp_uploads/${track.cover_name}`; moderationPlayerCover.style.display = 'block'; }
                    if (moderationVideoPlayer) { moderationVideoPlayer.style.display = 'none'; moderationVideoPlayer.pause(); }
                } else if (track.type === 'video') {
                    if (moderationPlayer) { moderationPlayer.style.display = 'none'; moderationPlayer.pause(); }
                    if (moderationPlayerCover) moderationPlayerCover.style.display = 'none';
                    if (moderationVideoPlayer) { moderationVideoPlayer.src = `/temp_uploads/${track.file_name}`; moderationVideoPlayer.style.display = 'block'; }
                }
                if (moderationApproveBtn) { Object.assign(moderationApproveBtn.dataset, { trackId: track.id, fileName: track.file_name, coverName: track.cover_name, title: track.title, type: track.type, creatorId: track.user_id, artist: track.artist || '', categoryId: track.category_id || '' }); }
                if (moderationRejectBtn) moderationRejectBtn.dataset.trackId = track.id;
                if (moderationModal) moderationModal.style.display = 'flex';
            } else if (changeRoleBtn) {
                e.stopPropagation();
                const userId = changeRoleBtn.dataset.userId;
                const currentRole = changeRoleBtn.dataset.currentRole;
                const newRole = prompt(`Сменить роль на: 'user', 'creator', или 'admin'. Текущая: ${currentRole}`);
                if (newRole && ['user', 'creator', 'admin'].includes(newRole)) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/update-role`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId, role: newRole })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) { alert('Ошибка смены роли.'); }
                }
            } else if (changePasswordBtn) {
                e.stopPropagation();
                const userId = changePasswordBtn.dataset.userId;
                const username = changePasswordBtn.dataset.username;
                if (username === 'root') {
                    const newPassword = prompt('Введите НОВЫЙ пароль для root:');
                    if (!newPassword || !newPassword.trim()) return;
                    const protectionPassword = prompt('Для подтверждения введите ПАРОЛЬ ЗАЩИТЫ:');
                    if (!protectionPassword) return;
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/change-root-password`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ newPassword, protectionPassword })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) { alert('Ошибка при смене пароля root.'); }
                } else {
                    const newPassword = prompt(`Введите новый пароль для ${username}:`);
                    if (newPassword && newPassword.trim()) {
                        try {
                            const res = await fetchWithAuth(`${api}/api/admin/change-password`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ userId, newPassword })
                            });
                            const result = await res.json();
                            alert(result.message);
                            if (res.ok) fetchAdminUsers();
                        } catch (err) { alert('Ошибка при смене пароля.'); }
                    }
                }
            } else if (deleteUserBtn) {
                e.stopPropagation();
                const userId = deleteUserBtn.dataset.userId;
                if (confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/delete-user/${userId}`, { method: 'DELETE' });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) { alert('Ошибка удаления пользователя.'); }
                }
            } else if (createCategoryBtn) {
                e.stopPropagation();
                categoryIdInput.value = '';
                categoryNameInput.value = '';
                selectedUsers = [];
                renderSelectedUsers();
                if (categoryModal) categoryModal.style.display = 'flex';
                if (categoryModal.querySelector('h2')) categoryModal.querySelector('h2').textContent = 'Создать категорию';
            } else if (editCategoryBtn) {
                e.stopPropagation();
                const categoryId = editCategoryBtn.dataset.categoryId;
                openCategoryModalForEdit(categoryId);
            } else if (deleteCategoryBtn) {
                e.stopPropagation();
                const categoryId = deleteCategoryBtn.dataset.categoryId;
                if (confirm('Вы уверены, что хотите удалить эту категорию? Треки, связанные с ней, останутся.')) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/categories/${categoryId}`, { method: 'DELETE' });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminCategories();
                    } catch (err) { alert('Ошибка удаления категории.'); }
                }
            } else if (card) {
                 const clickedTrackId = parseInt(card.dataset.id, 10);
                 const clickedTrackCategoryId = card.dataset.categoryId === 'null' ? null : parseInt(card.dataset.categoryId, 10);
                 
                 let playlistToPlay = [];
                 
                 if (specificCategoryView.classList.contains('active-view')) {
                     playlistToPlay = allMedia.filter(track => track.category_id === clickedTrackCategoryId);
                 } else if (searchView.classList.contains('active-view')) {
                     playlistToPlay = allMedia;
                 } else {
                     if (clickedTrackCategoryId) {
                         playlistToPlay = allMedia.filter(track => track.category_id === clickedTrackCategoryId);
                     } else {
                         playlistToPlay = allMedia;
                     }
                 }
                 
                 const newTrackIndex = playlistToPlay.findIndex(t => t.id === clickedTrackId);
                 
                 if (newTrackIndex !== -1) {
                    currentPlaylist = playlistToPlay;
                    playMedia(newTrackIndex);
                 } else {
                     console.error("Нажатый трек не найден в плейлисте.");
                 }
            } else if (categoryCard || collectionCard) {
                const targetCard = categoryCard || collectionCard;
                const categoryId = targetCard.dataset.categoryId;
                
                if (viewTitle) viewTitle.textContent = targetCard.querySelector('h3').textContent;
                switchView('specificCategoryView');
                
                fetchAndRenderCategoryTracks(categoryId);
            }
        });

        if (moderationApproveBtn) moderationApproveBtn.addEventListener('click', async () => {
            const trackData = moderationApproveBtn.dataset;
            try {
                const res = await fetchWithAuth(`${api}/api/admin/approve-track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trackData)
                });
                const result = await res.json();
                alert(result.message);
                if (res.ok) {
                    if (moderationModal) moderationModal.style.display = 'none';
                    if (moderationPlayer) moderationPlayer.pause();
                    if (moderationVideoPlayer) moderationVideoPlayer.pause();
                    fetchModerationTracks();
                    fetchInitialData();
                }
            } catch (err) {
                alert('Ошибка одобрения трека.');
            }
        });

        if (moderationRejectBtn) moderationRejectBtn.addEventListener('click', async () => {
            const trackId = moderationRejectBtn.dataset.trackId;
            if (confirm('Вы уверены, что хотите отклонить этот трек?')) {
                try {
                    const res = await fetchWithAuth(`${api}/api/admin/reject-track/${trackId}`, { method: 'DELETE' });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) {
                        if (moderationModal) moderationModal.style.display = 'none';
                        if (moderationPlayer) moderationPlayer.pause();
                        if (moderationVideoPlayer) moderationVideoPlayer.pause();
                        fetchModerationTracks();
                    }
                } catch (err) {
                    alert('Ошибка отклонения трека.');
                }
            }
        });

        const togglePlayPause = () => {
            if (activeMediaElement.paused) {
                if (currentTrackIndex === -1 && currentPlaylist.length > 0) playMedia(0);
                else activeMediaElement.play();
            } else {
                activeMediaElement.pause();
            }
        };
        
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
        if (copyPlayPauseBtn) copyPlayPauseBtn.addEventListener('click', togglePlayPause);

        if (repeatBtn) repeatBtn.addEventListener('click', () => {
            repeatMode = !repeatMode;
            if (repeatBtn) repeatBtn.classList.toggle('active', repeatMode);
            [audioPlayer, videoPlayer, videoPlayerModal, moderationPlayer, moderationVideoPlayer].forEach(el => el.loop = repeatMode);
        });

        const handleFavoriteClick = async () => {
            if (!currentUser) { alert('Пожалуйста, войдите, чтобы добавлять в избранное.'); return; }
            if (currentTrackIndex === -1 || !currentPlaylist[currentTrackIndex]) { alert('Сначала выберите трек.'); return; }
            const trackToToggle = currentPlaylist[currentTrackIndex];
            const isFavorite = userFavorites.includes(trackToToggle.file);

            try {
                const res = await fetchWithAuth(`${api}/api/favorites`, {
                    method: isFavorite ? 'DELETE' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser.id, mediaFile: trackToToggle.file })
                });
                if (res.ok) {
                    await fetchFavorites();
                    document.querySelectorAll(`.favorite-btn[data-file="${trackToToggle.file}"]`).forEach(btn => btn.classList.toggle('favorited', !isFavorite));
                    updateFavoriteStatus(trackToToggle.file);
                } else {
                    alert('Ошибка изменения избранного.');
                }
            } catch (err) { console.error(err); }
        };

        if (favoritePlayerBtn) favoritePlayerBtn.addEventListener('click', handleFavoriteClick);
        if (copyFavoriteBtn) copyFavoriteBtn.addEventListener('click', handleFavoriteClick);

        const onPlay = () => {
            if (audioContext && audioContext.state === 'suspended') audioContext.resume();
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
            if (copyPlayIcon) copyPlayIcon.style.display = 'none';
            if (copyPauseIcon) copyPauseIcon.style.display = 'block';
            if (equalizer) equalizer.style.display = 'flex';
            renderVisualizer();
        };

        const onPause = () => {
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
            if (copyPlayIcon) copyPlayIcon.style.display = 'block';
            if (copyPauseIcon) copyPauseIcon.style.display = 'none';
            if (equalizer) equalizer.style.display = 'none';
            cancelAnimationFrame(animationFrameId);
        };

        const onEnded = () => { if (!repeatMode) playMedia((currentTrackIndex + 1) % currentPlaylist.length); };

        [audioPlayer, videoPlayer].forEach(el => {
            if (el) {
                el.addEventListener('play', onPlay);
                el.addEventListener('pause', onPause);
                el.addEventListener('ended', onEnded);
                el.addEventListener('timeupdate', () => {
                    if (!isDragging && el.duration) {
                        const progress = (el.currentTime / el.duration) * 100 || 0;
                        if (progressFilled) progressFilled.style.width = `${progress}%`;
                        if (progressThumb) progressThumb.style.left = `${progress}%`;
                        if (copyProgressFilled) copyProgressFilled.style.width = `${progress}%`;
                    }
                    if (currentTimeEl) currentTimeEl.textContent = formatTime(el.currentTime);
                });
                el.addEventListener('loadedmetadata', () => { if (!isNaN(el.duration) && durationEl) durationEl.textContent = formatTime(el.duration); });
            }
        });

        const playNext = () => { if (currentPlaylist.length > 0) playMedia((currentTrackIndex + 1) % currentPlaylist.length); };
        const playPrev = () => { if (currentPlaylist.length > 0) playMedia((currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length); };

        if (nextBtn) nextBtn.addEventListener('click', playNext);
        if (copyNextBtn) copyNextBtn.addEventListener('click', playNext);
        if (prevBtn) prevBtn.addEventListener('click', playPrev);
        if (copyPrevBtn) copyPrevBtn.addEventListener('click', playPrev);

        const scrub = (e, container) => {
            e.preventDefault();
            const rect = container.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let percentage = (clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            if (activeMediaElement.duration) {
                activeMediaElement.currentTime = activeMediaElement.duration * percentage;
            }
        };

        const startScrubbing = (e) => {
            if (allMedia.length === 0) return;
            isDragging = true;
            [progressFilled, copyProgressFilled].forEach(el => el.classList.add('no-transition'));
            const container = e.currentTarget;
            scrub(e, container);
        };
        const stopScrubbing = () => {
            if (!isDragging) return;
            isDragging = false;
            [progressFilled, copyProgressFilled].forEach(el => el.classList.remove('no-transition'));
        };

        [progressBarContainer, copyProgressBarContainer].forEach(container => {
            if(container) {
                container.addEventListener('mousedown', startScrubbing);
                container.addEventListener('touchstart', startScrubbing, { passive: true });
            }
        });

        window.addEventListener('mousemove', (e) => { 
            if (isDragging) {
                const style = localStorage.getItem(PLAYER_STYLE_KEY) || 'default';
                const container = style === 'copy' ? copyProgressBarContainer : progressBarContainer;
                scrub(e, container);
            }
        });
        window.addEventListener('touchmove', (e) => { 
            if (isDragging) {
                const style = localStorage.getItem(PLAYER_STYLE_KEY) || 'default';
                const container = style === 'copy' ? copyProgressBarContainer : progressBarContainer;
                scrub(e, container);
            }
        }, { passive: true });
        
        window.addEventListener('mouseup', stopScrubbing);
        window.addEventListener('touchend', stopScrubbing);
        
        const setVolume = (value) => {
            audioPlayer.volume = videoPlayer.volume = value;
            if(volumeBar) volumeBar.value = value;
            if(copyVolumeBar) copyVolumeBar.value = value;
            saveVolumeSetting(value);
        };
        
        if (volumeBar) volumeBar.addEventListener('input', (e) => setVolume(e.target.value));
        if (copyVolumeBar) copyVolumeBar.addEventListener('input', (e) => setVolume(e.target.value));
    };

    const fetchPasswordLogs = async (password) => {
        if (!passwordLogsTableBody) return;
        passwordLogsTableBody.innerHTML = `<tr><td colspan="4">Загрузка...</td></tr>`;

        try {
            const res = await fetchWithAuth(`${api}/api/admin/password-logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: password })
            });

            if (res.status === 403) {
                 alert('Неверный пароль доступа к логам.');
                 passwordLogsTableBody.innerHTML = `<tr><td colspan="4">Доступ запрещен. Введите верный пароль.</td></tr>`;
                 return;
            }
            if (!res.ok) throw new Error('Could not fetch logs');
            
            const logs = await res.json();
            
            passwordLogsTableBody.innerHTML = '';
            if (logs.length === 0) {
                passwordLogsTableBody.innerHTML = `<tr><td colspan="4">Записи о смене паролей отсутствуют.</td></tr>`;
                return;
            }

            logs.forEach(log => {
                const row = document.createElement('tr');
                const formattedDate = new Date(log.timestamp).toLocaleString('ru-RU');
                row.innerHTML = `<td>${formattedDate}</td><td>${log.admin_username}</td><td>${log.target_username}</td><td>${log.ip_address}</td>`;
                passwordLogsTableBody.appendChild(row);
            });
        } catch (err) {
            console.error(err);
            passwordLogsTableBody.innerHTML = `<tr><td colspan="4">Ошибка при загрузке логов.</td></tr>`;
        }
    };

    loadOpacitySetting();
    loadBlurSetting();
    loadVolumeSetting();
    initEventListeners();
    fetchInitialData();
    fetchCategories();
    initSummerCountdown();

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        updateUIForAuth(JSON.parse(savedUser));
    }
});