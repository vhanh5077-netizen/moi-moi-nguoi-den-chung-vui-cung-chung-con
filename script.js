const SUPABASE_URL = "https://jolesyobqmxwxcctieuo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_rbSUTZtvkTOhj7sAxMY5lw_teXG4RpP";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
// =========================================
// 🏆 BẢNG THÀNH TÍCH GAME 1
// =========================================

async function loadHeartLeaderboard() {

    const leaderboard =
        document.getElementById("heartLeaderboardList");

    if (!leaderboard) {
        return;
    }

    leaderboard.innerHTML = `
        <div class="heart-leaderboard-loading">
            Đang tải thành tích... 💕
        </div>
    `;

    try {

        const { data, error } =
            await supabaseClient
                .from("heart_game_scores")
                .select("player_name, score, played_at")
                .order("score", {
                    ascending: false
                })
                .limit(50);


        if (error) {

            console.error(
                "Lỗi tải bảng thành tích:",
                error
            );

            leaderboard.innerHTML = `
                <div class="heart-leaderboard-empty">
                    Không thể tải bảng thành tích 💕
                </div>
            `;

            return;
        }


        if (!data || data.length === 0) {

            leaderboard.innerHTML = `
                <div class="heart-leaderboard-empty">
                    Chưa có ai chơi game.<br>
                    Hãy trở thành người đầu tiên nhé! ❤️
                </div>
            `;

            return;
        }


        leaderboard.innerHTML = "";


        data.forEach(function (player, index) {

            const rank = index + 1;


            let rankDisplay = rank;


            if (rank === 1) {
                rankDisplay = "🥇";
            }

            else if (rank === 2) {
                rankDisplay = "🥈";
            }

            else if (rank === 3) {
                rankDisplay = "🥉";
            }


            const item =
                document.createElement("div");


            item.className =
                "heart-rank-item rank-" + rank;


            item.innerHTML = `

                <div class="heart-rank-number">
                    ${rankDisplay}
                </div>

                <div class="heart-rank-name">
                    ${escapeHTML(player.player_name)}
                </div>

                <div class="heart-rank-score">
                    ${Number(player.score) || 0} điểm
                </div>

            `;


            leaderboard.appendChild(item);

        });


    } catch (error) {

        console.error(
            "Lỗi bảng thành tích:",
            error
        );

        leaderboard.innerHTML = `
            <div class="heart-leaderboard-empty">
                Có lỗi khi tải thành tích ❤️
            </div>
        `;
    }
}


// =========================================
// 🔄 TỰ ĐỘNG CẬP NHẬT BẢNG THÀNH TÍCH
// =========================================

function setupHeartLeaderboardRealtime() {

    supabaseClient
        .channel("heart-game-leaderboard")
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "heart_game_scores"
            },
            function () {

                loadHeartLeaderboard();

            }
        )
        .subscribe();

}

// =========================================
// MỞ THIỆP
// =========================================

function openInvitation() {

    // Hoa bung ra
    createOpeningFlowers();

    // Ẩn phong thư
    const opening = document.getElementById("opening");

    if (opening) {
        opening.style.display = "none";
    }

    // Hiện nội dung
    const invitation = document.getElementById("invitation");

    if (invitation) {
        invitation.style.display = "block";
    }

    // Về đầu trang
    window.scrollTo(0, 0);

    // Bật nhạc
    const music = document.getElementById("weddingMusic");
    const musicButton = document.getElementById("musicButton");

    if (music) {

        music.play().then(() => {

            if (musicButton) {
                musicButton.classList.add("playing");
            }

        }).catch(() => {

            console.log("Trình duyệt không cho tự động phát nhạc.");

        });
    }

    // Kích hoạt hiệu ứng
    setupScrollReveal();

    // Bắt đầu tự cuộn sau 1 giây
    setTimeout(function () {
        autoScrollWedding();
    }, 1000);
}

// =========================================
// TỰ ĐỘNG CUỘN
// =========================================

let autoScrollTimer = null;
let autoScrollStopped = false;


// =========================================
// BẮT ĐẦU TỰ ĐỘNG CUỘN
// =========================================

function autoScrollWedding() {

    // Nếu khách đã vuốt thì không chạy lại
    if (autoScrollStopped) {
        return;
    }

    if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
    }

    document.documentElement.style.overflowY = "auto";
    document.body.style.overflowY = "auto";

    autoScrollTimer = setInterval(function () {

        // Nếu khách đã vuốt thì dừng
        if (autoScrollStopped) {

            clearInterval(autoScrollTimer);
            autoScrollTimer = null;

            return;
        }

        const currentPosition = window.scrollY;

        const maxPosition =
            document.documentElement.scrollHeight -
            window.innerHeight;


        // Chưa đến cuối
        if (currentPosition < maxPosition) {

            window.scrollBy(0, 1);

        } else {

            // Đã đến cuối
            clearInterval(autoScrollTimer);

            autoScrollTimer = null;

            console.log("Đã chạy hết thiệp ❤️");
        }

    }, 20);
}


