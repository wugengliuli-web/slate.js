import { Editor, Point, Transforms, Range } from 'slate'

const withDelAll = editor => {
    let { deleteBackward, deleteForward, deleteFragment } = editor
    editor.deleteBackward = () => {
        //一个一个删除时触发
        let { type } = editor.children[0]
        if(type === 'table') {
            //如果是表格
            //不允许删除表格的td 
            let { selection } = editor
            let { focus: { offset } } = selection
            //如果偏移为0就不允许继续删除
            if(offset === 0) return
            
        }
        deleteBackward()
    }

    editor.deleteForward = () => {
        deleteForward()
        console.log('deleteForward')
    }

    editor.deleteFragment = () => {
        //选择后删除触发
        deleteFragment()
        console.log('deleteFragment')
    }
    return editor
}

// const withInsert = editor => {
//     let { insertData, insertFragment, insertNode, insertText } = editor

//     editor.insertFragment = fragment => {
//         console.log('insertFragment->', fragment);
//         insertFragment(fragment)
//     }

//     editor.insertNode = node => {
//         console.log('insertNode', node);
//         insertNode(node)
//     }

//     editor.insertText = text => {
//         console.log('insertText->', text)
//         insertText(text)
//     }

//     return editor
// }

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
    return withDelAll(withCheckList(withImage(editor)))
}