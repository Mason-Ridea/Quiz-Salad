class card {
    constructor (prompt,awnser,destructable = false){
        this.prompt = prompt
        this.awnser = awnser
        this.destructable = destructable

        //creates the card element for the document 
        this.cardElement = document.createElement("div");
        this.cardFront = document.createElement("div");
        this.cardBack  = document.createElement("div");
        this.PromptText = document.createElement("div"); //text needs a spefific format, thus its own element
        //puts the prompt on the back of the card
        this.PromptText.textContent = this.prompt;
        //adds the appropiate classes to the divs
        this.cardElement.classList.add("card");
        this.cardFront.classList.add("front");
        this.cardBack.classList.add("back");
        this.PromptText.classList.add("promptTextMultiLine");
        //if the prompts is more than one line there should be a different format inorder to obey the card lines
        if(this.destructable){
            this.cardBack.classList.add("destroyableBack");
        }
        //appends the front and back to the cardElement
        this.cardBack.appendChild(this.PromptText)
        this.cardElement.appendChild(this.cardBack);
        this.cardElement.appendChild(this.cardFront);
        
    }
    addCardToBoard(Board){
        PlayingBoard.appendChild(this.cardElement)
        
    }
    ChangeCardPostion(NewPosition){
        console.log(window.getComputedStyle(this.PromptText).lineHeight);

        //corresponsds to a css class
        for (let i = 0; i < this.cardElement.childNodes.length; i++) {
            const element = this.cardElement.children[i];
            element.classList.add(NewPosition);
        }
    }
    createVoidCard(PlayingBoard){
        this.voidCard = document.createElement("div");
        this.voidCard.classList.add("voidCard");
        PlayingBoard.appendChild(this.voidCard);
        
        //adds a duplicate of the card to the destructable deck 
        return this; 
    }
    //multiple awnser can be accepted thus a function is needed to manage them
    CompareAwnsers(input){
        let AcceptableAwnsers = this.awnser.map(awnser => awnser.toLowerCase());
        return AcceptableAwnsers.includes(input.toLowerCase()) ;
    }
    selfDestruct(){
        setTimeout(() =>{
            this.cardElement.remove()
        },1450)
    }
}
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
    parseDataToCards(data) {
        for (let index = 0; index < data.questions.length; index++) {
            const question = data.questions[index];
            this.addCardToDeck(new card(question.prompt, question.awnser));
        }
    }
    pushNextCardToBoard(PlayingBoard){
        if (this.cards.length <= 0) {
            return false;
        }
        else{
        let nextCard = this.cards.pop();
        PlayingBoard.appendChild(nextCard.cardElement);
        return nextCard;
        }
    }
    addCardToDeck(card) {
        this.cards.push(card)
        //shuffle may be unesscessary
        this.shuffle()
    }
}

//exports the object to be used in other modules
export {card, deck}