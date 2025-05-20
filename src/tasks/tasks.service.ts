import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = this.tasksRepository.create({
      ...createTaskDto,
      isDone: false, // Default value
    });
    await this.tasksRepository.save(newTask); // Save the new task to the database
    return newTask;
  }

  async findAll(): Promise<Task[]> {
    return this.tasksRepository.find(); // Fetch all tasks from the database
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOneBy({ id }); 
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.preload({
      id: id,
      ...updateTaskDto,
    });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found to update`);
    }
    return this.tasksRepository.save(task); // Save the updated task to the database
  }

  async remove(id: number): Promise<void> {
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found to delete`);
    }
  }
}
