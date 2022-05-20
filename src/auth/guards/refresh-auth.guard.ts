import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class RefreshGuard extends AuthGuard('refresh') {}
