// populate options for selecting the theatre
var theatreArea = new XMLHttpRequest();
theatreArea.open("GET","https://www.finnkino.fi/xml/TheatreAreas/",true); //fetch the XML data from finnkino
theatreArea.send();
theatreArea.onreadystatechange = function() {
  if (theatreArea.readyState==4 && theatreArea.status==200){ // Check if response is ready and OK
	var xmlResult = theatreArea.responseXML;
// declare variables for theatre data fetched from finnkino and the select element in index
  var theatreID = xmlResult.getElementsByTagName("ID"); //get a element called ID from the XML file and bind it to theatreID
	var theatreNames = xmlResult.getElementsByTagName("Name"); //get a element called Name from the XML file and bind it to theatreNames
	var getSelect = document.getElementById("theatre"); //get a element called theatre from the XML file and bind it to getSelect

	for (var i = 0; i < theatreNames.length; i++){ // loop through the list of theatre/area names and display them in the select element
		var getOption = document.createElement("option");
		getOption.value = theatreID[i].firstChild.data;
		var getText = document.createTextNode(theatreNames[i].firstChild.data);
		getSelect.appendChild(getOption);
		getOption.appendChild(getText);
	}

  }
}
//populate options for selecting show dates
var scheduleDates = new XMLHttpRequest();
scheduleDates.open("GET","https://www.finnkino.fi/xml/ScheduleDates/",true);
scheduleDates.send();
scheduleDates.onreadystatechange = function() {
  if (scheduleDates.readyState==4 && scheduleDates.status==200){
	var xmlResult = scheduleDates.responseXML;

  var dateTime = xmlResult.getElementsByTagName("dateTime"); //get a element called dateTime from the XML file and bind it to dateTime
  var getSelectTime = document.getElementById("time"); //get a element called time from the XML file and bind it to getSelectTime

  for (var i = 0; i < dateTime.length; i++){ // loop through all show dates from the XML file
    var getOptionDate = document.createElement("option");
    // The show date needs to be converted to dd.mm.yyyy for later use with the &dt= selector for the API call
    var year = dateTime[i].firstChild.data.substring(0,4);
		var month = dateTime[i].firstChild.data.substring(5,7);
		var day = dateTime[i].firstChild.data.substring(10,8);
		var convertedDate = day+"."+month+"."+year;
    getOptionDate.value = convertedDate;
    var getTextDate = document.createTextNode(convertedDate);
    getSelectTime.appendChild(getOptionDate);
    getOptionDate.appendChild(getTextDate);
  }
}
}
//This is called when the select element value changes
function displayMovies() {
  area = document.getElementById("theatre").value; //get a element called theatre from the XML file and bind it to area
	timeValue = document.getElementById("time").value; //get a element called time from the XML file and bind it to timeValue
	var customSchedule= new XMLHttpRequest();
	customSchedule.open("GET","https://www.finnkino.fi/xml/Schedule/?area="+area+"&dt="+timeValue,true);
	customSchedule.send();
	customSchedule.onreadystatechange=function() {
		if (customSchedule.readyState==4 && customSchedule.status==200){
		var xmlResult = customSchedule.responseXML;
    var i;
    var table = "<tr><th>Movie Name</th><th>Theatre</th><th>Start time</th></tr>"; // draw the table structure
    var x = xmlResult.getElementsByTagName("Show");
    for (i = 0; i <x.length; i++) {
      table += "<tr><td id=movieCol><img src=" +
      x[i].getElementsByTagName("EventSmallImagePortrait")[0].childNodes[0].nodeValue+ ">" + x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("Theatre")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue.substring(11,16) +
      "</td></tr>";
    }
    document.getElementById("movies").innerHTML = table;
}
}
}
// This is used in the body element to display all movies on page load
function displayAllMovies() {

	var allSchedule= new XMLHttpRequest();
	allSchedule.open("GET","https://www.finnkino.fi/xml/Schedule",true);
	allSchedule.send();
	allSchedule.onreadystatechange=function() {
		if (allSchedule.readyState==4 && allSchedule.status==200){
		var xmlResult = allSchedule.responseXML;
    var i;
    var table = "<tr><th>Movie Name</th><th>Theatre</th><th>Start time</th></tr>"; // draw the table structure
    var x = xmlResult.getElementsByTagName("Show");
    for (i = 0; i <x.length; i++) { // loops through all the Show elements(movies) in the XML file and draws them as rows in the table
      table += "<tr><td id=movieCol><img src=" +
      x[i].getElementsByTagName("EventSmallImagePortrait")[0].childNodes[0].nodeValue+ ">" + x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("Theatre")[0].childNodes[0].nodeValue +
      "</td><td>" +
      x[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue.substring(11,16) + // substring used to only extract the characters with the date
      "</td></tr>";
    }
    document.getElementById("movies").innerHTML = table;
}
}
}
// fade in the default table on page load
$(document).ready(function () {
  $('div.hidden').fadeIn(3000);
});

// Search function to search movie names
function searchTable() {
    var input, filter, table, tr, td, i; //Declare variables
    input = document.getElementById("search"); // targets the search input box
    filter = input.value.toUpperCase(); //Removes case sensitive search for uppercase letters
	  table = document.getElementById("movies");
	  tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
