'use strict';

// put your own value below!
const apiKey = 'hPyt0zBDuXbG3xo6AWfhAfOtfLv5eP2PeXymD8Yf';  
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {

  params["stateCode"] = params["stateCode"].split(/[, ]+/).join(",");
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(responseJson);

  // if there are previous results, remove them
  $('#results-list').empty();

  // iterate through the items array
  for (let i = 0; i < responseJson.data.length; i++){

    // for each park object in the items 
    // array, add a list item to the results 
    // list with the park fullName, description,
    // and url
    $('#results-list').append(
      `<div class="js-park-detail" id="${responseJson.data[i].parkCode}">
        <h3>${responseJson.data[i].fullName}</h3>
        <h4>located in ${responseJson.data[i].states}</h4>
        <div class="js-park-header">
          <p class="js-park-description">${responseJson.data[i].description}</p>
        </div>
        <div class="js-park-detail park-detail">
          <div class="js-park-url park-url">
            <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].name} website</a>
          </div>
        </div>
        <hr />
      </div>`
    )};

  // display the results section  
  $('#results').removeClass('hidden');
};

// stateCode=CA&api_key=hPyt0zBDuXbG3xo6AWfhAfOtfLv5eP2PeXymD8Yf&limit=10&fields=addresses,contacts
function getParkDetail(query, maxResults=10) {
  const params = {
    stateCode: query,    
    api_key: apiKey,
    limit: maxResults,
    fields: 'address,contacts'
  };

  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))  //JSON.stringify()
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getParkDetail(searchTerm, maxResults);
  });
}

$(watchForm);