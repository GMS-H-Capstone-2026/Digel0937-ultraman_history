// ============================================================================
// 1. Data Variables (Loaded asynchronously via Fetch API)
// ============================================================================
let ULTRAMAN_DATA = [];
let KAIJU_DATA = [];
let SONG_PLAYLIST = [];
let QUIZ_QUESTIONS = [];

// ============================================================================
// 2. Global State Management
// ============================================================================
let currentEraFilter = "all";
let currentSearchQuery = "";
let currentSortKey = "release-asc";

// Star Map Origin details database
const REGION_DATA = {
    m78: {
        name: "M78 성운 빛의 나라",
        desc: "M78 성운에 흩어진 빛나는 성간 국가이자 대다수 전통 클래식 울트라맨들이 태어나 자란 고향입니다. 중심에는 행성 전체의 에너지를 인공적으로 보충해주는 전설의 탑 '플라즈마 스파크'가 서 있으며, 은하계의 악행을 방지하는 정예 집단인 '우주경비대(Space Garrison)'의 중추 본부가 세워져 있습니다.",
        warriors: ["original", "seven", "jack", "ace", "taro", "eighty", "usa", "great", "powered", "zearth", "neos", "max", "mebius", "zero", "taiga", "z"]
    },
    o50: {
        name: "O-50 행성 (전사의 봉우리)",
        desc: "어둡고 혹독한 바람이 몰아치는 개척용 행성입니다. 깎아지른 절벽 꼭대기인 '전사의 봉우리'에 자리 잡은 고대 빛의 고리(Light Ring)에 오르는 시련을 극복하면, 선택받은 자는 융합 및 특수 카드 제어 등 혁신적인 빛의 힘을 지닌 울트라 전사의 스파크 변신 능력을 부여받게 됩니다. 대표적으로 가이(오브), 로소, 블루 등이 시련을 넘었습니다.",
        warriors: ["orb", "r-and-b"]
    },
    u40: {
        name: "U40 행성",
        desc: "빛의 나라와 더불어 또 하나의 위대한 별 문명입니다. 그리스 신전 풍의 웅장한 백색 건물과 거대 조각상들이 가득한 평화로운 자연주의 국가로, 고유 유물인 '울트라 마인드'의 축복을 받은 강건한 거인들이 모여 살고 있습니다. 대표적 전사로 애니메이션판 주역인 조니어스와 Z의 멘토 등이 있습니다.",
        warriors: ["joneus", "arc"]
    },
    earth: {
        name: "지구 (Earth)",
        desc: "수많은 우주 침략자와 고대 대괴수들이 주기적으로 깨어나 행성을 위협하는 평화 수호의 최전방이자 최대 격전지입니다. 대지의 의지를 그대로 전승받아 생명력 자체에서 탄생한 토착종 거인(가이아 등)이 태어나거나, 타락한 힘을 제어하기 위해 지구 청년의 클론 유전자 개조(지드 등)를 통해 퓨전 의지가 새로 발현되는 곳이기도 합니다.",
        warriors: ["ultra-q", "gaia", "ginga", "ginga-s", "x", "geed", "trigger", "decker", "blazar"]
    },
    l77: {
        name: "L77 성운",
        desc: "본래는 아름답고 풍요로운 성운이었으나, 사악한 우주 침략군 마그마 성인 및 괴수 군단의 무차별 기습 공습으로 행성 전체가 폭발하여 소멸하는 크나큰 참극을 겪었습니다. 이 참화 속에서 극적으로 구출 및 탈출한 황태자 레오와 아스트라 형제는 멸망한 별의 상처를 안고 우주의 전사가 되기 위해 피나는 고통을 견뎌냈습니다.",
        warriors: ["leo"]
    },
    dark: {
        name: "다크 존 (어둠의 성운)",
        desc: "빛의 에너지 조각조각마저 전부 삼켜버리는 암흑의 은하 소행성대입니다. 빛의 나라에서 영구 영토 추방 징계를 당했던 반역자 베리알이 괴수들을 세뇌하고 정복 활동의 전초 기지로 사용하기 위해 사악한 마력의 보루들을 증설했던 유해한 지옥 행성권입니다.",
        warriors: []
    },
    "neo-frontier": {
        name: "네오 프론티어 (평행우주)",
        desc: "빛의 나라 우주와는 물리 계와 시공간 차원 자체가 완전히 격리되어 있는 신비로운 고차원 우주입니다. 초고대 문명의 찬란했던 거대 인류 석상들이 수천만 년의 수면을 깨고 오늘날의 인류의 진취적 개척 정신과 공명하며, 무지갯빛 포탈과 함께 새로운 수호의 수단으로 나타납니다. 울트라맨 티가의 고향입니다.",
        warriors: ["tiga", "daina"]
    }
};

