import React from 'react';

export function Plus() {
	return (
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			width="18" 
			height="18" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="#27ae60" 
			strokeWidth="2" 
			strokeLinecap="square" 
			strokeLinejoin="arcs"
		>
			<line x1="12" y1="5" x2="12" y2="19"></line>
			<line x1="5" y1="12" x2="19" y2="12"></line>
		</svg>
	)
}

export function Minus() {
	return (
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			width="18" 
			height="18" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="#27ae60" 
			strokeWidth="2" 
			strokeLinecap="square" 
			strokeLinejoin="arcs"
		>
				<line x1="5" y1="12" x2="19" y2="12"></line>
		</svg>
	)
}

export function ArrowPrevious() {
	return (
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			width="16" 
			height="16" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="#27ae60" 
			strokeWidth="2" 
			strokeLinecap="round" 
			strokeLinejoin="round"
		>
				<path d="M19 12H6M12 5l-7 7 7 7"/>
		</svg>
	)
}

export function ArrowNext() {
	return (
		<svg 
			xmlns="http://www.w3.org/2000/svg" 
			width="16" 
			height="16" 
			viewBox="0 0 24 24" 
			fill="none" 
			stroke="#27ae60" 
			strokeWidth="2" 
			strokeLinecap="round" 
			strokeLinejoin="round"
		>
				<path d="M5 12h13M12 5l7 7-7 7"/>
		</svg>
	)
}