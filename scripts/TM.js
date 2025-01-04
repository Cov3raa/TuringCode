if (typeof(Storage) !== "undefined") {
  } else {
    console.log("Sorry! No Web Storage support");
  }

const LEN = 10000000;
const tape = new Array(LEN).fill(0);
var userInputString;
var stepFlag = 0;
var state;
var stepNum;

var programLoadedFlag = false;


const head = {
    position: Math.floor(LEN/2), 
    set pos(pos) {
      this.position = pos;
    }
};

//state syntax: read 0:[write,move,state] read 1:[write,move,state]
const copy = [ 
    //0: after first move R onto a 1, keeps going until it finds a 0, then moves left in state 1
    [[0,-1,1],[1,1,0]],
    //1: having found a 1, it writes a 0 and starts moving L in state 2; if state 1 finds a 0, it's finished
    [["","",""],[0,-1,2]],
    //2: Keeps moving L until it sees a 0, moves L in state 3
    [[0,-1,3],[1,-1,2]],
    //3: Moves past all the newly written 1s to the L; when it finds a 0 it writes a 1 moves R in state 4
    [[1,1,4],[1,1,3]],
    //4: Moves past all the newly written 1s to the R; when it finds a 0 it moves R in state 5
    [[0,1,5],[1,1,4]],
    //5: If it hits a 0 in state 5, it goes to state 6; if it sees a 1, it goes to state 0
    [[0,0,6],[1,1,0]],
    //6: If it hits a 0 in state 6, it goes to state 1 (and halts); if it sees a 1, it goes to state 0
    [[0,-1,1],[1,1,0]]
]
const add =[[["0","1","1"],["1","1","0"]],[["0","-1","2"],["1","1","1"]],[["","",""],["0","-1","3"]],[["1","1","4"],["1","-1","3"]],[["0","-1","5"],["1","1","4"]],[["0","1","4"],["0","-1","6"]],[["0","-1","7"],["1","-1","6"]],[["1","1","8"],["1","-1","7"]],[["0","1","9"],["1","1","8"]],[["","",""],["1","1","4"]]]

localStorage.removeItem("Programs");
localStorage.setItem("Copy",JSON.stringify(copy));
localStorage.setItem("Add",JSON.stringify(add));

    //set up sessionStorage with list of programs in localStorage
const progrsInLocalStorage = [];
const progs = { ...localStorage };
for (prog in progs){
    progrsInLocalStorage.push(prog);
}
sessionStorage.setItem("Programs",JSON.stringify(progrsInLocalStorage));
//List available programs as clickable buttons
var storedProgramList = JSON.parse(sessionStorage.getItem("Programs"));
document.getElementById("currentProgram").innerHTML = `<h3>Stored programs</h3>`;
var programButtons = "";
for (i=0;i<storedProgramList.length;i++){
    programButtons += `<input type="button" value=${storedProgramList[i]} onclick="showTableOfStates(this.value)"></input>`;
}
programButtons +=`<br><br><br><br>`;
document.getElementById("proglist").innerHTML =  programButtons;

document.getElementById("clearProgs").innerHTML =  `<input type="button" value="Clear all programs from local storage" onclick="makeWarning()"></input>`;
function makeWarning() {
    var warning = confirm("Are you SURE you want to clear ALL programs from local storage?");
    if (warning == true) {
        localStorage.clear();
        location.reload();
    }
}

var activeProgram;
var activeProgramName;
//Show table of states for current program 
function showTableOfStates(currentProgramName) {
    programLoadedFlag = true;
    activeProgramName = currentProgramName;
    document.getElementById("title").innerHTML = "";
    document.getElementById("clearProgs").innerHTML =  "";
    document.getElementById("proglist").innerHTML = "";
    document.getElementById("loadProgramButton").style = "visibility: hidden";
    document.getElementById("instructions1").innerHTML = 'Numbers show: value to <i>write</i> in this cell; next <i>move</i>; next <i>state</i>;';
    document.getElementById("instructions2").innerHTML = 'eg. "0 -1 1" = write <i>0</i> in this cell; move <i>one left</i>; change to <i>State 1</i>';
    document.getElementById("currentProgram").innerHTML = `<h2>` + currentProgramName + `</h2>`;
    var currentProgram = localStorage.getItem(currentProgramName);
    currentProgram = JSON.parse(localStorage.getItem(currentProgramName));
    setInputValue("saveText", currentProgram);
    activeProgram = currentProgram;
    var tableString = '<table style="width:100%"><tr><td class = "stateTable">State</td><td class = "stateTable">Read 0</td><td class = "stateTable">Read 1</td>';
    for (i=0; i< currentProgram.length;i++) {
        tableString += '<tr><td class = "stateTable">' + i + '<td>'+ currentProgram[i][0][0] + " " + currentProgram[i][0][1] + " " + currentProgram[i][0][2] + " " + '<td>' + currentProgram[i][1][0] + " " + currentProgram[i][1][1] + " " + currentProgram[i][1][2] + " " + '</tr>';
    }
    tableString += '</table>'
    document.getElementById("tableOfStates").innerHTML = tableString;
    document.getElementById("saveText").innerHTML += `<input type="submit" value="Save this program to disk"></input>`;
}

