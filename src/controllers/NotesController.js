const knex = require('../database/knex');

class NotesController{
    async create(request, response) {
        const { title, description, rating, movie_tags, links } = request.body;
        const { user_id } = request.params;

        const [note_id] = await knex('movie_notes').insert({
            title,
            description,
            rating,
            user_id
        })

        const linksInsert = links.map(link => {
            return {
                note_id,
                url: link
            }
        })

        await knex('links').insert(linksInsert);

        const tagsInsert = movie_tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        })

        await knex('movie_tags').insert(tagsInsert);
    
        response.json()
    }

    async show(request, response) {
        const { id } = request.params;

        const note = await knex('movie_notes').where({ id }).first();
    // para pegar usando o id, utiliza o filtro where, para pegar a primeira usa o first. 

        const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name')
    // mostrar as tags que estão vinculadas com o id passado

        const links = await knex('links').where({ note_id: id }).orderBy('created_at')
    // mostrar os links que estão vinculados a essa nota do Id
        return response.json({
            ...note,
            tags,
            links
        })
    // despejando todos os detalhes da nota, e depois acrescentando tags e links.
    }

    async delete(request,response) {
        const { id } = request.params;

        await knex("movie_notes").where({ id }).delete()

        return response.json()
    }

    async index(request, response){
        const { user_id, title, tags } = request.query;

        let notes;

        if(tags) {
            const filterTags = tags.split(',').map(tag => tag.trim());
        // tags.split(',') vai pegar as tags e colocar dentro de um array, separando elas quando encontrar uma vírgula,
        // map vai retornar as tags sem espaçamento entre uma e outra.
        // trim remove espaçamentos e tabs do array.
            
            notes = await knex('movie_tags')
            .select([
                "movie_notes.id",
                "movie_notes.title",
                "movie_notes.user_id",
            ])
            .where('movie_notes.user_id', user_id)
        //  definir uma cláusula, vai vim as tags pelo usuário que tem o id que estou enviando, nesse exemplo id = 1
            .whereLike('movie_notes.title', `%${title}%`)
        //  filtra por um nome parecido ou que contenha algo em sua escrita que eu esteja buscando
            .whereIn('name', filterTags)
        //  procurar o nome da tag dentro das tagsfiltradas
            .innerJoin("movie_notes","movie_notes.id", "movie_tags.note_id")
        // vai ir na tabela de notas e tabela de tags e juntar as que tiver o mesmo id
            .orderBy('movie_notes.title')
        // Where in, comparar a tag passado na query com a as tags da tabela movie_tags

        } else {
            notes = await knex("movie_notes").where({ user_id }).whereLike("title", `%${title}%`).orderBy("title");
        // whereLike para ver se tem alguma palavra parecido com a que eu estou buscando. % ante ou depois
        }

        const userTags = await knex('movie_tags').where({ user_id });
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id)

            return {
                ...note,
                tags: noteTags
            }
        });
        return response.json( notesWithTags )
    }
}

module.exports = NotesController;