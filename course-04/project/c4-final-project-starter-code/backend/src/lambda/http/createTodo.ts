import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'
import { createTodoItem } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    try {
      const item = createTodoItem(newTodo, userId)
      return {
        statusCode: 201,
        body: JSON.stringify({ item })
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Todo Item Creation Failed' })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
