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

    const mainContent = document.querySelector('.main-content');
    const allGridContainer = document.getElementById('allGridContainer');
    const popularGridContainer = document.getElementById('popularGridContainer');
    const featuredSection = document.getElementById('featuredSection');
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
    const playerEqualizer = document.getElementById('playerEqualizer');
    
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
    const genreSelect = document.getElementById('genreSelect');
    const categorySelect = document.getElementById('categorySelect');
    const artistFields = document.getElementById('artistFields');
    const isForeignArtist = document.getElementById('isForeignArtist');

    const settingsModal = document.getElementById('settingsModal');
    const settingsBtn = document.getElementById('settingsBtn');
    const closeSettingsBtn = settingsModal.querySelector('.close-btn');
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');

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
    const popularCategoriesGrid = document.getElementById('popularCategoriesGrid');
    const allGenresGrid = document.getElementById('allGenresGrid');
    const customCategoriesGrid = document.getElementById('customCategoriesGrid');
    const specificCategoryView = document.getElementById('specificCategoryView');
    const specificCategoryTitle = document.getElementById('specificCategoryTitle');
    const specificCategoryGrid = document.getElementById('specificCategoryGrid');
    
    const homeView = document.getElementById('homeView');
    const xrecomenSection = document.getElementById('xrecomenSection');
    const xrecomenBtn = document.getElementById('xrecomenBtn');
    const youLikeGrid = document.getElementById('youLikeGrid');
    const youMayLikeGrid = document.getElementById('youMayLikeGrid');
    const favoriteCollectionsGrid = document.getElementById('favoriteCollectionsGrid');
    const xrecomenEqualizer = document.getElementById('xrecomenEqualizer');
    const nowPlayingText = document.getElementById('nowPlayingText');
    
    const moderationModal = document.getElementById('moderationModal');
    const closeModerationBtn = document.getElementById('closeModerationBtn');
    const moderationTitle = document.getElementById('moderationTitle');
    const moderationArtist = document.getElementById('moderationArtist');
    const moderationGenre = document.getElementById('moderationGenre');
    const moderationPlayer = document.getElementById('moderationPlayer');
    const moderationPlayerCover = document.getElementById('moderationPlayerCover');
    const moderationApproveBtn = document.getElementById('moderationApproveBtn');
    const moderationRejectBtn = document.getElementById('moderationRejectBtn');
    const moderationGenreSelect = document.getElementById('moderationGenreSelect');
    
    const analyticsChart = document.getElementById('analyticsChart');
    const analyticsTrackTableBody = document.getElementById('analyticsTrackTableBody');
    const totalPlaysEl = document.getElementById('totalPlays');
    
    let chartInstance = null;
    let playTimer;
    
    const fetchAndRenderAll = async () => {
        try {
            const response = await fetch(`${api}/api/tracks`);
            if (!response.ok) throw new Error('Network response was not ok');
            allMedia = await response.json();
            if (currentUser) {
                fetchFavorites();
                fetchXrecomen();
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    
    const fetchXrecomen = async () => {
        if (!currentUser) {
            const randomTrack = allMedia[Math.floor(Math.random() * allMedia.length)];
            if (randomTrack) {
                renderXrecomen(randomTrack);
            }
            return;
        }
        
        try {
            const response = await fetch(`${api}/api/xrecomen/${currentUser.id}`);
            const data = await response.json();
            if (data.xrecomenTrack) {
                renderXrecomen(data.xrecomenTrack);
            }
            if (data.youLike) {
                renderMediaInContainer(youLikeGrid, data.youLike, true);
            }
            if (data.youMayLike) {
                renderMediaInContainer(youMayLikeGrid, data.youMayLike, true);
            }
            if (data.favoriteCollections) {
                renderFavoriteCollections(data.favoriteCollections);
            }
        } catch (error) {
            console.error('Ошибка при получении рекомендаций:', error);
        }
    };
    
    const renderXrecomen = (track) => {
        const index = allMedia.findIndex(t => t.id === track.id);
        xrecomenBtn.dataset.index = index;
    };
    
    const renderFavoriteCollections = (collections) => {
        favoriteCollectionsGrid.innerHTML = '';
        collections.forEach(col => {
            const card = document.createElement('div');
            card.className = 'collection-card';
            card.dataset.categoryId = col.id;
            card.innerHTML = `<h3>${col.name}</h3><p>${col.track_count} треков</p>`;
            favoriteCollectionsGrid.appendChild(card);
        });
    };

    const fetchCategoriesAndGenres = async () => {
        try {
            const genresRes = await fetch(`${api}/api/genres`);
            const genres = await genresRes.json();
            allGenresGrid.innerHTML = '';
            genres.forEach(genre => {
                const genreCard = document.createElement('div');
                genreCard.className = 'genre-card';
                genreCard.dataset.genreId = genre.id;
                genreCard.innerHTML = `<h3>${genre.name}</h3>`;
                allGenresGrid.appendChild(genreCard);
            });

            const categoriesRes = await fetch(`${api}/api/categories`);
            const categories = await categoriesRes.json();
            customCategoriesGrid.innerHTML = '';
            const popularCategories = categories.filter(c => ['Популярные', 'Для вас', 'Возможно вам понравится'].includes(c.name));
            popularCategoriesGrid.innerHTML = '';
            popularCategories.forEach(cat => {
                const catCard = document.createElement('div');
                catCard.className = 'category-card';
                catCard.dataset.categoryId = cat.id;
                catCard.innerHTML = `<h3>${cat.name}</h3>`;
                popularCategoriesGrid.appendChild(catCard);
            });
            const otherCategories = categories.filter(c => !popularCategories.map(p => p.id).includes(c.id));
            otherCategories.forEach(cat => {
                const catCard = document.createElement('div');
                catCard.className = 'category-card';
                catCard.dataset.categoryId = cat.id;
                catCard.innerHTML = `<h3>${cat.name}</h3>`;
                customCategoriesGrid.appendChild(catCard);
            });

            if (genreSelect) {
                genreSelect.innerHTML = '<option value="">Выберите жанр</option>';
                genres.forEach(g => {
                    const option = document.createElement('option');
                    option.value = g.id;
                    option.textContent = g.name;
                    genreSelect.appendChild(option);
                });
            }
            if (moderationGenreSelect) {
                moderationGenreSelect.innerHTML = '';
                genres.forEach(g => {
                    const option = document.createElement('option');
                    option.value = g.id;
                    option.textContent = g.name;
                    moderationGenreSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    
    const fetchAndRenderCategoryTracks = async (categoryId) => {
        try {
            const response = await fetch(`${api}/api/tracks?categoryId=${categoryId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const categoryTracks = await response.json();
            renderMediaInContainer(specificCategoryGrid, categoryTracks, true);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const fetchAndRenderGenreTracks = async (genreId) => {
        try {
            const response = await fetch(`${api}/api/tracks?genreId=${genreId}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const genreTracks = await response.json();
            renderMediaInContainer(specificCategoryGrid, genreTracks, true);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };
    
    const updateUIForAuth = (user) => {
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            loginBtn.style.display = 'none';
            navFavorites.style.display = 'flex';
            creatorStudioBtn.style.display = 'block';
            welcomeMessage.textContent = `Привет, ${user.username}!`;
            welcomeMessage.style.display = 'block';
            logoutBtn.style.display = 'block';
            fetchFavorites();

            if (user.role === 'creator' || user.role === 'admin') {
                myTracksBtn.style.display = 'flex';
                analyticsBtn.style.display = 'flex';
                fetchCreatorCategories();
            }
            if (user.role === 'admin') {
                document.querySelectorAll('.admin-section').forEach(btn => btn.style.display = 'flex');
            }
        } else {
            currentUser = null;
            localStorage.removeItem('currentUser');
            loginBtn.style.display = 'block';
            navFavorites.style.display = 'none';
            creatorStudioBtn.style.display = 'none';
            welcomeMessage.style.display = 'none';
            logoutBtn.style.display = 'none';
            userFavorites = [];
            myTracksBtn.style.display = 'none';
            analyticsBtn.style.display = 'none';
            document.querySelectorAll('.admin-section').forEach(btn => btn.style.display = 'none');
            if (document.querySelector('.view.active-view').id === 'favoritesView') {
                switchView('homeView');
            }
        }
    };
    
    const fetchCreatorCategories = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(`${api}/api/creator/my-categories/${currentUser.id}`);
            if (!response.ok) throw new Error('Ошибка при получении категорий.');
            const categories = await response.json();
            categorySelect.innerHTML = '';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error(error);
        }
    };
    
    const fetchFavorites = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(`${api}/api/favorites/${currentUser.id}`);
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
        renderMediaInContainer(favoritesGridContainer, favoriteMedia, true, true);
    };

    const renderAllTracks = (mediaToRender) => {
        allGridContainer.innerHTML = '';
        if (mediaToRender.length === 0) {
            allGridContainer.innerHTML = `<p>Здесь пока ничего нет.</p>`;
            return;
        }
        renderMediaInContainer(allGridContainer, mediaToRender, true);
    };

    const renderHomePage = (media) => {
        if (media.length === 0) {
            return;
        }
        
        const youLike = document.getElementById('youLikeGrid');
        const youMayLike = document.getElementById('youMayLikeGrid');
        const favoriteCollections = document.getElementById('favoriteCollectionsGrid');
        
        const youLikeMedia = [...media].sort(() => 0.5 - Math.random()).slice(0, 5);
        renderMediaInContainer(youLike, youLikeMedia, false);
        
        const youMayLikeMedia = [...media].sort(() => 0.5 - Math.random()).slice(0, 5);
        renderMediaInContainer(youMayLike, youMayLikeMedia, false);

        const collections = [
            { id: 1, name: 'Мои любимые', track_count: 10 },
            { id: 2, name: 'Фонк', track_count: 15 },
            { id: 3, name: 'Рок', track_count: 8 }
        ];
        renderFavoriteCollections(collections);
        
    };
    
    const renderMediaInContainer = (container, media, isAllTracksView, isFavoritesView = false) => {
        container.innerHTML = '';
        if (media.length === 0) {
            container.innerHTML = `<p>${isFavoritesView ? 'Здесь пока ничего нет. Добавьте медиа в избранное!' : 'Ничего не найдено'}.</p>`;
            return;
        }
        media.forEach((item) => {
            const globalIndex = allMedia.findIndex(t => t.id === item.id);
            const isFavorite = currentUser ? userFavorites.includes(item.file) : false;
            const card = document.createElement('div');
            card.className = `card ${item.type === 'video' ? 'card--video' : ''}`;
            card.dataset.index = globalIndex;
            
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
            player.style.display = 'none';
            videoPlayerModal.src = `/temp_uploads/${track.file_name}`;
            videoModal.style.display = 'flex';
            videoPlayerModal.play();
        } else {
            videoPlayerModal.pause();
            videoPlayerModal.currentTime = 0;
            videoModal.style.display = 'none';
            player.style.display = 'grid';
            playerCover.src = `/temp_uploads/${track.cover_name}`;
            playerTitle.textContent = track.title;
            playerArtist.textContent = `от ${track.username}`;
            activeMediaElement = audioPlayer;
            activeMediaElement.src = `/temp_uploads/${track.file_name}`;
            activeMediaElement.play().catch(e => console.error("Ошибка воспроизведения:", e));
        }
    };

    const playMedia = async (index) => {
        if (index < 0 || index >= allMedia.length) return;
        
        if (player.classList.contains('expanded')) {
            player.classList.remove('expanded');
            playerHeader.classList.remove('expanded');
        }

        hideVideo();
        activeMediaElement.pause();
        activeMediaElement.currentTime = 0;
        currentTrackIndex = index;
        const item = allMedia[index];
        
        playerTrackInfo.classList.add('fading');
        setTimeout(() => {
            playerCover.src = `/fon/${item.cover}`;
            playerTitle.textContent = item.title;
            playerArtist.textContent = `от ${item.artist || item.creator_name}`;
            
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
            playerTrackInfo.classList.remove('fading');
        }, 150);
        
        if (playTimer) clearTimeout(playTimer);
        playTimer = setTimeout(async () => {
            if (currentUser) {
                await fetch(`${api}/api/update-plays`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser.id, trackId: item.id })
                });
            }
        }, activeMediaElement.duration / 2 * 1000);
    };

    const fetchMyTracks = async () => {
        if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) return;
        try {
            const response = await fetch(`${api}/api/creator/my-tracks/${currentUser.id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            myTracks = await response.json();
            renderMyTracks(myTracks);
        } catch (error) {
            console.error('Ошибка:', error);
            myTracksSection.innerHTML = `<p>Не удалось загрузить ваши треки.</p>`;
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
                    <button class="delete-my-track-btn">Удалить</button>
                `;
                myTracksGrid.appendChild(card);
            });
        }
        myTracksSection.appendChild(myTracksGrid);

        document.getElementById('uploadTrackBtn').addEventListener('click', () => {
            uploadModal.style.display = 'flex';
        });
    };

    const fetchCreatorStats = async () => {
        if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) return;
        try {
            const response = await fetch(`${api}/api/creator/analytics/${currentUser.id}`);
            const stats = await response.json();
            
            totalPlaysEl.textContent = stats.totalPlays;
            
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
            
            analyticsTrackTableBody.innerHTML = '';
            stats.trackStats.forEach(track => {
                const row = document.createElement('tr');
                row.innerHTML = `<td>${track.title}</td><td>${track.plays}</td>`;
                analyticsTrackTableBody.appendChild(row);
            });
            
        } catch (error) {
            console.error(error);
            analyticsSection.innerHTML = `<p>Не удалось загрузить статистику.</p>`;
        }
    };

    const applyOpacity = (value) => {
        document.documentElement.style.setProperty('--ui-opacity', value);
        opacitySlider.value = value;
        opacityValue.textContent = `${Math.round(value * 100)}%`;
    };

    const saveOpacitySetting = (value) => {
        localStorage.setItem('uiOpacity', value);
    };

    const loadOpacitySetting = () => {
        const savedOpacity = localStorage.getItem('uiOpacity') || 0.5;
        applyOpacity(savedOpacity);
    };

    const showVideo = () => videoBackgroundContainer.classList.add('visible');
    const hideVideo = () => videoBackgroundContainer.classList.remove('visible');
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const switchView = (viewIdToShow) => {
        document.querySelectorAll('.nav-link, .creator-nav-btn').forEach(l => l.classList.remove('active'));
        
        homeView.style.display = 'none';
        categoriesView.style.display = 'none';
        favoritesView.style.display = 'none';
        creatorView.style.display = 'none';
        
        // Скрываем все элементы главной страницы
        xrecomenSection.style.display = 'none';
        
        if (viewIdToShow === 'homeView') {
            document.getElementById('navHome').classList.add('active');
            viewTitle.textContent = 'Главная';
            homeView.style.display = 'block';
            searchBarWrapper.style.display = 'block';
            player.style.display = 'grid';
            xrecomenSection.style.display = 'block';
            fetchXrecomen();
        } else if (viewIdToShow === 'categoriesView') {
            document.getElementById('navCategories').classList.add('active');
            viewTitle.textContent = 'Категории';
            categoriesView.style.display = 'block';
            searchBarWrapper.style.display = 'block';
            player.style.display = 'grid';
            fetchCategoriesAndGenres();
        } else if (viewIdToShow === 'favoritesView') {
            document.getElementById('navFavorites').classList.add('active');
            viewTitle.textContent = 'Избранное';
            favoritesView.style.display = 'block';
            searchBarWrapper.style.display = 'block';
            player.style.display = 'grid';
            fetchFavorites();
        } else if (viewIdToShow === 'creatorView') {
            viewTitle.textContent = 'Creator Studio';
            creatorView.style.display = 'block';
            searchBarWrapper.style.display = 'none';
            player.style.display = 'none';
            if (currentUser.role === 'admin') {
                document.getElementById('adminApplicationsBtn').classList.add('active');
                adminApplicationsSection.style.display = 'block';
                fetchAdminApplications();
            } else {
                document.getElementById('analyticsBtn').classList.add('active');
                analyticsSection.style.display = 'block';
                fetchCreatorStats();
            }
        }
        
        views.forEach(view => view.classList.toggle('active-view', view.id === viewIdToShow));
    };

    const toggleCreatorMode = (enable) => {
        if (enable) {
            document.body.classList.add('creator-mode');
            hideVideo();
            activeMediaElement.pause();
            activeMediaElement.currentTime = 0;
            
            xmusicLogo.style.display = 'none';
            xcreatorLogo.style.display = 'block';
            xmusicNav.style.display = 'none';
            xcreatorNav.style.display = 'flex';

            switchView('creatorView');
        } else {
            document.body.classList.remove('creator-mode');
            xcreatorLogo.style.display = 'none';
            xcreatorNav.style.display = 'none';
            xmusicLogo.style.display = 'block';
            xmusicNav.style.display = 'flex';
            
            player.classList.remove('expanded');
            playerHeader.classList.remove('expanded');
            showVideo();

            switchView('homeView');
            fetchAndRenderAll();
        }
    };
    
    const fetchAdminApplications = async () => {
        try {
            const res = await fetch(`${api}/api/admin/applications`);
            const applications = await res.json();
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
        } catch (err) {
            console.error(err);
        }
    };
    
    const fetchAdminCategories = async () => {
        try {
            const res = await fetch(`${api}/api/categories`);
            const categories = await res.json();
            adminCategoriesSection.innerHTML = '<button class="submit-btn create-category-btn">Создать категорию</button>';
            const categoriesList = document.createElement('div');
            categoriesList.className = 'categories-list-container';
            adminCategoriesSection.appendChild(categoriesList);
            categories.forEach(cat => {
                const catDiv = document.createElement('div');
                catDiv.className = 'admin-card';
                catDiv.innerHTML = `
                    <h3>${cat.name}</h3>
                    <button class="edit-category-btn" data-category-id="${cat.id}">Редактировать</button>
                    <button class="delete-category-btn" data-category-id="${cat.id}">Удалить</button>
                `;
                categoriesList.appendChild(catDiv);
            });
        } catch (err) { console.error(err); }
    };

    const fetchAdminUsers = async () => {
        try {
            const res = await fetch(`${api}/api/admin/users`);
            const users = await res.json();
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
        } catch (err) {
            console.error(err);
        }
    };

    const fetchModerationTracks = async () => {
        try {
            const res = await fetch(`${api}/api/admin/moderation-tracks`);
            const tracks = await res.json();
            moderationTracks = tracks;
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
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAdminStats = async () => {
        try {
            const res = await fetch(`${api}/api/admin/stats`);
            const stats = await res.json();
            statsContent.innerHTML = `
                <p>Всего пользователей: ${stats.userCount}</p>
                <p>Треков в медиатеке: ${stats.trackCount}</p>
            `;
        } catch (err) {
            console.error(err);
        }
    };

    const initEventListeners = () => {
        if (navHome) navHome.addEventListener('click', (e) => { e.preventDefault(); switchView('homeView'); fetchXrecomen(); });
        if (navCategories) navCategories.addEventListener('click', (e) => { e.preventDefault(); switchView('categoriesView'); });
        if (navFavorites) navFavorites.addEventListener('click', (e) => { 
            e.preventDefault(); 
            if (currentUser) {
                switchView('favoritesView');
                renderFavorites();
            } else {
                alert('Пожалуйста, войдите, чтобы просмотреть избранное.');
            }
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

                document.querySelectorAll('#creatorView .creator-main-section').forEach(sec => sec.style.display = 'none');

                if (btn.id === 'myTracksBtn') {
                    myTracksSection.style.display = 'block';
                    viewTitle.textContent = 'Мои треки';
                    fetchMyTracks();
                } else if (btn.id === 'analyticsBtn') {
                    analyticsSection.style.display = 'block';
                    viewTitle.textContent = 'Аналитика';
                    fetchCreatorStats();
                } else if (btn.id === 'adminApplicationsBtn') {
                    adminApplicationsSection.style.display = 'block';
                    viewTitle.textContent = 'Заявки в Creator';
                    fetchAdminApplications();
                } else if (btn.id === 'adminUsersBtn') {
                    adminUsersSection.style.display = 'block';
                    viewTitle.textContent = 'Аккаунты';
                    fetchAdminUsers();
                } else if (btn.id === 'adminModerationBtn') {
                    adminModerationSection.style.display = 'block';
                    viewTitle.textContent = 'Треки на модерации';
                    fetchModerationTracks();
                } else if (btn.id === 'adminStatsBtn') {
                    adminStatsSection.style.display = 'block';
                    viewTitle.textContent = 'Статистика';
                    fetchAdminStats();
                } else if (btn.id === 'adminCategoriesBtn') {
                    adminCategoriesSection.style.display = 'block';
                    viewTitle.textContent = 'Категории';
                    fetchAdminCategories();
                } else {
                    creatorHomeSection.style.display = 'block';
                    viewTitle.textContent = 'Creator Studio';
                }
            });
        });

        if (applyBtn) applyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('Пожалуйста, войдите, чтобы подать заявку.');
                return;
            }
            applicationModal.style.display = 'flex';
        });

        if (closeApplicationBtn) closeApplicationBtn.addEventListener('click', () => applicationModal.style.display = 'none');
        if (applicationModal) applicationModal.addEventListener('click', (e) => { if (e.target === applicationModal) applicationModal.style.display = 'none'; });

        if (uploadTrackBtn) uploadTrackBtn.addEventListener('click', () => {
            uploadModal.style.display = 'flex';
            uploadManager.style.display = 'none';
            document.querySelector('#uploadForm button[type="submit"]').textContent = 'Отправить на модерацию';
        });

        if (closeUploadBtn) closeUploadBtn.addEventListener('click', () => uploadModal.style.display = 'none');
        if (uploadModal) uploadModal.addEventListener('click', (e) => { if (e.target === uploadModal) uploadModal.style.display = 'none'; });
        
        if (isForeignArtist) isForeignArtist.addEventListener('change', () => {
            artistFields.style.display = isForeignArtist.checked ? 'block' : 'none';
        });

        if (settingsBtn) settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
        if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');
        if (settingsModal) settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.style.display = 'none'; });

        if (loginBtn) loginBtn.addEventListener('click', () => loginModal.style.display = 'flex');
        if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => loginModal.style.display = 'none');
        if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', () => registerModal.style.display = 'none');
        if (switchToRegisterBtn) switchToRegisterBtn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
        if (switchToLoginBtn) switchToLoginBtn.addEventListener('click', () => {
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
        if (logoutBtn) logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            updateUIForAuth(null);
            toggleCreatorMode(false);
        });
        
        if(closeVideoBtn) closeVideoBtn.addEventListener('click', () => {
            videoPlayerModal.pause();
            videoPlayerModal.currentTime = 0;
            videoModal.style.display = 'none';
        });
        
        if(closeModerationBtn) closeModerationBtn.addEventListener('click', () => {
            moderationModal.style.display = 'none';
            moderationPlayer.pause();
            moderationPlayer.currentTime = 0;
        });

        window.addEventListener('keydown', (e) => { 
            if (e.key === 'Escape') {
                if (uploadModal) uploadModal.style.display = 'none';
                if (settingsModal) settingsModal.style.display = 'none';
                if (loginModal) loginModal.style.display = 'none';
                if (registerModal) registerModal.style.display = 'none';
                if (videoModal) videoModal.style.display = 'none';
                if (moderationModal) moderationModal.style.display = 'none';
            }
        });
        
        if (uploadTypeRadios) uploadTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const isAudio = radio.value === 'audio';
                audioFields.style.display = isAudio ? 'block' : 'none';
                videoFields.style.display = isAudio ? 'none' : 'block';
                document.getElementById('audioFile').required = isAudio;
                document.getElementById('videoFile').required = !isAudio;
            });
        });
        
        if (applicationForm) applicationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) {
                alert('Пожалуйста, войдите, чтобы подать заявку.');
                return;
            }
            const fullName = document.getElementById('fullName').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const email = document.getElementById('email').value;

            try {
                const res = await fetch(`${api}/api/apply-for-creator`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: currentUser.id, fullName, phoneNumber, email })
                });
                const result = await res.json();
                alert(result.message);
                if (res.ok) applicationModal.style.display = 'none';
            } catch (err) { alert('Ошибка при отправке заявки.'); }
        });
        
        if (uploadForm) uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            uploadManager.style.display = 'block';
            uploadProgressBar.style.width = '0%';
            uploadStatusText.textContent = 'Подготовка к загрузке...';
            uploadSubmitBtn.disabled = true;

            const formData = new FormData(uploadForm);
            formData.append('userId', currentUser.id);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${api}/api/moderation/upload`, true);
        
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    uploadProgressBar.style.width = `${percent}%`;
                    uploadStatusText.textContent = `Загрузка: ${percent}%`;
                }
            });
        
            xhr.onload = () => {
                if (xhr.status === 201) {
                    uploadStatusText.textContent = 'Загружено! Ожидайте модерации.';
                    setTimeout(() => {
                        uploadModal.style.display = 'none';
                        uploadForm.reset();
                        uploadManager.style.display = 'none';
                        uploadSubmitBtn.disabled = false;
                        alert('Трек отправлен на модерацию. Ожидайте одобрения.');
                    }, 1000);
                } else {
                    const result = JSON.parse(xhr.responseText);
                    uploadStatusText.textContent = 'Ошибка загрузки: ' + result.message;
                    uploadProgressBar.style.width = '0%';
                    uploadSubmitBtn.disabled = false;
                }
            };
        
            xhr.onerror = () => {
                uploadStatusText.textContent = 'Сетевая ошибка. Попробуйте снова.';
                uploadSubmitBtn.disabled = false;
            };
        
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
                    localStorage.setItem('currentUser', JSON.stringify(result.user));
                    updateUIForAuth(result.user);
                    loginModal.style.display = 'none';
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
                const res = await fetch(`${api}/api/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                const result = await res.json();
                if (res.ok) {
                    alert(result.message + ' Теперь вы можете войти.');
                    registerModal.style.display = 'none';
                    loginModal.style.display = 'flex';
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

        if (searchInput) searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredMedia = allMedia.filter(item => item.title.toLowerCase().includes(searchTerm) || (item.artist && item.artist.toLowerCase().includes(searchTerm)));
            renderAllTracks(filteredMedia);
            if(document.querySelector('.view.active-view').id !== 'allTracksView') {
                switchView('allTracksView');
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
            const genreCard = e.target.closest('.genre-card');
            const categoryCard = e.target.closest('.category-card');

            if (renameBtn) {
                e.stopPropagation();
                const { trackId, type } = renameBtn.dataset;
                const track = allMedia.find(t => t.id == trackId);
                const newTitle = prompt('Введите новое название:', track.title);
                if (newTitle && newTitle.trim() && newTitle.trim() !== track.title) {
                    try {
                        const res = await fetch(`${api}/api/rename`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ trackId, newTitle: newTitle.trim() })
                        });
                        if(res.ok) fetchAndRenderAll();
                        else alert('Ошибка при переименовании');
                    } catch(err) { console.error(err); }
                }
            } else if (deleteBtn) {
                e.stopPropagation();
                const { trackId } = deleteBtn.dataset;
                const track = allMedia.find(t => t.id == trackId);
                if (confirm(`Вы уверены, что хотите удалить "${track.title}"?`)) {
                    try {
                        const res = await fetch(`${api}/api/tracks/${trackId}`, { method: 'DELETE' });
                        if(res.ok) fetchAndRenderAll();
                        else alert('Ошибка при удалении');
                    } catch(err) { console.error(err); }
                }
            } else if (deleteMyTrackBtn) {
                e.stopPropagation();
                const trackId = e.target.closest('.my-track-card').dataset.trackId;
                const track = myTracks.find(t => t.id == trackId);
                if (confirm(`Вы уверены, что хотите удалить трек "${track.title}"?`)) {
                    try {
                        const res = await fetch(`${api}/api/creator/my-tracks/${trackId}`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: currentUser.id, userRole: currentUser.role })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if(res.ok) fetchMyTracks();
                    } catch(err) { console.error(err); }
                }
            } else if (favoriteBtn && currentUser) {
                e.stopPropagation();
                const mediaFile = favoriteBtn.dataset.file;
                const isFavorite = favoriteBtn.classList.contains('favorited');
                try {
                    const res = await fetch(`${api}/api/favorites`, {
                        method: isFavorite ? 'DELETE' : 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: currentUser.id, mediaFile })
                    });
                    if (res.ok) {
                        if (isFavorite) {
                            userFavorites = userFavorites.filter(f => f !== mediaFile);
                            favoriteBtn.classList.remove('favorited');
                            favoriteBtn.title = 'Добавить в избранное';
                            renderFavorites();
                        } else {
                            userFavorites.push(mediaFile);
                            favoriteBtn.classList.add('favorited');
                            favoriteBtn.title = 'Удалить из избранного';
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
                    const res = await fetch(`${api}/api/admin/approve-application`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId })
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) fetchAdminApplications();
                } catch (err) { alert('Ошибка при одобрении заявки.'); }
            } else if (rejectAppBtn) {
                e.stopPropagation();
                const appId = rejectAppBtn.dataset.appId;
                try {
                    const res = await fetch(`${api}/api/admin/reject-application`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ appId })
                    });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) fetchAdminApplications();
                } catch (err) { alert('Ошибка при отклонении заявки.'); }
            } else if (moderationCheckBtn) {
                e.stopPropagation();
                const trackId = e.target.closest('.creator-moderation-card').dataset.index;
                const track = moderationTracks[trackId];
                
                moderationTitle.textContent = track.title;
                moderationArtist.textContent = `Исполнитель: ${track.artist || track.username}`;
                moderationGenre.textContent = `Жанр: ${track.genre_name}`;
                moderationGenreSelect.value = track.genre_id;
                
                if (track.type === 'audio') {
                    moderationPlayer.src = `/temp_uploads/${track.file_name}`;
                    moderationPlayerCover.src = `/temp_uploads/${track.cover_name}`;
                    moderationPlayer.style.display = 'block';
                    moderationPlayerCover.style.display = 'block';
                } else {
                    moderationPlayer.style.display = 'none';
                    moderationPlayerCover.style.display = 'none';
                    alert('Это видео. Воспроизведение в модальном окне не поддерживается.');
                }
                
                moderationApproveBtn.dataset.trackId = track.id;
                moderationApproveBtn.dataset.fileName = track.file_name;
                moderationApproveBtn.dataset.coverName = track.cover_name;
                moderationApproveBtn.dataset.title = track.title;
                moderationApproveBtn.dataset.type = track.type;
                moderationApproveBtn.dataset.creatorId = track.user_id;
                moderationApproveBtn.dataset.artist = track.artist;
                moderationApproveBtn.dataset.categoryId = track.category_id;
                
                moderationRejectBtn.dataset.trackId = track.id;
                
                moderationModal.style.display = 'flex';
            } else if (changeRoleBtn) {
                e.stopPropagation();
                const userId = changeRoleBtn.dataset.userId;
                const currentRole = changeRoleBtn.dataset.currentRole;
                const newRole = prompt(`Сменить роль пользователя на: 'user', 'creator' или 'admin'. Текущая роль: ${currentRole}`);
                if (newRole && ['user', 'creator', 'admin'].includes(newRole)) {
                    try {
                        const res = await fetch(`${api}/api/admin/update-role`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId, role: newRole })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) { alert('Ошибка при смене роли.'); }
                }
            } else if (changePasswordBtn) {
                e.stopPropagation();
                const userId = changePasswordBtn.dataset.userId;
                const newPassword = prompt('Введите новый пароль:');
                if (newPassword && newPassword.trim()) {
                    try {
                        const res = await fetch(`${api}/api/admin/change-password`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId, newPassword })
                        });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) { alert('Ошибка при смене пароля.'); }
                }
            } else if (deleteUserBtn) {
                e.stopPropagation();
                const userId = deleteUserBtn.dataset.userId;
                if (confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
                    try {
                        const res = await fetch(`${api}/api/admin/delete-user/${userId}`, { method: 'DELETE' });
                        const result = await res.json();
                        alert(result.message);
                        if (res.ok) fetchAdminUsers();
                    } catch (err) { alert('Ошибка при удалении пользователя.'); }
                }
            } else if (card && card.dataset.index) {
                const index = parseInt(card.dataset.index, 10);
                if (index >= 0) playMedia(index);
            } else if (genreCard) {
                const genreId = genreCard.dataset.genreId;
                specificCategoryTitle.textContent = genreCard.textContent;
                specificCategoryView.style.display = 'block';
                allGridContainer.style.display = 'none';
                fetchAndRenderGenreTracks(genreId);
            } else if (categoryCard) {
                const categoryId = categoryCard.dataset.categoryId;
                specificCategoryTitle.textContent = categoryCard.textContent;
                specificCategoryView.style.display = 'block';
                allGridContainer.style.display = 'none';
                fetchAndRenderCategoryTracks(categoryId);
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
            const genreId = moderationGenreSelect.value;
            
            try {
                const res = await fetch(`${api}/api/admin/approve-track`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ trackId, fileName, coverName, title, type, creatorId, genreId, artist, categoryId })
                });
                const result = await res.json();
                alert(result.message);
                if (res.ok) {
                    moderationModal.style.display = 'none';
                    moderationPlayer.pause();
                    fetchModerationTracks();
                    fetchAndRenderAll();
                }
            } catch (err) { alert('Ошибка при одобрении трека.'); }
        });
        
        if (moderationRejectBtn) moderationRejectBtn.addEventListener('click', async () => {
            const trackId = moderationRejectBtn.dataset.trackId;
            if (confirm('Вы уверены, что хотите отклонить этот трек?')) {
                try {
                    const res = await fetch(`${api}/api/admin/reject-track/${trackId}`, { method: 'DELETE' });
                    const result = await res.json();
                    alert(result.message);
                    if (res.ok) {
                        moderationModal.style.display = 'none';
                        moderationPlayer.pause();
                        fetchModerationTracks();
                    }
                } catch (err) { alert('Ошибка при отклонении трека.'); }
            }
        });
        
        if (playPauseBtn) playPauseBtn.addEventListener('click', () => {
            if (activeMediaElement.paused) {
                if (currentTrackIndex === -1 && allMedia.length > 0) playMedia(0);
                else activeMediaElement.play();
            } else { activeMediaElement.pause(); }
        });

        if (repeatBtn) repeatBtn.addEventListener('click', () => {
            repeatMode = !repeatMode;
            repeatBtn.classList.toggle('active', repeatMode);
            [audioPlayer, videoPlayer, videoPlayerModal, moderationPlayer].forEach(el => el.loop = repeatMode);
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
                const currentTrack = allMedia[currentTrackIndex];
                const isFavorite = userFavorites.includes(currentTrack.file);

                try {
                    const res = await fetch(`${api}/api/favorites`, {
                        method: isFavorite ? 'DELETE' : 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: currentUser.id, mediaFile: currentTrack.file })
                    });
                    if (res.ok) {
                        if (isFavorite) {
                            userFavorites = userFavorites.filter(f => f !== mediaFile);
                            favoritePlayerBtn.classList.remove('favorited');
                            favoritePlayerBtn.title = 'Добавить в избранное';
                        } else {
                            userFavorites.push(mediaFile);
                            favoritePlayerBtn.classList.add('favorited');
                            favoritePlayerBtn.title = 'Удалить из избранного';
                        }
                    } else {
                        alert('Ошибка при изменении избранного.');
                    }
                } catch (err) {
                    console.error(err);
                    alert('Ошибка при изменении избранного.');
                }
            });
        }
        
        if (playerHeader) playerHeader.addEventListener('click', () => {
            if (player.classList.contains('expanded')) {
                player.classList.remove('expanded');
                playerHeader.classList.remove('expanded');
                controlButtonsAndProgress.style.display = 'flex';
                volumeControls.style.display = 'flex';
            } else {
                player.classList.add('expanded');
                playerHeader.classList.add('expanded');
            }
        });
        
        const onPlay = () => { 
            playIcon.style.display = 'none'; 
            pauseIcon.style.display = 'block'; 
            if (playerEqualizer) playerEqualizer.classList.add('active');
            if (xrecomenEqualizer) xrecomenEqualizer.classList.add('active');
            
            if(currentTrackIndex !== -1 && allMedia[currentTrackIndex]) {
                const track = allMedia[currentTrackIndex];
                nowPlayingText.textContent = `Сейчас играет: ${track.title} от ${track.artist || track.creator_name}`;
                nowPlayingText.classList.add('visible');
                setTimeout(() => {
                    nowPlayingText.classList.remove('visible');
                }, 5000);
            }
        };
        
        const onPause = () => { 
            playIcon.style.display = 'block'; 
            pauseIcon.style.display = 'none'; 
            if (playerEqualizer) playerEqualizer.classList.remove('active');
            if (xrecomenEqualizer) xrecomenEqualizer.classList.remove('active');
        };
        
        [audioPlayer, videoPlayer, videoPlayerModal, moderationPlayer].forEach(el => {
            el.addEventListener('play', onPlay);
            el.addEventListener('pause', onPause);
            el.addEventListener('ended', () => { 
                if (!repeatMode) {
                    hideVideo();
                    nextBtn.click();
                }
            });
            el.addEventListener('timeupdate', () => {
                if (!isDragging) {
                    const progress = (el.currentTime / el.duration) * 100 || 0;
                    progressFilled.style.width = `${progress}%`;
                    progressThumb.style.left = `${progress}%`;
                }
                currentTimeEl.textContent = formatTime(el.currentTime);
            });
             el.addEventListener('loadedmetadata', () => {
                if (!isNaN(el.duration)) durationEl.textContent = formatTime(el.duration);
            });
        });

        if (nextBtn) nextBtn.addEventListener('click', () => { if (allMedia.length > 0) playMedia((currentTrackIndex + 1) % allMedia.length); });
        if (prevBtn) prevBtn.addEventListener('click', () => { if (allMedia.length > 0) playMedia((currentTrackIndex - 1 + allMedia.length) % allMedia.length); });
        
        const scrub = (e) => {
            e.preventDefault();
            const rect = progressBarContainer.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            let percentage = (clientX - rect.left) / rect.width;
            percentage = Math.max(0, Math.min(1, percentage));
            if(activeMediaElement.duration) {
                activeMediaElement.currentTime = activeMediaElement.duration * percentage;
            }
        };
        
        if (progressBarContainer) progressBarContainer.addEventListener('mousedown', (e) => { if (allMedia.length > 0) { isDragging = true; scrub(e); } });
        window.addEventListener('mousemove', (e) => { if (isDragging) scrub(e); });
        window.addEventListener('mouseup', () => { isDragging = false; });
        if (progressBarContainer) progressBarContainer.addEventListener('touchstart', (e) => { if (allMedia.length > 0) { isDragging = true; scrub(e); } });
        window.addEventListener('touchmove', (e) => { if (isDragging) scrub(e); });
        window.addEventListener('touchend', () => { isDragging = false; });
        
        if (volumeBar) volumeBar.addEventListener('input', () => { audioPlayer.volume = videoPlayer.volume = videoPlayerModal.volume = moderationPlayer.volume = volumeBar.value; });
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