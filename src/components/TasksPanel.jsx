import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

import config from '../config.js';

import Task from './task';
import Comments from './Comments';

class TasksPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { developer_tasks: [], filtered: null };
  }

  componentDidMount() {
    axios.get(config.serverURL + '/developer/tasks', { withCredentials: true})
      .then(({data}) => this.setState({ developer_tasks: data }))
      .catch(err => console.log(err));
  }

  showAddForm() {
    $('#addTaskModal').show();
  }

  closeAddForm() {
    $('#addTaskModal').hide(500);
  }

  add() {
    const title = this.refs.taskTitle.value;
    const details = this.refs.taskDetails.value;

    this.refs.taskTitle.value = '';
    this.refs.taskDetails.value = '';

    axios.post(config.serverURL + '/tasks/' + this.props.activeProjectId, { title, details }, { withCredentials: true } )
      .then(() => this.props.loadTasks())
      .catch(error => console.error(error));

      $('#addTaskModal').hide(500);
  }

  changeStatus() {
    const status = this.refs.statusSelect.value;
    axios.post(config.serverURL + '/task/' + this.props.active, { status }, { withCredentials: true })
      .then(() => this.props.loadTasks())
      .catch(error => console.error(error));
  }

  forMeFilter(event) {
    const isFilter = event.target.checked;

    if (isFilter) {
      const tasks = this.props.tasks.filter(item => this.state.developer_tasks.includes(item._id));
      this.setState({ filtered: tasks });
    } else {
      this.setState({ filtered: null });
    }
  }

  setActive(taskId) {
    this.props.setActive(taskId);
  }

  resetActive() {
    this.props.setActive(null);
  }

  showDetails() {
    const task = this.props.tasks.find(item => item._id === this.props.active);
    if(!task) return null;
    return (
      <div className="task-details">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{ task.title }</h4>
            <p className="card-text">{ task.details }</p>
            <p className="card-text">Status: { task.status }</p>
            <div className="form-group">
              <label htmlFor="changeStatus">Change status</label>
              <select className="form-control" id="changeStatus" ref="statusSelect" onChange={this.changeStatus.bind(this)}>
                <option value="waiting">waiting</option>
                <option value="implementation">implementation</option>
                <option value="verifying">verifying</option>
                <option value="releasing">releasing</option>
              </select>
            </div>
            <a href="#!" className="btn btn-primary" onClick={this.resetActive.bind(this)}>Back</a>
          </div>
        </div>
        <Comments task_id={this.props.active} userId={this.props.userId} />
      </div>
    );
  }

  render() {
    const baseTasks = this.state.filtered ? this.state.filtered : this.props.tasks;
    const tasks = baseTasks.map(item => {
      return (
        <Task
          key={item._id}
          title={item.title}
          details={item.details}
          status={item.status}
          setActive={this.setActive.bind(this, item._id)}
        />
      );
    });
    return (
      <div className="task-panel">
        <div className="task-control">
          <a href="#!" onClick={this.showAddForm}>Add task</a>
          { this.props.userRole === "developer" ? (
            <div className="form-check form-check-inline" style={{ marginLeft: 40 + 'px' }}>
              <label className="form-check-label">
                <input className="form-check-input" type="checkbox" ref="forMeFilter" onChange={this.forMeFilter.bind(this)} /> Only for me
              </label>
            </div>
          ) : null }
        </div>
        { this.props.active ? this.showDetails() : tasks }
        <div className="modal " id="addTaskModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">Add task</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeAddForm}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="taskTitle">Title</label>
                  <input type="text" ref="taskTitle" className="form-control" id="taskTitle" placeholder="Name here" />
                </div>
                <div className="form-group">
                  <label htmlFor="taskDetails">Details</label>
                  <textarea className="form-control" ref="taskDetails" id="taskDetails" rows="3"></textarea>
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

export default TasksPanel;
