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
