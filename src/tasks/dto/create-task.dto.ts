import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
    @IsString({ message: 'The title must be a string' })
    @IsNotEmpty({ message: 'The title is required' })
    @MinLength(3, { message: 'The title must be at least 3 characters long' })
    @MaxLength(50, { message: 'The title must be at most 50 characters long' })
    title: string;

    @IsString({ message: 'The description must be a string' })
    @IsOptional()
    @MaxLength(255)
    description?: string;
}
