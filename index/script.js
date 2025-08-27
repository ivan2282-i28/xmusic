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
    const navCreator = document.getElementById('navCreator');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModalBtn = document.getElementById('closeLoginModalBtn');
    const loginForm = document.getElementById('loginForm');
    const navLogin = document.getElementById('navLogin');
    const navLogout = document.getElementById('navLogout');
    const welcomeText = document.getElementById('welcomeText');
    const favoritesView = document.getElementById('favoritesView');
    const favoritesGrid = document.getElementById('favoritesGrid');
    const musicPlayer = document.getElementById('musicPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const trackCover = document.getElementById('trackCover');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const progressBar = document.getElementById('progressBar');
    const timeDisplay = document.getElementById('timeDisplay');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const xCreatorView = document.getElementById('xCreatorView');
    const xMusicLogo = document.getElementById('xmusicLogo');
    const xCreatorLogo = document.getElementById('xcreatorLogo');
    const creatorNavLinks = document.getElementById('creatorNavLinks');
    const uploadForm = document.getElementById('uploadForm');
    const fileUpload = document.getElementById('fileUpload');
    const coverUpload = document.getElementById('coverUpload');
    const genreSelect = document.getElementById('genreSelect');
    const audioList = document.getElementById('audioList');
    const creatorStatsView = document.getElementById('creatorStatsView');
    const totalPlaysEl = document.getElementById('totalPlays');
    const dailyPlaysChart = document.getElementById('dailyPlaysChart');
    const topTracksList = document.getElementById('topTracksList');
    const adminPanelNav = document.getElementById('adminPanelNav');
    const adminPanel = document.getElementById('adminPanel');
    const moderationList = document.getElementById('moderationList');
    const adminUsersList = document.getElementById('adminUsersList');
    const creatorApplicationsList = document.getElementById('creatorApplicationsList');
    const applyForCreatorBtn = document.getElementById('applyForCreatorBtn');
    const applyForCreatorModal = document.getElementById('applyForCreatorModal');
    const closeApplyModalBtn = document.getElementById('closeApplyModalBtn');
    const applyForCreatorForm = document.getElementById('applyForCreatorForm');
    const volumeBar = document.getElementById('volumeBar');
    const videoModal = document.getElementById('videoModal');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const closeVideoModalBtn = document.getElementById('closeVideoModalBtn');
    const videoTitleModal = document.getElementById('videoTitleModal');
    const videoArtistModal = document.getElementById('videoArtistModal');
    const progressBarModal = document.getElementById('progressBarModal');
    const timeDisplayModal = document.getElementById('timeDisplayModal');
    const playPauseModalBtn = document.getElementById('playPauseModalBtn');
    const nextModalBtn = document.getElementById('nextModalBtn');
    const prevModalBtn = document.getElementById('prevModalBtn');
    const progressContainerModal = document.getElementById('progressContainerModal');
    const xrecomenContainer = document.getElementById('xrecomenContainer');
    const youLikeContainer = document.getElementById('youLikeContainer');
    const youMayLikeContainer = document.getElementById('youMayLikeContainer');
    const favoriteCollectionsContainer = document.getElementById('favoriteCollectionsContainer');
    const adminCategoriesList = document.getElementById('adminCategoriesList');
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
    const categoryForm = document.getElementById('categoryForm');
    const categoryNameInput = document.getElementById('categoryName');
    const userSearchInput = document.getElementById('userSearchInput');
    const selectedUsersContainer = document.getElementById('selectedUsersContainer');
    const userSearchStatus = document.getElementById('userSearchStatus');
    const specificGenreTitle = document.getElementById('specificGenreTitle');
    const specificGenreView = document.getElementById('specificGenreView');
    const specificGenreGrid = document.getElementById('specificGenreGrid');

    const opacitySlider = document.getElementById('opacitySlider');
    const videoBackgroundContainer = document.getElementById('videoBackgroundContainer');
    const videoModalOpacitySlider = document.getElementById('videoModalOpacitySlider');

    // Новые элементы для функционала определения жанра
    const genreSelectionContainer = document.getElementById('genreSelectionContainer');
    const selectGenreBtn = document.getElementById('selectGenreBtn');
    const determineGenreBtn = document.getElementById('determineGenreBtn');
    const genreInputGroup = document.getElementById('genreInputGroup');
    const extendedPanel = document.getElementById('extendedPanel');
    const panelStatusText = document.getElementById('panelStatusText');
    const panelGenreText = document.getElementById('panelGenreText');


    const views = {
        'home': homeView,
        'favorites': favoritesView,
        'xcreator': xCreatorView,
        'creator_stats': creatorStatsView,
        'admin_panel': adminPanel,
        'specific_category': specificCategoryView,
        'specific_genre': specificGenreView
    };

    const navLinks = {
        'navHome': 'home',
        'navCategories': 'home',
        'navFavorites': 'favorites',
        'navCreator': 'xcreator',
        'navAdmin': 'admin_panel'
    };

    const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
    const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
    const setTokens = (accessToken, refreshToken) => {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    };
    const removeTokens = () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    };

    const fetchAPI = async (url, options = {}) => {
        const token = getAccessToken();
        const headers = options.headers || {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        options.headers = headers;
        try {
            const response = await fetch(api + url, options);
            if (response.status === 401) {
                // Возможно, токен устарел, пытаемся обновить
                const refreshed = await refreshToken();
                if (refreshed) {
                    const newOptions = { ...options };
                    newOptions.headers['Authorization'] = `Bearer ${getAccessToken()}`;
                    return await fetch(api + url, newOptions);
                } else {
                    handleLogout();
                    throw new Error('Unauthorized');
                }
            }
            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            handleLogout();
            throw error;
        }
    };

    const refreshToken = async () => {
        const refresh = getRefreshToken();
        if (!refresh) return false;

        try {
            const response = await fetch(`${api}/api/auth_refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken: refresh })
            });

            if (!response.ok) throw new Error('Refresh failed');
            const data = await response.json();
            setTokens(data.token, data.refresh);
            return true;
        } catch (error) {
            console.error('Refresh token error:', error);
            return false;
        }
    };

    const showView = (viewName) => {
        Object.values(views).forEach(view => {
            if (view) view.style.display = 'none';
        });

        const viewToShow = views[viewName];
        if (viewToShow) viewToShow.style.display = 'block';

        if (viewName === 'xcreator') {
            xMusicLogo.style.display = 'none';
            xCreatorLogo.style.display = 'block';
        } else {
            xMusicLogo.style.display = 'block';
            xCreatorLogo.style.display = 'none';
        }

        if (viewName === 'home') {
            searchBarWrapper.style.display = 'flex';
        } else {
            searchBarWrapper.style.display = 'none';
        }
    };

    const renderMedia = (media, container, playCallback) => {
        container.innerHTML = '';
        media.forEach(item => {
            const card = document.createElement('div');
            card.className = 'media-card';
            card.innerHTML = `
                <img src="${api}/${item.type === 'video' ? 'fon' : 'fon'}/${item.cover}" alt="${item.title}" class="media-cover">
                <div class="media-info">
                    <div class="media-title">${item.title}</div>
                    <div class="media-artist">${item.artist || item.creator_name || 'Неизвестен'}</div>
                </div>
                <div class="media-card-overlay">
                    <button class="play-btn" data-id="${item.id}" data-file="${item.file}" data-type="${item.type}"><i class="fas fa-play"></i></button>
                    ${currentUser ? `<button class="favorite-btn" data-file="${item.file}"><i class="${userFavorites.includes(item.file) ? 'fas' : 'far'} fa-heart"></i></button>` : ''}
                </div>
            `;
            container.appendChild(card);
            card.querySelector('.play-btn').addEventListener('click', () => {
                if (playCallback) {
                    playCallback(item.id);
                } else {
                    playMedia(item.id);
                }
            });
            if (currentUser) {
                const favoriteBtn = card.querySelector('.favorite-btn');
                favoriteBtn.addEventListener('click', () => {
                    toggleFavorite(item.file);
                });
            }
        });
    };

    const fetchUserFavorites = async (userId) => {
        try {
            const response = await fetchAPI(`/api/favorites?userId=${userId}`);
            if (response.ok) {
                userFavorites = await response.json();
                renderMedia(allMedia, allGridContainer);
                renderMedia(myTracks, audioList);
            }
        } catch (error) {
            console.error('Ошибка при получении избранного:', error);
        }
    };

    const toggleFavorite = async (mediaFile) => {
        if (!currentUser) {
            alert('Сначала войдите в систему.');
            return;
        }

        const isFavorite = userFavorites.includes(mediaFile);
        const url = `${api}/api/favorites`;
        const method = isFavorite ? 'DELETE' : 'POST';

        try {
            const response = await fetchAPI(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, mediaFile: mediaFile })
            });

            if (response.ok) {
                if (isFavorite) {
                    userFavorites = userFavorites.filter(file => file !== mediaFile);
                } else {
                    userFavorites.push(mediaFile);
                }
                renderMedia(allMedia, allGridContainer);
                renderMedia(myTracks, audioList);
                if (favoritesView.style.display === 'block') {
                    fetchFavorites();
                }
            } else {
                alert('Не удалось изменить избранное.');
            }
        } catch (error) {
            console.error('Ошибка при изменении избранного:', error);
        }
    };

    const fetchFavorites = async () => {
        if (!currentUser) return;
        showView('favorites');
        try {
            const response = await fetchAPI(`/api/favorites`);
            if (response.ok) {
                const favoriteFiles = await response.json();
                const allFavoriteTracks = allMedia.filter(track => favoriteFiles.includes(track.file));
                renderMedia(allFavoriteTracks, favoritesGrid);
            }
        } catch (error) {
            console.error('Ошибка при загрузке избранного:', error);
        }
    };

    const fetchAndRenderAll = async () => {
        try {
            const response = await fetchAPI('/api/tracks');
            if (response.ok) {
                allMedia = await response.json();
                renderMedia(allMedia, allGridContainer);
            } else {
                console.error('Не удалось загрузить треки.');
            }
        } catch (error) {
            console.error('Ошибка при загрузке треков:', error);
        }
    };

    const fetchCategoriesAndGenres = async () => {
        try {
            const [genresRes, categoriesRes] = await Promise.all([
                fetchAPI('/api/genres'),
                fetchAPI('/api/categories')
            ]);
            const genres = await genresRes.json();
            const categories = await categoriesRes.json();

            // Рендер жанров
            if (allGenresGrid) {
                renderFilterLinks(genres, allGenresGrid, 'genre');
            }
            if (genreSelect) {
                renderSelectOptions(genres, genreSelect);
            }
            // Рендер категорий
            if (popularCategoriesGrid) {
                renderFilterLinks(categories, popularCategoriesGrid, 'category');
            }
        } catch (error) {
            console.error('Ошибка при загрузке категорий и жанров:', error);
        }
    };

    const renderFilterLinks = (items, container, type) => {
        container.innerHTML = '';
        items.forEach(item => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'media-card filter-card';
            link.textContent = item.name;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showSpecificContent(type, item.id, item.name);
            });
            container.appendChild(link);
        });
    };

    const renderSelectOptions = (items, selectElement) => {
        selectElement.innerHTML = '<option value="" disabled selected>Выберите жанр</option>';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.name;
            selectElement.appendChild(option);
        });
    };

    const showSpecificContent = async (type, id, name) => {
        const titleEl = type === 'genre' ? specificGenreTitle : specificCategoryTitle;
        const gridEl = type === 'genre' ? specificGenreGrid : specificCategoryGrid;
        const viewEl = type === 'genre' ? specificGenreView : specificCategoryView;
        
        titleEl.textContent = name;
        showView(viewEl.id.replace('View', ''));

        try {
            const response = await fetchAPI(`/api/tracks?${type}Id=${id}`);
            const tracks = await response.json();
            renderMedia(tracks, gridEl);
        } catch (error) {
            console.error('Ошибка при загрузке треков:', error);
        }
    };

    const updatePlayPauseIcon = () => {
        if (!activeMediaElement) return;
        const isPlaying = !activeMediaElement.paused;
        if (playPauseBtn) playPauseBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        if (playPauseModalBtn) playPauseModalBtn.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
    };

    const playMedia = (id) => {
        const track = allMedia.find(item => item.id === id);
        if (!track) return;

        currentTrackIndex = allMedia.indexOf(track);

        const isVideo = track.type === 'video';

        if (activeMediaElement === audioPlayer && isVideo) {
            audioPlayer.pause();
            audioPlayer.src = '';
            activeMediaElement = videoPlayer;
        } else if (activeMediaElement === videoPlayer && !isVideo) {
            videoPlayer.pause();
            videoPlayer.src = '';
            activeMediaElement = audioPlayer;
        }

        if (isVideo) {
            musicPlayer.style.display = 'none';
            videoModal.style.display = 'flex';
            videoPlayerModal.src = `${api}/video/${track.file}`;
            videoPlayerModal.play();
            videoPlayerModal.style.opacity = videoModalOpacitySlider.value;
            videoTitleModal.textContent = track.title;
            videoArtistModal.textContent = track.artist || track.creator_name || 'Неизвестен';
        } else {
            videoModal.style.display = 'none';
            musicPlayer.style.display = 'flex';
            audioPlayer.src = `${api}/music/${track.file}`;
            audioPlayer.play();
            trackCover.src = `${api}/fon/${track.cover}`;
            trackTitle.textContent = track.title;
            trackArtist.textContent = track.artist || track.creator_name || 'Неизвестен';
        }

        activeMediaElement.onloadeddata = () => {
            if (currentUser && currentUser.id) {
                // Отправка данных о воспроизведении на сервер
                fetchAPI('/api/update-playback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        trackId: track.id,
                        currentTime: activeMediaElement.currentTime,
                        duration: activeMediaElement.duration
                    })
                });
            }
        };

        updatePlayPauseIcon();
    };

    const handleNextPrev = (direction) => {
        if (allMedia.length === 0) return;

        if (repeatMode) {
            activeMediaElement.currentTime = 0;
            activeMediaElement.play();
            return;
        }

        currentTrackIndex += direction;
        if (currentTrackIndex >= allMedia.length) {
            currentTrackIndex = 0;
        }
        if (currentTrackIndex < 0) {
            currentTrackIndex = allMedia.length - 1;
        }
        playMedia(allMedia[currentTrackIndex].id);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = loginForm.username.value;
        const password = loginForm.password.value;
        try {
            const response = await fetch(`${api}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                currentUser = data.user;
                setTokens(data.token, data.refresh);
                updateUIForAuth();
                loginModal.style.display = 'none';
                fetchUserFavorites(currentUser.id);
                fetchAndRenderXrecomen();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Произошла ошибка при входе.');
            console.error(error);
        }
    };

    const handleLogout = () => {
        currentUser = null;
        removeTokens();
        updateUIForAuth();
        showView('home');
    };

    const updateUIForAuth = () => {
        const loggedIn = !!currentUser;
        navLogin.style.display = loggedIn ? 'none' : 'block';
        navLogout.style.display = loggedIn ? 'block' : 'none';
        welcomeText.style.display = loggedIn ? 'block' : 'none';
        if (loggedIn) {
            welcomeText.textContent = `Добро пожаловать, ${currentUser.username}!`;
            navFavorites.style.display = 'block';
            if (currentUser.role === 'creator') {
                navCreator.style.display = 'block';
                adminPanelNav.style.display = 'none';
                fetchMyTracks(currentUser.id);
                fetchCreatorCategories(currentUser.id);
            } else {
                navCreator.style.display = 'none';
            }
            if (currentUser.role === 'admin') {
                navCreator.style.display = 'block';
                adminPanelNav.style.display = 'block';
                fetchAdminModerationTracks();
                fetchAdminUsers();
                fetchCreatorCategories(currentUser.id);
                fetchAdminApplications();
                fetchAdminCategories();
            } else {
                adminPanelNav.style.display = 'none';
            }
            applyForCreatorBtn.style.display = currentUser.role === 'user' ? 'block' : 'none';
        } else {
            navFavorites.style.display = 'none';
            navCreator.style.display = 'none';
            adminPanelNav.style.display = 'none';
        }
    };
    
    const fetchAdminCategories = async () => {
        try {
            const response = await fetchAPI('/api/admin/categories');
            if (response.ok) {
                const categories = await response.json();
                renderAdminCategories(categories);
            }
        } catch (error) {
            console.error('Error fetching admin categories:', error);
        }
    };

    const renderAdminCategories = (categories) => {
        if (!adminCategoriesList) return;
        adminCategoriesList.innerHTML = '';
        categories.forEach(cat => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${cat.name}
                <div class="category-actions">
                    <button class="edit-btn" data-id="${cat.id}" data-name="${cat.name}">Редактировать</button>
                    <button class="delete-btn" data-id="${cat.id}">Удалить</button>
                </div>
            `;
            adminCategoriesList.appendChild(li);

            li.querySelector('.edit-btn').addEventListener('click', () => {
                openCategoryModal('edit', cat);
            });
            li.querySelector('.delete-btn').addEventListener('click', async () => {
                if (confirm(`Вы уверены, что хотите удалить категорию "${cat.name}"?`)) {
                    try {
                        const response = await fetchAPI(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
                        if (response.ok) {
                            alert('Категория удалена.');
                            fetchAdminCategories();
                        } else {
                            alert('Ошибка при удалении.');
                        }
                    } catch (error) {
                        console.error('Error deleting category:', error);
                    }
                }
            });
        });
    };

    const openCategoryModal = async (mode, category = {}) => {
        categoryModal.style.display = 'flex';
        categoryForm.dataset.mode = mode;
        categoryNameInput.value = category.name || '';
        document.getElementById('categoryId').value = category.id || '';
        selectedUsersContainer.innerHTML = '';

        if (mode === 'edit') {
            document.querySelector('#categoryModal h2').textContent = 'Редактировать категорию';
            const users = await fetchUsersInCategory(category.id);
            users.forEach(user => addUserChip(user.id, user.username));
        } else {
            document.querySelector('#categoryModal h2').textContent = 'Создать категорию';
        }
    };

    const fetchUsersInCategory = async (categoryId) => {
        try {
            const response = await fetchAPI(`/api/admin/categories/users-in-category/${categoryId}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('Error fetching users in category:', error);
            return [];
        }
    };

    const searchUsers = async (query) => {
        userSearchStatus.textContent = 'Поиск...';
        try {
            const response = await fetchAPI(`/api/admin/categories/users?q=${query}`);
            if (response.ok) {
                const users = await response.json();
                userSearchStatus.innerHTML = '';
                if (users.length > 0) {
                    const ul = document.createElement('ul');
                    ul.className = 'search-results';
                    users.forEach(user => {
                        const li = document.createElement('li');
                        li.textContent = user.username;
                        li.addEventListener('click', () => {
                            addUserChip(user.id, user.username);
                            userSearchInput.value = '';
                            userSearchStatus.innerHTML = '';
                        });
                        ul.appendChild(li);
                    });
                    userSearchStatus.appendChild(ul);
                } else {
                    userSearchStatus.textContent = 'Не найдено.';
                }
            }
        } catch (error) {
            console.error('Error searching users:', error);
            userSearchStatus.textContent = 'Ошибка поиска.';
        }
    };

    const addUserChip = (userId, username) => {
        if (selectedUsersContainer.querySelector(`[data-id="${userId}"]`)) return;

        const chip = document.createElement('div');
        chip.className = 'selected-user';
        chip.dataset.id = userId;
        chip.innerHTML = `
            <span>${username}</span>
            <button type="button" class="remove-user">&times;</button>
        `;
        selectedUsersContainer.appendChild(chip);

        chip.querySelector('.remove-user').addEventListener('click', () => {
            chip.remove();
        });
    };

    const handleCategoryFormSubmit = async (e) => {
        e.preventDefault();
        const mode = categoryForm.dataset.mode;
        const name = categoryNameInput.value;
        const categoryId = document.getElementById('categoryId').value;
        const allowedUsers = Array.from(selectedUsersContainer.querySelectorAll('.selected-user')).map(el => el.dataset.id);

        let url = '/api/admin/categories';
        let method = 'POST';
        if (mode === 'edit') {
            url = `${url}/${categoryId}`;
            method = 'PUT';
        }

        try {
            const response = await fetchAPI(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, allowedUsers })
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                categoryModal.style.display = 'none';
                fetchAdminCategories();
            }
        } catch (error) {
            console.error('Error submitting category form:', error);
            alert('Произошла ошибка.');
        }
    };

    const fetchCreatorCategories = async (userId) => {
        try {
            const response = await fetchAPI(`/api/creator/my-categories/${userId}`);
            if (response.ok) {
                const categories = await response.json();
                renderCreatorCategories(categories);
            }
        } catch (error) {
            console.error('Error fetching creator categories:', error);
        }
    };

    const renderCreatorCategories = (categories) => {
        if (!document.getElementById('categorySelect')) return;
        const categorySelect = document.getElementById('categorySelect');
        categorySelect.innerHTML = '<option value="" disabled selected>Выберите категорию</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    };


    const fetchMyTracks = async (userId) => {
        try {
            const response = await fetchAPI(`/api/creator/my-tracks/${userId}`);
            if (response.ok) {
                myTracks = await response.json();
                renderMyTracks(myTracks);
            }
        } catch (error) {
            console.error('Ошибка при загрузке треков креатора:', error);
        }
    };

    const renderMyTracks = (tracks) => {
        audioList.innerHTML = '';
        tracks.forEach(track => {
            const li = document.createElement('li');
            li.className = 'creator-track-item';
            li.innerHTML = `
                <span>${track.title}</span>
                <div class="track-actions">
                    <button class="rename-btn" data-id="${track.id}">Переименовать</button>
                    <button class="delete-btn" data-id="${track.id}" data-type="${track.type}">Удалить</button>
                </div>
            `;
            audioList.appendChild(li);

            li.querySelector('.rename-btn').addEventListener('click', () => {
                const newTitle = prompt('Введите новое название трека:', track.title);
                if (newTitle && newTitle !== track.title) {
                    renameTrack(track.id, newTitle);
                }
            });

            li.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm(`Вы уверены, что хотите удалить трек "${track.title}"?`)) {
                    deleteTrack(track.id);
                }
            });
        });
    };
    
    const renameTrack = async (trackId, newTitle) => {
        try {
            const response = await fetchAPI('/api/rename', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackId, newTitle })
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                fetchMyTracks(currentUser.id);
            }
        } catch (error) {
            console.error('Ошибка при переименовании трека:', error);
        }
    };

    const deleteTrack = async (trackId) => {
        try {
            const response = await fetchAPI(`/api/creator/my-tracks/${trackId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, userRole: currentUser.role })
            });
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                fetchMyTracks(currentUser.id);
            }
        } catch (error) {
            console.error('Ошибка при удалении трека:', error);
        }
    };

    const fetchCreatorStats = async (userId) => {
        try {
            const response = await fetchAPI(`/api/creator/stats/${userId}`);
            if (response.ok) {
                const stats = await response.json();
                renderCreatorStats(stats);
            }
        } catch (error) {
            console.error('Ошибка при загрузке статистики креатора:', error);
        }
    };

    const renderCreatorStats = (stats) => {
        totalPlaysEl.textContent = stats.totalPlays;

        const labels = stats.dailyPlays.map(d => d.date);
        const data = stats.dailyPlays.map(d => d.count);
        const dailyPlaysCtx = dailyPlaysChart.getContext('2d');
        new Chart(dailyPlaysCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Прослушиваний',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
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

        topTracksList.innerHTML = '';
        stats.trackStats.forEach(track => {
            const li = document.createElement('li');
            li.textContent = `${track.title} - ${track.plays} прослушиваний`;
            topTracksList.appendChild(li);
        });
    };

    const fetchAdminModerationTracks = async () => {
        try {
            const response = await fetchAPI('/api/admin/moderation-tracks');
            if (response.ok) {
                moderationTracks = await response.json();
                renderModerationTracks(moderationTracks);
            }
        } catch (error) {
            console.error('Ошибка при загрузке треков на модерацию:', error);
        }
    };

    const renderModerationTracks = (tracks) => {
        moderationList.innerHTML = '';
        tracks.forEach(track => {
            const li = document.createElement('li');
            li.className = 'moderation-track-item';
            li.innerHTML = `
                <span>${track.title} (${track.type}) - ${track.username}</span>
                <div class="track-actions">
                    <button class="approve-btn" data-id="${track.id}">Одобрить</button>
                    <button class="reject-btn" data-id="${track.id}">Отклонить</button>
                </div>
            `;
            moderationList.appendChild(li);

            li.querySelector('.approve-btn').addEventListener('click', () => {
                approveTrack(track);
            });
            li.querySelector('.reject-btn').addEventListener('click', () => {
                rejectTrack(track.id);
            });
        });
    };

    const approveTrack = async (track) => {
        try {
            const response = await fetchAPI('/api/admin/approve-track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                fetchAdminModerationTracks();
                fetchAndRenderAll();
            }
        } catch (error) {
            console.error('Ошибка при одобрении трека:', error);
            alert('Произошла ошибка при одобрении трека.');
        }
    };

    const rejectTrack = async (trackId) => {
        try {
            const response = await fetchAPI(`/api/admin/reject-track/${trackId}`, { method: 'DELETE' });
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                fetchAdminModerationTracks();
            }
        } catch (error) {
            console.error('Ошибка при отклонении трека:', error);
            alert('Произошла ошибка при отклонении трека.');
        }
    };

    const fetchAdminUsers = async () => {
        try {
            const response = await fetchAPI('/api/admin/users');
            if (response.ok) {
                const users = await response.json();
                renderAdminUsers(users);
            }
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
        }
    };

    const renderAdminUsers = (users) => {
        adminUsersList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'admin-user-item';
            li.innerHTML = `
                <span>${user.username} - ${user.role}</span>
                <div class="user-actions">
                    <button class="change-role-btn" data-id="${user.id}">Сменить роль</button>
                    <button class="delete-user-btn" data-id="${user.id}">Удалить</button>
                </div>
            `;
            adminUsersList.appendChild(li);

            li.querySelector('.change-role-btn').addEventListener('click', () => {
                const newRole = prompt(`Введите новую роль для ${user.username} (user, creator, admin):`);
                if (newRole && ['user', 'creator', 'admin'].includes(newRole)) {
                    updateUserRole(user.id, newRole);
                }
            });
            li.querySelector('.delete-user-btn').addEventListener('click', () => {
                if (confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
                    deleteUser(user.id);
                }
            });
        });
    };

    const updateUserRole = async (userId, role) => {
        try {
            const response = await fetchAPI('/api/admin/update-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role })
            });
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                fetchAdminUsers();
            }
        } catch (error) {
            console.error('Ошибка при обновлении роли:', error);
        }
    };

    const deleteUser = async (userId) => {
        try {
            const response = await fetchAPI(`/api/admin/delete-user/${userId}`, { method: 'DELETE' });
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                fetchAdminUsers();
            }
        } catch (error) {
            console.error('Ошибка при удалении пользователя:', error);
        }
    };

    const fetchAdminApplications = async () => {
        try {
            const response = await fetchAPI('/api/admin/applications');
            if (response.ok) {
                const applications = await response.json();
                renderAdminApplications(applications);
            }
        } catch (error) {
            console.error('Ошибка при загрузке заявок:', error);
        }
    };

    const renderAdminApplications = (applications) => {
        creatorApplicationsList.innerHTML = '';
        if (applications.length === 0) {
            creatorApplicationsList.innerHTML = '<li>Нет новых заявок.</li>';
            return;
        }
        applications.forEach(app => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${app.full_name} (${app.username})</span>
                <div class="application-actions">
                    <button class="approve-application-btn" data-user-id="${app.user_id}">Одобрить</button>
                    <button class="reject-application-btn" data-app-id="${app.id}">Отклонить</button>
                </div>
            `;
            creatorApplicationsList.appendChild(li);
        });
    };

    const approveApplication = async (userId) => {
        try {
            const response = await fetchAPI('/api/admin/approve-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                fetchAdminApplications();
            }
        } catch (error) {
            console.error('Ошибка при одобрении заявки:', error);
        }
    };

    const rejectApplication = async (appId) => {
        try {
            const response = await fetchAPI('/api/admin/reject-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ appId })
            });
            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                fetchAdminApplications();
            }
        } catch (error) {
            console.error('Ошибка при отклонении заявки:', error);
        }
    };

    const fetchAndRenderXrecomen = async () => {
        if (!currentUser) {
            xrecomenContainer.innerHTML = '<h3>Войдите, чтобы увидеть персональные рекомендации.</h3>';
            return;
        }

        try {
            const response = await fetchAPI(`/api/xrecomen/${currentUser.id}`);
            const data = await response.json();
            
            xrecomenContainer.style.display = 'block';

            if (data.xrecomenTrack) {
                renderSingleTrack(data.xrecomenTrack, xrecomenContainer, 'xrecomen-track');
            } else {
                xrecomenContainer.innerHTML = '<h3>Нет персональных рекомендаций.</h3>';
            }

            if (data.youLike && data.youLike.length > 0) {
                document.getElementById('youLikeSection').style.display = 'block';
                renderMedia(data.youLike, youLikeContainer);
            } else {
                document.getElementById('youLikeSection').style.display = 'none';
            }

            if (data.youMayLike && data.youMayLike.length > 0) {
                document.getElementById('youMayLikeSection').style.display = 'block';
                renderMedia(data.youMayLike, youMayLikeContainer);
            } else {
                document.getElementById('youMayLikeSection').style.display = 'none';
            }

            if (data.favoriteCollections && data.favoriteCollections.length > 0) {
                document.getElementById('favoriteCollectionsSection').style.display = 'block';
                renderCollections(data.favoriteCollections, favoriteCollectionsContainer);
            } else {
                document.getElementById('favoriteCollectionsSection').style.display = 'none';
            }

        } catch (error) {
            console.error('Error fetching recommendations:', error);
        }
    };

    const renderSingleTrack = (track, container, className) => {
        container.innerHTML = '';
        const card = document.createElement('div');
        card.className = `media-card ${className}`;
        card.innerHTML = `
            <img src="${api}/${track.type === 'video' ? 'fon' : 'fon'}/${track.cover}" alt="${track.title}" class="media-cover">
            <div class="media-info">
                <div class="media-title">${track.title}</div>
                <div class="media-artist">${track.artist || track.creator_name || 'Неизвестен'}</div>
            </div>
            <div class="media-card-overlay">
                <button class="play-btn" data-id="${track.id}" data-file="${track.file}" data-type="${track.type}"><i class="fas fa-play"></i></button>
            </div>
        `;
        container.appendChild(card);
        card.querySelector('.play-btn').addEventListener('click', () => playMedia(track.id));
    };

    const renderCollections = (collections, container) => {
        container.innerHTML = '';
        collections.forEach(collection => {
            const card = document.createElement('a');
            card.href = '#';
            card.className = 'collection-card';
            card.textContent = collection.name;
            card.addEventListener('click', (e) => {
                e.preventDefault();
                showSpecificContent('category', collection.id, collection.name);
            });
            container.appendChild(card);
        });
    };

    // --- НОВЫЙ ФУНКЦИОНАЛ ОПРЕДЕЛЕНИЯ ЖАНРА ---
    const updateExtendedPanel = (status, genre = '') => {
        extendedPanel.style.display = 'block';
        panelStatusText.textContent = `Статус: ${status}`;
        panelGenreText.textContent = `Жанр: ${genre}`;
    };

    const hideExtendedPanel = () => {
        extendedPanel.style.display = 'none';
        panelStatusText.textContent = '';
        panelGenreText.textContent = '';
    };

    const handleDetermineGenre = async () => {
        const file = fileUpload.files[0];
        if (!file) {
            alert('Сначала выберите файл.');
            return;
        }

        updateExtendedPanel('Обработка...');
        genreInputGroup.style.display = 'none';

        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetchAPI('/api/determine_genre', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (response.ok) {
                updateExtendedPanel('Определен', data.genreName);
                // Автоматически выбираем определенный жанр в выпадающем списке
                genreSelect.value = data.genreId;
            } else {
                updateExtendedPanel('Ошибка', data.message);
            }
        } catch (error) {
            updateExtendedPanel('Ошибка', 'Не удалось связаться с сервером.');
        }
    };

    const handleSelectGenre = () => {
        hideExtendedPanel();
        genreInputGroup.style.display = 'flex';
    };

    // --- КОНЕЦ НОВОГО ФУНКЦИОНАЛА ---

    const loadOpacitySetting = () => {
        const videoOpacity = localStorage.getItem('videoOpacity');
        if (videoOpacity) {
            opacitySlider.value = videoOpacity;
            videoPlayer.style.opacity = videoOpacity;
            videoModalOpacitySlider.value = videoOpacity;
            videoPlayerModal.style.opacity = videoOpacity;
        }
    };

    const initEventListeners = () => {
        document.addEventListener('click', (e) => {
            if (e.target.closest('#navHome')) {
                showView('home');
                fetchAndRenderAll();
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navHome.classList.add('active');
            } else if (e.target.closest('#navFavorites')) {
                if (!currentUser) {
                    alert('Войдите, чтобы просмотреть избранное.');
                    return;
                }
                fetchFavorites();
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navFavorites.classList.add('active');
            }
        });
        
        for (const linkId in navLinks) {
            const linkEl = document.getElementById(linkId);
            if (linkEl) {
                linkEl.addEventListener('click', (e) => {
                    e.preventDefault();
                    showView(navLinks[linkId]);
                    if (linkId === 'navCreator' && currentUser) {
                        fetchMyTracks(currentUser.id);
                        fetchCreatorStats(currentUser.id);
                    }
                    if (linkId === 'navAdmin' && currentUser) {
                        fetchAdminModerationTracks();
                    }
                    if (linkId === 'navHome') {
                         fetchAndRenderXrecomen();
                    }
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    linkEl.classList.add('active');
                });
            }
        }

        if (navLogin) navLogin.addEventListener('click', () => loginModal.style.display = 'flex');
        if (navLogout) navLogout.addEventListener('click', handleLogout);
        if (closeLoginModalBtn) closeLoginModalBtn.addEventListener('click', () => loginModal.style.display = 'none');
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (playPauseBtn) playPauseBtn.addEventListener('click', () => activeMediaElement.paused ? activeMediaElement.play() : activeMediaElement.pause());
        if (nextBtn) nextBtn.addEventListener('click', () => handleNextPrev(1));
        if (prevBtn) prevBtn.addEventListener('click', () => handleNextPrev(-1));
        if (audioPlayer) {
            audioPlayer.addEventListener('timeupdate', () => {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                if (progressBar) progressBar.style.width = `${progress}%`;
                if (timeDisplay) timeDisplay.textContent = `${formatTime(audioPlayer.currentTime)} / ${formatTime(audioPlayer.duration)}`;
            });
            audioPlayer.addEventListener('ended', () => handleNextPrev(1));
            audioPlayer.addEventListener('play', updatePlayPauseIcon);
            audioPlayer.addEventListener('pause', updatePlayPauseIcon);
        }
        if (videoPlayer) {
            videoPlayer.addEventListener('ended', () => videoPlayer.play());
        }
        if (videoPlayerModal) {
            videoPlayerModal.addEventListener('timeupdate', () => {
                const progress = (videoPlayerModal.currentTime / videoPlayerModal.duration) * 100;
                if (progressBarModal) progressBarModal.style.width = `${progress}%`;
                if (timeDisplayModal) timeDisplayModal.textContent = `${formatTime(videoPlayerModal.currentTime)} / ${formatTime(videoPlayerModal.duration)}`;
            });
            videoPlayerModal.addEventListener('play', updatePlayPauseIcon);
            videoPlayerModal.addEventListener('pause', updatePlayPauseIcon);
            videoPlayerModal.addEventListener('ended', () => handleNextPrev(1));
        }
        if (playPauseModalBtn) playPauseModalBtn.addEventListener('click', () => videoPlayerModal.paused ? videoPlayerModal.play() : videoPlayerModal.pause());
        if (nextModalBtn) nextModalBtn.addEventListener('click', () => handleNextPrev(1));
        if (prevModalBtn) prevModalBtn.addEventListener('click', () => handleNextPrev(-1));
        if (closeVideoModalBtn) closeVideoModalBtn.addEventListener('click', () => {
            videoModal.style.display = 'none';
            videoPlayerModal.pause();
        });
        if (uploadForm) uploadForm.addEventListener('submit', handleUpload);
        if (applyForCreatorBtn) applyForCreatorBtn.addEventListener('click', () => applyForCreatorModal.style.display = 'flex');
        if (closeApplyModalBtn) closeApplyModalBtn.addEventListener('click', () => applyForCreatorModal.style.display = 'none');
        if (applyForCreatorForm) applyForCreatorForm.addEventListener('submit', handleApplyForCreator);
        if (creatorApplicationsList) creatorApplicationsList.addEventListener('click', (e) => {
            if (e.target.classList.contains('approve-application-btn')) {
                approveApplication(e.target.dataset.userId);
            }
            if (e.target.classList.contains('reject-application-btn')) {
                rejectApplication(e.target.dataset.appId);
            }
        });

        // Event listeners for the new genre functionality
        if (determineGenreBtn) determineGenreBtn.addEventListener('click', handleDetermineGenre);
        if (selectGenreBtn) selectGenreBtn.addEventListener('click', handleSelectGenre);
        
        // Ensure genre selection is visible by default
        handleSelectGenre();

        if (opacitySlider) {
            opacitySlider.addEventListener('input', () => {
                videoPlayer.style.opacity = opacitySlider.value;
                videoPlayerModal.style.opacity = opacitySlider.value;
                localStorage.setItem('videoOpacity', opacitySlider.value);
            });
        }
        if (videoModalOpacitySlider) {
            videoModalOpacitySlider.addEventListener('input', () => {
                videoPlayerModal.style.opacity = videoModalOpacitySlider.value;
                videoPlayer.style.opacity = videoModalOpacitySlider.value;
                localStorage.setItem('videoOpacity', videoModalOpacitySlider.value);
            });
        }
        
        if (categoryModal) {
            document.getElementById('addCategoryBtn').addEventListener('click', () => openCategoryModal('add'));
            closeCategoryModalBtn.addEventListener('click', () => categoryModal.style.display = 'none');
            categoryForm.addEventListener('submit', handleCategoryFormSubmit);
            userSearchInput.addEventListener('input', debounce((e) => {
                const query = e.target.value;
                if (query.length > 2) {
                    searchUsers(query);
                } else {
                    userSearchStatus.innerHTML = '';
                }
            }, 300));
        }
        
        const debounce = (func, delay) => {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        };

        const formatTime = (seconds) => {
            if (isNaN(seconds)) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        };

        const scrub = (e) => {
            const container = activeMediaElement === videoPlayerModal ? progressContainerModal : progressBarContainer;
            if (!container) return;
            const scrubTime = (e.offsetX / container.offsetWidth) * activeMediaElement.duration;
            activeMediaElement.currentTime = scrubTime;
        };
        
        if (progressBarContainer) progressBarContainer.addEventListener('click', scrub);
        if (progressContainerModal) progressContainerModal.addEventListener('click', scrub);
        
        if (volumeBar) {
            volumeBar.addEventListener('input', () => {
                audioPlayer.volume = videoPlayer.volume = videoPlayerModal.volume = volumeBar.value;
            });
            volumeBar.value = 0.5;
            audioPlayer.volume = videoPlayer.volume = videoPlayerModal.volume = 0.5;
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const file = fileUpload.files[0];
        const cover = coverUpload.files[0];
        const title = document.getElementById('trackTitleInput').value;
        const uploadType = document.querySelector('input[name="uploadType"]:checked').value;
        const genreId = genreSelect.value;
        const artist = document.getElementById('artistInput').value;
        const categoryId = document.getElementById('categorySelect').value || null;

        if (!file || !cover || !title || !genreId) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        formData.append('coverFile', cover);
        if (uploadType === 'audio') {
            formData.append('audioFile', file);
        } else {
            formData.append('videoFile', file);
        }
        formData.append('title', title);
        formData.append('uploadType', uploadType);
        formData.append('userId', currentUser.id);
        formData.append('genreId', genreId);
        formData.append('artist', artist);
        formData.append('categoryId', categoryId);

        try {
            const response = await fetchAPI('/api/moderation/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                uploadForm.reset();
            }
        } catch (error) {
            console.error('Ошибка при загрузке:', error);
            alert('Ошибка при загрузке трека.');
        }
    };

    const handleApplyForCreator = async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetchAPI('/api/apply-for-creator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, fullName, phoneNumber, email })
            });

            const data = await response.json();
            alert(data.message);
            if (response.ok) {
                applyForCreatorModal.style.display = 'none';
                applyForCreatorForm.reset();
            }
        } catch (error) {
            console.error('Ошибка при подаче заявки:', error);
            alert('Произошла ошибка при подаче заявки.');
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return '0:00';
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const initPlayer = () => {
        const progressBars = document.querySelectorAll('.progress-bar-container');
        progressBars.forEach(container => {
            container.addEventListener('click', (e) => {
                const player = container.closest('.player').querySelector('audio, video');
                if (player) {
                    const rect = container.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percentage = clickX / rect.width;
                    if (player.duration) {
                        player.currentTime = player.duration * percentage;
                    }
                }
            });
        });
    };
    
    // Initial calls
    loadOpacitySetting();
    initEventListeners();
    fetchAndRenderAll();
    fetchCategoriesAndGenres();

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForAuth();
        fetchUserFavorites(currentUser.id);
        fetchAndRenderXrecomen();
    }
    
    // Toggle video opacity for desktop
    if (document.getElementById('videoOpacityToggle')) {
        document.getElementById('videoOpacityToggle').addEventListener('click', () => {
            videoBackgroundContainer.style.opacity = videoBackgroundContainer.style.opacity === '0' ? '1' : '0';
        });
    }

});