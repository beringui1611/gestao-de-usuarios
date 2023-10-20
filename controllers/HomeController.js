class HomeController{
    async index(req, res) {
        res.send("app express!")
    }
}

module.exports = new HomeController()