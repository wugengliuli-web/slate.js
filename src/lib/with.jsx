import { Editor, Point, Transforms, Range } from 'slate'

const withDelAll = editor => {
    
    return editor
}

const withCheckList = editor => {
    const { deleteBackward } = editor
    //一个一个删除
    editor.deleteBackward = (...args) => {
        const { selection } = editor
        if (selection && Range.isCollapsed(selection)) {
            const [match] = Editor.nodes(editor, {
                match: n => n.type === 'check-list-item',
            })
            if (match) {
                const [, path] = match
                const start = Editor.start(editor, path)
                if (Point.equals(selection.anchor, start)) {
                    Transforms.setNodes(
                        editor,
                        { type: 'paragraph' },
                        { match: n => n.type === 'check-list-item' }
                    )
                    return
                }
            }
        }

        deleteBackward(...args)
    }
    return editor
}


const withImage = editor => {
    const { insertData, isVoid, isInline } = editor
    editor.isVoid = el => {
        return el.type === 'img' ? true : isVoid(el)
    }

    editor.isInline = el => {
        return el.type === 'image' ? true : isInline(el)
    }

    // editor.insertData = data => {
    //     const { files } = data
    //     if (files && files.length > 0) {
    //         for (const file of files) {
    //             const reader = new FileReader()
    //             const [mime] = file.type.split('/')

    //             if (mime === 'image') {
    //                 reader.addEventListener('load', () => {
    //                     const url = reader.result
    //                     addImgBlock(editor, url)
    //                 })
    //                 reader.readAsDataURL(file)
    //             }
    //         }
    //     } else {
    //         insertData(data)
    //     }
    // }
    return editor
}

export const withWrapper = editor => {
    // return withTable(withCheckList(withImage(editor)))
    return withCheckList(withImage(editor))
}