import React from 'react'
import { css } from 'emotion'
import {
    useEditor,
    useReadOnly,
    ReactEditor,
    useFocused
} from 'slate-react'
import { Transforms } from 'slate'
import { Checkbox, Upload, Icon, message } from 'antd'
import { addImgBlock, reImgSize, startReImgSize, endReImgSize } from './customEditor'
export const BlockQuote = ({ attributes, children, element }) => {
    return (
        <blockquote {...attributes}
            className={css`
            border-left: 2px solid #ddd;
            margin-left: 10px;
            margin-right: 0;
            padding-left: 10px;
            color: #aaa;
            font-style: italic;
            margin: 0;
        `}
        >{children}</blockquote>
    )
}

export const BulletedList = ({ attributes, children, element }) => {
    return (
        <ul {...attributes}>{children}</ul>
    )
}

export const HeadingOne = ({ attributes, children, element }) => {
    const { style } = element
    return (
        <h1 {...attributes} className={css`
            ${style}
        `}>{children}</h1>
    )
}


export const HeadingTwo = ({ attributes, children, element }) => {
    const { style } = element
    return (
        <h2 {...attributes} className={css`
            ${style}
        `}>{children}</h2>
    )
}

export const ListLtem = ({ attributes, children, element }) => {
    const { style } = element
    return (
        <li {...attributes} className={css`
            ${style}
        `}>{children}</li>
    )
}

export const NumberedList = ({ attributes, children, element }) => {
    return <ol {...attributes}>{children}</ol>
}

export const Img = ({ attributes, children, element, editor }) => {
    const focused = useFocused()
    const { style, directionInfo } = element
    const { textAlign, width } = style
    return (
        <div
        className={css`
            z-index: 999;
        `} 
        onMouseUp={e => endReImgSize(editor)} 
        onMouseMove={e => reImgSize(e, editor, style, directionInfo)}
        {...attributes} 
        contentEditable={false}
        >
            <div 
                className={css`
                    z-index: 999;
                    padding: 5px;
                    text-align: ${textAlign};
                `}
                contentEditable={false}
            >
                <div 
                className={css`
                    position: relative;
                    display: inline-block;
                    max-width: 100%;
                    & > div {
                        position: absolute;
                        width: 8px;
                        height: 8px;
                        z-index: 10;
                        border-radius: 50%;
                        background: #2981f8;
                        opacity: ${focused ? '1' : '0'}
                    }
                `}>
                    <img
                        draggable={false}
                        className={css`
                            transition: width 0.15s;
                            user-select: none;
                            box-shadow: ${focused ? '0 0 0 3px #B4D5FF' : 'none'};
                            max-width: 100%;
                            width: ${width}px;
                        `}
                        alt=""
                        src={element.url}
                    />
                    <div 
                    className={css`
                        top: -5px;
                        left: -5px;
                        cursor: nw-resize;
                    `} 
                    onMouseDown={e => startReImgSize(e, editor, 'top-left')}
                    />
                    <div 
                    className={css`
                        top: -5px;
                        right: -5px;
                        cursor: ne-resize;
                    `}
                    onMouseDown={e => startReImgSize(e, editor, 'top-right')} 
                    />
                    <div 
                    className={css`
                        bottom: -3px;
                        left: -5px;
                        cursor: sw-resize;
                    `}
                    onMouseDown={e => startReImgSize(e, editor, 'bottom-left')} 
                    />
                    <div 
                    className={css`
                        bottom: -3px;
                        right: -5px;
                        cursor: se-resize;
                    `}
                    onMouseDown={e => startReImgSize(e, editor, 'bottom-right')} 
                    />
                    </div>
            </div>
            {children}
        </div>
    )
}

export const DefaultEl = ({ attributes, children, element }) => {
    const { style } = element
    return (
        <p {...attributes} className={css`
            ${style}
        `}>{children}</p>
    )
}

export const CheckListItemElement = ({ attributes, children, element }) => {
    const editor = useEditor()
    const readOnly = useReadOnly()
    const { checked } = element
    return (
        <div

            className={css`
                flex-direction: row;
                align-items: center;
                & + & {
                    margin-top: 0;
                }
            `}
        >
            <span
                contentEditable={false}
                className={css`
                    margin-right: 0.75em;
                    & span {
                        user-select:none;
                    }
                `}
            >
                <Checkbox
                    checked={checked}
                    onChange={event => {
                        const path = ReactEditor.findPath(editor, element)
                        Transforms.setNodes(
                            editor,
                            { checked: event.target.checked },
                            { at: path }
                        )
                    }}
                />
            </span>
            <span
                {...attributes}
                contentEditable={!readOnly}
                suppressContentEditableWarning
                className={css`
                    opacity: ${checked ? 0.666 : 1};
                    text-decoration: ${checked ? 'none' : 'line-through'};
                    &:focus {
                        outline: none;
                    }
                `}
            >
                {children}
            </span>
        </div>
    )
}

//上传图片的按钮
export const UploadImg = ({ setState, index, state, editor }) => {
    const { Dragger } = Upload;
    const props = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList)
            }
            if (status === 'done') {
                message.success(`上传成功`)
            } else if (status === 'error') {
                message.error(`上传失败`)
            }
        },
        customRequest(info) {
            //上传之前对图片的类型大小做判断
            let { file } = info
            let { size, type } = file
            let reg = new RegExp(/jpeg|jpg|png$/, 'i')
            if(!reg.test(type)) {
                message.error('文件类型错误')
                return
            }
            if(size > 10 * 1024 * 1024) {
                message.error('文件过大')
                return
            }
            /**
             * 一系列的上传操作,省略
             */
            let fr = new FileReader()
            fr.readAsDataURL(file)
            fr.onload = function() {
                let url = fr.result
                let img = new Image()
                img.src = url
                img.onload = function() {
                    let width = img.width
                    if(width > 696) {
                        width = 696
                    }
                    addImgBlock(setState, index, url, state, editor, width)
                }
            }
        }
    }
    return (
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">点击上传图片</p>
            <p className="ant-upload-hint">大小不超过10MB </p>
        </Dragger>
    )
}