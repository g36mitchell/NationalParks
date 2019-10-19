'use strict';

// put your own value below!
const apiKey = 'hPyt0zBDuXbG3xo6AWfhAfOtfLv5eP2PeXymD8Yf';  
const searchURL = 'https://developer.nps.gov/api/v1/parks';
const validStateCodes = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL',  
                         'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'PA',
                         'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'RI', 
                         'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR',   
                         'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];

function validStates(s) {
    let valid = true;
 
    for (let i = 0; i < s.length; i++) {

      if (s[i] != "") {
           if (!validStateCodes.includes(s[i])) {
               return false;
           }
      }
    }
    return valid;
}

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
          .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
            
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
        <h3>${i+1}. ${responseJson.data[i].fullName}</h3>
        <h4>located in ${responseJson.data[i].states}</h4>
        <div class="js-park-header">
          <p class="js-park-description">${responseJson.data[i].description}</p>
        </div>
        <div class="js-park-detail park-detail">
          <div class="js-park-url park-url">
            <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].name} website</a>
          </div>
          <div class="js-park-physical-address park-address">
            <h4>Address</h4>
            <p>${responseJson.data[i].addresses[0].line1}</p>
            <p>${responseJson.data[i].addresses[0].line2}</p>
            <p>${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}</p>
            <p>${responseJson.data[i].contacts.emailAddresses[0].emailAddress}</p>
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
    stateCode: query.split(/[, ]+/).join(','),    // fix data entry for API call
    api_key: apiKey,
    limit: maxResults,
    fields: 'addresses,contacts'
   };

  if (validStates(params["stateCode"].split(/[, ]/))) {  // check if customers data entry is valid
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
         $('#results-list').empty();
         $('#results').addClass('hidden');
         $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
  }
  else {
       $('#results-list').empty();
       $('#results').addClass('hidden');
       $('#js-error-message').text('Search using valid postal state codes.  For example AK for Alaska.');
  };   

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