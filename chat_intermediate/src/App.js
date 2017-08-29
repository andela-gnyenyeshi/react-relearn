import React, { Component } from 'react';
import { createStore } from 'redux';
import uuid from 'uuid';

// function createStore(reducer, initialState) {
//   let state = initialState;
//   const listeners = [];

//   const subscribe = (listener) => (
//     listeners.push(listener)
//   );

//   const getState = () => (state);

//   const dispatch = (action) => {
//     state = reducer(state, action);
//     listeners.forEach(l => l());
//   };

//   return {
//     subscribe,
//     getState,
//     dispatch,
//   };
// }

function reducer(state, action) {
  return {
    activeThreadId: activeThreadIdReducer(state.activeThreadId, action),
    threads: threadsReducer(state.threads, action)
  }
}

function activeThreadIdReducer(state, action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
}

function threadsReducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {

    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4()
    };

    const threadIndex = state.threads.findIndex(
      (thread) => thread.id === action.threadId
    )

    const oldThread = state.threads[threadIndex];
    const newThread = {
      ...oldThread,
      messages: oldThread.messages.concat(newMessage)
    };
    return {
      ...state,
      threads: [
        ...state.threads.slice(0, threadIndex),
        newThread,
        ...state.threads.slice(threadIndex + 1, state.threads.length)
      ]
    };
  } else if (action.type === 'DELETE_MESSAGE') {
    const threadIndex = state.threads.findIndex(
      (thread) => thread.messages.find(
        (message) => (message.id ===action.id))
      )

    const oldThread = state.threads[threadIndex];
      
    const newThread = {
      ...oldThread,
      messages: oldThread.messages.filter((m) => (
        m.id !== action.id
      )),
    };
    return {
      ...state,
      threads: [
        ...state.threads.slice(0, threadIndex),
        newThread,
        ...state.threads.slice(
          threadIndex + 1, state.threads.length
        ),
      ],
    };
  } else if (action.type === 'OPEN_THREAD') {
    return {
      ...state,
      activeThreadId: action.id
    }
  } else {
    return state;
  }
}

const initialState = {
  activeThreadId: '1-fca2',
  threads: [
    {
      id: '1-fca2',
      title: 'Buzz Aldrin',
      messages: [
        {
          text: 'Twelve minutes to ignition.',
          timestamp: Date.now(),
          id: uuid.v4()
        },
        {
          text: 'Thirteen minutes more',
          timestamp: Date.now(),
          id: uuid.v4()
        }
      ]
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: [
        {
          text: 'Here we go',
          timestamp: Date.now(),
          id: uuid.v4()
        }
      ]
    }
  ]
};

const store = createStore(reducer, initialState);

class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }

  render() {
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const threads = state.threads;
    const tabs = threads.map((thread) => (
      {
        title: thread.title,
        active: thread.id === activeThreadId,
        id: thread.id
      }
    ));

    console.log(tabs, 'TABSSSS!')
    const activeThread = threads.find((thread) => thread.id === activeThreadId);

    return (
      <div className='ui segment'>
        <ThreadTabs tabs={tabs} />
        <Thread thread={activeThread} />
      </div>
    );
  }
}

class MessageInput extends React.Component {
  state = {
    value: '',
  };

  onChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  };

  handleSubmit = () => {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.state.value,
      threadId: this.props.threadId
    });
    this.setState({
      value: '',
    });
  };

  render() {
    return (
      <div className='ui input'>
        <input
          onChange={this.onChange}
          value={this.state.value}
          type='text'
        />
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
       </div>
    );
  }
}

class ThreadTabs extends Component {
  handleClick = (id) => {
    store.dispatch({
      type: 'OPEN_THREAD',
      id: id
    })
  }
  render() {
    const tabs = this.props.tabs.map((tab, index) => (
      <div key={index} className={tab.active ? 'active item' : 'item'} onClick={() => this.handleClick(tab.id)}>
        {tab.title}
      </div>
    ))
    return(
      <div className='ui top attached tabular menu'>
        {tabs}
      </div>
    );
  }
}

class Thread extends React.Component {
  handleClick = (id) => {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id,
    });
  };

  render() {
    const messages = this.props.thread.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(message.id)}
      >
        <div className='text'>
          {message.text}
          <span className='metadata'>@{message.timestamp}</span>
        </div>
      </div>
    ));
    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput threadId={this.props.thread.id}/>
      </div>
    );
  }
}

export default App;
