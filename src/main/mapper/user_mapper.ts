import { createMap } from '@automapper/core';
import { User } from '../data/entity/user_model';
import { UserDto } from '../dto/request/user';
import { mapper } from './mapper';


export function createUserMappings() {
  createMap(mapper, User, UserDto);

  createMap(mapper, UserDto, User);

  
}
