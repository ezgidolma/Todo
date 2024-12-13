import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { AddMemberToBoardDto } from "./dto/add-member-board.dto";
import { RemoveMemberToBoardDto } from "./dto/remove-member.dto";


@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) { }

  async createBoard(data: CreateBoardDto) {
    try {
      const workspaceExists = await this.prisma.workspace.findUnique({
        where: { id: data.workspaceId },
      });

      if (!workspaceExists) {
        throw new HttpException('Workspace not found.', HttpStatus.NOT_FOUND);

      }
      const newBoard = await this.prisma.board.create({
        data: {
          title: data.title,
          workspaceId: data.workspaceId,
        },
      });
      return newBoard;
    }
    catch (error) {
      throw error;
    }
  }

  async updateBoard(id: string, data: UpdateBoardDto) {
    const existingBoard = await this.prisma.list.findUnique({
      where: { id },
    });

    if (!existingBoard) {
      throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
    }

    const updateData: Partial<UpdateBoardDto> = {
      title: data.title,
      updatedAt: new Date(),
    };

    return await this.prisma.board.update({
      where: { id },
      data: updateData,
    });
  }

  async getBoards() {
    return await this.prisma.board.findMany({
      include: {
        lists: {
          include: {
            tasks: true,
          },
        },
        tasks: true,
      },
    });
  }

  async deleteBoard(id: string) {
    const existingBoard = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!existingBoard) {
      throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
    }

    return await this.prisma.board.delete({
      where: { id },
    });
  }

  async addMemberToBoard(addMemberToBoard: AddMemberToBoardDto) {
    const { boardId, email } = addMemberToBoard;

    const existingMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userEmail: email,
      },
    });

    if (existingMember) {
      throw new HttpException(
        'User is already a member of this board',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const boardMember = await this.prisma.boardMember.create({
        data: {
          boardId: boardId,
          userEmail: email,
        },
      });

      return {
        message: 'User successfully added to the board',
        data: boardMember,
      };
    } catch (error) {
      throw new HttpException(
        'Error adding member to board',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

  }

  async getMembersOfBoard(boardId: string) {
    const boardMembers = await this.prisma.boardMember.findMany({
      where: {
        boardId: boardId,
      },
      include: {
        user: true,
      },
    });

    if (!boardMembers || boardMembers.length === 0) {
      return [];
    }

    return boardMembers.map(member => member.user);
  }

  async removeMemberFromBoard(removeMemberFromBoard: RemoveMemberToBoardDto) {
    const { boardId, email } = removeMemberFromBoard;
    const existingMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userEmail: email,
      },
    });

    if (!existingMember) {
      throw new HttpException(
        'User is not a member of this board',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      await this.prisma.boardMember.delete({
        where: {
          id: existingMember.id,
        },
      });

      return {
        message: 'User successfully removed from the board',
      };
    } catch (error) {
      throw new HttpException(
        'Error removing member from board',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async starBoard(boardId: string, userEmail: string) {
    const boardMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userEmail: userEmail,
      },
    });

    if (!boardMember) {
      throw new HttpException('User is not a member of this board', HttpStatus.NOT_FOUND);
    }

    const updatedBoardMember = await this.prisma.boardMember.update({
      where: {
        id: boardMember.id,
      },
      data: {
        isStarred: true,
      },
    });

    return {
      message: 'Board successfully starred',
      data: updatedBoardMember,
    };
  }

  async unstarBoard(boardId: string, userEmail: string) {

    const boardMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId: boardId,
        userEmail: userEmail,
      },
    });

    if (!boardMember) {
      throw new HttpException('User is not a member of this board', HttpStatus.NOT_FOUND);
    }

    const updatedBoardMember = await this.prisma.boardMember.update({
      where: {
        id: boardMember.id,
      },
      data: {
        isStarred: false,
      },
    });

    return {
      message: 'Board successfully unstarred',
      data: updatedBoardMember,
    };
  }

  async getStarredBoardsInWorkspace(userEmail: string, workspaceId: string) {
    return await this.prisma.boardMember.findMany({
      where: {
        userEmail: userEmail,
        isStarred: true,
        board: {
          workspaceId: workspaceId,
        },
      },
      include: {
        board: true,
      },
    });
  }

  async getBoardsInWorkspace(workspaceId: string) {
    return await this.prisma.board.findMany({
      where: {
        workspaceId: workspaceId,
      },
    });
  }
}