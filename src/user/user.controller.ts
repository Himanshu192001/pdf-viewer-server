import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { ResponseDto } from './dto/response.dto';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import {UserService } from './user.service';
import { Response } from 'express';
import {PdfMakerService } from './pdf-maker/pdf-maker.service'

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService , private readonly pdfService: PdfMakerService)
    {

    }

    @Post('/create')
    async create(@Body() createUserDto: CreateUserDto) {
        try
        {
            let data = await  this.userService.create(createUserDto);
            return new ResponseDto(true , "User created successfully ." , data);
        }
        catch(error)
        {
            console.log(error);
            return new ResponseDto(false , "Something went wrong" , null);
        }
      
    }

    @Get('generate-pdf')
    async generatePdf(
        @Res() res: Response , 
        @Query('search') search: string,
        @Query('page') page: number,
        @Query('limit') limit: number) {
      const data = await this.userService.findAll(search  , page, limit); 
      const pdfBuffer = await this.pdfService.generatePdf(data.list);
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=users.pdf');
      res.send(pdfBuffer);
    }
  
    @Get('')
    async findAll(
        @Query('search') search: any,
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        try
        {
            let data =  await this.userService.findAll(search , page , limit );
            return new ResponseDto(true , "List fetched successfully." , data);
        }
        catch(error)
        {
            console.log(error);
            return new ResponseDto(false , "Something went wrong" , null);
        }
    }
  
    @Get('/:id')
    async findOne(@Param('id') id: string) {
        try
        {
            let data = await this.userService.findOne(id);
            return new ResponseDto(true , "Details fetched successfully." , data);
        }
        catch(error)
        {
            console.log(error);
            return new ResponseDto(false , "Something went wrong" , null);
        }
      
    }
  
    @Put('/edit/:id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        try
        {
            let data = await this.userService.update(id, updateUserDto);
            return new ResponseDto(true , "Details updated successfully." , data);
        }
        catch(error)
        {
            console.log(error);
            return new ResponseDto(false , "Something went wrong" , null);
        }
    }

    
  
    @Delete('/remove/:id')
    async remove(@Param('id') id: string) {
        try
        {
            let data = await this.userService.remove(id);
            return new ResponseDto(true , "Removed successfully." , data);
        }
        catch(error)
        {
            console.log(error);
            return new ResponseDto(false , "Something went wrong" , null);
        }
      
    }
}