// =========================================
// DỪNG KHI KHÁCH THỰC SỰ VUỐT
// =========================================

function stopAutoScroll() {

    autoScrollStopped = true;

    if (autoScrollTimer) {

        clearInterval(autoScrollTimer);

        autoScrollTimer = null;
    }
}


// =========================================
// VUỐT BẰNG CHUỘT
// =========================================

window.addEventListener(
    "wheel",
    function () {
        stopAutoScroll();
    },
    { passive: true }
);


// =========================================
// VUỐT TRÊN ĐIỆN THOẠI
// =========================================

let touchStartY = 0;

window.addEventListener(
    "touchstart",
    function (event) {

        touchStartY = event.touches[0].clientY;

    },
    { passive: true }
);


window.addEventListener(
    "touchmove",
    function (event) {

        const currentY = event.touches[0].clientY;

        const difference =
            Math.abs(currentY - touchStartY);

        // Chỉ dừng khi thực sự vuốt
        if (difference > 10) {

            stopAutoScroll();

        }

    },
    { passive: true }
);



// =========================================
// HIỆU ỨNG BAY VÀO KHI CUỘN
// =========================================

function setupScrollReveal() {

    // Các nhóm nội dung
    const sections = document.querySelectorAll(
        ".section, .couple-photo-section, .family-section, .wedding-gift, .photo-gallery, .new-photo-section, .location, .closing"
    );

    sections.forEach(function (section) {

        // Tiêu đề
        const titles = section.querySelectorAll(
            "h1, h2, h3, .small-text, .date-title, .date-subtitle, .gift-title, .gallery-title, .new-photo-title"
        );

        titles.forEach(function (element) {

            element.classList.add("scroll-title");

        });


        // Đoạn văn
        const texts = section.querySelectorAll(
            "p:not(.small-text):not(.date-title):not(.gift-title)"
        );

        texts.forEach(function (element) {

            element.classList.add("scroll-text");

        });


        // Ảnh
        const images = section.querySelectorAll("img");

        images.forEach(function (image) {

            image.classList.add("scroll-image");

        });


        // QR
        const qr = section.querySelectorAll(
            ".qr-card, .qr-heart"
        );

        qr.forEach(function (element) {

            element.classList.add("scroll-qr");

        });
    });


    // Observer theo dõi vị trí trên màn hình
    const observer = new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },

        {
            threshold: 0.15
        }

    );


    // Theo dõi tất cả phần tử hiệu ứng
    const revealElements = document.querySelectorAll(
        ".scroll-title, .scroll-text, .scroll-image, .scroll-qr"
    );

    revealElements.forEach(function (element) {

        observer.observe(element);

    });
}


// =========================================
// HOA BUNG KHI MỞ THIỆP
// =========================================

function createOpeningFlowers() {

    const flowers = [
        "🌸",
        "🌷",
        "🌼",
        "🌺",
        "✿",
        "❀",
        "🌸",
        "🌷",
        "🌼",
        "✿",
        "❀",
        "🌺"
    ];

    flowers.forEach(function (flowerType, index) {

        const flower = document.createElement("span");

        flower.className = "opening-flower";

        flower.innerHTML = flowerType;

        flower.style.left = "50%";
        flower.style.top = "50%";

        const angle =
            (index / flowers.length) * Math.PI * 2;

        const distance =
            150 + Math.random() * 220;

        const x =
            Math.cos(angle) * distance;

        const y =
            Math.sin(angle) * distance;

        flower.style.setProperty(
            "--x",
            x + "px"
        );

        flower.style.setProperty(
            "--y",
            y + "px"
        );

        flower.style.setProperty(
            "--rotate",
            (Math.random() * 720 - 360) + "deg"
        );

        flower.style.animationDelay =
            (Math.random() * 0.15) + "s";

        document.body.appendChild(flower);

        setTimeout(function () {

            flower.remove();

        }, 1800);

    });
}


// =========================================
// BẬT / TẮT NHẠC
// =========================================

function toggleMusic() {

    const music = document.getElementById("weddingMusic");

    const button = document.getElementById("musicButton");

    if (!music || !button) return;

    if (music.paused) {

        music.play();

        button.classList.add("playing");

    } else {

        music.pause();

        button.classList.remove("playing");

    }
}
// HIỂN THỊ LỜI CHÚC
function addWishToList(wish) {
    const wishList = document.getElementById("wishList");

    const wishItem = document.createElement("div");
wishItem.className = "wish-item";
wishItem.setAttribute("data-wish-id", wish.id);
    wishItem.innerHTML = `
        <div class="wish-heart">♡</div>
        <div>
            <h3>${escapeHTML(wish.name)}</h3>
            <p>${escapeHTML(wish.message)}</p>
        </div>
    `;

    wishList.prepend(wishItem);
}


