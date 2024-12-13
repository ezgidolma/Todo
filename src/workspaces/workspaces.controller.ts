import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { WorkspaceService } from "./workspaces.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { JwtAuthGuard } from "src/jwt/jwt-authguard";
import { BoardService } from "src/boards/boards.service";

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService,
    private readonly boardService: BoardService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new workspace' })
  @ApiResponse({ status: 201, description: 'The workspace has been successfully created.' })
  async create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return await this.workspaceService.createWorkspace(createWorkspaceDto);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing workspace' })
  @ApiParam({ name: 'id', description: 'The ID of the workspace to be updated' })
  @ApiResponse({ status: 200, description: 'The workspace has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async update(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return await this.workspaceService.updateWorkspace(id, updateWorkspaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all workspaces' })
  @ApiResponse({ status: 200, description: 'List of workspaces' })
  async findAll() {
    return await this.workspaceService.getWorkspaces();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a workspace' })
  @ApiParam({ name: 'id', description: 'The ID of the workspace to be deleted' })
  @ApiResponse({ status: 200, description: 'The Workspace has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Workspace not found' })
  async remove(@Param('id') id: string) {
    return await this.workspaceService.deleteWorkspace(id);
  }

  @Get(':workspaceId/starred-boards')
  async getStarredBoardsInWorkspace(@Req() req, @Param('workspaceId') workspaceId: string) {
    const userEmail = req.user.email;
    return await this.boardService.getStarredBoardsInWorkspace(userEmail, workspaceId);
  }

  @Get(':workspaceId/boards')
  async getBoardsInWorkspace(@Param('workspaceId') workspaceId: string) {
    return await this.boardService.getBoardsInWorkspace(workspaceId);
  }
}