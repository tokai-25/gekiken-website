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
      // ページ読み込み完了後に1秒待って幕を開ける
      window.addEventListener('load', () => {
        setTimeout(() => {
          document.body.classList.add('loaded');
        }, 1000);
      });
    }
  };
  handleLoader();

  // --- 2. カウントダウンタイマー ---
  const updateCountdown = () => {
    // 公演初日の日付を設定
    const targetDate = new Date('2026/03/01 00:00:00'); 
    const now = new Date();
    const diff = targetDate - now;
    
    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      if (days > 0) {
        countdownEl.textContent = days;
      } else if (days === 0) {
        countdownEl.textContent = "本日";
      } else {
        countdownEl.textContent = "終";
      }
    }
  };
  updateCountdown();

 // --- 3. 役割紹介：詳細表示機能（スマホ時は手動、PC時は無限スクロール） ---
  const roleSectionSetup = () => {
    const roleTrack = document.getElementById('roleTrack');
    const roleDescBox = document.getElementById('roleDescription');
    const roleTitle = document.getElementById('roleTitle');
    const roleText = document.getElementById('roleText');

    if (roleTrack && roleDescBox) {
      // PCの時だけ無限ループ用に複製する
      if (window.innerWidth > 768) {
        const cloneItems = roleTrack.innerHTML;
        roleTrack.innerHTML += cloneItems;
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
            
            // スマホの時、タップしたら説明文までスッと画面を誘導する
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
  roleSectionSetup();

  // --- 4. ヒーローセクション：スライダー制御 ---
  const initHeroSlider = () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    if (slides.length > 1) {
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 5000);
    }
  };
  initHeroSlider();

  // --- 5. ハンバーガーメニュー & スムーススクロール ---
  const navSetup = () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const backToTop = document.getElementById('backToTop');

    // ハンバーガー開閉
    hamburger?.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu?.classList.toggle('active');
    });

    // スクロール時のトップ戻るボタン表示
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop?.classList.add('show');
      } else {
        backToTop?.classList.remove('show');
      }
    });

    // ページ内リンクのスムーススクロール
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
          
          // スマホメニューを閉じる
          navMenu?.classList.remove('active');
          hamburger?.classList.remove('active');
        }
      });
    });
  };
  navSetup();

  // --- 6. 視覚演出：Intersection Observer (フェードイン系) ---
  const initScrollAnimations = () => {
    const options = { threshold: 0.15 };

    // A. 基本のフェードイン
    const basicObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);
    document.querySelectorAll('.fade-in').forEach(el => basicObserver.observe(el));

    // B. 部員紹介：カードのポップアップ
    const memberObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.member-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0) scale(1)";
            }, index * 120);
          });
        }
      });
    }, options);
    const memberContainer = document.querySelector('.member-container');
    if (memberContainer) memberObserver.observe(memberContainer);

    // C. 制作ステップ：順次表示
    const processObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const steps = entry.target.querySelectorAll('.process-step');
          steps.forEach((step, index) => {
            setTimeout(() => {
              step.style.opacity = "1";
              step.style.transform = "translateY(0)";
            }, index * 180);
          });
        }
      });
    }, options);
    const processWrapper = document.querySelector('.process-wrapper');
    if (processWrapper) processObserver.observe(processWrapper);
  };
  initScrollAnimations();

  // --- 7. キャッチコピーのランダム表示 ---
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

  // --- 8. パスワード機能（部員・家族専用） ---
  window.enterMembersPage = function() {
    const password = prompt("部員・家族専用パスワードを入力してください:");
    if (password === "enken2025") { 
      window.location.href = "members.html";
    } else if (password !== null) {
      alert("パスワードが正しくありません。");
    }
  };


});

