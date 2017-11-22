import React from 'react';

const Project = (props) => {
  const setActive = () => {
    props.setActive(props.id);
  };

  return (
    <a href="#!" className={`list-group-item list-group-item-action flex-column align-items-start ${props.active === props.id ? 'active' : 'fdshfhskd'}`} onClick={setActive}>
      <div className="d-flex w-100 justify-content-between">
        <h5 className="mb-1">{ props.title }</h5>
      </div>
      <p className="mb-1">{ props.desciption }</p>
      <small>Created: { props.created_at }</small>
    </a>
  );
}

export default Project;
