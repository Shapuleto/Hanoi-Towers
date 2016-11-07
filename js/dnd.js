//	*	*	*	*	*	*	4th Strike	*	*	*	*	*	*	//
//	Begin-	Ending the game
function youWon(droppedLevel){
	var qttDisc = $("#board #dnd_column_1 li.bar").length;
	if(qttDisc == droppedLevel){
		clearInterval(window.intervalId);
		alert("Congratulations. You won in: " + Moves + " moves \n and in " + $("#countUp #min").text() + ":" + $("#countUp #sec").text() + " time!!");
		//	ask for level: easy, medium or hard, get time, compare the moves, ask to reset, fix z index for the last disc at board creation
	}
}

//	Begin-	Calculating the time taken
function countUp() {
	if (s == 0 || s === "undefined" || s === null ) {
		var s = 0;
	}
	else {
		s = $("#countUp #sec").text();
		//alert(s);
		s = s.charAt(1);
		//alert(s);
		s = parseInt($("#countUp #sec").text());
		//alert(s);
		if (s == 59) {
			s = 0;
			m = parseInt($("#countUp #min").text());
			if(m == 59){
				clearInterval(window.intervalId);
				alert("Max time allow reached!!");
			}
			else{
				m = m + 1;
				//$("#countUp #min").html(m);
				(m < 10)? $("#countUp #min").html("0" + m) : $("#countUp #min").html(m);;
				$("#countUp #sec").html("0" + s);
			}
		}
		else {
			s = s + 1;
			(s < 10)? $("#countUp #sec").html("0" + s) : $("#countUp #sec").html(s);
		}
	}
}

//	Begin-	Displaying the time taken
function timeElapsed() {
	window.intervalId = setInterval('countUp()', 1000);
}

//	Begin-	Calculating the minimal moves with the number of disc
function minimalMoves(qttDisc) {
	var minMoves = 3;
	for(var i = minMoves; i <= qttDisc; i++){
		//alert(minMoves);
		minMoves = (minMoves * 2) + 1
	}
	$("#minimal_moves span").html(minMoves);
}

//	Begin-	Counting and displaying the moves done
function moves(Moves) {
	Moves = parseInt($("#moves span").text());
	Moves = Moves + 1;
	$("#moves span").html(Moves);
}

//	Begin-	Search next discs to set as draggable
function searchDraggable(columnId) {
	if ($("#" + columnId + " li.bar .disc").first().attr("id")) {
		var discToDrag = $("#" + columnId + " li.bar .disc").first();
		//alert($(discToDrag).attr("id"));
		setDraggable(discToDrag);
		discToDrag.draggable("option", "disabled", false);
	}	
}

//	Begin-	Search next places to set to droppable
function searchDroppable(columnId) {
	$("#" + columnId).find("li.bar.droppable.ui-droppable").each(function () {
		$(this).removeClass("droppable").droppable("option", "disabled", true);
	});
}

//	Begin-	Droppable Function
function setDroppable(parentLineId, placeToDrop, discStrength, Moves) {
	$(placeToDrop).droppable({
		hoverClass: "droppable_hover",
		accept: ".disc",
		drop: function (event, ui) {
			var dropped = ui.draggable;
			var droppedOn = $(this);
			var parentColumnId = dropped.parent().parent().parent().attr("id");
			var parentColumnIdDest = droppedOn.parent().parent().attr("id");
			var droppedLevelId = $(droppedOn).attr("id");
			var droppedLevel = droppedLevelId.replace("col_", "").replace("middle_", "").replace("right_", "");

			$(dropped).detach().css({ top: 0, left: 0 }).prependTo(droppedOn);
			$("#" + parentLineId).addClass("custom_bar");
			$(droppedOn).removeClass("custom_bar");

			//	Get the column id to unset the droppable option, excluding 'this'
			$("#" + parentColumnId).parent().parent().find(".column_li").each(function () {
				if (parentColumnId != this.id) {
					searchDroppable(this.id);
				}
			});

			//	Get the column id to set the draggable option, excluding 'this'
			$("#" + parentColumnIdDest).parent().parent().find(".column_li").each(function () {
				if (parentColumnIdDest != this.id) {
					searchDraggable(this.id);
				}
			});

			//	Get the disc on the bottom to unset the draggable option
			if ($(droppedOn).next().children().is(".disc")) {
				var bottomDisc = $(droppedOn).next().children();
				$(bottomDisc).removeClass("draggable").draggable("option", "disabled", true);
			}
			moves(Moves);
			if(window.start == false){
				timeElapsed();
				start = true;
				}
			if(discStrength == 1){
				youWon(droppedLevel);
			}
		}
	});
}

