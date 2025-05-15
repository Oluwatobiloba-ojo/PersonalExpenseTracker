import { UserDto } from "../main/dto/request/user";
import { createUserMappings } from "../main/mapper/user_mapper";
import { UserService } from "../main/service/user_service";
import { mapper } from "../main/mapper/mapper";
import { userRepository } from "../main/data/repository/user.repository";
import { User } from "../main/data/entity/user_model";
import { IdentityService } from "../main/service/identity_service";
import { hash } from "crypto";
import 'reflect-metadata';


jest.mock("../main/data/repository/user.repository")

describe("User service: ", () => {
    
    let userService : IdentityService;

    beforeAll(async() => {
        createUserMappings();
       
       userService = new UserService();
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

    // describe("Test create password if ")






});