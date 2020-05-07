const  knex  = require('../../customConfig')

exports.create= (req,res)=>{
    const name = req.body.name
    const location = req.body.location_id
    knex('devices')
    .insert([{device_name: name, device_location_id : location}])
    .then(r=>{
      res.send(r)
  })
  .catch(e=>{
      res.send(e)
  })
}


exports.get= (req,res)=>{
    knex.raw(`SELECT *
    FROM
    (SELECT devices.id AS device_id,devices.device_name,device_location.location_name,device_location.organization_id AS org,device_location.branch_id AS branch 
    FROM devices 
    LEFT JOIN device_location 
    ON device_location.id = devices.device_location_id) sub 
    LEFT JOIN organizations 
    ON sub.org = organizations.id 
    LEFT JOIN branches 
    ON sub.branch = branches.id`)
    .then(r=>{
        res.send(r[0])
    })
    .catch(e=>{
        res.send(e)
    })
}


exports.singleGetById= (req,res)=>{
    const id = req.params.id
    knex.raw(`SELECT *
    FROM
    (SELECT devices.id AS device_id,devices.device_name,device_location.location_name,device_location.organization_id AS org,device_location.branch_id AS branch 
    FROM devices 
    LEFT JOIN device_location 
    ON device_location.id = devices.device_location_id
    WHERE devices.id = ${id}) sub 
    LEFT JOIN organizations 
    ON sub.org = organizations.id 
    LEFT JOIN branches 
    ON sub.branch = branches.id`)
    .then(r=>{
        res.send(r[0])
    })
    .catch(e=>{
        res.send(e)
    })
}



exports.delete= (req,res)=>{
    const id = req.params.id
    knex('devices')
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
    const location = req.body.location_id
    knex('devices').where('id', id)
    .update({
        device_name: name,
        device_location_id : location
    })
    .then(r=>{
        res.send("200")
    })
    .catch(e=>{
        res.send(e)
    })
}
