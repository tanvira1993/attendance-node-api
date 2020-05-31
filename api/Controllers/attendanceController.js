const  knex  = require('../../customConfig')

exports.storeApiAttendance = (req,res)=>{
  console.log('heelo from api')
   console.log("body==>",req.query)
   console.log("body==>",req.headers)
   let rfid = req.query.rf_id
   let device = req.query.device_id

   const today = new Date();
   const dd = String(today.getDate()).padStart(2, '0');
   const mm = String(today.getMonth() + 1).padStart(2, '0');
   const yyyy = today.getFullYear();
   const currentDate = `${yyyy}-${mm}-${dd}`
   console.log(currentDate)
   
   const months    = ['January','February','March','April','May','June','July','August','September','October','November','December'];
   const CurrentMonth = months[today.getMonth()] + yyyy;
   console.log(CurrentMonth)

   const currentTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
   console.log(currentTime)

   const rfid_users = knex.select('rfid_users.id as r_id','rfid_users.user_type_id','rfid_users.organization_id','rfid_users.branch_id','rfid_users.rfid_no','rfid_users.user__id','rfid_users.fingerprint_no','rfid_users.rfid_user_name','rfid_users.device_location_id','rfid_users.device_id','devices.device_name','device_location.location_name')
    .from('rfid_users')
    .leftJoin('devices', 'rfid_users.device_location_id', 'devices.device_location_id')
    .leftJoin('device_location', 'rfid_users.device_location_id', 'device_location.id')
    .where('rfid_users.rfid_no', rfid)
    .where('devices.device_name',device)
    .then(function(result) {
    console.log('result',result)
    if(result.length == 0){
      console.log('no effect')
      res.json({setJsonMessage:"all ok no effect"})
    }
    else{
      console.log('have effect')
      knex.select('attendance.id')
      .from('attendance')
      .where('created_at',currentDate)
      .where('device_location_id',result[0].device_location_id)
      .where('rfid_users_id',result[0].r_id)
      .where('rfid_number',result[0].rfid_no)
      .then(s=>{
        if(s.length == 0){
          console.log('have new effect')
          knex('attendance').insert({
            rfid_number: result[0].rfid_no,
            rfid_users_id: result[0].r_id,
            user_type_id: result[0].user_type_id,
            organization_id: result[0].organization_id,
            branch_id: result[0].branch_id,
            devices_id: result[0].device_id,
            device_name: result[0].device_name,
            device_location_id: result[0].device_location_id,
            in_time: currentTime,
            month_name: CurrentMonth,
            created_at: currentDate
          }).then(i=>{
          console.log('have new effect done')
          res.send("all ok with new effect")
          }).catch(r=>{
            console.log(r)
          res.send("all ok with new effect not work")
          })
        }
        else{
          const a_id=s[0].id
          console.log('have edited effect')
          knex('attendance').where('id', a_id)
          .update({
              out_time: currentTime,
           }).then(o=>{
            console.log('have edited effect Done') 
            res.send("all ok have edited effect")
           }).catch(r=>{
            console.log(r)
            res.send("all ok with edited effect not work")
            })
          
         }

      }).catch(e=>{
        console.log('nexted query error')
        console.log('error==>',e)
        res.json({setJsonMessage:"nexted query error"})
      })
      
    }
    }).catch(err=>{
      console.log("error")
      res.json({setJsonMessage:"EEOR occurs"})
    })
}


exports.manualAttendance = (req,res)=>{

  const location = req.params.id
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();  
  
  knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
  FROM 
  (SELECT attendance.*, 1 AS mark
  FROM attendance
  WHERE created_at = '${yyyy}-${mm}-${dd}' AND device_location_id = ${location})sub 
  RIGHT JOIN rfid_users
  ON rfid_users.id = sub.rfid_users_id  
  WHERE rfid_users.active_status = 1 AND rfid_users.device_location_id =${location}
  ORDER BY rfid_users.user__id ASC`).then(result=>{
    console.log(result[0])
    res.json({
      result : result[0]
    })
  }).catch(err=>{
    res.json({
      err
    })
  })
}


exports.storeManualAttendance = (req,res)=>{
  const device_location = req.params.id
  const body= req.body
  const bodyArray = body.map(pId => Object.values(pId));
  console.log(bodyArray)
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const currentDate = `${yyyy}-${mm}-${dd}`

  knex.select('attendance.id AS id')
  .from('attendance')
  .where('created_at',currentDate)
  .where('device_location_id',device_location)
  .then(id=>{    
    if(id.length == 0){
      knex.batchInsert('attendance', body)
      .then(oo=>{
        res.send("have no delete effect with batch insert done")
      })
      .catch(ecr=>{
        res.send(ecr)
      })
    }
    else{     
      let array = id.map(pId => Object.values(pId));
      console.log('get array id==>',array)     
      knex('attendance')
      .whereIn('attendance.id', array)
      .del()
      .then(de=>{
        knex.batchInsert('attendance', body)
        .then(oo=>{
          res.send("have delete effect with batch insert done")
        })
        .catch(ecr=>{
          res.send(ecr)
        })
        
      })
      .catch(e=>{
        res.send(e)
      })
      
    }
  })
  .catch(e=>{
    res.send(e)
  })
  
}

exports.attendanceReportUsingSingleDate = (req,res)=>{
  
  const location = req.body.device_location_id
  const date = req.body.date
  console.log(location,date)
    
  
  knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
  FROM 
  (SELECT attendance.*, 1 AS mark
  FROM attendance
  WHERE created_at = '${date}' AND device_location_id = ${location})sub 
  RIGHT JOIN rfid_users
  ON rfid_users.id = sub.rfid_users_id  
  WHERE rfid_users.active_status = 1 AND rfid_users.device_location_id =${location}
  ORDER BY rfid_users.user__id ASC`).then(result=>{
    console.log(result[0])
    res.json({
      result : result[0]
    })
  }).catch(err=>{
    res.json({
      err
    })
  })
}

