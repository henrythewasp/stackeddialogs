/* globals jQuery */

(function ($){

	/*
	 *  stackeddialogs
	 *  
	 *  jQuery plugin to manage little dialog boxes that can be stacked in the browser window.
	 *  
	 *
	 */

	var version = '(1.0)';

	var stack = [];
	var idCount = 0;

	var defaults = {
		dialogClass: 'stackeddialog_small',
		autoCloseTimeout: 10000,
		maxNum: 3,
		height: 'auto',
		width: 250,
		minHeight: 0,
		show: { effect:'fade', direction:'right', duration:500 },
		hide: { effect:'fade', direction:'right', duration:500 }
	};

	function getPosition(i) {
		return (i === 0) ? { my: 'bottom', at: 'left bottom', of: window, offset: '0 -10' }
						 : { my: 'bottom', at: 'top', of: stack[i-1], offset: '0 -25' };
	}

	function refreshPositions() {
		$.each(stack, function(idx, $element) {
			$element.data('index', idx).dialog({ position : getPosition(idx) }).dialog('open');
		});
	}

	function checkSpace(maxNum, makeSpaceForNewDialog) {
		var numToDelete = 0;
		var maxDialogsAllowedOnPage = maxNum || 0;

		// Check that the current stack can fit on the page. Reduce maxDialogsAllowedOnPage if necessary
		$.each(stack, function(idx, $element) {
			if ($element.dialog('isOpen') && $element.offsetParent().offset().top <= ($element.height() * (makeSpaceForNewDialog ? 2 : 1))) {
				maxDialogsAllowedOnPage = ($element.offsetParent().offset().top <= 0) ? idx : idx+1;
				return false;
			}
		});

		// maxDialogsAllowedOnPage can't be more than maxNum (if specified)
		if (maxNum && maxNum > 0 && maxDialogsAllowedOnPage > maxNum) {
			maxDialogsAllowedOnPage = maxNum;
		}

		if (maxDialogsAllowedOnPage > 0) {
			numToDelete = stack.length - maxDialogsAllowedOnPage;
		}

		if (numToDelete > 0) {
			$.each(stack, function(idx, $element) {
				try { $element.dialog('close'); } catch(err) {} // Catch any exceptions to prevent causing a break out of loop.
				return (idx < numToDelete-1);
			});
		} else {
			refreshPositions();
		}
	}

	function removeDialog(i) {
		var dels = stack.splice(i, 1);
		if (dels.length) { dels[0].dialog('destroy'); }
	}

	// Exported functions ----------------------------------------------------------------
	$.fn.addStackedDialog = function(msg, args) {
		var id = 'stackeddialog_id' + idCount++;
		var index = stack.length;
		var config = $.extend({}, defaults, args);
		var autoCloseTimer;

		config = $.extend(config, {
			autoOpen: false,
			draggable: false,
			resizable: false,
			open: function(event) {
				if (config.autoCloseTimeout > 0) {
					autoCloseTimer = setTimeout(function() {
						try { $('#'+id).dialog('close'); } catch(err) {}
					}, config.autoCloseTimeout);
				}
			},
			create: function(event) {
				$(event.target).dialog('widget').css({ 'position': 'fixed' });
			},
			close: function(event) {
				clearTimeout(autoCloseTimer);
				removeDialog($(event.target).data('index'));
				refreshPositions();
			},
			position: getPosition(index) 
		});

		// Create new dialog and push it onto the stack
		$('body').append('<div id="' + id + '" data-index="' + index + '">' + msg + '</div>');
		stack.push($("#"+id).dialog(config));

		// Make space for the new dialog and open it
		checkSpace(config.maxNum, true);
	};

	$.fn.refreshStackedDialogs = function() {
		refreshPositions();
		checkSpace();
	};

})(jQuery);
