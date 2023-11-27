let body = document.querySelector("body");

let outerDiv = document.createElement("div");
outerDiv.classList.add("outer");

let textbox = document.createElement("textarea");
textbox.classList.add("txtbox");
textbox.setAttribute("id", "printArea");
textbox.setAttribute("placeholder", "Start making notes....");

// let list = document.createElement("ul");
// list.classList.add("list");

// l1 = document.createElement("li");
// l2 = document.createElement("li");
// l3 = document.createElement("li");

let btn = document.createElement("btn");
btn.classList.add("btn");
btn.innerHTML = "Expand";

let voicebtn = document.createElement("img");
voicebtn.setAttribute("id", "voicebtn");
// voicebtn.setAttribute(
//   "src",
//   "https://w7.pngwing.com/pngs/903/816/png-transparent-microphone-computer-icons-home-screen-viber-blue-electronics-microphone.png"
// );

let pdfbtn = document.createElement("button");
pdfbtn.setAttribute("id", "pdfbtn");
pdfbtn.innerHTML = "Download";

// l1.appendChild(btn);
// l2.appendChild(voicebtn);
// l3.appendChild(pdfbtn);

// list.appendChild(l1);
// list.appendChild(l2);
// list.appendChild(l3);

// let extName = document.createElement("h6");
// extName.setAttribute("id", "extName");
// extName.innerHTML = "FLOAT";
let bigDiv = document.createElement("div");
bigDiv.classList.add("bigDiv");

let btnDiv = document.createElement("div");
btnDiv.classList.add("btnDiv");

/*  Toggler section */

btn.addEventListener("click", expandCollapse);
outerDiv.classList.add("reduce");
btnDiv.classList.add("btndivCollapse");

// bigDiv.classList.add("reduce");
textbox.classList.add("zero");

let initial = false;
function expandCollapse() {
  if (initial === true) {
    outerDiv.classList.add("reduce");
    btnDiv.classList.add("btndivCollapse");
    // bigDiv.classList.add("reduce");
    textbox.classList.add("zero");
    btn.innerHTML = "Expand";
    initial = false;
  } else {
    outerDiv.classList.remove("reduce");
    btnDiv.classList.remove("btndivCollapse");

    // bigDiv.classList.remove("reduce");
    textbox.classList.remove("zero");
    btn.innerHTML = "Collapse";
    initial = true;
  }
}

// btnDiv.appendChild(extName);
btnDiv.appendChild(btn);
btnDiv.appendChild(voicebtn);
btnDiv.appendChild(pdfbtn);

// outerDiv.appendChild(bigDiv);

// btnDiv.appendChild(list);
// bigDiv.appendChild(textbox);
outerDiv.appendChild(textbox);
outerDiv.append(btnDiv);
body.appendChild(outerDiv);

/*free moves */
var mousePosition;
var offset = [0, 0];
var div;
var isDown = false;

document.body.appendChild(outerDiv);

outerDiv.addEventListener(
  "mousedown",
  function (e) {
    isDown = true;
    offset = [outerDiv.offsetLeft - e.clientX, outerDiv.offsetTop - e.clientY];
  },
  true
);

document.addEventListener(
  "mouseup",
  function () {
    isDown = false;
  },
  true
);

document.addEventListener(
  "mousemove",
  function (event) {
    event.preventDefault();
    if (isDown) {
      mousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
      outerDiv.style.left = mousePosition.x + offset[0] + "px";
      outerDiv.style.top = mousePosition.y + offset[1] + "px";
    }
  },
  true
);

pdfbtn.addEventListener("click", downloadIT);

// content.js

// Create a script element
let script1 = document.createElement("script");
let script2 = document.createElement("script");

// Set the script source to the local copy of jsPDF

script1.setAttribute("src", chrome.runtime.getURL("makePDF/pdfMake.min.js"));
script2.setAttribute("src", chrome.runtime.getURL("makePDF/vfs_fonts.js"));

// Append the script element to the document
document.head.appendChild(script1);
document.head.appendChild(script2);

// Wait for the script to load

let textVal = "";

let voice = new webkitSpeechRecognition();
let listening = false;

let transcript = "";

voicebtn.addEventListener("click", listenVoice);

function listenVoice() {
  if (listening === false) {
    listening = true;
    console.log("listening");
    voice.start();
    voice.onresult = (event) => {
      transcript = event.results[event.resultIndex][0].transcript;
      storeData();
    };
  } else {
    textVal = document.getElementById("printArea");
    if (textVal.value.length > 0) {
      textVal.value = " " + textVal.value + transcript + ".";
    } else {
      textVal.value += transcript + ".";
    }

    console.log("Na listening");
    listening = false;
    voice.stop();
    storeData();
  }
}

voice.continous = true;
voice.lang = "en-in";

function downloadIT() {
  textVal = document.getElementById("printArea").value;

  if (textVal.length > 0) {
    var docdef = {
      content: [`${textVal}`],
    };
    pdfMake.createPdf(docdef).download();
  }
}

/* data storage */

function storeData() {
  if (textbox.value.length > 0) {
    textVal = textbox.value;
    chrome.storage.local.set({ data: textVal }, function () {
      console.log(textVal);
    });
  }
}

textbox.addEventListener("input", storeData);

function updateData() {
  chrome.storage.local.get(["data"], function (result) {
    if (result.data) {
      textbox.value = result.data;
    }
  });
}

updateData();

// function storeData() {
//   textVal = document.getElementById("printArea").value;
//   if (textVal.length > 0) {
//     chrome.storage.local.set({ data: textVal }, function () {
//       console.log("Data saved: " + textVal);
//     });
//   }
// }

// textbox.addEventListener("input", storeData);

// function updateData() {
//   chrome.storage.local.get(["data"], function (result) {
//     if (result.data) {
//       document.getElementById("printArea").value = result.data;
//     }
//   });
// }

// // Call updateData when the content script is executed
// updateData();
