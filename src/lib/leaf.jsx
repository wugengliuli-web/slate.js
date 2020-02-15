import React, { Children } from 'react'
import { css } from 'emotion'
export const renderLeaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}
	
	// if (leaf.fontSize) {
	// 	children = <span className={css`
	// 				font-size: ${leaf.fontSize}
	// 			`}>{children}</span>
	// }
	// if (leaf.color) {
	// 	children = <span className={css`
	// 				color: ${leaf.color}
	// 			`}>{children}</span>
	// }
	// if (leaf.background) {
	// 	children = <span className={css`
	// 				background-color: ${leaf.background}
	// 			`}>{children}</span>
	// }
	// if (leaf.fontFamily) {
	// 	children = <span className={css`
	// 				font-family: ${leaf.fontSize}
	// 			`}>{children}</span>
	// }
	if (leaf.underline) {
		children = <u>{children}</u>
	}

	if (leaf.strikethrough) {
		children = <del>{children}</del>
	}
	let style = {...leaf}
	delete style['text']
	children = <span className={css`
					${style}
				`}>{children}</span>

	return <span {...attributes}>{children}</span>
}