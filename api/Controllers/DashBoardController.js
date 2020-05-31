const knex = require("../../customConfig");

exports.getallUsers = (req, res) => {
  const device_location_id = req.headers.device_location_id;
  knex
    .select()
    .from("rfid_users")
    .where("device_location_id", device_location_id)
    .then((r) => {
      console.log("data count", r.length);
      const count = r.length;
      res.json({
        count,
      });
    })
    .catch((e) => {
      res.send(e);
    });
};

exports.getPresentByDeviceLocationId = (req, res) => {
  const location = req.headers.device_location_id;
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const currentDate = `${yyyy}-${mm}-${dd}`;
  console.log(currentDate);
  knex
    .raw(
      `SELECT rfid_users.*,sub.in_time AS inTime,sub.mark AS mark,sub.comment,sub.month_name,sub.created_at
   FROM 
   (SELECT attendance.*, 1 AS mark
   FROM attendance
   WHERE created_at = '${yyyy}-${mm}-${dd}' AND device_location_id = ${location})sub 
   INNER JOIN rfid_users
   ON rfid_users.id = sub.rfid_users_id  
   WHERE rfid_users.active_status = 1 AND rfid_users.device_location_id =${location}
   ORDER BY rfid_users.user__id ASC`
    )
    .then((result) => {
      console.log("present", result[0].length);
      res.json({
        result: result[0].length,
      });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
};

exports.getMonthReportByDeviceLocationId = async (req, res) => {
    const location = req.headers.device_location_id;

  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();
  const currentDate = `${yyyy}-${mm}-${dd}`;
  console.log(currentDate);
  const date = dashboardDateManage(5, currentDate);
  console.log("date mange==>", date);
  let p1 = [];
  let p2 = [];
  let p3 = [];
  let p4 = [];
  let p5 = [];
  let p6 = [];
  knex
    .select('id')
    .from("attendance")
    .where("device_location_id", location)
    .where("created_at", date[0])
    .then((e) => {
      p1.push(e);
      knex
        .select()
        .from("attendance")
        .where("device_location_id", location)
        .where("created_at", date[1])
        .then((e) => {
          p2.push(e);

          knex
            .select()
            .from("attendance")
            .where("device_location_id", location)
            .where("created_at", date[2])
            .then((e) => {
              p3.push(e);
              knex
                .select()
                .from("attendance")
                .where("device_location_id", location)
                .where("created_at", date[3])
                .then((e) => {
                  p4.push(e);
                  knex
                    .select()
                    .from("attendance")
                    .where("device_location_id", location)
                    .where("created_at", date[4])
                    .then((e) => {
                      p5.push(e);
                      knex
                        .select()
                        .from("attendance")
                        .where("device_location_id", location)
                        .where("created_at", date[5])
                        .then((e) => {
                          p6.push(e);
                          res.json({
                              date : p1[0].length,                              
                              date1 : p2[0].length,
                              date2 : p3[0].length,
                              date3 : p4[0].length,
                              date4 : p5[0].length,
                              date5 : p6[0].length,
                          })
                        });
                    });
                });
            });
        });
    });
};

dashboardDateManage = (days, value) => {
  var aryDates = [];

  for (let i = 0; i <= days; i++) {
    const date = new Date(value);
    let last = new Date(date.getTime() - days * 24 * 60 * 60 * 1000);

    last.setDate(last.getDate() + i);
    aryDates.push(
      last.getFullYear() +
        "-" +
        String(last.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(last.getDate()).padStart(2, "0")
    );
  }
  return aryDates;
};
