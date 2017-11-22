import React, { Component } from 'react';
import axios from 'axios';
import $ from 'jquery';

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser() {
    axios.get('http://localhost:8080/profile', { withCredentials: true })
      .then(({ data }) => {
        this.setState({ user: data });
        this.props.setUserData(data.role, data._id);
      })
      .catch(err => this.setState({ user: null }));
  }

  login(event) {
    event.preventDefault();

    const email = this.refs.loginEmail.value;
    const password = this.refs.loginPassword.value;

    axios.post('http://localhost:8080/login', { email, password }, { withCredentials: true })
      .then(({data}) => {
        if (!data.error) {
          this.setState({ user: data });
          this.props.setUserData(data.role, data._id);
        } else {
          console.log(data.error);
        }
      });
  }

  register() {
    const user = {};
    user.email = this.refs.email.value;
    user.password = this.refs.password.value;
    user.name = this.refs.name.value;
    user.lastname = this.refs.lastname.value;
    user.role = this.refs.role.value;

    axios.post('http://localhost:8080/register', user, { withCredentials: true});

    this.closeSignInForm();
  }

  logout() {
    axios.post('http://localhost:8080/logout', {}, { withCredentials: true })
      .then(() => { this.props.setUserData(null, null); this.setState({ user: null }); });
  }

  showSignInForm() {
    $('#signInForm').show(500);
  }

  closeSignInForm() {
    $('#signInForm').hide(500);
  }

  loginForm() {
    return (
      <div>
        <form className="form-inline">
         <div className="input-group">
           <span className="input-group-addon" id="basic-addon1">@</span>
           <input type="text" name="email" className="form-control" placeholder="E-Mail" ref="loginEmail" aria-label="E-Mail" aria-describedby="basic-addon1" />
         </div>
         <div className="input-group">
           <span className="input-group-addon" id="basic-addon1">@</span>
           <input type="password" name="password" className="form-control" placeholder="Password" ref="loginPassword" aria-label="Password" aria-describedby="basic-addon1" />
         </div>
         <a href="#"><button className="btn my-2 my-sm-0" type="submit" onClick={this.login.bind(this)} >Log in</button></a>
         <span className="login_panel_text">or</span>
         <a href="#!" className="sign_btn" onClick={this.showSignInForm}>Sign in</a>
       </form>
        { this.signInForm() }
      </div>
    );
  }

  signInForm() {
    return (
      <div className="modal" tabIndex="-1" role="dialog" id="signInForm">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Registration</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeSignInForm}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="InputEmail1">Email address</label>
                  <input type="email" ref="email" className="form-control" id="InputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label htmlFor="InputPassword1">Password</label>
                  <input type="password" ref="password" className="form-control" id="InputPassword1" placeholder="Password" />
                </div>
                <div className="form-group">
                  <label htmlFor="InputName">Name</label>
                  <input type="text" ref="name" className="form-control" id="InputName" placeholder="Enter your name" />
                </div>
                <div className="form-group">
                  <label htmlFor="InputLastname">Lastname</label>
                  <input type="text" ref="lastname" className="form-control" id="InputLastname" placeholder="Enter your lastname" />
                </div>
                <div className="form-group">
                  <label htmlFor="selectRole">Example select</label>
                  <select ref="role" className="form-control" id="selectRole">
                    <option value="manager">Manager</option>
                    <option value="developer">Developer</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={this.register.bind(this)}>Confirm</button>
              <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.closeSignInForm}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  logged(email, role) {
    return (
      <span>
        { email } ({ role }) <a className="sign_btn" href="#" onClick={ this.logout.bind(this) }>Logout</a>
      </span>
    );
  }

  render() {
    const user = this.state.user;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#!">Task Tracker</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto"></ul>
            { user ? this.logged(user.email, user.role) : this.loginForm() }
          </div>
        </div>
      </nav>
    );
  }
}

export default NavBar;
