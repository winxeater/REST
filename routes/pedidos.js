const express = require('express');
const router = express.Router();

//Get all items
router.get('/', (req, res, next) =>{
    mysql.getConnection((error, conn) => {
        if (error) { 
            return res.status(500).send({ error: error }) 
        }

        conn.query(
            'SELECT * FROM pedidos',
            (error, result, field) => {
                if (error) { 
                    return res.status(500).send({ error: error }) 
                }

                const response = {
                    quantidade: result.length,
                    pedidos: result.map(pedido => {
                        return {
                            id_pedido: pedido.id,
                            id_produto: pedido.id_produto,
                            quantidade: pedido.quantidade,
                            request: {
                                tipo: 'GET',
                                descricao: '',
                                url: 'http://localhost:3000/pedidos/' + pedido.id_pedido
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

    const pedido = {
        id: req.body.id,
        quantidade: req.body.quantidade
    }

    res.status(201).send({
        message: 'POST dentro da rota de pedidos',
        pedidoCriado: pedido
    });
});

//Get an Item by id
router.get('/:id', (req, res, next) =>{
    const id = req.params.id;
   
    res.status(200).send({
        message: 'Bingo! Você passou um single ID',
        id: id
    });
});

//Alter an Item 
router.patch('/', (req, res, next) => {
    res.status(201).send({
        message: 'PATCH dentro da rota de pedidos'
    });
});

//Delete an Item
router.delete('/', (req, res, next) => {
    res.status(201).send({
        message: 'DELETE dentro da rota de pedidos'
    });
});

module.exports = router;