//FORM ELEMENT FOR PROGRAM NAME
    // remove any leftover program name in sessionStorage, to avoid confusion
    sessionStorage.removeItem("programName");
    //set flag as to whether a program name has been stored
if (sessionStorage.getItem("programName")==null) {
    var nameFlag = 0;
    var nameFlag = 1;
}
// Only use "localStorage.clear();" when it's necessary to remove stray programs from localStorage 
// ('Copy' program is hardcoded in and will be written back into localStorage)
// localStorage.clear();
    //stop program name form from reloading the page on submit

document.getElementById("name").addEventListener("submit", (event) => {
    event.preventDefault();
})
var programName = document.getElementById("programName");

programName.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("submitName").click();
      document.getElementById("name").outerHTML = `<h2 class="programName"><u> ` + programName.value +  `</h2></u><br>
      <p>NB: Terminating state-read pair must be blank<p>`;
      document.getElementById("programSubmit").innerHTML = `<em>caution! program not yet saved</em><br> <input id="programSubmit" type="button" value="Submit this program" onclick="submitProgram();">`
      var n = programName.value;
      sessionStorage.setItem("progamName",n);
    }
})

// CREATE FORM TABLE FOR ACTUAL PROGRAM

    //Make first row of Program Creator form
var topState = -1;
    //array just to hold the names of form input elements
const inputElements = [];
newRow();
// function to add new rows, trigger by Add new row button
function newRow() {
    topState += 1;
    var row = document.getElementById("programTable").insertRow(topState + 1); //nb: Row 0 is a header row
    var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(1);
    var cell2 = row.insertCell(2);
    var id0W = topState + `0W`;
    inputElements.push(id0W);
    var id0M = topState + `0M`;
    inputElements.push(id0M);
    var id0S = topState + `0S`;
    inputElements.push(id0S);
    var id1W = topState + `1W`;
    inputElements.push(id1W);
    var id1M = topState + `1M`;
    inputElements.push(id1M);
    var id1S = topState + `1S`;
    inputElements.push(id1S);
    cell0.outerHTML = '<th>State ' + topState + '</th>';
    cell1.outerHTML = `<form> 
                                <td>
                                    <input type="number" id=` + id0W + ` maxlength="2" size="2" max="1" min="0" step="1"  placeholder = "Write" required/>
                                    <input type="number" id=` + id0M + ` maxlength="2" size="2"  min="-1" max="1" step="1"  placeholder = "Move" required/>
                                    <input type="number" id=` + id0S + ` maxlength="2" size="2"  min="0"  step="1"  placeholder = "State" required/>
                                </td>`;
    cell2.outerHTML = ` 
                                <td>
                                    <input type="number" id=` + id1W + ` maxlength="2" size="2" max="1" min="0" step="1"  placeholder = "Write"  required/>
                                    <input type="number" id=` + id1M + ` maxlength="2" size="2"  min="-1" max="1" step="1"  placeholder = "Move" required/>
                                    <input type="number" id=` + id1S + ` maxlength="2" size="2"  min="0"  step="1"  placeholder = "State"  required/>
                                </td>
                            </form>`;                           
}

// SUBMIT VALUES IN PROGRAM FORM TO LOCAL STORAGE
function submitProgram() {
    document.getElementById("programSubmit").innerHTML = `<em>program saved</em>`;
    const thisProgram = [];
    var stateLineArray = [];  
    var oldstateLineIndex = 0;
    var readColumnArray = [];
    var oldReadColumnIndex = 0;

    for (i=0;i<inputElements.length;i++){
        console.log("i", i);
        var cell = document.getElementById(inputElements[i]);
        var thisValue = cell.value;
        if (thisValue === undefined){
            thisValue = "";
        }

        var readColumnIndex = Math.floor(i/3)%2;
        console.log("readColumnIndex", readColumnIndex);
        if (readColumnIndex != oldReadColumnIndex) {
            console.log("pushing readColumnArray: ",readColumnArray);
            stateLineArray.push(readColumnArray);
            oldReadColumnIndex = readColumnIndex;
            readColumnArray = [];
        }

        var stateLineIndex = Math.floor(i/6);
        console.log("stateLineIndex", stateLineIndex);
        if (stateLineIndex > oldstateLineIndex) {
            console.log("pushing stateLineArray: ",stateLineArray);
            thisProgram.push(stateLineArray);
            oldstateLineIndex = stateLineIndex;
            stateLineArray = [];
        }

        if(i%3==0) {//write cell
            readColumnArray.push(thisValue);
        }
        if(i%3==1) {//move cell
            readColumnArray.push(thisValue);
        }
        if(i%3==2) {
            readColumnArray.push(thisValue);
        }
        if (i == inputElements.length - 1) {
            stateLineArray.push(readColumnArray);
            thisProgram.push(stateLineArray);
            // console.log("thisProgram", thisProgram);
        }
    };
    // note that 'programs' is just a list of program names in localStorage; 'programs' goes into sessionStorage
    localStorage.setItem(programName.value,JSON.stringify(thisProgram));
    console.log(thisProgram);
    var v = localStorage.getItem(programName.value);
    const programs = ["Copy"];
    console.log(v);
    programs.push(programName.value);
    sessionStorage.setItem("Programs",JSON.stringify(programs));
}
    


