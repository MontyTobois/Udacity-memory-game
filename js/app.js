/* Create a list that holds all of your cards */
const icons = ["fa fa-battery-full", "fa fa-battery-full", "fa fa-slack", "fa fa-slack", "fa fa-codepen", "fa fa-codepen", "fa fa-mobile", "fa fa-mobile", "fa fa-google-plus", "fa fa-google-plus", "fa fa-dropbox", "fa fa-dropbox", "fa fa-html5", "fa fa-html5", "fa fa-rss-square", "fa fa-rss-square"];
///global varaiables
const cardsHolder = document.querySelector(".deck");
const starIcon = `<li><i class="fa fa-star"></i></li>`
let openCards = [];
let pairCards = [];
let firstClick = false;
let clockOff = true;
let time = 0;
let clockId;
let moves = 0;

/* Display the cards on the page   - shuffle the list of cards using the provided "shuffle" method below   - loop through each card and create its HTML   - add each card's HTML to the page */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* set up the event listener for a card. If a card is clicked:  - display the card's symbol (put this functionality in another function that you call from this one)  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)  - if the list already has another card, check to see if the two cards match    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one) */

///Creates the memory game

function init() {
  const shuffleIcons = shuffle(icons)
  for (let i = 0; i < icons.length; i++) {
    const card = document.createElement("li");
    card.classList.add("card");
    card.innerHTML = `<i class="${icons[i]}"></i>`;
    cardsHolder.appendChild(card);

    // Add click event to cards
    click(card);
  }
}

/*Click function for cards, also checks for first click
- will increment the moves by 1*/
function click(card) {
  card.addEventListener("click", function() {
    const currCard = this;
    const prevCard = openCards[0];
    //will start the clock and increment once card is card for first time
    if (firstClick === false) {
      firstClick = true;
      if (clockOff) {
        startTimer();
        addMove();
        clockOff = false;
      }
    }


    // Checks to see if one card has been clicked
    if (openCards.length === 1) {
      card.classList.add("open", "show", "disabled");
      openCards.push(this);

      // Checks to see if two cards have been clicked
      compare(currCard, prevCard);

    } else {

      // Checks if no cards have been clicked
      currCard.classList.add("open", "show", "disabled");
      openCards.push(this);
    }
  });
}

///Compares two cards that have been clicked for a match///
function compare(currCard, prevCard) {

  /// Matched cards///
  if (currCard.innerHTML === prevCard.innerHTML) {
    currCard.classList.add("match");
    prevCard.classList.add("match");
    pairCards.push(currCard, prevCard);
    openCards = [];

    /// Check if game is OVER after all cards have been matched///
    gameOver();

  } else {

    //Wait a 400ms , than flip back to normal///
    setTimeout(function() {
      currCard.classList.remove("open", "show", "disabled");
      prevCard.classList.remove("open", "show", "disabled");
    }, 400);

    openCards = [];
  }

  ///Will increment the move when cards are flipped back///
  addMove();
}

///Modal for Winners
function toggleModal() {
  const modal = document.querySelector('.modal');
  modal.classList.toggle("hide");
}

///Grabs the stats from the game and displays them for winner///
function fillInStats() {
  const timeStat = document.querySelector('.modal-time');
  const movesStat = document.querySelector('.modal-moves');
  const starsStat = document.querySelector('.modal-star');
  const clockTime = document.querySelector('.clock').innerHTML;
  const stars = getStars();
  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML = `Stars = ${stars}`;

}

///When game is over clock with stop, modal appears with stats//
function gameOver() {
  if (pairCards.length === icons.length) {
    stopClock();
    fillInStats();
    toggleModal();
  }
}

///Ratings for game, stars will be removed based on how many clicks on deck///
const starsHolder = document.querySelector(".stars");

function rating() {
  switch (moves) {
    case 15:
      starsHolder.innerHTML = starIcon + starIcon;
      break;
    case 25:
      starsHolder.innerHTML = starIcon;
      break;
  }
}

///Grabs the stars to shows in modal///
function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount++
    }
  }
  return starCount;
}

///Time Function///
function startTimer() {
  clockId = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

//Shows the time after a card has been clicked//
function displayTime() {
  const clock = document.querySelector('.clock');
  clock.innerHTML = time;

  //controls the seconds into minutes
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  //holds the placement for minutes and seconds
  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

///Stops the clock after all cards have matched///
function stopClock() {
  clearInterval(clockId);
}

///Checks the users click, every two cards that are flipped equals one move
const movesHolder = document.querySelector(".moves");

function addMove() {
  movesHolder.innerHTML = moves;
  rating();
  moves++;
}

///Cancel button////
const cancelBtn = document.querySelector('.modal-cancel');
cancelBtn.addEventListener('click', function() {
  toggleModal();
});

///Restart game for a clean slate///
const resetbtn = document.querySelector(".restart");
resetbtn.addEventListener("click", function() {
  // Delete all cards
  cardsHolder.innerHTML = "";

  //Call `init` to re-create card game
  init();

  //Reset game
  reset();
});

////Replay Game try again ////
const modalReplayBtn = document.querySelector('.modal-replay');
modalReplayBtn.addEventListener("click", function() {
  //Resets all cards position
  cardsHolder.innerHTML = "";

  //Call `init` to re-create card game
  init();

  //Reset game, remove modal for next game///
  reset();
  toggleModal();
});


//Resets the game to the orignal state///
function reset() {
  pairCards = []
  // sets time to zero and wont start until cards is clicked
  time = 0;
  clockOff = true;
  displayTime();

  //sets moves to zero
  moves = 0;
  movesHolder.innerHTML = moves;

  /*stops the clock when hitting reset or replay button,
  once clicked clock will increment*/
  stopClock();
  firstClick = false;

  ///places the stars back to three
  starsHolder.innerHTML = starIcon + starIcon + starIcon;
}

//////////Start Game for the first time!////////
init();
