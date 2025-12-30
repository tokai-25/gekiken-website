/**
 * 東海大学クラブ連合会演劇研究会 公式サイト
 * 全機能統合型スクリプト (最終完成版)
 * Designed by 4C黒木公輔
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. ローディング演出（幕が開くタイミング） ---
  const handleLoader = () => {
    const loader = document.getElementById('loader');
    if (loader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          document.body.classList.add('loaded');
        }, 1000);
      });
    }
  };

  // --- 2. カウントダウンタイマー（予約開始ターゲット版） ---
  const updateCountdown = () => {
    const targetDate = new Date('2026/02/10 10:00:00'); 
    const now = new Date();
    const diff = targetDate - now;
    
    const countdownEl = document.getElementById('countdown');
    const subtitleEl = document.querySelector('.hero-subtitle');

    if (countdownEl) {
      if (diff > 0) {
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        countdownEl.textContent = days;
      } else {
        if (subtitleEl) {
          subtitleEl.innerHTML = '<span style="color:#ff4d4d; font-weight:bold; font-size:1.2rem;">チケット好評予約受付中！</span>';
        }
      }
    }
  };

  // --- 3. 予約ボタンの自動状態切り替え（固定ボタン・全箇所対応） ---
  const updateReservationButton = () => {
    const reservationLinks = document.querySelectorAll("a[href*='form.run']");
    const openDate = new Date('2026/02/10 10:00:00');
    const now = new Date();

    reservationLinks.forEach(link => {
      if (link.classList.contains('nav-special')) return;

      if (now < openDate) {
        link.innerText = "2/10 10:00 予約開始";
        link.style.background = "#666"; 
        link.style.pointerEvents = "auto"; 
        link.style.cursor = "not-allowed";
        
        if (link.parentElement.classList.contains('mobile-sticky-cta')) {
          link.parentElement.style.background = "#444";
        }

        link.onclick = (e) => {
          e.preventDefault();
          alert("【予約受付前】\n2月10日(火) 10:00より予約を開始いたします。カレンダー登録をご活用ください！");
        };
      } else {
        link.style.background = ""; 
        link.style.cursor = "pointer";
        link.onclick = null;
        if (link.parentElement.classList.contains('mobile-sticky-cta')) {
          link.parentElement.style.background = "";
        }
      }
    });
  };

  // --- 4. 役割紹介：詳細表示（スマホスワイプ・PC自転対応） ---
  const roleSectionSetup = () => {
    const roleTrack = document.getElementById('roleTrack');
    const roleDescBox = document.getElementById('roleDescription');
    const roleTitle = document.getElementById('roleTitle');
    const roleText = document.getElementById('roleText');

    if (roleTrack && roleDescBox) {
      if (window.innerWidth > 768 && !roleTrack.dataset.cloned) {
        const cloneItems = roleTrack.innerHTML;
        roleTrack.innerHTML += cloneItems; 
        roleTrack.dataset.cloned = "true";
      }

      roleTrack.addEventListener('click', (e) => {
        const item = e.target.closest('.role-item');
        if (item) {
          const name = item.getAttribute('data-name');
          const desc = item.getAttribute('data-desc');
          
          roleDescBox.style.opacity = "0";
          setTimeout(() => {
            roleTitle.textContent = name;
            roleText.textContent = desc;
            roleDescBox.style.display = 'block';
            roleDescBox.style.transition = "opacity 0.4s ease";
            roleDescBox.style.opacity = "1";
            
            if (window.innerWidth <= 768) {
              setTimeout(() => {
                roleDescBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }, 100);
            }
          }, 150);
        }
      });
    }
  };

  // --- 5. ハンバーガーメニュー & スムーススクロール ---
  const navSetup = () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const backToTop = document.getElementById('backToTop');

    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu?.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop?.classList.add('show');
      } else {
        backToTop?.classList.remove('show');
      }
    });

    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', e => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const offset = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
          
          navMenu?.classList.remove('active');
          hamburger?.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    });
  };

  // --- 6. 視覚演出（Intersection Observer） ---
  const initScrollAnimations = () => {
    const options = { threshold: 0.15 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, options);
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  };

  // --- 7. キャッチコピーのランダム表示 ---
  const initTyping = () => {
    const typingH1 = document.querySelector('.typing');
    if (typingH1) {
      const phrases = [
        "物語が、ここから始まる。",
        "舞台の裏表、すべてが僕らの居場所。",
        "一瞬の煌めきを、永遠の記憶に。",
        "「壁」を建て、別世界を創り出す。"
      ];
      typingH1.textContent = phrases[Math.floor(Math.random() * phrases.length)];
    }
  };

  // --- 8. パスワード機能（部員・家族専用） ---
  window.enterMembersPage = function() {
    const password = prompt("部員・家族専用パスワードを入力してください:");
    if (password === "enken2025") { 
      window.location.href = "members.html";
    } else if (password !== null) {
      alert("パスワードが正しくありません。");
    }
  };

  // --- 9. スクロール監視：メニューの「現在地」を光らせる ---
  const scrollActiveHeader = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navMenu ul li a');

    window.addEventListener('scroll', () => {
      let current = "";
      const scrollY = window.pageYOffset;

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  };

  // --- 10. 初期実行（ここで全ての機能を動かす） ---
  handleLoader();
  updateCountdown();
  updateReservationButton();
  roleSectionSetup();
  navSetup();
  initScrollAnimations();
  initTyping();
  scrollActiveHeader();

  // 1分ごとに更新
  setInterval(() => {
    updateCountdown();
    updateReservationButton();
  }, 60000);
});

function getRouteToSquareHall() {
    // スクエアホールのPlace IDを指定
    const placeId = "ChIJ45GPAv2pGWARDMZYp0qKTwA";
    const destinationName = "東海大学 湘南キャンパス スクエアホール";
    
    // 現在地(MY_LOCATION)から目的地へのルートURL
    // スマホのGoogleマップアプリで最適に開くパラメータ
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationName)}&destination_place_id=${placeId}&travelmode=walking`;
    
    window.open(mapUrl, '_blank');
}