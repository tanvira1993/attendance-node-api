const  knex  = require('../../customConfig')

exports.create= (req,res)=>{
    const name = req.body.name
    knex('organizations')
  .insert([{org_name: name}])
  .then(r=>{
      res.send(r)
  })
  .catch(e=>{
      res.send(e)
  })
}


exports.get= (req,res)=>{
    knex.select()
    .from('organizations')
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
    .from('organizations')
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
    knex('organizations')
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
    knex('organizations').where('id', id)
    .update({
      org_name: name,
    })
    .then(r=>{
        res.send("200")
    })
    .catch(e=>{
        res.send(e)
    })
}
