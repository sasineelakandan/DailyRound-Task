import { Request } from "express";
import { ControllerResponse } from "./userController.types";

export interface IUserController {
  userSignup(httpRequest: Request): Promise<ControllerResponse>;
  userProfile(httpRequest:Request):Promise<ControllerResponse>
  updateProfilepic(httpRequest:Request):Promise<ControllerResponse>
  
}
