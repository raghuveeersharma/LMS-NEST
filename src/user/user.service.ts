import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const createdUser = await this.userModel.create({
        ...createUserDto,
        password: await this.hashPassword(createUserDto.password),
      });
      return createdUser;
    } catch (error) {
      this.handleMongoError(error);
    }
  }

  async findAllUsers() {
    return this.userModel.find().sort({ createdAt: -1 });
  }

  async findUserById(id: string) {
    this.validateObjectId(id);
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    this.validateObjectId(id);
    try {
      const updatePayload = { ...updateUserDto };

      if (updatePayload.password) {
        updatePayload.password = await this.hashPassword(
          updatePayload.password,
        );
      }

      const user = await this.userModel.findByIdAndUpdate(id, updatePayload, {
        new: true,
        runValidators: true,
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.handleMongoError(error);
    }
  }

  async deleteUser(id: string) {
    this.validateObjectId(id);
    const deletedUser = await this.userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return deletedUser;
  }

  private validateObjectId(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid user id format');
    }
  }

  private handleMongoError(error: any): never {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      throw new ConflictException('A user with this email already exists');
    }

    throw error;
  }

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