// HTML5 Real Audio Instance
const audio = new Audio();
let currentTrackIndex = 0;
let isPlaying = false;
let visualizerInterval = null;

// Quiz State
let currentQuizQuestionIndex = 0;
let quizScore = 0;

// ============================================================================
// 3. Data Loading via Fetch API (with Simulated Network Delay for UI Effect)
// ============================================================================
async function loadAllData() {
    const loadingOverlay = document.getElementById("loading-overlay");
    const startTime = Date.now();

    try {
        // Fetch all JSON files in parallel
        const [ultraRes, kaijuRes, songRes, quizRes] = await Promise.all([
            fetch('data/ultramen.json'),
            fetch('data/kaijus.json'),
            fetch('data/songs.json'),
            fetch('data/quizzes.json')
        ]);

        if (!ultraRes.ok || !kaijuRes.ok || !songRes.ok || !quizRes.ok) {
            throw new Error('데이터베이스 응답 오류가 발생했습니다.');
        }

        ULTRAMAN_DATA = await ultraRes.json();
        KAIJU_DATA = await kaijuRes.json();
        SONG_PLAYLIST = await songRes.json();
        QUIZ_QUESTIONS = await quizRes.json();

        // 인위적인 지연(최소 1초)을 걸어 로딩 연출이 자연스럽게 보이도록 함
        const elapsedTime = Date.now() - startTime;
        const minimumDelay = 1000;
        if (elapsedTime < minimumDelay) {
            await new Promise(resolve => setTimeout(resolve, minimumDelay - elapsedTime));
        }

        // Initialize Rendering and Components
        renderUltramen();
        renderKaijus();
        initProfileViewer();
        initStarMap();
        initMusicPlayer();
        initQuizGame();
        initNavigation();
        bindEventHandlers();

        // 7. Initial Initialize for star map
        const defaultNode = document.querySelector('[data-origin="m78"]');
        if (defaultNode) {
            defaultNode.dispatchEvent(new Event("click"));
        }

    } catch (error) {
        console.error('M78 Database Sync Error:', error);
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = '❌ 데이터베이스 동기화 실패. 새로고침을 해주세요.';
            loadingText.style.color = '#ff3838';
        }
        return; // Initialize 중단
    } finally {
        if (loadingOverlay) {
            loadingOverlay.classList.add('fade-out');
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        }
    }
}

// ============================================================================
// 4. UI Component Renderer Functions
// ============================================================================

