"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ensureAuthenticated_1 = __importDefault(require("@modules/users/infra/http/middlewares/ensureAuthenticated"));
var AppointmentsController_1 = __importDefault(require("../controllers/AppointmentsController"));
var appointmentsRouter = express_1.Router();
appointmentsRouter.use(ensureAuthenticated_1.default);
/* appointmentsRouter.get("/", async (req, res) => {
  const { id: provider_id } = req.user;

  const appointments = await appointmentsRepository.find({
    where: { provider_id },
  });

  return res.json(appointments);
}); */
appointmentsRouter.post("/", AppointmentsController_1.default.create);
exports.default = appointmentsRouter;