// GỬI LỜI CHÚC LÊN SUPABASE
async function sendWish() {
    const nameInput = document.getElementById("wishName");
    const messageInput = document.getElementById("wishMessage");

    const name = nameInput.value.trim();
    const message = messageInput.value.trim();

    if (!name) {
        alert("Bạn hãy nhập tên nhé ❤️");
        nameInput.focus();
        return;
    }

    if (!message) {
        alert("Bạn hãy viết lời chúc nhé ❤️");
        messageInput.focus();
        return;
    }

    const { data, error } = await supabaseClient
        .from("wishes")
        .insert([
            {
                name: name,
                message: message
            }
        ])
        .select()
        .single();

    if (error) {
        console.error("Lỗi gửi lời chúc:", error);
        alert("Không gửi được lời chúc. Bạn thử lại nhé ❤️");
        return;
    }

    addWishToList(data);

    nameInput.value = "";
    messageInput.value = "";

    alert("Đã gửi lời chúc đến cô dâu và chú rể ❤️");
}


// LẤY CÁC LỜI CHÚC ĐÃ CÓ
async function loadWishes() {
    const wishList = document.getElementById("wishList");

    const { data, error } = await supabaseClient
        .from("wishes")
        .select("id, name, message, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Lỗi tải lời chúc:", error);
        return;
    }

    wishList.innerHTML = "";

    if (!data || data.length === 0) {
        wishList.innerHTML = `
            <div class="wish-item">
                <div class="wish-heart">♡</div>
                <div>
                    <h3>Gia đình & Bạn bè</h3>
                    <p>
                        Chúc hai bạn trăm năm hạnh phúc,
                        luôn yêu thương và đồng hành cùng nhau
                        trên chặng đường phía trước! ❤️
                    </p>
                </div>
            </div>
        `;
        return;
    }

    data.forEach(function(wish) {
        addWishToList(wish);
    });
}


// TỰ ĐỘNG CẬP NHẬT KHI CÓ LỜI CHÚC MỚI
function setupWishRealtime() {
    supabaseClient
        .channel("wishes-realtime")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "wishes"
            },
            function(payload) {
                const existing = document.querySelector(
                    `.wish-item[data-wish-id="${payload.new.id}"]`
                );

                if (!existing) {
                    addWishToList(payload.new);
                }
            }
        )
        .subscribe();
}


// CHỐNG HTML
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// KHI TRANG ĐƯỢC MỞ
loadWishes();
setupWishRealtime();

// =========================================
// BẢO VỆ NỘI DUNG NHẬP
// =========================================

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

/* =========================================
   GAME 1 - BẮT LẤY YÊU THƯƠNG
========================================= */

