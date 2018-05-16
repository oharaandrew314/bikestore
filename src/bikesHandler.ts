import { Handler, Context, Callback, APIGatewayProxyEvent } from 'aws-lambda'
import { v4 as uuid4 } from 'uuid'
import { Repo, InMemoryRepo, Bike, BikeData } from './repo'

interface Response {
  statusCode: number
  body: string
}

class JsonResponse implements Response {
  body: string

  constructor (public statusCode: number, body: any) {
    this.body = body == null ? '' : JSON.stringify(body)
  }
}

const repo: Repo = new InMemoryRepo()

export const listAll: Handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const response: Response = new JsonResponse(200, repo.listAll())
  callback(undefined, response)
}

export const get: Handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const uuid: string = event.pathParameters!.uuid
  const bike: Bike | undefined = repo.get(uuid)

  const response: Response = bike == null ? new JsonResponse(404, null) : new JsonResponse(200, bike)
  callback(undefined, response)
}

export const newBike: Handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const data: BikeData = JSON.parse(event.body!)
  const bike: Bike = repo.add(data)
  const response: Response = new JsonResponse(200, bike)
  callback(undefined, response)
}
