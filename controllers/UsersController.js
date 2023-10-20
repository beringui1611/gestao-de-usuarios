const knex = require('knex')
const User = require('../models/User')
const PasswordToken = require('../models/PasswordTokens')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const secret = "$2a$12$8pWP/dXuO5gZ.g9vGOAj4u4Ux1YUyfB86SHEIcmXMyp/ekJMmvKUC"

class UsersController{
    async index(req, res) {
        const users = await User.findAll()
        res.json(users)
    }

    async create(req, res) {
        const { email, password, name } = req.body
        
        try {

         
            if (email == undefined) {
                res.status(404).json({error:"email invalido"})
            } 
    
            if (password == undefined) {
                res.status(404).json({message:"senha invalida tente novamente"})
            }
    
            if (name == undefined) {
                res.status(404).json({message:"prencha esse campo obrigatorio"})
            }

            const emailExist = await User.findEmail(email)
            
            if (emailExist) {
                res.status(400).json({error:"email já existe"})
            }

            if (password.length < 6) {
                res.status(404).json({error: "senha tem que ter mais de 6 digitos"})
            }

            await User.new(email,password,name)

            res.status(200).json({message: "tudo certo!"})
        
        } catch (err) {
            return err
        }
         
    }

    async findUser(req, res) {
        const id = req.params.id
        const user = await User.findById(id)
        if (user == undefined) {
            res.json({}).status(404)
        } else {
            res.json(user).status(200)
        }
    }


    async edit(req, res) {
        const { id, name, role, email } = req.body
        
        const result = await User.update(id, name, role, email)
        
        if (result != undefined) {
            if (result.status) {
                res.send("tudo certo!").status(200)
            }else {
                res.status(400).json({error: "credencias invalidas"})
            }
        } else {
            res.status(406).json({error:"erro de servidor"})
        }
            
    }

    async delete(req, res) {

        const id = req.params.id

        const result = await User.delete(id)

        if (result.status) {
            res.status(200).json({message:"tudo certo"})
        } else {
            res.status(406).json({error:"requisição invalida"})
        }
    }


    async recuperacao(req, res) {
        const { email } = req.body; // Extract the 'email' property from the request body
        const result = await PasswordToken.create(email);
    
        if (result.status) {
            res.status(200).send(" " + result.token);
        } else {
            res.status(406).send(result.err);
        }
    }
    

    async changePassword(req, res) {
        const token = req.body.token;
        const password = req.body.password; // Use req.body.password para acessar a senha
    
        const isTokenValid = await PasswordToken.validate(token);
    
        if (isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token);
            res.status(200).send("Senha alterada");
        } else {
            res.status(406).send(isTokenValid.err); // Mantenha a mesma estrutura para mensagens de erro
        }
    }
    

    async login(req, res) {
        const { email, password } = req.body;
        
        try {
            const user = await User.findByEmail(email);
    
            if (user !== undefined) {
                if (user.password) {
                    const passwordCorrect = await bcrypt.compare(password, user.password);
    
                    if (passwordCorrect) {
                        const token = jwt.sign({ email: user.email, role: user.role }, secret);
                        res.status(200).json({ token: token });
                    } else {
                        res.status(400).send("Senha incorreta");
                    }
                } else {
                    res.status(400).send("Senha não definida para o usuário");
                }
            } else {
                res.status(404).json({ error: "Usuário não encontrado" });
            }
        } catch (err) {
            console.error(err);
            res.status(500).send("Erro no servidor");
        }
    }
    

  

}

module.exports = new UsersController()