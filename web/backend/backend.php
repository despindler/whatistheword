<?php

require_once "database.php";
require 'flight/Flight.php';

function getRandomWord()	{
	$words = dbWordsFindAll();
	
	$random_word = array_rand($words, 1);
	$result["word"] = $words[$random_word]["word"];
	
	return array(
		"success" => true,
		"result" => $result
	);
}




Flight::route('/hello/@who', function($who) {
	echo json_encode("hello " . $who . "@words");
});

Flight::route('/words/random', function() {
	$result = getRandomWord();
	echo json_encode($result);
});

Flight::start();
?>