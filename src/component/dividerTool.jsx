import React, { memo } from 'react'
import { css } from 'emotion'
import { Icon, Dropdown, Menu } from 'antd'
import { setBlockStyle } from './toolBar'
import { useDispatch } from 'redux-react-hook';
import {
    copyElAction,
    delAction
} from '../store/action'
import { createEditorFactory } from '../lib/createEditor'
const DividerTool = ({ pageIndex, index, editor }) => {
    const dividerStyle=[
        { 'borderTop': '1px solid #000' },
        { 'borderTop': '2px solid #000' },
        { 'borderTop': '5px solid #000' },
        { 'borderTop': '2px dotted #000' },
        { 'borderTop': '2px dashed #000' }
    ]
    const dispatch = useDispatch()
    const tool = [{
        title: '复制',
        icon: 'file-add',
        click: e => {
            let newEditor = createEditorFactory()
            const action = copyElAction(pageIndex, index, newEditor)
            dispatch(action)
        }
    }, {
        title: '删除',
        icon: 'delete',
        click: e => {
            const action = delAction(pageIndex, index)
            setTimeout(function () {
                dispatch(action)
            }, 100)
        }
    },{
        title: '修改样式',
        icon: 'plus',
        click: e => {
            setBlockStyle(editor, dividerStyle[e.key])
        }
    }]
    const menu = item => (
        <Menu onClick={item.click}>
            {dividerStyle.map((value,index) =>
                <Menu.Item key={index}>
                    <div style={{ width: '50px' }} 
                        className={css`${value}`} ></div>
                </Menu.Item>
            )}
        </Menu>
    );
    return (
        <div className={css`
            position: absolute;
            margin: 0 auto;
            color: rgb(229, 229, 229);
        `}>
            <div className="tool">
                {
                    tool.map((item, index) => (
                        item.title == '修改样式'?
                            <Dropdown overlay={() => menu(item)} placement="bottomLeft"
                                onClick={item.click} key={String(index)} title={item.title}
                                className={css`
                                margin: 1px 2px;
                                cursor: pointer;
                                font-size: 16px;
                                display: inline-block;
                                padding: 2px 4px;
                                background: #414247;
                                transition: background-color .2s, color .2s;
                                &:hover {
                                    background: #58595d;
                                }
                            `}>
                                <Icon type={item.icon} />
                            </Dropdown>
                            :
                            <span className={css`
                                margin: 1px 2px;
                                cursor: pointer;
                                font-size: 16px;
                                display: inline-block;
                                padding: 2px 4px;
                                background: #414247;
                                transition: background-color .2s, color .2s;
                                &:hover {
                                    background: #58595d;
                                }
                            `} onClick={item.click} key={index} title={item.title}>
                                <Icon type={item.icon} />
                            </span>
                    ))
                }
            </div>
        </div>
    )
}

export default memo(DividerTool, (prve, next) => {
    if (prve.editor !== next.editor || prve.index !== next.index) return false
    else return true
})