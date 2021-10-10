function removeAllHighlights() {
	$("li.on").each(function() {
		$(this).removeClass('on');
	});
	$(".song_highlight").each(function() {
		$(this).removeClass('song_highlight');
	});
}		

function selectSongs(describe, value='') {
	if ($(event.target).hasClass('on')) {
		removeAllHighlights();
		$(event.target).removeClass('on');
	} else {
		removeAllHighlights();
		$(event.target).addClass('on');
		$(".song").each(function() {
			var isSelected = false;
			switch (describe) {
				case 'artist':
					isSelected = $(this).attr('data-artist').includes(value);
					break;
				case 'single-week':
					isSelected = +$(this).attr('data-woc') == 1;
					break;
				case 'return-songs':
					isSelected = $(this).attr('data-number') == 're';
					break;
				case '10-or-more':
					isSelected = +$(this).attr('data-woc') >= 10;
					break;
				case 'joint-number-1s':
					isSelected = +$(this).attr('data-overlapping') == 1;
					break;
				case 'christmas-number-1s':
					isSelected = +$(this).attr('data-christmas') == 1;
					break;
				case 'one-thousand':
					isSelected = +$(this).attr('data-number') == 1000;
					break;
			}
			if (isSelected)
				$(this).addClass('song_highlight');
		});
	}
}

function makeTooltipHtml(id) {
	var source = $('#block_' + id);
	var tooltips = [];
	tooltips['Artist'] = source.attr('data-artist');
	tooltips['Song'] = source.attr('data-title');
	tooltips['Date'] = source.attr('data-date');
	var appearances = source.attr('data-appearances').split(' ');
	if (appearances.length == 1) {
		tooltips['Weeks at number&nbsp;1'] = source.attr('data-woc');
	} else {
		var wocs = [];
		var sum = 0;
		for (var appearance of appearances) {
			if (appearance == id)
				wocs.push("<span class='highlight_number'>" + data[appearance].woc + "</span>");
			else
				wocs.push(data[appearance].woc);
			sum += +data[appearance].woc;
			tooltips['Weeks at number&nbsp;1'] = wocs.join('+') + ' = ' + sum;
		}
	}
	if (source.attr('data-overlapping') == '1')
		tooltips['Note Overlapping'] = 'Has overlapping week(s) with adjacent song.';
	if (source.attr('data-christmas') == '1')
		tooltips['Note Christmas'] = 'This was a Christmas number 1.';
	var tooltip = ''
	for (var pair of Object.entries(tooltips))
		tooltip += '<tr><th>' + (pair[0].startsWith('Note') ? 'Note' : pair[0]) + ':</th><td>' + pair[1] + '</td></tr>';
	return '<table>' + tooltip + '</table>';
}

function cleanHtml(html) {
	return html.replace(/(<[^>]+>|")/g, '');
}

function makeSuffix(number) {
	if (![11, 12, 13].includes(number % 100)) {
		switch (+number % 10) {
			case 1: return 'st';
			case 2: return 'nd';
			case 3: return 'rd';
		}
	}
	return 'th';
}

var selectedSong = -1;

$(document).ready(function() {
	$('.tooltip').tooltipster({ delay: 0, distance: 0 });
	$('.song').mousedown(function() {
		removeSelectedSongs();
		if (selectedSong == $(this).attr('data-id')) {
			$('#selected p').html('Click on a song to show the details here.');
			selectedSong = -1;
		} else {
			var clickedArtist = $(this).attr('data-artist');
			var clickedSong = $(this).attr('data-title');
			var item = data[+$(this).attr('data-id')];
			var details = 'Artist: ' + item.artist + '<br/>Song: ' + item.song + '<br/>';
			var appearances = $(this).attr('data-appearances').split(' ');
			if (appearances.length == 1) {
				details += 'Date: ' + item.date + '<br/>';
				details += 'Weeks at number&nbsp;1: ' + item.woc + '<br/>';
				details += 'This was the ' + (+item.number).toLocaleString() + makeSuffix(+item.number) + ' number&nbsp;1.<br/>';
			} else {
				var dates = [], wocs = [], sum = 0;
				for (var appearance of appearances) {
					if (appearance == $(this).attr('data-id')) {
						wocs.push("<span style='font-weight:bold'>" + data[appearance].woc + "</span>");
						dates.push("<span style='font-weight:bold'>" + data[appearance].date.replace(/ /g, '&nbsp;') + "</span>");
					} else {
						wocs.push(data[appearance].woc);
						dates.push(data[appearance].date.replace(/ /g, '&nbsp;'));
					}
					sum += +data[appearance].woc;
				}
				details += 'Dates: ' + dates.join(', ') + '<br/>';
				details += 'Weeks at number&nbsp;1: ' + wocs.join('+') + ' = ' + sum + '<br/>';
				var firstAppearance = +data[+appearances[0]].number
				details += 'This was the ' + firstAppearance.toLocaleString() + makeSuffix(firstAppearance) + ' number&nbsp;1.<br/>';
			}
			if ($(this).attr('data-overlapping') == '1') {
				details += 'This has overlapping weeks at number&nbsp;1.<br/>';
			}
			if ($(this).attr('data-christmas') == '1') {
				details += 'This was a Christmas number&nbsp;1.<br/>';
			}
			details = details.replace(/href="/g, 'href="https://en.wikipedia.org');
			$('#selected p').html(details);
			selectedSong = $(this).attr('data-id');
			$(".song").each(function() {
				if ($(this).attr('data-artist') == clickedArtist &&
					$(this).attr('data-title') == clickedSong) {
					$(this).addClass('song_selected');
				}
			});
		}
	});
});

function removeSelectedSongs() {
	$(".song_selected").each(function() {
		$(this).removeClass('song_selected');
	});
}

function isUsed(a) {
	return a;
}

isUsed([cleanHtml]);