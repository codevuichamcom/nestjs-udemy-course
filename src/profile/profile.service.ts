import { UserResponseInterface } from '../user/types/user-response.interface';
import { ProfileResponseInterface } from '@app/profile/interfaces/profile-response.interface';
import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getProfile(
    username: string,
    currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const user = await this.userRepository.findOne({ username });

    const currentUser = await this.userRepository.findOne(
      { id: currentUserId },
      {
        relations: ['followerUser'],
      },
    );

    let isFollowing = false;
    if (
      currentUser &&
      currentUser.followerUser &&
      currentUser.followerUser.length
    ) {
      isFollowing =
        currentUser.followerUser.findIndex((u) => u.id === user.id) !== -1;
    }
    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: isFollowing,
      },
    };
  }

  async followUser(
    username: string,
    currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const user = await this.userRepository.findOne({ username });
    const currentUser = await this.userRepository.findOne(
      { id: currentUserId },
      {
        relations: ['followerUser'],
      },
    );
    let isFollowing = false;
    if (
      currentUser &&
      currentUser.followerUser &&
      currentUser.followerUser.length
    ) {
      isFollowing =
        currentUser.followerUser.findIndex((u) => u.id === user.id) !== -1;
    } else {
      currentUser.followerUser = [];
    }
    if (!isFollowing) {
      isFollowing = true;
      currentUser.followerUser.push(user);
      await this.userRepository.save(currentUser);
    }
    return {
      profile: {
        username: user.username,
        bio: user.bio,
        image: user.image,
        following: isFollowing,
      },
    };
  }
  async unfollowUser(
    username: string,
    currentUserId: number,
  ): Promise<ProfileResponseInterface> {
    const user = await this.userRepository.findOne({ username });
    const currentUser = await this.userRepository.findOne(
      { id: currentUserId },
      {
        relations: ['followerUser'],
      },
    );
    let indexUser = -1;
    if (
      currentUser &&
      currentUser.followerUser &&
      currentUser.followerUser.length
    ) {
      indexUser = currentUser.followerUser.findIndex((u) => u.id === user.id);
    }
    if (indexUser >= 0) {
      currentUser.followerUser.splice(indexUser);
      await this.userRepository.save(currentUser);
    }
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
