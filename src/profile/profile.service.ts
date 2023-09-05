import { UserResponseInterface } from '../user/types/user-response.interface';
import { ProfileResponseInterface } from '@app/profile/interfaces/profile-response.interface';
import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './folow.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
  ) {}

  async getProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const user = await this.userRepository.findOne({
      username: username,
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });
    console.log('follow', follow, currentUserId, user.id);

    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: Boolean(follow),
      },
    };
  }

  async followUser(
    username: string,
    currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const user = await this.userRepository.findOne({
      username: username,
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and Following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    const follow = await this.followRepository.findOne({
      followerId: currentUserId,
      followingId: user.id,
    });

    if (!follow) {
      const followToCreate = new FollowEntity();
      followToCreate.followerId = currentUserId;
      followToCreate.followingId = user.id;
      await this.followRepository.save(followToCreate);
    }
    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: true,
      },
    };
  }
  async unfollowUser(
    username: string,
    currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const user = await this.userRepository.findOne({
      username: username,
    });

    if (!user) {
      throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND);
    }

    if (currentUserId === user.id) {
      throw new HttpException(
        'Follower and Following cant be equal',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.followRepository.delete({
      followerId: currentUserId,
      followingId: user.id,
    });
    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: false,
      },
    };
  }
}
