import React from 'react'
import { css } from 'emotion'
import {
    useEditor,
    useReadOnly,
    ReactEditor
} from 'slate-react'
import { Transforms } from 'slate'
import { Checkbox, Upload, Icon, message } from 'antd'
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

export const Image = ({ attributes, children, element }) => {
    const { style } = element
    return (
        <div {...attributes}>
            <div className={css`
                ${style}
            `}>
                <img
                    className={css`
                        max-width: 100%;
                        ${'' /* display: block; */}
                    `}
                    alt=""
                    src={element.url}
                />
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


export const UploadImg = ({ attributes, children, element }) => {
    const { Dragger } = Upload;
    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
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
        }
    }
    return (
        <div>aaa</div>
    )
}