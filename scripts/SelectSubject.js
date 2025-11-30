const ChangeSubjectButton = document.getElementById("subjectSelect"); 
const searchMenu = document.getElementById("search"); 
const categories = document.getElementById("categories")
const closeButton = document.querySelector("closebutton");
const scrollSlider = document.getElementById("scrollSlider");


let YOffset = 0; 
let CurrentSearchElements = [];


ChangeSubjectButton.onclick = OpenSubjectMenu;
function OpenSubjectMenu(){
    searchMenu.style.height = "100%";
}
function CloseSearchMenu(){
    console.log("qaewsrdtfyui");
    searchMenu.style.height = "0%";
}
window.CloseSearchMenu = CloseSearchMenu; //makes it accessible to html elements

function UpdateElementPositions(){
    console.log(scrollSlider.value);          
}

scrollSlider.oninput = UpdateElementPositions;



for (let i = 0; i < 10; i++) {
    const newAnchor = document.createElement("a");
    newAnchor.text = i;
    categories.appendChild(newAnchor);
}