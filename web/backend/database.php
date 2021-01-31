<?php

require_once "../config.php";

function getDB()	{
	$db = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	if ($db->connect_errno) {
	    echo("Failed to connect to MySQL: " . $db->connect_error);
	    exit(1);
	}
	return $db;
}

function dbWordsFindAll()	{
	$db = getDB();
	$query = "SELECT w.word FROM words w";
	
	$query_result = $db->query($query);
	if (!$query_result) {
    	echo("Failed to run query for dbWordsFindAll: (" . $db->errno . ") " . $db->error);
    	exit(1);	
	}
	
	$result = array();
	while($current = $query_result->fetch_assoc())	{
		$result[] = $current;
	}
	$db->close();
	
	return $result;
}


?>