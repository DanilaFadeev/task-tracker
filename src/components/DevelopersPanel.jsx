import React, { Component } from 'react';
import axios from 'axios';

import config from '../config.js';
import Developer from './developer';

class DevelopersPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { developers: [], filtered: []  };
  }

  componentDidMount() {
    this.getDevelopers();
  }

  getDevelopers() {
    axios.get(config.serverURL + '/users/developers', { withCredentials: true })
      .then(({data}) => this.setState({ developers: data, filtered: data }))
      .catch(err => console.log(err));
  }

  search() {
    const developers = this.state.developers;
    const result = developers.filter(dev => {
      return (dev.name.toLowerCase().indexOf(this.refs.search.value.toLowerCase()) !== -1)
          || (dev.lastname.toLowerCase().indexOf(this.refs.search.value.toLowerCase()) !== -1);
    });
    this.setState({ filtered: result });
  }

  addToProject(developer_id) {
    axios.post(`${config.serverURL}/projects/${this.props.activeProjectId}/developers`, {developer_id}, {withCredentials: true})
      .then(() => this.props.loadProjects())
      .catch(err => console.log(err));
  }

  removeFromProject(developer_id) {
    axios.delete(`${config.serverURL}/projects/${this.props.activeProjectId}/developers/${developer_id}`, { withCredentials: true })
      .then(() => this.props.loadProjects())
      .catch(err => console.log(err));
  }

  appointTask(developer_id) {
    axios.post(`${config.serverURL}/task/${this.props.activeTask}/developer/${developer_id}`, {}, { withCredentials: true })
      .then(() => this.props.setActiveTask(null))
      .catch(err => console.log(err));
  }

  removeTask(developer_id) {
    axios.delete(`${config.serverURL}/task/${this.props.activeTask}/developer/${developer_id}`, { withCredentials: true })
      .then(() => this.props.setActiveTask(null))
      .catch(err => console.log(err));
  }

  render() {
    const developers = this.state.filtered.map((dev) => {
      const inProject = this.props.developers ? this.props.developers.includes(dev._id) : false;
      const inTask = this.props.developersForTask ? this.props.developersForTask.includes(dev._id) : false;

      return (
        <Developer
          key={dev._id}
          name={dev.name}
          lastname={dev.lastname}

          inProject={inProject}
          addToProject={this.addToProject.bind(this, dev._id)}
          removeFromProject={this.removeFromProject.bind(this, dev._id)}

          inTask={inTask}
          activeTask={this.props.activeTask}
          appointTask={this.appointTask.bind(this, dev._id)}
          removeTask={this.removeTask.bind(this, dev._id)}
        />
      );
    });
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="searchInput">Search</label>
            <input type="text" className="form-control" id="searchInput" ref="search" onChange={this.search.bind(this)} placeholder="Name or lastname.." />
          </div>
        </form>
        <div className="list-group">
          { developers }
        </div>
      </div>
    );
  }
}

export default DevelopersPanel;
