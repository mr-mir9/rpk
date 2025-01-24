exports.num = value => {
	return /^-?(([0-9]{0,9})(,[0-9]{0,5})?)?$/.test(value)
}