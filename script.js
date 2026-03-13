let searchHistory = JSON.parse(localStorage.getItem("history")) || [];
let searchInputEl = document.getElementById("searchInput");
let searchResultsEl = document.getElementById("searchResults");
const spinnerEl = document.getElementById("spinner");
let suggestionsEl = document.getElementById("suggestions");

{/* Suggestion query */}
function getSuggestions(query) {

  if(query.length === 0){
    suggestionsEl.classList.add("hidden");
    return;
  }

  let url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
            encodeURIComponent(query) +
            "&limit=5&namespace=0&format=json&origin=*";

  fetch(url)
  .then(response => response.json())
  .then(data => {

    let suggestions = data[1];

    suggestionsEl.innerHTML = "";

    suggestions.forEach(function(item){

      let suggestionItem = document.createElement("div");
      suggestionItem.textContent = item;

      suggestionItem.classList.add(
        "p-2",
        "cursor-pointer",
        "hover:bg-gray-200"
      );

      suggestionItem.onclick = function(){
        searchInputEl.value = item;
        suggestionsEl.classList.add("hidden");
      };

      suggestionsEl.appendChild(suggestionItem);

    });

    suggestionsEl.classList.remove("hidden");

  });

}


{/*toggle-butn-code*/}
let themeToggleBtn = document.getElementById("themeToggle");

themeToggleBtn.addEventListener("click", function () {

  document.body.classList.toggle("bg-black");
  document.body.classList.toggle("text-white");

  searchInputEl.classList.toggle("bg-gray-800");
  searchInputEl.classList.toggle("text-white");
  searchInputEl.classList.toggle("border-gray-600");

  searchResultsEl.classList.toggle("bg-black");

  if (themeToggleBtn.textContent.includes("Dark")) {
    themeToggleBtn.textContent = "☀ Light Mode";
    themeToggleBtn.classList.remove("bg-gray-200");
    themeToggleBtn.classList.add("bg-yellow-400");
  } else {
    themeToggleBtn.textContent = "🌙 Dark Mode";
    themeToggleBtn.classList.remove("bg-yellow-400");
    themeToggleBtn.classList.add("bg-gray-200");
  }

});

function createAndAppendSearchResult(result) {
  let resultItemEl = document.createElement("div");
  resultItemEl.classList.add(
"mb-5",
"p-4",
"rounded-lg",
"shadow-md",
"bg-gray-100",
"dark:bg-gray-800"
);

  let { link, title, description } = result;

  let titleEl = document.createElement("a");
  titleEl.href = link;
  titleEl.target = "_blank";
  titleEl.textContent = title;
  titleEl.classList.add("text-[22px]", "hover:underline", "text-blue-500");
  resultItemEl.appendChild(titleEl);

  let titleBreakEl = document.createElement("br");
  resultItemEl.appendChild(titleBreakEl);

  let urlEl = document.createElement("a");
  urlEl.classList.add("text-green-500", "no-underline");
  urlEl.href = link;
  urlEl.target = "_blank";
  urlEl.textContent = link;
  resultItemEl.appendChild(urlEl);

  let descriptionEl = document.createElement("p");
  descriptionEl.classList.add("text-gray-300", "text-sm", "mt-1");
  descriptionEl.textContent = description;
  resultItemEl.appendChild(descriptionEl);

  searchResultsEl.appendChild(resultItemEl);

  let bookmarkBtn = document.createElement("button");
bookmarkBtn.textContent = "⭐ Save";
bookmarkBtn.classList.add("ml-3","text-yellow-400");

bookmarkBtn.onclick = function(){
  let saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
  saved.push({title,link});
  localStorage.setItem("bookmarks",JSON.stringify(saved));
  alert("Saved to bookmarks");
};

resultItemEl.appendChild(bookmarkBtn);
}
function displayResults(searchResults) {
  spinnerEl.classList.toggle("hidden");

  for (let result of searchResults) {
    createAndAppendSearchResult(result);
  }
}

function searchWikipedia(event) {
    suggestionsEl.classList.add("hidden");
  if (event.key === "Enter") {
    spinnerEl.classList.toggle("hidden");

    searchResultsEl.textContent = "";

    let searchInput = searchInputEl.value;
    searchHistory.push(searchInput);
    localStorage.setItem("history", JSON.stringify(searchHistory));
    let url = "https://apis.ccbp.in/wiki-search?search=" + encodeURIComponent(searchInput);
    let options = {
      method: "GET",
    };
    fetch(url, options)
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonData) {
        let { search_results } = jsonData;
        displayResults(search_results);
      })
      .catch(function (error) {
        spinnerEl.classList.toggle("hidden");
        console.error("Error fetching search results:", error);
      });
  }
}

searchInputEl.addEventListener("keydown", searchWikipedia);
searchInputEl.addEventListener("input", function(){
  getSuggestions(searchInputEl.value);
});

let voiceBtn = document.getElementById("voiceBtn");

voiceBtn.addEventListener("click", function () {

const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.lang = "en-US";

recognition.start();

recognition.onresult = function (event) {

let transcript = event.results[0][0].transcript;

searchInputEl.value = transcript;

// automatically trigger search
searchWikipedia({ key: "Enter" });

};

});