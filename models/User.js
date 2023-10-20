const knex = require('../database/db');
const bcrypt = require('bcrypt');
const PasswordTokens = require('./PasswordTokens');





class User {
    async new(email, password, name) {
        try {
            const hash = await bcrypt.hash(password, 10);
            await knex.insert({ email, password: hash, name, role: 0 }).table('users');
        } catch (err) {
            console.error(err);
        }
    }

    async findEmail(email) {
        try {
            const res = await knex.select("*").from("users").where({ email: email });
            return res.length > 0;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async findAll() {
        try {
            const result = await knex.select("email", "name", "id", "role").table("users");
            return result;
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async findById(id) {
        try {
            const result = await knex.select(['id', 'email', 'role', 'name']).where({ id: id }).table("users");
            return result.length > 0 ? result[0] : undefined;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }

    async update(id, name, role, email) {
        const user = await this.findById(id);

        if (user !== undefined) {
            const editUser = {};

            if (email !== undefined && email !== user.email) {
                const result = await this.findEmail(email);
                if (result === false) {
                    editUser.email = email;
                } else {
                    return { status: false, err: "Email already exists" };
                }
            }

            if (name !== undefined) {
                editUser.name = name;
            }

            if (role !== undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({ id: id }).table("users");
                return { status: true };
            } catch (err) {
                console.error(err);
                return { status: false };
            }
        } else {
            return { status: false, err: "User does not exist" };
        }
    }

    async delete(id) {
        const user = await this.findById(id);

        try {
            if (user !== undefined) {
                await knex.delete().where({ id: id }).table("users");
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async findByEmail(email) {
        try {
            const result = await knex.select(["id","email","password","role","name"]).table("users").where({ email: email });
            return result.length > 0 ? result[0] : undefined;
        } catch (err) {
            console.error(err);
            return undefined;
        }
    }


    async changePassword(NovaSenha, id, token) {
        const hash = await bcrypt.hash(NovaSenha, 10);
        await knex.update({ password: hash }).where({ id: id }).table("users");
        await PasswordTokens.setUsed(token)
    }



    
}

module.exports = new User();
