import React from 'react';
import './App.css';
import { connect, appContext, store } from './redux';

const ONE = connect()(({ state }) => {
  console.log('大儿子', Math.random())
  return (
    <section>
      <h1>我是大儿子：</h1>
      {state.user.name}
    </section>
  )
})

const UserModifier = connect()(({ dispatch, state, children }) => {
  console.log('二儿子', Math.random())

  const handleChange = (e) => {
    dispatch({
      type: 'updateUser',
      payload: {
        name: e.target.value
      }
    })
  }

  return (
    <section>
      <h1>二儿子</h1>
      {children}
      <input onChange={handleChange} value={state?.user?.name} />
    </section>
  )
});

let THREE = (({ group }) => {
  console.log('幺儿子执行了', Math.random())
  return <div>
    幺儿子：Group: {group.name}
  </div>
})

THREE = connect((state) => {
  return { group: state.group }
})(THREE);

let User = (({ user }) => {
  console.log('User执行了')
  return <div>User：{user.name} </div>
});

User = connect((state) => {
  return { user: state.user }
})(User);

export const App = () => {
  return (
    <appContext.Provider value={store}>
      <ONE />
      <UserModifier>内还哦</UserModifier>
      <THREE />
      <User />
    </appContext.Provider>
  )
}
