const TokenModel = require("../model/tokenModel");
const UserModel = require("../model/user");

class UserRepo {
  async getUsers() {
    try {
      const user = await UserModel.find();
      return user;
    } catch (error) {
      console.log(error)
    }
  }
  async findUser(params) {
    try {
      const user = await UserModel.findOne(params);
      return user;
    } catch (error) {
      console.log(error);
    }
  }
  async findUserById(id) {
    try {
      const user = await UserModel.findById(id);
      return user;
    } catch (error) {
      console.log(error)
    }
  }
  async editUser(id,params) {
    try {
      const user = await UserModel.findByIdAndUpdate(id, params, {
        new: true,
      });
      return user;
    } catch (error) {
      console.log(error)
    }
  }
  async updatePass(id,params) {
    try {
      const user = await UserModel.findByIdAndUpdate(id, params);
      return user;
    } catch (error) {
      console.log(error)
    }
  }

  async getToken(params) {
    try {
      const token = await TokenModel.findOne(params);
      return token
    } catch (error) {
      console.log(error);
    }
    }
    

}
const userRepo = new UserRepo();
module.exports = userRepo;