import React from 'react';

const Comment = (props) => {
  return (
    <div className="alert alert-primary comment" role="alert">
      { props.isControl ? ( <div className="comment-controls">
        <a href="#!" className="alert-warning" onClick={props.setEdditing}>Edit</a>
        <a href="#!" className="alert-danger" onClick={props.delete}>Remove</a>
      </div> ) : null }
      <p><b>{ props.author }</b></p>
      <p>{ props.message }</p>
      <p>{ props.date }</p>
    </div>
  );
};

export default Comment;
