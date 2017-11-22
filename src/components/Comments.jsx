import React, { Component } from 'react';
import axios from 'axios';

import config from '../config.js';
import Comment from './comment';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = { comments: [], isEdditing: false, 'edditingId': null };
  }

  componentDidMount() {
    this.getComments();
  }

  getComments() {
    axios.get(config.serverURL + '/comments/' + this.props.task_id, { withCredentials: true })
      .then(({data}) => this.setState({ comments: data }))
      .catch((err) => console.log(err));
  }

  sendComment(event) {
    event.preventDefault();

    const message = this.refs.message.value;

    if (this.state.isEdditing) {
      axios.put(config.serverURL + '/comments/' + this.state.edditingId, { message }, { withCredentials: true })
        .then(() => {
          alert('Comment was updated!');
          this.getComments();
          this.setState({ isEdditing: false, edditingId: null });
          this.refs.message.value = '';
        })
        .catch((err) => console.log(err));
    } else {
      axios.post(config.serverURL + '/comments/' + this.props.task_id, { message }, { withCredentials: true })
        .then(() => { alert('Comment was added!'); this.getComments(); })
        .catch((err) => console.log(err));
    }
  }

  deleteComment(comment_id) {
    axios.delete(config.serverURL + '/comments/' + comment_id, { withCredentials: true })
      .then(() => { alert('Comment was deleted!'); this.getComments(); })
      .catch((err) => console.log(err));
  }

  setEdditing(comment_id, msg) {
    this.setState({ isEdditing: true, edditingId: comment_id });
    this.refs.message.value = msg;
  }

  render() {
    const comments = this.state.comments.map(item => {
      const isControl = item.author_id === this.props.userId;
      return (
        <Comment
          key={item._id}
          message={item.message}
          author={item.author}
          date={item.created_at}
          isControl={isControl}
          setEdditing={this.setEdditing.bind(this, item._id, item.message)}
          delete={this.deleteComment.bind(this, item._id)}
        />
      );
    });
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="commentField">Comment:</label>
            <textarea className="form-control" ref="message" id="commentField" rows="3"></textarea>
          </div>
          <button type="submit" className="btn btn-primary" onClick={this.sendComment.bind(this)}>Send</button>
        </form>
        { comments }
      </div>
    );
  }
}

export default Comments;
