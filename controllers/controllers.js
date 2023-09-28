'use strict'
const { CustomAPIErrorHandler } = require('../errors/custom-errors')
const { StatusCodes } = require('http-status-codes')
const test = async (req, res) => {
    try {

        res.send("Hello")
        throw new CustomAPIErrorHandler('Success', StatusCodes.OK)
    } catch (error) {
        throw new CustomAPIErrorHandler('Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR)
    }

}

const sendVideo = async (req,res)=>{

}

module.exports = {
    test,
    sendy
}