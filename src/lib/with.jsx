import { Editor, Point, Transforms, Range } from 'slate'
const withDelAll = editor => {
    let { deleteBackward, deleteForward, deleteFragment } = editor
    editor.deleteBackward = (...args) => {
        //一个一个删除时触发
        const { type } = editor.children[0]
        if(type === 'table') {
            //如果是表格
            //不允许删除表格的td 
            let { selection } = editor
            let { focus: { offset, path } } = selection
            let [,,,low] = path
            //如果偏移为0就不允许继续删除
            if(offset === 0 && low === 0) return
        }
        deleteBackward(...args)
    }

    editor.deleteForward = () => {
        deleteForward()
        console.log('deleteForward')
    }

    editor.deleteFragment = (...arg) => {
        const { type } = editor.children[0]
        if(type === 'table') {
            //如果是表格
            //不允许选中删除表格
            const { selection: { focus: { path: focusPath }, anchor: { path: anchorPath } } } = editor
            for(const i in focusPath) {
                if(focusPath[i] !== anchorPath[i]) return
            }
        }
        //选择后删除触发
        deleteFragment(...arg)
        console.log('deleteFragment')
    }
    return editor
}

const withInsert = editor => {
    let { insertFragment, insertNode, insertText } = editor

    editor.insertFragment = fragment => {
        console.log('insertFragment->', fragment)
        insertFragment(fragment)
    }

    editor.insertNode = node => {
        console.log('insertNode', node)
        insertNode(node)
    }

    editor.insertText = text => {
        console.log('insertText->', text)
        const { marks } = editor
        
        insertText(text)
        // if(marks && /^[\u4e00-\u9fa5]+$/.test(text)) {
        //     debugger
        //     editor.insertBreak()
        // }
    }

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
    const { isVoid, isInline } = editor
    editor.isVoid = el => {
        return el.type === 'img' ? true : isVoid(el)
    }
    editor.isInline = el => {
        return el.type === 'image' ? true : isInline(el)
    }
    return editor
}

const withDivider = editor => {
    const { isVoid, isInline } = editor
    editor.isVoid = el => {
        return el.type === 'divider' ? true : isVoid(el)
    }
    editor.isInline = el => {
        return el.type === 'divider' ? false : isInline(el)
    }
    return editor
}

export const withWrapper = editor => {
    return withInsert(withDelAll(withDivider(withCheckList(withImage(editor)))))
}