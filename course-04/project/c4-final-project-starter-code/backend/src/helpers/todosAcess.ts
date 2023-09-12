import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODOS_TABLE
  ) {}

  //Get all todo items for a specified user
  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todo items of a particular user')
    const result = await this.docClient
      .query({
        TableName: this.todoTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: true
      })
      .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  //Get a single todo item based on its id and its user's id
  async getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
    logger.info('Get a single todo item for a specified user')

    const result = await this.docClient
      .get({
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()

    const item = result.Item
    return item as TodoItem
  }

  //Create a new todo item
  async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Creating a new todo item')
    await this.docClient
      .put({
        TableName: this.todoTable,
        Item: {
          ...todoItem
        }
      })
      .promise()

    return todoItem
  }

  //Update an exisiting todo item
  async updateTodoItem(
    updatedTodo: TodoUpdate,
    userId: string,
    todoId: string
  ): Promise<TodoUpdate> {
    logger.info('Updating todo item')
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression: 'set #name=:name, dueDate=:dueDate, done=:done',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':dueDate': updatedTodo.dueDate,
          ':done': updatedTodo.done
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        }
      })
      .promise()

    return updatedTodo as TodoUpdate
  }

  //Delete a single todo item
  async deleteTodoItem(userId: string, todoId: string): Promise<void> {
    logger.info('Deleting a single todo item')
    await this.docClient
      .delete({
        TableName: this.todoTable,
        Key: {
          userId: userId,
          todoId: todoId
        }
      })
      .promise()
  }

  //Updating attachment URL
  async updateAttachmentUrl(
    todoId: string,
    userId: string,
    attachmentUrl: string
  ): Promise<void> {
    logger.info('Updating a todos attachment URL')
    await this.docClient
      .update({
        TableName: this.todoTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }
}
