var document, console, prompt;
var UiController = (function () {
	"use strict";
	var wrongCounter = 0;

	var DOMstrings = {
		answerTable: ".answer",
		enterBtn: ".enter_btn",
		guessInput: ".guess_input"
	};


	return {
		displayTableData: function (word) {
			word.split("").forEach(function (item) {
				var td = document.createElement("td");
				td.textContent = item;
				document.querySelector(DOMstrings.answerTable).firstElementChild.appendChild(td);
				if (item === " ") {
					td.style.border = "none";
				}
			});
		},
		getWord: function () {
			var word = prompt("Enter Word or Phrase");
			return word;
		},
		getDomStrings: function () {
			return DOMstrings;
		},
		getGuess: function () {
			if (document.querySelector(DOMstrings.guessInput).value) {
				return document.querySelector(DOMstrings.guessInput).value;
			}
		},
		updateUi: function (matchesArray) {
			if (matchesArray.length > 0) {
				var tdElements = document.getElementsByTagName("td");

				matchesArray.forEach(function (item) {
					tdElements[item.index].style.color = 'black';
				});
			} else {
				wrongCounter += 1;
				document.querySelector(`div:nth-child(${wrongCounter + 4})`).style.backgroundColor = "black";
			}
			document.querySelector(DOMstrings.guessInput).value = "";
			document.querySelector(DOMstrings.guessInput).focus();
		}

	};
}());

var dataController = (function () {
	"use strict";

	var data = [],
		wrongCounter = 0;


	return {
		createDataStructure: function (word) {
			word.split("").forEach(function (item) {
				if (item !== " ") {
					data.push({
						letter: item,
						guessed: false
					});
				} else {
					data.push({
						letter: item,
						guessed: true
					});
				}
			});
		},
		updateData: function (matchesArray) {
			if (matchesArray.length > 0) {
				matchesArray.forEach(function (item) {
					data[item.index].guessed = true;
				});
			} else {
				wrongCounter += 1;
				console.log(wrongCounter);
			}
		},
		getMatches: function (answer, letterGuess) {
			var matches = [];

			answer.split("").forEach(function (item, index) {
				if (letterGuess === item) {
					matches.push({
						letter: item,
						index: index
					});
				}
			});
			return matches;
		}

	};
}());

var controller = (function (uiCtrl, dataCtrl) {
	"use strict";
	var word = uiCtrl.getWord();

	function setUpEventListeners() {
		var DOM = uiCtrl.getDomStrings();

		document.querySelector(DOM.enterBtn).addEventListener("click", submitGuess);
	}

	function submitGuess() {
		var guess = uiCtrl.getGuess(),
			matches = dataCtrl.getMatches(word, guess);
		dataCtrl.updateData(matches);
		uiCtrl.updateUi(matches);
	}

	return {
		init: function () {

			uiCtrl.displayTableData(word);
			dataCtrl.createDataStructure(word);
			setUpEventListeners();
		}
	};
}(UiController, dataController));

controller.init();
