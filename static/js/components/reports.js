/* eslint-env browser */

function addReportEventListeners() {
	var ratingLinks = document.querySelectorAll('.report');

	Array.from(ratingLinks).forEach(function(element) {
		element.addEventListener('click', function(e) {
			e.preventDefault();
		});
	});
}

function initReports() {
	addReportEventListeners();
}

document.addEventListener('DOMContentLoaded', initReports);