// Render Ultraman Cards
function renderUltramen() {
    const grid = document.getElementById("ultraman-grid");
    if (!grid) return;

    // Filter
    let filteredList = ULTRAMAN_DATA.filter(ultra => {
        const matchesEra = currentEraFilter === "all" || ultra.era === currentEraFilter;
        const matchesSearch = ultra.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                             ultra.transformHost.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                             ultra.englishName.toLowerCase().includes(currentSearchQuery.toLowerCase());
        return matchesEra && matchesSearch;
    });

    // Sort
    filteredList.sort((a, b) => {
        if (currentSortKey === "release-asc") {
            return a.year - b.year;
        } else if (currentSortKey === "release-desc") {
            return b.year - a.year;
        } else if (currentSortKey === "height-desc") {
            const heightA = parseInt(a.height) || 0;
            const heightB = parseInt(b.height) || 0;
            return heightB - heightA;
        } else if (currentSortKey === "speed-desc") {
            // Speed parser (ex: "마하 5" -> 5)
            const speedA = parseFloat(a.speed.replace(/[^0-9.]/g, '')) || 0;
            const speedB = parseFloat(b.speed.replace(/[^0-9.]/g, '')) || 0;
            return speedB - speedA;
        }
        return 0;
    });

    // Clear and Append
    grid.innerHTML = "";
    if (filteredList.length === 0) {
        grid.innerHTML = `<div class="no-results glass-panel" style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--color-text-secondary);">검색 결과에 맞는 빛의 전사가 데이터베이스에 없습니다.</div>`;
        return;
    }

    filteredList.forEach(ultra => {
        const card = document.createElement("div");
        card.className = "ultra-card";
        card.setAttribute("data-theme", ultra.theme);
        
        // Use background image if available, else fallback gradient
        if (ultra.image) {
            card.style.backgroundImage = `linear-gradient(0deg, rgba(8, 9, 13, 0.95) 0%, rgba(8, 9, 13, 0.4) 50%, rgba(8, 9, 13, 0.1) 100%), url('${ultra.image}')`;
        } else {
            card.style.backgroundImage = `linear-gradient(135deg, rgba(15,18,32,0.85) 0%, rgba(20,25,45,0.95) 100%)`;
        }

        // Inner markup
        card.innerHTML = `
            ${!ultra.image ? `<div class="card-bg-fallback">${ultra.name[0]}</div>` : ''}
            <span class="card-tag theme-${ultra.theme}">${ultra.eraKo}</span>
            <div class="card-content">
                <h3 class="card-title">${ultra.name}</h3>
                <p class="card-subtitle">${ultra.subtitle}</p>
                <div class="card-specs">
                    <span>신장: <strong>${ultra.height}</strong></span>
                    <span>방영: <strong>${ultra.year}년</strong></span>
                </div>
            </div>
        `;

        // Click Event to open details modal
        card.addEventListener("click", () => openDetailsModal(ultra.id));
        grid.appendChild(card);
    });
}

