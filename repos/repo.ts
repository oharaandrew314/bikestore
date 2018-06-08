import { Bike, BikeData } from '../models/bike'

export default interface Repo {
  add (data: BikeData): Promise<Bike>
  remove (uuid: string): Promise<Bike | undefined>
  get (uuid: string): Promise<Bike | undefined>
  listAll (): Promise<Array<Bike>>
}
