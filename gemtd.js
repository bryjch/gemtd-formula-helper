/* Doc ready */
$(document).ready(function () {
	loadXMLDoc();

	$(document).on("mouseenter", ".box", function () {
		findBuilds(this);
	});

	$(document).on("mouseleave", ".box", function () {
		clearBuilds();
	});

});

function findBuilds(selection) {
	var builds = $(selection).attr("builds").split(",");
	//console.log(builds);
	var numTowers = 0;
	
	//if (builds.length > 1) {
		$.each(builds, function (index, value) {
			
			numTowers++;
			
			$("td").each( function () {
				var id = $(this).attr("id");
				if (value === id) {
					$("#" + value).addClass("highlight-" + numTowers);
				}
			});
			console.log("builds into: " + value);
			//if (builds.length > 1) {
			//}
		});
		$(selection).addClass("highlight-active-" + numTowers);
	//}
	/*
	else {
		
		$.each(builds, function (index, value) { 
			$("td").each( function () { 
				var id = $(this).attr("id");
				if (value === id) {
					$("#" + value).addClass("highlight-1");
				}
			});
		});
	}
	*/
		
	/* Check which gems/towers are needed to build this one and highlight them */
	var wth = $(selection).attr("with").split(",");
	$.each(wth, function (index, value) {
		$("td").each( function () {
			var id = $(this).attr("id");
			if (value === id) {
				if (builds.length > 1) {
					if (index < 2) {
						$("#" + value).addClass("highlight-1-dim");
					}
					else {
						$("#" + value).addClass("highlight-2-dim");
					}
				}
				else {
					$("#" + value).addClass("highlight-1-dim");
				}
			}
		});
	});
}

function clearBuilds() {
	$("td").each( function () {
		$(this).removeClass("highlight-1");
		$(this).removeClass("highlight-2");
		$(this).removeClass("highlight-1-dim");
		$(this).removeClass("highlight-2-dim");
		$(this).removeClass("highlight-active-1");
		$(this).removeClass("highlight-active-2");
	});
}

function loadXMLDoc() {
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			myFunction(xmlhttp);
		}
	}
	xmlhttp.open("GET", "gem_catalog.xml", true);
	xmlhttp.send();
}


function myFunction(xml) {
	var i;
	var xmlDoc = xml.responseXML;
	
	var tableGems = "<tr><th colspan=2>Gem</th>" + 
					"<th class=gemtype>chipped</th>" + 
					"<th class=gemtype>flawed</th>" +
					"<th class=gemtype>normal</th>" +
					"<th class=gemtype>flawless</th>" +
					"<th class=gemtype>perfect</th></tr>";
	
	var gems = xmlDoc.getElementsByTagName("GEM");
	for (i = 0; i <gems.length; i++) {
		var row = "";
		var type = gems[i].getElementsByTagName("TYPE")[0].childNodes[0].nodeValue;
		var code = gems[i].getElementsByTagName("CODE")[0].childNodes[0].nodeValue;
		var img = gems[i].getElementsByTagName("IMG")[0].childNodes[0].nodeValue;
		var tiers = gems[i].getElementsByTagName("TIER")[0].children;
		
		row += "<tr>";
		row += '<td><img src = gemtd/' + img + '></td>';
		row += "<td>" + type + "</td>";
		for (j = 0; j < tiers.length; j++) {
			var level = textToInt(tiers[j].	tagName);
			var builds = tiers[j].getElementsByTagName("BUILDS")[0].childNodes[0].nodeValue;
			var wth = tiers[j].getElementsByTagName("WITH")[0].childNodes[0].nodeValue;

			row += '<td id="' + code + level +
					'" class="box" builds="' + builds +
					'" with="' + wth + '">' + code + level + '</td>';

		}
		row += "</tr>";

		tableGems += row;
	}
	document.getElementById("gems").innerHTML = tableGems;
	
	/* TOWERS */
	var tableTowers = "<tr><th colspan=2>Tower</th></tr>";
	var towers = xmlDoc.getElementsByTagName("TOWER");
	for (i = 0; i < towers.length; i++) {
		var row = "";
		var type = towers[i].getElementsByTagName("TYPE")[0].childNodes[0].nodeValue;
		var needs = towers[i].getElementsByTagName("NEEDS")[0].childNodes[0].nodeValue;
		var img = towers[i].getElementsByTagName("IMG")[0].childNodes[0].nodeValue;
		var wth = "";
		
		var code = type.replace(/\s+/g, '');
		
		row += "<tr>";
		row += '<td><img src = gemtd/' + img + '></td>';
		row += '<td id="' + code + 
				'" class="box" with="' + needs + 
				'" builds="' + wth + '">' + type + '</td>';
		row += "<tr>";
		
		tableTowers += row;
		
		if (i === 10) {
			document.getElementById("towers").innerHTML = tableTowers;
			tableTowers = "<tr><th colspan=2>Tower</th></tr>";
		}
		
		if (i === (towers.length - 1)) {
			document.getElementById("towers2").innerHTML = tableTowers;
		}
	}
	
}

function textToInt(val) {
	if (val === "ONE") { return "1"; }
	if (val === "TWO") { return "2"; }
	if (val === "THREE") { return "3"; }
	if (val === "FOUR") { return "4"; }
	if (val === "FIVE") { return "5"; }
	else { return ""; }
}