//	Begin-	Find first space to drop
function getDroppablePlace(parentColumnId, parentLineId, columnId, discStrength, Moves) {
	if ($("#" + columnId + " li.bar .disc").first().attr("id")) {
		var placeToDrop = $("#" + columnId + " li.bar .disc").first().parent().prev().addClass("droppable");
		var disctFoundStrength = $("#" + columnId + " li.bar .disc").first().attr("id").replace("disc_", "");
		if (discStrength < disctFoundStrength) {
			setDroppable(parentLineId, placeToDrop, discStrength, Moves);
			$(placeToDrop).droppable("option", "disabled", false);
		}
	}
	else {
		var from = parentLineId;
		var placeToDrop = $("#" + columnId + " li.bar").last().addClass("droppable");

		setDroppable(parentLineId, placeToDrop, discStrength, Moves);
		$(placeToDrop).droppable("option", "disabled", false);
	}
}

//	Begin-	Draggable Function
function setDraggable(draggingDisc, Moves) {
	$(draggingDisc).addClass("draggable").draggable({
		revert: "invalid",
		cursor: "move",
		start: function (event, ui) {
			var draggable				= ui.draggable;
			var draggableOn			= $(this);
			var parentColumnId	= draggableOn.parent().parent().parent().attr("id");
			var parentLineId		= draggableOn.parent().attr("id");
			var discStrength		= $(draggingDisc).attr("id").replace("disc_", "");

			// To set the dragging object class to dragging for z-index effects only
			draggableOn.addClass("dragging");

			//	Get the column id to set it to droppable, excluding 'this'
			$("#" + parentColumnId).parent().parent().find(".column_li").each(function () {
				if (parentColumnId != this.id) {
					getDroppablePlace(parentColumnId, parentLineId, this.id, discStrength, Moves);
				}
			});
		},
		stop: function (event, ui) {
			var draggable = ui.draggable;
			var draggableOn = $(this);

			// To set off the dragging object class to dragging for z-index effects only
			draggableOn.removeClass("dragging");
		}
	});
}

//	Begin-	Create Disc Function
function createDisc(qttDisc) {
	var lim = qttDisc + 1;
	var discs = "";

	for (var i = 1; i < lim; i++) {
		if(i % 2 == 0){
			discs = discs + "<li class=\"bar\" id=\"col_left_" + (lim - i) + "\"><div id=\"disc_" + i + "\" class=\"disc blue_disc\">&nbsp;</div></li>";
		}
		else{
			discs = discs + "<li class=\"bar\" id=\"col_left_" + (lim - i) + "\"><div id=\"disc_" + i + "\" class=\"disc red_disc\">&nbsp;</div></li>";
		}
	}
	return discs;
}

//	Begin-	Create Columns Function
function createColumns(qttDisc){
	var lim = qttDisc + 1;
	var columns = ["left", "middle", "right"]
	var string = "<ul>";

	for(var i = 1; i < 4; i++){
		string = string + "<li id=\"dnd_column_" + i + "\" class=\"column_li\"><ul>";
		if(i == 1){
			string = string + "<li id=\"top_" + columns[i - 1] + "\" class=\"top_bar\"></li>";
			string = string + createDisc(qttDisc);
			string = string + "<li id=\"base_" + columns[i - 1] + "\" class=\"base base_custom\"></li>"
		}
		else{
			string = string + "<li id=\"top_" + columns[i - 1] + "\" class=\"top_bar\"></li>";
			for(var j = 1; j < lim; j++){
				string = string + "<li class=\"bar custom_bar\" id=\"col_" + columns[i - 1] + "_" + (lim - j) + "\"></li>";
			}
			string = string + "<li id=\"base_" + columns[i - 1] + "\" class=\"base base_custom\"></li>";
		}
		string = string + "</ul></li>";
	}
	string = string + "</ul><div style=\"clear: both;\"></div>";
	$("div#board").html(string);
	$("div#discs span").html(qttDisc);
}

