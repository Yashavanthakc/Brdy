document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bgMusic");
    const musicBtn = document.getElementById("musicBtn");

    const targetDate = new Date("2026-10-24T12:00:00+05:30").getTime();

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const waitingArea = document.getElementById("waitingArea");
    const revealArea = document.getElementById("revealArea");
    const revealBtn = document.getElementById("revealBtn");
    const curtain = document.getElementById("curtain");
    const revealNext = document.querySelector(".reveal-next");
    const revealCountdownText = document.getElementById("revealCountdownText");

    const babyName = "ಯುತಿಕ್ಷಾ ಡಿ";

    let ceremonyCompleted = false;
    let revealStarted = false;
    let musicPlaying = false;

    // Music: browsers require a user click before audio can start.
    musicBtn.addEventListener("click", async () => {
        try {
            if (!musicPlaying) {
                await music.play();
                musicPlaying = true;
                musicBtn.textContent = "🔊 ಸಂಗೀತ ನಿಲ್ಲಿಸಿ";
            } else {
                music.pause();
                musicPlaying = false;
                musicBtn.textContent = "🎵 ಸಂಗೀತ ಪ್ರಾರಂಭಿಸಿ";
            }
        } catch (error) {
            musicBtn.textContent = "🎵 ಸಂಗೀತ ಪ್ರಾರಂಭಿಸಿ";
        }
    });

    /* =========================
       TRUE ONE-SCREEN NAVIGATION
       Next screen appears ONLY after a button click.
    ========================= */
    const screens = Array.from(document.querySelectorAll(".screen"));
    let currentScreen = document.querySelector(".screen.hero") || screens[0];
    let navigationLocked = false;

    screens.forEach(screen => screen.classList.remove("active-screen"));
    if (currentScreen) currentScreen.classList.add("active-screen");

    document.querySelectorAll("[data-next]").forEach(button => {
        button.addEventListener("click", event => {
            event.preventDefault();
            if (navigationLocked) return;

            const target = document.getElementById(button.dataset.next);
            if (!target || target === currentScreen) return;

            navigationLocked = true;

            if (currentScreen) currentScreen.classList.remove("active-screen");
            target.classList.add("active-screen");
            target.scrollTop = 0;
            window.scrollTo(0, 0);
            currentScreen = target;

            setTimeout(() => { navigationLocked = false; }, 500);
        });
    });

    // Scrolling is allowed INSIDE the currently open screen.
    // Navigation to another screen happens only through a data-next button.

    // Soft twinkling stars.
    const sparkleBox = document.getElementById("sparkles");
    if (sparkleBox) {
        for (let i = 0; i < 28; i++) {
            const spark = document.createElement("span");
            spark.className = "spark";
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.top = `${Math.random() * 100}%`;
            spark.style.animationDelay = `${Math.random() * 2}s`;
            sparkleBox.appendChild(spark);
        }
    }

    function setNumber(element, value) {
        element.textContent = String(value).padStart(2, "0");
    }

    function updateCountdown() {
        const difference = targetDate - Date.now();

        if (difference <= 0) {
            setNumber(daysEl, 0);
            setNumber(hoursEl, 0);
            setNumber(minutesEl, 0);
            setNumber(secondsEl, 0);

            ceremonyCompleted = true;

            waitingArea.classList.add("hidden");
            revealArea.classList.remove("hidden");

            revealCountdownText.textContent = "ಶುಭ ಕ್ಷಣ ಬಂದಿದೆ ❤️";
            return;
        }

        const days = Math.floor(difference / 86400000);
        const hours = Math.floor((difference / 3600000) % 24);
        const minutes = Math.floor((difference / 60000) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setNumber(daysEl, days);
        setNumber(hoursEl, hours);
        setNumber(minutesEl, minutes);
        setNumber(secondsEl, seconds);

        revealCountdownText.textContent =
            `${days} ದಿನ ${hours} ಗಂಟೆ ${minutes} ನಿಮಿಷ ${seconds} ಸೆಕೆಂಡುಗಳ ನಂತರ...`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Name remains empty in HTML and is inserted only after countdown completion.
    revealBtn.addEventListener("click", () => {
        if (!ceremonyCompleted || revealStarted) return;

        revealStarted = true;

        document.getElementById("babyName").textContent = babyName;
        document.getElementById("meaningTitle").textContent = babyName;
        document.getElementById("finalName").textContent = babyName;

        curtain.classList.remove("hidden");
        curtain.setAttribute("aria-hidden", "false");

        requestAnimationFrame(() => {
            curtain.classList.add("open");
        });

        setTimeout(() => {
            revealNext.classList.remove("hidden");
        }, 3500);
    });

    // Fireworks
    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");
    let fireworks = [];
    let fireworksStarted = false;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createFirework() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        const x = Math.random() * width;
        const y = Math.random() * height * 0.55;

        for (let i = 0; i < 35; i++) {
            fireworks.push({
                x,
                y,
                angle: Math.PI * 2 * Math.random(),
                speed: 2 + Math.random() * 4,
                life: 100
            });
        }
    }

    function animateFireworks() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        ctx.clearRect(0, 0, width, height);

        for (let i = fireworks.length - 1; i >= 0; i--) {
            const particle = fireworks[i];

            particle.x += Math.cos(particle.angle) * particle.speed;
            particle.y += Math.sin(particle.angle) * particle.speed;
            particle.life -= 1;

            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(243,217,154,${particle.life / 100})`;
            ctx.fill();

            if (particle.life <= 0) {
                fireworks.splice(i, 1);
            }
        }

        requestAnimationFrame(animateFireworks);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animateFireworks();

    const finalSection = document.getElementById("final");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !fireworksStarted) {
                fireworksStarted = true;
                createFirework();
                setInterval(createFirework, 700);
            }
        });
    }, { threshold: 0.35 });

    observer.observe(finalSection);

    // Cute baby character reaction on navigation
    const babyCharacter = document.querySelector(".baby-character");
    document.querySelectorAll("[data-next]").forEach(button => {
        button.addEventListener("click", () => {
            if (!babyCharacter) return;
            babyCharacter.classList.remove("baby-cheer");
            void babyCharacter.offsetWidth;
            babyCharacter.classList.add("baby-cheer");
        });
    });

});
