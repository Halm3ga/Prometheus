// ==========================================================================
// PROMETHEUS - Team Member Database and Interactive Engine
// ==========================================================================

const MEMBERS_DATA = [
    {
        id: "adhityan",
        name: "Adhityan Sreehari",
        image: "Pics/Adhityan Sreehari.jpeg",
        role: "Team Member",

        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "mailto:adhityan@prometheus.tech"
        }
    },
    {
        id: "albert",
        name: "Albert Joy",
        image: "Pics/Albert Joy.jpeg",
        role: "Team Member",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "mailto:albert@prometheus.tech"
        }
    },
    {
        id: "amar",
        name: "Amar",
        image: "Pics/Amar.jpeg",
        role: "Team Member",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "mailto:amar@prometheus.tech"
        }
    },
    {
        id: "angela",
        name: "Angela Thoratty",
        image: "Pics/Angela Thoratty.jpeg",
        role: "Team Member",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "mailto:angela@prometheus.tech"
        }
    },
    {
        id: "annmaria",
        name: "Ann Maria Rajeev",
        image: "Pics/Ann Maria Rajeev.jpeg",
        role: "Team Member",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "mailto:annmaria@prometheus.tech"
        }
    },
    {
        id: "anpu",
        name: "Anpu Saramsh",
        image: "Pics/Anpu Saramsh.jpeg",
        role: "Captain",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "mailto:anpu@prometheus.tech"
        }
    },
    {
        id: "antreena",
        name: "Antreena Babu",
        image: "Pics/Antreena Babu.jpeg",
        role: "Vice Captain",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "mailto:antreena@prometheus.tech"
        }
    },
    {
        id: "bagath",
        name: "Bagath KR",
        image: "Pics/Bagath KR.jpeg",
        role: "Team Member",
        socials: {
            github: "https://github.com",
            linkedin: "https://linkedin.com",
            email: "mailto:bagath@prometheus.tech"
        }
    }
];

// Document DOM Loaded Trigger
document.addEventListener("DOMContentLoaded", () => {
    initSplashScreen();
    initMembersGrid();
    initModalHandler();
    initAmbientEmberEffect();
});

// ==========================================================================
// 1. Splash Screen — Parting Animation
// ==========================================================================
function initSplashScreen() {
    const splash = document.getElementById("splash-screen");
    const splashContent = splash ? splash.querySelector(".splash-content") : null;
    if (!splash || !splashContent) return;

    let triggered = false;

    function triggerSplash() {
        if (triggered) return;
        triggered = true;

        // Remove listeners immediately to prevent double-fire
        splash.removeEventListener("click", triggerSplash);
        window.removeEventListener("keydown", triggerSplash);
        window.removeEventListener("touchstart", triggerSplash);

        // 1. Instantly fade out the logo/title/prompt via inline style
        splashContent.style.transition = "opacity 0.35s ease-out";
        splashContent.style.opacity = "0";

        // 2. After a brief delay let the content fade, then start the panel part
        setTimeout(() => {
            splash.classList.add("parting");
        }, 200);

        // 3. After the full panel animation completes, hide the overlay
        setTimeout(() => {
            splash.classList.add("hidden");
        }, 1300);
    }

    splash.addEventListener("click", triggerSplash);
    window.addEventListener("keydown", triggerSplash);
    window.addEventListener("touchstart", triggerSplash);
}

// ==========================================================================
// 2. Members Grid Generation
// ==========================================================================
function initMembersGrid() {
    const grid = document.getElementById("members-card-grid");
    if (!grid) return;

    grid.innerHTML = ""; // Clear loader/noscript default

    MEMBERS_DATA.forEach(member => {
        const card = document.createElement("div");
        card.className = "member-card";
        card.setAttribute("data-member-id", member.id);
        card.setAttribute("tabindex", "0"); // Accessibility

        card.innerHTML = `
            <div class="member-img-container">
                <img src="${member.image}" alt="${member.name}" class="member-img" loading="lazy">
                <div class="member-img-overlay"></div>
            </div>
            <div class="member-info">
                <div>
                    <span class="member-role">${member.role}</span>
                    <h3 class="member-name">${member.name}</h3>
                </div>
                <div class="card-action">
                    <span>View Profile</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            </div>
        `;

        // Event listeners for trigger modal
        card.addEventListener("click", () => openMemberModal(member.id));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openMemberModal(member.id);
            }
        });

        grid.appendChild(card);
    });
}

// ==========================================================================
// 3. Modal Functionality
// ==========================================================================
let activeModalMemberId = null;

// ==========================================================================
// Tally State Management
// ==========================================================================
const tallyState = JSON.parse(localStorage.getItem("prometheus_tally") || "{}");

// Initialize tally for each member
MEMBERS_DATA.forEach(m => {
    if (tallyState[m.id] === undefined) {
        tallyState[m.id] = 0;
    }
});

