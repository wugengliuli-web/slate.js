import { Transforms } from 'slate'
export const addImgBlock = (e, editor) => {
    let url = ''
    let { files } = e.currentTarget
    if(files && files.length > 0) {
        let file = files[0]
        let fr = new FileReader()
        fr.readAsDataURL(file)
        fr.onload = function() {
            url = fr.result
            Transforms.insertNodes(
                editor,
                { type: 'image', url, children: [{ text: '' }] }
            )
            Transforms.insertNodes(
                editor,
                { type: 'paragraph', children: [{ text: '' }] }
            )
        }
    }
}