// Render Kaijus with background images
function renderKaijus() {
    const grid = document.getElementById("kaiju-grid");
    if (!grid) return;

    grid.innerHTML = "";
    KAIJU_DATA.forEach(kaiju => {
        const card = document.createElement("div");
        card.className = "kaiju-card glass-panel";
        
        let bgStyle = "";
        if (kaiju.image) {
            bgStyle = `style="background-image: url('${kaiju.image}');"`;
        }

        card.innerHTML = `
            <div class="kaiju-card-bg" ${bgStyle}></div>
            <span class="kaiju-tag">${kaiju.type}</span>
            ${!kaiju.image ? `<div class="card-bg-fallback" style="opacity: 0.1; font-size: 6rem; z-index:0;">👾</div>` : ''}
            <div class="kaiju-content">
                <h3 class="kaiju-title">${kaiju.name}</h3>
                <p class="kaiju-type">신장: ${kaiju.height} | 체중: ${kaiju.weight} | 출신: ${kaiju.origin}</p>
                <p class="kaiju-desc">${kaiju.desc}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Modal Display Controller
function openDetailsModal(id) {
    const modal = document.getElementById("details-modal");
    const ultra = ULTRAMAN_DATA.find(u => u.id === id);
    if (!modal || !ultra) return;

    // Fill details
    document.getElementById("modal-img").src = ultra.image || 'images/space_bg.jpg';
    document.getElementById("modal-img").alt = ultra.name;
    document.getElementById("modal-era").textContent = `${ultra.eraKo} (${ultra.year}년 데뷔)`;
    document.getElementById("modal-title").textContent = ultra.name;
    document.getElementById("modal-subtitle").textContent = ultra.subtitle;
    document.getElementById("modal-height").textContent = ultra.height;
    document.getElementById("modal-weight").textContent = ultra.weight;
    document.getElementById("modal-speed").textContent = ultra.speed;
    document.getElementById("modal-origin").textContent = ultra.originKo;
    document.getElementById("modal-transform-info").textContent = ultra.transformHost;
    document.getElementById("modal-skills").textContent = ultra.signatureMove;
    document.getElementById("modal-description").textContent = ultra.description;

    // Adjust theme color overlay glow
    const glowDiv = document.getElementById("modal-glow-theme");
    let glowColor = "rgba(0, 210, 255, 0.4)";
    if (ultra.theme === "red") glowColor = "rgba(255, 56, 56, 0.4)";
    if (ultra.theme === "purple") glowColor = "rgba(157, 78, 221, 0.4)";
    if (ultra.theme === "gold") glowColor = "rgba(255, 183, 3, 0.4)";
    glowDiv.style.boxShadow = `inset 0 0 50px ${glowColor}, 0 0 30px ${glowColor}`;

    // Open overlay
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // disable body scrolling
}

function closeDetailsModal() {
    const modal = document.getElementById("details-modal");
    if (!modal) return;
    modal.classList.remove("open");
    document.body.style.overflow = ""; // enable body scrolling
}

// ============================================================================
// 4.5 Profile Viewer Component (프로필 도감)
// ============================================================================
function initProfileViewer() {
    const listContainer = document.getElementById("profile-list");
    const detailContainer = document.getElementById("profile-detail");
    const searchInput = document.getElementById("profile-search-input");
    const chipButtons = document.querySelectorAll(".profile-chip");

    if (!listContainer || !detailContainer) return;

    let profileFilter = "all";
    let profileSearch = "";
    let selectedId = null;

    function renderProfileList() {
        let filtered = ULTRAMAN_DATA.filter(u => {
            const matchEra = profileFilter === "all" || u.era === profileFilter;
            const matchSearch = u.name.toLowerCase().includes(profileSearch.toLowerCase()) ||
                                (u.englishName && u.englishName.toLowerCase().includes(profileSearch.toLowerCase()));
            return matchEra && matchSearch;
        });

        // Sort by year ascending
        filtered.sort((a, b) => a.year - b.year);

        listContainer.innerHTML = "";

        if (filtered.length === 0) {
            listContainer.innerHTML = `<div class="profile-list-empty">검색 결과가 없습니다.</div>`;
            return;
        }

        filtered.forEach(ultra => {
            const item = document.createElement("div");
            item.className = `profile-list-item${ultra.id === selectedId ? ' active' : ''}`;
            item.setAttribute("data-theme", ultra.theme);

            const thumbContent = ultra.image
                ? `<img src="${ultra.image}" alt="${ultra.name}" loading="lazy">`
                : `<span class="thumb-fallback">${ultra.name[0]}</span>`;

            item.innerHTML = `
                <div class="profile-list-thumb">${thumbContent}</div>
                <div class="profile-list-info">
                    <div class="profile-list-name">${ultra.name}</div>
                    <div class="profile-list-era">${ultra.eraKo} · ${ultra.year}년</div>
                </div>
            `;

            item.addEventListener("click", () => {
                selectedId = ultra.id;
                renderProfileList(); // re-render for active state
                renderProfileDetail(ultra);
            });

            listContainer.appendChild(item);
        });
    }

    function renderProfileDetail(ultra) {
        const tagClass = `tag-${ultra.theme}`;
        const glowClass = `glow-${ultra.theme}`;

        const heroImgSrc = ultra.image || 'images/space_bg.jpg';

        detailContainer.innerHTML = `
            <div class="profile-card-glow-line ${glowClass}"></div>
            <div class="profile-card">
                <div class="profile-card-hero">
                    <img class="profile-card-hero-img" src="${heroImgSrc}" alt="${ultra.name}" loading="lazy">
                    <div class="profile-card-hero-overlay"></div>
                    <span class="profile-card-hero-tag ${tagClass}">${ultra.eraKo}</span>
                    <div class="profile-card-hero-name">
                        <h2>${ultra.name}</h2>
                        <p>${ultra.subtitle}</p>
                    </div>
                    <div class="profile-card-hero-year">${ultra.year}</div>
                </div>

                <div class="profile-card-body">
                    <div class="profile-stats-grid">
                        <div class="profile-stat-item">
                            <div class="profile-stat-label">신장</div>
                            <div class="profile-stat-value">${ultra.height}</div>
                        </div>
                        <div class="profile-stat-item">
                            <div class="profile-stat-label">체중</div>
                            <div class="profile-stat-value">${ultra.weight}</div>
                        </div>
                        <div class="profile-stat-item">
                            <div class="profile-stat-label">비행 속도</div>
                            <div class="profile-stat-value">${ultra.speed}</div>
                        </div>
                        <div class="profile-stat-item">
                            <div class="profile-stat-label">출신지</div>
                            <div class="profile-stat-value">${ultra.originKo}</div>
                        </div>
                    </div>

                    <div class="profile-info-row">
                        <div class="profile-info-block">
                            <h4>변신 도구 & 인간체</h4>
                            <p>${ultra.transformHost}</p>
                        </div>
                        <div class="profile-info-block">
                            <h4>시그니처 기술</h4>
                            <p>${ultra.signatureMove}</p>
                        </div>
                    </div>

                    <div class="profile-desc-block">
                        <h4>상세 해설 & 역사적 의의</h4>
                        <p>${ultra.description}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Event Bindings
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            profileSearch = e.target.value.trim();
            renderProfileList();
        });
    }

    chipButtons.forEach(chip => {
        chip.addEventListener("click", () => {
            chipButtons.forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            profileFilter = chip.getAttribute("data-filter");
            renderProfileList();
        });
    });

    // Initial render
    renderProfileList();
}