//	Begin- Init function
function init(qttDisc) {
	window.start = false;
	var Moves = 0;
	createColumns(qttDisc);
	setDraggable($("div#disc_1.disc"), Moves);
	minimalMoves(qttDisc);
}

//	Level Selection
function selectLevel(){
	//var name = prompt("<i>Please enter your name</i>");
	//$("<div>" + name + "</div>").appendTo( document.body );
	$("#dialog").dialog("open");
	$("#modal_confirm_yes_no").dialog({
		bgiframe: true,
		autoOpen: true,
		minHeight: 200,
		width: 350,
		modal: true,
		closeOnEscape: false,
		draggable: false,
		resizable: false,
		buttons: {
			'easy': function(){
				$(this).dialog('close');
				callback(true);
			},
			'medium': function(){
				$(this).dialog('close');
				callback(false);
			},
		},
		show: {
			effect: "explode",
			duration: 1000
		},
		hide: {
			effect: "explode",
			duration: 1000
		}
  });

	function callback(value){
		alert(value);
	}
}

//	Function to detect the user agent
function detectUserAgent(){
	var prop = "";
	var position = jQuery.browser.version.indexOf(".");
	var version = jQuery.browser.version.substr(0, position)
	//alert(version);

	if(jQuery.browser.chrome){
		if(version >= 27){
			//alert("Your are using Chrome version: " + jQuery.browser.version);
			//prop = crossBrowserCompatibility();
			selectLevel();
			var qttDisc = 5;
			init(qttDisc);
		}
		else{
			$("<div>Please, in order to see this page working propertly: </div>").appendTo(document.body);
			$("<div><a href=\"https://www.google.com/intl/en/chrome/browser/\" target=\"_blank\" >Download the latest version of your browser here</a></div>").appendTo(document.body);
			jQuery.each(jQuery.browser, function(i, val) {
			  $("<div>" + i + " : <span>" + val + "</span>").appendTo( document.body );
			});
		}
	}
	else if(jQuery.browser.msie){
		if(version >= 10){
			//alert("Your are using Microsoft Internet Explorer version: " + jQuery.browser.version);
			//prop = crossBrowserCompatibility();
			var qttDisc = 5;
			init(qttDisc);
		}
		else{
			$("<div>Please, in order to see this page working propertly: </div>").appendTo(document.body);
			$("<div><a href=\"http://windows.microsoft.com/en-us/internet-explorer/ie-10-worldwide-languages\" target=\"_blank\" >Download the latest version of your browser here</a></div>").appendTo(document.body);
			jQuery.each(jQuery.browser, function(i, val) {
			  $("<div>" + i + " : <span>" + val + "</span>")
			  .appendTo( document.body );
			});
		}
	}
	else if(jQuery.browser.mozilla){
		if(version >= 20){
			//alert("Your are using Mozilla Firefox version: " + jQuery.browser.version);
			//prop = crossBrowserCompatibility();
			var qttDisc = 5;
			init(qttDisc);
		}
		else{
			$("<div>Please, in order to see this page working propertly: </div>").appendTo(document.body);
			$("<div><a href=\"http://www.mozilla.org/en-US/firefox/new/\" target=\"_blank\" >Download the latest version of your browser here</a></div>").appendTo(document.body);
			jQuery.each(jQuery.browser, function(i, val) {
			  $("<div>" + i + " : <span>" + val + "</span>")
			  .appendTo( document.body );
			});
		}
	}
}

//	Begin-	Main Function
$(function (event, ui) {
	detectUserAgent();
});
