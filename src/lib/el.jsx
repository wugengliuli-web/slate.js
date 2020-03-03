import React from 'react'
import { css } from 'emotion'
import {
    useEditor,
    useReadOnly,
    ReactEditor,
    useFocused,
    useSelected
} from 'slate-react'
import { Transforms } from 'slate'
import { Checkbox, Upload, Icon, message } from 'antd'
import { addImgBlock, startReImgSize } from './customEditor'
import { Resizable } from 'react-resizable';
export const BlockQuote = ({ attributes, children, element }) => {
    const { style } = element
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
            ${style}
        `}
        >{children}</blockquote>
    )
}

export const BulletedList = ({ attributes, children, element }) => {
    const { style } = element
    return (
        <ul {...attributes} className={css`${style}`}>{children}</ul>
    )
}

export const HeadingOne = ({ attributes, children, element }) => {
    const { style } = element
    return (
        <h1 {...attributes} className={css`
            ${style}
        `}>{children}
        </h1>
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
    const selected = useSelected()
    const { style } = element
    const { textAlign='center', width } = style
    return (
        <div
        {...attributes} 
        contentEditable={false}
        >
            <div 
                className={css`
                    padding: 5px;
                    text-align: ${textAlign};
                `}
                contentEditable={false}
            >
                <div
                draggable={false} 
                className={css`
                    position: relative;
                    display: inline-block;
                    max-width: 100%;
                    & > div {
                        position: absolute;
                        width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #2981f8;
                        opacity: ${selected && focused ? '1' : '0'}
                    }
                `}>
                    <img
                        draggable={false}
                        className={css`
                            transition: width 0.05s ease-in;
                            user-select: none;
                            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
                            max-width: 100%;
                            width: ${width}px;
                            height: auto;
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
                    onMouseDown={e => startReImgSize(e, editor, style, 'top-left')}
                    />
                    <div 
                    className={css`
                        top: -5px;
                        right: -5px;
                        cursor: ne-resize;
                    `}
                    onMouseDown={e => startReImgSize(e, editor, style, 'top-right')} 
                    />
                    <div 
                    className={css`
                        bottom: -3px;
                        left: -5px;
                        cursor: sw-resize;
                    `}
                    onMouseDown={e => startReImgSize(e, editor, style, 'bottom-left')} 
                    />
                    <div 
                    className={css`
                        bottom: -3px;
                        right: -5px;
                        cursor: se-resize;
                    `}
                    onMouseDown={e => startReImgSize(e, editor, style, 'bottom-right')} 
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
            margin: 0;
        `}>{children}</p>
    )
}

export const CheckListItemElement = ({ attributes, children, element }) => {
    const { style } = element
    const editor = useEditor()
    const readOnly = useReadOnly()
    const { checked } = element
    return (
        <div
            className={css`
                flex-direction: row;
                align-items: center;
                ${style};
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
export const UploadImg = ({ dispatch, pageIndex, index, editor }) => {
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
                    addImgBlock(dispatch, pageIndex, index, url, editor, width)
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

const Resizeable = props => {
    const { onResize, width, ...restProps } = props
    if(!width) return <th {...restProps} />
    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    )
}

export const TableContainer = ({ attributes, children, element }) => {
    
    const { 
        cellPadding="7px"
    } = element
    return (
        <div 
            {...attributes}
            className={css`
                position: relative;
            `}
        >
            <table 
                cellPadding={cellPadding}
                className={css`
                    width: 100%;
                    table-layout: fixed;
                `}
            >
                <tbody>
                    {children}
                </tbody>
            </table>
        </div>
    )
}

export const TableRow = ({ editor, attributes, children, element }) => {
    return (
        <tr
            {...attributes}
        >{children}</tr>
    )
}

export const TableCell = ({ attributes, children, element, editor }) => {
    let { style, colspan = 1, rowspan= 1 } = element
    return (
        <td 
            rowSpan={rowspan}
            colSpan={colspan}
            className={css`
                ${style}
                position: relative;
                border: 1px solid #d9d9d9;
                word-break: break-all;
                min-width: 352px;
                white-space: normal;
                word-wrap: break-word;
                vertical-align: top;
            `}
            {...attributes}
        >
            {children}
        </td>
    )
}

export const TableContent = ({ attributes, children, element }) => {
    return <p {...attributes}>{children}</p>
}