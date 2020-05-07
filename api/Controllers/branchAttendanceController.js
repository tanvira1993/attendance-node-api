const  knex  = require('../../customConfig')


exports.attendanceReportUsingSingleDate = (req,res)=>{
    const branch = req.headers.branch_id
    const org = req.headers.organization_id
    const date = req.body.date
      
    
    knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
    FROM 
    (SELECT attendance.*, 1 AS mark
    FROM attendance
    WHERE created_at = '${date}' AND organization_id = ${org} AND branch_id = ${branch})sub 
    RIGHT JOIN rfid_users
    ON rfid_users.id = sub.rfid_users_id  
    WHERE rfid_users.active_status = 1 AND rfid_users.organization_id=${org} AND rfid_users.branch_id=${branch}
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
    
    const branch = req.headers.branch_id
    const org = req.headers.organization_id
    const month = req.body.month
      
    
    knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
    FROM 
    (SELECT attendance.*, 1 AS mark
    FROM attendance
    WHERE month_name = '${month}' AND organization_id = ${org} AND branch_id = ${branch})sub 
    RIGHT JOIN rfid_users
    ON rfid_users.id = sub.rfid_users_id  
    WHERE rfid_users.active_status = 1 AND rfid_users.organization_id=${org} AND rfid_users.branch_id=${branch}
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
    const branch = req.headers.branch_id
    const org = req.headers.organization_id
    const start = req.body.start
    const end = req.body.end
      
    
    knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
    FROM 
    (SELECT attendance.*, 1 AS mark
    FROM attendance
    WHERE created_at >= '${start}' AND created_at <= '${end}' AND organization_id = ${org} AND branch_id = ${branch})sub 
    RIGHT JOIN rfid_users
    ON rfid_users.id = sub.rfid_users_id  
    WHERE rfid_users.active_status = 1 AND rfid_users.organization_id=${org} AND rfid_users.branch_id=${branch}
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
    const branch = req.headers.branch_id
    const org = req.headers.organization_id
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
      
    
    knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
    FROM 
    (SELECT attendance.*, 1 AS mark
    FROM attendance
    WHERE created_at >= '${weekDate}' AND created_at <= '${currentDate}' AND organization_id = ${org} AND branch_id = ${branch})sub 
    RIGHT JOIN rfid_users
    ON rfid_users.id = sub.rfid_users_id  
    WHERE rfid_users.active_status = 1 AND rfid_users.organization_id=${org} AND rfid_users.branch_id=${branch}
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
    const branch = req.headers.branch_id
    const org = req.headers.organization_id
    const user = req.body.rfid_user_id
    const start = req.body.start
    const end = req.body.end
    console.log(location,start,end)
      
    
    knex.raw(`SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
    FROM 
    (SELECT attendance.*, 1 AS mark
    FROM attendance
    WHERE created_at >= '${start}' AND created_at <= '${end}' AND rfid_users_id = ${user} AND organization_id = ${org} AND branch_id = ${branch})sub 
    INNER JOIN rfid_users
    ON rfid_users.id = sub.rfid_users_id  
    WHERE rfid_users.active_status = 1 AND rfid_users.organization_id=${org} AND rfid_users.branch_id=${branch}
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
