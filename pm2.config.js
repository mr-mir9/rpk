module.exports = {
	apps: [{
		name: 'RPK-DEV frontend',
		script: './frontend/server.js',
		autorestart: false
	}, {
		name: 'RPK-DEV backend',
		script: './backend/server.js',
		autorestart: false
	}]
}