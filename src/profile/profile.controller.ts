import { ProfileResponseInterface } from '@app/profile/interfaces/profile-response.interface';
import { ProfileService } from '@app/profile/profile.service';
import { User } from '@app/user/decorator/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @UseGuards(AuthGuard)
  async getProfile(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    return await this.profileService.getProfile(username, currentUserId);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followUser(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    return await this.profileService.followUser(username, currentUserId);
  }
  @Delete(':username/follow')
  @UseGuards(AuthGuard)
  async unfollow(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    return await this.profileService.unfollowUser(username, currentUserId);
  }
}
