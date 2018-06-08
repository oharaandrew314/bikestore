import { v4 as uuid4 } from 'uuid'
import { DynamoDB } from 'aws-sdk'
import { DataMapper } from '@aws/dynamodb-data-mapper'

import { Bike, BikeData } from '../models/bike'

export interface Repo {
  add (data: BikeData): Promise<Bike>
  remove (uuid: string): Promise<Bike | undefined>
  get (uuid: string): Promise<Bike | undefined>
  listAll (): Promise<Array<Bike>>
}

export class InMemoryRepo implements Repo {

  private readonly bikes: Map<String, Bike> = new Map()

  async add (data: BikeData): Promise<Bike> {
    const bike = new Bike()
    bike.uuid = uuid4()
    bike.model = data.model

    this.bikes.set(bike.uuid, bike)
    return bike
  }

  async remove (uuid: string): Promise<Bike | undefined> {
    const toRemove = this.bikes.get(uuid)
    if (toRemove != null) {
      this.bikes.delete(uuid)
      return toRemove
    }
    return toRemove
  }

  async get (uuid: string): Promise<Bike | undefined> {
    return this.bikes.get(uuid)
  }

  async listAll (): Promise<Array<Bike>> {
    return Array.from(this.bikes.values())
  }
}

export class DynamoRepo implements Repo {

  readonly mapper: DataMapper

  constructor (client: DynamoDB = new DynamoDB(), tableNamePrefix: string) {
    this.mapper = new DataMapper({
      client: client,
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

    const result = await this.mapper.delete({ item: toRemove })
    return result == null ? undefined : result.item
  }

  async get (uuid: string): Promise<Bike | undefined> {
    const toFetch = new Bike()
    toFetch.uuid = uuid

    try {
      const result = await this.mapper.get({ item: toFetch })
      return result.item
    } catch {
      return undefined
    }
  }

  async listAll (): Promise<Array<Bike>> {
    const result = await this.mapper.scan({ valueConstructor: Bike })
    const toReturn = new Array<Bike>()
    for await (const item of result) {
      toReturn.push(item)
    }
    return toReturn
  }
}