function saveTallyState() {
    localStorage.setItem("prometheus_tally", JSON.stringify(tallyState));
}

function updateTally(memberId, change, displayElement) {
    tallyState[memberId] = (tallyState[memberId] || 0) + change;
    if (tallyState[memberId] < 0) tallyState[memberId] = 0; // clamp at 0
    saveTallyState();
    displayElement.textContent = tallyState[memberId];

    // Trigger visual pop animation
    displayElement.classList.remove("pop");
    void displayElement.offsetWidth; // trigger reflow
    displayElement.classList.add("pop");
}

function initModalHandler() {
    const modal = document.getElementById("member-detail-modal");
    const closeBtn = document.getElementById("modal-close-button");

    if (!modal || !closeBtn) return;

    // Close via Button
    closeBtn.addEventListener("click", closeMemberModal);

    // Close via Overlay backdrop click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeMemberModal();
        }
    });

    // Close via Escape Key
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) {
            closeMemberModal();
        }
    });
}

function openMemberModal(memberId) {
    const member = MEMBERS_DATA.find(m => m.id === memberId);
    if (!member) return;

    const modal = document.getElementById("member-detail-modal");
    const container = document.getElementById("modal-body-container");

    if (!modal || !container) return;

    activeModalMemberId = memberId;



    container.innerHTML = `
        <div class="modal-grid">
            <div class="modal-image-panel">
                <img src="${member.image}" alt="${member.name}" class="modal-detail-img">
            </div>
            <div class="modal-details-panel">
                <div class="modal-header-info">
                    <span class="modal-role">${member.role}</span>
                    <h2 class="modal-name">${member.name}</h2>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-bio-section">
                    <h3 class="modal-section-title">Tally</h3>
                    <div class="tally-counter-container">
                        <button class="tally-btn" id="tally-btn-minus" aria-label="Decrease Tally">&minus;</button>
                        <span class="tally-value" id="tally-val-display">${tallyState[memberId] || 0}</span>
                        <button class="tally-btn" id="tally-btn-plus" aria-label="Increase Tally">&plus;</button>
                    </div>
                </div>
                <div class="modal-divider"></div>
                <div class="modal-socials-section">
                    <h3 class="modal-section-title">Connect</h3>
                    <div class="social-links">
                        <a href="${member.socials.github}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="GitHub Profile">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                            </svg>
                        </a>
                        <a href="${member.socials.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn Profile">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect x="2" y="9" width="4" height="12"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                        </a>
                        <a href="${member.socials.email}" class="social-btn" aria-label="Send Email">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Hook up tally events
    const minusBtn = document.getElementById("tally-btn-minus");
    const plusBtn = document.getElementById("tally-btn-plus");
    const tallyValDisplay = document.getElementById("tally-val-display");

    if (minusBtn && plusBtn && tallyValDisplay) {
        minusBtn.addEventListener("click", () => updateTally(memberId, -1, tallyValDisplay));
        plusBtn.addEventListener("click", () => updateTally(memberId, 1, tallyValDisplay));
    }

    // Open Modal via toggling CSS classes
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Freeze main window scrolling

    // Focus close button for accessibility
    const closeBtn = document.getElementById("modal-close-button");
    if (closeBtn) closeBtn.focus();
}

function closeMemberModal() {
    const modal = document.getElementById("member-detail-modal");
    if (!modal) return;

    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore scrolling

    // Refocus the card that triggered the modal
    if (activeModalMemberId) {
        const card = document.querySelector(`.member-card[data-member-id="${activeModalMemberId}"]`);
        if (card) card.focus();
    }

    activeModalMemberId = null;
}

// ==========================================================================
// 4. Ambient Spark/Ember Canvas Particle System
// ==========================================================================
function initAmbientEmberEffect() {
    const canvas = document.getElementById("ambient-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    const maxParticles = 60;

    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particle Object blueprint
    class Spark {
        constructor() {
            this.reset();
            // Stagger initial Y heights to populate screen instantly
            this.y = Math.random() * canvas.height;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50; // spawn off-screen bottom
            this.size = Math.random() * 2.5 + 0.5; // tiny embers
            this.speedY = -(Math.random() * 0.8 + 0.3); // upward velocity
            this.speedX = Math.random() * 0.6 - 0.3; // slight side sway
            this.alpha = Math.random() * 0.5 + 0.2; // starting opacity
            this.decay = Math.random() * 0.002 + 0.001; // opacity fade rate
            this.hue = Math.random() * 20 + 15; // Hue range 15 to 35 (warm amber/orange/red)
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y / 30) * 0.15; // wave motion
            this.alpha -= this.decay;

            // Recenter if goes off-screen or fades out
            if (this.alpha <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Glowing style
            ctx.fillStyle = `hsl(${this.hue}, 100%, 60%)`;
            ctx.shadowBlur = this.size * 3;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize list of particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Spark());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}
