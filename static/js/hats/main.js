var originCommentUsername = document.getElementById("comment-new-username");
var originCommentText = document.getElementById("comment-new-text");
var originCommentOpt = document.getElementById("comment-new-hat-opt");
var originCommentSubmit = document.getElementById("comment-new-submit");
var commentsList = document.getElementsByClassName("comments_list")[0];

var formRequestAccess = document.getElementById("request_access");
var btnRequestAccess = document.getElementById("btn_request_access");

function init() {
  originCommentSubmit.addEventListener("click", newCommentOrigin);
  btnRequestAccess.addEventListener("click", requestAccess);
}

function newCommentOrigin(e) {
  e.preventDefault();

  var newComment = document.createElement("div");
  var newCommentUsername = originCommentUsername.value;
  var newCommentText = originCommentText.value;
  var newCommentOption = originCommentOpt.value.toLowerCase();

  if (newCommentText && newCommentText !== "") {
    newComment.class = newCommentOption;
    newComment.innerHTML = `<li class="${newCommentOption}"><fieldset><legend>${newCommentUsername}</legend><p>${newCommentText}</p></fieldset>`;
    commentsList.appendChild(newComment);
  }
}

function newCommentReply() {}

function requestAccess(e) {
  e.preventDefault();

  var username = document.getElementById("request_access_username").value;
  var debate_id = document.getElementById("request_access_debate_id").value;

  console.log(`Request access for [${username}] to [${debate_id}]`);
}

init();
