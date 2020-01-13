import { Transforms } from 'slate'
export const addImgBlock = (editor, url) => {
    Transforms.setNodes(
        editor, 
        { type: 'img', url }, 
        { match: n => {
            console.log(n)
            return n.type === 'addImage'
        } }
    )
}