(function () {

    const GAME_KEY = "sang_anh_heart_game_played";

    // 🔐 MẬT KHẨU RIÊNG CỦA GAME 1
    const GAME_PASSWORD = "23091995";

    let score = 0;
    let timeLeft = 15;

    let gameTimer = null;
    let heartTimer = null;

    let gameRunning = false;
    let playerName = "";

    const playArea = document.getElementById("heartPlayArea");
    const startScreen = document.getElementById("heartGameStart");
    const startButton = document.getElementById("startHeartGame");
    const playerNameInput = document.getElementById("heartPlayerName");

    const scoreElement = document.getElementById("heartScore");
    const timeElement = document.getElementById("heartTime");

    const resultBox = document.getElementById("heartGameResult");
    const resultTitle = document.getElementById("heartResultTitle");
    const resultText = document.getElementById("heartResultText");


    /* =========================================
       KIỂM TRA HTML
    ========================================= */

    if (
        !playArea ||
        !startScreen ||
        !startButton ||
        !playerNameInput ||
        !scoreElement ||
        !timeElement ||
        !resultBox ||
        !resultTitle ||
        !resultText
    ) {
        console.warn("Không tìm thấy đầy đủ HTML của Game 1.");
        return;
    }


    /* =========================================
       KIỂM TRA ĐÃ CHƠI
    ========================================= */

    function hasPlayed() {

        return localStorage.getItem(GAME_KEY) === "true";

    }


    /* =========================================
       MÀN HÌNH ĐÃ CHƠI
    ========================================= */

    function showAlreadyPlayed() {

        startScreen.innerHTML = `

            <div class="start-heart">
                💗
            </div>

            <p>
                Bạn đã chơi rồi nhé! ❤️
            </p>

            <small style="
                color:#aaa;
                font-size:12px;
                display:block;
                margin-bottom:12px;
            ">
                Muốn chơi lại? Nhập mật khẩu Game 1 nhé!
            </small>

            <input
                type="password"
                id="heartGamePassword"
                placeholder="Mật khẩu Game 1"
                autocomplete="off"
                style="
                    width:80%;
                    max-width:260px;
                    padding:12px 15px;
                    margin:5px auto 10px;
                    border:1px solid #f3c5d5;
                    border-radius:25px;
                    outline:none;
                    text-align:center;
                    font-family:inherit;
                    box-sizing:border-box;
                "
            >

            <button
                id="heartUnlockButton"
                type="button"
            >
                🔓 CHƠI LẠI
            </button>

            <small
                id="heartPasswordMessage"
                style="
                    display:block;
                    margin-top:10px;
                    color:#e88;
                    font-size:12px;
                "
            ></small>
        `;


        const passwordInput =
            document.getElementById("heartGamePassword");

        const unlockButton =
            document.getElementById("heartUnlockButton");

        const passwordMessage =
            document.getElementById("heartPasswordMessage");


        unlockButton.addEventListener(
            "click",
            function () {

                const password =
                    passwordInput.value.trim();


                if (password === GAME_PASSWORD) {

                    // Mở khóa Game 1
                    localStorage.removeItem(GAME_KEY);

                    // Tải lại giao diện game
                    location.reload();

                } else {

                    passwordMessage.textContent =
                        "❌ Mật khẩu không đúng.";

                    passwordInput.value = "";

                    passwordInput.focus();
                }

            }
        );


        /* Nhấn Enter cũng được */
        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    unlockButton.click();

                }

            }
        );

    }


    /* =========================================
       TẠO TRÁI TIM
    ========================================= */

    function createGameHeart() {

        if (!gameRunning) {
            return;
        }


        const oldHeart =
            playArea.querySelector(".game-heart");

        if (oldHeart) {
            oldHeart.remove();
        }


        const heart =
            document.createElement("div");

        heart.className = "game-heart";

        heart.innerHTML = "♥";


        const areaWidth =
            playArea.clientWidth;

        const areaHeight =
            playArea.clientHeight;


        const heartSize = 58;


        const maxX = Math.max(
            5,
            areaWidth - heartSize - 5
        );

        const maxY = Math.max(
            5,
            areaHeight - heartSize - 5
        );


        const randomX =
            5 + Math.random() * (maxX - 5);

        const randomY =
            5 + Math.random() * (maxY - 5);


        heart.style.left =
            randomX + "px";

        heart.style.top =
            randomY + "px";


        heart.addEventListener(
            "pointerdown",
            function (event) {

                event.preventDefault();

                catchHeart(
                    heart,
                    randomX + heartSize / 2,
                    randomY + heartSize / 2
                );

            }
        );


        playArea.appendChild(heart);

    }


    /* =========================================
       BẮT TRÁI TIM
    ========================================= */

    function catchHeart(
        heart,
        x,
        y
    ) {

        if (!gameRunning) {
            return;
        }


        score++;

        scoreElement.textContent =
            score;


        const pop =
            document.createElement("div");

        pop.className = "heart-pop";

        pop.innerHTML = "💗";

        pop.style.left =
            x + "px";

        pop.style.top =
            y + "px";


        playArea.appendChild(pop);


        setTimeout(function () {

            if (pop) {
                pop.remove();
            }

        }, 500);


        heart.remove();


        setTimeout(function () {

            if (gameRunning) {
                createGameHeart();
            }

        }, 120);

    }


    /* =========================================
       BẮT ĐẦU GAME
    ========================================= */

    function startGame(event) {

        if (event) {
            event.preventDefault();
        }


        /* Nếu đã chơi thì không cho vào trực tiếp */
        if (hasPlayed()) {

            showAlreadyPlayed();

            return;
        }


        /* Lấy tên */
        playerName =
            playerNameInput.value.trim();


        /* Bắt buộc nhập tên */
        if (!playerName) {

            alert(
                "Bạn hãy nhập tên trước khi chơi nhé ❤️"
            );

            playerNameInput.focus();

            return;
        }


        if (gameRunning) {
            return;
        }


        gameRunning = true;

        score = 0;

        timeLeft = 15;


        scoreElement.textContent =
            score;

        timeElement.textContent =
            timeLeft;


        resultBox.classList.remove(
            "show"
        );


        startScreen.style.display =
            "none";


        /* Trái tim đầu tiên */
        createGameHeart();


        /* Đổi trái tim */
        heartTimer =
            setInterval(function () {

                if (gameRunning) {
                    createGameHeart();
                }

            }, 1100);


        /* Đếm ngược */
        gameTimer =
            setInterval(function () {

                timeLeft--;

                timeElement.textContent =
                    timeLeft;


                if (timeLeft <= 0) {

                    endGame();

                }

            }, 1000);

    }


    /* =========================================
       LƯU ĐIỂM VÀO SUPABASE
    ========================================= */

    async function saveHeartScore() {

        try {

            const { error } =
                await supabaseClient
                    .from("heart_game_scores")
                    .insert([
                        {
                            player_name:
                                playerName,

                            score:
                                score
                        }
                    ]);


            if (error) {

                console.error(
                    "Lỗi lưu thành tích:",
                    error
                );

                return false;
            }


            console.log(
                "Đã lưu thành tích ❤️"
            );

            return true;

        } catch (error) {

            console.error(
                "Không thể lưu thành tích:",
                error
            );

            return false;
        }

    }


    /* =========================================
       KẾT THÚC GAME
    ========================================= */

    async function endGame() {

        if (!gameRunning) {
            return;
        }


        gameRunning = false;


        clearInterval(gameTimer);

        clearInterval(heartTimer);


        gameTimer = null;

        heartTimer = null;


        /* Xóa trái tim */
        const heart =
            playArea.querySelector(
                ".game-heart"
            );

        if (heart) {
            heart.remove();
        }


        /* Lưu thành tích */
        const saved =
            await saveHeartScore();


        /*
           Chỉ khóa lượt chơi
           khi lưu Supabase thành công
        */
       if (saved) {

    localStorage.setItem(
        GAME_KEY,
        "true"
    );

    // Cập nhật bảng thành tích ngay
    loadHeartLeaderboard();

}
        

        /* Hiện kết quả */
        resultBox.classList.add(
            "show"
        );


        /* =========================================
           NỘI DUNG KẾT QUẢ
        ========================================= */

        if (score === 0) {

            resultTitle.textContent =
                "Ơ kìa 😆";

            resultText.textContent =
                playerName +
                " chưa bắt được trái tim nào, nhưng vẫn nhận được một trái tim từ Sáng & Ánh ❤️";

        }

        else if (score < 5) {

            resultTitle.textContent =
                "Dễ thương quá! 💕";

            resultText.textContent =
                playerName +
                " đã bắt được " +
                score +
                " trái tim ❤️";

        }

        else if (score < 10) {

            resultTitle.textContent =
                "Giỏi quá! 💗";

            resultText.textContent =
                playerName +
                " đã bắt được " +
                score +
                " trái tim của Sáng & Ánh!";

        }

        else {

            resultTitle.textContent =
                "Cao thủ bắt tim! 💖";

            resultText.textContent =
                playerName +
                " đã bắt được tận " +
                score +
                " trái tim! Tình yêu này không đùa được đâu 😆❤️";

        }


        /* Nếu Supabase không lưu được */
        if (!saved) {

            resultText.innerHTML += `
                <br>
                <small style="
                    color:#999;
                    font-size:11px;
                ">
                    ⚠️ Thành tích chưa được lưu.
                </small>
            `;

        }

    }


    /* =========================================
       NÚT BẮT ĐẦU
    ========================================= */

    startButton.addEventListener(
        "click",
        startGame
    );


    /* =========================================
       KHI TẢI TRANG
    ========================================= */

    if (hasPlayed()) {

        showAlreadyPlayed();

    }

})();
// =========================================
// 🏆 KHỞI ĐỘNG BẢNG THÀNH TÍCH
// =========================================

