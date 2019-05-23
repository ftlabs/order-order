import comments from '../helpers/comments';

function display(req, res, data) {
  const params = {
    commentsData: data.comments,
  };
  const newData = data;
  newData.commentsStructured = comments.getNestedComments(params).data;
  res.render(data.type, newData);
}

export default { display };
