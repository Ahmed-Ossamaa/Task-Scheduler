import { Task } from "../entities/task.entity";


export interface PagintaedTasks{
    data: Task[],
    total: number,
    page: number,
    lastPage: number
}