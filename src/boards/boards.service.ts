import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { AddMemberToBoardDto } from "./dto/add-member-board.dto";
import { RemoveMemberToBoardDto } from "./dto/remove-member.dto";

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) { }

  async createBoard(data: CreateBoardDto, creatorEmail: string) {
    const workspaceExists = await this.prisma.workspace.findUnique({
      where: { id: data.workspaceId },
    });

    if (!workspaceExists) {
      throw new HttpException('Workspace not found.', HttpStatus.NOT_FOUND);
    }

    const user = await this.prisma.user.findUnique({
      where: { email: creatorEmail },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const newBoard = await this.prisma.board.create({
      data: {
        title: data.title,
        workspaceId: data.workspaceId,
        createdBy: user.id,
      },
    });

    // Add the creator as an admin to the board
    await this.prisma.boardMember.create({
      data: {
        boardId: newBoard.id,
        userEmail: creatorEmail,
        isAdmin: true, // Creator added as admin
      },
    });

    return newBoard;
  }

  // Check if user is admin
  private async isAdmin(boardId: string, userEmail: string): Promise<boolean> {
    const boardMember = await this.prisma.boardMember.findFirst({
      where: {
        boardId,
        userEmail,
        isAdmin: true,
      },
    });
    return !!boardMember;
  }

  async updateBoard(id: string, data: UpdateBoardDto, userEmail: string) {
    const existingBoard = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!existingBoard) {
      throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
    }

    // Admin check
    if (!await this.isAdmin(id, userEmail)) {
      throw new HttpException('You do not have permission to update this board', HttpStatus.FORBIDDEN);
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

  async getBoardsByWorkspaceId(workspaceId: string) {
    return await this.prisma.board.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        tasks: true,
      },
    });
  }

  async deleteBoard(id: string, userEmail: string) {
    const existingBoard = await this.prisma.board.findUnique({
      where: { id },
    });

    if (!existingBoard) {
      throw new HttpException('Board not found.', HttpStatus.NOT_FOUND);
    }

    // Admin check
    if (!await this.isAdmin(id, userEmail)) {
      throw new HttpException('You do not have permission to delete this board', HttpStatus.FORBIDDEN);
    }

    await this.prisma.boardMember.deleteMany({
      where: { boardId: id },
    });

    await this.prisma.board.delete({
      where: { id },
    });

    return { message: 'Board successfully deleted' };
  }

  async addMemberToBoard(addMemberToBoard: AddMemberToBoardDto, userEmail: string) {
    const { boardId, email } = addMemberToBoard;

    // Check if user exists
    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!userExists) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    // Admin check
    const isAdmin = await this.isAdmin(boardId, userEmail);
    if (!isAdmin) {
      throw new HttpException('You do not have permission to add members to this board', HttpStatus.FORBIDDEN);
    }

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
        'An error occurred while adding user to the board',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeMemberFromBoard(removeMemberFromBoard: RemoveMemberToBoardDto, userEmail: string) {
    const { boardId, email } = removeMemberFromBoard;

    // Admin check
    const isAdmin = await this.isAdmin(boardId, userEmail);
    if (!isAdmin) {
      throw new HttpException('You do not have permission to remove members from this board', HttpStatus.FORBIDDEN);
    }

    // Check if member exists
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
        'An error occurred while removing user from the board',
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
