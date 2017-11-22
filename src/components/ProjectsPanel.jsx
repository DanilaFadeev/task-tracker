import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';
import config from '../config.js';

import Project from './project';

class ProjectsPanel extends Component {
  showAddForm() {
    $('#exampleModalLong').show();
  }

  closeAddForm() {
    $('#exampleModalLong').hide(500);
  }

  add() {
    const name = this.refs.projectName.value;
    const description = this.refs.projectDescription.value;

    this.refs.projectName.value = '';
    this.refs.projectDescription.value = '';


    axios.post(config.serverURL + '/projects/', { name, description }, { withCredentials: true } )
      .then(() => this.props.loadProjects())
      .catch(error => console.error(error));

      $('#exampleModalLong').hide(500);
  }

  remove() {
    axios.delete(config.serverURL + '/projects/' + this.props.active, { withCredentials: true } )
      .then(() => this.props.loadProjects())
      .catch(error => console.error(error));
  }

  render() {
    const projects = this.props.projects.map((item, index) =>  {
      return (
        <Project
          key={item._id}
          id={item._id}
          title={item.name}
          desciption={item.description}
          created_at={item.created_at}
          setActive={this.props.setActive}
          active={this.props.active}
        />
      );
    });

    return (
      <div className="list-group">
        <a href="#!" className="list-group-item list-group-item-action list-group-item-light">
          <h4>Projects</h4>
          { this.props.userRole === "manager" ? (
              <div>
                <button type="button" className="btn btn-danger btn-manage" onClick={this.remove.bind(this)}>×</button>
                <button type="button" className="btn btn-primary btn-manage" onClick={this.showAddForm}>+</button>
              </div>
            ) : null }
        </a>
        { projects }
        <div className="modal " id="exampleModalLong" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Add project</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeAddForm}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="projectName">Name of project</label>
                  <input type="text" ref="projectName" className="form-control" id="projectName" placeholder="Name here" />
                </div>
                <div className="form-group">
                  <label htmlFor="projectDescription">Description</label>
                  <textarea className="form-control" ref="projectDescription" id="projectDescription" rows="3"></textarea>
                </div>
              </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={this.add.bind(this)}>Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectsPanel;
