/* eslint-env browser */

function addRatingsEventListeners() {
	var ratingLinks = document.querySelectorAll('.report');

	Array.from(ratingLinks).forEach(function(element) {
		element.addEventListener('click', function(e) {
			e.preventDefault();
		});
	});
}

function initComments() {
	addReportEventListeners();
}

document.addEventListener('DOMContentLoaded', initReports);
