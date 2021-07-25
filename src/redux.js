import React, { useContext, useEffect, useState } from 'react';

export const appContext = React.createContext(null);

export const store = {
  state: {
    user: { name: 'frank', age: 18 },
    group: { name: '前端组' }
  },
  subscribe(fn) {
    store.listeners.push(fn);
    return (fn) => {
      const index = store.listeners.indexOf(fn);
      store.listeners.slice(index, 1);
    }
  },
  listeners: [],
  setState(newState) {
    store.state = newState;
    store.listeners.map(fn => fn(store.state));
  },

}

const changed = (oldDate, newData) => {
  let changed = false;
  for (let key in oldDate) {
    if (oldDate[key] !== newData[key]) {
      changed = true
    }
  }

  return changed;
}
/**
 * 连接组件和全局状态
 */
export const connect = (selector) => (Component) => {
  return (props) => {
    const { state, setState } = useContext(appContext);
    const [, update] = useState({});
    const data = selector ? selector(state) : { state };

    useEffect(() => {
      store.subscribe(() => {
        const newData = selector ? selector(store.state) : { state: store.state };
        if (changed(data, newData)) {
          update({});
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector]);

    const dispatch = (action) => {
      setState(reducer(state, action));
    }

    return <Component {...props} {...data} dispatch={dispatch} />
  }
}

/**
 * reducer是用来规范 state 创建流程
 */
export const reducer = (state, { type, payload }) => {
  if (type === 'updateUser') {
    return {
      ...state,
      user: {
        ...state.user,
        ...payload
      }
    }
  } else {
    return state;
  }
}

