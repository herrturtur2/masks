function loadRings()
{
    var ringSelect = document.getElementById("ringSelect");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/masks/masks.py/getRings", true);
    xhr.onreadystatechange = function() {
	if (xhr.readyState==4 && xhr.status==200){

	    // remove existing options
	    while(ringSelect.options.length){
		ringSelect.options.remove(0);
	    }

	    // add options retrieved from server 
	    var obj = json_parse(xhr.responseText);
	    for (var i=0; i<obj.rings.length; i++){
		ringSelect.options.add(new Option(obj.rings[i].name,
						  obj.rings[i].id));
	    }
	}
    }
    xhr.send();
}


function deleteRing()
{
    var ringSelect = document.getElementById("ringSelect");
    var xhr = new XMLHttpRequest();
    var params = "ringid=" + 
	ringSelect[ringSelect.selectedIndex].value.toString();

    xhr.open("POST", "/masks/masks.py/deleteRing", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function(){}
    xhr.send(params);

    loadRings();
}


function addRing()
{
    var ringEntry = document.getElementById("ringEntry");
    var xhr = new XMLHttpRequest();
    var params = "ringname=" + ringEntry.value;
    ringEntry.value = "";
    xhr.open("POST", "/masks/masks.py/addRing", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {}
    xhr.send(params);

    // reload rings
    loadRings();
}


function loadPersons()
{
    var ringSelect = document.getElementById('ringSelect');
    if(ringSelect.selectedIndex==-1){
	return;
    }
    var personSelect = document.getElementById('personSelect');
    
    var xhr = new XMLHttpRequest();
    var params = "ringid=" + ringSelect[ringSelect.selectedIndex].value;
    xhr.open("GET", "/masks/masks.py/getPersons", true);
    xhr.onreadystatechange = function() {
	if(xhr.readyState==4 && xhr.status==200){
	    // remove existing options
	    while(personSelect.options.length){
		personSelect.options.remove(0);
	    }

	    // add options retrieved from server
	    var obj = json_parse(xhr.responseText);
	    for(var i=0; i<obj.persons.length; i++){
		personSelect.options.add(new Option(obj.persons[i].name,
						    obj.persons[i].id));
	    }
	}
    }
    xhr.send();
}


function deletePersonFromRing()
{
    var personSelect = document.getElementById('personSelect');
    var ringSelect = document.getElementById('ringSelect');

    if (ringSelect.selectedIndex == -1){
	return;
    }

    var xhr = new XMLHttpRequest();
    var params = "personid=" +
	personSelect[personSelect.selectedIndex].value.toString() + 
	"&ringid=" + ringSelect[ringSelect.selectedIndex].value.toString();
    xhr.open("POST", "/masks/masks.py/deletePersonFromRing", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {}
    xhr.send(params);

    loadPersons();
}


function addPersonToRing()
{
    var personEntry = document.getElementById('personEntry');
    if (personEntry.value==null || personEntry.value==""){
	return;
    }
    var ringSelect = document.getElementById('ringSelect');
    if (ringSelect.selectedIndex==-1){
	return;
    }
    var xhr = new XMLHttpRequest();
    var params = "ringid=" + ringSelect[ringSelect.selectedIndex].value.toString() + 
	"&personname=" + personEntry.value;
    personEntry.value = ""
    xhr.open("POST", "/masks/masks.py/addPersonToRing", true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.onreadstatechange = function(){}
    xhr.send(params);

    // reload persons
    loadPersons();
}