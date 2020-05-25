import React, { memo, useEffect, useState}from 'react'
import { Menu, Dropdown } from 'antd';
import Editor from './editor'
import axios from 'axios'
async function getDropdownData(info) {
    let res = await axios({
        url: 'http://47.56.80.94:8090/template/dataInfo',
        method: 'GET',
        headers: {
            'Content-Type': 'json/form-data'
        }
    })
    let { data:{data} } = res
    return data
}
const DropdownItem = props =>{
    let [data,setDate]=useState([])
    // 下拉提示框
    const menu = (
        <Menu onClick={(e) => {
            props.editor.insertText(data[e.key].value)
            }}
        >
            {
                data.map((value,index) => <Menu.Item key={index} >
                    {value.label}：{value.value}
                </Menu.Item>)
            }
        </Menu>
    );
    useEffect(()=>{
        getDropdownData().then((text) => { 
            setDate(text)
        })
        
    },[])
    return (
        (props.editor.children[0] && props.editor.children[0].type) === 'divider' ?
        <Editor {...props} />:
        <Dropdown
                placement = "bottomCenter"
                overlay = {menu}
                visible={props.isFocused}
            >
                {<Editor {...props} />}
            </Dropdown>
        )
}

export default memo(DropdownItem)