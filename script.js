const choices = document.querySelectorAll('.choice');
const resultText = document.getElementById('result-text');
const player1ScoreEl = document.getElementById('player1-score');
const player2ScoreEl = document.getElementById('player2-score');
const resetBtn = document.getElementById('reset-btn');
const roundsSelect = document.getElementById('rounds-select');
const modeRadios = document.querySelectorAll('input[name="mode"]');

let player1Score = 0;
let player2Score = 0;
let bestOf = parseInt(roundsSelect.value);
let mode = 'cpu'; // default mode
let player2Choice = null; // For PvP second player input

roundsSelect.addEventListener('change', () => {
  bestOf = parseInt(roundsSelect.value);
  resetGame();
});

modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    mode = radio.value;
    resetGame();
  });
});

choices.forEach(choice => {
  choice.addEventListener('click', () => {
    if(mode === 'cpu') {
      playRound(choice.dataset.choice, getCPUChoice());
    } else {
      // PvP mode
      if(!player2Choice) {
        player2Choice = choice.dataset.choice;
        resultText.textContent = "Player 2, choose your move!";
      } else {
        playRound(player2Choice, choice.dataset.choice);
        player2Choice = null; // reset for next round
      }
    }
    animateChoice(choice);
  });
});

resetBtn.addEventListener('click', resetGame);

function getCPUChoice() {
  return ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
}

function playRound(p1, p2) {
  let result = '';

  if(p1 === p2) {
    result = `🤝 Draw! Both chose ${p1}`;
  } else if (
    (p1 === 'rock' && p2 === 'scissors') ||
    (p1 === 'paper' && p2 === 'rock') ||
    (p1 === 'scissors' && p2 === 'paper')
  ) {
    result = `🎉 Player 1 Wins! ${p1} beats ${p2}`;
    player1Score++;
  } else {
    result = `🎉 Player 2 Wins! ${p2} beats ${p1}`;
    player2Score++;
  }

  resultText.textContent = result;
  player1ScoreEl.textContent = player1Score;
  player2ScoreEl.textContent = player2Score;

  checkWinner();
}

function checkWinner() {
  const neededWins = Math.ceil(bestOf / 2);
  if(player1Score === neededWins) {
    resultText.textContent = '🏆 Player 1 won the game!';
    disableChoices();
  } else if(player2Score === neededWins) {
    resultText.textContent = mode === 'cpu' ? '😢 CPU won the game!' : '🏆 Player 2 won the game!';
    disableChoices();
  }
}

function disableChoices() {
  choices.forEach(choice => choice.disabled = true);
}

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  player1ScoreEl.textContent = player1Score;
  player2ScoreEl.textContent = player2Score;
  resultText.textContent = 'Make your move!';
  choices.forEach(choice => choice.disabled = false);
  player2Choice = null;
}

function animateChoice(choiceBtn) {
  choiceBtn.style.transform = 'scale(1.4)';
  setTimeout(() => {
    choiceBtn.style.transform = 'scale(1)';
  }, 200);
}
