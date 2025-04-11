import { UserSignupInput, UserSignupOutput,UserProfileOutput,SuccessResponse} from "./userService.types";

export interface IUserService {
  userSignup(userData: UserSignupInput): Promise<UserSignupOutput>;
  userProfile(userId:string):Promise<UserProfileOutput>
  userLogin(email: string, password: string): Promise<UserSignupOutput>;
  updateProfilePic(userId:string,profilePic:string):Promise<SuccessResponse>
   
}
