import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { BoardService } from "./boards.service";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { AddMemberToBoardDto } from "./dto/add-member-board.dto";
import { RemoveMemberToBoardDto } from "./dto/remove-member.dto";
import { JwtAuthGuard } from "src/jwt/jwt-authguard";

@Controller('boards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new board' })
  @ApiResponse({ status: 201, description: 'The board has been successfully created.' })
  async create(@Body() createBoardDto: CreateBoardDto, @Req() req: any) {
    const userEmail = req.user.email;
    return await this.boardService.createBoard(createBoardDto, userEmail);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing board' })
  @ApiParam({ name: 'id', description: 'The ID of the board to be updated' })
  @ApiResponse({ status: 200, description: 'The board has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Board not found' })
  async update(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto, @Req() req: any) {
    const userEmail = req.user.email;
    return await this.boardService.updateBoard(id, updateBoardDto, userEmail);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boards' })
  @ApiResponse({ status: 200, description: 'List of boards' })
  async findAll() {
    return await this.boardService.getBoards();
  }

  @Get(':workspaceId/boards')
  @ApiOperation({ summary: 'Get all boards by workspaceId' })
  @ApiParam({ name: 'workspaceId', description: 'The ID of the workspace' })
  @ApiResponse({ status: 200, description: 'List of boards.' })
 async getBoards(@Param('workspaceId') workspaceId: string) {
  return await this.boardService.getBoardsByWorkspaceId(workspaceId);
 }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a board' })
  @ApiParam({ name: 'id', description: 'The ID of the board to be deleted' })
  @ApiResponse({ status: 200, description: 'The Board has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'board not found' })
  async remove(@Param('id') id: string, @Req() req: any) {
    const userEmail = req.user.email;
    return await this.boardService.deleteBoard(id, userEmail);
  }

  @Post('add-member')
  @ApiOperation({ summary: 'Add a user to a board' })
  @ApiResponse({ status: 201, description: 'User successfully added to the board.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async addMember(@Body() addMemberToBoardDto: AddMemberToBoardDto, @Req() req: any) {
    const userEmail = req.user.email;
    return await this.boardService.addMemberToBoard(addMemberToBoardDto, userEmail);
  }

  @Get(':boardId/members')
  @ApiOperation({ summary: 'Get all members in board' })
  async getMembers(@Param('boardId') boardId: string) {
    const members = await this.boardService.getMembersOfBoard(boardId);
    return members;
  }

  @Delete(':boardId/remove-member')
  @ApiOperation({ summary: 'Remove a user from a board' })
  @ApiResponse({ status: 200, description: 'User successfully removed from the board.' })
  @ApiResponse({ status: 404, description: 'Member or board not found.' })
  async removeMember(@Body() removeMemberToBoardDto: RemoveMemberToBoardDto, @Req() req: any) {
    const userEmail = req.user.email;
    return await this.boardService.removeMemberFromBoard(removeMemberToBoardDto, userEmail);
  }


  @Patch(':boardId/star')
  @ApiOperation({ summary: 'Star a board' })
  @ApiParam({ name: 'boardId', description: 'ID of the board to be starred' })
  @ApiResponse({ status: 200, description: 'Board successfully starred.' })
  async star(
    @Param('boardId') boardId: string, @Req() req: any,) {
    const userEmail = req.user.email;
    return await this.boardService.starBoard(boardId, userEmail);
  }

  @Patch(':boardId/unstar')
  @ApiOperation({ summary: 'Unstar a board' })
  @ApiParam({ name: 'boardId', description: 'ID of the board to be unstarred' })
  @ApiResponse({ status: 200, description: 'Board successfully unstarred.' })
  async unstar(
    @Param('boardId') boardId: string, @Req() req: any,) {
    const userEmail = req.user.email;
    return await this.boardService.unstarBoard(boardId, userEmail);
  }

  @Get(':boardId')
  async getBoard(@Param('boardId') boardId: string) {
    const board = await this.boardService.getBoardsDetails(boardId);
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }

}