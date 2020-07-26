const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const quoteTextContainer = document.getElementById('quote-text-container');

// Show loading
function setLoading(loading) {
  loader.hidden = !loading;
  quoteContainer.hidden = loading;
}

let retries = 0;
function fetchQuote() {
  retries = 0;
  quoteTextContainer.hidden = false;
  authorText.innerText = '';
  getQuote();
}

function hideQoute() {
  setLoading(false);
  quoteTextContainer.hidden = true;
  authorText.innerText =
    'There was an error getting a quote.\nPlease try again later.';
}

// Get quote from API
async function getQuote() {
  if (retries >= 5) {
    return hideQoute();
  }

  setLoading(true);
  const proxyUrl = 'https://quiet-harbor-57645.herokuapp.com/';
  const apiUrl =
    'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();

    authorText.innerText = data.quoteAuthor || 'Unknown';
    quoteText.innerText = data.quoteText;

    // Reduce font size for long quotes
    data.quoteText.length > 120
      ? quoteText.classList.add('long-quote')
      : quoteText.classList.remove('long-quote');

    setLoading(false);
  } catch (err) {
    // The API has issues with the single quote character, so we get another quote
    ++retries;
    setTimeout(getQuote, 1000);
    console.log(err);
  }
}

function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;

  const twitterUrl = `https://twitter.com/intent/tweet?text="${quote}" - ${author}`;
  window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', fetchQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
fetchQuote();
