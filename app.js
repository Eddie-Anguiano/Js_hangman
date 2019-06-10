var document, console, prompt;
var UiController = (function () {
	"use strict";

	var DOMstrings = {
		answerTable: ".answer"
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
		}

	};
}());

var dataController = (function () {
	"use strict";
	
	var data = [];

	function checkLetterMatch(answer, letterGuess) {
		var matches = [];

		answer.split("").forEach(function (item, index) {
			if (letterGuess === item) {
				matches.push({
					item: item,
					index: index
				});
			}
		});
	}

	return {
		createDataStructure: function (word) {
			word = word.replace(/\s+/g, "");
			word.split("").forEach(function (item) {
				data.push({letter: item, guessed: false});
			});
			console.log(data);
		}
	};
}());

var controller = (function (uiCtrl, dataCtrl) {
	"use strict";
	var word = uiCtrl.getWord();
	
	return {
		init: function () {
			
			uiCtrl.displayTableData(word);
			dataController.createDataStructure(word);
		}
	};
}(UiController, dataController));

controller.init();

