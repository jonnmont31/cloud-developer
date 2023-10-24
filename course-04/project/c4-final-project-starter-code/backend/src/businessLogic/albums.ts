import { TodosAccess } from '../helpers/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const todoAccess = new TodosAccess()
const logger = createLogger('TodosFunctions')
const attachmentUtils = new AttachmentUtils()

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
    createdAt: new Date().toLocaleTimeString(),
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
  return todoAccess.updateTodoItem(updateTodoRequest, userId, todoId)
}

export async function deleteTodoItem(
  userId: string,
  todoId: string
): Promise<void> {
  logger.info('Deleting todo item')
  return todoAccess.deleteTodoItem(userId, todoId)
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info(
    'Here we will get the attachments URL and updated it in its respective todo item'
  )
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  await todoAccess.updateAttachmentUrl(todoId, userId, s3AttachmentUrl)
  return attachmentUtils.getUploadUrl(todoId)
}
