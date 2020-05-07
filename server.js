const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 5000;
const logger = require('morgan');
const attendanceController = require('./api/Controllers/attendanceController');
const branchAttendanceController = require('./api/Controllers/branchAttendanceController');
const organizationController = require('./api/Controllers/organizationController');
const branchController = require('./api/Controllers/branchController');
const deviceLocationController = require('./api/Controllers/deviceLocationController');
const deviceNameController = require('./api/Controllers/deviceNameController');
const userTypeController = require('./api/Controllers/uerTypeController');
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(logger("dev"));

//===================Api Starts=====================//



//============Store Attendance Route Start==========//
app.route('/api-attendances').post(attendanceController.storeApiAttendance);  // from weebhook api
app.route('/manualAttendance/:id').get(attendanceController.manualAttendance); // get for manual attendance
app.route('/manualAttendance/:id').post(attendanceController.storeManualAttendance);
//============Store Attendance Route End==========//



//============Attendance Report Route Start (Device Basis)==========//
app.route('/dateReport').post(attendanceController.attendanceReportUsingSingleDate);  // single date based
app.route('/monthReport').post(attendanceController.attendanceReportUsingMonth);  // monthly based
app.route('/dateRangeReport').post(attendanceController.attendanceReportUsingDateRange);  // date-range based
app.route('/weekReport').post(attendanceController.attendanceReportUsingWeek);  // weekly based
app.route('/userReport').post(attendanceController.attendanceReportUsingUsers);  // rfid-user based
//============Attendance Report Route End==========//




//============Attendance Report Route Start (Branch Basis)==========//
app.route('/dateReport/branch').post(branchAttendanceController.attendanceReportUsingSingleDate);  // single date based
app.route('/monthReport/branch').post(branchAttendanceController.attendanceReportUsingMonth);  // monthly based
app.route('/dateRangeReport/branch').post(branchAttendanceController.attendanceReportUsingDateRange);  // date-range based
app.route('/weekReport/branch').get(branchAttendanceController.attendanceReportUsingWeek);  // weekly based
app.route('/userReport/branch').post(branchAttendanceController.attendanceReportUsingUsers);  // rfid-user based
//============Attendance Report Route End==========//




//============Configuration Route Start(Organization) ==========//
app.route('/createOrg').post(organizationController.create);  
app.route('/getOrg').get(organizationController.get);  
app.route('/getOrgById/:id').get(organizationController.singleGetById);  
app.route('/deleteOrg/:id').delete(organizationController.delete);  
app.route('/editOrg/:id').put(organizationController.edit);  
//============Configuration Route Route End==========//




// ============Configuration Route Start(Branch) ==========//
app.route('/createBranch').post(branchController.create);  
app.route('/getBranch').get(branchController.get);  
app.route('/getBranchById/:id').get(branchController.singleGetById);  
app.route('/getBranchByOrg/:id').get(branchController.GetByOrgId);  
app.route('/deleteBranch/:id').delete(branchController.delete);  
app.route('/editBranch/:id').put(branchController.edit);  
// ============Configuration Route Route End==========//




//============Configuration Route Start(Device Location) ==========//
app.route('/createLocation').post(deviceLocationController.create);  
app.route('/getLocation').get(deviceLocationController.get);  
app.route('/getLocationById/:id').get(deviceLocationController.singleGetById);  
app.route('/getLocationByBranch/:id').get(deviceLocationController.GetByBranchId);  
app.route('/deleteLocation/:id').delete(deviceLocationController.delete); 
app.route('/editLocation/:id').put(deviceLocationController.edit);  
//============Configuration Route Route End==========//





//============Configuration Route Start(Device Name) ==========//
app.route('/createDevice').post(deviceNameController.create);  
app.route('/getDevice').get(deviceNameController.get);  
app.route('/getDeviceById/:id').get(deviceNameController.singleGetById);  
app.route('/deleteDevice/:id').delete(deviceNameController.delete);  
app.route('/editDevice/:id').put(deviceNameController.edit);  
//============Configuration Route Route End==========//



//============Configuration Route Start(User Type) ==========//
app.route('/createType').post(userTypeController.create);  
app.route('/getType').get(userTypeController.get);  
app.route('/getTypeById/:id').get(userTypeController.singleGetById);  
app.route('/deleteType/:id').delete(userTypeController.delete);  
app.route('/editType/:id').put(userTypeController.edit);  
//============Configuration Route Route End==========//




//====================Api Ends==================//



app.get("/", (req, res) => {
    res.json({
      key: "I am value"
    });
});


app.listen(port, function() {
    console.log("Server listening on port: ", port);
  })