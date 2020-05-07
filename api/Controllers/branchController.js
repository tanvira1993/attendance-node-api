const  knex  = require('../../customConfig')

exports.create= (req,res)=>{
    const name = req.body.name
    const desc = req.body.desc
    const org = req.body.org_id
    knex('branches')
    .insert([{branch_name: name,desc: desc,organization_id:org}])
    .then(r=>{
      res.send(r)
  })
  .catch(e=>{
      res.send(e)
  })
}


exports.get= (req,res)=>{
    knex.select()
    .from('branches')
    .leftJoin('organizations','organizations.id','branches.organization_id')
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
    .from('branches')
    .leftJoin('organizations','organizations.id','branches.organization_id')
    .where('branches.id',id)
    .then(r=>{
        res.send(r)
    })
    .catch(e=>{
        res.send(e)
    })
}



exports.delete= (req,res)=>{
    const id = req.params.id
    knex('branches')
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
    knex('branches').where('id', id)
    .update({
      branch_name: name,    
      desc: desc
    })
    .then(r=>{
        res.send("200")
    })
    .catch(e=>{
        res.send(e)
    })
}

exports.GetByOrgId = (req,res)=>{
    const id = req.params.id
    knex.select()
    .from('branches')
    .leftJoin('organizations','organizations.id','branches.organization_id')
    .where('branches.organization_id',id)
    .then(r=>{
        res.send(r)
    })
    .catch(e=>{
        res.send(e)
    })
}

