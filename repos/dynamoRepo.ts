import { v4 as uuid4 } from 'uuid'
import { DataMapper } from '@aws/dynamodb-data-mapper'
const dynamodb = require('serverless-dynamodb-client')

import { Bike, BikeData } from '../models/bike'
import Repo from './repo'

export default class DynamoRepo implements Repo {

  readonly mapper: DataMapper

  constructor (tableNamePrefix: string) {
    console.log('foo')
    console.log(dynamodb.raw)

    this.mapper = new DataMapper({
      client: dynamodb.raw,
      tableNamePrefix: tableNamePrefix
    })
  }

  async add (data: BikeData): Promise<Bike> {
    const bike = new Bike()
    bike.uuid = uuid4()
    bike.model = data.model

    await this.mapper.put({ item: bike })
    return bike
  }

  async remove (uuid: string): Promise<Bike | undefined> {
    const toRemove = new Bike()
    toRemove.uuid = uuid

    return this.mapper.delete(toRemove)
  }

  async get (uuid: string): Promise<Bike | undefined> {
    const toFetch = new Bike()
    toFetch.uuid = uuid

    try {
      return await this.mapper.get(toFetch)
    } catch (e) {
      return undefined
    }
  }

  async listAll (): Promise<Array<Bike>> {
    const result = await this.mapper.scan({ valueConstructor: Bike })
    const toReturn = new Array<Bike>()
    for await (const item of result) {
      toReturn.push(item)
    }
    console.log(toReturn)
    return toReturn
  }
}
