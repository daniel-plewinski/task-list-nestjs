import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}
