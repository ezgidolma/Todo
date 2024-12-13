import { Body, Controller, Delete, Get, Headers, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { TaskService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from "src/jwt/jwt-authguard";
import { CreateCommentDto } from "./dto/create-comment-task.dto";
import { UpdateCoverDto } from "./dto/update-cover-task.dto";

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.taskService.createTask(createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task' })
  @ApiParam({ name: 'id', description: 'The ID of the task to be updated' })
  @ApiResponse({ status: 200, description: 'The task has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.taskService.updateTask(id, updateTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'List of tasks' })
  async findAll() {
    return await this.taskService.getTasks();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiParam({ name: 'id', description: 'The ID of the task to be deleted' })
  @ApiResponse({ status: 200, description: 'The task has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string) {
    return await this.taskService.deleteTask(id);
  }

  @Post(':taskId/comments')
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiParam({ name: 'taskId', description: 'The ID of the task to comment on' })
  @ApiResponse({ status: 201, description: 'The comment has been successfully added.' })
  async addComment(@Req() req, @Param('taskId') taskId: string, @Body() createCommentDto: CreateCommentDto) {
    const userEmail = req.user.email;
    createCommentDto.taskId = taskId;
    return await this.taskService.addCommentToTask(userEmail, createCommentDto);
  }

  @Get(':taskId/comments')
  @ApiOperation({ summary: 'Get all comments for a task' })
  @ApiParam({ name: 'taskId', description: 'The ID of the task to retrieve comments for' })
  @ApiResponse({ status: 200, description: 'List of comments for the task' })
  async getComments(@Param('taskId') taskId: string) {
    return await this.taskService.getCommentsByTaskId(taskId);
  }

  @Patch(':taskId/cover')
  async setCover(@Param('taskId') taskId: string, @Body() updateCoverDto: UpdateCoverDto) {
    return await this.taskService.updateCover(taskId, updateCoverDto.coverImageUrl);
  }
}