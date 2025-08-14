console.log('Starting sb-lite');

// List of domains where the customization will take place
const slate = {
	grad: {
		name: "Ohio University Graduate College",
		abbreviation: "(GRAD) ",
		domain: "grad.ohio.edu",
		test_env: "ohg.test.technolutions.net"
	},

	ug: {
		name: "Ohio University",
		abbreviation: "(UG) ",
		domain: "admissions.ohio.edu",
		test_env: "ohi.test.technolutions.net"
	},

	enroll: {
		name: "Ohio University",
		abbreviation: "(EN) ",
		domain: "enroll.ohio.edu",
		test_env: "oun.test.technolutions.net"
	},

	regional: {
		name: "Ohio University Regional Campuses",
		abbreviation: "(RHE) ",
		domain: "rhe.ohio.edu",
		test_env: "ohr.test.technolutions.net"
	},

	current: {
		name: "Ohio University Current Students",
		abbreviation: "(CS) ",
		domain: "student.ohio.edu",
		test_env: "ohs.test.technolutions.net"
	}
}

function updatePageFavicons(isFeatureActive) {
	if (!isFeatureActive) return;

	// Get the current domain 
	const url = window.location.host;

	// Grad Slate
	if (url.includes(slate.grad.domain) || url.includes(slate.grad.test_env)) document.querySelector('link[rel~="icon"]').href = chrome.runtime.getURL('assets/gr_favi.ico');

	// Legacy UG Slate
	if (url.includes(slate.ug.domain) || url.includes(slate.ug.test_env)) document.querySelector('link[rel~="icon"]').href = chrome.runtime.getURL('assets/ug_favi.ico');

	// New UG Slate
	if (url.includes(slate.enroll.domain) || url.includes(slate.enroll.test_env)) document.querySelector('link[rel~="icon"]').href = chrome.runtime.getURL('assets/new_ug_favi.ico');

	// Slate for Current Students
	if (url.includes(slate.current.domain) || url.includes(slate.current.test_env)) document.querySelector('link[rel~="icon"]').href = chrome.runtime.getURL('assets/cs_favi.ico');

	// Old RHE Slate Instance
	if (url.includes(slate.regional.domain) || url.includes(slate.regional.test_env)) document.title = slate.regional.abbreviation + document.title;

	// If it's a test environment, prepend 'TEST' to tab title
	if (url.includes('test.technolutions.net')) document.title = '[TEST] ' + document.title;
}

function updateDatabaseBanner(isFeatureActive) {
	if (!isFeatureActive) return;

	// Get the current domain 
	const url = window.location.host;

	// Grad Slate
	if (url.includes(slate.grad.domain) || url.includes(slate.grad.test_env)) {
		// Find the header banner element
		const headerBanner = document.querySelector('.header_banner');
		if (headerBanner) {
			headerBanner.style.background = '#8800ff';
			headerBanner.style.color = '#ffffff';
		}
	}

	// Legacy UG Slate
	if (url.includes(slate.ug.domain) || url.includes(slate.ug.test_env)) {
		// Find the header banner element
		const headerBanner = document.querySelector('.header_banner');
		if (headerBanner) {
			headerBanner.style.background = '#024230';
			headerBanner.style.color = '#ffffff';
		}
	} 

	// New UG Slate
	if (url.includes(slate.enroll.domain) || url.includes(slate.enroll.test_env)) {
		// Find the header banner element
		const headerBanner = document.querySelector('.header_banner');
		if (headerBanner) {
			headerBanner.style.background = '#55aa00';
			headerBanner.style.color = '#ffffff';
		}
	}

	// Slate for Current Students
	if (url.includes(slate.current.domain) || url.includes(slate.current.test_env)) {
		// Find the header banner element
		const headerBanner = document.querySelector('.header_banner');
		if (headerBanner) {
			headerBanner.style.background = '#aa8b00';
			headerBanner.style.color = '#ffffff';
		}
	} 

	

}

function collapsibleClicked(evt) {
	const searchBodyElem = evt.currentTarget.nextElementSibling;
	searchBodyElem.classList.toggle('sb-collapsed');
}

function updateExportFilterUI(isFeatureActive) {

	if (!isFeatureActive) return;

	// We want to find all the headers and add a span to them with a class and '+' symbol
	const groupHeaderElems = document.querySelectorAll('#search_content .search_group .search_header');

	groupHeaderElems.forEach(elem => {
		// Just in case another mutation happens after the buttons and style are loaded, we don't wanna re-run the same init code again
		if (!elem.classList.contains('sb-header')) {
			elem.classList.add('sb-header');

			// The button that will be used to toggle the collapse functionality
			const collapseButtonElem = document.createElement('span');
			collapseButtonElem.innerText = '+';
			collapseButtonElem.classList.add('sb-collapse-toggle-button');
			elem.appendChild(collapseButtonElem);

			elem.addEventListener('click', collapsibleClicked);

			// I dont know if I wanna have them all hidden by default or what but I can loop through all of the
			// .search_body elements and add the sb-collapsed class
			// const searchBodyElem = elem.nextElementSibling;
			// searchBodyElem.classList.add('sb-collapsed');
		}

		else {
			console.log('Already added button, skipping...');
		}

	});
}


// The main function that will setup all the available tools and features
async function initSlateBuddy() {
	
	// Load custom favicons for each domain
	updatePageFavicons(1);

	// Change the database name banner's color
	updateDatabaseBanner(1);


	function mutationCallback(mutationList, observer) {

		// This section is a check for when there is a dialog box open for adding a new query Export or Filter
		// Adds borders and color around each of the query base lists in the dialog box, also adds the ability
		// to expand and collapse 
		if (document.querySelector('body .dialog_host.ui-draggable .dialog.dialog_closeable #search_content .search_group .search_header') &&
			document.querySelector('body .dialog_host.ui-draggable .dialog.dialog_closeable #search_content .search_group .search_body')) {
			observer.disconnect();
			updateExportFilterUI(true);
			observer.observe(targetNode, config);
		}

		// Check for if there is an action bar menu (like in a dialog box) visible with a 'Save' button
		// If there is, add an eventListener so we can use Alt + Enter to save and close the dialog box
		if (document.querySelector('body>div.dialog_host>div.dialog div.action button.default')) {
			initDialogCloseHotkey(true);
		}
	}
	// Setting up the mutationObserver to check for changes to the DOM, this is to check for when 
	// popups are opened so we know when to make the changes here
	const targetNode = document.body;
	const config = { attributes: false, childList: true, subtree: true };
	let observer = new MutationObserver(mutationCallback);
	observer.observe(targetNode, config);
}

initSlateBuddy();