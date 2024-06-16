import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }

    async findAll(search: string, page: number, limit: number) {
        console.log( "---- Req query ---> " ,search , page , limit );
        const query = this.userModel.find();

        if (search) {
            query.or([
                { email: new RegExp(search, 'i') } ,
                { name: new RegExp(search, 'i') },
            ]);
        }
        
        const totalCount = await this.userModel.countDocuments(query.getFilter()).exec();
        const pageNumber = page || 1;
        const limitNumber = limit || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const users  = await query.skip(skip).limit(limitNumber).exec();
        let data = { list : users , count : totalCount};
        console.log( " ----- Data list ----> " , data );
        return data;
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
        const updatedUser = await this.userModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return updatedUser;
    }

    async remove(id: string): Promise<User> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return deletedUser;
    }
}
