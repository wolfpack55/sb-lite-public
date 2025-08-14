console.log('Starting sb-lite');

// List of domains where the customization will take place
const slate = {
	grad: {
		name: "Ohio University Graduate College",
		abbreviation: "(GRAD) ",
		domain: "grad.ohio.edu",
		test_env: "ohg.test.technolutions.net",
		banner_color: "#AA8A00",
		banner_text_color: "#FFFFFF",
		favicon: "gr_favi_v2.ico"
	},

	ug: {
		name: "Ohio University",
		abbreviation: "(UG) ",
		domain: "admissions.ohio.edu",
		test_env: "ohi.test.technolutions.net",
		banner_color: "#FA4616",
		banner_text_color: "#FFFFFF",
		favicon: "ug_favi_v2.ico"
	},

	enroll: {
		name: "Ohio University",
		abbreviation: "(EN) ",
		domain: "enroll.ohio.edu",
		test_env: "oun.test.technolutions.net",
		banner_color: "#A4D65E",
		banner_text_color: "#000000",
		favicon: "en_favi_v3.ico"
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
		test_env: "ohs.test.technolutions.net",
		banner_color: "#00694E",
		banner_text_color: "#FFFFFF",
		favicon: "cs_favi_v2.ico"
	}
}

// Updated favicon function
function updatePageFavicons(isFeatureActive, slateInstance) {
    if (!isFeatureActive) return;
    if (!slateInstance.favicon) return;

    const faviconLink = document.querySelector('link[rel~="icon"]');
    if (faviconLink) {
        faviconLink.href = chrome.runtime.getURL(`assets/${slateInstance.favicon}`);
    }
}

function updateDatabaseBanner(isFeatureActive, slateInstance) {
    if (!isFeatureActive) return;
    if (!slateInstance.banner_color) return;

    const headerBanner = document.querySelector('.header_banner');
    if (headerBanner) {
        headerBanner.style.background = slateInstance.banner_color;
        headerBanner.style.color = slateInstance.banner_text_color;
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

	const url = window.location.host;

    // Determine which slate instance matches the current URL
    let slateInstance = null;
    for (const key in slate) {
        if (url.includes(slate[key].domain) || url.includes(slate[key].test_env)) {
            slateInstance = slate[key];
            break;
        }
    }

    if (!slateInstance) return; // Not a Slate instance we care about

    // If it's a test environment, prepend '[TEST]' to the tab title
    if (url.includes('test.technolutions.net')) {
        document.title = '[TEST] ' + document.title;
    }

	// Load custom favicons for each domain
	updatePageFavicons(1, slateInstance);

	// Change the database name banner's color
	updateDatabaseBanner(1, slateInstance);


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
	}
	// Setting up the mutationObserver to check for changes to the DOM, this is to check for when 
	// popups are opened so we know when to make the changes here
	const targetNode = document.body;
	const config = { attributes: false, childList: true, subtree: true };
	let observer = new MutationObserver(mutationCallback);
	observer.observe(targetNode, config);
}

initSlateBuddy();