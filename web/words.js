var index;
var numberOfCharacters;
var solutionCharacters;
var score;
var scoringIsNew;

var rewards = [
	"far fa-frown", 
	"far fa-meh", 
	"far fa-smile", 
	"far fa-smile-wink", 
	"far fa-grin", 
	"far fa-grin-tongue", 
	"far fa-grin-beam", 
	"far fa-laugh-beam",
	"far fa-grin-beam-sweat", 
	"far fa-grin-tears", 
	"far fa-grin-squint",
	"far fa-laugh-squint",
	"far fa-grin-squint-tears", 
	"far fa-grin-stars", 
	"far fa-grin-hearts", 
	"far fa-kiss-beam", 
	"far fa-kiss-wink-heart", 
	"far fa-surprise", 
	"far fa-dizzy", 
	"far fa-grin-tongue-wink"
];

// INITIALISATION STUFF

$(document).ready(function(){
	initialisePage();
	getWord();
});

function initialisePage()	{
	score = 0;
	$('#reward').removeClass("fa-meh-blank");
	$('#reward').addClass(rewards[score]);
	
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
	scoringIsNew = true;
}



// SET UP GAME

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



// PLAYER DRAWS

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
	if (scoringIsNew)	{
		score++;
		reward(score);
		$('#score').text(score);
		scoringIsNew = false;
	}
	show("btn-success")
}

function reward(score)	{
	if (score >= rewards.length)	{
		// no more emojis :-(
		return;
	}
	$('#reward').removeClass(rewards[score-1]);
	$('#reward').addClass(rewards[score]);
}

function show(correctness)	{
	for (var i = 0; i < solutionCharacters.length; i++) {
		$('#solutionCharacter'+i).removeClass("btn-dark");
		$('#solutionCharacter'+i).addClass(correctness);	
	}
}