// Star Map Selection Engine
function initStarMap() {
    const nodes = document.querySelectorAll(".map-node");
    const regionTitle = document.getElementById("map-region-name");
    const regionDesc = document.getElementById("map-region-desc");
    const relatedList = document.getElementById("map-related-warriors");

    nodes.forEach(node => {
        node.addEventListener("click", () => {
            // Remove active from others
            nodes.forEach(n => n.classList.remove("selected"));
            node.classList.add("selected");

            const originKey = node.getAttribute("data-origin");
            const region = REGION_DATA[originKey];
            if (!region) return;

            // Update Text info
            regionTitle.textContent = region.name;
            regionDesc.textContent = region.desc;

            // Related Warriors buttons list
            relatedList.innerHTML = "";
            if (region.warriors.length === 0) {
                relatedList.innerHTML = `<span style="font-size:0.8rem; color:var(--color-text-muted);">이 성운/구역에 지정된 아군 정규 대원이 확인되지 않습니다.</span>`;
                return;
            }

            region.warriors.forEach(warriorId => {
                const warrior = ULTRAMAN_DATA.find(u => u.id === warriorId);
                if (!warrior) return;

                const btn = document.createElement("button");
                btn.className = "warrior-btn";
                btn.textContent = warrior.name;
                btn.addEventListener("click", () => openDetailsModal(warriorId));
                relatedList.appendChild(btn);
            });
        });
    });
}

// ============================================================================
// 5. Music Player Simulation Component (Real Audio Integration)
// ============================================================================
function formatTime(secs) {
    if (isNaN(secs) || secs === Infinity) return "0:00";
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
}

