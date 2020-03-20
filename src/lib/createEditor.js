import { createEditor } from 'slate'
import { withReact } from 'slate-react'
import { withWrapper } from './with'

export function createEditorFactory() {
    return withReact(withWrapper(createEditor()))
}