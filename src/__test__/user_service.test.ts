import { UserDto } from "../main/dto/request/user";
import { createUserMappings } from "../main/mapper/user_mapper";
import { UserService } from "../main/service/user_service";
import { mapper } from "../main/mapper/mapper";
import { userRepository } from "../main/data/repository/user.repository";
import { User } from "../main/data/entity/user_model";
import { IdentityService } from "../main/service/identity_service";
import { hash } from "crypto";
import 'reflect-metadata';
import { otpGeneratorService } from "../main/service/otp_generator_service";
import { OtpService } from "../main/service/otp_service";
import { NodeMailerService } from "../main/service/node_mailer_service";
import { EmailService } from "../main/service/email_service";


jest.mock("../main/data/repository/user.repository")
jest.mock("../main/service/otp_generator_service");
jest.mock("../main/service/node_mailer_service");

describe("User service Test: ", () => {
    
    let userService : IdentityService;
    let generateOtpService : OtpService
    let emailService : EmailService;

    beforeAll(async() => {
        createUserMappings();
        userService = new UserService();
        generateOtpService = new otpGeneratorService();
        emailService = new NodeMailerService();

        (userService as any).otpService = generateOtpService;
        (userService as any).emailService = emailService;
    });


    describe("Test create user if the necessary element", () => {
        it("should throw an exception saying required data needed", async() =>{

            var userDto: UserDto = new UserDto();

            const responseErro =  {
                status: 'error',
                message: {
                  'first_name': 'First name is required',
                  'last_name': 'Last name is required',
                  'email' : 'Email is required'
                },statusCode: 400 }

            await expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseErro))
        });
    });

    describe("Test create user if the email is not valid", () => {
        it("Should throw invalid email ", async() => {
            var userDto: UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "wrongEmail";

            const responseError = {
                status: 'error',
                message: {
                  'email' : 'Email must be a valid email address.'
                },statusCode: 400
            }

            await expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        });
    });


    describe("Test create user if the both lastname is not given ", () => {
        it("Should throw last name required ", async() => {
            var userDto: UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.email = "ojot630@gmail.com";

            const responseError = {
                status: 'error',
                message: {
                  'last_name' : 'Last name is required'
                },statusCode: 400
            }

            await expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        });
    });


    describe("Test create user if the lastname is empty ", () => {
        it("Should throw exception ", async() => {

            var userDto: UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "";
            userDto.email = "ojot630@gmail.com";

            const responseError = {
                status: 'error',
                message: {
                  'last_name' : 'Last name is required'
                },statusCode: 400
            }

            await expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        });
    });

    describe("Test create user with invalid phone number ", () => {
        it("Should throw an error that phone number does not match ", async() => {
            var userDto: UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "ojot630@gmail.com";
            userDto.phone_number = "12345678901234567890";


            const responseError = {
                status: 'error',
                message: {
                  'phone_number' : 'Phone number must be a valid phone number.'
                },statusCode: 400
            }

            await expect(userService.createUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        });
    });

    describe("Test create user with valid data ", () => {
        it("Should create the user called user repository to create", async() =>{
            var userDto: UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "ojot630@gmail.com";
        
            var user: User = mapper.map(userDto, UserDto, User);
            user.id = "1";
            user.created_at = new Date();
            user.updated_at = new Date();
            user.is_active = true;

            (userRepository.save as jest.Mock).mockResolvedValueOnce(user);

            var result: UserDto = await userService.createUser(userDto);
            expect(result).not.toBeNull();
            expect(result.id).toBeTruthy();
            expect(result.email).toBe(userDto.email);
            expect(result.first_name).toBe(userDto.first_name);
            expect(result.last_name).toBe(userDto.last_name);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
        });
    });


    describe("Test create user with an existing user email should ", () => {
        it("Should throw an error that user already exist ", async() => {
            var userDto: UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "ojot630@gmail.com";
            

            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(true);
            
            await expect(userService.createUser(userDto)).rejects.toThrow("User already exist");
            expect(userRepository.existsBy).toHaveBeenCalledTimes(1);
            expect(userRepository.existsBy).toHaveBeenCalledWith({ email: userDto.email });
        });
    });

    describe("Test create password with an invalid data like id and password should ", () => {
        it("Should throw an error that invalid data fields required ", async() => {
            var userDto : UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";

            const responseError = {
                status: 'error',
                message: {
                  'id' : 'id is required',
                  'password' : 'Password is required'
                },statusCode: 400
            }


            await expect(userService.createPassword(userDto)).rejects.toThrow(JSON.stringify(responseError));
        });
    });


    describe("Test create password with an the id exiting but password is not valid ", () => {
        it("Should throw an error that password is required ", async() => {
            var userDto : UserDto = new UserDto();
            userDto.id = "1";
            userDto.password = "ola"

            const responseError = {
                status: 'error',
                message: {
                  'password' : 'password is not strong enough'
                },statusCode: 400
            }

            await expect(userService.createPassword(userDto)).rejects.toThrow(JSON.stringify(responseError));
        });
    });

    describe("Test create password if the id given is not existing", () => {
        it("Should throw an error that user does not exist ", async() => {
            
            var userDto : UserDto = new UserDto();
            userDto.id = "1";
            userDto.password = "Ola@1234";

            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(false);

            await expect(userService.createPassword(userDto)).rejects.toThrow("User does not exist");
        
        });
    });


    describe("Test create password if the id given is existing and password is valid", () => {
        it("Should create the password ", async() => {
            var userDto : UserDto = new UserDto();
            userDto.id = "1";
            userDto.password = "Ola@1234";

            var exitingUser: User = mapper.map(userDto, UserDto, User);
            exitingUser.created_at = new Date();
            exitingUser.updated_at = new Date();
            exitingUser.is_active = true;


            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(true);
            exitingUser.password = hash("sha256", userDto.password);

            (userRepository.update as jest.Mock).mockResolvedValueOnce(exitingUser);

            (userRepository.findOne as jest.Mock).mockResolvedValueOnce(exitingUser);
            
            exitingUser.password = null;
            (userRepository.findOneBy as jest.Mock).mockResolvedValueOnce(exitingUser);

            var result: UserDto = await userService.createPassword(userDto);
            console.log("Result is this ", result);
            expect(result).not.toBeNull();
            expect(result.id).toBe(userDto.id);
            expect(result.first_name).toBe(exitingUser.first_name);
            expect(result.last_name).toBe(exitingUser.last_name);
            expect(result.email).toBe(exitingUser.email);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
            expect(result.password).not.toBe(userDto.password);
            expect(userRepository.existsBy).toHaveBeenCalledTimes(1);
            expect(userRepository.existsBy).toHaveBeenCalledWith({ id: userDto.id });
            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
            expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: userDto.id }  });
        });
    });


    describe("Test create password if the password already exist should ", () => {
        it("Should throw an error that password already exist ", async() => {

            var userDto : UserDto = new UserDto();
            userDto.id = "1";
            userDto.password = "Ola@1234";

            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(true);
            (userRepository.findOneBy as jest.Mock).mockResolvedValueOnce(userDto);

            await expect(userService.createPassword(userDto)).rejects.toThrow("Password already exist");
            expect(userRepository.existsBy).toHaveBeenCalledTimes(1);
            expect(userRepository.existsBy).toHaveBeenCalledWith({ id: userDto.id });
            expect(userRepository.findOneBy).toHaveBeenCalledTimes(1);
            expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userDto.id });
        });
    }); 

    describe("Test update user if the id is not given", () => {
        it("Should throw an error that id is required ", async() => {

            var userDto : UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";

            const responseError = {
                status: 'error',
                message: {
                  'id' : 'id is required'
                },statusCode: 400
            }

            await expect(userService.updateUser(userDto)).rejects.toThrow(JSON.stringify(responseError));
        });
    });

    describe("Test update user if the id is not existing ", () => {
        it("Should throw an error that user does not exist ", async() => {
            var userDto : UserDto = new UserDto();
            userDto.id = "1";
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";

            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(false);

            await expect(userService.updateUser(userDto)).rejects.toThrow("User does not exist");
        });
    });

    describe("Test update user if the id is existing and the data is valid", () => {
        it("Should update the user ", async() => {
            var userDto : UserDto = new UserDto();
            userDto.id = "1";
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";

            var exitingUser: User = mapper.map(userDto, UserDto, User);
            exitingUser.created_at = new Date();
            exitingUser.updated_at = new Date();
            exitingUser.is_active = true;

            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(true);
            (userRepository.update as jest.Mock).mockResolvedValueOnce(exitingUser);

            (userRepository.findOne as jest.Mock).mockResolvedValueOnce(exitingUser);

            var result: UserDto = await userService.updateUser(userDto);
            expect(result).not.toBeNull();
            expect(result.id).toBe(userDto.id);
            expect(result.first_name).toBe(userDto.first_name);
            expect(result.last_name).toBe(userDto.last_name);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
        });
    });


    describe("Test get all users if we create two users ", () => {
        it("Should get all the users ", async() => {
            var userDto: UserDto = new UserDto();
            userDto.first_name = "oluwatobi";
            userDto.last_name = "ojo";
            userDto.email = "ojot630@gmail.com";
        
            var user: User = mapper.map(userDto, UserDto, User);
            user.id = "1";
            user.created_at = new Date();
            user.updated_at = new Date();
            user.is_active = true;

            (userRepository.save as jest.Mock).mockResolvedValueOnce(user);

            var result: UserDto = await userService.createUser(userDto);
            expect(result).not.toBeNull();
            expect(result.id).toBeTruthy();
            expect(result.email).toBe(userDto.email);
            expect(result.first_name).toBe(userDto.first_name);
            expect(result.last_name).toBe(userDto.last_name);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();


            var userDto2: UserDto = new UserDto();
            userDto2.first_name = "oluwatobi";
            userDto2.last_name = "ojo";
            userDto2.email = "ojot631@gmail.com";
        
            var user2: User = mapper.map(userDto2, UserDto, User);
            user2.id = "1";
            user2.created_at = new Date();
            user2.updated_at = new Date();
            user2.is_active = true;

            (userRepository.save as jest.Mock).mockResolvedValueOnce(user2);

            var newResult: UserDto = await userService.createUser(userDto2);
            expect(newResult).not.toBeNull();
            expect(newResult.id).toBeTruthy();
            expect(newResult.email).toBe(userDto2.email);
            expect(newResult.first_name).toBe(userDto2.first_name);
            expect(newResult.last_name).toBe(userDto2.last_name);
            expect(newResult.created_at).toBeTruthy();
            expect(newResult.updated_at).toBeTruthy();
            expect(newResult.is_active).toBeTruthy();
            

            const users: User[] = [user, user2];
            (userRepository.find as jest.Mock).mockResolvedValueOnce(users);

            var newUsers: UserDto[] = await userService.getAllUsers();

            expect(newUsers).not.toBeNull();
            expect(newUsers.length).toBe(2);
            expect(newUsers[0].id).toBe(user.id);
            expect(newUsers[0].email).toBe(user.email);
            expect(newUsers[0].first_name).toBe(user.first_name);
            expect(newUsers[1].id).toBe(user2.id);
            expect(newUsers[1].email).toBe(user2.email);
            expect(newUsers[1].first_name).toBe(user2.first_name);
            expect(newUsers[0].created_at).toBeTruthy();
            expect(newUsers[0].updated_at).toBeTruthy();
            expect(newUsers[1].created_at).toBeTruthy();
            expect(newUsers[1].updated_at).toBeTruthy();
            expect(newUsers[0].is_active).toBeTruthy();
            expect(newUsers[1].is_active).toBeTruthy();
            expect(userRepository.find).toHaveBeenCalledTimes(1);
        });
    });


    describe("Test get user by id if the id is not given ", () => {
        it("Should throw an error that id is required ", async() => {
            await expect(userService.getUserById("")).rejects.toThrow("id is required");
        });
    });


    describe("Test get user by id if the id is not existing ", () => {
        it("Should throw an error that user does not exist ", async() => {
            (userRepository.findOne as jest.Mock).mockResolvedValueOnce(null);
            await expect(userService.getUserById("1")).rejects.toThrow("User does not exist");
        });
    });

    describe("Test get user by id if the id is existing ", () => {
        it("Should get the user ", async() => {
            var user: User = new User();
            user.created_at = new Date();
            user.updated_at = new Date();
            user.is_active = true;
            user.id = "1";
            user.password = "password";
            user.email = "newEMail";

            (userRepository.findOne as jest.Mock).mockResolvedValueOnce(user);

            var result: UserDto = await userService.getUserById(user.id);
            expect(result.id).toBe(user.id);
            expect(result.email).toBe(user.email);
            expect(result.created_at).toBeTruthy();
            expect(result.updated_at).toBeTruthy();
            expect(result.is_active).toBeTruthy();
            expect(result.password).toBe(user.password);
            expect(userRepository.findOne).toHaveBeenCalledTimes(1);
        });
    });


    describe("Test delete user if the id is not given ", () => {
        it("Should throw an error that id is required ", async() => {
            await expect(userService.deleteUser("")).rejects.toThrow("id is required");
        });
    });


    describe("Test that if the id to delete the user ", () => {
        it("Should delete the user ", async() => {
            var user: User = new User();
            user.created_at = new Date();
            user.updated_at = new Date();
            user.is_active = true;
            user.id = "1";
            user.password = "password";
            user.email = "newEMail";

            (userRepository.findOne as jest.Mock).mockResolvedValueOnce(user);

            await userService.deleteUser(user.id);
            
            user.is_active = false;
            expect(userRepository.update).toHaveBeenCalledTimes(1);
            expect(userRepository.update).toHaveBeenCalledWith({ id: user.id }, { is_active: false });
        });
    });

    describe("Test login if the request data needed for login is not given ", () => {
        it("Should throw an error that email and password is required ", async() => {
            var userDto: UserDto = new UserDto();

            const responseError = {
                status: 'error',
                message: {
                  'email' : 'Email is required',
                  'password' : 'Password is required'
                },statusCode: 400
            }

            await expect(userService.login(userDto)).rejects.toThrow(JSON.stringify(responseError));
        });
    });


    describe("Test login if the email does not exist ", () => {
        it("Should throw an error that user does not exist ", async() => {
            var userDto: UserDto = new UserDto();
            userDto.email = "olakunle@gmail.com";
            userDto.password = "Password123@";

            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(false);
            await expect(userService.login(userDto)).rejects.toThrow("User does not exist");
        });
    });

    describe("Test login if it was the first time trying to login", () => {
        it("Should send am email to that user about their otp", async() => {
            var userDto: UserDto = new UserDto();
            userDto.email = "olakunle@gmail.com";
            userDto.password = "Password123@";
            
            var user: User = mapper.map(userDto, UserDto, User);
            user.is_enabled = false;
            user.is_active = true;
            user.first_name = "oluwatobi";
            user.password = hash("sha256", userDto.password);

            var otp = "123456";
            
            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(true);
            (userRepository.findOne as jest.Mock).mockReturnValueOnce(user);
            (generateOtpService.generate as jest.Mock).mockReturnValueOnce(otp);
            (emailService.sendEmail as jest.Mock).mockResolvedValueOnce(true);
        
            
            const response = await userService.login(userDto);
            expect(response).toBeTruthy();
            expect(response.access_token).toBeFalsy();
            expect(response.is_enabled).toBeTruthy();
            expect(userRepository.update).toHaveBeenCalledTimes(1);
            expect(userRepository.update).toHaveBeenCalledWith({ id: user.id }, { is_enabled: true });
            expect(emailService.sendEmail).toHaveBeenCalledTimes(1);
            expect(generateOtpService.generate).toHaveBeenCalledTimes(1);
            expect(generateOtpService.generate).toHaveBeenCalledWith(user.id);
        });
    });

    describe("Test login if the user is already enabled", () => {
        it("Should return a refresh token and access token", async() => {
            var userDto: UserDto = new UserDto();
            userDto.email = "olakunle@gmail.com";
            userDto.password = "Password123@";
            
            var user: User = mapper.map(userDto, UserDto, User);
            user.is_enabled = true;
            user.is_active = true;
            user.first_name = "oluwatobi";
            user.password = hash("sha256", userDto.password);

            
            (userRepository.existsBy as jest.Mock).mockResolvedValueOnce(true);
            (userRepository.findOne as jest.Mock).mockReturnValueOnce(user);

            const response : UserDto = await userService.login(userDto);
            console.log("Response is this ", response);
            expect(response).toBeTruthy();
            expect(response.access_token).toBeTruthy();
        });
    });

    










});