function displayProgram(currentProgramName, currentProgram) {
    var nameArray = currentProgramName.split(" ");
    currentProgramName = nameArray[0];
    nameArray = currentProgramName.split(".");
    currentProgramName = nameArray[0];
    programLoadedFlag = true;
    activeProgramName = currentProgramName;
    document.getElementById("title").innerHTML = "";
    document.getElementById("clearProgs").innerHTML =  "";
    document.getElementById("proglist").innerHTML = "";
    document.getElementById("loadProgramButton").style = "visibility: hidden";
    document.getElementById("instructions1").innerHTML = 'Numbers show: value to <i>write</i> in this cell; next <i>move</i>; next <i>state</i>;';
    document.getElementById("instructions2").innerHTML = 'eg. "0 -1 1" = write <i>0</i> in this cell; move <i>one left</i>; change to <i>State 1</i>';
    document.getElementById("instructions3").innerHTML = 'First move before starting program is always one step R,ie. onto a 1';
    document.getElementById("currentProgram").innerHTML = `<h2>` + currentProgramName + `</h2>`;
    setInputValue("saveText", currentProgram);
    localStorage.setItem(currentProgramName,JSON.stringify(currentProgram));
    activeProgram = currentProgram;

    var tableString = '<table style="width:100%"><tr><td class = "stateTable">State</td><td class = "stateTable">Read 0</td><td class = "stateTable">Read 1</td>';
    for (i=0; i< currentProgram.length;i++) {
        tableString += '<tr><td class = "stateTable">' + i + '<td>'+ currentProgram[i][0][0] + " " + currentProgram[i][0][1] + " " + currentProgram[i][0][2] + " " + '<td>' + currentProgram[i][1][0] + " " + currentProgram[i][1][1] + " " + currentProgram[i][1][2] + " " + '</tr>';
    }
    tableString += '</table>'
    document.getElementById("tableOfStates").innerHTML = tableString;
    document.getElementById("saveText").innerHTML += `<input type="submit" value="Save this program to disk"></input>`;
}

function updateStatus(program, state) {
    document.getElementById("position").innerHTML = "Head position: ";
    document.getElementById("position2").innerHTML = head.position - Math.floor(LEN/2);
    document.getElementById("state").innerHTML = "Current State: ";
    document.getElementById("state2").innerHTML = state;
    document.getElementById("read").innerHTML = "Head currently reading: ";
    document.getElementById("read2").innerHTML = tape[head.position];
    document.getElementById("forCurrentState").innerHTML = "For current state:-";
    document.getElementById("nextWrite").innerHTML = "Symbol to be written to focused box: " ;
    document.getElementById("nextWrite2").innerHTML = program[state][tape[head.position]][0];
    document.getElementById("nextMove").innerHTML = "Next Move: " ;
    document.getElementById("nextMove2").innerHTML = program[state][tape[head.position]][1];
    document.getElementById("nextState").innerHTML = "Next State: " ;
    document.getElementById("nextState2").innerHTML = program[state][tape[head.position]][2];
}

function updateDisplay () {
    //tape display
    document.getElementById("current").innerHTML = tape[head.position];
    document.getElementById("before").innerHTML = tape[head.position-1];
    document.getElementById("beforebefore").innerHTML = tape[head.position-2];
    document.getElementById("beforebeforebefore").innerHTML = tape[head.position-3];
    document.getElementById("beforebeforebeforebefore").innerHTML = tape[head.position-4];
    document.getElementById("beforebeforebeforebeforebefore").innerHTML = tape[head.position-5];
    document.getElementById("beforebeforebeforebeforebeforebefore").innerHTML = tape[head.position-6];
    document.getElementById("beforebeforebeforebeforebeforebeforebefore").innerHTML = tape[head.position-7];
    document.getElementById("before8").innerHTML = tape[head.position-8];
    document.getElementById("before9").innerHTML = tape[head.position-9];
    document.getElementById("after").innerHTML = tape[head.position+1];
    document.getElementById("afterafter").innerHTML = tape[head.position+2];
    document.getElementById("afterafterafter").innerHTML = tape[head.position+3];
    document.getElementById("afterafterafterafter").innerHTML = tape[head.position+4];
    document.getElementById("afterafterafterafterafter").innerHTML = tape[head.position+5];
    document.getElementById("afterafterafterafterafterafter").innerHTML = tape[head.position+6];
    document.getElementById("afterafterafterafterafterafterafter").innerHTML = tape[head.position+7];
    document.getElementById("after8").innerHTML = tape[head.position+8];
    document.getElementById("after9").innerHTML = tape[head.position+9];
}
updateDisplay();
//stop form from reloading the page on submit
document.getElementById("inputForm").addEventListener("submit", (event) => {
    event.preventDefault();
})

