/*
spaghetti
python3 -m http.server 8000
http://localhost:8000/
for testing features which can only be done over http 
*/
import { card, deck } from "./CardControl.js";
import { Pulse } from "./Background.js";
// gets the document elements which will be modified later
const PlayingBoard = document.getElementById("board");
const awnserBox = document.getElementById("awnser");
const streakDisplay = document.getElementById("streak");
const RevealText = document.getElementById("reveal");
const startingFile = "hist1610-88-p1.json";
//creates the decks which will be used later
let PlayingDeck = new deck();
let FailDeck =  new deck();
let SuccessfulDeck = new deck();
let DestructableDeck = new deck();

let currentStreak = 0;
let currentCard;
let placeholderCardfront; //for the placeholder cardfront

async function startFromFile(){
    //gets the json file 
    await fetch("./Question_Sets/" + startingFile)
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the JSON data from the response
            return response.json();
        })
        .then(data => {
            PlayingDeck.parseDataToCards(data)
        })
}

function returnCardsToPlayingDeck() {
    if (FailDeck.cards.length > 0){
        while (FailDeck.cards.length > 0) {
            const CardData = FailDeck.cards.pop();
            //we need to create a copy as we need to delete the original card
            const CardCopy = new card(CardData.prompt,CardData.awnser,CardData.destructable);
            PlayingDeck.addCardToDeck(CardCopy);
            //deletes the card element from the document
            CardData.ChangeCardPostion("ReturnToDeckFromLeft");
            CardData.selfDestruct()
        }
        while (DestructableDeck.cards.length > 0){
            const CardData = DestructableDeck.cards.pop();
            console.log(CardData);
            //we need to create a copy as we need to delete the original card
            const CardCopy = new card(CardData.prompt,CardData.awnser, true);
            PlayingDeck.addCardToDeck(CardCopy);
            //deletes the card element from the document
            CardData.ChangeCardPostion("ReturnToDeckFromLeft");
            CardData.voidCard.remove();
            CardData.selfDestruct()
        }
    }
    // else all validated cards are added to the playing deck
    else{
        while (SuccessfulDeck.cards.length > 0) {
            const CardData = SuccessfulDeck.cards.pop();
            //we need to create a copy as we need to delete the original card
            const CardCopy = new card(CardData.prompt,CardData.awnser,CardData.destructable);
            PlayingDeck.addCardToDeck(CardCopy);
            //deletes the card element from the document
            CardData.ChangeCardPostion("ReturnToDeckFromRight");
            CardData.selfDestruct()
        }
    }
        // FIX THIS LATER
        //adds the place holder when the deck is reset 
    if (!placeholderCardfront) {
        placeholderCardfront = new card("this is a place holder","no");
        PlayingBoard.appendChild(placeholderCardfront.cardElement)
        placeholderCardfront.ChangeCardPostion("toFailPosition")
        placeholderCardfront.ChangeCardPostion("ReturnToDeckFromLeft")
    }
    setTimeout(()=>{
        //after the animation is done then we push out the card for cohesion
        drawNextCard();
    }, 1450);
}
function drawNextCard(){
    currentCard = PlayingDeck.pushNextCardToBoard(PlayingBoard)
    if(!currentCard){
        awnserBox.style.display = "none";
        setTimeout(() =>{
            returnCardsToPlayingDeck();
        },1450);
    }
    else{
        awnserBox.style.display = "none"
        setTimeout( () =>{
            awnserBox.style.display = "block"
        },1450);
    }
}
window.onload = async function(){
    await startFromFile();
    console.log(PlayingDeck)
    //starts the entire quizing loop
    drawNextCard();
}
let hasAwnseredIncorrectly = false
function verifyAwnser(){
    let userAwnser = awnserBox.value;
    awnserBox.value = "";
    const isCorrect = currentCard.CompareAwnsers(userAwnser);

    //if user awnsers right on the first try
    if (isCorrect && !hasAwnseredIncorrectly) {
        currentStreak++;
        if(currentCard.destructable){ //doesn't readd the question if it is one time use
            currentCard.cardElement.remove()
        }
        else{
            SuccessfulDeck.addCardToDeck(currentCard);
            currentCard.ChangeCardPostion("toSuccessfulPosition");
        }
        drawNextCard()
        hasAwnseredIncorrectly = false;
    }
    //if user gets it after a try or two (main focus)
    else if (isCorrect && hasAwnseredIncorrectly){
        currentStreak = 0;
        FailDeck.addCardToDeck(currentCard);
        currentCard.ChangeCardPostion("toFailPosition");
        drawNextCard()
        
        //resets the varible for the next question 
        hasAwnseredIncorrectly = false;
        RevealText.textContent = "";
    }
    //if user is just straight up wrong
    else if (!hasAwnseredIncorrectly) {
        hasAwnseredIncorrectly = true;
        DestructableDeck.addCardToDeck(currentCard.createVoidCard(PlayingBoard))
        currentStreak = 0;
        RevealText.textContent = `The actual awnser is: ${currentCard.awnser[0]}`
    }
    //changes the streak counter
    streakDisplay.textContent =  `Your current streak is: ${currentStreak}`;
}
document.addEventListener("keydown", (input) => {
    //when the user presses enter and there is awnser it verifies the awnser
    if (input.key == "Enter" && awnserBox.value != "") {
        verifyAwnser();
        Pulse()
    }
});
