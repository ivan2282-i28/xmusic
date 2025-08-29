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
    const tracksPerPage = 30;
    let isLoading = false;
    const initialLoadCount = 20;

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
    const searchResults = document.getElementById('searchResults');
    const trackDetailsModal = document.getElementById('trackDetailsModal');
    const playNextBtn = document.getElementById('playNextBtn');
    const playPrevBtn = document.getElementById('playPrevBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const miniPlayer = document.querySelector('.mini-player');
    const closeMiniPlayerBtn = document.querySelector('#closeMiniPlayerBtn');
    const fullPlayer = document.querySelector('.full-player');
    const playerStyleToggle = document.getElementById('playerStyleToggle');
    const miniPlayerBtn = document.getElementById('miniPlayerBtn');
    const fullPlayerBtn = document.getElementById('fullPlayerBtn');
    const copyMainControls = document.querySelector('.copy-main-controls');
    const volumeBar = document.querySelector('.volume-bar');
    const copyVolumeBar = document.querySelector('.copy-volume-bar');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const copyProgressBarContainer = document.querySelector('.copy-progress-bar-container');
    const progressBar = document.querySelector('.progress-bar');
    const copyProgressBar = document.querySelector('.copy-progress-bar');
    const timeCurrent = document.querySelector('.time-current');
    const timeTotal = document.querySelector('.time-total');
    const copyTimeCurrent = document.querySelector('.copy-time-current');
    const copyTimeTotal = document.querySelector('.copy-time-total');
    const favoriteBtn = document.querySelector('.favorite-btn');
    const copyFavoriteBtn = document.querySelector('#copyFavoriteBtn');
    const navFavorites = document.getElementById('navFavorites');
    const favoritesGridContainer = document.getElementById('favoritesGridContainer');
    const creatorStudioBtn = document.getElementById('creatorStudioBtn');
    const homeNav = document.getElementById('navHome');
    const creatorView = document.getElementById('creatorView');
    const myTracksView = document.getElementById('myTracksView');
    const myTracksGrid = document.getElementById('myTracksGrid');
    const moderationView = document.getElementById('moderationView');
    const moderationGrid = document.getElementById('moderationGrid');
    const profileView = document.getElementById('profileView');
    const profileUsername = document.getElementById('profileUsername');
    const profileRole = document.getElementById('profileRole');
    const loginView = document.getElementById('loginView');
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const registerForm = document.getElementById('registerForm');
    const registerUsernameInput = document.getElementById('registerUsername');
    const registerPasswordInput = document.getElementById('registerPassword');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginStatus = document.getElementById('loginStatus');
    const logoutBtn = document.getElementById('logoutBtn');
    const uploadMusicModal = document.getElementById('uploadMusicModal');
    const showUploadBtn = document.getElementById('showUploadBtn');
    const closeUploadModalBtn = document.getElementById('closeUploadModalBtn');
    const uploadForm = document.getElementById('uploadForm');
    const uploadStatus = document.getElementById('uploadStatus');
    const uploadProgress = document.getElementById('uploadProgress');
    const genreSelector = document.getElementById('genreSelector');
    const genreDetectionBtn = document.getElementById('genreDetectionBtn');
    const userSelect = document.getElementById('userSelect');
    const videoSource = document.getElementById('videoSource');
    const creatorStatsView = document.getElementById('creatorStatsView');
    const totalPlaysEl = document.getElementById('totalPlays');
    const dailyPlaysCanvas = document.getElementById('dailyPlaysChart');
    const bestTracksList = document.getElementById('bestTracksList');
    const navCategories = document.getElementById('navCategories');
    const categoriesView = document.getElementById('categoriesView');
    const allTracksView = document.getElementById('allTracksView');
    const bestTracksGridContainer = document.getElementById('bestTracksGridContainer');
    const allTracksGridContainer = document.getElementById('allTracksGridContainer');
    const myTracksBtn = document.getElementById('myTracksBtn');
    const moderationTracksBtn = document.getElementById('moderationTracksBtn');
    const creatorNav = document.getElementById('creatorNav');
    const creatorApplyBtn = document.getElementById('creatorApplyBtn');
    const creatorApplyModal = document.getElementById('creatorApplyModal');
    const closeCreatorApplyModalBtn = document.getElementById('closeCreatorApplyModalBtn');
    const creatorApplyForm = document.getElementById('creatorApplyForm');
    const creatorApplyStatus = document.getElementById('creatorApplyStatus');
    const uploadCategorySelect = document.getElementById('uploadCategorySelect');
    const categoryModal = document.getElementById('categoryModal');
    const showCategoryModalBtn = document.getElementById('showCategoryModalBtn');
    const closeCategoryModalBtn = document.getElementById('closeCategoryModalBtn');
    const categoryForm = document.getElementById('categoryForm');
    const categoryNameInput = document.getElementById('categoryName');
    const userSearchInput = document.getElementById('userSearchInput');
    const userSearchStatus = document.getElementById('userSearchStatus');
    const selectedUsersContainer = document.getElementById('selectedUsersContainer');
    const homeViewXrecomenTrackImg = document.getElementById('xrecomenTrackImg');
    const homeViewXrecomenTrackTitle = document.getElementById('xrecomenTrackTitle');
    const homeViewXrecomenTrackArtist = document.getElementById('xrecomenTrackArtist');
    const homeViewYouLikeGrid = document.getElementById('youLikeGrid');
    const homeViewYouMayLikeGrid = document.getElementById('youMayLikeGrid');
    const homeViewFavoriteCollectionsGrid = document.getElementById('favoriteCollectionsGrid');
    const homeViewBestTracksGrid = document.getElementById('bestTracksGrid');
    const playerBackground = document.querySelector('.player-background');
    const creatorMainContent = document.querySelector('.creator-main-content');
    const myTracksLoader = document.getElementById('myTracksLoader');
    const myTracksEndMessage = document.getElementById('myTracksEndMessage');
    let totalMyTracks = 0;


    const showView = (viewId) => {
        document.querySelectorAll('.view').forEach(view => {
            view.style.display = 'none';
        });
        const view = document.getElementById(viewId);
        if (view) {
            view.style.display = 'block';
        }
        if(viewId === 'myTracksView') {
            myTracksGrid.innerHTML = '';
            currentPage = 1;
            fetchMyTracks(true);
        } else if (viewId === 'homeView') {
            fetchInitialData();
            fetchBestTracks();
            fetchXrecomen();
        } else if (viewId === 'allTracksView') {
            fetchTracks();
        } else if (viewId === 'categoriesView') {
            fetchCategories();
        } else if (viewId === 'favoritesView') {
            fetchFavorites();
        } else if (viewId === 'creatorStatsView') {
            fetchCreatorStats();
        }
    };

    const fetchMyTracks = async (isInitial = false) => {
        if (isLoading) return;
        isLoading = true;
        myTracksLoader.style.display = 'block';

        const userId = currentUser.id;
        const page = isInitial ? 1 : currentPage;
        const perPage = isInitial ? 20 : 30;

        try {
            const response = await fetch(`${api}/api/creator/my-tracks/${userId}?page=${page}&per_page=${perPage}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            const data = await response.json();

            if (data.length > 0) {
                myTracks = isInitial ? data : [...myTracks, ...data];
                renderMyTracks(data);
                currentPage++;
            } else {
                myTracksEndMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Ошибка при получении треков пользователя:', error);
        } finally {
            isLoading = false;
            myTracksLoader.style.display = 'none';
        }
    };
    
    const setupScrollListener = () => {
        const myTracksContainer = document.querySelector('.creator-main-content');
        if (!myTracksContainer) return;
    
        myTracksContainer.removeEventListener('scroll', handleMyTracksScroll);
        myTracksContainer.addEventListener('scroll', handleMyTracksScroll);
    };

    const handleMyTracksScroll = () => {
        const myTracksContainer = document.querySelector('.creator-main-content');
        if (myTracksContainer.scrollTop + myTracksContainer.clientHeight >= myTracksContainer.scrollHeight - 100) {
            fetchMyTracks();
        }
    };

    const renderMyTracks = (tracksToRender) => {
        tracksToRender.forEach(track => {
            const card = createTrackCard(track);
            myTracksGrid.appendChild(card);
        });
    };

    // Все остальные функции из script.js ниже...
    
    const fetchInitialData = async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            if (!token) return;

            const decodedToken = parseJwt(token);
            if (decodedToken) {
                currentUser = decodedToken;
                updateUIAfterLogin();
            }

            const response = await fetch(`${api}/api/tracks`);
            allMedia = await response.json();
            renderTracks(allMedia, allTracksGridContainer);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    };

    const createTrackCard = (track, isBest = false) => {
        const card = document.createElement('div');
        card.className = `track-card ${isBest ? 'best-track-card' : ''}`;
        card.dataset.id = track.id;
        card.innerHTML = `
            <img src="${api}/fon/${track.cover}" alt="${track.title}" class="track-cover">
            <div class="card-overlay">
                <button class="play-btn">
                    <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
            </div>
            <div class="track-info">
                <span class="track-title">${track.title}</span>
                <span class="track-artist">${track.creator_name || track.artist}</span>
            </div>
        `;

        card.addEventListener('click', (e) => {
            e.stopPropagation();
            if (e.target.closest('.play-btn')) {
                playMedia(track);
            } else {
                showTrackDetails(track);
            }
        });

        return card;
    };

    const renderTracks = (tracks, container) => {
        container.innerHTML = '';
        tracks.forEach(track => {
            container.appendChild(createTrackCard(track));
        });
    };

    const renderBestTracks = (tracks, container) => {
        container.innerHTML = '';
        tracks.forEach(track => {
            container.appendChild(createTrackCard(track, true));
        });
    };

    const playMedia = (track) => {
        const mediaSource = `${api}/${track.type === 'video' ? 'video' : 'music'}/${track.file}`;
        const coverSource = `${api}/fon/${track.cover}`;
        const playerStyle = localStorage.getItem(PLAYER_STYLE_KEY) || 'default';
        const isAudio = track.type === 'audio';
        
        if (isAudio) {
            audioPlayer.src = mediaSource;
            audioPlayer.style.display = 'block';
            videoPlayer.style.display = 'none';
            playerBackground.style.backgroundImage = `url(${coverSource})`;
            activeMediaElement = audioPlayer;
        } else {
            videoPlayer.src = mediaSource;
            videoPlayer.style.display = 'block';
            audioPlayer.style.display = 'none';
            playerBackground.style.backgroundImage = 'none';
            activeMediaElement = videoPlayer;
        }

        activeMediaElement.load();
        activeMediaElement.play().catch(e => console.error('Ошибка воспроизведения:', e));

        document.getElementById('fullPlayerTitle').textContent = track.title;
        document.getElementById('fullPlayerArtist').textContent = track.creator_name || track.artist;
        document.getElementById('fullPlayerCover').src = coverSource;
        document.getElementById('copyPlayerTitle').textContent = track.title;
        document.getElementById('copyPlayerArtist').textContent = track.creator_name || track.artist;
        
        updatePlaybackStatus(track.id, activeMediaElement);
        checkFavorite(track.file);
        
        miniPlayer.style.display = 'block';
        if(playerStyle === 'copy') {
            copyMainControls.style.display = 'flex';
        } else {
            miniPlayer.classList.add('active');
        }
        
        currentTrackIndex = allMedia.findIndex(t => t.id === track.id);
        updatePlaybackButtons();
    };

    const updatePlaybackStatus = (trackId, player) => {
        let isUpdating = false;
        const sendUpdate = async () => {
            if (isUpdating || player.paused) return;
            isUpdating = true;
            try {
                const response = await fetch(`${api}/api/update-playback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                    },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        trackId: trackId,
                        currentTime: player.currentTime,
                        duration: player.duration
                    })
                });
                if (!response.ok) {
                    console.error('Ошибка обновления статистики воспроизведения.');
                }
            } catch (error) {
                console.error('Ошибка сети при обновлении статистики:', error);
            } finally {
                isUpdating = false;
            }
        };

        player.removeEventListener('timeupdate', sendUpdate);
        player.addEventListener('timeupdate', sendUpdate);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const updateProgress = () => {
        const current = activeMediaElement.currentTime;
        const duration = activeMediaElement.duration;
        const progressPercent = (current / duration) * 100;
        
        progressBar.style.width = `${progressPercent}%`;
        copyProgressBar.style.width = `${progressPercent}%`;
        
        timeCurrent.textContent = formatTime(current);
        copyTimeCurrent.textContent = formatTime(current);
        
        if (!isNaN(duration)) {
            timeTotal.textContent = formatTime(duration);
            copyTimeTotal.textContent = formatTime(duration);
        }
    };

    const scrub = (e, container) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const newTime = (x / width) * activeMediaElement.duration;
        if (!isNaN(newTime)) {
            activeMediaElement.currentTime = newTime;
        }
    };
    
    const showTrackDetails = (track) => {
        document.getElementById('detailsCover').src = `${api}/fon/${track.cover}`;
        document.getElementById('detailsTitle').textContent = track.title;
        document.getElementById('detailsArtist').textContent = track.creator_name || track.artist;
        document.getElementById('detailsPlays').textContent = `Прослушиваний: ${track.plays}`;
        document.getElementById('detailsGenre').textContent = `Жанр: ${track.genre}`;
        document.getElementById('detailsDownload').href = `${api}/music/${track.file}`;
        trackDetailsModal.style.display = 'block';
    };

    const closeModal = (modalId) => {
        document.getElementById(modalId).style.display = 'none';
    };

    const showViewByHash = () => {
        const hash = window.location.hash.substring(1);
        const viewId = hash || 'homeView';
        showView(viewId);
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${api}/api/categories`);
            const categories = await response.json();
            renderCategories(categories);
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
        }
    };

    const renderCategories = (categories) => {
        allCategoriesGrid.innerHTML = '';
        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.textContent = category.name;
            card.dataset.id = category.id;
            card.addEventListener('click', () => {
                fetchTracksByCategory(category.id, category.name);
            });
            allCategoriesGrid.appendChild(card);
        });
    };

    const fetchTracksByCategory = async (categoryId, categoryName) => {
        try {
            const response = await fetch(`${api}/api/tracks?categoryId=${categoryId}`);
            const tracks = await response.json();
            showView('specificCategoryView');
            specificCategoryTitle.textContent = categoryName;
            renderTracks(tracks, specificCategoryGrid);
        } catch (error) {
            console.error('Ошибка при получении треков по категории:', error);
        }
    };

    const fetchBestTracks = async () => {
        try {
            const response = await fetch(`${api}/api/tracks/best`);
            const tracks = await response.json();
            renderBestTracks(tracks, bestTracksGridContainer);
        } catch (error) {
            console.error('Ошибка при получении лучших треков:', error);
        }
    };
    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            if (!token) {
                console.error('Нет токена доступа.');
                return;
            }
            const response = await fetch(`${api}/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            userFavorites = await response.json();
            renderFavorites();
        } catch (error) {
            console.error('Ошибка при получении избранных треков:', error);
        }
    };

    const renderFavorites = () => {
        favoritesGridContainer.innerHTML = '';
        const favoriteTracks = allMedia.filter(track => userFavorites.includes(track.file));
        if (favoriteTracks.length > 0) {
            favoriteTracks.forEach(track => {
                favoritesGridContainer.appendChild(createTrackCard(track));
            });
        } else {
            favoritesGridContainer.innerHTML = '<p class="no-tracks">У вас пока нет избранных треков.</p>';
        }
    };

    const toggleFavorite = async (trackFile) => {
        const isFavorited = userFavorites.includes(trackFile);
        const method = isFavorited ? 'DELETE' : 'POST';
        const url = `${api}/api/favorites`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                },
                body: JSON.stringify({ userId: currentUser.id, mediaFile: trackFile })
            });
            const result = await response.json();
            console.log(result.message);
            if (response.ok) {
                if (isFavorited) {
                    userFavorites = userFavorites.filter(file => file !== trackFile);
                } else {
                    userFavorites.push(trackFile);
                }
                checkFavorite(trackFile);
            }
        } catch (error) {
            console.error('Ошибка при изменении избранного:', error);
        }
    };

    const checkFavorite = (trackFile) => {
        const isFavorited = userFavorites.includes(trackFile);
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('favorited', isFavorited);
        }
        if (copyFavoriteBtn) {
            copyFavoriteBtn.classList.toggle('favorited', isFavorited);
        }
    };
    
    const updatePlaybackButtons = () => {
        const nextTrack = allMedia[currentTrackIndex + 1];
        const prevTrack = allMedia[currentTrackIndex - 1];
        if (playNextBtn) playNextBtn.disabled = !nextTrack;
        if (playPrevBtn) playPrevBtn.disabled = !prevTrack;
    };
    
    const playNextTrack = () => {
        if (repeatMode) {
            activeMediaElement.currentTime = 0;
            activeMediaElement.play();
            return;
        }
        if (currentTrackIndex !== -1 && currentTrackIndex < allMedia.length - 1) {
            const nextTrack = allMedia[currentTrackIndex + 1];
            playMedia(nextTrack);
        }
    };

    const playPrevTrack = () => {
        if (activeMediaElement.currentTime > 3) {
            activeMediaElement.currentTime = 0;
            return;
        }
        if (currentTrackIndex > 0) {
            const prevTrack = allMedia[currentTrackIndex - 1];
            playMedia(prevTrack);
        }
    };
    
    const toggleShuffle = () => {
        shuffleBtn.classList.toggle('active');
        if (shuffleBtn.classList.contains('active')) {
            allMedia.sort(() => Math.random() - 0.5);
            currentTrackIndex = -1; // Сброс индекса, так как порядок изменился
        } else {
            // Восстановление исходного порядка (не реализовано в этом примере)
            fetchInitialData();
        }
    };

    const toggleRepeat = () => {
        repeatMode = !repeatMode;
        repeatBtn.classList.toggle('active', repeatMode);
        activeMediaElement.loop = repeatMode;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = usernameInput.value;
        const password = passwordInput.value;
        try {
            const response = await fetch(`${api}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem(ACCESS_TOKEN_KEY, data.token);
                currentUser = data.user;
                loginStatus.textContent = data.message;
                loginStatus.style.color = 'green';
                updateUIAfterLogin();
            } else {
                loginStatus.textContent = data.message;
                loginStatus.style.color = 'red';
            }
        } catch (error) {
            loginStatus.textContent = 'Ошибка сети. Попробуйте позже.';
            loginStatus.style.color = 'red';
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const username = registerUsernameInput.value;
        const password = registerPasswordInput.value;
        try {
            const response = await fetch(`${api}/api/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok) {
                loginStatus.textContent = data.message;
                loginStatus.style.color = 'green';
                showLoginView();
            } else {
                loginStatus.textContent = data.message;
                loginStatus.style.color = 'red';
            }
        } catch (error) {
            loginStatus.textContent = 'Ошибка сети. Попробуйте позже.';
            loginStatus.style.color = 'red';
        }
    };
    
    const showLoginView = () => {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('registerSection').style.display = 'none';
        loginStatus.textContent = '';
        loginForm.reset();
        registerForm.reset();
    };

    const showRegisterView = () => {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('registerSection').style.display = 'block';
        loginStatus.textContent = '';
        loginForm.reset();
        registerForm.reset();
    };

    const updateUIAfterLogin = () => {
        loginView.style.display = 'none';
        showView('homeView');
        if(currentUser) {
            creatorStudioBtn.style.display = (currentUser.role === 'creator' || currentUser.role === 'admin') ? 'block' : 'none';
            profileView.style.display = 'block';
            logoutBtn.style.display = 'block';
            profileUsername.textContent = currentUser.username;
            profileRole.textContent = currentUser.role;
            if(currentUser.role === 'creator') {
                creatorApplyBtn.style.display = 'none';
                creatorNav.style.display = 'block';
            } else if (currentUser.role === 'admin') {
                creatorApplyBtn.style.display = 'none';
                creatorNav.style.display = 'block';
                showCategoryModalBtn.style.display = 'block';
            } else {
                creatorApplyBtn.style.display = 'block';
                creatorNav.style.display = 'none';
                showCategoryModalBtn.style.display = 'none';
            }
        }
        fetchFavorites();
    };
    
    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        currentUser = null;
        myTracks = [];
        myTracksGrid.innerHTML = '';
        loginView.style.display = 'block';
        creatorStudioBtn.style.display = 'none';
        profileView.style.display = 'none';
        logoutBtn.style.display = 'none';
        creatorNav.style.display = 'none';
        showCategoryModalBtn.style.display = 'none';
        miniPlayer.classList.remove('active');
        miniPlayer.style.display = 'none';
        copyMainControls.style.display = 'none';
        showView('homeView');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        uploadStatus.textContent = 'Загрузка...';
        const formData = new FormData(uploadForm);
        formData.append('userId', currentUser.id);
        const audioFile = uploadForm.audioFile.files[0];
        const videoFile = uploadForm.videoFile.files[0];
        formData.append('uploadType', audioFile ? 'audio' : 'video');
        
        try {
            const response = await fetch(`${api}/api/moderation/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                },
                body: formData
            });

            if (response.ok) {
                uploadStatus.textContent = 'Файл успешно отправлен на модерацию!';
                uploadStatus.style.color = 'green';
                uploadForm.reset();
                setTimeout(() => closeModal('uploadMusicModal'), 2000);
            } else {
                const data = await response.json();
                uploadStatus.textContent = data.message || 'Ошибка загрузки.';
                uploadStatus.style.color = 'red';
            }
        } catch (error) {
            uploadStatus.textContent = 'Ошибка сети. Попробуйте позже.';
            uploadStatus.style.color = 'red';
        }
    };
    
    const toggleUploadFields = () => {
        const audioFile = document.getElementById('audioFile').files[0];
        const videoFile = document.getElementById('videoFile').files[0];
        document.getElementById('genreSelector').disabled = !audioFile;
        document.getElementById('artistInput').disabled = !audioFile;
        document.getElementById('uploadCategorySelect').disabled = !audioFile;
    };
    
    const fetchCreatorStats = async () => {
        try {
            const response = await fetch(`${api}/api/creator/stats/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            const data = await response.json();
            
            totalPlaysEl.textContent = data.totalPlays;
            
            const dates = data.dailyPlays.map(d => d.date);
            const counts = data.dailyPlays.map(d => d.count);
            
            new Chart(dailyPlaysCanvas, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Прослушивания',
                        data: counts,
                        borderColor: '#4A90E2',
                        backgroundColor: 'rgba(74, 144, 226, 0.2)',
                        tension: 0.1,
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
            
            bestTracksList.innerHTML = '';
            data.trackStats.forEach(track => {
                const li = document.createElement('li');
                li.textContent = `${track.title} - ${track.plays} прослушиваний`;
                bestTracksList.appendChild(li);
            });
            
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
        }
    };
    
    const fetchGenres = async () => {
        try {
            const response = await fetch(`${api}/api/genres`);
            const genres = await response.json();
            genreSelector.innerHTML = '<option value="">Не выбран</option>';
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre;
                option.textContent = genre;
                genreSelector.appendChild(option);
            });
        } catch (error) {
            console.error('Ошибка при получении жанров:', error);
        }
    };
    
    const determineGenre = async () => {
        const fileInput = document.getElementById('audioFile');
        if (fileInput.files.length === 0) {
            alert('Сначала выберите аудиофайл.');
            return;
        }
        
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        
        genreDetectionBtn.textContent = 'Определение...';
        genreDetectionBtn.disabled = true;

        try {
            const response = await fetch(`${api}/api/determine-genre`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                },
                body: formData
            });
            const data = await response.json();
            
            if (response.ok) {
                alert(`Предполагаемый жанр: ${data.genre}`);
                genreSelector.value = data.genre;
            } else {
                alert(`Ошибка: ${data.message}`);
            }
        } catch (error) {
            console.error('Ошибка при определении жанра:', error);
            alert('Произошла ошибка при определении жанра.');
        } finally {
            genreDetectionBtn.textContent = 'Определить жанр';
            genreDetectionBtn.disabled = false;
        }
    };
    
    const fetchModerationTracks = async () => {
        try {
            const response = await fetch(`${api}/api/moderation/tracks`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            const data = await response.json();
            moderationTracks = data;
            renderModerationTracks();
        } catch (error) {
            console.error('Ошибка при получении треков на модерации:', error);
        }
    };
    
    const renderModerationTracks = () => {
        moderationGrid.innerHTML = '';
        moderationTracks.forEach(track => {
            const card = document.createElement('div');
            card.className = 'moderation-card';
            card.innerHTML = `
                <img src="${api}/temp_uploads/${track.cover_name}" alt="${track.title}" class="moderation-cover">
                <div class="moderation-info">
                    <h3>${track.title}</h3>
                    <p>От: ${track.creator_name}</p>
                    <p>Жанр: ${track.genre}</p>
                    <p>Артист: ${track.artist}</p>
                    <p>Категория: ${track.category_name}</p>
                </div>
                <div class="moderation-actions">
                    <button class="approve-btn" data-id="${track.id}">Одобрить</button>
                    <button class="reject-btn" data-id="${track.id}">Отклонить</button>
                </div>
            `;
            moderationGrid.appendChild(card);
        });
    };
    
    const approveTrack = async (trackId) => {
        try {
            const response = await fetch(`${api}/api/moderation/approve/${trackId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchModerationTracks();
            } else {
                alert(`Ошибка: ${data.message}`);
            }
        } catch (error) {
            console.error('Ошибка при одобрении трека:', error);
        }
    };

    const rejectTrack = async (trackId) => {
        try {
            const response = await fetch(`${api}/api/moderation/reject/${trackId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                fetchModerationTracks();
            } else {
                alert(`Ошибка: ${data.message}`);
            }
        } catch (error) {
            console.error('Ошибка при отклонении трека:', error);
        }
    };
    
    const fetchUserForCategory = async (username) => {
        try {
            const response = await fetch(`${api}/api/user/${username}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            const user = await response.json();
            return user;
        } catch (error) {
            console.error('Ошибка при поиске пользователя:', error);
            return null;
        }
    };
    
    const fetchCategoriesForUpload = async () => {
        try {
            const response = await fetch(`${api}/api/creator/my-categories/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            const categories = await response.json();
            uploadCategorySelect.innerHTML = '<option value="">Не выбрана</option>';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                uploadCategorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Ошибка при получении категорий:', error);
        }
    };
    
    const handleCategoryForm = async (e) => {
        e.preventDefault();
        const categoryId = document.getElementById('categoryId').value;
        const categoryName = categoryNameInput.value;
        const userIds = Array.from(selectedUsersContainer.querySelectorAll('.selected-user')).map(el => el.dataset.id);
        
        try {
            const response = await fetch(`${api}/api/category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                },
                body: JSON.stringify({ categoryId, categoryName, userIds })
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                closeModal('categoryModal');
                fetchCategories();
            } else {
                alert(`Ошибка: ${data.message}`);
            }
        } catch (error) {
            console.error('Ошибка при создании/обновлении категории:', error);
            alert('Произошла ошибка.');
        }
    };
    
    const fetchXrecomen = async () => {
        try {
            const response = await fetch(`${api}/api/xrecomen/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            const data = await response.json();

            if (data.xrecomenTrack) {
                homeViewXrecomenTrackImg.src = `${api}/fon/${data.xrecomenTrack.cover}`;
                homeViewXrecomenTrackTitle.textContent = data.xrecomenTrack.title;
                homeViewXrecomenTrackArtist.textContent = data.xrecomenTrack.artist || data.xrecomenTrack.creator_name;
                document.querySelector('.xrecomen-card').dataset.id = data.xrecomenTrack.id;
                document.querySelector('.xrecomen-card').addEventListener('click', () => playMedia(data.xrecomenTrack));
            } else {
                document.querySelector('.xrecomen-card').style.display = 'none';
            }
            
            renderTracks(data.youLike, homeViewYouLikeGrid);
            renderTracks(data.youMayLike, homeViewYouMayLikeGrid);
            
            homeViewFavoriteCollectionsGrid.innerHTML = '';
            data.favoriteCollections.forEach(collection => {
                const card = document.createElement('div');
                card.className = 'category-card';
                card.textContent = collection.name;
                card.dataset.id = collection.id;
                card.addEventListener('click', () => fetchTracksByCategory(collection.id, collection.name));
                homeViewFavoriteCollectionsGrid.appendChild(card);
            });
        } catch (error) {
            console.error('Ошибка при получении рекомендаций:', error);
        }
    };
    
    const initEventListeners = () => {
        // Установка обработчиков событий для пагинации
        const myTracksContainer = document.querySelector('.creator-main-content');
        if (myTracksContainer) {
            myTracksContainer.addEventListener('scroll', () => {
                if (myTracksContainer.scrollTop + myTracksContainer.clientHeight >= myTracksContainer.scrollHeight - 100) {
                    fetchMyTracks();
                }
            });
        }
        
        homeNav.addEventListener('click', () => {
            window.location.hash = '';
        });
        navCategories.addEventListener('click', () => {
            window.location.hash = 'categoriesView';
        });
        navFavorites.addEventListener('click', () => {
            window.location.hash = 'favoritesView';
        });
        if (creatorStudioBtn) creatorStudioBtn.addEventListener('click', () => {
            window.location.hash = 'creatorStatsView';
        });
        if (myTracksBtn) myTracksBtn.addEventListener('click', () => {
            window.location.hash = 'myTracksView';
        });
        if (moderationTracksBtn) moderationTracksBtn.addEventListener('click', () => {
            window.location.hash = 'moderationView';
            fetchModerationTracks();
        });

        window.addEventListener('hashchange', showViewByHash);
        
        if (loginForm) loginForm.addEventListener('submit', handleLogin);
        if (registerForm) registerForm.addEventListener('submit', handleRegister);
        if (showRegisterLink) showRegisterLink.addEventListener('click', (e) => {
            e.preventDefault();
            showRegisterView();
        });
        if (showLoginLink) showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            showLoginView();
        });
        if (logoutBtn) logoutBtn.addEventListener('click', logout);
        if (closeUploadModalBtn) closeUploadModalBtn.addEventListener('click', () => closeModal('uploadMusicModal'));
        if (showUploadBtn) showUploadBtn.addEventListener('click', () => {
            document.getElementById('uploadMusicModal').style.display = 'block';
            fetchCategoriesForUpload();
        });
        if (uploadForm) uploadForm.addEventListener('submit', handleUpload);
        
        if (uploadForm) {
            document.getElementById('audioFile').addEventListener('change', toggleUploadFields);
            document.getElementById('videoFile').addEventListener('change', toggleUploadFields);
        }
        
        if (genreDetectionBtn) genreDetectionBtn.addEventListener('click', determineGenre);
        
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('approve-btn')) {
                approveTrack(e.target.dataset.id);
            }
            if (e.target.classList.contains('reject-btn')) {
                rejectTrack(e.target.dataset.id);
            }
        });
        
        if (creatorApplyBtn) creatorApplyBtn.addEventListener('click', () => {
            document.getElementById('creatorApplyModal').style.display = 'block';
        });
        
        if (closeCreatorApplyModalBtn) closeCreatorApplyModalBtn.addEventListener('click', () => {
            closeModal('creatorApplyModal');
        });
        
        if (creatorApplyForm) creatorApplyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            creatorApplyStatus.textContent = 'Отправка...';
            const formData = new FormData(creatorApplyForm);
            const data = {
                userId: currentUser.id,
                fullName: formData.get('fullName'),
                phoneNumber: formData.get('phoneNumber'),
                email: formData.get('email')
            };

            try {
                const response = await fetch(`${api}/api/apply-for-creator`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    creatorApplyStatus.textContent = result.message;
                    creatorApplyStatus.style.color = 'green';
                    setTimeout(() => closeModal('creatorApplyModal'), 2000);
                } else {
                    creatorApplyStatus.textContent = result.message || 'Ошибка отправки заявки.';
                    creatorApplyStatus.style.color = 'red';
                }
            } catch (error) {
                creatorApplyStatus.textContent = 'Ошибка сети. Попробуйте позже.';
                creatorApplyStatus.style.color = 'red';
            }
        });

        if (showCategoryModalBtn) showCategoryModalBtn.addEventListener('click', () => {
            document.getElementById('categoryModal').style.display = 'block';
        });

        if (closeCategoryModalBtn) closeCategoryModalBtn.addEventListener('click', () => {
            closeModal('categoryModal');
        });

        if (categoryForm) categoryForm.addEventListener('submit', handleCategoryForm);

        if (userSearchInput) userSearchInput.addEventListener('input', debounce(async (e) => {
            const username = e.target.value.trim();
            if (username.length < 3) {
                userSearchStatus.textContent = '';
                return;
            }
            userSearchStatus.textContent = 'Поиск...';
            const user = await fetchUserForCategory(username);
            if (user) {
                userSearchStatus.textContent = '';
                const userEl = document.createElement('div');
                userEl.className = 'selected-user';
                userEl.textContent = user.username;
                userEl.dataset.id = user.id;
                const removeBtn = document.createElement('span');
                removeBtn.textContent = '×';
                removeBtn.className = 'remove-user';
                removeBtn.addEventListener('click', () => {
                    userEl.remove();
                });
                userEl.appendChild(removeBtn);
                selectedUsersContainer.appendChild(userEl);
                userSearchInput.value = '';
            } else {
                userSearchStatus.textContent = 'Пользователь не найден';
            }
        }, 300));

        // Media player controls
        if (playPrevBtn) playPrevBtn.addEventListener('click', playPrevTrack);
        if (playNextBtn) playNextBtn.addEventListener('click', playNextTrack);
        if (shuffleBtn) shuffleBtn.addEventListener('click', toggleShuffle);
        if (repeatBtn) repeatBtn.addEventListener('click', toggleRepeat);
        if (favoriteBtn) favoriteBtn.addEventListener('click', () => {
            const activeTrack = allMedia.find(t => t.file === activeMediaElement.src.split('/').pop());
            if (activeTrack) {
                toggleFavorite(activeTrack.file);
            }
        });
        if (copyFavoriteBtn) copyFavoriteBtn.addEventListener('click', () => {
            const activeTrack = allMedia.find(t => t.file === activeMediaElement.src.split('/').pop());
            if (activeTrack) {
                toggleFavorite(activeTrack.file);
            }
        });
        
        document.querySelector('.play-pause-btn').addEventListener('click', () => {
            if (activeMediaElement.paused) {
                activeMediaElement.play();
            } else {
                activeMediaElement.pause();
            }
        });

        document.querySelector('.copy-play-pause-btn').addEventListener('click', () => {
            if (activeMediaElement.paused) {
                activeMediaElement.play();
            } else {
                activeMediaElement.pause();
            }
        });

        activeMediaElement.addEventListener('play', () => {
            document.querySelector('.play-pause-btn svg').innerHTML = '<path d="M14 19h-4v-12h4v12zm6-12v12h-4v-12h4z"/>';
            document.querySelector('.copy-play-pause-btn svg').innerHTML = '<path d="M14 19h-4v-12h4v12zm6-12v12h-4v-12h4z"/>';
        });

        activeMediaElement.addEventListener('pause', () => {
            document.querySelector('.play-pause-btn svg').innerHTML = '<path d="M8 5v14l11-7z"/>';
            document.querySelector('.copy-play-pause-btn svg').innerHTML = '<path d="M8 5v14l11-7z"/>';
        });

        activeMediaElement.addEventListener('ended', () => {
            if (!repeatMode) {
                playNextTrack();
            }
        });

        activeMediaElement.addEventListener('timeupdate', updateProgress);
        
        if (progressBarContainer) progressBarContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            scrub(e, progressBarContainer);
        });
        if (copyProgressBarContainer) copyProgressBarContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            scrub(e, copyProgressBarContainer);
        });
        
        window.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const style = localStorage.getItem(PLAYER_STYLE_KEY) || 'default';
                const container = style === 'copy' ? copyProgressBarContainer : progressBarContainer;
                scrub(e, container);
            }
        });
        window.addEventListener('mouseup', () => { isDragging = false; });
        
        const setVolume = (value) => {
            audioPlayer.volume = videoPlayer.volume = value;
            if(volumeBar) volumeBar.value = value;
            if(copyVolumeBar) copyVolumeBar.value = value;
            saveVolumeSetting(value);
        };
        
        if (volumeBar) volumeBar.addEventListener('input', (e) => setVolume(e.target.value));
        if (copyVolumeBar) copyVolumeBar.addEventListener('input', (e) => setVolume(e.target.value));

        if (closeMiniPlayerBtn) closeMiniPlayerBtn.addEventListener('click', () => {
            miniPlayer.classList.remove('active');
            copyMainControls.style.display = 'none';
            audioPlayer.pause();
            videoPlayer.pause();
        });

        if (playerStyleToggle) playerStyleToggle.addEventListener('click', () => {
            const currentStyle = localStorage.getItem(PLAYER_STYLE_KEY) || 'default';
            const newStyle = currentStyle === 'default' ? 'copy' : 'default';
            localStorage.setItem(PLAYER_STYLE_KEY, newStyle);
            if (newStyle === 'copy') {
                miniPlayer.classList.remove('active');
                copyMainControls.style.display = 'flex';
            } else {
                miniPlayer.classList.add('active');
                copyMainControls.style.display = 'none';
            }
        });
        
        if (miniPlayerBtn) miniPlayerBtn.addEventListener('click', () => {
            fullPlayer.style.display = 'none';
            miniPlayer.classList.add('active');
        });
        if (fullPlayerBtn) fullPlayerBtn.addEventListener('click', () => {
            fullPlayer.style.display = 'flex';
            miniPlayer.classList.remove('active');
        });

        const playerBody = document.querySelector('.player-body');
        const overlayOpacity = document.getElementById('overlayOpacity');
        if (overlayOpacity) {
            overlayOpacity.addEventListener('input', (e) => {
                const opacity = e.target.value;
                playerBody.style.setProperty('--ui-opacity', opacity);
                saveOpacitySetting(opacity);
            });
        }
        
        const backgroundBlur = document.getElementById('backgroundBlur');
        if (backgroundBlur) {
            backgroundBlur.addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                playerBackground.classList.toggle('blurred', isChecked);
                saveBlurSetting(isChecked);
            });
        }
    };
    
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };
    
    const saveOpacitySetting = (opacity) => {
        localStorage.setItem(UI_OPACITY_KEY, opacity);
    };

    const loadOpacitySetting = () => {
        const opacity = localStorage.getItem(UI_OPACITY_KEY);
        if (opacity) {
            document.querySelector('.player-body').style.setProperty('--ui-opacity', opacity);
            if (document.getElementById('overlayOpacity')) {
                document.getElementById('overlayOpacity').value = opacity;
            }
        }
    };
    
    const saveBlurSetting = (enabled) => {
        localStorage.setItem(BLUR_ENABLED_KEY, enabled);
    };
    
    const loadBlurSetting = () => {
        const enabled = localStorage.getItem(BLUR_ENABLED_KEY) === 'true';
        if (enabled) {
            document.querySelector('.player-background').classList.add('blurred');
            if (document.getElementById('backgroundBlur')) {
                document.getElementById('backgroundBlur').checked = true;
            }
        }
    };
    
    const saveVolumeSetting = (volume) => {
        localStorage.setItem(VOLUME_KEY, volume);
    };
    
    const loadVolumeSetting = () => {
        const volume = localStorage.getItem(VOLUME_KEY);
        if (volume) {
            audioPlayer.volume = videoPlayer.volume = volume;
            if(volumeBar) volumeBar.value = volume;
            if(copyVolumeBar) copyVolumeBar.value = volume;
        }
    };

    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    const init = () => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            if(token && parseJwt(token)) {
                updateUIAfterLogin();
            } else {
                logout();
            }
        } else {
            showLoginView();
        }

        loadOpacitySetting();
        loadBlurSetting();
        loadVolumeSetting();
        initEventListeners();
        fetchInitialData();
        fetchCategories();
        setupScrollListener();
        showViewByHash();
    };

    init();
});