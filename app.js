/*eslint-env es6*/

var document, console, prompt;
var UiController = (function () {
	"use strict";
	var wrongCounter = 0,
		validLetter = /^[A-Za-z]+$/,
		DOMstrings = {
			answerTable: ".answer",
			guessInput: ".guess_input",
			letterDivs: ".letter"
		};

	function displayEndScreen(message) {
		var div = document.createElement("div");
		div.textContent = message;
		div.classList.add("end");
		document.querySelector("body").appendChild(div);
	}

	function disableUi() {
		document.querySelector(DOMstrings.guessInput).disabled = true;
	}


	function focusInput() {
		document.querySelector(DOMstrings.guessInput).value = "";
		document.querySelector(DOMstrings.guessInput).focus();
	}

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
			return word.toLowerCase();
		},
		getDomStrings: function () {
			return DOMstrings;
		},
		getGuess: function () {
			if (document.querySelector(DOMstrings.guessInput).value.match(validLetter) && document.querySelector(DOMstrings.guessInput).value.length === 1) {
				return document.querySelector(DOMstrings.guessInput).value.toLowerCase();
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
				if (wrongCounter === 1) {
					document.querySelector(`div:nth-child(${wrongCounter + 4})`).style.borderColor = "black";
				} else {
					document.querySelector(`div:nth-child(${wrongCounter + 4})`).style.backgroundColor = "black";
				}
			}
			focusInput();
		},
		updateLetterBlock: function (guess, matchesArray) {
			var letterDiv = document.querySelectorAll(DOMstrings.letterDivs);

			for (var i = 0; i < letterDiv.length; i++) {
				letterDiv[i].classList.add(letterDiv[i].textContent.toLowerCase());
			}

			if (matchesArray.length === 0) {
				document.querySelector(`.${guess}`).style.color = "red";
			}


			for (var j = 0; j < matchesArray.length; j++) {
				if (matchesArray[j].letter && matchesArray[j].letter === guess) {
					document.querySelector(`.${guess}`).style.color = "green";
				}
			}

		},
		displayWinScreen: function () {
			displayEndScreen("YOU WIN!");
			disableUi();
		},
		displayLostScreen: function () {
			displayEndScreen("YOU LOSE!");
			disableUi();
		},
		focusOnInput: function () {
			focusInput();
		}

	};
}());

var dataController = (function () {
	"use strict";

	var data = [],
		wrongCounter = 0,
		guessArray = [];



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
		},
		checkIfWon: function () {
			if (data.every(function (item) {
					return item.guessed;
				})) {
				return true;
			}
		},
		checkIfLost: function () {
			if (wrongCounter === 6) {
				return true;
			}
		},
		isRepeat: function (guess) {
			if (guessArray.indexOf(guess) === -1) {
				guessArray.push(guess);
				console.log(guessArray);

				return false;
			} else {
				return true;
			}
		}


	};
}());

var controller = (function (uiCtrl, dataCtrl) {
	"use strict";
	var word = uiCtrl.getWord();
	var active = true;

	function setUpEventListeners() {

		document.addEventListener("keyup", function () {
			submitGuess();
		});
	}

	function submitGuess() {

		if (active) {
			var guess = uiCtrl.getGuess();

			if (!dataCtrl.isRepeat(guess) && guess) {
				var matches = dataCtrl.getMatches(word, guess);

				dataCtrl.updateData(matches);
				uiCtrl.updateUi(matches);
				uiCtrl.updateLetterBlock(guess, matches);

				if (dataCtrl.checkIfWon()) {
					uiCtrl.displayWinScreen();
					active = false;
				} else if (dataCtrl.checkIfLost()) {
					uiCtrl.displayLostScreen();
					active = false;
				}
			} else {
				uiCtrl.focusOnInput();
			}


		}
	}

	return {
		init: function () {
			uiCtrl.focusOnInput();
			uiCtrl.displayTableData(word);
			dataCtrl.createDataStructure(word);
			setUpEventListeners();
		}
	};
}(UiController, dataController));

controller.init();
