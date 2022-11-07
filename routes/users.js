const express = require("express");
const router = express.Router();
const auth_middleware = require("../middlewares/auth_middleware");
const UsersController = require("../controllers/usersController");
const usersController = new UsersController();

router.post("/signup", usersController.SignupUser);
router.post("/login", usersController.LoginUser);
router.post("/checkId", usersController.checkId);
router.post("/checkNick", usersController.checkNick);
router.post("/checkPhone", usersController.checkPhone);
router.get("/me", auth_middleware, usersController.getUser);
router.patch("/me", auth_middleware, usersController.updateUser);
router.patch("/drop", auth_middleware, usersController.dropUser);
router.patch("/cancelDrop", auth_middleware, usersController.cancelDrop);


module.exports = router;
