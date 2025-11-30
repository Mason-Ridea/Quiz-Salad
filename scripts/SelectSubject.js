import { startFromFile } from "./DomControl.js";

const ChangeSubjectButton = document.getElementById("subjectSelect"); 
const searchMenu = document.getElementById("search"); 
const categories = document.getElementById("categories")
const closeButton = document.querySelector("closebutton");
const scrollSlider = document.getElementById("scrollSlider"); // note that each element should increase the max by 5
let ParentDirectory;
let CurrentMenus = [];
class Directory{
    constructor(contents, parentDirectory){
        this.contents = contents;
        this.parentDirectory = parentDirectory;
    }
    GetTitles(){
        const Titles = [];
        for(const key in this.contents){
            Titles.push(key)
        }
        return Titles;
    }
}
let currentDirectory;
// obtains the layout data


// function to open and close search menu
ChangeSubjectButton.onclick = OpenSubjectMenu;
function OpenSubjectMenu(){
    searchMenu.style.height = "100%";
    searchMenu.style.visibility = "visible"
    currentDirectory = new Directory(ParentDirectory, null);
    populateMenus(currentDirectory);
}
function CloseSearchMenu(){
    searchMenu.style.height = "0%";
    searchMenu.style.visibility = "hidden"
}
window.CloseSearchMenu = CloseSearchMenu; //makes it accessible to html elements

//functions to moves and select through elements
scrollSlider.oninput = UpdateElementPositions;
function UpdateElementPositions(){
    const baseHeight = 130;
    const scrolloffset = parseInt(scrollSlider.value)*10;
    const newYPosition = (baseHeight + scrolloffset) + "px";
    console.log(newYPosition);          
    CurrentMenus.forEach(element => {
        element.style.bottom = newYPosition;
    });
}

function OnCategoryClick(){ 
    /*
    parameters of this function is a string containing 
    the next filename and will be bound to the function
    */
    console.log(this);
    if (typeof(this) == "object"){
        currentDirectory = this
        populateMenus(this);
    }
    else if (typeof(this) == "string"){
        console.log("asdf")
        startFromFile(this);
        CloseSearchMenu();
    }
    else{
        window.Error("FILE NOT FOUND, CONTACT WEBSITE OWNER");
    }
}

//functions to populate the menus 
function addMenu(Title, Content){
    const newButton = document.createElement("button");
    const Boundfunction = OnCategoryClick.bind(Content);
    newButton.innerHTML = Title;
    newButton.onclick = Boundfunction;
    CurrentMenus.push(newButton);
    categories.appendChild(newButton);
    
}
async function getLayout(){ 
    await fetch("./Question_Sets/-SearchLayout.json")
            .then(response => {
                // Check if the request was successful
                if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}???`);
                
                }
                // Parse the JSON data from the response
                
                return response.json();
            })
            .then(data => {
                ParentDirectory = data;
                currentDirectory = new Directory(data, null);
                populateMenus(currentDirectory)
            })
}
function populateMenus(Dir){
    //removes all current menus
    categories.replaceChildren();
    //clears the currentMenus array
    CurrentMenus = []
    //get the names of all new menus and adds them
    Dir.GetTitles().forEach(title => {
        let Content;
        if (typeof(Dir.contents[title]) == "object"){
            Content = new Directory(Dir.contents[title], currentDirectory)
        }
        else if(typeof(Dir.contents[title]) == "string"){
            Content = Dir.contents[title]
        }
        addMenu(title,Content);
    })
    scrollSlider.max = Dir.GetTitles().length;
}
getLayout();