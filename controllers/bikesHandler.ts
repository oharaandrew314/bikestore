import { Handler, Context, Callback, APIGatewayProxyEvent } from 'aws-lambda'
import { Bike, BikeData } from '../models/bike'
import Repo from '../repos/repo'
import DynamoRepo from '../repos/dynamoRepo'
import { JsonResponse } from './responses'

const repo: Repo = new DynamoRepo(`dev-`) // TODO parameterize

export const list: Handler = (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  repo.listAll().then(bikes => {
    const response = new JsonResponse(200, bikes)
    callback(undefined, response)
  })
}

export const get: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const uuid: string = event.pathParameters!.uuid
  const bike: Bike | undefined = await repo.get(uuid)
  const response = bike == null ? new JsonResponse(404, null) : new JsonResponse(200, bike)
  callback(undefined, response)
}

export const create: Handler = async (event: APIGatewayProxyEvent, context: Context, callback: Callback) => {
  const data: BikeData = JSON.parse(event.body!)
  const bike: Bike = await repo.add(data)
  const response = new JsonResponse(200, bike)
  callback(undefined, response)
}
