const form = document.getElementById("form_new_debate");
const btnSubmit = document.getElementById("submit_new_debate");
const msgError = document.getElementById("msg_error");
const msgStatus = document.getElementById("msg_status");

function init() {
  addListeners();
}

function addListeners() {
  btnSubmit.addEventListener("click", submitForm);
}

function submitForm(e) {
  e.preventDefault();

  console.log("submitForm");
}

function reportError(msg) {
  msgError.innerHTML = msg;
  msgError.classList.remove("hide");
}

function reportStatus(msg) {
  msgStatus.innerHTML = msg;
  msgStatus.classList.remove("hide");
}

init();
