const  knex  = require('../../customConfig')

exports.create= (req,res)=>{
    const name = req.body.name
    const branch = req.body.branch_id
    const org = req.body.org_id
    knex('device_location')
    .insert([{location_name: name,branch_id: branch,organization_id:org}])
    .then(r=>{
      res.send(r)
  })
  .catch(e=>{
      res.send(e)
  })
}


exports.get= (req,res)=>{
    knex.select()
    .from('device_location')
    .leftJoin('organizations','organizations.id','device_location.organization_id')
    .leftJoin('branches','branches.id','device_location.branch_id')
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
    .from('device_location')
    .leftJoin('organizations','organizations.id','device_location.organization_id')
    .leftJoin('branches','branches.id','device_location.branch_id')
    .where('device_location.id',id)
    .then(r=>{
        res.send(r)
    })
    .catch(e=>{
        res.send(e)
    })
}



exports.delete= (req,res)=>{
    const id = req.params.id
    knex('device_location')
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
    knex('device_location').where('id', id)
    .update({
        location_name: name
    })
    .then(r=>{
        res.send("200")
    })
    .catch(e=>{
        res.send(e)
    })
}

exports.GetByBranchId = (req,res)=>{
    const id = req.params.id
    knex.select()
    .from('device_location')
    .leftJoin('organizations','organizations.id','device_location.organization_id')
    .leftJoin('branches','branches.id','device_location.branch_id')
    .where('device_location.branch_id',id)
    .then(r=>{
        res.send(r)
    })
    .catch(e=>{
        res.send(e)
    })
}
