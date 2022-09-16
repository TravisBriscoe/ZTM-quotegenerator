// Create Global Declarations
// DOM Variables
const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");

// Quotes Array
let apiQuotes = [];

// Remote API variable
let remoteQuotes = 0;

// Functions declaration
// Show loading
function loading() {
	loader.hidden = false;
	quoteContainer.hidden = true;
}

// Hide loading
function complete() {
	quoteContainer.hidden = false;
	loader.hidden = true;
}

// Generate a random quote from the Stored Quotes
function newQuote() {
	let quote;

	if (remoteQuotes === 1) {
		quote = apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
	} else {
		quote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
	}

	return quote;
}

function getNewQuote() {
	// Store the random quote in a variable
	let quote = newQuote();

	// Replace the quote text in the DOM
	if (quote.text.length > 120) {
		quoteText.classList.add("long-quote");
	} else {
		quoteText.classList.remove("long-quote");
	}
	quoteText.textContent = quote.text;

	// Replace the Author in the DOM
	// If author field is blank/null/undefined, replace text with 'Unknown'
	authorText.textContent = quote.author == undefined ? "Unknown" : quote.author;
}

async function getQuotes() {
	// Fetch Quotes and determine if a remote API is available or use local data
	// Call the loader
	loading();

	const apiUrl = "https://type.fit/api/quotes";

	try {
		// Fetch the Quotes from an API
		const response = await fetch(apiUrl);

		// Store the response in an array
		apiQuotes = await response.json();

		// Set variable to 1 upon completion and use remote data for the Quotes
		remoteQuotes = 1;
	} catch (error) {
		// remote api fails, send error and set variable to 0 so local data is fetched instead.
		remoteQuotes = 0;
		console.error({ status: 500, message: "Loading remote API failed. Resorting to local data." });
	}

	// Get a quote upon initial load and hide the loader
	getNewQuote();
	complete();
}

function tweetQuote() {
	// Send quote as tweet (user must log in)
	const twitterUrl = `https://twitter.com/intent/tweet?text=${quoteText.textContent} - ${authorText.textContent}`;
	window.open(twitterUrl, "_blank");
}

// Run the function upon load to populate the Quotes Array and fetch a quote
getQuotes();

// Listener declarations
// Add a listener to the New Quote Button and fetch a new quote.
newQuoteBtn.addEventListener("click", getNewQuote);

// Add a listener to the twitter button
twitterBtn.addEventListener("click", tweetQuote);
