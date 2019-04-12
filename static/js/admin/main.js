var formNewDebate = document.getElementById("form_new_debate");
var msgError = document.getElementById("msg_error");
var msgStatus = document.getElementById("msg_status");

function init() {
  if (formNewDebate) {
    formNewDebate.addEventListener("submit", submitForm);
  }
}

function submitForm(e) {
  e.preventDefault();

  var errors = [];
  var type = document.getElementsByName("type")[0];
  var name = document.getElementsByName("name")[0];
  var title = document.getElementsByName("title")[0];
  var description = document.getElementsByName("debateDescription")[0];
  var series_order = document.getElementsByName("series_order")[0];
  var state_open = document.getElementsByName("state_open")[0];
  var state_votable = document.getElementsByName("state_votable")[0];

  //TODO: add additional validation

  var data = {
    type: type.value,
    name: name.value,
    title: title.value,
    description: description.value,
    series_order: series_order.value,
    state_open: state_open.value,
    state_votable: state_votable.value
  };

  for (var k in data) {
    if (data.hasOwnProperty(k)) {
      if (data[k] === undefined || data[k] === "") {
        errors.push(`${k}`);
      }
    }
  }

  if (errors.length > 0) {
    reportError(
      `Fill in all fields please.<br />${errors.join(", ")} are missing`
    );
  } else {
    try {
      var promise = new Promise(function(resolve, reject) {
        resolve(submitData("/api/create_new_debate", data));
      });
      promise.then(function(response) {
        if (response.status === "error") {
          reportError(`Issue with fetch: ${response.data}`);
        } else if (response.status === "ok") {
          reportStatus("New debate added");
          clearForm();
        }
      });
    } catch (error) {
      reportError(`Issue with form submission: ${error}`);
    }
  }
}

function submitData(url, data) {
  return fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(function(response) {
      if (response.status >= 200 && response.status < 300) {
        return {
          status: "ok",
          data: data
        };
      } else {
        var error = new Error(response.statusText || response.status);
        error.response = response;
        return {
          status: "error",
          data: error
        };
      }
    })
    .catch(function(error) {
      return {
        status: "error",
        data: error
      };
    });
}

function reportError(msg) {
  msgError.innerHTML = msg;
  msgError.classList.remove("hide");
  msgStatus.classList.add("hide");
}

function reportStatus(msg) {
  msgStatus.innerHTML = msg;
  msgStatus.classList.remove("hide");
  msgError.classList.add("hide");
}

function clearForm() {
  formNewDebate.reset();
}

init();
