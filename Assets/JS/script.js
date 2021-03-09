var userFormEl = document.querySelector('#user-form');
var nameInputEl = document.querySelector('#username');
var currentTempEl = document.querySelector('#current-temp');
var tempMinEl = document.querySelector('#temp-min');
var tempMaxEl = document.querySelector('#temp-max');
var currentPressEl = document.querySelector('#current-press');
var currentHumidEl = document.querySelector('#current-humid');
var currentCondEl = document.querySelector('#current-cond');
var descriptionEl = document.querySelector('#description')
var repoSearchTerm = document.querySelector('#repo-search-term');

var formSubmitHandler = function (event) {
  event.preventDefault();

  var username = nameInputEl.value.trim();

  if (username) {
    getUserRepos(username);

    repoContainerEl.textContent = '';
    nameInputEl.value = '';
  } else {
    alert('Please enter a valid city');
  }
};

var getUserRepos = function (user) {
  var apiUrl = 'api.openweathermap.org/data/2.5/weather?q=' + user + '&appid=301299b6ddb2048134ff89fe095920e8';

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayRepos(data, user);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to Open Weather API');
    });
};

var displayRepos = function (repos, searchTerm) {
  if (repos.length === 0) {
    repoContainerEl.textContent = 'No data found.';
    return;
  }

  repoSearchTerm.textContent = searchTerm;

  for (var i = 0; i < repos.length; i++) {
    var repoName = repos[i].owner.login + '/' + repos[i].name;

    var repoEl = document.createElement('a');
    repoEl.classList = 'list-item flex-row justify-space-between align-center';
    repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    repoEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    repoEl.appendChild(statusEl);

    repoContainerEl.appendChild(repoEl);
  }
};

userFormEl.addEventListener('submit', formSubmitHandler);