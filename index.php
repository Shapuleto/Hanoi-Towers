<!DOCTYPE html>
<html>
<head>
	<title>Hanoi Towers</title>
	<link href="css/dnd.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script type="text/javascript" src="http://code.jquery.com/ui/1.10.2/jquery-ui.js"></script>
	<script type="text/javascript" src="js/dnd.js"></script>
</head>
<body>
<div id="content" class="content">
	<div id="menu_bar" class="menu_bar menu_bar_custom">
		<div class="menu_item" id="discs">Discs: <span>0</span></div>
		<div class="menu_item" id="moves">Moves: <span>0</span></div>
		<div class="menu_item" id="minimal_moves">Min: <span>0</span></div>
		<div class="menu_item countUp" id="countUp">Time: <span id="min">00</span> : <span id="sec">01</span></div>
	</div>
	<div id="board" class="indent">
		<ul>
			<li id="dnd_column_1" class="column_li">
				<ul>
				</ul>
			</li>
			<li id="dnd_column_2" class="column_li">
				<ul>
				</ul>
			</li>
			<li id="dnd_column_3" class="column_li">
				<ul>
				</ul>
			</li>
		</ul>
		<div style="clear: both;"></div>
	</div>
</div>
<div id="scores_bar" class="scores_bar">
</div>
</body>
</html>
