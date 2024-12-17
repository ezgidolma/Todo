import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseAnonKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Supabase configuration missing in environment variables',
      );
    }

    this.supabase = new SupabaseClient(supabaseUrl, supabaseAnonKey);
  }

  async register(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new HttpException(
        `Registration failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = data?.user;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to create user in the database.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return user;
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new HttpException('Password incorrect.', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user.id, email: user.email,role:user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
