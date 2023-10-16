const Mongoose = require("mongoose")


const dbConection = async() => {

    try {
        await Mongoose.connect(process.env.DB_CNN)

        console.log('DB online')

    } catch (error) {

        console.log(error)   
        throw new error('Error a la hora de iniciar la base de datos')
    }



}

module.exports = {
    dbConection
}
