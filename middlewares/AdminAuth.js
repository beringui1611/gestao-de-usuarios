const jwt = require("jsonwebtoken")
const secret = "$2a$12$8pWP/dXuO5gZ.g9vGOAj4u4Ux1YUyfB86SHEIcmXMyp/ekJMmvKUC"


module.exports = function (req, res, next) {
    const authToken = req.headers['authorization']

    if (authToken != undefined) {

        const bearer = authToken.split(' ')
        const token = bearer[1]

        try {
            const decoded = jwt.verify(token, secret)
            if (decoded.role == 1) {
                next()
            } else {
                return res.status(400).json({message: "voce nao tem autorização"})
            }
        } catch (err) {
            console.log(err)
        }

     
    } else {
        res.status(403).send("voce nao esta autorizado")
    }
}