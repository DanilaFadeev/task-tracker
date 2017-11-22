import React from 'react';

const Task = (props) => {
  let taskStyle;
  switch (props.status) {
    case "waiting":
      taskStyle = "bg-light";
      break;
    case "implementation":
      taskStyle = "bg-info";
      break;
    case "verifying":
      taskStyle = "bg-warning";
      break;
    default:
      taskStyle = "bg-success";
  }
  return (
    <div className={`card ` + taskStyle}>
      <div className="card-body">
        <h4 className="card-title">{ props.title }</h4>
        <p className="card-text">{ props.details.slice(0, 40) + (props.details.length > 40 ? '...' : '') }</p>
        <p className="card-text">Status: { props.status }</p>
        <a href="#!" className="btn btn-primary" onClick={props.setActive}>See details</a>
      </div>
    </div>
  );
};

export default Task;
