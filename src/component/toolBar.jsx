import React from 'react'
import { css } from 'emotion'
import { Button, Menu, Dropdown, Tag } from 'antd'
import { Editor, Transforms, Text } from 'slate'
import { addImgBlock } from '../lib/customEditor'
import { fontColor, fontSize, fontLineHeight, fontBackgroundColor } from '../lib/fontStyle'
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

const setMarkStyle = (editor, changeStyle) => {
    Transforms.setNodes(
        editor, 
        { ...changeStyle },
        { match: n => Text.isText(n), split: true }
    )
}

const StyleMarkButton = ({ color, editor, changeStyle}) => {
    return (
        <div
            className={css`
                background: ${color};
                width: 30px;
                height: 30px;
                border-radius: 50%;
            `}
            color={color}
            onClick={e => setMarkStyle(editor, changeStyle)}
        ></div>
    )
}


const setBlockStyle = (editor, changeStyle) => {
    Transforms.setNodes(editor, {
        style: changeStyle
    })
}

const createMenuFontColor = editor => {
    return (
        <Menu>
            {
                fontColor.map((item, index) => (
                    <Menu.Item key={index}>
                        <StyleMarkButton
                            editor={editor}
                            color={item}
                            changeStyle={{
                                color: item
                            }}
                        />
                    </Menu.Item>
                ))        
            }
            
        </Menu>
    )
} 

const createMenuFontSize = editor => {
    return (
        <Menu>
            {
                fontSize.map((item, index) => (
                    <Menu.Item key={index}>
                        <div
                            className={css`
                                text-align: center;
                                height: 20px;
                                line-height: 20px;
                                font-size: 16px;
                            `}
                            onClick={e => setBlockStyle(editor, { fontSize: item })}
                        >{item}</div>
                    </Menu.Item>
                ))
            }
        </Menu>
    )
}


const createMenuFontLineHeight = editor => {
    return (
        <Menu>
            {
                fontLineHeight.map((item, index) => (
                    <Menu.Item key={index}>
                        <div
                            className={css`
                                text-align: center;
                                height: 20px;
                                line-height: 20px;
                                font-size: 16px;
                            `}
                            onClick={e => setBlockStyle(editor, { lineHeight: item })}
                        >{item}</div>
                    </Menu.Item>
                ))
            }
        </Menu>
    )
}


const createMenuFontBGcolor = editor => {
    return (
        <Menu>
            {
                fontBackgroundColor.map((item, index) => (
                    <Menu.Item key={index}>
                        <StyleMarkButton
                            editor={editor}
                            color={item}
                            changeStyle={{
                                bgColor: item
                            }}
                        />
                    </Menu.Item>
                ))        
            }
            
        </Menu>
    )
} 

const ToolBar = ({editor}) => {
    return (
        <div className={css`
            width: calc(100% - 300px);
            height: 50px;
            overflow: auto;
            white-space:nowrap;
            margin-bottom: 50px;
            position: fixed;
            top: 60px;
            left: 0;
            display: flex;
            justify-content: center;
            & > button {
                margin: 0 3px;
                padding: 8px;
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
            <BlockButton
                icon="check"
                text="选择列表"
                editor={editor}
                format="check-list-item"
            />
            <StyleBlockButton
                icon="menu-unfold"
                text="缩进"
                editor={editor}
                changeStyle={{
                    textIndent: '2em'
                }}
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
                icon="align-right"
                text="文字靠右"
                editor={editor}
                changeStyle={{
                    textAlign: 'right'
                }}
            />
            <StyleBlockButton 
                icon="align-left"
                text="文字靠左"
                editor={editor}
                changeStyle={{
                    textAlign: 'left'
                }}
            />
            <Dropdown
                overlayClassName={css`
                    & .ant-dropdown-menu {
                        display: flex;
                        max-width: 220px;
                        flex-wrap: wrap;
                    }
                `}
                overlay={createMenuFontColor(editor)} 
            >
                <Button icon="font-colors">文字颜色</Button>
            </Dropdown>
            <Dropdown
                overlay={createMenuFontSize(editor)} 
            >
                <Button icon="font-size">文字大小</Button>
            </Dropdown>
            <Dropdown
                overlay={createMenuFontLineHeight(editor)} 
            >
                <Button icon="line-height">文字行高</Button>
            </Dropdown>
            <Dropdown
                overlayClassName={css`
                    & .ant-dropdown-menu {
                        display: flex;
                        max-width: 220px;
                        flex-wrap: wrap;
                    }
                `}
                overlay={createMenuFontBGcolor(editor)} 
            >
                <Button icon="bg-colors">文字背景颜色</Button>
            </Dropdown>
        </div>
    )
}

export default ToolBar