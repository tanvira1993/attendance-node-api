const  knex  = require('../../customConfig')

exports.create= (req,res)=>{
    const name = req.body.name
    const desc = req.body.desc
    knex('user_type')
    .insert([{type_name: name,desc: desc}])
    .then(r=>{
      res.send(r)
  })
  .catch(e=>{
      res.send(e)
  })
}


exports.get= (req,res)=>{
    knex.select()
    .from('user_type')
    .then(r=>{
        res.send(r)
    })
    .catch(e=>{
        res.send(e)
    })
}


exports.singleGetById= (req,res)=>{
    const id = req.params.id
    knex.select()
    .from('user_type')
    .where('id',id)
    .then(r=>{
        res.send(r)
    })
    .catch(e=>{
        res.send(e)
    })
}



exports.delete= (req,res)=>{
    const id = req.params.id
    knex('user_type')
    .where('id', id)
    .del()
    .then(r=>{
        res.send("200")
    })
    .catch(e=>{
        res.send(e)
    })

}



exports.edit= (req,res)=>{
    const id = req.params.id
    const name = req.body.name
    const desc = req.body.desc
    knex('user_type').where('id', id)
    .update({
        type_name: name,    
      desc: desc
    })
    .then(r=>{
        res.send("200")
    })
    .catch(e=>{
        res.send(e)
    })
}