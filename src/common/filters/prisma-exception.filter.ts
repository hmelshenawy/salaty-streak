import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        // Unique constraint violation
        const target = exception.meta?.target as string[] | undefined;
        const field = target?.join(', ') ?? 'field';
        response.status(409).json({
          statusCode: 409,
          message: `A record with this ${field} already exists`,
          error: 'Conflict',
        });
        break;
      }
      case 'P2025':
        // Record not found
        response.status(404).json({
          statusCode: 404,
          message: exception.meta?.cause ?? 'Record not found',
          error: 'Not Found',
        });
        break;
      default:
        response.status(500).json({
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
        });
        break;
    }
  }
}