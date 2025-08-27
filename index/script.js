\document.addEventListener('DOMContentLoaded', () => {
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

    const ACCESS_TOKEN_KEY = "access_token"
    const REFRESH_TOKEN_KEY = "refresh_token"

    const mainContent = document.querySelector('.main-content');
    const allGridContainer = document.getElementById('allGridContainer');
    const popularCategoriesGrid = document.getElementById('popularCategoriesGrid');
    const allGenresGrid = document.getElementById('allGenresGrid');
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
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    const closeBtns = document.querySelectorAll('.close-btn');
    const registerModal = document.getElementById('registerModal');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const player = document.querySelector('.player');
    const playerCover = document.getElementById('playerCover');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressFilled = document.querySelector('.progress-filled');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const volumeBar = document.getElementById('volumeBar');
    const creatorStudioBtn = document.getElementById('creatorStudioBtn');
    const xmusicNav = document.getElementById('xmusicNav');
    const xcreatorNav = document.getElementById('xcreatorNav');
    const xmusicLogo = document.getElementById('xmusicLogo');
    const xcreatorLogo = document.getElementById('xcreatorLogo');
    const backToXMusicBtn = document.getElementById('backToXMusicBtn');
    const creatorView = document.getElementById('creatorView');
    const creatorHomeBtn = document.getElementById('creatorHomeBtn');
    const creatorHomeSection = document.getElementById('creatorHomeSection');
    const myTracksBtn = document.getElementById('myTracksBtn');
    const myTracksSection = document.getElementById('myTracksSection');
    const uploadTrackBtn = document.getElementById('uploadTrackBtn');
    const uploadModal = document.getElementById('uploadModal');
    const uploadForm = document.getElementById('uploadForm');
    const audioFile = document.getElementById('audioFile');
    const videoFile = document.getElementById('videoFile');
    const audioFields = document.getElementById('audioFields');
    const videoFields = document.getElementById('videoFields');
    const trackTitleInput = document.getElementById('trackTitle');
    const coverFileInput = document.getElementById('coverFile');
    const uploadTypeRadios = document.querySelectorAll('input[name="uploadType"]');
    const isForeignArtistCheckbox = document.getElementById('isForeignArtist');
    const artistFields = document.getElementById('artistFields');
    const foreignArtistNameInput = document.getElementById('foreignArtistName');
    const analyticsBtn = document.getElementById('analyticsBtn');
    const analyticsSection = document.getElementById('analyticsSection');
    const totalPlaysElement = document.getElementById('totalPlays');
    const analyticsChartCanvas = document.getElementById('analyticsChart');
    const analyticsTrackTableBody = document.getElementById('analyticsTrackTableBody');
    const homeViewSection = document.getElementById('homeView');
    const categoriesView = document.getElementById('categoriesView');
    const favoritesView = document.getElementById('favoritesView');
    const specificCategoryBtn = document.getElementById('specificCategoryBtn');
    const backToCategoriesBtn = document.getElementById('backToCategoriesBtn');
    const favoritePlayerBtn = document.getElementById('favoritePlayerBtn');
    const favoritesGridContainer = document.getElementById('favoritesGridContainer');
    const adminApplicationsBtn = document.getElementById('adminApplicationsBtn');
    const adminApplicationsSection = document.getElementById('adminApplicationsSection');
    const applicationsList = document.getElementById('applicationsList');
    const applyBtn = document.getElementById('applyBtn');
    const applicationModal = document.getElementById('applicationModal');
    const applicationForm = document.getElementById('applicationForm');
    const adminUsersBtn = document.getElementById('adminUsersBtn');
    const adminUsersSection = document.getElementById('adminUsersSection');
    const usersList = document.getElementById('usersList');
    const adminModerationBtn = document.getElementById('adminModerationBtn');
    const adminModerationSection = document.getElementById('adminModerationSection');
    const moderationTracksList = document.getElementById('moderationTracksList');
    const moderationModal = document.getElementById('moderationModal');
    const closeModerationBtn = document.getElementById('closeModerationBtn');
    const moderationPlayer = document.getElementById('moderationPlayer');
    const moderationVideoPlayer = document.getElementById('moderationVideoPlayer');
    const moderationTitle = document.getElementById('moderationTitle');
    const moderationArtist = document.getElementById('moderationArtist');
    const moderationGenre = document.getElementById('moderationGenre');
    const moderationApproveBtn = document.getElementById('moderationApproveBtn');
    const moderationRejectBtn = document.getElementById('moderationRejectBtn');
    const moderationPlayerCover = document.getElementById('moderationPlayerCover');
    const adminStatsBtn = document.getElementById('adminStatsBtn');
    const adminStatsSection = document.getElementById('adminStatsSection');
    const statsContent = document.getElementById('statsContent');
    const uploadManager = document.getElementById('uploadManager');
    const uploadStatusText = document.getElementById('uploadStatusText');
    const uploadProgressBar = document.querySelector('.upload-progress-fill');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValueSpan = document.getElementById('opacityValue');
    const nowPlayingText = document.getElementById('nowPlayingText');
    const xrecomenBtn = document.getElementById('xrecomenBtn');
    const youLikeGrid = document.getElementById('youLikeGrid');
    const youMayLikeGrid = document.getElementById('youMayLikeGrid');
    const favoriteCollectionsGrid = document.getElementById('favoriteCollectionsGrid');
    const videoModal = document.getElementById('videoModal');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const closeVideoBtn = document.getElementById('closeVideoBtn');
    const adminCategoriesBtn = document.getElementById('adminCategoriesBtn');
    const adminCategoriesSection = document.getElementById('adminCategoriesSection');
    const createCategoryBtn = document.getElementById('createCategoryBtn');
    const adminCategoriesList = document.getElementById('adminCategoriesList');
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
    const categoryForm = document.getElementById('categoryForm');
    const categoryNameInput = document.getElementById('categoryName');
    const userSearchInput = document.getElementById('userSearchInput');
    const userSearchStatus = document.getElementById('userSearchStatus');
    const selectedUsersContainer = document.getElementById('selectedUsersContainer');
    const genreSelect = document.getElementById('genreSelect');
    const categorySelect = document.getElementById('categorySelect');

    const detectGenreBtn = document.getElementById('detectGenreBtn');
    const selectGenreBtn = document.getElementById('selectGenreBtn');
    const fileUploadedStatus = document.getElementById('fileUploadedStatus');
    const selectedGenreDisplay = document.getElementById('selectedGenreDisplay');
    const genreSelectionExpanded = document.getElementById('genreSelectionExpanded');
    const genreSelectWrapper = document.getElementById('genreSelectWrapper');

    // Название файлов с обложкой и медиафайлом
    let uploadedMediaFile = null;

    let analyticsChart = null;
    let selectedUsers = [];

    const genres = [
        { id: 1, name: "джас" },
        { id: 2, name: "диско" },
        { id: 3, name: "инди" },
        { id: 4, name: "кантри" },
        { id: 5, name: "метал" },
        { id: 6, name: "поп" },
        { id: 7, name: "регги" },
        { id: 8, name: "рок" },
        { id: 9, name: "рэп" },
        { id: 10, name: "соул" },
        { id: 11, name: "техно" },
        { id: 12, name: "трэп" },
        { id: 13, name: "фонк" },
        { id: 14, name: "хаус" },
        { id: 15, name: "Хип-хоп" },
        { id: 16, name: "электронная" },
        { id: 17, name: "эмбиент" }
    ];

    const showView = (viewId) => {
        document.querySelectorAll('.view').forEach(view => view.classList.remove('active-view'));
        document.getElementById(viewId).classList.add('active-view');
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    };

    const updateUIForAuth = (user) => {
        if (user) {
            currentUser = user;
            loginBtn.style.display = 'none';
            welcomeMessage.style.display = 'inline';
            welcomeMessage.textContent = `Привет, ${user.username}!`;
            logoutBtn.style.display = 'block';

            navFavorites.style.display = 'block';
            creatorStudioBtn.style.display = 'block';

            if (user.role === 'admin') {
                document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'block');
                creatorHomeBtn.style.display = 'none';
                myTracksBtn.style.display = 'none';
                analyticsBtn.style.display = 'none';
            } else if (user.role === 'creator') {
                creatorHomeBtn.style.display = 'block';
                myTracksBtn.style.display = 'block';
                analyticsBtn.style.display = 'block';
                document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'none');
                applyBtn.style.display = 'none';
            } else {
                creatorHomeBtn.style.display = 'block';
                myTracksBtn.style.display = 'none';
                analyticsBtn.style.display = 'none';
                document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'none');
                applyBtn.style.display = 'block';
            }
            fetchUserFavorites();
            fetchXrecomenData();
        } else {
            currentUser = null;
            loginBtn.style.display = 'block';
            welcomeMessage.style.display = 'none';
            logoutBtn.style.display = 'none';
            navFavorites.style.display = 'none';
            creatorStudioBtn.style.display = 'none';
        }
    };
    
    const displayModal = (modal) => {
        modal.style.display = 'flex';
    };

    const hideModal = (modal) => {
        modal.style.display = 'none';
    };

    const updateUI = (role) => {
        if (role === 'creator' || role === 'admin') {
            document.getElementById('creatorStudioBtn').style.display = 'block';
            if (role === 'creator') {
                document.getElementById('adminApplicationsBtn').style.display = 'none';
                document.getElementById('adminUsersBtn').style.display = 'none';
                document.getElementById('adminModerationBtn').style.display = 'none';
            } else if (role === 'admin') {
                document.getElementById('adminApplicationsBtn').style.display = 'block';
                document.getElementById('adminUsersBtn').style.display = 'block';
                document.getElementById('adminModerationBtn').style.display = 'block';
            }
        } else {
            document.getElementById('creatorStudioBtn').style.display = 'none';
        }
    };
    
    const fetchAllMedia = async () => {
        const response = await fetch(`${api}/api/tracks`);
        const tracks = await response.json();
        allMedia = tracks;
        renderMedia(allMedia);
    };

    const fetchUserFavorites = async () => {
        if (!currentUser) return;
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        try {
            const response = await fetch(`${api}/api/favorites`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                userFavorites = await response.json();
                renderFavorites();
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };
    
    const fetchCategoriesAndGenres = async () => {
        try {
            const genresResponse = await fetch(`${api}/api/genres`);
            const fetchedGenres = await genresResponse.json();
            const categoriesResponse = await fetch(`${api}/api/categories`);
            const fetchedCategories = await categoriesResponse.json();
            
            // Заполняем select для жанров
            if (genreSelect) {
                genreSelect.innerHTML = '<option value="">Выберите жанр</option>';
                genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreSelect.appendChild(option);
                });
            }
            
            // Заполняем select для категорий
            if (categorySelect) {
                categorySelect.innerHTML = '<option value="">(Не выбрано)</option>';
                fetchedCategories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
            }

            // Рендеринг жанров на странице
            if (allGenresGrid) {
                allGenresGrid.innerHTML = '';
                genres.forEach(genre => {
                    const card = document.createElement('div');
                    card.classList.add('genre-card');
                    card.innerHTML = `<span class="genre-name">${genre.name}</span>`;
                    card.addEventListener('click', () => {
                        fetchSpecificCategory(genre.id, genre.name, 'genre');
                    });
                    allGenresGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.error("Error fetching categories and genres:", error);
        }
    };
    
    const fetchSpecificCategory = async (id, title, type) => {
        const url = type === 'genre' ? `${api}/api/tracks?genreId=${id}` : `${api}/api/tracks?categoryId=${id}`;
        try {
            const response = await fetch(url);
            const tracks = await response.json();
            specificCategoryTitle.textContent = title;
            renderMedia(tracks, specificCategoryGrid, false);
            showView('specificCategoryView');
            document.getElementById('navCategories').classList.add('active');
        } catch (error) {
            console.error("Error fetching specific category:", error);
        }
    };
    
    const renderMedia = (media, container = allGridContainer, showPagination = true) => {
        if (!container) return;
        container.innerHTML = '';
        media.forEach((item, index) => {
            const card = document.createElement('div');
            card.classList.add('media-card');
            if (userFavorites.includes(item.file)) {
                card.classList.add('favorite');
            }
            card.setAttribute('data-index', allMedia.indexOf(item));
            card.innerHTML = `
                <img src="${item.cover}" alt="${item.title}" class="media-cover">
                <div class="media-info">
                    <span class="media-title">${item.title}</span>
                    <span class="media-artist">${item.artist || item.creator_name || 'Неизвестно'}</span>
                </div>
                <div class="media-actions">
                    <button class="play-btn" data-index="${allMedia.indexOf(item)}">
                        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </button>
                    ${item.type === 'video' ? `<button class="video-btn" data-file="${item.file}"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M10 16.5l6-4.5-6-4.5v9zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14.01L4 18V6l16-.01v12.02z"/></svg></button>` : ''}
                </div>
            `;
            container.appendChild(card);
        });
    };

    const renderFavorites = () => {
        if (!favoritesGridContainer) return;
        favoritesGridContainer.innerHTML = '';
        const favoriteTracks = allMedia.filter(track => userFavorites.includes(track.file));
        renderMedia(favoriteTracks, favoritesGridContainer, false);
    };

    const fetchAndRenderAll = () => {
        fetchAllMedia();
    };

    const fetchXrecomenData = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(`${api}/api/xrecomen/${currentUser.id}`);
            const data = await response.json();
            
            if (data.xrecomenTrack) {
                nowPlayingText.textContent = `Возможно, вам понравится: ${data.xrecomenTrack.title} - ${data.xrecomenTrack.artist || data.xrecomenTrack.creator_name}`;
                xrecomenBtn.style.display = 'flex';
                xrecomenBtn.onclick = () => playMedia(data.xrecomenTrack.id);
            } else {
                xrecomenBtn.style.display = 'none';
            }
            
            renderMedia(data.youLike, youLikeGrid, false);
            renderMedia(data.youMayLike, youMayLikeGrid, false);
            renderCollections(data.favoriteCollections, favoriteCollectionsGrid);
        } catch (error) {
            console.error("Error fetching xrecomen data:", error);
        }
    };
    
    const renderCollections = (collections, container) => {
        if (!container) return;
        container.innerHTML = '';
        collections.forEach(collection => {
            const card = document.createElement('div');
            card.classList.add('collection-card');
            card.innerHTML = `<span class="collection-name">${collection.name}</span>`;
            card.addEventListener('click', () => {
                fetchSpecificCategory(collection.id, collection.name, 'category');
            });
            container.appendChild(card);
        });
    };

    const playMedia = (index) => {
        if (typeof index === 'number') {
            currentTrackIndex = index;
        }
        const track = allMedia[currentTrackIndex];
        if (!track) return;

        playerCover.src = track.cover;
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist || track.creator_name || 'Неизвестно';
        player.style.display = 'flex';

        if (track.type === 'audio') {
            activeMediaElement = audioPlayer;
            audioPlayer.src = track.file;
            videoPlayer.style.display = 'none';
        } else {
            activeMediaElement = videoPlayer;
            videoPlayer.style.display = 'block';
            videoPlayer.src = track.file;
        }

        activeMediaElement.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        updatePlaybackData(track.id, activeMediaElement);
    };

    const updatePlaybackData = async (trackId, mediaElement) => {
        if (!currentUser) return;
        mediaElement.addEventListener('play', () => {
            if (mediaElement.currentTime === 0) {
                const data = {
                    userId: currentUser.id,
                    trackId: trackId,
                    currentTime: 0,
                    duration: mediaElement.duration
                };
                fetch(`${api}/api/update-playback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                }).catch(err => console.error("Error updating playback:", err));
            }
        });
    };
    
    const updateProgress = () => {
        if (!activeMediaElement || isDragging) return;
        const duration = activeMediaElement.duration;
        const currentTime = activeMediaElement.currentTime;

        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            progressFilled.style.width = `${progress}%`;
            currentTimeSpan.textContent = formatTime(currentTime);
            durationSpan.textContent = formatTime(duration);
        } else {
            currentTimeSpan.textContent = '0:00';
            durationSpan.textContent = '0:00';
        }
    };
    
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlayPause = () => {
        if (activeMediaElement.paused) {
            activeMediaElement.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            activeMediaElement.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    };

    const playNext = () => {
        if (allMedia.length === 0) return;
        if (repeatMode) {
            playMedia(currentTrackIndex);
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % allMedia.length;
            playMedia(currentTrackIndex);
        }
    };

    const playPrev = () => {
        if (allMedia.length === 0) return;
        if (repeatMode) {
            playMedia(currentTrackIndex);
        } else {
            currentTrackIndex = (currentTrackIndex - 1 + allMedia.length) % allMedia.length;
            playMedia(currentTrackIndex);
        }
    };

    const toggleFavorite = async () => {
        if (!currentUser) {
            alert('Чтобы добавить в избранное, войдите в аккаунт.');
            return;
        }
        const track = allMedia[currentTrackIndex];
        if (!track) return;
        
        const isFavorite = userFavorites.includes(track.file);
        const method = isFavorite ? 'DELETE' : 'POST';

        try {
            const response = await fetch(`${api}/api/favorites`, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, mediaFile: track.file })
            });

            if (response.ok) {
                if (isFavorite) {
                    userFavorites = userFavorites.filter(file => file !== track.file);
                    favoritePlayerBtn.textContent = '❤';
                } else {
                    userFavorites.push(track.file);
                    favoritePlayerBtn.textContent = '❤️';
                }
                const trackCard = document.querySelector(`.media-card[data-index="${currentTrackIndex}"]`);
                if (trackCard) {
                    trackCard.classList.toggle('favorite', !isFavorite);
                }
                renderFavorites();
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };
    
    const fetchModerationTracks = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        try {
            const response = await fetch(`${api}/api/admin/moderation-tracks`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                moderationTracks = await response.json();
                renderModerationTracks();
            }
        } catch (error) {
            console.error("Error fetching moderation tracks:", error);
        }
    };
    
    const renderModerationTracks = () => {
        moderationTracksList.innerHTML = '';
        moderationTracks.forEach(track => {
            const trackCard = document.createElement('div');
            trackCard.classList.add('media-card');
            trackCard.innerHTML = `
                <img src="${api}/temp_uploads/${track.cover_name}" alt="${track.title}" class="media-cover">
                <div class="media-info">
                    <span class="media-title">${track.title}</span>
                    <span class="media-artist">${track.artist || track.username}</span>
                </div>
                <div class="media-actions">
                    <button class="approve-btn" data-id="${track.id}">
                        <svg viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
                    </button>
                    <button class="reject-btn" data-id="${track.id}">
                        <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    </button>
                </div>
            `;
            moderationTracksList.appendChild(trackCard);
        });
    };
    
    const fetchUsers = async (query = '') => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!token) return;
        try {
            const response = await fetch(`${api}/api/admin/categories/users?q=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            return [];
        }
    };

    const renderUsersInCategories = (users) => {
        if (!selectedUsersContainer) return;
        selectedUsersContainer.innerHTML = '';
        users.forEach(user => {
            const userTag = document.createElement('span');
            userTag.classList.add('selected-user');
            userTag.innerHTML = `
                ${user.username}
                <button type="button" class="remove-user" data-id="${user.id}">&times;</button>
            `;
            userTag.querySelector('.remove-user').addEventListener('click', (e) => {
                selectedUsers = selectedUsers.filter(u => u.id !== user.id);
                userTag.remove();
            });
            selectedUsersContainer.appendChild(userTag);
        });
    };
    
    const fetchCategoriesForAdmin = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (!token) return;
        try {
            const response = await fetch(`${api}/api/admin/categories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const categories = await response.json();
                renderAdminCategories(categories);
            }
        } catch (error) {
            console.error("Error fetching admin categories:", error);
        }
    };
    
    const renderAdminCategories = (categories) => {
        if (!adminCategoriesList) return;
        adminCategoriesList.innerHTML = '';
        categories.forEach(category => {
            const card = document.createElement('div');
            card.classList.add('admin-card');
            card.innerHTML = `
                <h3>${category.name}</h3>
                <div class="category-actions">
                    <button class="edit-category-btn" data-id="${category.id}" data-name="${category.name}">Редактировать</button>
                    <button class="delete-category-btn" data-id="${category.id}">Удалить</button>
                </div>
            `;
            adminCategoriesList.appendChild(card);
        });
    };
    
    const fetchCreatorTracks = async () => {
        if (!currentUser) return;
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        try {
            const response = await fetch(`${api}/api/creator/my-tracks/${currentUser.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const tracks = await response.json();
                renderMedia(tracks, myTracksSection, false);
            }
        } catch (error) {
            console.error("Error fetching creator tracks:", error);
        }
    };
    
    const fetchCreatorStats = async () => {
        if (!currentUser) return;
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        try {
            const response = await fetch(`${api}/api/creator/stats/${currentUser.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const stats = await response.json();
                renderAnalytics(stats);
            }
        } catch (error) {
            console.error("Error fetching creator stats:", error);
        }
    };

    const renderAnalytics = (stats) => {
        if (totalPlaysElement) {
            totalPlaysElement.textContent = stats.totalPlays;
        }

        if (analyticsChartCanvas) {
            const labels = stats.dailyPlays.map(d => d.date);
            const data = stats.dailyPlays.map(d => d.count);
            if (analyticsChart) {
                analyticsChart.destroy();
            }
            analyticsChart = new Chart(analyticsChartCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Количество прослушиваний',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
        
        if (analyticsTrackTableBody) {
            analyticsTrackTableBody.innerHTML = '';
            stats.trackStats.forEach(track => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${track.title}</td><td>${track.plays}</td>`;
                analyticsTrackTableBody.appendChild(row);
            });
        }
    };

    const loadOpacitySetting = () => {
        const savedOpacity = localStorage.getItem('uiOpacity');
        if (savedOpacity !== null) {
            document.documentElement.style.setProperty('--ui-opacity', savedOpacity);
            if (opacitySlider) opacitySlider.value = savedOpacity;
            if (opacityValueSpan) opacityValueSpan.textContent = `${Math.round(savedOpacity * 100)}%`;
        }
    };

    const detectGenre = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch(`${api}/api/detect_genre`, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                selectedGenreDisplay.value = result.genre;
                const genreId = genres.find(g => g.name.toLowerCase() === result.genre.toLowerCase())?.id;
                if (genreId) {
                    genreSelect.value = genreId;
                }
            } else {
                alert(`Ошибка определения жанра: ${result.error}`);
            }
        } catch (error) {
            alert('Не удалось связаться с сервером для определения жанра.');
            console.error('Error:', error);
        }
    };
    
    // Инициализация обработчиков событий
    const initEventListeners = () => {
        if (navHome) navHome.addEventListener('click', (e) => {
            e.preventDefault();
            showView('homeView');
            navHome.classList.add('active');
            fetchXrecomenData();
        });
        if (navCategories) navCategories.addEventListener('click', (e) => {
            e.preventDefault();
            showView('categoriesView');
            navCategories.classList.add('active');
        });
        if (navFavorites) navFavorites.addEventListener('click', (e) => {
            e.preventDefault();
            showView('favoritesView');
            navFavorites.classList.add('active');
            renderFavorites();
        });

        if (loginBtn) loginBtn.addEventListener('click', () => displayModal(loginModal));
        if (switchToRegister) switchToRegister.addEventListener('click', () => {
            hideModal(loginModal);
            displayModal(registerModal);
        });
        if (switchToLogin) switchToLogin.addEventListener('click', () => {
            hideModal(registerModal);
            displayModal(loginModal);
        });
        if (logoutBtn) logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            updateUIForAuth(null);
            showView('homeView');
            location.reload();
        });
        closeBtns.forEach(btn => btn.addEventListener('click', () => {
            hideModal(btn.closest('.modal'));
        }));
        if (loginForm) loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.querySelector('#loginUsername').value;
            const password = e.target.querySelector('#loginPassword').value;
            try {
                const response = await fetch(`${api}/api/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem('currentUser', JSON.stringify(data.user));
                    localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
                    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
                    updateUIForAuth(data.user);
                    hideModal(loginModal);
                    location.reload();
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Ошибка входа. Попробуйте еще раз.');
                console.error('Login error:', error);
            }
        });
        if (registerForm) registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = e.target.querySelector('#registerUsername').value;
            const password = e.target.querySelector('#registerPassword').value;
            try {
                const response = await fetch(`${api}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                alert(data.message);
                if (response.ok) {
                    hideModal(registerModal);
                    displayModal(loginModal);
                }
            } catch (error) {
                alert('Ошибка регистрации. Попробуйте еще раз.');
                console.error('Registration error:', error);
            }
        });

        if (creatorStudioBtn) creatorStudioBtn.addEventListener('click', () => {
            showView('creatorView');
            xmusicNav.style.display = 'none';
            xcreatorNav.style.display = 'flex';
            xmusicLogo.style.display = 'none';
            xcreatorLogo.style.display = 'block';
            creatorStudioBtn.classList.add('active');
            document.querySelectorAll('.creator-nav-btn').forEach(btn => btn.classList.remove('active'));
            if (currentUser && currentUser.role === 'user') {
                creatorHomeBtn.classList.add('active');
                document.getElementById('creatorHomeSection').style.display = 'flex';
                document.getElementById('myTracksSection').style.display = 'none';
                document.getElementById('analyticsSection').style.display = 'none';
            } else if (currentUser && currentUser.role === 'creator') {
                myTracksBtn.classList.add('active');
                document.getElementById('creatorHomeSection').style.display = 'none';
                document.getElementById('myTracksSection').style.display = 'block';
                document.getElementById('analyticsSection').style.display = 'none';
                fetchCreatorTracks();
            } else if (currentUser && currentUser.role === 'admin') {
                adminUsersBtn.classList.add('active');
                document.getElementById('creatorHomeSection').style.display = 'none';
                document.getElementById('myTracksSection').style.display = 'none';
                document.getElementById('analyticsSection').style.display = 'none';
                document.getElementById('adminUsersSection').style.display = 'block';
                fetchAdminUsers();
            }
        });
        if (backToXMusicBtn) backToXMusicBtn.addEventListener('click', () => {
            showView('homeView');
            xmusicNav.style.display = 'flex';
            xcreatorNav.style.display = 'none';
            xmusicLogo.style.display = 'block';
            xcreatorLogo.style.display = 'none';
            creatorStudioBtn.classList.remove('active');
            navHome.classList.add('active');
        });
        if (myTracksBtn) myTracksBtn.addEventListener('click', () => {
            document.querySelectorAll('.creator-main-section').forEach(s => s.style.display = 'none');
            document.getElementById('myTracksSection').style.display = 'block';
            document.querySelectorAll('.creator-nav-btn').forEach(btn => btn.classList.remove('active'));
            myTracksBtn.classList.add('active');
            fetchCreatorTracks();
        });
        if (uploadTrackBtn) uploadTrackBtn.addEventListener('click', () => displayModal(uploadModal));
        if (analyticsBtn) analyticsBtn.addEventListener('click', () => {
            document.querySelectorAll('.creator-main-section').forEach(s => s.style.display = 'none');
            document.getElementById('analyticsSection').style.display = 'block';
            document.querySelectorAll('.creator-nav-btn').forEach(btn => btn.classList.remove('active'));
            analyticsBtn.classList.add('active');
            fetchCreatorStats();
        });
        
        // Новый функционал для загрузки и определения жанра
        if (audioFile) audioFile.addEventListener('change', () => {
            fileUploadedStatus.textContent = audioFile.files.length > 0 ? 'Да' : 'Нет';
            detectGenreBtn.disabled = audioFile.files.length === 0;
            uploadedMediaFile = audioFile.files[0];
            selectedGenreDisplay.value = '';
        });
        if (videoFile) videoFile.addEventListener('change', () => {
            fileUploadedStatus.textContent = videoFile.files.length > 0 ? 'Да' : 'Нет';
            detectGenreBtn.disabled = videoFile.files.length === 0;
            uploadedMediaFile = videoFile.files[0];
            selectedGenreDisplay.value = '';
        });
        if (detectGenreBtn) detectGenreBtn.addEventListener('click', async () => {
            if (uploadedMediaFile) {
                await detectGenre(uploadedMediaFile);
            }
        });
        if (selectGenreBtn) selectGenreBtn.addEventListener('click', () => {
            genreSelectWrapper.style.display = 'block';
        });

        if (uploadForm) uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('title', trackTitleInput.value);
            formData.append('coverFile', coverFileInput.files[0]);
            
            const uploadType = document.querySelector('input[name="uploadType"]:checked').value;
            formData.append('uploadType', uploadType);
            
            if (uploadType === 'audio') {
                formData.append('audioFile', audioFile.files[0]);
            } else {
                formData.append('videoFile', videoFile.files[0]);
            }

            formData.append('userId', currentUser.id);
            formData.append('genreId', genreSelect.value);
            formData.append('artist', isForeignArtistCheckbox.checked ? foreignArtistNameInput.value : '');
            formData.append('categoryId', categorySelect.value);

            try {
                uploadManager.style.display = 'block';
                uploadStatusText.textContent = 'Загрузка...';
                
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${api}/api/moderation/upload`, true);
                xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`);
                
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        uploadProgressBar.style.width = `${percentComplete}%`;
                        uploadStatusText.textContent = `Загрузка: ${Math.round(percentComplete)}%`;
                    }
                });

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const result = JSON.parse(xhr.responseText);
                        alert(result.message);
                        hideModal(uploadModal);
                        uploadForm.reset();
                        uploadManager.style.display = 'none';
                        uploadProgressBar.style.width = '0%';
                        fetchCreatorTracks();
                    } else {
                        const result = JSON.parse(xhr.responseText);
                        alert(`Ошибка загрузки: ${result.message}`);
                        uploadManager.style.display = 'none';
                    }
                };

                xhr.onerror = () => {
                    alert('Ошибка загрузки. Проверьте соединение.');
                    uploadManager.style.display = 'none';
                };
                
                xhr.send(formData);

            } catch (error) {
                alert('Ошибка загрузки. Попробуйте еще раз.');
                console.error('Upload error:', error);
            }
        });
        if (isForeignArtistCheckbox) isForeignArtistCheckbox.addEventListener('change', () => {
            artistFields.style.display = isForeignArtistCheckbox.checked ? 'block' : 'none';
        });
        if (uploadTypeRadios) uploadTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'audio') {
                    audioFields.style.display = 'block';
                    videoFields.style.display = 'none';
                    videoFile.required = false;
                    audioFile.required = true;
                } else {
                    audioFields.style.display = 'none';
                    videoFields.style.display = 'block';
                    audioFile.required = false;
                    videoFile.required = true;
                }
            });
        });
        
        if (backToCategoriesBtn) backToCategoriesBtn.addEventListener('click', () => {
            showView('categoriesView');
            document.getElementById('navCategories').classList.add('active');
        });
        if (favoritePlayerBtn) favoritePlayerBtn.addEventListener('click', toggleFavorite);
        if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
        if (prevBtn) prevBtn.addEventListener('click', playPrev);
        if (nextBtn) nextBtn.addEventListener('click', playNext);
        if (repeatBtn) repeatBtn.addEventListener('click', () => {
            repeatMode = !repeatMode;
            repeatBtn.classList.toggle('active', repeatMode);
        });
        if (activeMediaElement) activeMediaElement.addEventListener('timeupdate', updateProgress);
        if (activeMediaElement) activeMediaElement.addEventListener('ended', playNext);
        
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.play-btn')) {
                const index = parseInt(e.target.closest('.play-btn').dataset.index);
                playMedia(index);
            }
            if (e.target.closest('.video-btn')) {
                const file = e.target.closest('.video-btn').dataset.file;
                videoPlayerModal.src = file;
                displayModal(videoModal);
                videoPlayerModal.play();
            }
            if (e.target.closest('.approve-btn')) {
                const trackId = e.target.closest('.approve-btn').dataset.id;
                const track = moderationTracks.find(t => t.id == trackId);
                if (track) {
                    try {
                        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
                        const response = await fetch(`${api}/api/admin/approve-track`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                            body: JSON.stringify({
                                trackId: track.id,
                                fileName: track.file_name,
                                coverName: track.cover_name,
                                title: track.title,
                                type: track.type,
                                creatorId: track.user_id,
                                genreId: track.genre_id,
                                artist: track.artist,
                                categoryId: track.category_id
                            })
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (response.ok) {
                            fetchModerationTracks();
                            fetchAllMedia();
                        }
                    } catch (error) {
                        console.error("Error approving track:", error);
                    }
                }
            }
            if (e.target.closest('.reject-btn')) {
                const trackId = e.target.closest('.reject-btn').dataset.id;
                const token = localStorage.getItem(ACCESS_TOKEN_KEY);
                if (confirm('Вы уверены, что хотите отклонить этот трек?')) {
                    try {
                        const response = await fetch(`${api}/api/admin/reject-track/${trackId}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const result = await response.json();
                        alert(result.message);
                        if (response.ok) {
                            fetchModerationTracks();
                        }
                    } catch (error) {
                        console.error("Error rejecting track:", error);
                    }
                }
            }
        });
        
        if (closeVideoBtn) closeVideoBtn.addEventListener('click', () => {
            videoPlayerModal.pause();
            videoPlayerModal.currentTime = 0;
            hideModal(videoModal);
        });
        
        if (opacitySlider) opacitySlider.addEventListener('input', () => {
            const opacity = opacitySlider.value;
            document.documentElement.style.setProperty('--ui-opacity', opacity);
            opacityValueSpan.textContent = `${Math.round(opacity * 100)}%`;
            localStorage.setItem('uiOpacity', opacity);
        });

        const scrub = (e) => {
            const rect = progressBarContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = Math.max(0, Math.min(1, x / rect.width));
            if (activeMediaElement && activeMediaElement.duration) {
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
                scrub(e.touches[0]);
            }
        });
        window.addEventListener('touchmove', (e) => {
            if (isDragging) scrub(e.touches[0]);
        });
        window.addEventListener('touchend', () => {
            isDragging = false;
        });

        if (volumeBar) volumeBar.addEventListener('input', () => {
            audioPlayer.volume = videoPlayer.volume = videoPlayerModal.volume = moderationPlayer.volume = moderationVideoPlayer.volume = volumeBar.value;
        });
    };

    loadOpacitySetting();
    initEventListeners();
    fetchAndRenderAll();
    fetchCategoriesAndGenres();

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        updateUIForAuth(JSON.parse(savedUser));
    }
});