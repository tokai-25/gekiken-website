/**
 * 準備中ページ専用スクリプト (preparation.js)
 */
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. カウントダウン設定 ---
  // 目標日を2026年2月1日に設定
  const targetDate = new Date('2026/02/01 00:00:00');
  
  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    // ミリ秒を日に換算（切り上げ）
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const countdownEl = document.getElementById('countdown');
    
    if (countdownEl) {
      // 0日以下なら0を表示
      countdownEl.textContent = days > 0 ? days : 0;
    }
  }

  // --- 2. 戻るボタンの制御 ---
  const backBtn = document.getElementById('backBtn');
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // 履歴があるか（自分のサイト内から来たか）を判定
      const hasHistory = document.referrer && document.referrer.indexOf(window.location.hostname) !== -1;

      if (hasHistory) {
        window.history.back();
      } else {
        // 履歴がない場合はトップページへ（パスは適宜調整してください）
        window.location.href = "index.html"; 
      }
    });
  }

  // --- 3. アニメーション演出 ---
  const content = document.querySelector('.content');
  if (content) {
    // 最初に透明にして少し下に下げておく（JSで制御することでCSSが効かない環境でも安心）
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';
    
    // 0.1秒後にアニメーション開始
    setTimeout(() => {
      content.style.transition = 'all 1.2s cubic-bezier(0.165, 0.84, 0.44, 1)';
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }, 100);
  }

  // 初期実行
  updateCountdown();
});