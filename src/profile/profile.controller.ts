import { ProfileService } from '@app/profile/profile.service';
import { User } from '@app/user/decorator/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  @UseGuards(AuthGuard)
  async getProfile(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ) {
    return await this.profileService.getProfile(username, currentUserId);
  }

  @Post(':username/follow')
  @UseGuards(AuthGuard)
  async followUser(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ) {
    return await this.profileService.followUser(username, currentUserId);
  }
  @Post(':username/unfollow')
  @UseGuards(AuthGuard)
  async unfollow(
    @Param('username') username: string,
    @User('id') currentUserId: number,
  ) {
    return await this.profileService.unfollowUser(username, currentUserId);
  }
}
