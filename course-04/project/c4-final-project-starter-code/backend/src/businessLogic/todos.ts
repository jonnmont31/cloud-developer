import { TodosAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

const todoAccess = new TodosAccess()
const logger = createLogger('TodosFunctions')
const attachmentUtils = new AttachmentUtils()

// TODO: Implement businessLogic
export async function getTodos(userId: string): Promise<TodoItem[]> {
  logger.info('Getting all todos for a specific user')
  return await todoAccess.getTodos(userId)
}

export async function getTodoItem(
  userId: string,
  todoId: string
): Promise<TodoItem> {
  logger.info('Getting a specific todo item')
  return await todoAccess.getTodoItem(userId, todoId)
}

export async function createTodoItem(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Creating a new todo item')
  const todoId = uuid.v4()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const newTodo: TodoItem = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    attachmentUrl: s3AttachmentUrl,
    done: false,
    ...createTodoRequest
  }

  return todoAccess.createTodoItem(newTodo)
}

export async function updateTodoItem(
  updateTodoRequest: UpdateTodoRequest,
  userId: string,
  todoId: string
): Promise<any> {
  logger.info('Updating todo item')
  //Getting the todo item to see if it exists
  const todoItem = await todoAccess.getTodoItem(userId, todoId)
  if (!todoItem) throw new Error('Todo Item does not exist')

  if (todoItem.userId !== userId)
    throw new Error('User not authorized to update this todo item')

  return todoAccess.updateTodoItem(updateTodoRequest, userId, todoId)
}

export async function deleteTodoItem(
  userId: string,
  todoId: string
): Promise<void> {
  logger.info('Deleting todo item')
  //Getting the todo item to see if it exists
  const todoItem = await todoAccess.getTodoItem(userId, todoId)
  if (!todoItem) throw new Error('Todo Item does not exist')

  if (todoItem.userId !== userId)
    throw new Error('User not authorized to delete this todo item')

  return todoAccess.deleteTodoItem(userId, todoId)
}

export async function createAttachmentPresignedUrl(
  todoId: string
): Promise<string> {
  logger.info('Generating upload url')
  return attachmentUtils.getUploadUrl(todoId)
}
