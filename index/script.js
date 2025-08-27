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
    const navLogin = document.getElementById('navLogin');
    const navRegister = document.getElementById('navRegister');
    const navProfile = document.getElementById('navProfile');
    const navLogout = document.getElementById('navLogout');
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const favoritesView = document.getElementById('favoritesView');
    const allMediaView = document.getElementById('allMediaView');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playerCover = document.getElementById('playerCover');
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');
    const volumeBar = document.getElementById('volumeBar');
    const uiOpacityInput = document.getElementById('uiOpacity');
    const videoModal = document.getElementById('videoModal');
    const videoPlayerModal = document.getElementById('videoPlayerModal');
    const closeVideoModalBtn = document.getElementById('closeVideoModalBtn');
    const navCreatorStudio = document.getElementById('navCreatorStudio');
    const navAdminPanel = document.getElementById('navAdminPanel');
    const creatorStudioView = document.getElementById('creatorStudioView');
    const myTracksGrid = document.getElementById('myTracksGrid');
    const moderationGrid = document.getElementById('moderationGrid');
    const adminPanelView = document.getElementById('adminPanelView');
    const navMyTracksBtn = document.getElementById('navMyTracksBtn');
    const navUploadBtn = document.getElementById('navUploadBtn');
    const navCreatorStatsBtn = document.getElementById('navCreatorStatsBtn');
    const uploadView = document.getElementById('uploadView');
    const uploadForm = document.getElementById('uploadForm');
    const creatorStatsView = document.getElementById('creatorStatsView');
    const adminStatsView = document.getElementById('adminStatsView');
    const navModerationBtn = document.getElementById('navModerationBtn');
    const navAdminStatsBtn = document.getElementById('navAdminStatsBtn');
    const navManageUsersBtn = document.getElementById('navManageUsersBtn');
    const navManageCategoriesBtn = document.getElementById('navManageCategoriesBtn');
    const moderationView = document.getElementById('moderationView');
    const manageUsersView = document.getElementById('manageUsersView');
    const manageCategoriesView = document.getElementById('manageCategoriesView');
    const creatorApplicationModal = document.getElementById('creatorApplicationModal');
    const closeCreatorApplicationModalBtn = document.getElementById('closeCreatorApplicationModalBtn');
    const creatorApplicationForm = document.getElementById('creatorApplicationForm');
    const navMyCategoriesBtn = document.getElementById('navMyCategoriesBtn');
    const myCategoriesView = document.getElementById('myCategoriesView');
    const myCategoriesGrid = document.getElementById('myCategoriesGrid');
    const createCategoryBtn = document.getElementById('createCategoryBtn');
    const categoryModal = document.getElementById('categoryModal');
    const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
    const categoryForm = document.getElementById('categoryForm');
    let usersChart = null;
    let popularTracksChart = null;

    const navItems = [navHome, navCategories, navFavorites, navLogin, navRegister, navProfile, navLogout, navCreatorStudio, navAdminPanel];

    function showView(view) {
        document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
        view.style.display = 'block';
    }

    function setActiveLink(link) {
        navItems.forEach(item => {
            if (item) {
                item.classList.remove('active');
            }
        });
        if (link) {
            link.classList.add('active');
        }
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
    
    function resetPlayer() {
        if (activeMediaElement) {
            activeMediaElement.pause();
            activeMediaElement.currentTime = 0;
        }
        playerTitle.textContent = '';
        playerArtist.textContent = '';
        playerCover.src = '';
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
        totalTimeEl.textContent = '0:00';
    }
    
    function handleLoginSuccess(tokens, user) {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUser = user;
        updateUIForAuth();
        closeModal();
        showView(homeView);
    }
    
    function getTokens() {
        return {
            access: localStorage.getItem(ACCESS_TOKEN_KEY),
            refresh: localStorage.getItem(REFRESH_TOKEN_KEY)
        };
    }

    async function refreshToken(refreshToken) {
        try {
            const response = await fetch(`${api}/api/auth_refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken })
            });
            if (!response.ok) throw new Error('Refresh failed');
            const data = await response.json();
            localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
            return data.access_token;
        } catch (error) {
            console.error("Token refresh failed:", error);
            logoutUser();
            return null;
        }
    }

    async function fetchWithAuth(url, options = {}) {
        let { access } = getTokens();
        let headers = options.headers || {};
        if (access) {
            headers['Authorization'] = `Bearer ${access}`;
        }
        options.headers = headers;
        
        let response = await fetch(url, options);

        if (response.status === 401) {
            const { refresh } = getTokens();
            if (refresh) {
                const newAccessToken = await refreshToken(refresh);
                if (newAccessToken) {
                    options.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    response = await fetch(url, options);
                }
            }
        }
        return response;
    }
    
    function updateUIForAuth() {
        if (currentUser) {
            navLogin.style.display = 'none';
            navRegister.style.display = 'none';
            navProfile.style.display = 'block';
            navLogout.style.display = 'block';
            navProfile.textContent = currentUser.username;
            if (currentUser.role === 'creator') {
                navCreatorStudio.style.display = 'block';
            } else {
                navCreatorStudio.style.display = 'none';
            }
            if (currentUser.role === 'admin') {
                navAdminPanel.style.display = 'block';
            } else {
                navAdminPanel.style.display = 'none';
            }
        } else {
            navLogin.style.display = 'block';
            navRegister.style.display = 'block';
            navProfile.style.display = 'none';
            navLogout.style.display = 'none';
            navCreatorStudio.style.display = 'none';
            navAdminPanel.style.display = 'none';
        }
    }

    function logoutUser() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem('currentUser');
        currentUser = null;
        updateUIForAuth();
        showView(homeView);
        fetchAndRenderAll();
        resetPlayer();
    }
    
    async function fetchAndRenderAll() {
        const response = await fetchWithAuth(`${api}/api/tracks`);
        if (response.ok) {
            allMedia = await response.json();
            renderMedia(allMedia, allGridContainer);
        } else {
            console.error('Failed to fetch tracks');
        }
        if (currentUser) {
            fetchUserFavorites();
            fetchHomeData();
        }
    }

    async function fetchAndRenderMyTracks() {
        const response = await fetchWithAuth(`${api}/api/creator/my-tracks/${currentUser.id}`);
        if (response.ok) {
            myTracks = await response.json();
            renderMedia(myTracks, myTracksGrid);
        } else {
            console.error('Failed to fetch my tracks');
        }
    }

    async function fetchAndRenderModerationTracks() {
        const response = await fetchWithAuth(`${api}/api/admin/moderation`);
        if (response.ok) {
            moderationTracks = await response.json();
            renderModerationTracks(moderationTracks);
        } else {
            console.error('Failed to fetch moderation tracks');
        }
    }

    async function fetchHomeData() {
        const response = await fetchWithAuth(`${api}/api/xrecomen/${currentUser.id}`);
        if (response.ok) {
            const data = await response.json();
            renderMedia(data.youLike, document.getElementById('forYouGrid'));
            renderMedia(data.youMayLike, document.getElementById('maybeYouLikeGrid'));
            renderFavoriteCollections(data.favoriteCollections);
        }
    }
    
    async function fetchUserFavorites() {
        const response = await fetchWithAuth(`${api}/api/favorites`);
        if (response.ok) {
            userFavorites = await response.json();
            renderFavorites();
        }
    }
    
    async function fetchCategoriesAndGenres() {
        const genresResponse = await fetchWithAuth(`${api}/api/genres`);
        const categoriesResponse = await fetchWithAuth(`${api}/api/categories`);
        if (genresResponse.ok) {
            const genres = await genresResponse.json();
            renderFilterSelect(document.getElementById('genreFilter'), genres, 'Жанр');
            renderAdminSelect(document.getElementById('trackGenre'), genres, 'Выберите жанр');
        }
        if (categoriesResponse.ok) {
            const categories = await categoriesResponse.json();
            renderFilterSelect(document.getElementById('categoryFilter'), categories, 'Категория');
            renderAdminSelect(document.getElementById('trackCategory'), categories, 'Выберите категорию');
            renderCategories(categories);
        }
    }
    
    function renderFilterSelect(selectEl, items, placeholder) {
        selectEl.innerHTML = `<option value="">Все ${placeholder}ы</option>`;
        items.forEach(item => {
            selectEl.innerHTML += `<option value="${item.id}">${item.name}</option>`;
        });
    }

    function renderAdminSelect(selectEl, items, placeholder) {
        selectEl.innerHTML = `<option value="">${placeholder}</option>`;
        items.forEach(item => {
            selectEl.innerHTML += `<option value="${item.id}">${item.name}</option>`;
        });
    }

    function renderMedia(mediaList, container) {
        container.innerHTML = '';
        if (!mediaList || mediaList.length === 0) {
            container.innerHTML = '<p>Здесь пока ничего нет.</p>';
            return;
        }
        mediaList.forEach(media => {
            const card = document.createElement('div');
            card.classList.add('media-card');
            if (media.type === 'video') {
                card.classList.add('video-card');
            }
            card.dataset.id = media.id;
            card.innerHTML = `
                <img src="${api}/fon/${media.cover}" alt="Обложка">
                <h4>${media.title}</h4>
                <p>${media.artist || media.creator_name || 'Неизвестный'}</p>
                <div class="card-actions">
                    <button class="play-btn-card" title="Воспроизвести">▶</button>
                    ${currentUser ? `<button class="favorite-btn" title="Добавить в избранное" data-track-id="${media.id}">❤</button>` : ''}
                </div>
            `;
            const favoriteBtn = card.querySelector('.favorite-btn');
            if (favoriteBtn && userFavorites.includes(media.file)) {
                favoriteBtn.classList.add('added');
            }
            container.appendChild(card);
        });
    }

    function renderModerationTracks(tracks) {
        moderationGrid.innerHTML = '';
        if (!tracks || tracks.length === 0) {
            moderationGrid.innerHTML = '<p>Нет треков на модерации.</p>';
            return;
        }
        tracks.forEach(track => {
            const card = document.createElement('div');
            card.classList.add('media-card');
            card.innerHTML = `
                <img src="${api}/temp_uploads/${track.cover}" alt="Обложка">
                <h4>${track.title}</h4>
                <p>Артист: ${track.artist || track.username}</p>
                <p>Жанр: ${track.genre_name}</p>
                <div class="moderation-actions">
                    <button class="play-btn-card" data-file="${track.file}" data-type="${track.type}" data-cover="${track.cover}">▶</button>
                    <button class="approve-btn" data-track-id="${track.id}" data-genre-id="${track.genre_id}">Одобрить</button>
                    <button class="reject-btn" data-track-id="${track.id}">Отклонить</button>
                </div>
            `;
            moderationGrid.appendChild(card);
        });
    }

    function renderFavorites() {
        const favoriteTracks = allMedia.filter(media => userFavorites.includes(media.file));
        renderMedia(favoriteTracks, favoritesGridContainer);
    }
    
    function renderCategories(categories) {
        allGenresGrid.innerHTML = '';
        categories.forEach(category => {
            const card = document.createElement('div');
            card.classList.add('media-card', 'category-card');
            card.dataset.id = category.id;
            card.innerHTML = `<h4>${category.name}</h4>`;
            allGenresGrid.appendChild(card);
        });
    }
    
    function renderFavoriteCollections(collections) {
        document.getElementById('favoriteCollections').innerHTML = '';
        collections.forEach(collection => {
            const card = document.createElement('div');
            card.classList.add('media-card', 'collection-card');
            card.dataset.id = collection.id;
            card.innerHTML = `
                <h4>${collection.name}</h4>
                <p>${collection.track_count} треков</p>
            `;
            document.getElementById('favoriteCollections').appendChild(card);
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    function closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    function updateProgressBar() {
        if (activeMediaElement.duration) {
            const progress = (activeMediaElement.currentTime / activeMediaElement.duration) * 100;
            progressBar.style.width = `${progress}%`;
            currentTimeEl.textContent = formatTime(activeMediaElement.currentTime);
            totalTimeEl.textContent = formatTime(activeMediaElement.duration);
        }
    }

    async function playTrack(trackId) {
        const track = allMedia.find(t => t.id == trackId);
        if (!track) return;

        if (activeMediaElement) {
            activeMediaElement.pause();
            activeMediaElement.currentTime = 0;
            if (activeMediaElement.tagName === 'VIDEO') {
                videoPlayer.style.display = 'none';
                videoPlayer.src = '';
            }
        }

        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist || track.creator_name;
        playerCover.src = `${api}/fon/${track.cover}`;

        const mediaUrl = track.type === 'video' ? `${api}/video/${track.file}` : `${api}/music/${track.file}`;

        if (track.type === 'video') {
            videoPlayer.src = mediaUrl;
            videoPlayer.style.display = 'block';
            activeMediaElement = videoPlayer;
            audioPlayer.pause();
        } else {
            audioPlayer.src = mediaUrl;
            activeMediaElement = audioPlayer;
            videoPlayer.pause();
            videoPlayer.style.display = 'none';
        }

        activeMediaElement.play();
        playBtn.innerHTML = '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M6 19h4V5H6v14zm8-14v14h4V5h-4z\'/></svg>" alt="Пауза">';

        const trackIndex = allMedia.findIndex(t => t.id == trackId);
        currentTrackIndex = trackIndex;
        
        // Отправка данных о воспроизведении на сервер
        if (currentUser) {
            await fetchWithAuth(`${api}/api/update-playback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trackId: track.id })
            });
        }
    }
    
    function playNextTrack() {
        if (allMedia.length === 0) return;
        currentTrackIndex = (currentTrackIndex + 1) % allMedia.length;
        playTrack(allMedia[currentTrackIndex].id);
    }
    
    function playPrevTrack() {
        if (allMedia.length === 0) return;
        currentTrackIndex = (currentTrackIndex - 1 + allMedia.length) % allMedia.length;
        playTrack(allMedia[currentTrackIndex].id);
    }

    async function addFavorite(trackId) {
        const response = await fetchWithAuth(`${api}/api/favorites/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ track_id: trackId })
        });
        if (response.ok) {
            showToast('Добавлено в избранное');
            fetchUserFavorites();
        } else {
            const error = await response.json();
            showToast(error.message);
        }
    }

    async function removeFavorite(trackId) {
        const response = await fetchWithAuth(`${api}/api/favorites/remove`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ track_id: trackId })
        });
        if (response.ok) {
            showToast('Удалено из избранного');
            fetchUserFavorites();
        } else {
            const error = await response.json();
            showToast(error.message);
        }
    }
    
    async function registerUser(e) {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const recaptcha_token = grecaptcha.getResponse();

        if (!recaptcha_token) {
            showToast('Пожалуйста, подтвердите, что вы не робот.');
            return;
        }

        const response = await fetch(`${api}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, recaptcha_token })
        });
        const data = await response.json();
        showToast(data.message);
        grecaptcha.reset(); // Сброс reCAPTCHA после попытки
        if (response.ok) {
            handleLoginSuccess(data, data.user);
        }
    }
    
    async function handleCreatorApplication(e) {
        e.preventDefault();
        const fullName = document.getElementById('fullName').value;
        const phoneNumber = document.getElementById('phoneNumber').value;
        const email = document.getElementById('email').value;
        const recaptcha_token = grecaptcha.getResponse();

        if (!recaptcha_token) {
            showToast('Пожалуйста, подтвердите, что вы не робот.');
            return;
        }

        const response = await fetchWithAuth(`${api}/api/apply_for_creator`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                userId: currentUser.id, 
                fullName, 
                phoneNumber, 
                email,
                recaptcha_token
            })
        });
        const data = await response.json();
        showToast(data.message);
        grecaptcha.reset();
        if (response.ok) {
            closeModal();
            // Обновить статус пользователя локально
            currentUser.applied_for_creator = 1;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }

    function initEventListeners() {
        navHome.addEventListener('click', () => {
            showView(homeView);
            setActiveLink(navHome);
            fetchHomeData();
        });
        navCategories.addEventListener('click', () => {
            showView(allMediaView);
            setActiveLink(navCategories);
        });
        navFavorites.addEventListener('click', () => {
            if (currentUser) {
                showView(favoritesView);
                setActiveLink(navFavorites);
                fetchUserFavorites();
            } else {
                showToast('Войдите, чтобы просматривать избранное.');
                showView(loginView);
                setActiveLink(navLogin);
            }
        });
        navLogin.addEventListener('click', () => {
            showView(loginView);
            setActiveLink(navLogin);
        });
        navRegister.addEventListener('click', () => {
            showView(registerView);
            setActiveLink(navRegister);
        });
        navProfile.addEventListener('click', () => {
            // Placeholder for future profile page
            showToast('Страница профиля в разработке.');
        });
        navLogout.addEventListener('click', logoutUser);

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const response = await fetch(`${api}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            showToast(data.message);
            if (response.ok) {
                handleLoginSuccess(data, data.user);
            }
        });

        registerForm.addEventListener('submit', registerUser);

        mainContent.addEventListener('click', async (e) => {
            if (e.target.closest('.media-card')) {
                const card = e.target.closest('.media-card');
                const trackId = card.dataset.id;
                playTrack(trackId);
            }
            if (e.target.closest('.favorite-btn')) {
                const btn = e.target.closest('.favorite-btn');
                const trackId = btn.dataset.trackId;
                if (btn.classList.contains('added')) {
                    await removeFavorite(trackId);
                } else {
                    await addFavorite(trackId);
                }
                btn.classList.toggle('added');
            }
        });

        playBtn.addEventListener('click', () => {
            if (!activeMediaElement.src) {
                playTrack(allMedia[0].id);
                return;
            }
            if (activeMediaElement.paused) {
                activeMediaElement.play();
                playBtn.innerHTML = '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M6 19h4V5H6v14zm8-14v14h4V5h-4z\'/></svg>" alt="Пауза">';
            } else {
                activeMediaElement.pause();
                playBtn.innerHTML = '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M8 5v14l11-7z\'/></svg>" alt="Воспроизвести">';
            }
        });

        prevBtn.addEventListener('click', playPrevTrack);
        nextBtn.addEventListener('click', playNextTrack);
        
        activeMediaElement.addEventListener('ended', () => {
            playNextTrack();
        });

        activeMediaElement.addEventListener('timeupdate', updateProgressBar);

        uiOpacityInput.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--ui-opacity', e.target.value);
            localStorage.setItem('uiOpacity', e.target.value);
        });

        function loadOpacitySetting() {
            const savedOpacity = localStorage.getItem('uiOpacity');
            if (savedOpacity) {
                uiOpacityInput.value = savedOpacity;
                document.documentElement.style.setProperty('--ui-opacity', savedOpacity);
            }
        }

        let isDragging = false;
        const scrub = (e) => {
            const rect = progressBarContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
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
            audioPlayer.volume = videoPlayer.volume = videoPlayerModal.volume = volumeBar.value;
        });
        
        // Creator and Admin Logic
        navCreatorStudio.addEventListener('click', () => {
            if (currentUser && currentUser.role === 'creator') {
                showView(creatorStudioView);
                setActiveLink(navCreatorStudio);
                navMyTracksBtn.click();
            } else {
                openModal('creatorApplicationModal');
            }
        });

        closeCreatorApplicationModalBtn.addEventListener('click', closeModal);
        creatorApplicationForm.addEventListener('submit', handleCreatorApplication);

        navMyTracksBtn.addEventListener('click', () => {
            document.querySelectorAll('#creatorContent > div').forEach(v => v.style.display = 'none');
            myTracksView.style.display = 'block';
            fetchAndRenderMyTracks();
        });

        navUploadBtn.addEventListener('click', () => {
            document.querySelectorAll('#creatorContent > div').forEach(v => v.style.display = 'none');
            uploadView.style.display = 'block';
        });

        navCreatorStatsBtn.addEventListener('click', () => {
            document.querySelectorAll('#creatorContent > div').forEach(v => v.style.display = 'none');
            creatorStatsView.style.display = 'block';
            fetchCreatorStats();
        });

        navMyCategoriesBtn.addEventListener('click', () => {
            document.querySelectorAll('#creatorContent > div').forEach(v => v.style.display = 'none');
            myCategoriesView.style.display = 'block';
            fetchMyCategories();
        });
        
        navAdminPanel.addEventListener('click', () => {
            showView(adminPanelView);
            setActiveLink(navAdminPanel);
            navAdminStatsBtn.click();
        });

        navAdminStatsBtn.addEventListener('click', fetchAdminStats);
        navModerationBtn.addEventListener('click', () => {
            document.querySelectorAll('#adminContent > div').forEach(v => v.style.display = 'none');
            moderationView.style.display = 'block';
            fetchAndRenderModerationTracks();
        });
        navManageUsersBtn.addEventListener('click', () => {
            document.querySelectorAll('#adminContent > div').forEach(v => v.style.display = 'none');
            manageUsersView.style.display = 'block';
            fetchCreatorApplications();
            fetchAllUsers();
        });
        navManageCategoriesBtn.addEventListener('click', () => {
            document.querySelectorAll('#adminContent > div').forEach(v => v.style.display = 'none');
            manageCategoriesView.style.display = 'block';
            fetchAllCategoriesAdmin();
        });

        // Other event listeners
        document.getElementById('moderationGrid').addEventListener('click', async (e) => {
            if (e.target.classList.contains('play-btn-card')) {
                const file = e.target.dataset.file;
                const type = e.target.dataset.type;
                const cover = e.target.dataset.cover;
                
                if (activeMediaElement) {
                    activeMediaElement.pause();
                    activeMediaElement.currentTime = 0;
                    if (activeMediaElement.tagName === 'VIDEO') {
                        videoPlayer.style.display = 'none';
                        videoPlayer.src = '';
                    }
                }
                
                playerTitle.textContent = 'Трек на модерации';
                playerArtist.textContent = '';
                playerCover.src = `${api}/temp_uploads/${cover}`;
                
                const mediaUrl = type === 'video' ? `${api}/temp_uploads/${file}` : `${api}/temp_uploads/${file}`;

                if (type === 'video') {
                    videoPlayer.src = mediaUrl;
                    videoPlayer.style.display = 'block';
                    activeMediaElement = videoPlayer;
                    audioPlayer.pause();
                } else {
                    audioPlayer.src = mediaUrl;
                    activeMediaElement = audioPlayer;
                    videoPlayer.pause();
                    videoPlayer.style.display = 'none';
                }
                
                activeMediaElement.play();
                playBtn.innerHTML = '<img src="data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'><path d=\'M6 19h4V5H6v14zm8-14v14h4V5h-4z\'/></svg>" alt="Пауза">';
            }
            if (e.target.classList.contains('approve-btn')) {
                const trackId = e.target.dataset.trackId;
                const genreId = e.target.dataset.genreId;
                const response = await fetchWithAuth(`${api}/api/admin/moderation/approve/${trackId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ genre_id: genreId })
                });
                const data = await response.json();
                showToast(data.message);
                if (response.ok) fetchAndRenderModerationTracks();
            }
            if (e.target.classList.contains('reject-btn')) {
                const trackId = e.target.dataset.trackId;
                const response = await fetchWithAuth(`${api}/api/admin/moderation/reject/${trackId}`, {
                    method: 'POST'
                });
                const data = await response.json();
                showToast(data.message);
                if (response.ok) fetchAndRenderModerationTracks();
            }
        });
    };

    loadOpacitySetting();
    initEventListeners();
    fetchAndRenderAll();
    fetchCategoriesAndGenres();

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForAuth();
    }
});