exports.attendanceReportUsingMonth = (req,res)=>{
  
  const location = req.body.device_location_id
  const month = req.body.month
  console.log(location,month)
    
  
  knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
  FROM 
  (SELECT attendance.*, 1 AS mark
  FROM attendance
  WHERE month_name = '${month}' AND device_location_id = ${location})sub 
  RIGHT JOIN rfid_users
  ON rfid_users.id = sub.rfid_users_id  
  WHERE rfid_users.active_status = 1 AND rfid_users.device_location_id =${location}
  ORDER BY rfid_users.user__id ASC`).then(result=>{
    console.log(result[0])
    res.json({
      result : result[0]
    })
  }).catch(err=>{
    res.json({
      err
    })
  })
}

exports.attendanceReportUsingDateRange = (req,res)=>{
  
  const location = req.body.device_location_id
  const start = req.body.start
  const end = req.body.end
  console.log(location,start,end)
    
  
  knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
  FROM 
  (SELECT attendance.*, 1 AS mark
  FROM attendance
  WHERE created_at >= '${start}' AND created_at <= '${end}' AND device_location_id = ${location})sub 
  RIGHT JOIN rfid_users
  ON rfid_users.id = sub.rfid_users_id  
  WHERE rfid_users.active_status = 1 AND rfid_users.device_location_id =${location}
  ORDER BY rfid_users.user__id ASC`).then(result=>{
    console.log(result[0])
    res.json({
      result : result[0]
    })
  }).catch(err=>{
    res.json({
      err
    })
  })
}

exports.attendanceReportUsingWeek = (req,res)=>{
  
  const location = req.body.device_location_id
  var days =7; // Days you want to subtract
  var date = new Date();
  var last = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
  var day =last.getDate();
  var month=last.getMonth()+1;
  var year=last.getFullYear();
  const weekDate= `${year}-${month}-${day}`

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const currentDate = `${yyyy}-${mm}-${dd}`
  console.log(location,currentDate,weekDate)
    
  
  knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
  FROM 
  (SELECT attendance.*, 1 AS mark
  FROM attendance
  WHERE created_at >= '${weekDate}' AND created_at <= '${currentDate}' AND device_location_id = ${location})sub 
  RIGHT JOIN rfid_users
  ON rfid_users.id = sub.rfid_users_id  
  WHERE rfid_users.active_status = 1 AND rfid_users.device_location_id =${location}
  ORDER BY rfid_users.user__id ASC`).then(result=>{
    console.log(result[0])
    res.json({
      result : result[0]
    })
  }).catch(err=>{
    res.json({
      err
    })
  })
}

exports.attendanceReportUsingUsers = (req,res)=>{
  const location = req.body.device_location_id
  const user = req.body.rfid_user_id
  const start = req.body.start
  const end = req.body.end
  console.log(location,start,end)
    
  
  knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at,sub.out_time AS outTime
  FROM 
  (SELECT attendance.*, 1 AS mark
  FROM attendance
  WHERE created_at >= '${start}' AND created_at <= '${end}' AND rfid_users_id = ${user} AND device_location_id = ${location})sub 
  INNER JOIN rfid_users
  ON rfid_users.id = sub.rfid_users_id  
  WHERE rfid_users.active_status = 1 AND rfid_users.device_location_id =${location}
  ORDER BY rfid_users.user__id ASC`).then(result=>{
    console.log(result[0])
    res.json({
      result : result[0]
    })
  }).catch(err=>{
    res.json({
      err
    })
  })
}