function addStringsOfOnes (string){
    var numbers = [];
    var sets = string.split("0");
    for (let i = 0; i < sets.length; i++) {
        var arr = sets[i].split("");
        let decimalNumber = 0;
        for (let i = 0; i < arr.length; i++) {
            decimalNumber += Number(arr[i]);
        } 
        numbers.push(decimalNumber);
    }
    return numbers;
}
//get the user's text input that the program starts with
// Get the input field
var input = document.getElementById("inputString");

// Submit input from input form when Enter is pressed
input.addEventListener("keypress", function(event) {
    if (programLoadedFlag == true){
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementById("submit").click();
            document.getElementById("notifyMessage").innerHTML = "Your input string is: ";
            userInputString = input.value;
            document.getElementById("displayInput").innerHTML = userInputString;
            document.getElementById("message").innerHTML = "";
            document.getElementById("decimalInputMessage").innerHTML = "Input as decimal: ";
            decimalInput = addStringsOfOnes (userInputString);
            document.getElementById("decimalInputDisplay").innerHTML = decimalInput;
            document.getElementById("theForm").innerHTML = "";
            document.getElementById("boutons").innerHTML = '<input id="start" type="button" value="Run" onclick="runProgram();" />'
            document.getElementById("stepButton").innerHTML = '<input id="step" type="button" value="Step" onclick="stepProgram();" />'
            for (let i=0;i<userInputString.length;i++){
                tape[head.position + 1 + i] = userInputString.charAt(i);
            }
            updateDisplay();}
    } else {
        alert("Please load a program first");
    }
});
//RUN
function runProgram(){
    document.getElementById("boutons").innerHTML = '<input id="reload" type="button" value="Reload" onclick="location.reload();" />';
    document.getElementById("step").disabled = true;
    var stopping = "";
    while (stopping != "halt") {
        stopping = stepProgram();
    }
    return;
}
function stepProgram(){
    document.getElementById("boutons").innerHTML = '<input id="reload" type="button" value="Reload" onclick="location.reload();" />';
    var read;
    var write;
    var move;
    if (stepFlag == 0) {
        stepNum = 0;
        state = 0;
        move = 1;
        head.pos = head.position + move;
        state = activeProgram[state][tape[head.position]][2];
        updateStatus(activeProgram, state);
        updateDisplay();
    }
    stepNum = stepNum + 1;
    if (activeProgram[state][tape[head.position]][2] > activeProgram.length - 1) {
        var haltMessage = "HALTING because State " + activeProgram[state][tape[head.position]][2] + " does not exist";
        document.getElementById("halt").innerHTML = haltMessage;
        document.getElementById("step").disabled = true;
        return "halt";
    }
    if (activeProgram[state][tape[head.position]][2] == "" && activeProgram[state][tape[head.position]][1] == "" ) {
        updateStatus(activeProgram, state);
        updateDisplay();    
        document.getElementById("halt").innerHTML = "HALTING because no next State/Move";
        document.getElementById("step").disabled = true;
        var outputString = "";
        while   (tape[head.position] == 0) {   
            head.pos = head.position - 1;
        }
        while   (tape[head.position] == 1) {
            outputString += tape[head.position];   
            head.pos = head.position - 1;
        }

        document.getElementById("outputMessage").innerHTML = "The output string of the machine is: ";
        document.getElementById("output").innerHTML = outputString;
        var decimalOutput = addStringsOfOnes(outputString);
        document.getElementById("decimalOutputMessage").innerHTML = "Output as decimal: ";  
        document.getElementById("decimalOutput").innerHTML = decimalOutput;
            return "halt";
    }
    //set vars
    read = tape[head.position];
    write = activeProgram[state][read][0];
    var oldmove = move;
    move = Number(activeProgram[state][read][1]);
    updateStatus(activeProgram, state);
    updateDisplay();
    //write and move
    state = activeProgram[state][read][2];
    tape[head.position] = write;
    head.pos = head.position + move;
    document.getElementById("stepNum").innerHTML = "Step number: " ;
    document.getElementById("stepNum2").innerHTML = stepNum;
    stepFlag = 1;
    return;
}

document.getElementById("saveText").addEventListener("submit", (event) => {
    event.preventDefault();
})

function setInputValue(input_id, val) {
    document.getElementById(input_id).value = val;
}

function saveProgram(text) {
    var name = activeProgramName;
    var filename = name + ".json";
    console.log("Saving program as ", filename);
    var pom = document.createElement('a');
    text = JSON.stringify(text);
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' +  encodeURIComponent(text));
    pom.setAttribute('download', filename);
  
    pom.style.display = 'none';
    document.body.appendChild(pom);
  
    pom.click();
  
    document.body.removeChild(pom);
  }

var fileInput = document.getElementById("fileLoad");
fileInput.addEventListener("change", async () => {

  var loadedProgram = fileInput.files[0];
  var loadedProgramName = fileInput.files[0].name;

  if (!loadedProgram) return

  var text = await loadedProgram.text();

  var loadedProgram = JSON.parse(text);
  displayProgram(loadedProgramName, loadedProgram);
  
})

  

  


