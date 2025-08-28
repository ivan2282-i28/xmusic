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
    let currentPage = 1;
    const tracksPerPage = 20;
    const BLUR_KEY = "blur_enabled";

    // Новые элементы для жанров
    const determineGenreBtn = document.getElementById('determineGenreBtn');
    const selectGenreBtn = document.getElementById('selectGenreBtn');
    const selectedGenreName = document.getElementById('selectedGenreName');
    const selectedGenreId = document.getElementById('selectedGenreId'); // hidden input to store genre name
    const genreSelectionModal = document.getElementById('genreSelectionModal');
    const genreList = document.getElementById('genreList');

    const ACCESS_TOKEN_KEY = "access_token"
    const REFRESH_TOKEN_KEY = "refresh_token"
    const VOLUME_KEY = "volume_level"

    const mainContent = document.querySelector('.main-content');
    const allGridContainer = document.getElementById('allGridContainer');
    const popularCategoriesGrid = document.getElementById('popularCategoriesGrid');
    const allCategoriesGrid = document.getElementById('allCategoriesGrid');
    const customCategoriesGrid = document.getElementById('customCategoriesGrid');
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
    const playerHeader = document.querySelector('.player-header');
    const playerTrackInfo = player.querySelector('.track-info');
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
    const videoBackgroundContainer = document.getElementById('videoBackgroundContainer');
    const controlButtonsAndProgress = document.querySelector('.control-buttons-and-progress');
    const volumeControls = document.querySelector('.volume-controls');

    const uploadModal = document.getElementById('uploadModal');
    const closeUploadBtn = uploadModal.querySelector('.close-btn');
    const uploadForm = document.getElementById('uploadForm');
    const uploadTypeRadios = document.querySelectorAll('input[name="uploadType"]');
    const audioFields = document.getElementById('audioFields');
    const videoFields = document.getElementById('videoFields');
    const uploadManager = document.getElementById('uploadManager');
    const uploadProgressBar = document.querySelector('.upload-progress-fill');
    const uploadStatusText = document.getElementById('uploadStatusText');
    const uploadSubmitBtn = document.querySelector('#uploadForm button[type="submit"]');
    const categorySelect = document.getElementById('categorySelect');
    const artistFields = document.getElementById('artistFields');
    const isForeignArtist = document.getElementById('isForeignArtist');
    const fileStatusText = document.getElementById('fileStatusText');

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
    const welcomeMessage = document.getElementById('welcomeMessage');
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
    const adminApplicationsSection = document.getElementById('adminApplicationsSection');
    const adminUsersSection = document.getElementById('adminUsersSection');
    const adminModerationSection = document.getElementById('adminModerationSection');
    const adminStatsSection = document.getElementById('adminStatsSection');
    const adminCategoriesSection = document.getElementById('adminCategoriesSection');
    const applicationsList = document.getElementById('applicationsList');
    const usersList = document.getElementById('usersList');
    const moderationTracksList = document.getElementById('moderationTracksList');
    const statsContent = document.getElementById('statsContent');

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
    const youMayLikeSection = document.getElementById('youMayLikeSection');
    const youMayLikeGrid = document.getElementById('youMayLikeGrid');
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

    // Новые элементы для управления категориями
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
    const categoryForm = document.getElementById('categoryForm');
    const categoryIdInput = document.getElementById('categoryId');
    const categoryNameInput = document.getElementById('categoryName');
    const userSearchInput = document.getElementById('userSearchInput');
    const userSearchStatus = document.getElementById('userSearchStatus');
    const selectedUsersContainer = document.getElementById('selectedUsersContainer');
    let selectedUsers = [];

    let chartInstance = null;
    let playTimer;
    let userSearchTimeout;
    let currentTrack = null;

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
            alert("Ошибко токено овторизоции")
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

    const renderSearchResults = (mediaToRender, searchTerm) => {
        let searchResultsContainer = document.querySelector('.search-results-container');
        if (searchTerm.length > 0) {
            if (!searchResultsContainer) {
                searchResultsContainer = document.createElement('div');
                searchResultsContainer.className = 'grid-container search-results-container';
                const searchSection = document.createElement('section');
                searchSection.className = 'section search-results-section';
                searchSection.innerHTML = '<h2 class="section-title">Результаты поиска</h2>';
                searchSection.appendChild(searchResultsContainer);
                homeView.prepend(searchSection);
            }
            renderMediaInContainer(searchResultsContainer, mediaToRender, true);
        } else {
            if (searchResultsContainer) {
                searchResultsContainer.parentElement.remove();
            }
        }
    };


    const fetchAndRenderAll = async () => {
        try {
            const response = await fetchWithAuth(`${api}/api/tracks`);
            if (!response.ok) throw new Error('Network response was not ok');
            allMedia = await response.json();
            if (currentUser) {
                fetchFavorites();
                fetchXrecomen();
            } else {
                fetchXrecomen();
            }
            renderAllTracks(allMedia);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const fetchXrecomen = async () => {
        if (!currentUser) {
            if (youLikeSection) youLikeSection.style.display = 'block';
            if (favoriteCollectionsSection) favoriteCollectionsSection.style.display = 'block';

            if (xrecomenBtn) {
                if (xrecomenTitle) xrecomenTitle.textContent = 'Xrecomen';
                if (xrecomenSubtitle) xrecomenSubtitle.textContent = 'Лучший алгоритм для подбора треков';
            }

            if (youLikeGrid) {
                youLikeGrid.innerHTML = '<p>Для отображения войдите в аккаунт.</p>';
            }

            if (favoriteCollectionsGrid) {
                favoriteCollectionsGrid.innerHTML = '<p>Для отображения войдите в аккаунт.</p>';
            }

            const bestTracksResponse = await fetchWithAuth(`${api}/api/tracks/best`);
            if (bestTracksResponse.ok) {
                const bestTracks = await bestTracksResponse.json();
                renderAllTracks(bestTracks);
            }
            return;
        }

        if (xrecomenSection) xrecomenSection.style.display = 'flex';
        if (youLikeSection) youLikeSection.style.display = 'block';
        if (favoriteCollectionsSection) favoriteCollectionsSection.style.display = 'block';

        try {
            const response = await fetchWithAuth(`${api}/api/xrecomen/${currentUser.id}`);
            const data = await response.json();

            if (data.xrecomenTrack) {
                if (!allMedia.some(t => t.id === data.xrecomenTrack.id)) {
                    allMedia.push(data.xrecomenTrack);
                }
                const index = allMedia.findIndex(t => t.id === data.xrecomenTrack.id);
                if (xrecomenBtn && index !== -1) {
                    xrecomenBtn.dataset.index = index;
                    xrecomenBtn.dataset.isRandom = 'false';
                    if (xrecomenTitle) xrecomenTitle.textContent = 'Xrecomen';
                    if (xrecomenSubtitle) xrecomenSubtitle.textContent = `Возможно, вам понравится трек "${data.xrecomenTrack.title}"`;
                }
            } else {
                if (allMedia.length > 0) {
                    const randomIndex = Math.floor(Math.random() * allMedia.length);
                    if (xrecomenBtn) {
                        xrecomenBtn.dataset.index = randomIndex;
                        xrecomenBtn.dataset.isRandom = 'true';
                    }
                } else {
                    if (xrecomenSection) xrecomenSection.style.display = 'none';
                }
                if (xrecomenTitle) xrecomenTitle.textContent = 'Xrecomen';
                if (xrecomenSubtitle) xrecomenSubtitle.textContent = 'Лучший алгоритм для подбора треков';
            }

            if (youLikeGrid) {
                if (data.youLike && data.youLike.length > 0) {
                    renderMediaInContainer(youLikeGrid, data.youLike, true);
                } else {
                    youLikeGrid.innerHTML = '<p>Добавьте треки в избранное для отображения.</p>';
                }
            }

            const bestTracksResponse = await fetchWithAuth(`${api}/api/tracks/best`);
            if (bestTracksResponse.ok) {
                const bestTracks = await bestTracksResponse.json();
                renderAllTracks(bestTracks);
            }

            if (favoriteCollectionsGrid) {
                renderFavoriteCollections(data.favoriteCollections);
            }
        } catch (error) {
            console.error('Ошибка при получении рекомендаций:', error);
            if (xrecomenSection) xrecomenSection.style.display = 'none';
        }
    };

    const renderXrecomen = (track) => {
        const index = allMedia.findIndex(t => t.id === track.id);
        if (xrecomenBtn && index !== -1) {
            xrecomenBtn.dataset.index = index;
            xrecomenBtn.querySelector('.xrecomen-title').textContent = track.title;
            xrecomenBtn.querySelector('.xrecomen-subtitle').textContent = `От ${track.artist || track.creator_name}`;
        } else {
            if (xrecomenSection) xrecomenSection.style.display = 'none';
        }
    };

    const renderFavoriteCollections = (collections) => {
        if (favoriteCollectionsGrid) {
            favoriteCollectionsGrid.innerHTML = '';
            collections.forEach(col => {
                const card = document.createElement('div');
                card.className = 'collection-card';
                card.dataset.categoryId = col.id;
                card.innerHTML = `<h3>${col.name}</h3><p>${col.track_count} треков</p>`;
                favoriteCollectionsGrid.appendChild(card);
            });
        }
    };

    const fetchCategories = async () => {
        try {
            const categoriesRes = await fetchWithAuth(`${api}/api/categories`);
            if (!categoriesRes.ok) throw new Error('Ошибка при получении категорий');
            const categoriesData = await categoriesRes.json();
            if (allCategoriesGrid) {
                allCategoriesGrid.innerHTML = '';
                const allTracksCard = document.createElement('div');
                allTracksCard.className = 'category-card';
                allTracksCard.dataset.categoryId = 'all';
                allTracksCard.innerHTML = `<h3>Все треки</h3>`;
                allCategoriesGrid.appendChild(allTracksCard);

                categoriesData.forEach(cat => {
                    const catCard = document.createElement('div');
                    catCard.className = 'category-card';
                    catCard.dataset.categoryId = cat.id;
                    catCard.innerHTML = `<h3>${cat.name}</h3>`;
                    allCategoriesGrid.appendChild(catCard);
                });
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const fetchAndRenderCategoryTracks = async (categoryId) => {
        try {
            const response = await fetchWithAuth(`${api}/api/tracks?categoryId=${categoryId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const categoryTracks = await response.json();
            if (specificCategoryGrid) {
                renderMediaInContainer(specificCategoryGrid, categoryTracks, true);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const updateUIForAuth = (user) => {
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            loginBtn.style.display = 'none';
            if (navFavorites) navFavorites.style.display = 'flex';
            if (creatorStudioBtn) creatorStudioBtn.style.display = 'block';
            if (welcomeMessage) {
                welcomeMessage.textContent = `Привет, ${user.username}!`;
                welcomeMessage.style.display = 'block';
            }
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
            if (navFavorites) navFavorites.style.display = 'none';
            if (creatorStudioBtn) creatorStudioBtn.style.display = 'none';
            if (welcomeMessage) welcomeMessage.style.display = 'none';
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
            if (!response.ok) throw new Error('Ошибка при получении категорий.');
            const categories = await response.json();
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">Общее</option>';
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
            if (!response.ok) throw new Error('Ошибка при получении избранного.');
            userFavorites = await response.json();
            renderFavorites();
            renderAllTracks(allMedia);
        } catch (error) {
            console.error(error);
        }
    };

    const renderFavorites = () => {
        const favoriteMedia = allMedia.filter(item => userFavorites.includes(item.file));
        if (favoritesGridContainer) {
            renderMediaInContainer(favoritesGridContainer, favoriteMedia, true, true);
        }
    };

    const renderAllTracks = (mediaToRender) => {
        if (allGridContainer) {
            allGridContainer.innerHTML = '';
            if (mediaToRender.length === 0) {
                allGridContainer.innerHTML = `<p>Здесь пока ничего нет.</p>`;
                return;
            }
            renderMediaInContainer(allGridContainer, mediaToRender, true);
        }
    };

    const renderMediaInContainer = (container, media, isAllTracksView, isFavoritesView = false) => {
        container.innerHTML = '';
        if (media.length === 0) {
            container.innerHTML = `<p>${isFavoritesView ? 'Здесь пока ничего нет. Добавьте медиа в избранное!' : 'Ничего не найдено'}.</p>`;
            return;
        }
        media.forEach((item) => {
            if (!item || !item.title || !item.file) {
                console.warn("Пропущен трек из-за неполных данных:", item);
                return;
            }
            const globalIndex = allMedia.findIndex(t => t.id === item.id);
            const isFavorite = currentUser ? userFavorites.includes(item.file) : false;
            const card = document.createElement('div');
            card.className = `card ${item.type === 'video' ? 'card--video' : ''}`;
            card.dataset.index = globalIndex;

            if (globalIndex === -1) {
                allMedia.push(item);
                card.dataset.index = allMedia.length - 1;
            }

            let cardActionsHtml = '';
            if (currentUser && currentUser.role === 'admin') {
                cardActionsHtml = `
                    <div class="card-actions">
                        <button class="rename-btn" data-track-id="${item.id}" data-type="${item.type}" title="Переименовать"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></button>
                        <button class="delete-btn" data-track-id="${item.id}" data-type="${item.type}" title="Удалить"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                    </div>
                `;
            } else if (currentUser && currentUser.role === 'creator') {
                cardActionsHtml = `
                    <div class="card-actions">
                        <button class="delete-btn" data-track-id="${item.id}" data-type="${item.type}" title="Удалить"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
                    </div>
                `;
            }

            if (favoritePlayerBtn) {
                const isCurrentTrackFavorite = userFavorites.includes(item.file);
                if (isCurrentTrackFavorite) {
                    favoritePlayerBtn.classList.add('favorited');
                    favoritePlayerBtn.title = 'Удалить из избранного';
                } else {
                    favoritePlayerBtn.classList.remove('favorited');
                    favoritePlayerBtn.title = 'Добавить в избранное';
                }
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

    const playModerationMedia = (track) => {
        if (track.type === 'video') {
            activeMediaElement.pause();
            activeMediaElement.currentTime = 0;
            if (player) player.style.display = 'none';
            videoPlayerModal.src = `/temp_uploads/${track.file_name}`;
            if (videoModal) videoModal.style.display = 'flex';
            videoPlayerModal.play();
        } else {
            videoPlayerModal.pause();
            videoPlayerModal.currentTime = 0;
            if (videoModal) videoModal.style.display = 'none';
            if (player) player.style.display = 'grid';
            if (playerCover) playerCover.src = `/temp_uploads/${track.cover_name}`;
            if (playerTitle) playerTitle.textContent = track.title;
            if (playerArtist) playerArtist.textContent = `от ${track.username}`;
            activeMediaElement = audioPlayer;
            activeMediaElement.src = `/temp_uploads/${track.file_name}`;
            activeMediaElement.play().catch(e => console.error("Ошибка воспроизведения:", e));
        }
    };

    const playMedia = async (index) => {
        if (index < 0 || index >= allMedia.length) return;
        currentTrack = allMedia[index];

        hideVideo();
        activeMediaElement.pause();
        activeMediaElement.currentTime = 0;
        currentTrackIndex = index;
        const item = allMedia[index];

        if (nowPlayingText) {
            nowPlayingText.textContent = `Сейчас играет: ${item.title} от ${item.artist || item.creator_name}`;
        }

        if (playerTrackInfo) playerTrackInfo.classList.add('fading');
        setTimeout(() => {
            if (playerCover) playerCover.src = `/fon/${item.cover}`;
            if (playerTitle) playerTitle.textContent = item.title;
            if (playerArtist) playerArtist.textContent = `от ${item.artist || item.creator_name}`;

            if (item.type === 'audio') {
                activeMediaElement = audioPlayer;
                activeMediaElement.src = `/music/${item.file}`;
                hideVideo();
            } else if (item.type === 'video') {
                activeMediaElement = videoPlayer;
                activeMediaElement.src = `/video/${item.file}`;
                showVideo();
            }
            activeMediaElement.play().catch(e => console.error("Ошибка воспроизведения:", e));
            if (playerTrackInfo) playerTrackInfo.classList.remove('fading');
        }, 150);

        if (favoritePlayerBtn && currentUser) {
            const isFavorite = userFavorites.includes(item.file);
            favoritePlayerBtn.classList.toggle('favorited', isFavorite);
            favoritePlayerBtn.title = isFavorite ? 'Удалить из избранного' : 'Добавить в избранное';
        }

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

    const fetchMyTracks = async () => {
        if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) return;
        try {
            const response = await fetchWithAuth(`${api}/api/creator/my-tracks/${currentUser.id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            myTracks = await response.json();
            if (myTracksSection) {
                renderMyTracks(myTracks);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            if (myTracksSection) myTracksSection.innerHTML = `<p>Не удалось загрузить ваши треки.</p>`;
        }
    };

    const renderMyTracks = (tracksToRender) => {
        myTracksSection.innerHTML = '';
        const uploadBtn = document.createElement('button');
        uploadBtn.className = 'submit-btn';
        uploadBtn.id = 'uploadTrackBtn';
        uploadBtn.textContent = 'Загрузить трек';

        const controlsDiv = document.createElement('div');
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '15px';
        controlsDiv.style.flexWrap = 'wrap';
        controlsDiv.style.marginBottom = '20px';
        controlsDiv.appendChild(uploadBtn);
        myTracksSection.appendChild(controlsDiv);

        const myTracksGrid = document.createElement('div');
        myTracksGrid.className = 'grid-container';
        if (tracksToRender.length === 0) {
            myTracksGrid.innerHTML = `<p>Вы еще не загрузили ни одного трека.</p>`;
        } else {
            tracksToRender.forEach(track => {
                const card = document.createElement('div');
                card.className = `card my-track-card ${track.type === 'video' ? 'card--video' : ''}`;
                card.dataset.trackId = track.id;
                card.innerHTML = `
                    <div class="card-image-wrapper">
                        <img src="/fon/${track.cover}" onerror="this.src='/fon/default.png';" class="card-image" alt="${track.title}">
                    </div>
                    <p class="card-title">${track.title} ${track.type === 'video' ? '<span class="video-icon">🎥</span>' : ''}</p>
                    <p class="card-artist">от ${track.artist || track.creator_name}</p>
                    <div class="card-actions">
                        <button class="delete-my-track-btn" data-track-id="${track.id}">Удалить</button>
                    </div>
                `;
                myTracksGrid.appendChild(card);
            });
        }
        myTracksSection.appendChild(myTracksGrid);

        document.getElementById('uploadTrackBtn').addEventListener('click', () => {
            if (uploadModal) uploadModal.style.display = 'flex';
        });
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
        localStorage.setItem('uiOpacity', value);
    };

    const loadOpacitySetting = () => {
        const savedOpacity = localStorage.getItem('uiOpacity') || 0.5;
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
        localStorage.setItem(BLUR_KEY, enabled);
    };

    const loadBlurSetting = () => {
        const savedBlur = localStorage.getItem(BLUR_KEY) === 'true';
        applyBlur(savedBlur);
    };


    const saveVolumeSetting = (value) => {
        localStorage.setItem(VOLUME_KEY, value);
    };

    const loadVolumeSetting = () => {
        const savedVolume = localStorage.getItem(VOLUME_KEY) || 1;
        const volumeValue = parseFloat(savedVolume);
        if (volumeBar) {
            volumeBar.value = volumeValue;
            audioPlayer.volume = videoPlayer.volume = volumeValue;
        }
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

    const switchView = (viewIdToShow) => {
        document.querySelectorAll('.nav-link, .creator-nav-btn').forEach(l => l.classList.remove('active'));

        document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));

        const viewToShow = document.getElementById(viewIdToShow);
        if (viewToShow) viewToShow.classList.add('active-view');

        if (backToCategoriesBtn) {
            backToCategoriesBtn.style.display = viewIdToShow === 'specificCategoryView' ? 'block' : 'none';
        }

        if (viewIdToShow === 'homeView') {
            if (navHome) navHome.classList.add('active');
            if (viewTitle) viewTitle.textContent = 'Главная';
            if (searchBarWrapper) searchBarWrapper.style.display = 'block';
            if (player) {
                player.style.display = 'grid';
                player.classList.remove('creator-mode');
            }
            fetchXrecomen();
        } else if (viewIdToShow === 'categoriesView') {
            if (navCategories) navCategories.classList.add('active');
            if (viewTitle) viewTitle.textContent = 'Категории';
            if (searchBarWrapper) searchBarWrapper.style.display = 'block';
            if (player) {
                player.style.display = 'grid';
                player.classList.remove('creator-mode');
            }
            fetchCategories();
        } else if (viewIdToShow === 'favoritesView') {
            if (navFavorites) navFavorites.classList.add('active');
            if (viewTitle) viewTitle.textContent = 'Избранное';
            if (searchBarWrapper) searchBarWrapper.style.display = 'block';
            if (player) {
                player.style.display = 'grid';
                player.classList.remove('creator-mode');
            }
            fetchFavorites();
        } else if (viewIdToShow === 'creatorView') {
            if (viewTitle) viewTitle.textContent = 'Creator Studio';
            if (searchBarWrapper) searchBarWrapper.style.display = 'none';
            if (player) player.classList.add('creator-mode'); // Плеер остается видимым
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
            if (player) {
                player.style.display = 'grid';
                player.classList.remove('creator-mode');
            }
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
            
            // Player remains visible, just changes its style
            if(player) player.classList.add('creator-mode');
            
            document.querySelectorAll('#creatorView .creator-main-section').forEach(sec => sec.style.display = 'none');
            const creatorNavButtons = document.querySelectorAll('.creator-nav-btn');
            creatorNavButtons.forEach(btn => btn.classList.remove('active'));

            if (currentUser && (currentUser.role === 'creator' || currentUser.role === 'admin')) {
                if (analyticsSection) analyticsSection.style.display = 'block';
                if (analyticsBtn) analyticsBtn.classList.add('active');
                if (creatorHomeSection) creatorHomeSection.style.display = 'none';
                fetchCreatorStats();
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
            
            if(player) player.classList.remove('creator-mode');

            showVideo();

            document.querySelectorAll('.view').forEach(v => v.classList.remove('active-view'));
            if (homeView) homeView.classList.add('active-view');

            fetchAndRenderAll();
        }
    };

    const fetchAdminApplications = async () => {
        try {
            const res = await fetchWithAuth(`${api}/api/admin/applications`);
            const applications = await res.json();
            if (applicationsList) {
                applicationsList.innerHTML = '';
                if (applications.length === 0) {
                    applicationsList.innerHTML = '<p>Нет новых заявок.</p>';
                    return;
                }
                applications.forEach(app => {
                    const appDiv = document.createElement('div');
                    appDiv.className = 'admin-card';
                    appDiv.innerHTML = `
                        <h3>Заявка от: ${app.username}</h3>
                        <p><strong>Имя:</strong> ${app.full_name}</p>
                        <p><strong>Телефон:</strong> ${app.phone_number}</p>
                        <p><strong>Почта:</strong> ${app.email}</p>
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
            if (adminCategoriesSection) {
                const categoriesList = document.getElementById('adminCategoriesList');
                if (categoriesList) {
                    categoriesList.innerHTML = '';
                    categories.forEach(cat => {
                        const catDiv = document.createElement('div');
                        catDiv.className = 'admin-card';
                        catDiv.innerHTML = `
                            <h3>${cat.name}</h3>
                            <div class="category-actions">
                                <button class="edit-category-btn" data-category-id="${cat.id}">Редактировать</button>
                                <button class="delete-category-btn" data-category-id="${cat.id}">Удалить</button>
                            </div>
                        `;
                        categoriesList.appendChild(catDiv);
                    });
                }
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
                        <button class="change-password-btn" data-user-id="${user.id}">Сменить пароль</button>
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
                    moderationTracksList.innerHTML = '<p>Нет треков на модерации.</p>';
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
            if (statsContent) {
                statsContent.innerHTML = `
                    <p>Всего пользователей: ${stats.userCount}</p>
                    <p>Треков в медиатеке: ${stats.trackCount}</p>
                `;
            }
        } catch (err) {
            console.error(err);
        }
    };

    const initEventListeners = () => {
        [audioPlayer, videoPlayer, videoPlayerModal, moderationPlayer, moderationVideoPlayer].forEach(el => {
            if (el) {
                el.loop = false;
            }
        });

        if (uploadTypeRadios) {
            uploadTypeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    if (radio.value === 'audio') {
                        audioFields.style.display = 'block';
                        videoFields.style.display = 'none';
                        document.getElementById('audioFile').setAttribute('required', 'required');
                        document.getElementById('videoFile').removeAttribute('required');
                    } else if (radio.value === 'video') {
                        audioFields.style.display = 'none';
                        videoFields.style.display = 'block';
                        document.getElementById('audioFile').removeAttribute('required');
                        document.getElementById('videoFile').setAttribute('required', 'required');
                    }
                });
            });
        }

        if (navHome) navHome.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('homeView');
        });
        if (navCategories) navCategories.addEventListener('click', (e) => {
            e.preventDefault();
            switchView('categoriesView');
        });
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
            switchView('categoriesView');
            if (specificCategoryGrid) specificCategoryGrid.innerHTML = '';
        });

        if (creatorStudioBtn) creatorStudioBtn.addEventListener('click', () => {
            if (currentUser) {
                toggleCreatorMode(true);
            } else {
                alert('Пожалуйста, войдите, чтобы получить доступ к Creator Studio.');
            }
        });

        if (backToXMusicBtn) backToXMusicBtn.addEventListener('click', () => {
            toggleCreatorMode(false);
        });

        const creatorNavButtons = document.querySelectorAll('.creator-nav-btn');
        creatorNavButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                creatorNavButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                document.querySelectorAll('#creatorView .creator-main-section').forEach(sec => {
                    if (sec) sec.style.display = 'none';
                });

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
        
        // ОБРАБОТЧИК ДЛЯ ОТПРАВКИ ФОРМЫ ЗАЯВКИ
        if (applicationForm) {
            applicationForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const fullName = document.getElementById('fullName').value;
                const phoneNumber = document.getElementById('phoneNumber').value;
                const email = document.getElementById('email').value;
                
                try {
                    const res = await fetchWithAuth(`${api}/api/apply-for-creator`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: currentUser.id,
                            fullName,
                            phoneNumber,
                            email
                        })
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) {
                        if (applicationModal) applicationModal.style.display = 'none';
                        applicationForm.reset();
                    }
                } catch (err) {
                    alert('Ошибка при подаче заявки.');
                }
            });
        }
        
        if (closeApplicationBtn) closeApplicationBtn.addEventListener('click', () => {
            if (applicationModal) applicationModal.style.display = 'none';
        });
        if (applicationModal) applicationModal.addEventListener('click', (e) => {
            if (e.target === applicationModal) {
                applicationModal.style.display = 'none';
            }
        });

        const uploadTrackBtn = document.getElementById('uploadTrackBtn');
        if (uploadTrackBtn) uploadTrackBtn.addEventListener('click', () => {
            if (uploadModal) uploadModal.style.display = 'flex';
            if (uploadManager) uploadManager.style.display = 'block';
            const submitButton = document.querySelector('#uploadForm button[type="submit"]');
            if (submitButton) submitButton.textContent = 'Отправить на модерацию';
        });

        if (closeUploadBtn) closeUploadBtn.addEventListener('click', () => {
            if (uploadModal) uploadModal.style.display = 'none';
        });
        if (uploadModal) uploadModal.addEventListener('click', (e) => {
            if (e.target === uploadModal) {
                uploadModal.style.display = 'none';
            }
        });

        if (isForeignArtist) isForeignArtist.addEventListener('change', () => {
            if (artistFields) artistFields.style.display = isForeignArtist.checked ? 'block' : 'none';
        });

        if (settingsBtn) settingsBtn.addEventListener('click', () => {
            if (settingsModal) settingsModal.style.display = 'flex';
        });
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => {
            if (settingsModal) settingsModal.style.display = 'none';
        });
        if (settingsModal) settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal.style.display = 'none';
            }
        });

        if (loginBtn) loginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'flex';
        });
        if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
        });
        if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', () => {
            if (registerModal) registerModal.style.display = 'none';
        });
        if (switchToRegisterBtn) switchToRegisterBtn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'flex';
        });
        if (switchToLoginBtn) switchToLoginBtn.addEventListener('click', () => {
            if (registerModal) registerModal.style.display = 'none';
            if (loginModal) loginModal.style.display = 'flex';
        });
        
        if (logoutBtn) logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            updateUIForAuth(null);
            toggleCreatorMode(false);
            if (settingsModal) settingsModal.style.display = 'none';
        });


        if (closeVideoBtn) closeVideoBtn.addEventListener('click', () => {
            videoPlayerModal.pause();
            videoPlayerModal.currentTime = 0;
            if (videoModal) videoModal.style.display = 'none';
        });

        if (closeModerationBtn) closeModerationBtn.addEventListener('click', () => {
            if (moderationModal) moderationModal.style.display = 'none';
            moderationPlayer.pause();
            moderationPlayer.currentTime = 0;
            moderationVideoPlayer.pause();
            moderationVideoPlayer.currentTime = 0;
        });

        if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener('click', () => {
            if (categoryModal) categoryModal.style.display = 'none';
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (uploadModal) uploadModal.style.display = 'none';
                if (settingsModal) settingsModal.style.display = 'none';
                if (loginModal) loginModal.style.display = 'none';
                if (registerModal) registerModal.style.display = 'none';
                if (videoModal) videoModal.style.display = 'none';
                if (moderationModal) moderationModal.style.display = 'none';
                if (categoryModal) categoryModal.style.display = 'none';
            }
        });

        if (categoryModal) categoryModal.addEventListener('click', (e) => {
            if (e.target === categoryModal) {
                categoryModal.style.display = 'none';
            }
        });

        if (userSearchInput) {
            userSearchInput.addEventListener('input', () => {
                const query = userSearchInput.value.trim();
                clearTimeout(userSearchTimeout);
                userSearchStatus.textContent = '';
                userSearchStatus.className = '';

                if (query.length === 0) {
                    return;
                }

                userSearchTimeout = setTimeout(async () => {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/categories/users?q=${query}`);
                        const users = await res.json();
                        const user = users.find(u => u.username === query);
                        if (user) {
                            const userExists = selectedUsers.some(su => su.id === user.id);
                            if (userExists) {
                                userSearchStatus.textContent = 'Пользователь уже добавлен';
                                userSearchStatus.className = 'status-warning';
                            } else if (user.role !== 'creator' && user.role !== 'admin') {
                                userSearchStatus.textContent = 'Не является креатором';
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
                alert('Ошибка при загрузке данных категории.');
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
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: categoryName,
                        allowedUsers: allowedUsers
                    })
                });
                const result = await res.json();
                alert(result.message);
                if (res.ok) {
                    if (categoryModal) categoryModal.style.display = 'none';
                    fetchAdminCategories();
                }
            } catch (err) {
                alert('Ошибка при сохранении категории.');
            }
        });

        if (uploadForm) uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const audioFile = document.getElementById('audioFile').files[0];
            const videoFile = document.getElementById('videoFile').files[0];
            const coverFile = document.getElementById('coverFile').files[0];
            const uploadType = document.querySelector('input[name="uploadType"]:checked').value;

            if (uploadType === 'audio' && !audioFile) {
                alert('Пожалуйста, выберите аудиофайл.');
                return;
            } else if (uploadType === 'video' && !videoFile) {
                alert('Пожалуйста, выберите видеофайл.');
                return;
            }

            if (!coverFile) {
                alert('Пожалуйста, выберите файл обложки.');
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
            if (accessToken) {
                xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            }

            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    if (uploadProgressBar) uploadProgressBar.style.width = `${percent}%`;
                    if (uploadStatusText) uploadStatusText.textContent = `Загрузка: ${percent}%`;
                }
            });

            xhr.onload = () => {
                if (xhr.status === 201) {
                    if (uploadStatusText) uploadStatusText.textContent = 'Загружено! Ожидайте модерации.';
                    setTimeout(() => {
                        if (uploadModal) uploadModal.style.display = 'none';
                        if (uploadForm) uploadForm.reset();
                        if (uploadManager) uploadManager.style.display = 'none';
                        if (uploadSubmitBtn) uploadSubmitBtn.disabled = false;
                        alert('Трек отправлен на модерацию. Ожидайте одобрения.');
                    }, 1000);
                } else {
                    const contentType = xhr.getResponseHeader('Content-Type');
                    let result = { message: 'Произошла неизвестная ошибка.' };

                    if (contentType && contentType.includes('application/json')) {
                        try {
                            result = JSON.parse(xhr.responseText);
                        } catch (e) {
                            console.error('Не удалось разобрать JSON:', e);
                        }
                    } else {
                        console.error('Сервер вернул не-JSON ответ:', xhr.responseText);
                    }

                    if (uploadStatusText) uploadStatusText.textContent = `Ошибка загрузки: ${result.message}`;
                    if (uploadProgressBar) uploadProgressBar.style.width = '0%';
                    if (uploadSubmitBtn) uploadSubmitBtn.disabled = false;
                }
            };

            xhr.onerror = () => {
                if (uploadStatusText) uploadStatusText.textContent = 'Сетевая ошибка. Попробуйте снова.';
                if (uploadSubmitBtn) uploadSubmitBtn.disabled = false;
            };

            xhr.send(formData);
        });

        if (loginForm) loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            try {
                const res = await fetchWithAuth(`${api}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                });
                const result = await res.json();
                if (res.ok) {
                    setTokens(result.token)
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                    updateUIForAuth(result.user);
                    if (loginModal) loginModal.style.display = 'none';
                    alert('Вход успешен!');
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
                const res = await fetchWithAuth(`${api}/api/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
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

        if (opacitySlider) opacitySlider.addEventListener('input', () => {
            applyOpacity(opacitySlider.value);
            saveOpacitySetting(opacitySlider.value);
        });
        
        if (blurToggle) {
            blurToggle.addEventListener('change', () => {
                const enabled = blurToggle.checked;
                applyBlur(enabled);
                saveBlurSetting(enabled);
            });
        }

        if (searchInput) searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            let mediaToFilter = allMedia;
            if (document.querySelector('.view.active-view').id === 'favoritesView') {
                mediaToFilter = allMedia.filter(item => userFavorites.includes(item.file));
            }

            const filteredMedia = mediaToFilter.filter(item => {
                const titleMatch = item.title.toLowerCase().includes(searchTerm);
                const artistMatch = item.artist && item.artist.toLowerCase().includes(searchTerm);
                const creatorMatch = item.creator_name && item.creator_name.toLowerCase().includes(searchTerm);
                return titleMatch || artistMatch || creatorMatch;
            });

            const homeSections = document.querySelectorAll('#homeView .section');
            if (searchTerm.length > 0) {
                homeSections.forEach(sec => sec.style.display = 'none');
                renderSearchResults(filteredMedia, searchTerm);
            } else {
                homeSections.forEach(sec => sec.style.display = 'block');
                renderSearchResults([], '');
                fetchXrecomen();
            }
        });

        if (xrecomenBtn) xrecomenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(e.currentTarget.dataset.index, 10);
            if (index >= 0) playMedia(index);
        });

        mainContent.addEventListener('click', async (e) => {
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
            const editCategoryBtn = e.target.closest('.edit-category-btn');
            const deleteCategoryBtn = e.target.closest('.delete-category-btn');
            const categoryCard = e.target.closest('.category-card');
            const collectionCard = e.target.closest('.collection-card');

            if (renameBtn) {
                e.stopPropagation();
                const {
                    trackId,
                    type
                } = renameBtn.dataset;
                const track = allMedia.find(t => t.id == trackId);
                const newTitle = prompt('Введите новое название:', track.title);
                if (newTitle && newTitle.trim() && newTitle.trim() !== track.title) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/rename`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                trackId,
                                newTitle: newTitle.trim()
                            })
                        });
                        if (res.ok) fetchAndRenderAll();
                        else alert('Ошибка при переименовании');
                    } catch (err) {
                        console.error(err);
                    }
                }
            } else if (deleteBtn) {
                e.stopPropagation();
                const {
                    trackId
                } = deleteBtn.dataset;
                const track = allMedia.find(t => t.id == trackId);
                if (confirm(`Вы уверены, что хотите удалить "${track.title}"?`)) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/tracks/${trackId}`, {
                            method: 'DELETE'
                        });
                        if (res.ok) fetchAndRenderAll();
                        else alert('Ошибка при удалении');
                    } catch (err) {
                        console.error(err);
                    }
                }
            } else if (deleteMyTrackBtn) {
                e.stopPropagation();
                const trackId = e.target.closest('.my-track-card').dataset.trackId;
                const track = myTracks.find(t => t.id == trackId);
                if (confirm(`Вы уверены, что хотите удалить трек "${track.title}"?`)) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/creator/my-tracks/${trackId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId: currentUser.id,
                                userRole: currentUser.role
                            })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchMyTracks();
                    } catch (err) {
                        console.error(err);
                    }
                }
            } else if (favoriteBtn && currentUser) {
                e.stopPropagation();
                const mediaFile = favoriteBtn.dataset.file;
                const isFavorite = favoriteBtn.classList.contains('favorited');
                try {
                    const res = await fetchWithAuth(`${api}/api/favorites`, {
                        method: isFavorite ? 'DELETE' : 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: currentUser.id,
                            mediaFile
                        })
                    });
                    if (res.ok) {
                        if (isFavorite) {
                            userFavorites = userFavorites.filter(f => f !== mediaFile);
                            favoritePlayerBtn.classList.remove('favorited');
                            favoritePlayerBtn.title = 'Добавить в избранное';
                            fetchXrecomen();
                        } else {
                            userFavorites.push(currentTrack.file);
                            favoritePlayerBtn.classList.add('favorited');
                            favoritePlayerBtn.title = 'Удалить из избранного';
                            fetchXrecomen();
                        }
                    } else {
                        alert('Ошибка при изменении избранного.');
                    }
                } catch (err) {
                    console.error(err);
                }
            } else if (approveAppBtn) {
                e.stopPropagation();
                const userId = approveAppBtn.dataset.userId;
                try {
                    const res = await fetchWithAuth(`${api}/api/admin/approve-application`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId
                        })
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) fetchAdminApplications();
                } catch (err) {
                    alert('Ошибка при одобрении заявки.');
                }
            } else if (rejectAppBtn) {
                e.stopPropagation();
                const appId = rejectAppBtn.dataset.appId;
                try {
                    const res = await fetchWithAuth(`${api}/api/admin/reject-application`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            appId
                        })
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) fetchAdminApplications();
                } catch (err) {
                    alert('Ошибка при отклонении заявки.');
                }
            } else if (moderationCheckBtn) {
                e.stopPropagation();
                const trackIndex = e.target.closest('.creator-moderation-card').dataset.index;
                const track = moderationTracks[trackIndex];

                if (moderationTitle) moderationTitle.textContent = track.title;
                if (moderationArtist) moderationArtist.textContent = `Исполнитель: ${track.artist || track.username}`;

                if (track.type === 'audio') {
                    if (moderationPlayer) moderationPlayer.src = `/temp_uploads/${track.file_name}`;
                    if (moderationPlayerCover) moderationPlayerCover.src = `/temp_uploads/${track.cover_name}`;
                    if (moderationPlayer) moderationPlayer.style.display = 'block';
                    if (moderationPlayerCover) moderationPlayerCover.style.display = 'block';
                    if (moderationVideoPlayer) {
                        moderationVideoPlayer.style.display = 'none';
                        moderationVideoPlayer.pause();
                    }
                } else if (track.type === 'video') {
                    if (moderationPlayer) {
                        moderationPlayer.style.display = 'none';
                        moderationPlayer.pause();
                    }
                    if (moderationPlayerCover) moderationPlayerCover.style.display = 'none';
                    if (moderationVideoPlayer) {
                        moderationVideoPlayer.src = `/temp_uploads/${track.file_name}`;
                        moderationVideoPlayer.style.display = 'block';
                    }
                }

                if (moderationApproveBtn) {
                    moderationApproveBtn.dataset.trackId = track.id;
                    moderationApproveBtn.dataset.fileName = track.file_name;
                    moderationApproveBtn.dataset.coverName = track.cover_name;
                    moderationApproveBtn.dataset.title = track.title;
                    moderationApproveBtn.dataset.type = track.type;
                    moderationApproveBtn.dataset.creatorId = track.user_id;
                    moderationApproveBtn.dataset.artist = track.artist;
                    moderationApproveBtn.dataset.categoryId = track.category_id;
                }

                if (moderationRejectBtn) moderationRejectBtn.dataset.trackId = track.id;

                if (moderationModal) moderationModal.style.display = 'flex';
            } else if (changeRoleBtn) {
                e.stopPropagation();
                const userId = changeRoleBtn.dataset.userId;
                const currentRole = changeRoleBtn.dataset.currentRole;
                const newRole = prompt(`Сменить роль пользователя на: 'user', 'creator' или 'admin'. Текущая роль: ${currentRole}`);
                if (newRole && ['user', 'creator', 'admin'].includes(newRole)) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/update-role`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId,
                                role: newRole
                            })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) {
                        alert('Ошибка при смене роли.');
                    }
                }
            } else if (changePasswordBtn) {
                e.stopPropagation();
                const userId = changePasswordBtn.dataset.userId;
                const newPassword = prompt('Введите новый пароль:');
                if (newPassword && newPassword.trim()) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/change-password`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                userId,
                                newPassword
                            })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) {
                        alert('Ошибка при смене пароля.');
                    }
                }
            } else if (deleteUserBtn) {
                e.stopPropagation();
                const userId = deleteUserBtn.dataset.userId;
                if (confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/delete-user/${userId}`, {
                            method: 'DELETE'
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) {
                        alert('Ошибка при удалении пользователя.');
                    }
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
                if (confirm('Вы уверены, что хотите удалить эту категорию? Треки, привязанные к ней, останутся.')) {
                    try {
                        const res = await fetchWithAuth(`${api}/api/admin/categories/${categoryId}`, { method: 'DELETE' });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminCategories();
                    } catch (err) {
                        alert('Ошибка при удалении категории.');
                    }
                }
            } else if (card && card.dataset.index) {
                const index = parseInt(card.dataset.index, 10);
                if (index >= 0) playMedia(index);
            } else if (categoryCard || collectionCard) {
                const targetCard = categoryCard || collectionCard;
                const categoryId = targetCard.dataset.categoryId;
                if (categoryId === 'all') {
                    if (viewTitle) viewTitle.textContent = 'Все треки';
                    switchView('specificCategoryView');
                    if (allGridContainer) allGridContainer.style.display = 'grid';
                    if (specificCategoryGrid) specificCategoryGrid.style.display = 'none';
                    fetchAndRenderAll();
                } else {
                    if (viewTitle) viewTitle.textContent = targetCard.querySelector('h3').textContent;
                    switchView('specificCategoryView');
                    if (allGridContainer) allGridContainer.style.display = 'none';
                    if (specificCategoryGrid) specificCategoryGrid.style.display = 'grid';
                    fetchAndRenderCategoryTracks(categoryId);
                }
            }
        });

        if (moderationApproveBtn) moderationApproveBtn.addEventListener('click', async () => {
            const trackId = moderationApproveBtn.dataset.trackId;
            const fileName = moderationApproveBtn.dataset.fileName;
            const coverName = moderationApproveBtn.dataset.coverName;
            const title = moderationApproveBtn.dataset.title;
            const type = moderationApproveBtn.dataset.type;
            const creatorId = moderationApproveBtn.dataset.creatorId;
            const artist = moderationApproveBtn.dataset.artist;
            const categoryId = moderationApproveBtn.dataset.categoryId;

            try {
                const res = await fetchWithAuth(`${api}/api/admin/approve-track`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        trackId,
                        fileName,
                        coverName,
                        title,
                        type,
                        creatorId,
                        artist,
                        categoryId
                    })
                });
                const result = await res.json();
                alert(result.message);
                if (res.ok) {
                    if (moderationModal) moderationModal.style.display = 'none';
                    if (moderationPlayer) moderationPlayer.pause();
                    if (moderationVideoPlayer) moderationVideoPlayer.pause();
                    fetchModerationTracks();
                    fetchAndRenderAll();
                }
            } catch (err) {
                alert('Ошибка при одобрении трека.');
            }
        });

        if (moderationRejectBtn) moderationRejectBtn.addEventListener('click', async () => {
            const trackId = moderationRejectBtn.dataset.trackId;
            if (confirm('Вы уверены, что хотите отклонить этот трек?')) {
                try {
                    const res = await fetchWithAuth(`${api}/api/admin/reject-track/${trackId}`, {
                        method: 'DELETE'
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) {
                        if (moderationModal) moderationModal.style.display = 'none';
                        if (moderationPlayer) moderationPlayer.pause();
                        if (moderationVideoPlayer) moderationVideoPlayer.pause();
                        fetchModerationTracks();
                    }
                } catch (err) {
                    alert('Ошибка при отклонении трека.');
                }
            }
        });

        if (playPauseBtn) playPauseBtn.addEventListener('click', () => {
            if (activeMediaElement.paused) {
                if (currentTrackIndex === -1 && allMedia.length > 0) playMedia(0);
                else activeMediaElement.play();
            } else {
                activeMediaElement.pause();
            }
        });

        if (repeatBtn) repeatBtn.addEventListener('click', () => {
            repeatMode = !repeatMode;
            if (repeatBtn) repeatBtn.classList.toggle('active', repeatMode);
            [audioPlayer, videoPlayer, videoPlayerModal, moderationPlayer, moderationVideoPlayer].forEach(el => el.loop = repeatMode);
        });

        if (favoritePlayerBtn) {
            favoritePlayerBtn.addEventListener('click', async () => {
                if (!currentUser) {
                    alert('Пожалуйста, войдите, чтобы добавлять в избранное.');
                    return;
                }
                if (currentTrackIndex === -1 || !allMedia[currentTrackIndex]) {
                    alert('Сначала выберите трек.');
                    return;
                }
                const trackToAdd = allMedia[currentTrackIndex];
                const isFavorite = userFavorites.includes(trackToAdd.file);

                try {
                    const res = await fetchWithAuth(`${api}/api/favorites`, {
                        method: isFavorite ? 'DELETE' : 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            userId: currentUser.id,
                            mediaFile: trackToAdd.file
                        })
                    });
                    if (res.ok) {
                        if (isFavorite) {
                            userFavorites = userFavorites.filter(f => f !== trackToAdd.file);
                            favoritePlayerBtn.classList.remove('favorited');
                            favoritePlayerBtn.title = 'Добавить в избранное';
                            fetchXrecomen();
                        } else {
                            userFavorites.push(trackToAdd.file);
                            favoritePlayerBtn.classList.add('favorited');
                            favoritePlayerBtn.title = 'Удалить из избранного';
                            fetchXrecomen();
                        }
                    } else {
                        alert('Ошибка при изменении избранного.');
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        }

        const onPlay = () => {
            if (playIcon) playIcon.style.display = 'none';
            if (pauseIcon) pauseIcon.style.display = 'block';
            if (nowPlayingText) {
                if (currentTrackIndex !== -1 && allMedia[currentTrackIndex]) {
                    const track = allMedia[currentTrackIndex];
                    nowPlayingText.textContent = `Сейчас играет: ${track.title} от ${track.artist || track.creator_name}`;
                }
            }
        };

        const onPause = () => {
            if (playIcon) playIcon.style.display = 'block';
            if (pauseIcon) pauseIcon.style.display = 'none';
        };

        const onEnded = () => {
            if (!repeatMode) {
                const nextIndex = (currentTrackIndex + 1) % allMedia.length;
                playMedia(nextIndex);
            }
        };

        [audioPlayer, videoPlayer, videoPlayerModal, moderationPlayer, moderationVideoPlayer].forEach(el => {
            if (el) {
                el.addEventListener('play', onPlay);
                el.addEventListener('pause', onPause);
                el.addEventListener('ended', onEnded);
                el.addEventListener('timeupdate', () => {
                    if (!isDragging) {
                        const progress = (el.currentTime / el.duration) * 100 || 0;
                        if (progressFilled) progressFilled.style.width = `${progress}%`;
                        if (progressThumb) progressThumb.style.left = `${progress}%`;
                    }
                    if (currentTimeEl) currentTimeEl.textContent = formatTime(el.currentTime);
                });
                el.addEventListener('loadedmetadata', () => {
                    if (!isNaN(el.duration) && durationEl) durationEl.textContent = formatTime(el.duration);
                });
            }
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            if (allMedia.length > 0) playMedia((currentTrackIndex + 1) % allMedia.length);
        });
        if (prevBtn) prevBtn.addEventListener('click', () => {
            if (allMedia.length > 0) playMedia((currentTrackIndex - 1 + allMedia.length) % allMedia.length);
        });

        const scrub = (e) => {
            e.preventDefault();
            const rect = progressBarContainer.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let percentage = (clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            if (activeMediaElement.duration) {
                activeMediaElement.currentTime = activeMediaElement.duration * percentage;
            }
        };

        if (progressBarContainer) progressBarContainer.addEventListener('mousedown', (e) => {
            if (allMedia.length > 0) {
                isDragging = true;
                scrub(e);
            }
        });
        window.addEventListener('mousemove', (e) => {
            if (isDragging) scrub(e);
        });
        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
        if (progressBarContainer) progressBarContainer.addEventListener('touchstart', (e) => {
            if (allMedia.length > 0) {
                isDragging = true;
                scrub(e);
            }
        });
        window.addEventListener('touchmove', (e) => {
            if (isDragging) scrub(e);
        });
        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        if (volumeBar) volumeBar.addEventListener('input', () => {
            audioPlayer.volume = videoPlayer.volume = videoPlayerModal.volume = moderationPlayer.volume = moderationVideoPlayer.volume = volumeBar.value;
            saveVolumeSetting(volumeBar.value);
        });
    };

    loadOpacitySetting();
    loadBlurSetting();
    loadVolumeSetting();
    initEventListeners();
    fetchAndRenderAll();
    fetchCategories();

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        updateUIForAuth(JSON.parse(savedUser));
    }
});