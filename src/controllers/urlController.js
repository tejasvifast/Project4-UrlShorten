const shortid = require('shortid')
const urlModel = require('../models/urlModel')

const createUrl = async function (req, res) {
    try {
        const data = req.body
        const baseUrl = 'http:localhost:3000'
        const longUrl = data.longUrl
        const urlCode = shortid.generate()

        const isAlreadyLongUrl = await urlModel.findOne({ longUrl: longUrl }).select({ urlCode: 1, shortUrl: 1, longUrl: 1, _id: 0 })
        if (isAlreadyLongUrl) return res.status(400).send({ status: false, message: "url generated", data: isAlreadyLongUrl })

        const shortUrl = baseUrl + '/' + urlCode
        data.shortUrl = shortUrl
        data.urlCode = urlCode
        const urlCreated = await urlModel.create(data)
        return res.status(201).send({ status: true, message: "url generated", data: data })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}


const getUrl = async function (req, res) {

    try {
        const urlCode = req.params.urlCode
        if (!urlCode) return res.status(400).send({ status: false, message: "urlCode is not Present" })
        const findUrlCode = await urlModel.findOne({ urlCode: urlCode })
        if (!findUrlCode) return res.status(404).send({ status: false, message: "Url does not exist" })
        return res.status(302).send({ status: true, message: "url generated", data: findUrlCode.longUrl })
    }

    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}
module.exports = { createUrl, getUrl }