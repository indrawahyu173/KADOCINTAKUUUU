/* =========================================================
   HAPPY BIRTHDAY WEBSITE — MAIN SCRIPT (REVISI LATAR HATI)
   Modular, vanilla JS, tanpa dependency eksternal.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* =====================================================
       0. AMBIL SEMUA ELEMEN YANG DIBUTUHKAN (DOM REFERENCES)
    ===================================================== */
    const welcomeScreen     = document.getElementById('welcome-screen');
    const transitionScreen  = document.getElementById('transition-screen');
    const mainScreen        = document.getElementById('main-screen');

    const heartContainer    = document.getElementById('heart-container');
    const pullInstruction   = document.getElementById('pull-instruction');

    const bgMusic           = document.getElementById('background-music');
    const musicToggleBtn    = document.getElementById('music-toggle-btn');

    const sendGiftBtn       = document.getElementById('send-gift-btn');
    const giftModal         = document.getElementById('gift-modal');
    const giftModalOverlay  = document.getElementById('gift-modal-overlay');
    const giftModalCloseBtn = document.getElementById('gift-modal-close');
    const giftModalActionBtn = document.getElementById('gift-modal-action-btn');

    const footerYearEl      = document.getElementById('footer-year');

    // Konfigurasi durasi transisi (ms)
    const TRANSITION_SCREEN_DURATION = 2200; 
    const SCREEN_FADE_DELAY          = 50;   

    let isTransitioning = false;

    /* =====================================================
       1. INTERAKSI PULL & RELEASE (BUKA KADO)
    ===================================================== */
    function handleOpenGift() {
        if (isTransitioning) return;
        isTransitioning = true;

        heartContainer.classList.add('is-released');
        pullInstruction.classList.add('is-touched');

        playBackgroundMusic();

        setTimeout(() => {
            goToTransitionScreen();
        }, 500);
    }

    heartContainer.addEventListener('click', handleOpenGift);
    pullInstruction.addEventListener('click', handleOpenGift);

    heartContainer.addEventListener('pointerdown', () => {
        heartContainer.classList.add('is-pulling');
    });

    heartContainer.addEventListener('pointerup', () => {
        heartContainer.classList.remove('is-pulling');
    });

    heartContainer.addEventListener('pointerleave', () => {
        heartContainer.classList.remove('is-pulling');
    });

    /* =====================================================
       2. TRANSISI BERUNTUN ANTAR LAYAR
    ===================================================== */
    function goToTransitionScreen() {
        welcomeScreen.classList.remove('active');

        setTimeout(() => {
            welcomeScreen.classList.add('hidden'); 
            transitionScreen.classList.add('active');

            setTimeout(() => {
                goToMainScreen();
            }, TRANSITION_SCREEN_DURATION);

        }, SCREEN_FADE_DELAY);
    }

    function goToMainScreen() {
        transitionScreen.classList.remove('active');

        setTimeout(() => {
            transitionScreen.classList.add('hidden');
            mainScreen.classList.add('active');

            // Catatan: Pemanggilan animasi JS kelopak gugur telah dihapus, 
            // sekarang di-handle murni oleh CSS Background.

            isTransitioning = false;
        }, SCREEN_FADE_DELAY);
    }

    /* =====================================================
       3. AUTOPLAY & KONTROL MUSIK LATAR BELAKANG
    ===================================================== */
    function playBackgroundMusic() {
        if (!bgMusic) return; 

        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    musicToggleBtn.classList.remove('is-paused');
                })
                .catch((error) => {
                    console.warn('Autoplay musik diblokir oleh browser:', error);
                    musicToggleBtn.classList.add('is-paused');
                });
        }
    }

    function toggleBackgroundMusic() {
        if (!bgMusic) return;

        if (bgMusic.paused) {
            bgMusic.play()
                .then(() => musicToggleBtn.classList.remove('is-paused'))
                .catch((error) => console.warn('Gagal memutar musik:', error));
        } else {
            bgMusic.pause();
            musicToggleBtn.classList.add('is-paused');
        }
    }

    musicToggleBtn.addEventListener('click', toggleBackgroundMusic);

    /* =====================================================
       4. MODAL KADO ("Send a Gift")
    ===================================================== */
    function openGiftModal() {
        giftModal.classList.add('active');
        giftModal.setAttribute('aria-hidden', 'false');
    }

    function closeGiftModal() {
        giftModal.classList.remove('active');
        giftModal.setAttribute('aria-hidden', 'true');
    }

    sendGiftBtn.addEventListener('click', openGiftModal);
    giftModalCloseBtn.addEventListener('click', closeGiftModal);
    giftModalActionBtn.addEventListener('click', closeGiftModal);

    giftModalOverlay.addEventListener('click', closeGiftModal);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && giftModal.classList.contains('active')) {
            closeGiftModal();
        }
    });

    /* =====================================================
       5. FOOTER — TAHUN OTOMATIS
    ===================================================== */
    if (footerYearEl) {
        footerYearEl.textContent = new Date().getFullYear();
    }

});