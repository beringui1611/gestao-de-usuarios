const knex = require('../database/db');
const User = require('./User');
const { v4: uuidv4 } = require('uuid');

class PasswordToken {
    async create(email) {
        const user = await User.findByEmail(email);
        if (user !== undefined) {
            try {
                const token = uuidv4();
                
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token: token
                }).table("passwordtokens");
                return { status: true, token: token };
            } catch (err) {
                console.error(err);
                return { status: false, err: "Failed to create a password token" };
            }
        } else {
            return { status: false, err: "The email provided does not exist in the database" };
        }
    }


    async validate(token) {
        try {
            const result = await knex.select().where({ token: token }).table("passwordtokens");
    
            if (result.length > 0) {
                const tk = result[0];
    
                if (tk.used) {
                    return { status: false, err: "O token já foi usado" };
                } else {
                    return { status: true, token: tk };
                }
            } else {
                return { status: false, err: "Token não encontrado" };
            }
        } catch (err) {
            console.error(err);
            return { status: false, err: "Erro ao validar o token" };
        }
    }
    
    async setUsed(token) {
        await knex.update({used: 1}).where({token:token}).table("passwordtokens")
    }

   
}

module.exports = new PasswordToken();
