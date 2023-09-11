import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    try {
      const imgUrl = await createAttachmentPresignedUrl(todoId)

      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl: imgUrl
        })
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Error creationg attachment presigned URL'
        })
      }
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
