$("body").keypress(function(event) {
	if(pickerInView) {
		if(event.which == 49) // '1'
			PickWinner();
		else if(event.which == 53) // '5'
			$("#audioSpin")[0].play();
		else if(event.which == 54) // '6'
			$("#audioAnnounce")[0].play();
		else if(event.which == 48 && !(animating)) // '0'
			ReturnToInput();
	}
});

var arrayNames = [], animating = false, winnerShown = false, pickerInView = false,
	arrayColours = ["#EE82EE", "#0000FF", "#008000", "#FFFF00", "#FFA500", "FF0000"],
	rotationDegrees = null, colourChangeInterval = null;

function LoadInput() {
	CleanseInput();
	NamesToArray();
	
	if(arrayNames.length > 0) {
		var rotationDegrees = parseInt($("input[name=radioRotation]:checked").val()) * 360;
		var colourChangeInterval = parseInt($("input[name=radioColourChange]:checked").val());
		
		SetOptions();
	
		$("#sectionInput").hide();
		$("#sectionPicker").show();
		pickerInView = true;
	}
}

function CleanseInput() {
	var text = $('#txtInput').val();
	text = text.replace(/^\s*[\r\n]/gm, '');
	$("#txtInput").val(text);
}

function NamesToArray() {
	var lines = $('#txtInput').val().split(/\n/);
	arrayNames = [];
	
	for (var i=0; i < lines.length; i++) {
		// only push this line if it contains a non whitespace character.
		if (/\S/.test(lines[i])) {
			arrayNames.push($.trim(lines[i]));
		}
	}
	
	console.log("Names loaded into Array... (" + arrayNames.length.toString() + ")");
	console.table(arrayNames);
}

function SetOptions() {
	console.log("Options...");
	
	rotationDegrees = parseInt($("input[name=radioRotation]:checked").val()) * 360;
	console.log("Rotation degrees: " + rotationDegrees.toString() + " (" + $("input[name=radioRotation]:checked").val() + " x 360)");
	
	colourChangeInterval = parseInt($("input[name=radioColourChange]:checked").val());
	console.log("Colour change interval: " + colourChangeInterval.toString() + "ms");
}

function PickWinner() {
	if(animating)
		return;

	if(winnerShown) {
		$("#divWinner").slideUp();
		winnerShown = false;
		return;
	}
	
	$("#sectionPicker .divImageHolder").css("transition-duration", "7s");
	
	if(arrayNames.length < 1) {
		ReturnToInput();
	} else {
		$("#audioSpin")[0].play();
		
		animating = true;
		
		setTimeout(function(){ SetRandomColour(); }, colourChangeInterval);
		
		$("#sectionPicker .divImageHolder").css("transform", "rotate(" + rotationDegrees.toString() + "deg)");
		$("#sectionPicker .divImageHolder").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
			function(event) {
				animating = false; winnerShown = false;
				
				$("#sectionPicker .divImageHolder").css("background-color", "transparent");
			
				$("#lblWinner").text("");
				$("#sectionPicker .divImageHolder").css("transition-duration", "0s");
				$("#sectionPicker .divImageHolder").css("transform", "rotate(0deg)");
				
				var intWinner = Math.floor(Math.random() * arrayNames.length);
				
				$("#lblWinner").text("🥳 " + arrayNames[intWinner] + " 🎉");
				console.log("Winner: " + arrayNames[intWinner] + " - now removed from names Array.");
				
				arrayNames.splice(intWinner, 1);
				console.log("Names remaining in Array... (" + arrayNames.length.toString() + ")");
				console.table(arrayNames);
				
				$("#audioAnnounce")[0].play();
				$("#divWinner").slideDown();
				winnerShown = true;
			}
		);
	}
}

function SetRandomColour() {
	$("#sectionPicker img").css("background-color", arrayColours[Math.floor(Math.random() * arrayColours.length)]);
	
	if(animating)
		setTimeout(function(){ SetRandomColour() }, colourChangeInterval);
	else
		$("#sectionPicker img").css("background-color", "transparent");
}

function ReturnToInput() {
	$("#divWinner").hide();
	winnerShown = false;

	$("#sectionPicker").hide(); $("#sectionInput").show();
	pickerInView = false;
}