function initMusicPlayer() {
    const playlistContainer = document.getElementById("playlist");
    const playBtn = document.getElementById("btn-play");
    const prevBtn = document.getElementById("btn-prev");
    const nextBtn = document.getElementById("btn-next");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    
    const disk = document.getElementById("vinyl-disc");
    const diskTitle = document.getElementById("player-disk-title");
    const trackTitle = document.getElementById("player-track-title");
    const trackArtist = document.getElementById("player-track-artist");
    
    const currentTimeText = document.getElementById("current-time");
    const totalTimeText = document.getElementById("total-time");
    const progressBarFill = document.getElementById("progress-bar-fill");
    const progressBarBg = document.getElementById("progress-bar-bg");

    // Render playlist
    playlistContainer.innerHTML = "";
    SONG_PLAYLIST.forEach((song, idx) => {
        const item = document.createElement("div");
        item.className = `playlist-item ${idx === currentTrackIndex ? 'active' : ''}`;
        item.innerHTML = `
            <div class="track-info">
                <span class="item-title">${song.title}</span>
                <span class="item-desc">${song.artist}</span>
            </div>
            <span class="track-duration">음악 파일</span>
        `;
        item.addEventListener("click", () => {
            selectTrack(idx);
        });
        playlistContainer.appendChild(item);
    });

    // Real Audio Event bindings
    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        
        // Progress display
        currentTimeText.textContent = formatTime(audio.currentTime);
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBarFill.style.width = `${pct}%`;
    });

    audio.addEventListener("loadedmetadata", () => {
        totalTimeText.textContent = formatTime(audio.duration);
    });

    audio.addEventListener("ended", () => {
        // Auto-next
        let nextIdx = (currentTrackIndex + 1) % SONG_PLAYLIST.length;
        selectTrack(nextIdx);
    });

    function selectTrack(index) {
        currentTrackIndex = index;
        const song = SONG_PLAYLIST[currentTrackIndex];
        
        // Load Source
        audio.src = song.file;
        audio.load();

        // Update list styles
        const items = playlistContainer.querySelectorAll(".playlist-item");
        items.forEach((item, idx) => {
            if (idx === currentTrackIndex) item.classList.add("active");
            else item.classList.remove("active");
        });

        // Update titles
        trackTitle.textContent = song.title;
        trackArtist.textContent = song.artist;
        diskTitle.textContent = song.title.substring(0, 8) + "..";

        if (isPlaying) {
            audio.play().then(() => {
                startVisualizerAnimation();
            }).catch(err => {
                console.log("Play failed: ", err);
                togglePlay(); // pause UI state on error
            });
        } else {
            audio.addEventListener('loadedmetadata', () => {
                totalTimeText.textContent = formatTime(audio.duration);
            }, { once: true });
        }
    }

    function togglePlay() {
        if (isPlaying) {
            // Pause
            audio.pause();
            isPlaying = false;
            playIcon.style.display = "block";
            pauseIcon.style.display = "none";
            disk.classList.remove("playing");
            clearInterval(visualizerInterval);
            resetVisualizer();
        } else {
            // Play
            audio.play().then(() => {
                isPlaying = true;
                playIcon.style.display = "none";
                pauseIcon.style.display = "block";
                disk.classList.add("playing");
                startVisualizerAnimation();
            }).catch(err => {
                console.log("Autoplay blocked or play failed:", err);
            });
        }
    }

    function startVisualizerAnimation() {
        clearInterval(visualizerInterval);
        visualizerInterval = setInterval(() => {
            if (!isPlaying) return;
            const bars = document.querySelectorAll("#visualizer .bar");
            bars.forEach(bar => {
                const randomHeight = Math.floor(Math.random() * 85) + 15;
                bar.style.height = `${randomHeight}%`;
            });
        }, 100);
    }

    function resetVisualizer() {
        const bars = document.querySelectorAll("#visualizer .bar");
        bars.forEach(bar => {
            bar.style.height = `8px`;
        });
    }

    // Progress bar seeking
    progressBarBg.addEventListener("click", (e) => {
        const rect = progressBarBg.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = clickX / rect.width;
        if (audio.duration) {
            audio.currentTime = pct * audio.duration;
        }
    });

    // Control events
    playBtn.addEventListener("click", togglePlay);
    prevBtn.addEventListener("click", () => {
        let prevIdx = currentTrackIndex - 1;
        if (prevIdx < 0) prevIdx = SONG_PLAYLIST.length - 1;
        selectTrack(prevIdx);
    });
    nextBtn.addEventListener("click", () => {
        let nextIdx = (currentTrackIndex + 1) % SONG_PLAYLIST.length;
        selectTrack(nextIdx);
    });

    // Header Sound button sync
    const headerSoundBtn = document.getElementById("header-sound-btn");
    if (headerSoundBtn) {
        headerSoundBtn.addEventListener("click", () => {
            togglePlay();
        });
    }

    // Initialize initial track displays
    selectTrack(0);
}