loadHeartLeaderboard();

setupHeartLeaderboardRealtime();

/* =========================================
   GAME 2 - AI HIỂU SÁNG & ÁNH NHẤT?
   BẢN AN TOÀN - KHÔNG ẢNH HƯỞNG GAME 1
========================================= */

(function () {

    "use strict";

    /* ===============================
       CẤU HÌNH
    =============================== */

    const QUIZ_STORAGE_KEY =
        "sang_anh_couple_quiz_played";

    const QUIZ_PASSWORD =
        "07112026";


    /* ===============================
       9 CÂU HỎI
    =============================== */

    const quizQuestions = [

        {
            question:
                "Ai là người chủ động làm quen trước?",

            answers: [
                "Cô dâu 💕",
                "Chú rể 😎",
                "Cả hai cùng chủ động",
                "Không ai nhớ nữa 😂"
            ],

            correct: "D"
        },

        {
            question:
                "Ai là người hay dỗi hơn?",

            answers: [
                "Cô dâu 🥹",
                "Chú rể 😗",
                "Cả hai ngang nhau",
                "Không ai dỗi bao giờ 😆"
            ],

            correct: "A"
        },

        {
            question:
                "Ai là người thường làm hòa trước sau khi cãi nhau?",

            answers: [
                "Cô dâu",
                "Chú rể",
                "Người sai làm hòa",
                "Ai chịu không nổi trước thì làm hòa 😂"
            ],

            correct: "D"
        },

        {
            question:
                "Ai là người hay nói “Không sao đâu” nhưng thực ra là… có sao? 😂",

            answers: [
                "Cô dâu",
                "Chú rể",
                "Cả hai",
                "Không ai"
            ],

            correct: "A"
        },

        {
            question:
                "Ai là người dễ ngủ quên hơn? 😴",

            answers: [
                "Cô dâu",
                "Chú rể",
                "Cả hai",
                "Không ai, cả hai đều rất tỉnh 😂"
            ],

            correct: "B"
        },

        {
            question:
                "Nếu hai người cùng đi ăn, ai thường là người chọn món? 🍜",

            answers: [
                "Cô dâu",
                "Chú rể",
                "Cùng quyết định",
                "“Ăn gì cũng được” nhưng cuối cùng vẫn chọn 😂"
            ],

            correct: "A"
        },

        {
            question:
                "Ai có khả năng ngủ nướng lâu hơn? 😴",

            answers: [
                "Cô dâu",
                "Chú rể",
                "Hai người như nhau",
                "Ai cũng là cao thủ"
            ],

            correct: "A"
        },

        {
            question:
                "Khi đi chơi cùng nhau, ai là người chụp ảnh nhiều hơn? 📸",

            answers: [
                "Cô dâu",
                "Chú rể",
                "Cả hai",
                "Không ai, vì mải ăn 😂"
            ],

            correct: "A"
        },

        {
            question:
                "Nếu chỉ được chọn một món để ăn cùng nhau cả ngày, hai người sẽ chọn gì? 🍽️",

            answers: [
                "Lẩu",
                "Đồ nướng",
                "Hải sản",
                "Món khác"
            ],

            correct: "D"
        }

    ];


    /* ===============================
       BIẾN GAME
    =============================== */

    let quizIndex = 0;
    let quizScoreValue = 0;
    let quizPlayerName = "";
    let quizRunning = false;


    /* ===============================
       LẤY HTML
    =============================== */

    const quizStart =
        document.getElementById("quizStart");

    const quizQuestionBox =
        document.getElementById("quizQuestionBox");

    const quizResult =
        document.getElementById("quizResult");

    const quizPlayerNameInput =
        document.getElementById("quizPlayerName");

    const startQuizButton =
        document.getElementById("startCoupleQuiz");

    const quizCurrent =
        document.getElementById("quizCurrent");

    const quizScore =
        document.getElementById("quizScore");

    const questionNumber =
        document.getElementById("questionNumber");

    const questionText =
        document.getElementById("questionText");

    const quizAnswers =
        document.getElementById("quizAnswers");

    const quizFeedback =
        document.getElementById("quizFeedback");

    const nextQuizButton =
        document.getElementById("nextQuizQuestion");

    const quizResultTitle =
        document.getElementById("quizResultTitle");

    const quizFinalScore =
        document.getElementById("quizFinalScore");

    const quizResultText =
        document.getElementById("quizResultText");

    const quizPlayAgain =
        document.getElementById("quizPlayAgain");


    /* ===============================
       NẾU GAME 2 CHƯA CÓ HTML
       THÌ KHÔNG LÀM GÌ CẢ
    =============================== */

    if (
        !quizStart ||
        !quizQuestionBox ||
        !quizResult ||
        !quizPlayerNameInput ||
        !startQuizButton ||
        !quizCurrent ||
        !quizScore ||
        !questionNumber ||
        !questionText ||
        !quizAnswers ||
        !quizFeedback ||
        !nextQuizButton ||
        !quizResultTitle ||
        !quizFinalScore ||
        !quizResultText ||
        !quizPlayAgain
    ) {

        console.warn(
            "Game 2 chưa có đầy đủ HTML."
        );

        return;

    }


    /* ===============================
       KIỂM TRA ĐÃ CHƠI
    =============================== */

    function quizHasPlayed() {

        return (
            localStorage.getItem(
                QUIZ_STORAGE_KEY
            ) === "true"
        );

    }


    /* ===============================
       MÀN HÌNH ĐÃ CHƠI
    =============================== */

    function showQuizAlreadyPlayed() {

        quizStart.innerHTML = `

            <div class="quiz-ring">
                💗
            </div>

            <h3>
                Bạn đã chơi rồi nhé!
            </h3>

            <p>
                Mỗi người chỉ được chơi Game 2 một lần ❤️
            </p>

            <input
                type="password"
                id="quizReplayPassword"
                placeholder="Nhập mật khẩu để chơi lại"
                autocomplete="off"
                style="
                    display:block;
                    width:100%;
                    max-width:380px;
                    box-sizing:border-box;
                    margin:0 auto 12px;
                    padding:14px 18px;
                    border:1px solid #edc8d1;
                    border-radius:50px;
                    outline:none;
                    text-align:center;
                "
            >

            <button
                id="quizReplayButton"
                type="button"
            >
                🔓 CHƠI LẠI
            </button>

            <div
                id="quizReplayMessage"
                style="
                    min-height:25px;
                    margin-top:12px;
                    color:#a04e5d;
                    font-size:13px;
                "
            ></div>
        `;


        const passwordInput =
            document.getElementById(
                "quizReplayPassword"
            );

        const replayButton =
            document.getElementById(
                "quizReplayButton"
            );

        const message =
            document.getElementById(
                "quizReplayMessage"
            );


        replayButton.addEventListener(
            "click",
            function () {

                if (
                    passwordInput.value.trim() ===
                    QUIZ_PASSWORD
                ) {

                    localStorage.removeItem(
                        QUIZ_STORAGE_KEY
                    );

                    location.reload();

                } else {

                    message.textContent =
                        "❌ Mật khẩu không đúng.";

                    passwordInput.value = "";

                    passwordInput.focus();

                }

            }
        );


        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    replayButton.click();

                }

            }
        );

    }


    /* ===============================
       HIỆN CÂU HỎI
    =============================== */

    function showQuizQuestion() {

        const current =
            quizQuestions[quizIndex];


        quizCurrent.textContent =
            quizIndex + 1;


        questionNumber.textContent =
            quizIndex + 1;


        questionText.textContent =
            current.question;


        quizFeedback.textContent = "";

        nextQuizButton.style.display =
            "none";


        quizAnswers.innerHTML = "";


        current.answers.forEach(
            function (answer, index) {

                const button =
                    document.createElement("button");


                button.type = "button";

                button.className =
                    "quiz-answer-button";


                const letter =
                    String.fromCharCode(
                        65 + index
                    );


                button.textContent =
                    letter + ". " + answer;


                button.dataset.answer =
                    letter;


                button.addEventListener(
                    "click",
                    function () {

                        chooseQuizAnswer(
                            button,
                            letter
                        );

                    }
                );


                quizAnswers.appendChild(
                    button
                );

            }
        );

    }


    /* ===============================
       CHỌN ĐÁP ÁN
    =============================== */

    function chooseQuizAnswer(
        selectedButton,
        selectedAnswer
    ) {

        if (!quizRunning) {
            return;
        }


        const current =
            quizQuestions[quizIndex];


        const buttons =
            quizAnswers.querySelectorAll(
                ".quiz-answer-button"
            );


        buttons.forEach(
            function (button) {

                button.disabled = true;

            }
        );


        if (
            selectedAnswer ===
            current.correct
        ) {

            quizScoreValue++;

            quizScore.textContent =
                quizScoreValue;


            selectedButton.classList.add(
                "correct"
            );


            quizFeedback.textContent =
                "💕 Chính xác! Bạn hiểu Sáng & Ánh ghê đó!";

        } else {

            selectedButton.classList.add(
                "wrong"
            );


            buttons.forEach(
                function (button) {

                    if (
                        button.dataset.answer ===
                        current.correct
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }

                }
            );


            quizFeedback.textContent =
                "💗 Tiếc quá! Đáp án đúng đã được bật mí rồi nhé!";

        }


        if (
            quizIndex <
            quizQuestions.length - 1
        ) {

            nextQuizButton.style.display =
                "inline-block";

        } else {

            setTimeout(
                finishQuiz,
                800
            );

        }

    }


    /* ===============================
       BẮT ĐẦU GAME
    =============================== */

    function startQuiz() {

        if (quizHasPlayed()) {

            showQuizAlreadyPlayed();

            return;

        }


        quizPlayerName =
            quizPlayerNameInput.value.trim();


        if (!quizPlayerName) {

            alert(
                "💕 Bạn hãy nhập tên trước khi bắt đầu nhé!"
            );

            quizPlayerNameInput.focus();

            return;

        }


        quizRunning = true;

        quizIndex = 0;

        quizScoreValue = 0;


        quizScore.textContent =
            "0";


        quizStart.style.display =
            "none";


        quizResult.style.display =
            "none";


        quizQuestionBox.style.display =
            "block";


        showQuizQuestion();

    }


    /* ===============================
       CÂU TIẾP THEO
    =============================== */

    function nextQuizQuestion() {

        if (!quizRunning) {
            return;
        }


        quizIndex++;

        showQuizQuestion();

    }


    /* ===============================
       LƯU ĐIỂM
    =============================== */

    async function saveQuizScore() {

        try {

            const result =
                await supabaseClient
                    .from(
                        "couple_quiz_scores"
                    )
                    .insert([
                        {
                            player_name:
                                quizPlayerName,

                            score:
                                quizScoreValue
                        }
                    ]);


            if (result.error) {

                console.error(
                    "Lỗi lưu điểm Game 2:",
                    result.error
                );

                return false;

            }


            return true;

        } catch (error) {

            console.error(
                "Lỗi Game 2:",
                error
            );

            return false;

        }

    }


    /* ===============================
       KẾT THÚC GAME
    =============================== */

    async function finishQuiz() {

        if (!quizRunning) {
            return;
        }


        quizRunning = false;


        quizQuestionBox.style.display =
            "none";


        quizResult.style.display =
            "block";


        quizFinalScore.textContent =
            quizScoreValue;


        if (quizScoreValue === 9) {

            quizResultTitle.textContent =
                "🏆 Quá hiểu nhau luôn!";

            quizResultText.textContent =
                "Bạn đúng là người hiểu Sáng & Ánh nhất rồi đó! 💕";

        } else if (quizScoreValue >= 7) {

            quizResultTitle.textContent =
                "💗 Hiểu nhau lắm nha!";

            quizResultText.textContent =
                "Bạn biết rất nhiều về cô dâu chú rể rồi đó!";

        } else if (quizScoreValue >= 5) {

            quizResultTitle.textContent =
                "💕 Khá lắm nha!";

            quizResultText.textContent =
                "Bạn cũng hiểu Sáng & Ánh kha khá rồi đó!";

        } else if (quizScoreValue >= 3) {

            quizResultTitle.textContent =
                "😆 Cần tìm hiểu thêm rồi!";

            quizResultText.textContent =
                "Có vẻ bạn cần tìm hiểu thêm về cô dâu chú rể nha!";

        } else {

            quizResultTitle.textContent =
                "😂 Bí mật quá rồi!";

            quizResultText.textContent =
                "Sáng & Ánh vẫn còn rất nhiều điều chưa bật mí cho bạn!";

        }


        const saved =
            await saveQuizScore();


        if (saved) {

            localStorage.setItem(
                QUIZ_STORAGE_KEY,
                "true"
            );

            loadQuizLeaderboard();

        } else {

            quizResultText.innerHTML += `
                <br>
                <small style="
                    color:#999;
                    font-size:11px;
                ">
                    ⚠️ Thành tích chưa được lưu.
                </small>
            `;

        }

    }


    /* ===============================
       CHƠI LẠI
    =============================== */

    quizPlayAgain.addEventListener(
        "click",
        function () {

            if (quizHasPlayed()) {

                showQuizAlreadyPlayed();

                return;

            }

            quizResult.style.display =
                "none";

            quizStart.style.display =
                "block";

        }
    );


    /* ===============================
       NÚT BẮT ĐẦU
    =============================== */

    startQuizButton.addEventListener(
        "click",
        startQuiz
    );


    /* ===============================
       NÚT CÂU TIẾP
    =============================== */

    nextQuizButton.addEventListener(
        "click",
        nextQuizQuestion
    );


    /* =========================================
       BẢNG THÀNH TÍCH GAME 2
    ========================================= */

    const quizLeaderboard =
        document.getElementById(
            "coupleQuizLeaderboardList"
        );


    async function loadQuizLeaderboard() {

        if (!quizLeaderboard) {
            return;
        }


        quizLeaderboard.innerHTML = `
            <div class="couple-quiz-leaderboard-loading">
                Đang tải thành tích... 💕
            </div>
        `;


        try {

            const result =
                await supabaseClient
                    .from(
                        "couple_quiz_scores"
                    )
                    .select(
                        "player_name, score, played_at"
                    )
                    .order(
                        "score",
                        {
                            ascending: false
                        }
                    )
                    .order(
                        "played_at",
                        {
                            ascending: true
                        }
                    )
                    .limit(50);


            if (result.error) {

                console.error(
                    "Lỗi tải bảng Game 2:",
                    result.error
                );


                quizLeaderboard.innerHTML = `
                    <div class="couple-quiz-leaderboard-empty">
                        Không thể tải bảng thành tích 💕
                    </div>
                `;

                return;

            }


            const data =
                result.data;


            if (
                !data ||
                data.length === 0
            ) {

                quizLeaderboard.innerHTML = `
                    <div class="couple-quiz-leaderboard-empty">
                        Chưa có ai chơi Game 2.<br>
                        Hãy trở thành người đầu tiên nhé! ❤️
                    </div>
                `;

                return;

            }


            quizLeaderboard.innerHTML = "";


            data.forEach(
                function (player, index) {

                    const rank =
                        index + 1;


                    let rankDisplay =
                        rank;


                    if (rank === 1) {

                        rankDisplay = "🥇";

                    } else if (rank === 2) {

                        rankDisplay = "🥈";

                    } else if (rank === 3) {

                        rankDisplay = "🥉";

                    }


                    const item =
                        document.createElement(
                            "div"
                        );


                    item.className =
                        "couple-quiz-rank-item rank-" +
                        rank;


                    const name =
                        document.createElement(
                            "div"
                        );

                    name.className =
                        "couple-quiz-rank-name";

                    name.textContent =
                        player.player_name;


                    const rankNumber =
                        document.createElement(
                            "div"
                        );

                    rankNumber.className =
                        "couple-quiz-rank-number";

                    rankNumber.textContent =
                        rankDisplay;


                    const playerScore =
                        document.createElement(
                            "div"
                        );

                    playerScore.className =
                        "couple-quiz-rank-score";

                    playerScore.textContent =
                        Number(player.score || 0) +
                        " / 9 điểm";


                    item.appendChild(
                        rankNumber
                    );

                    item.appendChild(
                        name
                    );

                    item.appendChild(
                        playerScore
                    );


                    quizLeaderboard.appendChild(
                        item
                    );

                }
            );


        } catch (error) {

            console.error(
                "Lỗi bảng thành tích Game 2:",
                error
            );

        }

    }


    /* =========================================
       REALTIME GAME 2
    ========================================= */

    function setupQuizLeaderboardRealtime() {

        supabaseClient
            .channel(
                "couple-quiz-leaderboard"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "couple_quiz_scores"
                },
                function () {

                    loadQuizLeaderboard();

                }
            )
            .subscribe();

    }


    /* ===============================
       KHỞI ĐỘNG
    =============================== */

    loadQuizLeaderboard();

    setupQuizLeaderboardRealtime();


    /* ===============================
       KIỂM TRA ĐÃ CHƠI
    =============================== */

    if (quizHasPlayed()) {

        showQuizAlreadyPlayed();

    }

})();