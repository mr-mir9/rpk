const express = require('express')
const cors = require('cors')
const app = express()
const port = 35201

app.use(cors())

const middleware = require('./config/Middleware')
app.use(middleware)

const routes = require('./config/Routes')
app.use(routes)

app.listen(port, () => {
    console.log(`REST API программного комплекса\nдля исследования неизотермического течения\nаномально-вязких материалов localhost:${port}`)
})