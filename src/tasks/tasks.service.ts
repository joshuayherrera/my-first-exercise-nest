import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {

  // Simulating a database with an in-memory array
  private tasks: Task[] = [
    { id: 1, title: 'Aprender NestJS Controladores', description: 'Entender cómo funcionan los controladores y rutas.', isDone: true },
    { id: 2, title: 'Practicar con Hoppscotch', description: 'Probar todos los endpoints de la API.', isDone: false },
  ];
  private nextId = 3; // Simulating an auto-incrementing ID

  create(createTaskDto: CreateTaskDto): Task {
    const newTask: Task = {
      id: this.nextId++,
      title: createTaskDto.title || 'Default Title',
      description: createTaskDto.description || '',
      isDone: false,
    };
    this.tasks.push(newTask);
    return newTask;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    const task = this.tasks.find(task => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  update(id: number, updateTaskDto: UpdateTaskDto): Task {
    const task = this.findOne(id); // Verify if the task exists
    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.isDone !== undefined) {
      task.isDone = updateTaskDto.isDone;
    }
    return task;
  }

  remove(id: number): { message: string } {
    const taskIndex = this.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    this.tasks.splice(taskIndex, 1);
    console.log(`Tarea con ID ${id} eliminada.`);
    return { message: `Tarea con ID ${id} eliminada exitosamente.` };
  }
}
