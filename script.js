/* 
  Configuration - Customize Text Here 
*/
const config = {
    name: "Sneha",
    landingTitle: "Hi Sneha 🌸",
    landingSubtitle: "I made something special for you…",
    memories: [
        { text: "My lucky charm... 🍀 I was watching a match, and my team was losing. You said 'I hope they score', and BAM! They did! Twice! Magic ✨⚽", emoji: "🍀" },
        { text: "Fashion Icon 🎀 You sent me a pic of a hairband on a wrist and said 'this is essential'. I melt... you have the best taste ever. 👗💅", emoji: "👠" },
        { text: "Nervous call... 📞 That one time on the phone, we were both so shy and nervous. It was honestly the cutest thing ever. 😳�", emoji: "🥰" }
    ],
    gameTarget: 5,
    proposalQuestion: "Sneha... will you be my girlfriend? 💗",
    yesMessage: "You just made me the happiest boy alive 💫",
    noButtonPhrases: [
        "No 🙈",
        "Are you sure? 🥺",
        "Don't do this! 😭",
        "Click the other one! 👉",
        "Last chance! 💔"
    ]
};

let isMusicPlaying = false;

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {
    initStartScreen();
    initContent();
    initScrollAnimations();
    initGame();
    initProposal();
});

// --- Start Screen ---

function initStartScreen() {
    const overlay = document.getElementById('start-overlay');
    const music = document.getElementById('bg-music');
    const musicControl = document.getElementById('music-control');

    overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000);

        // Play Music
        music.volume = 0.5;
        music.play().then(() => {
            isMusicPlaying = true;
            musicControl.style.display = 'flex'; // Show control only after start
            musicControl.innerText = '⏸️';
        }).catch(e => console.log("Audio play failed:", e));
    });
}

// --- Content Injection ---

function initContent() {
    document.getElementById('landing-title').innerText = config.landingTitle;
    document.getElementById('landing-subtitle').innerText = config.landingSubtitle;

    const memoriesSection = document.getElementById('memories');
    config.memories.forEach((memory, index) => {
        const card = document.createElement('div');
        card.className = 'card memory-card';
        card.innerHTML = `
      <h3>${memory.emoji}</h3>
      <p>${memory.text}</p>
    `;
        memoriesSection.appendChild(card);
    });

    document.getElementById('proposal-heading').innerText = config.name + "...";
    document.getElementById('proposal-text').innerText = config.proposalQuestion;
}

// --- Scroll Animations ---

function initScrollAnimations() {
    const cards = document.querySelectorAll('.memory-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));
}

// --- Mini Game ---

let heartsCollected = 0;

function initGame() {
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score-display');

    // Create animated hearts
    setInterval(() => {
        if (heartsCollected >= config.gameTarget) return;

        const heart = document.createElement('div');
        heart.innerText = '💖';
        heart.className = 'floating-heart';
        heart.style.left = Math.random() * 90 + '%';
        heart.style.top = '100%';
        heart.style.animationDuration = (Math.random() * 2 + 2) + 's';

        heart.onclick = () => {
            heartsCollected++;
            scoreDisplay.innerText = `Hearts Collected: ${heartsCollected} / ${config.gameTarget}`;
            heart.remove();

            if (heartsCollected === config.gameTarget) {
                unlockProposal();
            }
        };

        gameArea.appendChild(heart);

        // Remove heart after animation
        setTimeout(() => {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
        }, 4000);

    }, 800);
}

function unlockProposal() {
    const proposalSection = document.getElementById('proposal');
    proposalSection.style.display = 'block';
    proposalSection.scrollIntoView({ behavior: 'smooth' });
    alert("You unlocked something important... scroll down! 👇");
}

// --- Proposal Logic ---

function initProposal() {
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');

    // Prevent mobile double-tap zoom or weirdness
    btnNo.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); moveNoButton(e) });
    btnNo.addEventListener('mouseover', moveNoButton);

    let isMoving = false; // Debounce flag
    let noHoverCount = 0;

    function moveNoButton(e) {
        if (heartsCollected < config.gameTarget) return; // Only active after unlock
        if (isMoving) return; // Prevent glitching/too many updates

        isMoving = true;
        setTimeout(() => isMoving = false, 250); // Cooldown

        noHoverCount++;
        if (noHoverCount > config.noButtonPhrases.length) {
            noHoverCount = 0; // Loop messages
        }

        // Change text randomly
        btnNo.innerText = config.noButtonPhrases[noHoverCount % config.noButtonPhrases.length];

        // Ensure relative positioning on the card parent
        const card = document.querySelector('#proposal .card');
        card.style.position = 'relative';

        // Switch to absolute on first move if not already
        if (btnNo.style.position !== 'absolute') {
            btnNo.style.position = 'absolute';
            // Determine initial coordinates based on current location to avoid visual jump before move?
            // Actually, we want it to jump away immediately.
        }

        // Calculate available space in the card
        // Subtract button dimensions to keep it inside
        // Using Math.max(0, ...) to prevent negative values on very small screens
        const maxX = Math.max(0, card.clientWidth - btnNo.offsetWidth - 20);
        const maxY = Math.max(0, card.clientHeight - btnNo.offsetHeight - 20);

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        btnNo.style.left = randomX + 'px';
        btnNo.style.top = randomY + 'px';
    }

    // Yes Button
    btnYes.addEventListener('click', () => {
        celebrate();
    });
}

// --- Celebration ---

function celebrate() {
    const overlay = document.getElementById('celebration');
    const music = document.getElementById('bg-music');

    overlay.style.display = 'flex';
    overlay.querySelector('p').innerText = config.yesMessage;

    // Play music if not already playing
    music.play().catch(e => console.log("Audio play failed (user interaction needed first):", e));

    startConfetti();
}

// Simple Confetti
function startConfetti() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.position = 'fixed';
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = 9999;
    document.body.appendChild(canvas);

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const colors = ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea'];

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height - height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            speed: Math.random() * 5 + 2,
            angle: Math.random() * 360
        };
    }

    for (let i = 0; i < 150; i++) {
        particles.push(createParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.y += p.speed;
            p.angle += 2;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.y > height) {
                particles[index] = createParticle();
                particles[index].y = -10; // Reset to top
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// --- Music Control ---
// isMusicPlaying is declared at the top
function toggleMusic() {
    const music = document.getElementById('bg-music');
    if (isMusicPlaying) {
        music.pause();
        isMusicPlaying = false;
        document.getElementById('music-control').innerText = '🎵';
    } else {
        music.play().then(() => {
            isMusicPlaying = true;
            document.getElementById('music-control').innerText = '⏸️';
        }).catch(e => alert("Please interact with the page first!"));
    }
}
