const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

//Get all items
router.get('/', (req, res, next) =>{
    // res.status(200).send({
    //     message: 'GET dentro da rota de produtos'
    // });
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ error: error }) 
        }

        conn.query(
            'SELECT * FROM produtos',
            (error, result, field) => {
                if (error) { 
                    return res.status(500).send({ error: error }) 
                }

                const response = {
                    quantidade: result.length,
                    produtos: result.map(produto => {
                        return {
                            id_produto: produto.id,
                            nome: produto.nome,
                            preco: produto.preco,
                            request: {
                                tipo: 'GET',
                                descricao: '',
                                url: 'http://localhost:3000/produtos/' + produto.id
                            }
                        }
                    })
                }
            return res.status(200).send(response)
            }
        )
    })
});

//Post Item
router.post('/', (req, res, next) => {
    // const produto = {
    //     nome: req.body.nome,
    //     preco: req.body.preco
    // };
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send( {error: error} ) 
        }

        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, result, field) => {
                conn.release();

                if (error) { 
                    return res.status(500).send({ error: error }) 
                }

                const response = {
                    mensagem: 'Produto inserido com sucesso!',
                    produtoCriado: {
                        id_produto: result.id,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: '',
                            url: 'http://localhost:3000/produtos/',
                        }
                    }
                }

                return res.status(201).send(response);
    
            }
        )
    })

    
});

//Get an Item by id
router.get('/:id', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ error: error }) 
        }

        conn.query(
            'SELECT * FROM produtos WHERE id = ?',
            [req.params.id],
            (error, result, field) => {
                if (error) { 
                    return res.status(500).send({ error: error }) 
                }

                if (result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado produto com este ID!'
                    })
                }

                const response = {
                    produto: {
                        id_produto: result[0].id,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: '',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                }

                return res.status(201).send(response);
            }
        )
    })
});

//Alter an Item 
router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send( {error: error} ) }
        conn.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id = ?',
            [req.body.nome, req.body.preco, req.body.id],

            (error, result, field) => {
                conn.release();

                if (error) { 
                    return res.status(500).send({ error: error }) 
                }

                const response = {
                    mensagem: 'Produto atualizado com sucesso!',
                    produtoAtualizado: {
                        id_produto: req.body.id,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: '',
                            url: 'http://localhost:3000/produtos/' + req.body.id
                        }
                    }
                }
            return res.status(202).send(response);
            }
        )
    })
});

//Delete an Item
router.delete('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send( {error: error} )
        }

        conn.query(
            'DELETE FROM produtos WHERE id = ?',
            [req.body.id],

            (error, result, field) => {
                conn.release();

                if (error) { 
                    return res.status(500).send({ error: error }) 
                }

                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: '',
                        url: 'http://localhost:3000/produtos/' + req.body.id,
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
            return res.status(202).send(response);
            }
        )
    })
});

module.exports = router;