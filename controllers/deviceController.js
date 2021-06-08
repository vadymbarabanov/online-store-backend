import * as uuid from 'uuid'
import { Device, DeviceInfo } from '../models/models.js'
import ApiError from '../error/ApiError.js'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info } = req.body
      const { img } = req.files
      const fileName = uuid.v4() + '.jpg'
      img.mv(resolve(__dirname, '..', 'static', fileName))
      const device = await Device.create({
        name,
        price,
        typeId,
        brandId,
        img: fileName,
      })

      if (info) {
        info = JSON.parse(info)
        info.forEach((el) => {
          DeviceInfo.create({
            title: el.title,
            description: el.description,
            deviceId: device.id,
          })
        })
      }

      return res.json(device)
    } catch (error) {
      console.log(error.message)
      return next(ApiError.badRequest(error.message))
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page } = req.query
    page = page || 1
    limit = Math.min(limit || 9, 9)
    let offset = page * limit - limit

    let devices

    if (!brandId && !typeId) {
      devices = await Device.findAndCountAll({ limit, offset })
    }

    if (!brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
      })
    }

    if (brandId && !typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
      })
    }

    if (brandId && typeId) {
      devices = await Device.findAndCountAll({
        where: { brandId, typeId },
        limit,
        offset,
      })
    }

    return res.json(devices)
  }

  async getOne(req, res) {
    const { id } = req.params
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: 'info' }],
    })

    return res.json(device)
  }
}

export default new DeviceController()
