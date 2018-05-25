import { Repo } from '../../src/repos/repo'
import { Bike, BikeData } from '../../src/models/bike'

export default class ClearableRepo implements Repo {

  private readonly uuids = new Array<string>()

  constructor (private readonly inner: Repo) {}

  async add (data: BikeData): Promise<Bike> {
    const result = await this.inner.add(data)
    this.uuids.push(result.uuid)
    return result
  }

  remove (uuid: string): Promise<Bike | undefined> {
    return this.inner.remove(uuid)
  }

  get (uuid: string): Promise<Bike | undefined> {
    return this.inner.get(uuid)
  }

  listAll (): Promise<Array<Bike>> {
    return this.inner.listAll()
  }

  clear (): void {
    this.uuids.forEach(async (uuid) => {
      await this.remove(uuid)
    })
  }
}
