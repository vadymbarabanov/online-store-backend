import express from 'express'
import 'dotenv/config'
import sequelize from './db.js'
import * as models from './models/models.js'
import cors from 'cors'
import router from './routes/index.js'
import errorHandler from './middleware/ErrorHandlingMiddleware.js'
import fileUpload from 'express-fileupload'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)

app.use(errorHandler) // Error middleware should always goes the last one

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (error) {
    console.log(error)
  }
}

start()
