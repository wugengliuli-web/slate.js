import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.jsx'
import { StoreContext } from 'redux-react-hook';
import store from './store/index'
ReactDOM.render(
    <StoreContext.Provider value={store}>
        <App />
	</StoreContext.Provider>
,document.querySelector('#root'))