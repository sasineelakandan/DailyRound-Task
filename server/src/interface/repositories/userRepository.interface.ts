import { AddUserInput, AddUserOuput, GetUserOutput ,GetuserProfileOutput,SuccessResponse,PostDatas, CommentDatas} from "./userRepository.types";

export interface IUserRepository {
  addUser(userData: AddUserInput): Promise<AddUserOuput>;
  getUserByEmail(email: string) : Promise<GetUserOutput>;
  userProfile(userId:string):Promise<GetuserProfileOutput>
  updateProfilePic(userId:string,profilePic:string):Promise<SuccessResponse>
  
  
}
