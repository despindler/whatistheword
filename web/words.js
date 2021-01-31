var index;
var numberOfCharacters;
var solutionCharacters;

$(document).ready(function(){
	initialisePage();
	getWord();
});

function initialisePage()	{
	$('#buttonHelp').click(function(e)	{
		help();
	});
	$('#buttonReset').click(function(e)	{
		prepareSolution();
	});
	$('#buttonNextWord').click(function(e)	{
		getWord();
	});
}

function help()	{
	alert("Klicke auf die gelben Buchstaben - in der Reihenfolge wie sie im Lösungwort stehen.\r\nDu kannst jederzeit von vorne beginnen oder ein neues Wort suchen.");
}

function resetDeep()	{
	index = 0;
	numberOfCharacters = 0;
	solutionCharacters = null;
}

function prepareSolution()	{
	index = 0;
	
	$('#word').empty();
	$('#solution').empty();

	characters = [...solutionCharacters];
	
	for(i = characters.length - 1; i > 0; i--){
		const j = Math.floor(Math.random() * i);
		const temp = characters[i];
		characters[i] = characters[j];
		characters[j] = temp;
	}
	
	for (var i = 0; i < characters.length; i++) {

		character = $("<button>")
			.attr("type", "button")
			.attr("id", "taskCharacter" + characters[i])
			.attr("onclick", "placeCharacter(\'" + characters[i] + "\')")
			.addClass("btn btn-warning")
			.text(characters[i]);
		$('#word').append(character, $("<span>").html("&nbsp;"));
	
	}

	for (var i = 0; i < solutionCharacters.length; i++) {

		character = $("<button>")
			.attr("type", "button")
			.attr("id", "solutionCharacter" + i)
			.addClass("btn btn-outline-dark disabled")
			.text("?");
		$('#solution').append(character, $("<span>").html("&nbsp;"));
	
		$('#taskCharacter'+i).removeClass("disabled");
	}
}


function getWord()	{
	$.get("backend/words/random", function(data) {
		jsonData = JSON.parse(data);
		if (jsonData && jsonData.success)	{
			showWord(jsonData.result);
		} else	{
			alert(data);	
		}
	});
}

function showWord(word)	{

	resetDeep();
	
	solutionCharacters = word.word.toLowerCase().split('');
	numberOfCharacters = solutionCharacters.length;
	prepareSolution();
}

function placeCharacter(character)	{
	if (!(index < numberOfCharacters))	{
		alert("Du hast alle Buchstaben gesetzt. Beginne von vorne oder suche ein neues Wort.");
		return;
	}
	
	$('#taskCharacter'+character).removeAttr("onclick");
	$('#taskCharacter'+character).addClass("disabled");
	
	$('#solutionCharacter'+index)
		.removeClass("btn-outline-dark")
		.addClass("btn-dark")
		.text(character);
	index++;
	if (index == numberOfCharacters)	{
		checkIfSolved();
	}
}

function checkIfSolved()	{
	for (i = 0; i < numberOfCharacters; i++)	{
		if ($('#solutionCharacter'+i).text() != solutionCharacters[i])	{
			show("btn-danger");
			return;
		}
	}
	show("btn-success")
}

function show(truth)	{
	for (var i = 0; i < solutionCharacters.length; i++) {
		$('#solutionCharacter'+i).removeClass("btn-dark");
		$('#solutionCharacter'+i).addClass(truth);	
	}
}