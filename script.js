document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  const playerSelection = document.getElementById('player-selection');
  const confirmPlayersButton = document.getElementById('confirm-players');
  const gameBoard = document.getElementById('game-board');
  const gameOverScreen = document.getElementById('game-over');
  const memoryGrid = document.getElementById('memory-grid');
  const shuffleButton = document.getElementById('shuffle-button');
  const restartButton = document.getElementById('restart-button');
  const finalScore = document.getElementById('final-score');
  const player1ScoreElement = document.getElementById('player1-score');
  const player2ScoreElement = document.getElementById('player2-score');

  let selectedPlayers = [];
  let playerScores = [0, 0];
  let currentPlayer = 0;
  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let isFlipping = false; // Flag to prevent flipping more than two cards

  const images = Array.from({ length: 12 }, (_, i) => `images/img${i + 1}.jpg`);
  const fallbackImage = 'images/default.jpg'; // Placeholder image

  // Shuffle function
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Generate cards
  function generateCards() {
    const cardImages = shuffle([...images, ...images]);
    memoryGrid.innerHTML = '';
    cardImages.forEach((image, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.image = image;
      card.innerHTML = `<img src="${image}" alt="Memory Card ${index + 1}">`;
      card.querySelector('img').onerror = function () {
        this.src = fallbackImage;
      };
      memoryGrid.appendChild(card);
    });
    cards = document.querySelectorAll('.card');
    cards.forEach((card) => card.addEventListener('click', flipCard));
  }

  // Flip card
  function flipCard() {
    if (flippedCards.length >= 2 || this.classList.contains('flipped') || isFlipping || flippedCards.includes(this)) return;

    this.classList.add('flipping');
    isFlipping = true; // Prevent further flipping
    setTimeout(() => {
      this.classList.remove('flipping');
      this.classList.add('flipped');
      flippedCards.push(this);

      if (flippedCards.length === 2) {
        checkMatch();
      } else {
        isFlipping = false; // Allow flipping again
      }
    }, 300); // Slight delay for flip effect
  }

  // Check for match
  function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.image === card2.dataset.image) {
      matchedPairs++;
      flippedCards = [];

      // Highlight matched cards before hiding
      card1.classList.add('matched');
      card2.classList.add('matched');

      setTimeout(() => {
        card1.classList.add('hidden');
        card2.classList.add('hidden');
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        isFlipping = false; // Allow flipping again
      }, 500);

      playerScores[currentPlayer]++;
      updateScores();

      if (matchedPairs === images.length) endGame();
    } else {
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        isFlipping = false; // Allow flipping again
        switchTurn();
      }, 1000);
    }
  }

  // Switch turn
  function switchTurn() {
    currentPlayer = 1 - currentPlayer;
    highlightCurrentPlayer();
  }

  // Highlight current player
  function highlightCurrentPlayer() {
    document.getElementById('scoreboard').style.boxShadow =
      currentPlayer === 0 ? "0px 0px 15px 5px rgba(255, 105, 97, 0.8)" : "0px 0px 15px 5px rgba(97, 160, 255, 0.8)";
    player1ScoreElement.style.boxShadow =
      currentPlayer === 0 ? "0px 0px 15px 5px rgba(255, 105, 97, 0.8)" : "none";
    player2ScoreElement.style.boxShadow =
      currentPlayer === 1 ? "0px 0px 15px 5px rgba(97, 160, 255, 0.8)" : "none";
  }

  // Update scores
  function updateScores() {
    document.getElementById('score1').textContent = playerScores[0];
    document.getElementById('score2').textContent = playerScores[1];
  }

  // Start Game
  startButton.addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    playerSelection.classList.remove('hidden');
  });

  document.querySelectorAll('.player-option').forEach((button) =>
    button.addEventListener('click', (e) => {
      if (selectedPlayers.length < 2) {
        selectedPlayers.push(e.target.dataset.name);
        e.target.classList.add('selected'); // Highlight the selected player
        e.target.disabled = true;
      }
      if (selectedPlayers.length === 2) {
        document.querySelectorAll('.player-option').forEach((button) => {
          button.disabled = true;
        });
        confirmPlayersButton.classList.remove('hidden');
      }
    })
  );

  confirmPlayersButton.addEventListener('click', () => {
    playerSelection.classList.add('hidden');
    gameBoard.classList.remove('hidden');
    player1ScoreElement.innerHTML = `<span style="background: linear-gradient(to right, #ff6f61, #ff9a9e); color: white; padding: 5px; border-radius: 8px;">${selectedPlayers[0]}</span>: <span id="score1">0</span>`;
    player2ScoreElement.innerHTML = `<span style="background: linear-gradient(to right, #61a0ff, #9ecfff); color: white; padding: 5px; border-radius: 8px;">${selectedPlayers[1]}</span>: <span id="score2">0</span>`;
    generateCards();
    highlightCurrentPlayer();
  });

  // Shuffle remaining cards
  shuffleButton.addEventListener('click', () => {
    const remainingCards = Array.from(document.querySelectorAll('.card:not(.flipped):not(.hidden):not(.matched)'));
    const remainingImages = remainingCards.map((card) => card.dataset.image);
    shuffle(remainingImages);

    remainingCards.forEach((card, index) => {
      card.dataset.image = remainingImages[index];
      card.querySelector('img').src = remainingImages[index];
    });
  });

  // End Game
  function endGame() {
    gameBoard.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScore.innerHTML = `<strong>${selectedPlayers[0]}</strong>: ${playerScores[0]}<br><strong>${selectedPlayers[1]}</strong>: ${playerScores[1]}`;
  }

  restartButton.addEventListener('click', () => {
    location.reload();
  });
});
