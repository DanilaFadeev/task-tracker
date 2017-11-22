import React, { Component } from 'react';
import axios from 'axios';
import config from '../config.js';

import NavBar from './NavBar';
import ProjectsPanel from './ProjectsPanel';
import TasksPanel from './TasksPanel';
import DevelopersPanel from './DevelopersPanel';

class App extends Component {
  constructor() {
    super();
    this.state = {
       projects: [],
       tasks: [],
       activeProject: null,
       activeTask: null,
       user_role: null,
       user_id: null
     };
  }

  componentDidMount() {
    this.loadProjects();
    this.loadTasks();
  }

  setUserData(role, id) {
    this.setState({ user_role: role, user_id: id });

    this.loadProjects();
    this.loadTasks(this.state.activeProject);
  }

  loadProjects() {
    axios.get(config.serverURL + '/projects', { withCredentials: true })
      .then( ({ data }) => this.setState({ projects: data }) )
      .catch( () => this.setState({ projects: [], activeProject: null }) );
  }

  loadTasks(projectId) {
    axios.get(config.serverURL + '/tasks/' + projectId, { withCredentials: true })
      .then( ({ data }) => this.setState({ tasks: data }) )
      .catch( () => this.setState({ tasks: [], activeTask: null }) );
  }

  setActiveProject(projectId) {
    this.setState({ activeProject: projectId, activeTask: null });
    this.loadTasks(projectId);
  }

  setActiveTask(taskId) {
    if (taskId) {
      axios.get(config.serverURL + `/task/${taskId}/developers/`, { withCredentials: true })
        .then(({data}) => {
            const id = this.state.tasks.findIndex(item => item._id === taskId);
            const tasks = this.state.tasks;
            tasks[id].developers = data;

            this.setState({ activeTask: taskId, tasks });
        })
        .catch(err => console.log(err));
    } else {
      this.setState({ activeTask: null });
    }
  }

  render() {
    const currentProject = this.state.projects.find(item => item._id === this.state.activeProject);
    const developersForProject = currentProject ? currentProject.developer_ids : [];
    const developersForTask = this.state.activeTask ? this.state.tasks.find(item => item._id === this.state.activeTask).developers : [];

    return (
      <div>
        <NavBar setUserData={this.setUserData.bind(this)} />
        <div className="container-fluid">
          <div className="row app-body">
            <div className="col-md-3">
              <ProjectsPanel
                userRole={this.state.user_role}
                loadProjects={this.loadProjects.bind(this)}
                projects={this.state.projects}
                setActive={this.setActiveProject.bind(this)}
                active={this.state.activeProject}
              />
            </div>
            <div className="col-md-6">
              <TasksPanel
                userId={this.state.user_id}
                userRole={this.state.user_role}
                tasks={this.state.tasks}
                activeProjectId={this.state.activeProject}
                loadTasks={this.loadTasks.bind(this, this.state.activeProject)}
                active={this.state.activeTask}
                setActive={this.setActiveTask.bind(this)}
              />
            </div>
            <div className="col-md-3">
              { this.state.user_role === "manager" ?
                <DevelopersPanel
                  setActiveTask={this.setActiveTask.bind(this)}
                  loadProjects={this.loadProjects.bind(this)}
                  activeProjectId={this.state.activeProject}
                  activeTask={this.state.activeTask}
                  developers={developersForProject}
                  developersForTask={developersForTask}
                /> : null }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
