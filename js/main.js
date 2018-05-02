// populate options for selecting the theatre
var theatreArea = new XMLHttpRequest();
theatreArea.open("GET","https://www.finnkino.fi/xml/TheatreAreas/",true);
theatreArea.send();
theatreArea.onreadystatechange = function() {
  if (theatreArea.readyState==4 && theatreArea.status==200){
	var xmlResult = theatreArea.responseXML;

  var theatreID = xmlResult.getElementsByTagName("ID");
	var theatreNames = xmlResult.getElementsByTagName("Name");
	var getSelect = document.getElementById("theatre");

	for (var i = 0; i < theatreNames.length; i++){
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

  var dateTime = xmlResult.getElementsByTagName("dateTime");
  var getSelectTime = document.getElementById("time");

  for (var i = 0; i < dateTime.length; i++){
    var getOptionDate = document.createElement("option");

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
// Display all movies automatically on page load
function displayMovies() {
  area = document.getElementById("theatre").value;
	timeValue = document.getElementById("time").value;
	var customSchedule= new XMLHttpRequest();
	customSchedule.open("GET","https://www.finnkino.fi/xml/Schedule/?area="+area+"&dt="+timeValue,true);
	customSchedule.send();
	customSchedule.onreadystatechange=function() {
		if (customSchedule.readyState==4 && customSchedule.status==200){
		var xmlResult = customSchedule.responseXML;
    var i;
    var table = "<tr><th>Movie Name</th><th>Theatre</th><th>Start time</th></tr>";
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
function displayAllMovies() {

	var allSchedule= new XMLHttpRequest();
	allSchedule.open("GET","https://www.finnkino.fi/xml/Schedule",true);
	allSchedule.send();
	allSchedule.onreadystatechange=function() {
		if (allSchedule.readyState==4 && allSchedule.status==200){
		var xmlResult = allSchedule.responseXML;
    var i;
    var table = "<tr><th>Movie Name</th><th>Theatre</th><th>Start time</th></tr>";
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
// fade in the default table on page load
$(document).ready(function () {
  $('div.hidden').fadeIn(3000);
});

// Custom search function
function searchTable() {
    var input, filter, table, tr, td, i; //Declare variables
    input = document.getElementById("search");
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
