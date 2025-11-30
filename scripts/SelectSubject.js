const ChangeSubjectButton = document.getElementById("subjectSelect"); 
const searchMenu = document.getElementById("search"); 
const categories = document.getElementById("categories")
const closeButton = document.querySelector("closebutton");
const scrollSlider = document.getElementById("scrollSlider"); // note that each element should increase the max by 5



let CurrentSearchElements = [];
// function to open and close search menu
ChangeSubjectButton.onclick = OpenSubjectMenu;
function OpenSubjectMenu(){
    searchMenu.style.height = "100%";
}
function CloseSearchMenu(){
    searchMenu.style.height = "0%";
}
window.CloseSearchMenu = CloseSearchMenu; //makes it accessible to html elements

function UpdateElementPositions(){
    const baseHeight = 100;
    const scrolloffset = parseInt(scrollSlider.value)*10;
    const newYPosition = (baseHeight + scrolloffset) + "px";
    console.log(newYPosition);          
    CurrentSearchElements.forEach(element => {
        element.style.bottom = newYPosition;
    });
}
//functions to moves and select through elements
scrollSlider.oninput = UpdateElementPositions;

function addButton(Title){
    const newButton = document.createElement("button");
    const Boundfunction = OnCategoryClick.bind(Title);
    newButton.innerHTML = Title;
    newButton.onclick = Boundfunction;
    CurrentSearchElements.push(newButton);
    categories.appendChild(newButton);
    
}

function OnCategoryClick(){ 
    /*
    parameters of this function is a string containing 
    the next filename and will be bound to the function
    */
    console.log(this);
}

for (let i = 0; i < 40; i++) {
    addButton(i);
}