import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ListService } from "./lists.service";
import { CreateListDto } from "./dto/create-list.dto";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { UpdateListDto } from "./dto/update-list.dto";
import { JwtAuthGuard } from "src/jwt/jwt-authguard";


@Controller('lists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ListController {
  constructor(private readonly listService: ListService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new list' })
  @ApiResponse({ status: 201, description: 'The list has been successfully created.' })
  async create(@Body() createListDto: CreateListDto) {
    return await this.listService.createList(createListDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing list' })
  @ApiParam({ name: 'id', description: 'The ID of the list to be updated' })
  @ApiResponse({ status: 200, description: 'The list has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'List not found' })
  async update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return await this.listService.updateList(id, updateListDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all lists' })
  @ApiResponse({ status: 200, description: 'List of lists' })
  async findAll() {
    return await this.listService.getLists();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a list' })
  @ApiParam({ name: 'id', description: 'The ID of the list to be deleted' })
  @ApiResponse({ status: 200, description: 'The List has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'List not found' })
  async remove(@Param('id') id: string) {
    return await this.listService.deleteList(id);
  }
}