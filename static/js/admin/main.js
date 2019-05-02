/* eslint-env browser */
var formNewDebate = document.getElementById('form_new_debate');
var formEditDebate = document.getElementById('form_edit_debate');
var msgStatus = document.querySelector('.o-message--alert');
var selectDebateType = document.querySelector('.debateType');
var divDebateTypeDescription = document.querySelector('.debateTypeDescription');

function updateDescription(e) {
  var typeValue = e ? e.target.value : selectDebateType.value;
  var debateDescriptions = document.getElementsByClassName('debateDescription');

  Array.from(debateDescriptions).forEach(el => {
    el.classList.add('hide');
  });

  var descriptionToShow = document.getElementById('description-' + typeValue);

  if (descriptionToShow) {
    descriptionToShow.classList.remove('hide');
  }
}

function submitForm(e) {
  e.preventDefault();
  clearErrors();

  var url = 'create';

  if (formEditDebate && e.target.id === formEditDebate.id) {
    url = 'edit';
  }

  var errors = {};
  var debateType = document.getElementsByName('debateType')[0].value;
  var title = document.getElementsByName('title')[0].value;
  var description = document.getElementsByName('debateDescription')[0].value;
  var debateStatus = document.getElementsByName('debateStatus')[0].value;
  var votingStatus = document.getElementsByName('votingStatus')[0].value;

  if (isAlphaNumericWithCharacters(title)) {
    errors.title = 'Title must be alphanumeric or allowed chars (,_"-\')';
  }

  if (isAlphaNumericWithCharacters(description)) {
    errors.description =
      'Description must be alphanumeric or allowed chars (,_"-\')';
  }

  var data = {
    debateType,
    title,
    description,
    debateStatus,
    votingStatus,
  };

  if (formEditDebate && e.target.id === formEditDebate.id) {
    var debate_id = document.getElementsByName('id')[0].value;
    data.id = debate_id;
  }

  // Checking fields have at least some value
  for (var k in data) {
    if (data.hasOwnProperty(k)) {
      if (data[k] === undefined || data[k] === '') {
        errors[data[k]] = k + ' is required';
      }
    }
  }

  if (!isEmpty(errors)) {
    reportError(errors, 'field');
  } else {
    try {
      var promise = new Promise(function(resolve, reject) {
        resolve(submitData('/api/debate/' + url, data));
      });

      promise.then(function(response) {
        if (response.status === 'error') {
          reportError(response.msg, response.field);
        } else if (response.status === 'ok') {
          if (url === 'edit') {
            reportStatus('Debate edited');
          } else {
            reportStatus('New debate added');
            clearForm();
          }
        }
      });
    } catch (error) {
      reportError('Issue with form submission: ' + error, 'global');
    }
  }
}

function submitData(url, data) {
  //TODO: fetch compatibility??
  return fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        var error = new Error(response.statusText || response.status);
        error.response = response;
        return {
          status: 'error',
          msg: error,
        };
      }
    })
    .then(function(json) {
      if (json.status === 'error') {
        return json;
      } else {
        return {
          status: 'ok',
          data: json,
        };
      }
    })
    .catch(function(error) {
      return {
        status: 'error',
        msg: error,
      };
    });
}

function reportError(msg, type) {
  hide(msgStatus);
  if (type === 'global') {
    msgStatus.querySelector('.o-message__content-main').textContent = msg;
    show(msgStatus);
    msgStatus.classList.remove('o-message--success');
    msgStatus.classList.add('o-message--error');
  } else if (type === 'field') {
    for (var field in msg) {
      if (msg.hasOwnProperty(field)) {
        var errorDisplay = document.querySelector(
          '.o-forms__errortext[data-validation=' + field + ']',
        );
        errorDisplay.textContent = msg[field];
        errorDisplay.parentElement.classList.add('o-forms--error');
        show(errorDisplay);
      }
    }
  } else {
    var errorDisplay = document.querySelector(
      '.o-forms__errortext[data-validation=' + type + ']',
    );
    errorDisplay.textContent = msg;
    errorDisplay.parentElement.classList.add('o-forms--error');
    show(errorDisplay);
  }
}

function reportStatus(msg) {
  msgStatus.querySelector('.o-message__content-main').textContent = msg;
  show(msgStatus);
  msgStatus.classList.add('o-message--success');
  msgStatus.classList.remove('o-message--error');
}

function clearForm() {
  formNewDebate.reset();
  clearErrors();
}

function clearErrors() {
  var errorDisplays = document.querySelectorAll('.o-forms__errortext');
  Array.from(errorDisplays).forEach(function(item) {
    item.textContent = '';
    item.parentElement.classList.remove('o-forms--error');
    hide(item);
  });
}

function isAlphaNumeric(str) {
  return regexCheck(/^[a-z0-9]+$/gim, str);
}

function isAlphaNumericWithCharacters(str) {
  return regexCheck(/^[a-z0-9'",-_ ]+$/gim, str);
}

function regexCheck(regex, str) {
  var result = regex.exec(str);
  if (result === null) {
    return true;
  }
  return false;
}

function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function show(el) {
  el.classList.remove('hide');
  el.setAttribute('aria-hidden', false);
}

function hide(el) {
  el.classList.add('hide');
  el.setAttribute('aria-hidden', true);
}

function init() {
  if (formNewDebate) {
    formNewDebate.addEventListener('submit', submitForm);
  }

  if (formEditDebate) {
    formEditDebate.addEventListener('submit', submitForm);
  }

  if (selectDebateType) {
    selectDebateType.addEventListener('change', updateDescription);
  }

  updateDescription();
}

init();
