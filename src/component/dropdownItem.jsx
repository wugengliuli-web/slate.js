import React, {memo}from 'react'
import { Menu, Dropdown } from 'antd';
import Editor from './editor'

const data = [{ fieId: 0, lable: "姓名", value: "张三" }, 
{ fieId: 1, lable: "专业", value: "计算机科学与技术" },
{ fieId: 2, lable: "性别", value: "女" }]
const dropdownItem = props =>{
    // 下拉提示框
    const menu = (
        <Menu onClick={(e) => {
            props.editor.insertText(data[e.key].value)
            }}
        >
            {
                data.map((value,index) => <Menu.Item key={index} >
                    {value.lable}：{value.value}
                </Menu.Item>)
            }
        </Menu>
    );
    return (
        (props.editor.children[0] && props.editor.children[0].type) === 'divider' ?
        <Editor {...props} />:
        <Dropdown
                placement = "bottomCenter"
                overlay = {menu}
                visible={props.isFocused}
            >
                <Editor {...props} />
            </Dropdown>
        )
}

export default memo(dropdownItem)