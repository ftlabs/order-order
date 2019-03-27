const originCommentUsername = document.getElementById("comment-new-username");
const originCommentText = document.getElementById("comment-new-text");
const originCommentOpt = document.getElementById("comment-new-hat-opt");
const originCommentSubmit = document.getElementById("comment-new-submit");
const commentsList = document.getElementsByClassName("comments_list")[0];

function init() {
  addListeners();
}

function addListeners() {
  originCommentSubmit.addEventListener("click", newCommentOrigin);
}

function newCommentOrigin(e) {
  e.preventDefault();

  const newComment = document.createElement("div");
  const newCommentUsername = originCommentUsername.value;
  const newCommentText = originCommentText.value;
  const newCommentOption = originCommentOpt.value.toLowerCase();

  if (newCommentText && newCommentText !== "") {
    newComment.class = newCommentOption;
    newComment.innerHTML = `<li class="${newCommentOption}"><fieldset><legend>${newCommentUsername}</legend><p>${newCommentText}</p></fieldset>`;
    commentsList.appendChild(newComment);
  }
}

function newCommentReply() {}

init();
