function formatNum(value){
	if(value === '') return ''
	return String(parseFloat(value)).replace(/\./, ',')
}
export { formatNum }