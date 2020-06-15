const knex = require("../../customConfig");
const fs = require("fs");
const readXlsxFile = require("read-excel-file/node");
const excel = require("exceljs");

exports.importExcelData2MySQL = (filePath) => {
  // File path.
  readXlsxFile(filePath).then((rows) => {
    // `rows` is an array of rows
    // each row being an array of cells.
    console.log(rows);

    // Remove Header ROW
    rows.shift();
    console.log("converted", rows);

    const objs = rows.map(function (x) {
      return {
        user_type_id: x[0],
        organization_id: x[1],
        branch_id: x[2],
        rfid_no: x[3],
        user__id: x[4],
        fingerprint_no: x[5],
        rfid_user_name: x[6],
        desc: x[7],
        active_status: x[8],
        mobile: x[9],
        device_location_id: x[10],
        device_id: x[11],
      };
    });
    console.log("objr==>", objs);

    fs.unlinkSync(filePath);

    knex
      .batchInsert("rfid_users", objs)
      .then((oo) => {
        console.log("db updated");
      })
      .catch((ecr) => {
        console.log(ecr);
      });
  });
};

exports.getForMass = (req, res) => {
    console.log('hello=>',req.body)
  const device_location = req.body.device_location_id;
  const user = req.body.user_type_id;
  const org = req.headers.organization_id;
  const branch = req.headers.branch_id;
  const active = 1;

  const row = [
    { user: user, org: org, branch: branch, device_location: device_location, active:active, blank:''},
  ];

  let workbook = new excel.Workbook();
  let worksheet = workbook.addWorksheet("Rfid-users");

  worksheet.columns = [
    { header: "User_Type", key: 'user', width: 10 },
    { header: "Organization", key: 'org', width: 15 },
    { header: "Branch", key: 'branch', width: 10 },
    { header: "Device", key: 'device_location', width: 10 },
    { header: "Status", key: 'active', width: 10 },
    { header: "FingerPrint-Number", key: 'blank', width: 22 },
    { header: "RFID-Number", key: 'blank', width: 20 },
    { header: "Name", key: 'blank', width: 30 },
    { header: "Employee-ID/Roll-No", key: 'blank', width: 22 },
    { header: "Mobile", key: 'blank', width: 25, outlineLevel: 1 },
  ];

  // Add Array Rows
  worksheet.addRows(row);

  workbook.xlsx
    .writeFile("rfid_user.xlsx")
    .then((re) => {
      console.log("file saved!");
      console.log('dir=>',__dirname,global.__basedir)
      const file = global.__basedir + '/rfid_user.xlsx';
      res.download(file);
    //   res.send(re);
    })
    .catch((err) => {
      console.log("file error");
      res.send(err);
    });
};

exports.create = (req,res) =>{
    const user_type = req.body.user_type
    const branch = req.headers.branch_id
    const org = req.headers.organization_id
    const rfid_no = req.body.rfid_no
    const user_id = req.body.roll
    const fingerprint_no = req.body.fingerprint
    const name = req.body.name
    const desc = req.body.desc
    const mobile = req.body.mobile
    const device_location = req.headers.device_location_id
    const status = req.body.status
    knex('rfid_users')
    .insert([{user_type_id: user_type,organization_id: org,branch_id: branch,rfid_no:rfid_no,user__id:user_id,fingerprint_no:fingerprint_no,rfid_user_name:name,desc:desc,active_status:status,mobile:mobile,device_location_id:device_location}])
    .then(r=>{
      res.send(r)
  })
  .catch(e=>{
      res.send(e)
  })
}


exports.GetByDeviceLocationId = (req,res)=>{
  const id = req.params.id
    knex.select()
    .from('rfid_users')    
    .where('rfid_users.device_location_id',id)
    .then(r=>{
        res.send(r)
    })
    .catch(e=>{
        res.send(e)
    })
}

exports.delete =(req,res)=>{
  const id = req.params.id
    knex('rfid_users')
    .where('id', id)
    .del()
    .then(r=>{
        res.send("200")
    })
    .catch(e=>{
        res.send(e)
    })
}


exports.createFinger=(req,res)=>{
  const name = req.headers.device_name
  const username = req.body.user_name
  const id = req.body.id
  const location = req.headers.device_location_id
  knex('finger_store')
  .insert([{name: name,finger_id: id,branch_id: branch,device_location_id:location, users_name:username}])
  .then(r=>{
    res.send(r)
})
.catch(e=>{
    res.send(e)
})
}

exports.getFingers=(req,res)=>{
  const id = req.headers.device_location_id
  knex.select()
  .from('finger_store')
  .where('device_location_id', id)
  .then(r=>{
      res.send(r)
  })
  .catch(e=>{
      res.send(e)
  })

}