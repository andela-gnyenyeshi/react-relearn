import React, { Component } from 'react';

function reducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    return {
      messages: state.messages.concat(action.message)
    }
  } else if (action.type === 'DELETE_MESSAGE') {
    return {
      messages: [
        ...state.messages.slice(0, action.index),
        ...state.messages.slice(action.index + 1, state.messages.length)
      ]
    }
  } else {
    return state;
  }
}

function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  const subscribe = (listener) => (
    listeners.push(listener)
  );

  const getState = () => (state);

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach(func => func());
  };

  return {
    getState,
    dispatch,
    subscribe
  };
}

const initialState = { messages: [] };
const store = createStore(reducer, initialState);

// const listener = () => {
//   console.log(store.getState(), 'STATE LISTENER');
// };
// store.subscribe(listener);

// // Actions
// const addMessageAction1 = {
//   type: 'ADD_MESSAGE',
//   message: 'How does it look, Neil?'
// };
// const addMessageAction2 = {
//   type: 'ADD_MESSAGE',
//   message: 'Looking good'
// };
// const deleteMessageAction = {
//   type: 'DELETE_MESSAGE',
//   index: 1
// };

// store.dispatch(addMessageAction1)
// store.dispatch(addMessageAction2);
// store.dispatch(deleteMessageAction)
class App extends Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate())
  }

  render() {
    const messages = store.getState().messages;
    return (
      <div className='ui segment'>
        <MessageView messages={messages} />
        <MessageInput />
      </div>
    );
  }
}

class MessageInput extends Component {
  state = {
    value: ''
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value
    })
  };

  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      message: this.state.value
    });
    this.setState({
      value: ''
    })
  }

  render() {
    return (
      <div>
        <input 
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button 
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >Submit</button>
      </div>
    );
  }
}

class MessageView extends Component {
  handleClick = (index) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      index: index
    });
  }

  messageList = () => {
    const messages = this.props.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(index)}
      >
        {message}
      </div>
    ))
    return messages;
  }

  render() {
    return (
      <div className='ui comments'>
        {this.messageList()}
      </div>
    );
  }
}

export default App;