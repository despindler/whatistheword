var index;
var numberOfCharacters;
var solutionCharacters;
var score;
var scoringIsNew;
var suggestToQuit;
var wordMaxLength;
var trophyModulo;
var trophyCorrectInARow;

var rewards = [
	"far fa-frown", 
	"far fa-meh", 
	"far fa-smile", 
	"far fa-smile-wink", 
	"far fa-grin", 
	"far fa-grin-tongue", 
	"far fa-grin-beam", 
	"far fa-grin-beam-sweat", 
	"far fa-grin-tears", 
	"far fa-grin-squint",
	"far fa-grin-squint-tears", 
	"far fa-grin-stars", 
	"far fa-grin-hearts", 
	"far fa-kiss-beam", 
	"far fa-kiss-wink-heart", 
	"far fa-surprise", 
	"far fa-dizzy", 
	"far fa-grin-tongue-wink",
	"fas fa-battery-quarter",
	"fas fa-battery-half",
	"fas fa-battery-three-quarters",
	"fas fa-battery-full",
	"fab fa-apple",
	"fas fa-apple-alt",
	"fas fa-brain",
	"fas fa-bahai",
	"fab fa-battle-net",
	"fas fa-biohazard",
	"fas fa-biohazard",
	"fas fa-ambulance",
	"fas fa-capsules",
	"fas fa-chart-line",
	"fas fa-chess-board",
	"fas fa-chess-pawn",
	"fas fa-chess-bishop",
	"fas fa-chess-rook",
	"fas fa-chess-knight",
	"fas fa-chess-king",
	"fas fa-chess-king",
	"fas fa-cloud-showers-heavy",
	"fas fa-cloud-rain",
	"fas fa-cloud-rain",
	"fas fa-cloud-sun",
	"fas fa-sun",
	"fas fa-umbrella-beach",
	"far fa-hand-rock",
	"far fa-hand-scissors",
	"far fa-hand-paper",
	"fas fa-hand-middle-finger",
	"far fa-hand-peace",
	"fas fa-infinity"
];

// INITIALISATION STUFF

$(document).ready(function(){
	initialisePage();
	getWord();
});

function initialisePage()	{
	wordMaxLength = 7;
	score = 0;
	suggestToQuit = true;
	trophyModulo = 5;
	trophyCorrectInARow = 0;
	resetTrophy("first");
	resetTrophy("second");
	
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

function resetTrophy(firstOrSecond)	{
	$('#trophies-' + firstOrSecond).empty();
	$('#trophies-' + firstOrSecond).html("&nbsp;");
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
	$.get("backend/words/random/" + wordMaxLength, function(data) {
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
	
	solutionCharacters = word.toLowerCase().split('');
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
			.attr("id", "taskCharacter" + characters[i] + i)
			.attr("onclick", "placeCharacter(\'" + characters[i] + "\', " + i + ")")
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

function placeCharacter(character, pos)	{
	if (!(index < numberOfCharacters))	{
		alert("Du hast alle Buchstaben gesetzt. Beginne von vorne oder suche ein neues Wort.");
		return;
	}
	
	$('#taskCharacter'+character+pos).removeAttr("onclick");
	$('#taskCharacter'+character+pos).addClass("disabled");
	
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
			penalise();
			if (scoringIsNew)	{
				notifyBackend("wrong");
			}
			show("btn-danger");
			return;
		}
	}
	if (scoringIsNew)	{
		score++;
		reward(score);
		$('#score').text(score);
		scoringIsNew = false;
		notifyBackend("solved");
	}
	show("btn-success")
}

function notifyBackend(theEvent)	{
	word = solutionCharacters.join("");
	$.get("backend/notify/" + word + "/" + theEvent, function(data) {
		jsonData = JSON.parse(data);
		if (jsonData && jsonData.success)	{
			// we currently do nothing here
		} else	{
			alert(data);	
		}
	});
}

function reward(score)	{
	if (score >= rewards.length)	{
		// no more emojis :-(
		if (suggestToQuit)	{
			alert("Wäre es jetzt nicht an der Zeit, etwas Anderes zu tun?");
			suggestToQuit = false;
		}
		return;
	}
	$('#reward').removeClass(rewards[score-1]);
	$('#reward').addClass(rewards[score]);
	
	// tophies :-)
	trophyCorrectInARow++;
	
	$('#trophies-first').append(
		$("<i>").addClass("far fa-star")
	);
	setTimeout(function(){ handleTrophyAdded(); }, 1200);
	
	// next word
	setTimeout(function(){ getWord(); }, 1800);
}

function penalise()	{
	// TODO go back one reward?
	
	// tophies :-)
	resetTrophy("first");
	for (i = 0; i < trophyCorrectInARow; i++)	{
		$('#trophies-first').append(
			$("<i>").addClass("far fa-star-half")
		);
	}
	trophyCorrectInARow = 0;
	setTimeout(function(){ resetTrophy("first"); }, 1200);
	
	// reset
	setTimeout(function(){ prepareSolution(); }, 1800);
}

function handleTrophyAdded()	{
	if (trophyCorrectInARow < trophyModulo)	{
		return;
	}
	$('#trophies-second').append(
		$("<i>").addClass("fas fa-star")
	);
	trophyCorrectInARow = 0;
	resetTrophy("first");
}

function show(correctness)	{
	for (var i = 0; i < solutionCharacters.length; i++) {
		$('#solutionCharacter'+i).removeClass("btn-dark");
		$('#solutionCharacter'+i).addClass(correctness);	
	}
}