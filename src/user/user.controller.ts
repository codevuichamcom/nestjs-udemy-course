import { User } from '@app/user/decorator/user.decorator';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { LoginUserDto } from '@app/user/dto/login-user.dto';
import { UpdateUserDto } from '@app/user/dto/update-user.dto';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserResponseInterface } from '@app/user/types/user-response.interface';
import { UserEntity } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async register(
    @Body('user') createUserDto: CreateUserDto,
  ): Promise<UserResponseInterface> {
    const userEntity = await this.userService.createUser(createUserDto);
    return this.userService.buildUserResponse(userEntity);
  }

  @Post('users/login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  async login(
    @Body('user') loginUserDto: LoginUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.login(loginUserDto);
    return this.userService.buildUserResponse(user);
  }

  @Get('user')
  @UseGuards(AuthGuard)
  currentUser(@User() user: UserEntity): UserResponseInterface {
    return this.userService.buildUserResponse(user);
  }

  @Get('users')
  async getAll(): Promise<UserResponseInterface[]> {
    return await this.userService.getAll();
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User('id') currentUserId,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto,
    );
    return this.userService.buildUserResponse(user);
  }
}
