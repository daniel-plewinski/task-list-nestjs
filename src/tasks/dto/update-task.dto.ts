import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateTaskDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
