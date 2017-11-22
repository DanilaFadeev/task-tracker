import React from 'react';

const Developer = (props) => {
  const addTaskControl = () => {
    return (
      props.inTask ? <a className="alert-danger" href="#!" onClick={props.removeTask}>Remove from this task</a> :
         <a href="#!" onClick={props.appointTask}>Appoint this task</a>
    );
  };
  return (
    <a href="#!" className="list-group-item list-group-item-action flex-column align-items-start">
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">{ props.lastname } { props.name }</h5>
      </div>
      <p>
        <small>
         {
           props.inProject ? <a className="alert-danger" href="#!" onClick={props.removeFromProject}>Remove from current porject</a> :
              <a href="#!" onClick={props.addToProject}>Add to current porject</a>
          }
        </small>
      </p>
      <p>
        <small>
         { props.inProject && props.activeTask ? addTaskControl() : null }
        </small>
      </p>
    </a>
  );
}

export default Developer;
