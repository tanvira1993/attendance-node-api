const knex = require("../../customConfig");
const bcrypt = require("bcrypt");
const randtoken = require("rand-token");

exports.create = (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const org = req.body.org_id;
  const userRole = req.body.role;
  const branch = req.body.branch;
  const device_location = req.body.device_location_id;
  const saltRounds = 10;

  bcrypt
    .hash(password, saltRounds)
    .then(function (hash) {
      // Store hash in your password DB.
      console.log("hash pass==>", hash);

      knex("users")
        .insert([
          {
            name: name,
            organization_id: org,
            branch_id: branch,
            email: email,
            password: hash,
            user_role: userRole,
            device_location_id: device_location,
          },
        ])
        .then((r) => {
          res.send(r);
        })
        .catch((e) => {
          res.send(e);
        });
    })
    .catch((err) => {
      console.log("hash pass err==>", err);
      res.send(err);
    });
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  knex
    .select("users.password AS pass", "users.id AS uid")
    .from("users")
    .where("email", email)
    .then((r) => {
      if (r.length == 0) {
        console.log("eee");
        res.send("User Not Found");
      } else {
        bcrypt.compare(password, r[0].pass).then(function (result) {
          if (result == true) {
            const token = randtoken.generate(16);
            knex("users")
              .where("id", r[0].uid)
              .update({
                token: token,
              })
              .then((rr) => {
                knex
                  .select()
                  .from("users")
                  .where("id", r[0].uid)
                  .then((rrrr) => {
                    res.send(rrrr);
                  })
                  .catch((er) => {
                    res.send(er);
                  });
              })
              .catch((ee) => {
                res.send(ee);
              });
          } else {
            res.send("password did not matched");
          }
        });
      }
    })
    .catch((e) => {
      res.send(e);
    });
};

exports.tokenCheck = (req, res) => {
  const token = req.body.token;
  const id = req.body.id;

  knex
    .select()
    .from("users")
    .where("id", id)
    .then((r) => {
      if (r[0].token === token) {
        res.send(true);
      } else {
        res.send(false);
      }
    })
    .catch((er) => {
      res.send(er);
    });
};
