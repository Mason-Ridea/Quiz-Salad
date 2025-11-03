/*
spaghetti
python3 -m http.server 8000
http://localhost:8000/
for testing features which can only be done over http 
*/
const PlayingBoard = document.getElementById("board");
const awnserBox = document.getElementById("awnser");
const streakDisplay = document.getElementById("streak");
let questionFile;

class card {
    constructor (prompt,awnser,destructable = false){
        this.prompt = prompt
        this.awnser = awnser
        this.destructable = destructable

        //creates the card element for the document 
        this.cardElement = document.createElement("div");
        this.cardFront = document.createElement("div");
        this.cardBack  = document.createElement("div");
        
        //puts the prompt on the back of the card
        this.cardBack.textContent = this.prompt
        //adds the appropiate classes to the divs
        this.cardElement.classList.add("card");
        this.cardFront.classList.add("front");
        this.cardBack.classList.add("back");
        if(this.destructable){
            this.cardBack.classList.add("destroyableBack");
        }
        //appends the front and back to the cardElement
        this.cardElement.appendChild(this.cardBack);
        this.cardElement.appendChild(this.cardFront);
    }
    //puts card to center and will display the question
    addCardToMainBoard(goingToVoid=false){
        PlayingBoard.appendChild(this.cardElement);
        
        if (!goingToVoid){            
        awnserBox.style.display = "none"
        setTimeout( () =>{
            awnserBox.style.display = "block"
        },1450)
    }

    }
    //moves card to fail pile
    ChangeCardPostion(NewPosition){
        //corresponsds to a css class
        for (let i = 0; i < this.cardElement.childNodes.length; i++) {
            const element = this.cardElement.children[i];
            element.classList.add(NewPosition);
        }
    }
    createVoidCard(){
        this.voidCard = document.createElement("div");
        this.voidCard.classList.add("voidCard");
        PlayingBoard.appendChild(this.voidCard);
        
        //adds a duplicate of the card to the destructable deck 
        DestructableDeck.addCardToDeck(this); 
        /*
        let NewVoidCard = new card(this.prompt, this.awnser,true);
        NewVoidCard.ChangeCardPostion("toVoid");
        DestructableDeck.addCardToDeck(NewVoidCard);
        console.log(DestructableDeck);
        NewVoidCard.addCardToMainBoard(true);
        */
    }
    //multiple awnser can be accepted thus a function is needed to manage them
    CompareAwnsers(input){
        for (let i = 0; i < this.awnser.length; i++) {
            const element = this.awnser[i];
            if (element == input) {
                return true;
            }
        }
        return false;
    }
    selfDestruct(){
        setTimeout(() =>{
            this.cardElement.remove()
        },1450)
    }
}
let currentCard // will store the data of the current card
class deck {
    constructor(){
        this.cards = []
    }
    //will replace this with a better algo eventually 
    shuffle() {
        for (let i = 0; i < 1000; i++) {
            
            //gets two random positions
            var Index1 = Math.floor(Math.random() * this.cards.length)
            var Index2 = Math.floor(Math.random() * this.cards.length)
            //gets the cards from those positions
            var card1 = this.cards[Index1]
            var card2 = this.cards[Index2]
            //swaps them
            this.cards[Index1] = card2
            this.cards[Index2] = card1
        }
    }
    parseJsonToCards(data) {
        for (let index = 0; index < data.questions.length; index++) {
            const question = data.questions[index];
            this.addCardToDeck(new card(question.prompt, question.awnser));
        }
    }
    pushCardToBoard(){
        if (this.cards.length <= 0) {
            //checks if there are any cards left and then returns cards to playing deck
            awnserBox.style.display = "none";
            setTimeout(( //time out is needed so the last card can move to pile before the shuffle
            ) => {
                returnCardsToPlayingDeck();
            },1450);
        }
        else{
        let nextCard = this.cards.pop()
        nextCard.addCardToMainBoard()
        currentCard = nextCard
        }
    }
    addCardToDeck(card) {
        this.cards.push(card)
        //shuffle may be unesscessary
        this.shuffle()
    }
}
//instantiates the many, many active decks 
let FailDeck =  new deck()
let SuccessfulDeck = new deck()
let DestructableDeck = new deck()
let PlayingDeck = new deck()
let currentStreak = 0;

function verifyAwnser(){
    //obtains the user input and resets the input box
    let userAwnser = awnserBox.value;
    awnserBox.value = "";
    const isCorrect = currentCard.CompareAwnsers(userAwnser); 
    
    //if user awnsers right on the first try
    if (isCorrect && !hasAwnseredIncorrectly) {
        currentStreak++;
        if(currentCard.destructable) { //doesn't add single use cards if they are correct
            console.log("asdf")
            currentCard.cardElement.remove()
        }
        else {
            SuccessfulDeck.addCardToDeck(currentCard);
            currentCard.ChangeCardPostion("toSuccessfulPosition");
        }
        PlayingDeck.pushCardToBoard();
        hasAwnseredIncorrectly = false;
    }
    //if user gets it after a try or two (main focus)
    else if (isCorrect && hasAwnseredIncorrectly){
        currentStreak = 0;
        //moves the card to the failed pile and gets a new card
        currentCard.ChangeCardPostion("toFailPosition");
        FailDeck.addCardToDeck(currentCard);
        PlayingDeck.pushCardToBoard();
        
        //resets the varible for the next question 
        hasAwnseredIncorrectly = false;
    }
    //if user is just straight up wrong
    else if (!hasAwnseredIncorrectly) {
        hasAwnseredIncorrectly = true;
        currentCard.createVoidCard()
        currentStreak = 0;
    }
    //changes the streak counter
    streakDisplay.textContent =  `Your current streak is: ${currentStreak}`;
}
function returnCardsToPlayingDeck(){
   //if there are any cards in the fail pile then they are all added to the playing deck
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
        console.log(DestructableDeck);
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
    awnserBox.style.display = "none"
    
    // FIX THIS LATER
    if (!placeholderFront) {
        placeholderFront = new card("this is a place holder","no");
        placeholderFront.addCardToMainBoard()
        placeholderFront.ChangeCardPostion("toFailPosition")
        placeholderFront.ChangeCardPostion("ReturnToDeckFromLeft")
    }
    setTimeout(()=>{
        //after the animation is done then we push out the card for cohesion
        PlayingDeck.pushCardToBoard();
    }, 1450);
}

let hasAwnseredIncorrectly = false;
//needed for the placeholder card
let placeholderFront


async function startFromFile(){
    //gets the json file 
    await fetch("Question_Sets/America_Hist_1712-90_p2.json")
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            // Parse the JSON data from the response
            return response.json();
        })
        .then(data => {
            PlayingDeck.parseJsonToCards(data)
        })
}

window.onload = async function(){
    await startFromFile();
    //starts the entire quizing loop
    PlayingDeck.pushCardToBoard()
}

//to check for if the user has pressed enter.
document.addEventListener("keydown", (input) => {
    //when the user presses enter and there is awnser it verifies the awnser
    if (input.key == "Enter" && awnserBox.value != "") {
     verifyAwnser();
    }
});

