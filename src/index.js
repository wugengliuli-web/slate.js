import React from 'react'
import { render } from 'react-dom'
import App from './app.jsx'
import { StoreContext } from 'redux-react-hook';
import store from './store/index'
import { css } from 'emotion'
/**
 * Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36
 */
const isChrome = window.navigator.userAgent.match(/.+Chrome\/([0-9]{2})./)

if(!isChrome || Number(isChrome[1]) < 79) {
    render(
        <div className={css`
            margin-top: 300px;
            margin-left: 600px;
        `}>仅支持最新版<a href="https://www.google.cn/intl/zh-CN/chrome/">Chrome</a>，请更换浏览器</div>
    , document.querySelector('#root'))
} else {
    render(
        <StoreContext.Provider value={store}>
            <App />
        </StoreContext.Provider>
        , document.querySelector('#root')
    )
}