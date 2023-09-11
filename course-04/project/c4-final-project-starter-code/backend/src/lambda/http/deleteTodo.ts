import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodoItem } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    try {
      const item = deleteTodoItem(userId, todoId)
      return {
        statusCode: 201,
        body: JSON.stringify({ item })
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Todo Item Deletion Failed' })
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