// ============================================================================
// 6. Trivia Quiz Game Component
// ============================================================================
function initQuizGame() {
    const startView = document.getElementById("quiz-start-view");
    const activeView = document.getElementById("quiz-active-view");
    const resultView = document.getElementById("quiz-result-view");

    const startBtn = document.getElementById("btn-quiz-start");
    const retryBtn = document.getElementById("btn-quiz-retry");
    const currentNumText = document.getElementById("quiz-current-num");
    const questionText = document.getElementById("quiz-question");
    const optionsContainer = document.getElementById("quiz-options");
    const progressFill = document.getElementById("quiz-progress-fill");

    const badgeIcon = document.getElementById("quiz-badge-icon");
    const resultTitle = document.getElementById("quiz-result-title");
    const resultScore = document.getElementById("quiz-result-score");
    const resultDesc = document.getElementById("quiz-result-desc");

    let timerSec = 15;
    let quizInterval = null;
    const timerText = document.getElementById("quiz-timer");

    startBtn.addEventListener("click", startQuiz);
    retryBtn.addEventListener("click", startQuiz);

    function startQuiz() {
        currentQuizQuestionIndex = 0;
        quizScore = 0;
        startView.style.display = "none";
        resultView.style.display = "none";
        activeView.style.display = "block";
        loadQuestion();
    }

    function startTimer() {
        clearInterval(quizInterval);
        timerSec = 15;
        timerText.textContent = `남은 시간: ${timerSec}초`;
        timerText.style.color = "var(--color-text-secondary)";

        quizInterval = setInterval(() => {
            timerSec--;
            timerText.textContent = `남은 시간: ${timerSec}초`;
            
            if (timerSec <= 5) {
                timerText.style.color = "var(--color-ultra-red)";
            }

            if (timerSec <= 0) {
                clearInterval(quizInterval);
                handleTimeout();
            }
        }, 1000);
    }

    function handleTimeout() {
        // Disable choices
        const buttons = optionsContainer.querySelectorAll(".quiz-option-btn");
        buttons.forEach(btn => btn.disabled = true);

        // Highlight correct
        const correctIdx = QUIZ_QUESTIONS[currentQuizQuestionIndex].correctIndex;
        buttons[correctIdx].classList.add("correct");

        // Delay to next question
        setTimeout(nextQuestion, 1500);
    }

    function loadQuestion() {
        if (currentQuizQuestionIndex >= QUIZ_QUESTIONS.length) {
            showResults();
            return;
        }

        startTimer();

        const qData = QUIZ_QUESTIONS[currentQuizQuestionIndex];
        currentNumText.textContent = `문제 ${currentQuizQuestionIndex + 1}/${QUIZ_QUESTIONS.length}`;
        questionText.textContent = qData.question;
        
        // Progress fill percent
        const pct = ((currentQuizQuestionIndex) / QUIZ_QUESTIONS.length) * 100;
        progressFill.style.width = `${pct}%`;

        optionsContainer.innerHTML = "";
        qData.options.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.className = "quiz-option-btn";
            btn.textContent = opt;
            btn.addEventListener("click", () => selectOption(idx));
            optionsContainer.appendChild(btn);
        });
    }

    function selectOption(selectedIndex) {
        clearInterval(quizInterval);
        const qData = QUIZ_QUESTIONS[currentQuizQuestionIndex];
        const buttons = optionsContainer.querySelectorAll(".quiz-option-btn");

        buttons.forEach(btn => btn.disabled = true);

        if (selectedIndex === qData.correctIndex) {
            buttons[selectedIndex].classList.add("correct");
            quizScore++;
        } else {
            buttons[selectedIndex].classList.add("incorrect");
            buttons[qData.correctIndex].classList.add("correct");
        }

        setTimeout(nextQuestion, 1500);
    }

    function nextQuestion() {
        currentQuizQuestionIndex++;
        loadQuestion();
    }

    function showResults() {
        activeView.style.display = "none";
        resultView.style.display = "block";
        progressFill.style.width = "100%";

        resultScore.textContent = `최종 점수: ${quizScore} / ${QUIZ_QUESTIONS.length}`;

        // Compute badge criteria
        if (quizScore === 5) {
            badgeIcon.textContent = "🎖️";
            resultTitle.textContent = "우주경비대 사령관 (S등급)";
            resultDesc.textContent = "완벽한 성적입니다! 은하계의 지배자 괴수들과 역사에 관한 모든 데이터가 당신의 머릿속에 축적되어 있군요. 오늘부로 우주경비대 일선 사령관 자격을 부여합니다.";
        } else if (quizScore >= 3) {
            badgeIcon.textContent = "🛡️";
            resultTitle.textContent = "정예 울트라 전사 (A등급)";
            resultDesc.textContent = "매우 우수한 성적입니다! 대다수 울트라맨의 특징과 변신체, 전투 기법을 정확하게 숙지하고 있습니다. 지구 평화를 책임질 믿음직한 수호자입니다.";
        } else if (quizScore >= 1) {
            badgeIcon.textContent = "🔰";
            resultTitle.textContent = "빛의 나라 훈련생 (B등급)";
            resultDesc.textContent = "기초적인 지식을 충족하고 있으나 아직 수련이 조금 더 필요합니다. 우주성도와 역사박물관 도감을 정독하여 더욱 훌륭한 빛의 전사로 거듭나세요.";
        } else {
            badgeIcon.textContent = "👾";
            resultTitle.textContent = "괴수 우주닌자 (D등급)";
            resultDesc.textContent = "울트라 지식이 거의 소실된 상태이거나 괴수 발탄성인 편에 입대한 것이 분명합니다! 박물관의 도감을 찬찬히 살펴보신 뒤 퀴즈에 재도전해 보시기 바랍니다.";
        }
    }
}

