import React from 'react'
import { css } from 'emotion'
export const renderLeaf = ({ attributes, children, leaf }) => {
	if (leaf.bold) {
		children = <strong>{children}</strong>
	}

	if (leaf.code) {
		children = <code
			className={css`
				font-family: monospace;
				background-color: #eee;
				padding: 3px;
			`}
		>{children}</code>
	}

	if (leaf.italic) {
		children = <em>{children}</em>
	}

	if (leaf.underline) {
		children = <u>{children}</u>
	}

	if (leaf.strikethrough) {
		children = <del>{children}</del>
	}

	if (leaf.color) {
		switch (leaf.color) {
			case 'red':
				children = <span className={css`
					color: red
				`}>{children}</span>
			case 'black':
				children = <span className={css`
					color: black
				`}>{children}</span>
			case 'blue':
				children = <span className={css`
					color: blue
				`}>{children}</span>
		}
	}
	return <span {...attributes}>{children}</span>
}