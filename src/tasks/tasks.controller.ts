import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { TaskService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ApiOperation, ApiResponse, ApiParam, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from "src/jwt/jwt-authguard";

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' }) 
   /*@ApiHeader({
    name: 'Authorization', 
    description: 'Auth token', 
    required: true,
  })
  @UseGuards(JwtAuthGuard)*/
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.createTask(createTaskDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({ name: 'id', description: 'The ID of the task to be updated' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  /*@ApiHeader({
    name: 'Authorization', 
    description: 'Auth token', 
    required: true,
  })
  @UseGuards(JwtAuthGuard)*/
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.taskService.updateTask(id, updateTaskDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return await this.taskService.getTasks();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'The ID of the task to be deleted' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found' })
   /*@ApiHeader({
    name: 'Authorization', 
    description: 'Auth token', 
    required: true,
  })
  @UseGuards(JwtAuthGuard)*/
  async remove(@Param('id') id: string) {
    return await this.taskService.deleteTask(id);
  }
}