// ============================================================================
// 7. Navigation and Scroll Interactions
// ============================================================================
function initNavigation() {
    const header = document.getElementById("header");
    const navLinks = document.querySelectorAll(".nav-links a");
    const sections = document.querySelectorAll("section");

    // Header shadow on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Active GNB Link highlight on scroll position
        let currentSectionId = "hero";
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            const bottom = top + section.offsetHeight;
            if (window.scrollY >= top && window.scrollY < bottom) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });
}

// ============================================================================
// 8. Event Handler Binding Engine
// ============================================================================
function bindEventHandlers() {
    // Timeline Filter tabs binding
    const filterTabs = document.querySelectorAll(".era-tab");
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentEraFilter = tab.getAttribute("data-era");
            renderUltramen();
        });
    });

    // Search bar input binding
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            currentSearchQuery = e.target.value.trim();
            renderUltramen();
        });
    }

    // Sorting select box binding
    const sortSelect = document.getElementById("sort-select");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            currentSortKey = e.target.value;
            renderUltramen();
        });
    }

    // Modal close overlay and button bindings
    const closeBtn = document.getElementById("modal-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", closeDetailsModal);
    }
    const modalOverlay = document.getElementById("details-modal");
    if (modalOverlay) {
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                closeDetailsModal();
            }
        });
    }
}

// ============================================================================
// 9. Initial Entry Point (DOM Content Loaded)
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Start Loading & Sync Data
    loadAllData();
});
