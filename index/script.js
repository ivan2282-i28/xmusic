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
    const navAdmin = document.getElementById('navAdmin');
    const navLogin = document.getElementById('navLogin');
    const navLogout = document.getElementById('navLogout');
    const xmusicLogo = document.getElementById('xmusicLogo');
    const xcreatorLogo = document.getElementById('xcreatorLogo');
    const adminNav = document.getElementById('adminNav');
    const loginModal = document.getElementById('loginModal');
    const registrationModal = document.getElementById('registrationModal');
    const closeModalBtns = document.querySelectorAll('.close-btn');
    const loginForm = document.getElementById('loginForm');
    const registrationForm = document.getElementById('registrationForm');
    const trackDetailsModal = document.getElementById('trackDetailsModal');
    const trackDetailsPlayer = document.getElementById('trackDetailsPlayer');
    const trackDetailsTitle = document.getElementById('trackDetailsTitle');
    const trackDetailsArtist = document.getElementById('trackDetailsArtist');
    const trackDetailsCover = document.getElementById('trackDetailsCover');
    const toggleFavoritesBtn = document.getElementById('toggleFavoritesBtn');
    const playerCover = document.getElementById('playerCover');
    const playerTitle = document.getElementById('playerTitle');
    const playerArtist = document.getElementById('playerArtist');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const skipNextBtn = document.getElementById('skipNextBtn');
    const skipPrevBtn = document.getElementById('skipPrevBtn');
    const timeCurrent = document.getElementById('timeCurrent');
    const timeDuration = document.getElementById('timeDuration');
    const progressBar = document.getElementById('progressBar');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const searchResultsContainer = document.getElementById('searchResultsContainer');
    const creatorView = document.getElementById('creatorView');
    const adminView = document.getElementById('adminView');
    const moderationTableBody = document.getElementById('moderationTableBody');
    const uploadMusicForm = document.getElementById('uploadMusicForm');
    const musicFileInput = document.getElementById('musicFileInput');
    const videoFileInput = document.getElementById('videoFileInput');
    const coverFileInput = document.getElementById('coverFileInput');
    const adminUsersTableBody = document.getElementById('adminUsersTableBody');
    const userModal = document.getElementById('userModal');
    const userModalClose = document.getElementById('userModalClose');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const changeRoleForm = document.getElementById('changeRoleForm');
    const creatorStatsView = document.getElementById('creatorStatsView');
    const totalPlaysEl = document.getElementById('totalPlays');
    const dailyPlaysChartCanvas = document.getElementById('dailyPlaysChart');
    const trackStatsTableBody = document.getElementById('trackStatsTableBody');
    const creatorTracksTableBody = document.getElementById('creatorTracksTableBody');
    const adminStatsView = document.getElementById('adminStatsView');
    const adminTotalUsers = document.getElementById('adminTotalUsers');
    const adminTotalTracks = document.getElementById('adminTotalTracks');
    const moderationModal = document.getElementById('moderationModal');
    const moderationPlayer = document.getElementById('moderationPlayer');
    const moderationVideoPlayer = document.getElementById('moderationVideoPlayer');
    const moderationApproveBtn = document.getElementById('moderationApproveBtn');
    const moderationRejectBtn = document.getElementById('moderationRejectBtn');
    const genreSelect = document.getElementById('genreSelect');
    const creatorGenreSelect = document.getElementById('creatorGenreSelect');
    const categoriesSection = document.getElementById('categoriesSection');
    const categoriesList = document.getElementById('categoriesList');
    const categoryModal = document.getElementById('categoryModal');
    const categoryForm = document.getElementById('categoryForm');
    const categoryNameInput = document.getElementById('categoryName');
    const userSearchInput = document.getElementById('userSearchInput');
    const selectedUsersContainer = document.getElementById('selectedUsersContainer');
    const userSearchStatus = document.getElementById('userSearchStatus');
    const applyForCreatorForm = document.getElementById('applyForCreatorForm');
    const moderationApplicationsView = document.getElementById('moderationApplicationsView');
    const applicationsTableBody = document.getElementById('applicationsTableBody');
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');
    const themeStylesheet = document.getElementById('themeStylesheet');
    const mainPlayer = document.querySelector('.main-player');
    const opacitySlider = document.getElementById('opacitySlider');
    const opacityValue = document.getElementById('opacityValue');
    const volumeBar = document.getElementById('volumeBar');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const repeatBtn = document.getElementById('repeatBtn');
    const loginMessage = document.getElementById('loginMessage');
    const xrecomenSection = document.getElementById('xrecomenSection');
    const xrecomenContainer = document.getElementById('xrecomenContainer');
    const youLikeContainer = document.getElementById('youLikeContainer');
    const youMayLikeContainer = document.getElementById('youMayLikeContainer');
    const likedCollectionsContainer = document.getElementById('likedCollectionsContainer');
    const backToCategoriesBtn = document.getElementById('backToCategoriesBtn');
    const categoryTracksGrid = document.getElementById('categoryTracksGrid');
    const categoryTracksSection = document.getElementById('categoryTracksSection');
    const specificCategoryName = document.getElementById('specificCategoryName');

    // --- Добавляем скрипт reCAPTCHA v3 ---
    const RECAPTCHA_SITE_KEY = '6LfDl7QrAAAAALG2gcYm42BZzuCsY_I7edgnMFzJ';
    const SCRIPT_URL = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Добавляем обработчик для переключения между формами входа/регистрации
    document.getElementById('showRegistrationBtn').addEventListener('click', () => {
        loginModal.style.display = 'none';
        registrationModal.style.display = 'block';
    });
    document.getElementById('showLoginBtn').addEventListener('click', () => {
        registrationModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    const displayMessage = (message, type) => {
        const messageContainer = type === 'error' ? loginMessage : loginMessage;
        messageContainer.textContent = message;
        messageContainer.style.color = type === 'error' ? 'var(--red-color)' : 'var(--green-color)';
    };

    const closeModal = (modal) => {
        modal.style.display = 'none';
    };

    const openModal = (modal) => {
        modal.style.display = 'block';
    };

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    const updateUIForAuth = (user) => {
        currentUser = user;
        const navLinks = document.querySelectorAll('.nav-link[data-role]');
        navLinks.forEach(link => link.style.display = 'none');
        document.getElementById('navFavorites').style.display = 'block';
        document.getElementById('navLogout').style.display = 'block';
        document.getElementById('navLogin').style.display = 'none';
        document.getElementById('userGreeting').textContent = `Привет, ${user.username}!`;

        if (user.role === 'admin') {
            document.getElementById('navAdmin').style.display = 'block';
            document.getElementById('adminSection').style.display = 'flex';
        } else {
            document.getElementById('navAdmin').style.display = 'none';
            document.getElementById('adminSection').style.display = 'none';
        }

        if (user.role === 'creator') {
            document.getElementById('navCreator').style.display = 'block';
            document.getElementById('creatorSection').style.display = 'flex';
            xmusicLogo.style.display = 'none';
            xcreatorLogo.style.display = 'block';
            document.querySelector('.main-nav').style.display = 'none';
            adminNav.style.display = 'none';
        } else {
            document.getElementById('navCreator').style.display = 'none';
            document.getElementById('creatorSection').style.display = 'none';
            xmusicLogo.style.display = 'block';
            xcreatorLogo.style.display = 'none';
            document.querySelector('.main-nav').style.display = 'block';
        }
    };

    const updateUIForGuest = () => {
        currentUser = null;
        document.getElementById('navFavorites').style.display = 'none';
        document.getElementById('navLogout').style.display = 'none';
        document.getElementById('navLogin').style.display = 'block';
        document.getElementById('navAdmin').style.display = 'none';
        document.getElementById('navCreator').style.display = 'none';
        document.getElementById('userGreeting').textContent = '';
        document.getElementById('adminSection').style.display = 'none';
        document.getElementById('creatorSection').style.display = 'none';
        xmusicLogo.style.display = 'block';
        xcreatorLogo.style.display = 'none';
        document.querySelector('.main-nav').style.display = 'block';
        adminNav.style.display = 'none';
    };

    // ---- Обновлённый обработчик входа с reCAPTCHA ----
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            grecaptcha.ready(async function() {
                const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'login'});

                try {
                    const response = await fetch(api + '/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: username,
                            password: password,
                            recaptcha_token: token
                        }),
                    });

                    const result = await response.json();

                    if (response.ok) {
                        localStorage.setItem('currentUser', JSON.stringify(result.user));
                        localStorage.setItem(ACCESS_TOKEN_KEY, result.token);
                        localStorage.setItem(REFRESH_TOKEN_KEY, result.refresh);
                        updateUIForAuth(result.user);
                        closeModal(loginModal);
                        fetchFavorites();
                        fetchAndRenderAll();
                        updateXrecomen();
                    } else {
                        displayMessage(result.message, 'error');
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    displayMessage('Ошибка соединения. Попробуйте позже.', 'error');
                }
            });
        });
    }

    // ---- Обновлённый обработчик регистрации с reCAPTCHA ----
    if (registrationForm) {
        registrationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('registrationUsername').value;
            const password = document.getElementById('registrationPassword').value;

            grecaptcha.ready(async function() {
                const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, {action: 'register'});

                try {
                    const response = await fetch(api + '/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            username: username,
                            password: password,
                            recaptcha_token: token
                        }),
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        displayMessage(result.message, 'success');
                        registrationForm.reset();
                        closeModal(registrationModal);
                        openModal(loginModal);
                    } else {
                        displayMessage(result.message, 'error');
                    }
                } catch (error) {
                    console.error('Ошибка:', error);
                    displayMessage('Ошибка соединения. Попробуйте позже.', 'error');
                }
            });
        });
    }


    if (navLogout) {
        navLogout.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            localStorage.removeItem(ACCESS_TOKEN_KEY);
            localStorage.removeItem(REFRESH_TOKEN_KEY);
            updateUIForGuest();
            allMedia = [];
            document.querySelector('.player-wrapper').classList.add('hidden');
            fetchAndRenderAll();
        });
    }

    const showView = (viewId) => {
        const views = document.querySelectorAll('.content-view');
        views.forEach(view => view.style.display = 'none');
        document.getElementById(viewId).style.display = 'block';
    };

    const setActiveNav = (linkId) => {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        if (linkId) {
            document.getElementById(linkId).classList.add('active');
        }
    };

    const fetchCategoriesAndGenres = async () => {
        try {
            const genresResponse = await fetch(api + '/api/genres');
            const genres = await genresResponse.json();
            
            if (genreSelect) {
                genreSelect.innerHTML = '<option value="">Все жанры</option>';
                genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    genreSelect.appendChild(option);
                });
            }

            if (creatorGenreSelect) {
                creatorGenreSelect.innerHTML = '<option value="">Выберите жанр</option>';
                genres.forEach(genre => {
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.textContent = genre.name;
                    creatorGenreSelect.appendChild(option);
                });
            }
            
            const categoriesResponse = await fetch(api + '/api/categories');
            const categories = await categoriesResponse.json();
            
            if (categoriesList) {
                categoriesList.innerHTML = '';
                categories.forEach(category => {
                    const li = document.createElement('li');
                    li.textContent = category.name;
                    li.addEventListener('click', () => {
                        showCategoryTracks(category.id, category.name);
                    });
                    categoriesList.appendChild(li);
                });
            }

            if (currentUser && (currentUser.role === 'creator' || currentUser.role === 'admin')) {
                const creatorCategoriesResponse = await fetch(api + `/api/creator/my-categories/${currentUser.id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
                });
                const creatorCategories = await creatorCategoriesResponse.json();
                const categorySelect = document.getElementById('creatorCategorySelect');
                if (categorySelect) {
                    categorySelect.innerHTML = '<option value="">Выберите категорию</option>';
                    creatorCategories.forEach(category => {
                        const option = document.createElement('option');
                        option.value = category.id;
                        option.textContent = category.name;
                        categorySelect.appendChild(option);
                    });
                }
            }
            
        } catch (error) {
            console.error('Ошибка при загрузке жанров и категорий:', error);
        }
    };

    const fetchFavorites = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(api + `/api/favorites`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                }
            });
            if (response.ok) {
                userFavorites = await response.json();
                renderFavorites();
            }
        } catch (error) {
            console.error('Ошибка при загрузке избранного:', error);
        }
    };
    
    const toggleFavorite = async (mediaFile) => {
        if (!currentUser) return;
        const isFavorite = userFavorites.includes(mediaFile);
        const method = isFavorite ? 'DELETE' : 'POST';
        
        try {
            const response = await fetch(api + `/api/favorites`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: currentUser.id, mediaFile: mediaFile })
            });

            if (response.ok) {
                if (isFavorite) {
                    userFavorites = userFavorites.filter(file => file !== mediaFile);
                } else {
                    userFavorites.push(mediaFile);
                }
                updateFavoriteButtonState(mediaFile);
                if (document.getElementById('favoritesGridContainer').style.display !== 'none') {
                    renderFavorites();
                }
            }
        } catch (error) {
            console.error('Ошибка при обновлении избранного:', error);
        }
    };

    const updateFavoriteButtonState = (mediaFile) => {
        const isFavorite = userFavorites.includes(mediaFile);
        const heartIcon = toggleFavoritesBtn.querySelector('i');
        if (isFavorite) {
            heartIcon.classList.remove('fa-heart-o');
            heartIcon.classList.add('fa-heart');
            toggleFavoritesBtn.classList.add('favorited');
        } else {
            heartIcon.classList.remove('fa-heart');
            heartIcon.classList.add('fa-heart-o');
            toggleFavoritesBtn.classList.remove('favorited');
        }
    };

    const renderFavorites = () => {
        const favoritesGrid = document.getElementById('favoritesGridContainer');
        favoritesGrid.innerHTML = '';
        const favorites = allMedia.filter(track => userFavorites.includes(track.file));
        favorites.forEach(track => {
            const card = createMediaCard(track);
            favoritesGrid.appendChild(card);
        });
    };
    
    const fetchAndRenderAll = async () => {
        try {
            const response = await fetch(api + '/api/tracks');
            allMedia = await response.json();
            renderMediaGrid(allMedia, allGridContainer);
        } catch (error) {
            console.error('Ошибка при загрузке треков:', error);
        }
    };

    const renderMediaGrid = (media, container) => {
        container.innerHTML = '';
        if (media.length === 0) {
            container.innerHTML = '<p class="no-results">По вашему запросу ничего не найдено.</p>';
        } else {
            media.forEach(track => {
                const card = createMediaCard(track);
                container.appendChild(card);
            });
        }
    };
    
    const createMediaCard = (track) => {
        const card = document.createElement('div');
        card.className = 'card media-card';
        card.setAttribute('data-index', allMedia.indexOf(track));
        card.innerHTML = `
            <img src="${api}/fon/${track.cover}" alt="${track.title} Cover" class="cover-image">
            <div class="card-content">
                <h3>${track.title}</h3>
                <p>${track.artist || track.creator_name || 'Неизвестный'}</p>
                <div class="card-actions">
                    <button class="play-btn"><i class="fas fa-play"></i></button>
                    ${currentUser ? `<button class="favorite-btn"><i class="fas fa-heart-o"></i></button>` : ''}
                </div>
            </div>
        `;
        
        const playBtn = card.querySelector('.play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playTrack(track);
            });
        }

        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            updateFavoriteButtonStateForCard(favoriteBtn, track.file);
            favoriteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(track.file);
                updateFavoriteButtonStateForCard(favoriteBtn, track.file);
            });
        }

        card.addEventListener('click', () => {
            showTrackDetails(track);
        });
        
        return card;
    };
    
    const updateFavoriteButtonStateForCard = (btn, mediaFile) => {
        const isFavorite = userFavorites.includes(mediaFile);
        const heartIcon = btn.querySelector('i');
        if (isFavorite) {
            heartIcon.classList.remove('fa-heart-o');
            heartIcon.classList.add('fa-heart');
            btn.classList.add('favorited');
        } else {
            heartIcon.classList.remove('fa-heart');
            heartIcon.classList.add('fa-heart-o');
            btn.classList.remove('favorited');
        }
    };

    const showTrackDetails = (track) => {
        if (trackDetailsPlayer) {
            if (track.type === 'audio') {
                trackDetailsPlayer.innerHTML = `<audio controls src="${api}/music/${track.file}"></audio>`;
            } else {
                trackDetailsPlayer.innerHTML = `<video controls src="${api}/video/${track.file}"></video>`;
            }
        }
        if (trackDetailsTitle) trackDetailsTitle.textContent = track.title;
        if (trackDetailsArtist) trackDetailsArtist.textContent = track.artist || track.creator_name;
        if (trackDetailsCover) trackDetailsCover.src = `${api}/fon/${track.cover}`;
        
        openModal(trackDetailsModal);
    };

    const playTrack = (track, isNew = true) => {
        const trackIndex = allMedia.findIndex(t => t.id === track.id);
        if (trackIndex !== -1) {
            currentTrackIndex = trackIndex;
        }

        if (track.type === 'video') {
            activeMediaElement = videoPlayer;
            videoPlayer.style.display = 'block';
            audioPlayer.style.display = 'none';
            videoPlayer.src = `${api}/video/${track.file}`;
            videoPlayer.poster = `${api}/fon/${track.cover}`;
            videoPlayer.play();
        } else {
            activeMediaElement = audioPlayer;
            videoPlayer.style.display = 'none';
            audioPlayer.style.display = 'block';
            audioPlayer.src = `${api}/music/${track.file}`;
            audioPlayer.play();
        }

        playerCover.src = `${api}/fon/${track.cover}`;
        playerTitle.textContent = track.title;
        playerArtist.textContent = track.artist || track.creator_name || 'Неизвестный';
        mainPlayer.classList.remove('hidden');

        // Обновление состояния кнопки "Избранное"
        if (currentUser) {
            updateFavoriteButtonState(track.file);
        }

        updatePlayPauseIcon(true);
    };

    const updatePlayPauseIcon = (isPlaying) => {
        const icon = playPauseBtn.querySelector('i');
        if (isPlaying) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        } else {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        }
    };
    
    const pauseTrack = () => {
        if (activeMediaElement) {
            activeMediaElement.pause();
            updatePlayPauseIcon(false);
        }
    };

    const resumeTrack = () => {
        if (activeMediaElement) {
            activeMediaElement.play();
            updatePlayPauseIcon(true);
        }
    };

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (activeMediaElement.paused) {
                resumeTrack();
            } else {
                pauseTrack();
            }
        });
    }

    if (skipNextBtn) {
        skipNextBtn.addEventListener('click', () => {
            if (allMedia.length === 0) return;
            currentTrackIndex = (currentTrackIndex + 1) % allMedia.length;
            playTrack(allMedia[currentTrackIndex]);
        });
    }

    if (skipPrevBtn) {
        skipPrevIndex = (currentTrackIndex - 1 + allMedia.length) % allMedia.length;
        if (skipPrevBtn) {
            skipPrevBtn.addEventListener('click', () => {
                if (allMedia.length === 0) return;
                currentTrackIndex = (currentTrackIndex - 1 + allMedia.length) % allMedia.length;
                playTrack(allMedia[currentTrackIndex]);
            });
        }
    }

    if (activeMediaElement) {
        activeMediaElement.addEventListener('timeupdate', () => {
            if (activeMediaElement.duration) {
                const progress = (activeMediaElement.currentTime / activeMediaElement.duration) * 100;
                progressBar.style.width = `${progress}%`;
                
                const currentMinutes = Math.floor(activeMediaElement.currentTime / 60);
                const currentSeconds = Math.floor(activeMediaElement.currentTime % 60);
                timeCurrent.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;
                
                const durationMinutes = Math.floor(activeMediaElement.duration / 60);
                const durationSeconds = Math.floor(activeMediaElement.duration % 60);
                timeDuration.textContent = `${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;
            }
        });
    }

    let lastUpdateTime = 0;
    activeMediaElement.addEventListener('ended', async () => {
        if (repeatMode) {
            activeMediaElement.currentTime = 0;
            activeMediaElement.play();
        } else {
            if (allMedia.length > 0) {
                currentTrackIndex = (currentTrackIndex + 1) % allMedia.length;
                playTrack(allMedia[currentTrackIndex]);
            }
        }
    });

    activeMediaElement.addEventListener('play', () => {
        const track = allMedia[currentTrackIndex];
        if (track && currentUser) {
            const currentTime = Date.now();
            if (currentTime - lastUpdateTime > 1000) {
                fetch(api + '/api/update-playback', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        trackId: track.id,
                        currentTime: activeMediaElement.currentTime,
                        duration: activeMediaElement.duration
                    })
                }).then(response => {
                    if (response.ok) {
                        lastUpdateTime = currentTime;
                    }
                });
            }
        }
    });
    
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            allMedia.sort(() => Math.random() - 0.5);
            if (currentTrackIndex !== -1) {
                const currentTrack = allMedia[currentTrackIndex];
                currentTrackIndex = allMedia.findIndex(t => t.id === currentTrack.id);
            }
            shuffleBtn.classList.toggle('active');
        });
    }

    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            repeatMode = !repeatMode;
            repeatBtn.classList.toggle('active', repeatMode);
        });
    }
    
    const showHomePage = () => {
        showView('homeView');
        setActiveNav('navHome');
        searchBarWrapper.style.display = 'block';
        updateXrecomen();
    };

    const showCategoriesPage = () => {
        showView('categoriesView');
        setActiveNav('navCategories');
        searchBarWrapper.style.display = 'none';
    };

    const showFavoritesPage = () => {
        if (!currentUser) return;
        showView('favoritesView');
        setActiveNav('navFavorites');
        searchBarWrapper.style.display = 'block';
        renderFavorites();
    };
    
    if (navHome) navHome.addEventListener('click', showHomePage);
    if (navCategories) navCategories.addEventListener('click', showCategoriesPage);
    if (navFavorites) navFavorites.addEventListener('click', showFavoritesPage);
    
    if (xmusicLogo) xmusicLogo.addEventListener('click', showHomePage);
    if (xcreatorLogo) xcreatorLogo.addEventListener('click', () => {
        showView('creatorView');
        setActiveNav('navCreator');
        searchBarWrapper.style.display = 'none';
        fetchCreatorStats();
        fetchCreatorTracks();
    });

    if (navAdmin) navAdmin.addEventListener('click', () => {
        showView('adminView');
        setActiveNav('navAdmin');
        searchBarWrapper.style.display = 'none';
        fetchAdminUsers();
        fetchModerationTracks();
        fetchAdminStats();
        fetchAdminApplications();
    });

    if (navLogin) navLogin.addEventListener('click', () => openModal(loginModal));

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const filteredMedia = allMedia.filter(track =>
                track.title.toLowerCase().includes(query) ||
                (track.artist && track.artist.toLowerCase().includes(query)) ||
                (track.creator_name && track.creator_name.toLowerCase().includes(query))
            );
            if (query === '') {
                searchResultsContainer.style.display = 'none';
                homeView.style.display = 'block';
            } else {
                searchResultsContainer.style.display = 'block';
                homeView.style.display = 'none';
                renderMediaGrid(filteredMedia, searchResultsContainer);
            }
        });
    }

    // Добавление функциональности для XCreator
    const fetchCreatorTracks = async () => {
        if (!currentUser || (currentUser.role !== 'creator' && currentUser.role !== 'admin')) return;
        try {
            const response = await fetch(api + `/api/creator/my-tracks/${currentUser.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
            });
            myTracks = await response.json();
            renderCreatorTracks(myTracks);
        } catch (error) {
            console.error('Ошибка при загрузке треков креатора:', error);
        }
    };

    const renderCreatorTracks = (tracks) => {
        if (creatorTracksTableBody) {
            creatorTracksTableBody.innerHTML = '';
            tracks.forEach(track => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${track.title}</td>
                    <td><img src="${api}/fon/${track.cover}" alt="Cover" width="50"></td>
                    <td>
                        <button class="action-btn rename-btn" data-id="${track.id}" data-title="${track.title}"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" data-id="${track.id}"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                creatorTracksTableBody.appendChild(row);
            });
            creatorTracksTableBody.querySelectorAll('.rename-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const trackId = btn.dataset.id;
                    const oldTitle = btn.dataset.title;
                    const newTitle = prompt('Введите новое название:', oldTitle);
                    if (newTitle && newTitle !== oldTitle) {
                        try {
                            const response = await fetch(api + '/api/rename', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                                },
                                body: JSON.stringify({ trackId, newTitle })
                            });
                            if (response.ok) {
                                alert('Переименовано успешно!');
                                fetchCreatorTracks();
                                fetchAndRenderAll();
                            } else {
                                const result = await response.json();
                                alert(result.message);
                            }
                        } catch (error) {
                            alert('Ошибка при переименовании.');
                        }
                    }
                });
            });
            creatorTracksTableBody.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Вы уверены, что хотите удалить этот трек?')) {
                        const trackId = btn.dataset.id;
                        try {
                            const response = await fetch(api + `/api/creator/my-tracks/${trackId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                                },
                                body: JSON.stringify({ userId: currentUser.id, userRole: currentUser.role })
                            });
                            if (response.ok) {
                                alert('Трек удален.');
                                fetchCreatorTracks();
                                fetchAndRenderAll();
                            } else {
                                const result = await response.json();
                                alert(result.message);
                            }
                        } catch (error) {
                            alert('Ошибка при удалении трека.');
                        }
                    }
                });
            });
        }
    };
    
    if (uploadMusicForm) {
        uploadMusicForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(uploadMusicForm);
            formData.append('userId', currentUser.id);

            try {
                const response = await fetch(api + '/api/moderation/upload', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` },
                    body: formData,
                });
                
                const result = await response.json();

                if (response.ok) {
                    alert(result.message);
                    uploadMusicForm.reset();
                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка загрузки файла.');
            }
        });
    }

    const fetchModerationTracks = async () => {
        if (!currentUser || currentUser.role !== 'admin') return;
        try {
            const response = await fetch(api + '/api/admin/moderation-tracks', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
            });
            moderationTracks = await response.json();
            renderModerationTracks(moderationTracks);
        } catch (error) {
            console.error('Ошибка при загрузке треков на модерацию:', error);
        }
    };
    
    const renderModerationTracks = (tracks) => {
        if (moderationTableBody) {
            moderationTableBody.innerHTML = '';
            tracks.forEach(track => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${track.title}</td>
                    <td>${track.username}</td>
                    <td>${track.type}</td>
                    <td>
                        <button class="action-btn" data-action="view" data-id="${track.id}"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" data-action="approve" data-id="${track.id}"><i class="fas fa-check"></i></button>
                        <button class="action-btn" data-action="reject" data-id="${track.id}"><i class="fas fa-times"></i></button>
                    </td>
                `;
                moderationTableBody.appendChild(row);
            });
            moderationTableBody.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => handleModerationAction(e));
            });
        }
    };

    const handleModerationAction = (e) => {
        const action = e.currentTarget.dataset.action;
        const trackId = parseInt(e.currentTarget.dataset.id);
        const track = moderationTracks.find(t => t.id === trackId);
        if (!track) return;
        
        switch (action) {
            case 'view':
                showModerationModal(track);
                break;
            case 'approve':
                approveTrack(track);
                break;
            case 'reject':
                if (confirm('Вы уверены, что хотите отклонить этот трек?')) {
                    rejectTrack(trackId);
                }
                break;
        }
    };
    
    const showModerationModal = (track) => {
        const fileUrl = `${api}/temp_uploads/${track.file_name}`;
        if (track.type === 'audio') {
            moderationPlayer.style.display = 'block';
            moderationVideoPlayer.style.display = 'none';
            moderationPlayer.src = fileUrl;
            moderationPlayer.play();
        } else if (track.type === 'video') {
            moderationVideoPlayer.style.display = 'block';
            moderationPlayer.style.display = 'none';
            moderationVideoPlayer.src = fileUrl;
            moderationVideoPlayer.play();
        }
        moderationModal.style.display = 'block';
        moderationApproveBtn.onclick = () => approveTrack(track);
        moderationRejectBtn.onclick = () => rejectTrack(track.id);
    };

    const approveTrack = async (track) => {
        try {
            const response = await fetch(api + '/api/admin/approve-track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                },
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
            if (response.ok) {
                alert('Трек одобрен.');
                closeModal(moderationModal);
                fetchModerationTracks();
                fetchAndRenderAll();
            } else {
                const result = await response.json();
                alert(result.message);
            }
        } catch (error) {
            alert('Ошибка при одобрении трека.');
        }
    };

    const rejectTrack = async (trackId) => {
        try {
            const response = await fetch(api + `/api/admin/reject-track/${trackId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
            });
            if (response.ok) {
                alert('Трек отклонен.');
                closeModal(moderationModal);
                fetchModerationTracks();
            } else {
                const result = await response.json();
                alert(result.message);
            }
        } catch (error) {
            alert('Ошибка при отклонении трека.');
        }
    };

    const fetchAdminUsers = async () => {
        if (!currentUser || currentUser.role !== 'admin') return;
        try {
            const response = await fetch(api + '/api/admin/users', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
            });
            const users = await response.json();
            renderAdminUsers(users);
        } catch (error) {
            console.error('Ошибка при загрузке пользователей:', error);
        }
    };

    const renderAdminUsers = (users) => {
        if (adminUsersTableBody) {
            adminUsersTableBody.innerHTML = '';
            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.role}</td>
                    <td>
                        <button class="action-btn" data-action="manage" data-id="${user.id}"><i class="fas fa-cog"></i></button>
                    </td>
                `;
                adminUsersTableBody.appendChild(row);
            });
            adminUsersTableBody.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => showUserModal(e.currentTarget.dataset.id));
            });
        }
    };

    const showUserModal = async (userId) => {
        const user = (await (await fetch(api + '/api/admin/users', { headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }})).json()).find(u => u.id == userId);
        if (!user) return;
        document.getElementById('userModalTitle').textContent = `Управление пользователем: ${user.username}`;
        
        changeRoleForm.querySelector('select').value = user.role;
        changeRoleForm.onsubmit = async (e) => {
            e.preventDefault();
            const newRole = changeRoleForm.querySelector('select').value;
            try {
                const response = await fetch(api + '/api/admin/update-role', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                    },
                    body: JSON.stringify({ userId: user.id, role: newRole })
                });
                if (response.ok) {
                    alert('Роль обновлена!');
                    closeModal(userModal);
                    fetchAdminUsers();
                }
            } catch (error) {
                alert('Ошибка при обновлении роли.');
            }
        };

        changePasswordForm.onsubmit = async (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPasswordInput').value;
            if (newPassword) {
                try {
                    const response = await fetch(api + '/api/admin/change-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                        },
                        body: JSON.stringify({ userId: user.id, newPassword: newPassword })
                    });
                    if (response.ok) {
                        alert('Пароль обновлен!');
                        document.getElementById('newPasswordInput').value = '';
                    } else {
                        alert('Ошибка при смене пароля.');
                    }
                } catch (error) {
                    alert('Ошибка при смене пароля.');
                }
            }
        };

        document.getElementById('deleteUserBtn').onclick = async () => {
            if (confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
                try {
                    const response = await fetch(api + `/api/admin/delete-user/${user.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
                    });
                    if (response.ok) {
                        alert('Пользователь удален.');
                        closeModal(userModal);
                        fetchAdminUsers();
                    } else {
                        alert('Ошибка при удалении пользователя.');
                    }
                } catch (error) {
                    alert('Ошибка при удалении.');
                }
            }
        };

        openModal(userModal);
    };

    const fetchAdminStats = async () => {
        if (!currentUser || currentUser.role !== 'admin') return;
        try {
            const response = await fetch(api + '/api/admin/stats', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
            });
            const stats = await response.json();
            if (adminTotalUsers) adminTotalUsers.textContent = stats.userCount;
            if (adminTotalTracks) adminTotalTracks.textContent = stats.trackCount;
        } catch (error) {
            console.error('Ошибка при загрузке статистики админа:', error);
        }
    };

    const fetchCreatorStats = async () => {
        if (!currentUser) return;
        try {
            const response = await fetch(api + `/api/creator/stats/${currentUser.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
            });
            const stats = await response.json();
            if (totalPlaysEl) totalPlaysEl.textContent = stats.totalPlays;
            renderDailyPlaysChart(stats.dailyPlays);
            renderTrackStatsTable(stats.trackStats);
        } catch (error) {
            console.error('Ошибка при загрузке статистики креатора:', error);
        }
    };

    let dailyPlaysChart = null;
    const renderDailyPlaysChart = (data) => {
        if (dailyPlaysChartCanvas) {
            const ctx = dailyPlaysChartCanvas.getContext('2d');
            const labels = data.map(d => d.date);
            const values = data.map(d => d.count);
            
            if (dailyPlaysChart) {
                dailyPlaysChart.destroy();
            }

            dailyPlaysChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Прослушивания за день',
                        data: values,
                        borderColor: '#4A90E2',
                        backgroundColor: 'rgba(74, 144, 226, 0.2)',
                        fill: true,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };

    const renderTrackStatsTable = (tracks) => {
        if (trackStatsTableBody) {
            trackStatsTableBody.innerHTML = '';
            tracks.forEach(track => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${track.title}</td>
                    <td>${track.plays}</td>
                `;
                trackStatsTableBody.appendChild(row);
            });
        }
    };
    
    // Добавление функциональности для заявок
    const fetchAdminApplications = async () => {
        if (!currentUser || currentUser.role !== 'admin') return;
        try {
            const response = await fetch(api + '/api/admin/applications', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}` }
            });
            const applications = await response.json();
            renderAdminApplications(applications);
        } catch (error) {
            console.error('Ошибка при загрузке заявок:', error);
        }
    };

    const renderAdminApplications = (applications) => {
        if (applicationsTableBody) {
            applicationsTableBody.innerHTML = '';
            applications.forEach(app => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${app.username}</td>
                    <td>${app.full_name}</td>
                    <td>${app.email}</td>
                    <td>${app.phone_number}</td>
                    <td>
                        <button class="action-btn" data-action="approve" data-user-id="${app.user_id}"><i class="fas fa-check"></i> Одобрить</button>
                        <button class="action-btn" data-action="reject" data-app-id="${app.id}"><i class="fas fa-times"></i> Отклонить</button>
                    </td>
                `;
                applicationsTableBody.appendChild(row);
            });
            applicationsTableBody.querySelectorAll('[data-action="approve"]').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Одобрить эту заявку?')) {
                        try {
                            const response = await fetch(api + '/api/admin/approve-application', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                                },
                                body: JSON.stringify({ userId: btn.dataset.userId })
                            });
                            if (response.ok) {
                                alert('Заявка одобрена.');
                                fetchAdminApplications();
                                fetchAdminUsers();
                            } else {
                                const result = await response.json();
                                alert(result.message);
                            }
                        } catch (error) {
                            alert('Ошибка при одобрении.');
                        }
                    }
                });
            });
            applicationsTableBody.querySelectorAll('[data-action="reject"]').forEach(btn => {
                btn.addEventListener('click', async () => {
                    if (confirm('Отклонить эту заявку?')) {
                        try {
                            const response = await fetch(api + '/api/admin/reject-application', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                                },
                                body: JSON.stringify({ appId: btn.dataset.appId })
                            });
                            if (response.ok) {
                                alert('Заявка отклонена.');
                                fetchAdminApplications();
                            } else {
                                const result = await response.json();
                                alert(result.message);
                            }
                        } catch (error) {
                            alert('Ошибка при отклонении.');
                        }
                    }
                });
            });
        }
    };

    if (applyForCreatorForm) {
        applyForCreatorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(applyForCreatorForm);
            const data = Object.fromEntries(formData.entries());
            data.userId = currentUser.id;

            try {
                const response = await fetch(api + '/api/apply-for-creator', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                    },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                alert(result.message);
                if (response.ok) {
                    closeModal(document.getElementById('applyForCreatorModal'));
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Ошибка при отправке заявки.');
            }
        });
    }

    if (toggleThemeBtn) {
        toggleThemeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLightTheme = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            toggleThemeBtn.innerHTML = isLightTheme ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        });
    }

    const loadThemeSetting = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            if (toggleThemeBtn) toggleThemeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.remove('light-theme');
            if (toggleThemeBtn) toggleThemeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    };

    const loadOpacitySetting = () => {
        const savedOpacity = localStorage.getItem('playerOpacity');
        if (savedOpacity) {
            document.documentElement.style.setProperty('--ui-opacity', savedOpacity);
            if (opacitySlider) opacitySlider.value = savedOpacity;
            if (opacityValue) opacityValue.textContent = Math.round(savedOpacity * 100);
        }
    };

    if (opacitySlider) {
        opacitySlider.addEventListener('input', () => {
            const opacity = opacitySlider.value;
            document.documentElement.style.setProperty('--ui-opacity', opacity);
            if (opacityValue) opacityValue.textContent = Math.round(opacity * 100);
            localStorage.setItem('playerOpacity', opacity);
        });
    }

    const updateXrecomen = async () => {
        if (!currentUser) {
            xrecomenSection.style.display = 'none';
            return;
        }
        xrecomenSection.style.display = 'block';
        try {
            const response = await fetch(api + `/api/xrecomen/${currentUser.id}`);
            const data = await response.json();
            
            renderXrecomenTrack(data.xrecomenTrack);
            renderMediaGrid(data.youLike, youLikeContainer);
            renderMediaGrid(data.youMayLike, youMayLikeContainer);
            renderLikedCollections(data.favoriteCollections);
        } catch (error) {
            console.error('Ошибка при загрузке рекомендаций:', error);
        }
    };
    
    const renderXrecomenTrack = (track) => {
        if (!track) {
            xrecomenContainer.innerHTML = '<p>Нет рекомендаций.</p>';
            return;
        }
        xrecomenContainer.innerHTML = '';
        const card = createMediaCard(track);
        card.classList.add('xrecomen-card');
        xrecomenContainer.appendChild(card);
    };

    const renderLikedCollections = (collections) => {
        likedCollectionsContainer.innerHTML = '';
        if (collections.length === 0) {
            likedCollectionsContainer.innerHTML = '<p>Вы пока не прослушивали треки из категорий.</p>';
            return;
        }
        collections.forEach(collection => {
            const card = document.createElement('div');
            card.className = 'card category-card';
            card.innerHTML = `
                <h3>${collection.name}</h3>
                <p>Треков: ${collection.track_count}</p>
            `;
            card.addEventListener('click', () => {
                showCategoryTracks(collection.id, collection.name);
            });
            likedCollectionsContainer.appendChild(card);
        });
    };
    
    const showCategoryTracks = async (categoryId, categoryName) => {
        specificCategoryView.style.display = 'block';
        homeView.style.display = 'none';
        categoriesView.style.display = 'none';
        specificCategoryName.textContent = categoryName;

        try {
            const response = await fetch(api + `/api/tracks?categoryId=${categoryId}`);
            const tracks = await response.json();
            renderMediaGrid(tracks, categoryTracksGrid);
        } catch (error) {
            console.error('Ошибка при загрузке треков категории:', error);
            categoryTracksGrid.innerHTML = '<p>Не удалось загрузить треки.</p>';
        }
    };

    if (backToCategoriesBtn) {
        backToCategoriesBtn.addEventListener('click', () => {
            specificCategoryView.style.display = 'none';
            categoriesView.style.display = 'block';
        });
    }

    // Инициализация
    const initEventListeners = () => {
        if (progressBarContainer) progressBarContainer.addEventListener('click', (e) => {
            const rect = progressBarContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            if (activeMediaElement.duration) {
                activeMediaElement.currentTime = activeMediaElement.duration * percentage;
            }
        });
    };

    loadThemeSetting();
    loadOpacitySetting();
    initEventListeners();
    fetchAndRenderAll();
    fetchCategoriesAndGenres();
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            updateUIForAuth(user);
            fetchFavorites();
            updateXrecomen();
        } catch (e) {
            console.error('Ошибка при разборе JSON из localStorage:', e);
            localStorage.removeItem('currentUser');
            updateUIForGuest();
        }
    } else {
        updateUIForGuest();
    }
});