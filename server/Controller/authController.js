const authServices = require("../Services/authServices");

async function createUser(req, res) {
  let response = await authServices.createUser(req);
  res.json(response);
}
async function userLogin(req, res){
  let response = await authServices.userLogin(req);
  res.json(response);
}


module.exports = {
  createUser,
  userLogin,
};
