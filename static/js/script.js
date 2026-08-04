/* ═══════════════════════════════════════════════════════════════
   Digital Ayurveda — Interactive Engine & Immersive Parallax
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
    
    // ─── 1. Header Scroll Effect ───────────────────────────────────────
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.setAttribute('data-header-state', 'scrolled');
        } else {
            header.removeAttribute('data-header-state');
        }
    });

    // ─── 2. Toast Notification System ──────────────────────────────────
    const toast = document.getElementById('toast');
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('visible');
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3500);
    }

    // ─── 3. Level-Up Hero Immersion (3D Mouse Tilt & Floating Particles)
    const heroSection = document.getElementById('home');
    const heroVisual = document.getElementById('heroVisual');
    const heroParticles = document.getElementById('heroParticles');
    const backdropText = document.querySelector('.hero-backdrop-text');

    // Create ambient glowing particles in Hero
    if (heroParticles) {
        for (let i = 0; i < 16; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            const size = Math.random() * 4 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 80 + 10}%`;
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            heroParticles.appendChild(particle);
        }
    }

    // 3D Tilt Parallax Effect on Mouse Movement
    if (heroSection && heroVisual) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

            // Subtle 3D tilt on the Hero orb card stack
            heroVisual.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
            
            if (backdropText) {
                backdropText.style.transform = `translate(${x * -25}px, ${y * -15}px)`;
            }
        });

        heroSection.addEventListener('mouseleave', () => {
            heroVisual.style.transform = 'rotateY(0deg) rotateX(0deg)';
            if (backdropText) backdropText.style.transform = 'translate(0, 0)';
        });
    }

    // ─── 4. Mood Range Label ───────────────────────────────────────────
    const moodLevelInput = document.getElementById('mood_level');
    const moodValLabel = document.getElementById('moodValLabel');
    if (moodLevelInput && moodValLabel) {
        moodLevelInput.addEventListener('input', () => {
            moodValLabel.textContent = moodLevelInput.value;
            fetchAISuggestions(activePeriod, moodLevelInput.value);
        });
    }

    // ─── 5. AI Suggestions Fetching ───────────────────────────────────
    let activePeriod = 'evening';
    const periodTabs = document.querySelectorAll('.period-tab');
    const aiTitle = document.getElementById('aiTitle');
    const aiMessage = document.getElementById('aiMessage');
    const aiGrid = document.getElementById('aiActivitiesGrid');

    async function fetchAISuggestions(period = 'evening', mood = 5) {
        try {
            const res = await fetch(`/api/ai-suggestions?period=${period}&mood_level=${mood}`);
            if (!res.ok) throw new Error('API failed');
            const data = await res.json();
            
            if (data.status === 'success' && data.suggestions) {
                const sug = data.suggestions;
                if (aiTitle) aiTitle.textContent = sug.title;
                if (aiMessage) aiMessage.textContent = sug.message;
                
                if (aiGrid) {
                    aiGrid.innerHTML = sug.activities.map(act => `
                        <div class="feature-card glass-panel" style="padding: 1.5rem;">
                            <div class="feature-icon" style="width: 44px; height: 44px; font-size: 1.4rem;">${act.icon}</div>
                            <h3 style="font-size: 1.1rem; margin-top: 0.5rem;">${act.name}</h3>
                            <div style="color: var(--accent-emerald); font-size: 0.8rem; font-weight: 600;">⏱️ ${act.duration}</div>
                            <p style="font-size: 0.85rem; margin-top: 0.2rem;">🌱 ${act.benefit}</p>
                        </div>
                    `).join('');
                }
            }
        } catch (err) {
            console.warn('Backend fallback for AI suggestions:', err);
        }
    }

    periodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            periodTabs.forEach(t => {
                t.classList.remove('active', 'btn-solid');
                t.classList.add('btn-ghost');
            });
            tab.classList.remove('btn-ghost');
            tab.classList.add('active', 'btn-solid');
            activePeriod = tab.dataset.period;
            fetchAISuggestions(activePeriod, moodLevelInput ? moodLevelInput.value : 5);
        });
    });

    fetchAISuggestions('evening', 5);

    // ─── 6. 4-7-8 Breathing Exercise ───────────────────────────────────
    const breathOrbWrap = document.getElementById('breathOrbWrap');
    const breathPhase = document.getElementById('breathPhase');
    const breathTimer = document.getElementById('breathTimer');
    const startBreathBtn = document.getElementById('startBreathBtn');
    const stopBreathBtn = document.getElementById('stopBreathBtn');

    let breathInterval = null;
    let phaseIndex = 0;
    let timerValue = 0;

    const phases = [
        { label: 'Inhale deeply...', duration: 4, class: 'expanding' },
        { label: 'Hold breath...', duration: 7, class: 'holding' },
        { label: 'Exhale slowly...', duration: 8, class: 'contracting' }
    ];

    function runBreathingPhase() {
        const current = phases[phaseIndex];
        timerValue = current.duration;
        
        if (breathOrbWrap) breathOrbWrap.className = `breath-orb-wrap ${current.class}`;
        if (breathPhase) breathPhase.textContent = current.label;
        if (breathTimer) breathTimer.textContent = String(timerValue).padStart(2, '0');

        breathInterval = setInterval(() => {
            timerValue--;
            if (breathTimer) breathTimer.textContent = String(timerValue).padStart(2, '0');

            if (timerValue <= 0) {
                clearInterval(breathInterval);
                phaseIndex = (phaseIndex + 1) % phases.length;
                runBreathingPhase();
            }
        }, 1000);
    }

    if (startBreathBtn) {
        startBreathBtn.addEventListener('click', () => {
            startBreathBtn.style.display = 'none';
            if (stopBreathBtn) stopBreathBtn.style.display = 'inline-flex';
            phaseIndex = 0;
            runBreathingPhase();
        });
    }

    if (stopBreathBtn) {
        stopBreathBtn.addEventListener('click', () => {
            clearInterval(breathInterval);
            if (breathOrbWrap) breathOrbWrap.className = 'breath-orb-wrap';
            if (breathPhase) breathPhase.textContent = 'Press Start to Begin';
            if (breathTimer) breathTimer.textContent = '04';
            stopBreathBtn.style.display = 'none';
            if (startBreathBtn) startBreathBtn.style.display = 'inline-flex';
        });
    }

    // ─── 7. LocalStorage Data Persistence & Chart ─────────────────────
    const scoreProgress = document.getElementById('scoreProgress');
    const scoreVal = document.getElementById('scoreVal');
    const scoreStatus = document.getElementById('scoreStatus');
    let chartInstance = null;

    function getHistory() {
        const stored = localStorage.getItem('ayurveda_history');
        if (stored) {
            try { return JSON.parse(stored); } catch (e) {}
        }
        return [
            { day: 'Mon', score: 68, mood: 6, sleep: 6.5 },
            { day: 'Tue', score: 74, mood: 7, sleep: 7.0 },
            { day: 'Wed', score: 80, mood: 8, sleep: 7.5 },
            { day: 'Thu', score: 78, mood: 7, sleep: 7.0 },
            { day: 'Fri', score: 85, mood: 9, sleep: 8.0 },
            { day: 'Sat', score: 82, mood: 8, sleep: 7.5 },
            { day: 'Today', score: 88, mood: 9, sleep: 8.5 }
        ];
    }

    function saveHistory(history) {
        localStorage.setItem('ayurveda_history', JSON.stringify(history));
    }

    function setScoreUI(score) {
        const clamped = Math.min(100, Math.max(0, score));
        if (scoreVal) scoreVal.textContent = clamped;
        
        if (scoreProgress) {
            const offset = 377 - (377 * clamped / 100);
            scoreProgress.style.strokeDashoffset = offset;
        }

        if (scoreStatus) {
            if (clamped >= 80) scoreStatus.textContent = "Your aura is radiant and in full harmony today! ✨";
            else if (clamped >= 60) scoreStatus.textContent = "Your aura is steady and balanced. 🌿";
            else scoreStatus.textContent = "Your aura needs rest. Focus on Soma Zone practices. 🌙";
        }
    }

    function updateChart(historyData) {
        const ctx = document.getElementById('wellnessChart');
        if (!ctx) return;

        const labels = historyData.map(item => item.day);
        const scores = historyData.map(item => item.score);

        if (chartInstance) {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = scores;
            chartInstance.update();
        } else {
            chartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Wellness Index',
                        data: scores,
                        borderColor: '#00f5d4',
                        backgroundColor: 'rgba(0, 245, 212, 0.12)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointRadius: 5,
                        pointBackgroundColor: '#00f5d4'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#b8a7ea' },
                            grid: { color: 'rgba(184, 167, 234, 0.08)' }
                        },
                        y: {
                            ticks: { color: '#b8a7ea' },
                            grid: { color: 'rgba(184, 167, 234, 0.08)' },
                            min: 40,
                            max: 100
                        }
                    }
                }
            });
        }
    }

    const history = getHistory();
    const latestScore = history[history.length - 1].score;
    setScoreUI(latestScore);
    updateChart(history);

    // ─── 8. Form Submission Handler ───────────────────────────────────
    const wellnessForm = document.getElementById('wellnessForm');
    if (wellnessForm) {
        wellnessForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const mood = parseInt(document.getElementById('mood_level').value) || 5;
            const sleep = parseFloat(document.getElementById('sleep_hours').value) || 7.5;
            const water = parseFloat(document.getElementById('water_intake').value) || 2.5;
            const exercise = parseInt(document.getElementById('exercise_time').value) || 30;

            const calculatedScore = Math.min(100, Math.round(
                (mood * 4) + 
                (Math.min(sleep, 8) / 8 * 30) + 
                (Math.min(water, 3) / 3 * 15) + 
                (Math.min(exercise, 60) / 60 * 15)
            ));

            const currentHistory = getHistory();
            currentHistory[currentHistory.length - 1] = {
                day: 'Today',
                score: calculatedScore,
                mood: mood,
                sleep: sleep
            };
            saveHistory(currentHistory);

            setScoreUI(calculatedScore);
            updateChart(currentHistory);

            showToast(`✨ Wellness Logged! Aura Score: ${calculatedScore}/100`);
        });
    }
});