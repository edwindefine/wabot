const chalk = require('chalk')

const color = (text, color) => {
    return !color ? chalk.green(text) : chalk.keyword(color)(text)
}

const hexColor = (text, colorCode) => {
	return !colorCode ? chalk.green(text) : chalk.hex(colorCode)(text)
}

const bgColor = (text, bgcolor) => {
	return !bgcolor ? chalk.bgGreen(text) : chalk.bgKeyword(bgcolor)(text)
}

module.exports = {
	color,
	bgColor,
	hexColor,
}