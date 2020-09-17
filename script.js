const gameContainer = document.getElementById("game");
const bestScore = document.querySelector("#bestScore");
const yourScore = document.querySelector("#yourScore");
const startBtn = document.querySelector("#startBtn");
const cardNumberInput = document.querySelector("#cardNumber");
const cardNumberSetBtn = document.querySelector('#cardNumberSelectBtn');
let cardNumber = 10;
let card1Flipped;
let card1Color;
let card2Color;
let matchedPairs;
let card1;
let twoCardsFlipped;
let score;
let shuffledColors;

initialization();


cardNumberSetBtn.addEventListener('click', function(e){
  e.preventDefault();  
  cardNumber = cardNumberInput.value;
  initialization();  
})

startBtn.addEventListener('click', gameStart); //cannot be gameStart() !!


//=======================================================
function initialization(){
  card1Flipped = false;
  card1Color = "";
  card2Color = "";
  matchedPairs = 0;  
  twoCardsFlipped = false;
  score = 0;
  startBtn.innerText = "START";
  startBtn.className = "startBtn";
  yourScore.innerText = "";
  showBestScore();
  createDivsForCards(cardNumber);
}


//=========================================================
//the function exceted when start button is pressed
function gameStart() {  
  initialization();
  yourScore.innerText = `Your clicks: 0`;

  //generate random colors, shuffle them, and assign to the cards
  let colorArr = makeColorArr(cardNumber);
  shuffledColors = shuffle(colorArr);  
  setColorsForDivs(shuffledColors);
}


//======================================================
//this function creates an array including random colors
function makeColorArr(cardNum) {
  let colorArray = [];
  for (let i = 0; i < cardNum / 2; i++) {
    let color = generateRandomColor();
    colorArray.push(color);
    colorArray.push(color);
  }

  return colorArray;
}

//=======================================================
//this function generates a random color
function generateRandomColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}


//===============================================================
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}


//===============================================================
//this function creates the certain number of card blocks without colors assigned 
function createDivsForCards(cardsNumber) {
  let divs = document.querySelectorAll("#game div");
  for (let div of divs) {
    div.remove();
  }
  for (let i = 0; i < cardsNumber; i++) {
    const newDiv = document.createElement("div");
    gameContainer.append(newDiv);
  }
  showBestScore();
}

//========================================================
//this function shows the best score records for a certain number of cards which is stored in localStorage
function showBestScore() {
  if (!localStorage.getItem(`bestScore_${cardNumber}`)) {
    localStorage.setItem(`bestScore_${cardNumber}`, "No best score record");    
    bestScore.innerText = localStorage.getItem("bestScore"); 
  } 
  else {
    bestScore.innerText = `Best score for ${cardNumber} cards is: ` +  localStorage.getItem(`bestScore_${cardNumber}`);  
  }
}



//==================================================================
// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function setColorsForDivs(colorArray) {
  const divs = document.querySelectorAll("#game div");

  for (let i = 0; i < colorArray.length; i++) {
    divs[i].style.backgroundColor = "";

    // give it a class attribute for the value we are looping over
    divs[i].className = colorArray[i];

    // call a function handleCardClick when a div is clicked on
    divs[i].addEventListener("click", handleCardClick);
  }
}


//================================================================
// this function handle the event of card click
function handleCardClick(event) {
  //if all matchs found, do nothing
  if (matchedPairs === shuffledColors.length / 2) {
    return;
  }

  //if two cards are flipped at this time, return  
  if (twoCardsFlipped) return;

  if (event.target.classList.contains('completed')) return;

  if (score === 1) {
    startBtn.innerText = "RESTART";
    startBtn.className = "reStartBtn";
  }

  //flip card1 first
  if (!card1Flipped) {
    card1Flipped = true;
    card1 = event.target;
    card1Color = event.target.className;
    event.target.style.backgroundColor = card1Color;
    score++; //score increaes only when the click is valid
    yourScore.innerText = `Your clicks: ${score}`;
  }

  // flip card2
  else {
    // if click the same card twice, the second click is not valid, will continue until clicking a different one 
    if (event.target === card1) return;

    twoCardsFlipped = true;

    card2Color = event.target.className;
    event.target.style.backgroundColor = card2Color;
    score++; //score increaes only when the click is valid
    yourScore.innerText = `Your clicks: ${score}`;

    //if colors not matched, flip card1 and card2 over after 1 second
    if (card1Color !== card2Color) {
      setTimeout(function () {
        event.target.style.backgroundColor = "";
        card1.style.backgroundColor = "";
        twoCardsFlipped = false; // before this, the third click is banned   
      }, 1000);
    }

    //if colors matched, increase the matched pairs number by 1 
    //if all matched, game over
    else {
      card1.classList.add('completed');
      event.target.classList.add('completed');
      twoCardsFlipped = false;
      matchedPairs++;
      if (matchedPairs === shuffledColors.length / 2) {
        gameComplete();
      }
    }

    // no matter matched or not, reset the card1 status, ready for the next matching
    card1Flipped = false;
  }
}


//==============================================================
// this function shows the players score when game is over
function gameComplete() {
  if (localStorage.getItem(`bestScore_${cardNumber}`) === "No best score record"
      || score <= Number(localStorage.getItem(`bestScore_${cardNumber}`))) {
    localStorage.setItem(`bestScore_${cardNumber}`, score);
    yourScore.innerText = `Congratulations! Your score is ${score}. You beat the best score record!`;
  }  
  else {
    yourScore.innerText = `Your score is:  ${score}`;
  }  
}


