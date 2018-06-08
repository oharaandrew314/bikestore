import { v4 as uuid4 } from 'uuid'

import { Bike, BikeData } from '../models/bike'
import Repo from './repo'

export default class InMemoryRepo implements Repo {

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

  clear () {
    this.bikes.clear()
  }
}
