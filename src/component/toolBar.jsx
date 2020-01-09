import React from 'react'
import { css } from 'emotion'
import 'antd/dist/antd.css'
import { Button, Menu, Dropdown } from 'antd'
import { Editor, Transforms, Text } from 'slate'
import { addImgBlock } from '../lib/customEditor'
const LIST_TYPES = ['numbered-list', 'bulleted-list']
const isMarkActive = (editor, format) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
}

const isBlockActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === format
    })
    return !!match
}

const toggleMark = (editor, format) => {
    const isActive = isMarkActive(editor, format)
    if (isActive) {
        Editor.removeMark(editor, format)
    } else {
        Editor.addMark(editor, format, true)
    }
}

const toggleBlock = (editor, format) => {
    const isActive = isBlockActive(editor, format)
    const isList = LIST_TYPES.includes(format)
  
    Transforms.unwrapNodes(editor, {
      match: n => LIST_TYPES.includes(n.type),
      split: true,
    })
    Transforms.setNodes(editor, {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
      checked: format === 'check-list-item' ? true : false,
      style: JSON.stringify({})
    })
  
    if (!isActive && isList) {
      const block = { type: format, children: [] }
      Transforms.wrapNodes(editor, block)
    }
    console.log(editor)
}

const MarkButton = ({ editor, text, format, icon }) => {
    return (
        <Button
            icon={icon}
            onClick={e => toggleMark(editor, format)}
        >{text}</Button>
    )
}

const BlockButton = ({ editor, text, format, icon }) => {
    return (
        <Button
            icon={icon}
            onClick={e => toggleBlock(editor, format)}
        >{text}</Button>
    )
}

const AddButton = ({ editor, text, icon, click }) => {
    return (
        <Button
            icon={icon}
        >
            {text}
            <input className={css`
                opacity: 0;
                width: 110px;
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
            `} type="file" onChange={e => click(e, editor)}></input>
        </Button>
    )
}

const toggleBlockStyle = (editor, changeStyle) => {
    Transforms.setNodes(editor, {
        style: changeStyle
    })
}

const StyleBlockButton = ({ editor, text, changeStyle, icon }) => {
    return (
        <Button
            icon={icon}
            onClick={e => toggleBlockStyle(editor, changeStyle)}
        >{text}</Button>
    )
}

const toggleMarkStyle = (editor, changeStyle) => {
    
    Transforms.setNodes(
        editor, 
        { ...changeStyle },
        { match: n => Text.isText(n), split: true }
    )
}

const StyleMarkButton = ({ editor, text, changeStyle, icon }) => {
    return (
        <Button
            icon={icon}
            onClick={e => toggleMarkStyle(editor, changeStyle)}
        >{text}</Button>
    )
}


const createMenu = editor => {
    return (
        <Menu>
            <Menu.Item>
                <StyleMarkButton
                    text="红色"
                    editor={editor}
                    changeStyle={{
                        color: 'red'
                    }}
                />
                <StyleMarkButton
                    text="蓝色"
                    editor={editor}
                    changeStyle={{
                        color: 'blue'
                    }}
                />
                <StyleMarkButton
                    text="黑色"
                    editor={editor}
                    changeStyle={{
                        color: 'black'
                    }}
                />
            </Menu.Item>
        </Menu>
    )
} 

const ToolBar = ({editor}) => {
    return (
        <div className={css`
            margin-bottom: 50px;
            & > button {
                margin: 5px 5px;
            }
        `}>
            <MarkButton
                icon="bold"
                text="加粗"
                editor={editor}
                format="bold"
            />
            <MarkButton
                icon="italic"
                text="斜体"
                editor={editor}
                format="italic"
            />
            <MarkButton
                icon="strikethrough"
                text="删除线"
                editor={editor}
                format="strikethrough"
            />
            <MarkButton
                icon="underline"
                text="下划线"
                editor={editor}
                format="underline"
            />
            <MarkButton
                icon="code"
                text="代码块"
                editor={editor}
                format="code"
            />
            <BlockButton
                icon="tag"
                text="标题1"
                editor={editor}
                format="heading-one"
            />
            <BlockButton
                icon="tag"
                text="标题2"
                editor={editor}
                format="heading-two"
            />
            <BlockButton
                icon="copy"
                text="块引用"
                editor={editor}
                format="block-quote"
            />
            <BlockButton
                icon="ordered-list"
                text="数字列表"
                editor={editor}
                format="numbered-list"
            />
            <BlockButton
                icon="unordered-list"
                text="符号列表"
                editor={editor}
                format="bulleted-list"
            />
            <AddButton 
                icon="file-image"
                text="添加图片"
                editor={editor}
                click={addImgBlock}
            />
            <BlockButton
                icon="check"
                text="选择列表"
                editor={editor}
                format="check-list-item"
            />
            <StyleBlockButton 
                icon="align-center"
                text="文字居中"
                editor={editor}
                changeStyle={{
                    textAlign: 'center'
                }}
            />
            <StyleBlockButton 
                icon="align-center"
                text="文字靠右"
                editor={editor}
                changeStyle={{
                    textAlign: 'right'
                }}
            />
            <StyleBlockButton 
                icon="align-center"
                text="文字靠左"
                editor={editor}
                changeStyle={{
                    textAlign: 'left'
                }}
            />
            <Dropdown overlay={createMenu(editor)} placement="bottomLeft">
                <Button icon="font-colors">文字颜色</Button>
            </Dropdown>
        </div>
    )
}

export default ToolBar