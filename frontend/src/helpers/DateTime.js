class DateTime{

	static userFormatted(value){
		const parse = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/.exec(value)

		const date = new Date()
		date.setUTCFullYear(parse[1], parseInt(parse[2])-1, parse[3])
		date.setUTCHours(parse[4], parse[5], parse[6], 0)
		
		const monthes = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
		return `${date.getDate()} ${monthes[date.getMonth()]}, ${date.getHours()}:${date.getMinutes()}`
	}

}
module.exports = DateTime