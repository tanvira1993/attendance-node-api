const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 5000;
const logger = require('morgan');
const multer = require('multer');

const attendanceController = require('./api/Controllers/attendanceController');
const branchAttendanceController = require('./api/Controllers/branchAttendanceController');
const organizationController = require('./api/Controllers/organizationController');
const branchController = require('./api/Controllers/branchController');
const deviceLocationController = require('./api/Controllers/deviceLocationController');
const deviceNameController = require('./api/Controllers/deviceNameController');
const userTypeController = require('./api/Controllers/uerTypeController');
const rfidUserController = require('./api/Controllers/rfidUserController');
const adminController = require('./api/Controllers/AdminController');
const dashBoardController = require('./api/Controllers/DashBoardController')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(logger("dev"));


//===================Excel to DB START====================//
global.__basedir = __dirname;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
     cb(null, __basedir + '/uploads/')
  },
  filename: (req, file, cb) => {
     cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
  }
});

const upload = multer({storage: storage});

app.post('/createMassRUser', upload.single("uploadfile"), (req, res) =>{

  rfidUserController.importExcelData2MySQL(__basedir + '/uploads/' + req.file.filename);
  res.json({
        'msg': 'File uploaded/import successfully!', 'file': req.file
      });
});
//===================Excel to DB END====================//




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





//============Configuration Route Start(RFID-User) ==========//
app.route('/gtExcelForUpload').post(rfidUserController.getForMass);  
app.route('/createRUser').post(rfidUserController.create);  
// app.route('/getRUsers').get(rfidUserController.get);  
// app.route('/getRUsersById/:id').get(rfidUserController.singleGetById);
// app.route('/getRUsersByBranch/:id').get(rfidUserController.GetByBranchId);  
app.route('/getRUsersByDeviceLocation/:id').get(rfidUserController.GetByDeviceLocationId);  
app.route('/deleteRUser/:id').delete(rfidUserController.delete);
app.route('/createFinger').post(rfidUserController.createFinger);  
app.route('/getFingersById').post(rfidUserController.getFingers);  
// app.route('/editRUser/:id').put(rfidUserController.edit);  
//============Configuration Route Route End==========//



//============Configuration Route Start(Admin-User) ==========//
app.route('/createUser').post(adminController.create);  
app.route('/login').post(adminController.login);
app.route('/tokenValidate').post(adminController.tokenCheck);    
app.route('/changePassword').post(adminController.changePassword);  
// app.route('/resetPassword').post(adminController.resetPassword);  
// app.route('/getUsers').get(adminController.get);  
// app.route('/getUsersById/:id').get(adminController.singleGetById);
// app.route('/getUsersByBranch/:id').get(adminController.GetByBranchId);  
// app.route('/getUsersByDeviceLocation/:id').get(adminController.GetByDeviceLocationId);  
// app.route('/deleteUser/:id').delete(adminController.delete);  
// app.route('/editRUser/:id').put(adminController.edit);  
//============Configuration Route Route End==========//


//============Configuration Route Start(Time-Limit) ==========// 
// app.route('/SetTime').post(adminController.resetPassword);  
// app.route('/editTime/:id').put(adminController.get);  
// app.route('/getAllTimeByBranch').get(adminController.singleGetById);
// app.route('/getSingleTimeByDeviceLocation/:id').get(adminController.GetByBranchId);  
// app.route('/deleteTime/:id').delete(adminController.delete);  
//============Configuration Route Route End==========//


//============ Route Start(Dashboard-Report) ==========//
app.route('/getallRfidUsersByDeviceLocation').get(dashBoardController.getallUsers);  
// app.route('/getallRfidUsersByBranch').get(adminController.singleGetById);
app.route('/getPresentRfidUsersByDeviceLocation').get(dashBoardController.getPresentByDeviceLocationId);  
// app.route('/getPresentRfidUsersByBranch').get(adminController.GetByDeviceLocationId); 
app.route('/presentMonthRatioByDeviceLocation').get(dashBoardController.getMonthReportByDeviceLocationId); 
// app.route('/getAbsentRfidUsersByBranch').get(adminController.GetByDeviceLocationId); 
// app.route('/getIntimeByDeviceLocation').get(adminController.GetByDeviceLocationId); 
// app.route('/getIntimeByBranch').get(adminController.GetByDeviceLocationId); 
//============ Route Route End==========//


//====================Api Ends==================//



app.get("/", (req, res) => {
    res.json({
      key: "I am value"
    });
});


app.listen(port, function() {
    console.log("Server listening on port: ", port);
  })