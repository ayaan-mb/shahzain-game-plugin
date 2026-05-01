(function () {
  'use strict';

  var GAME_DURATION_MS = 6 * 60 * 1000;
  var PASS_PHRASE = 'dr driving';

  function initGame(root) {
    var startScreen = root.querySelector('[data-start-screen]');
    var passphraseInput = root.querySelector('[data-passphrase-input]');
    var startButton = root.querySelector('[data-start-button]');
    var helper = root.querySelector('[data-helper-text]');
    var gameUi = root.querySelector('[data-game-ui]');
    var gameOverPanel = root.querySelector('[data-game-over]');
    var restartButton = root.querySelector('[data-restart-button]');
    var timerEl = root.querySelector('[data-timer]');
    var scoreEl = root.querySelector('[data-score]');
    var speedEl = root.querySelector('[data-speed]');
    var finalScoreEl = root.querySelector('[data-final-score]');
    var canvas = root.querySelector('[data-game-canvas]');
    var ctx = canvas.getContext('2d');

    var keys = { left: false, right: false, up: false, down: false };
    var laneCount = 3;
    var laneWidth = canvas.width / laneCount;
    var roadOffset = 0;
    var score = 0;
    var speed = 2;
    var maxSpeed = 11;
    var minSpeed = 1;
    var player = { x: canvas.width / 2 - 15, y: canvas.height - 110, w: 30, h: 54, flash: 0 };
    var traffic = [];
    var trafficModels = [
      { name: 'ALTO', color: '#90a4ae', roof: '#cfd8dc', light: '#ffe082' },
      { name: 'COROLLA', color: '#b0bec5', roof: '#eceff1', light: '#ffd54f' },
      { name: 'CIVIC', color: '#ffffff', roof: '#e0e0e0', light: '#ffcc80' }
    ];
    var running = false;
    var ended = false;
    var startTime = 0;
    var lastTs = 0;
    var spawnTicker = 0;

    function resetState() {
      score = 0;
      speed = 2;
      roadOffset = 0;
      traffic = [];
      ended = false;
      player.x = canvas.width / 2 - player.w / 2;
      player.flash = 0;
      scoreEl.textContent = '0';
      speedEl.textContent = '0';
      timerEl.textContent = '06:00';
      finalScoreEl.textContent = '0';
    }

    function clampPlayer() {
      var minX = laneWidth * 0.15;
      var maxX = canvas.width - player.w - laneWidth * 0.15;
      if (player.x < minX) player.x = minX;
      if (player.x > maxX) player.x = maxX;
    }

    function addTrafficCar() {
      var lane = Math.floor(Math.random() * laneCount);
      var carW = 28;
      var carH = 50;
      var model = trafficModels[Math.floor(Math.random() * trafficModels.length)];
      traffic.push({
        x: lane * laneWidth + (laneWidth - carW) / 2,
        y: -carH - 20,
        w: carW,
        h: carH,
        model: model
      });
    }

    function drawRoad(dt) {
      roadOffset += speed * dt * 0.28;
      if (roadOffset > 60) roadOffset = 0;

      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#fbc02d';
      ctx.fillRect(0, 0, 8, canvas.height);
      ctx.fillRect(canvas.width - 8, 0, 8, canvas.height);

      ctx.strokeStyle = '#d6d6d6';
      ctx.lineWidth = 4;
      ctx.setLineDash([24, 22]);
      for (var i = 1; i < laneCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * laneWidth, -60 + roadOffset);
        ctx.lineTo(i * laneWidth, canvas.height);
        ctx.stroke();
      }
      ctx.setLineDash([]);
    }

    function drawCar(x, y, w, h, style, isPlayer) {
      ctx.fillStyle = style.color;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle = style.roof;
      ctx.fillRect(x + 4, y + 6, w - 8, 14);
      ctx.fillStyle = '#1f1f1f';
      ctx.fillRect(x + 6, y + 8, w - 12, 10);
      ctx.fillStyle = style.light;
      ctx.fillRect(x + 3, y + h - 7, w - 6, 3);
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(x + 3, y + 2, w - 6, 2);

      if (!isPlayer && style.name) {
        ctx.fillStyle = '#101010';
        ctx.font = 'bold 8px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(style.name, x + w / 2, y + h - 12);
      }

      if (isPlayer && player.flash > 0) {
        ctx.fillStyle = 'rgba(255, 60, 60, 0.6)';
        ctx.fillRect(x - 4, y - 4, w + 8, h + 8);
      }
    }

    function intersects(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    function endGame() {
      running = false;
      ended = true;
      gameUi.classList.add('is-hidden');
      gameOverPanel.classList.remove('is-hidden');
      finalScoreEl.textContent = String(Math.max(0, Math.floor(score)));
    }

    function update(ts) {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      var dt = (ts - lastTs) / 16.666;
      lastTs = ts;

      var elapsed = ts - startTime;
      var remaining = Math.max(0, GAME_DURATION_MS - elapsed);
      var minutes = String(Math.floor(remaining / 60000)).padStart(2, '0');
      var seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0');
      timerEl.textContent = minutes + ':' + seconds;

      if (remaining <= 0) {
        endGame();
        return;
      }

      if (keys.up) speed += 0.12 * dt;
      if (keys.down) speed -= 0.14 * dt;
      speed = Math.min(maxSpeed, Math.max(minSpeed, speed));

      if (keys.left) player.x -= (4 + speed * 0.25) * dt;
      if (keys.right) player.x += (4 + speed * 0.25) * dt;
      clampPlayer();

      spawnTicker += dt;
      if (spawnTicker > Math.max(24 - speed * 1.6, 8)) {
        addTrafficCar();
        spawnTicker = 0;
      }

      for (var i = traffic.length - 1; i >= 0; i--) {
        traffic[i].y += speed * 2.2 * dt + 1.1;
        if (traffic[i].y > canvas.height + 60) traffic.splice(i, 1);
      }

      traffic.forEach(function (enemy) {
        if (intersects(player, enemy)) {
          player.flash = 10;
          score = Math.max(0, score - 40);
          enemy.y = canvas.height + 100;
        }
      });

      score += (0.55 + speed * 0.13) * dt;
      scoreEl.textContent = String(Math.floor(score));
      speedEl.textContent = speed.toFixed(1);

      drawRoad(dt);
      traffic.forEach(function (enemy) { drawCar(enemy.x, enemy.y, enemy.w, enemy.h, enemy.model, false); });
      drawCar(player.x, player.y, player.w, player.h, { color: '#ffffff', roof: '#f5f5f5', light: '#ffeb3b', name: 'CIVIC' }, true);
      if (player.flash > 0) player.flash -= 1 * dt;

      window.requestAnimationFrame(update);
    }

    function startGame() {
      resetState();
      startScreen.classList.add('is-hidden');
      gameOverPanel.classList.add('is-hidden');
      gameUi.classList.remove('is-hidden');
      running = true;
      startTime = performance.now();
      lastTs = 0;
      window.requestAnimationFrame(update);
    }

    passphraseInput.addEventListener('input', function () {
      var exactMatch = passphraseInput.value === PASS_PHRASE;
      startButton.disabled = !exactMatch;
      helper.textContent = exactMatch ? 'Passphrase accepted.' : 'Phrase is case-sensitive.';
    });

    startButton.addEventListener('click', function () {
      if (passphraseInput.value === PASS_PHRASE) startGame();
    });

    restartButton.addEventListener('click', function () {
      startScreen.classList.remove('is-hidden');
      gameOverPanel.classList.add('is-hidden');
      passphraseInput.value = PASS_PHRASE;
      passphraseInput.dispatchEvent(new Event('input'));
      passphraseInput.focus();
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') keys.left = true;
      if (e.key === 'ArrowRight') keys.right = true;
      if (e.key === 'ArrowUp') keys.up = true;
      if (e.key === 'ArrowDown') keys.down = true;
    });

    window.addEventListener('keyup', function (e) {
      if (e.key === 'ArrowLeft') keys.left = false;
      if (e.key === 'ArrowRight') keys.right = false;
      if (e.key === 'ArrowUp') keys.up = false;
      if (e.key === 'ArrowDown') keys.down = false;
    });

    root.querySelectorAll('[data-touch]').forEach(function (btn) {
      var keyName = btn.getAttribute('data-touch');
      var setState = function (state) { keys[keyName] = state; };
      btn.addEventListener('touchstart', function (e) { e.preventDefault(); setState(true); }, { passive: false });
      btn.addEventListener('touchend', function () { setState(false); });
      btn.addEventListener('mousedown', function () { setState(true); });
      btn.addEventListener('mouseup', function () { setState(false); });
      btn.addEventListener('mouseleave', function () { setState(false); });
    });

    resetState();
  }

  document.querySelectorAll('[data-game-root]').forEach(initGame);
})();
