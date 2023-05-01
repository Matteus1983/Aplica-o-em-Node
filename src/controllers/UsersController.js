const { hash, compare } = require('bcrypt');
// hash para criptogravar e compare para comparar as senhas criptografadas

const AppError = require("../utils/AppError");

const sqliteConnection = require('../database/sqlite');

class UsersController {
    async create(request,response) {
        const { name, email, password } = request.body; 

        const database = await sqliteConnection();
        const checkUserExists = await database.get('SELECT * FROM users WHERE email = (?)', [email])
// verificação para checar se alguém já está utilizando o e-mail enviado pela requisição, se for true, o e-mail já existir no db

        if(checkUserExists){
            throw new AppError('Este e-mail já está em uso.')
        }

        const hashedPassword = await hash(password, 8)

        await database.run(
            'INSERT INTO users (name, email, password) VALUES (?, ? ,?)',
            [name, email, hashedPassword]
        );

        return response.status(201).json();
    }

    async update(request,response) {
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const database = await sqliteConnection();
    // conexão com o banco de dados
        const user = await database.get('SELECT * FROM users WHERE id = (?)', [id])
    // seleciona todos os usuários pelo id que foi passado no params
    // se tiver o id que foi passado ali no array, segue o fluxo, se não tiver entra no IF

        if(!user) {
            throw new AppError('Usuário não encontrado')
        }

        const userWithUpdateEmail = await database.get('SELECT * FROM users WHERE email = (?)',  [email])
    // seleciona todos os usuários pelo email que foi passado no params

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) {
                                                    // ESSE ID É O MEU
            throw new AppError('Este e-mail já está em uso.')
        }
    // Se eu toh tentando atualiazar o meu email e o email que eu toh tentando definir já está sendo utilizado por outra pessoa, existe um email igual ao que eu estou tentando definir, sendo que o id do dono é diferente do meu, significa que esse email não é meu.

        user.name = name ?? user.name;  
    // se estiver conteúdo dentro de name, esse que vai ser utilizado, se não tiver usa o 'user.name'
        user.email = email ?? user.email;

        if( password && !old_password){
            throw new AppError('Você precisa informar a senha antiga para definir a nova senha');
        }

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword) {
                throw new AppError('A senha antiga não confere')
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
        UPDATE users SET
        name = ?,
        email = ?,
        password = ?,
        updated_at = ?
        WHERE id = ?`,
        [user.name, user.email,user.password, new Date(), id]
        )

        return response.status(200).json();
    }
}

module.exports = UsersController;