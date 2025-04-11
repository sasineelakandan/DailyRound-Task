import { Request } from "express";
import { IUserController } from "../interface/controllers/userController.interface";
import { ControllerResponse } from "../interface/controllers/userController.types";
import { IUserService } from "../interface/services/userService.interface";
import { CustomRequest } from "../middlewares/validators/jwt/authentication";
export class UserController implements IUserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  userSignup = async (httpRequest: Request): Promise<ControllerResponse> => {
    try {
      const { username, email, phone, password, age, address, gender } =
        httpRequest.body;

      const user = await this.userService.userSignup({
        username,
        email,
        phone,
        password,
        age,
        address,
        gender,
      });
      const { accessToken, refreshToken } = user;

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201,
        body: user,
        accessToken,
        refreshToken,
      };
    } catch (e: any) {
      console.log(e);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: e.statusCode || 500,
        body: {
          error: e.message,
        },
      };
    }
  };

  userLogin = async (httpRequest: Request): Promise<ControllerResponse> => {
    try {
      const { email, password } = httpRequest.body;

      const user = await this.userService.userLogin(email, password);
      const { accessToken, refreshToken } = user;

      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 200,
        body: user,
        accessToken,
        refreshToken,
      };
    } catch (e: any) {
      console.log(e);
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: e.statusCode || 500,
        body: {
          error: e.message,
        },
      };
    }
  };
  userProfile = async (httpRequest: CustomRequest): Promise<ControllerResponse> => {
    try {
      console.log(httpRequest)
      const userId = httpRequest?.user?.id;
      console.log(userId)
    
      if (!userId) {
        console.error('User ID not found');
        throw new Error('User ID is required to fetch the profile.');
      }
  
      
      const user = await this.userService.userProfile( userId);
      
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 201, 
        body: { ...user },
      };
    } catch (error: any) {
      console.error('Error in userProfile:', error.message);
  
      
      return {
        headers: {
          "Content-Type": "application/json",
        },
        statusCode: 500, 
        body: { error: error.message || 'An unknown error occurred.' },
      };
    }
  }
  
  updateProfilepic = async (httpRequest: CustomRequest): Promise<ControllerResponse> => {
    try {
      // Check if the file is provided
      if (!httpRequest.file) {
        return {
          headers: { "Content-Type": "application/json" },
          statusCode: 400, // Bad Request
          body: { error: "Profile picture is required." },
        };
      }
  
      // Extract user ID
      const userId = httpRequest?.user?.id;
      if (!userId) {
        throw new Error("User ID is missing.");
      }
      
      // Construct the correct file path
      const filePath:any = httpRequest.file.path // Use filename instead of originalname
  
      console.log(`Updating profile picture for user: ${userId}, File Path: ${filePath}`);
  
      // Call the service method to update the profile picture in the database
      const updatedProfile = await this.userService.updateProfilePic(userId, filePath);
  
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 201, // Created
        body: {
          message: "Profile picture updated successfully.",
          filePath, // Return file path for reference
          updatedProfile, // Optional: Return updated user data
        },
      };
    } catch (error: any) {
      console.error("Error in updateProfilePic:", error.message);
  
      return {
        headers: { "Content-Type": "application/json" },
        statusCode: 500, // Internal Server Error
        body: { error: error.message || "An unknown error occurred." },
      };
    }
  };;
  
}
