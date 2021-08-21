const { request } = require('express');
const connection = require('../database/connection');

module.exports = {    
  async index(request, response){
    const { page = 1 } = request.query;
    
    const [count] = await connection('incidents').count();//contando total de instâncias

    const incidents = await connection('incidents')
    .join('ongs', 'ongs.id', '=', 'incidents.ong_id') //juntar dados das tabelas ONG e Incident
    .limit(5) //trazendo 5 registros por vez
    .offset((page -1) * 5)
    .select(
      'incidents.*',
      'ongs.name',
      'ongs.email',
      'ongs.whatsapp',
      'ongs.city',
      'ongs.uf'); // select incidents

    response.header('X-Total-Count', count['count(*)'])
    
    return response.json(incidents); //retorno dos incidents em JSON
  },

  async create(request, response) {
    const { title, description, value } = request.body; //recebendo o body
    const ong_id = request.headers.authorization; //pegar o ID autorizado

    const [id] = await connection('incidents').insert({ //inserindo as info de body
      title,
      description,
      value,
      ong_id,//repare que o ID inserido no banco - FK
    });

    return response.json({ id }); //mandando ID de volta
  },

  async delete(request, response) {
    const { id } = request.params; // ID do Incident recebido como parâmetro
    const ong_id = request.headers.authorization; // ID da ONG logada
    //buscando "ong_id" de um incidente com ID igual ao recebido como parâmetro
    const incident = await connection('incidents')
      .where('id', id) //id = id recebido  
      .select('ong_id') //selecione deste incidente a ong_id  
      .first(); //pegar o primeiro resultado

    //Se o ong_id buscado for diferente do ong_id logado emite um erro  
    if (incident.ong_id !== ong_id) {
      return response.status(401).json({ error: 'Operation not permitted.' });//401 cod HTTP de insucesso
    }

    await connection('incidents').where('id', id).delete();//deletando o registro

    return response.status(204).send(); //retornando cod HTTP 204 de sucesso!
  }  
};