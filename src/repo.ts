import { v4 as uuid4 } from 'uuid'

export interface Bike {
    uuid: string,
    model: string
}
  
export class BikeData {
    constructor(public model: string) {}
}

export interface Repo {
    add(data: BikeData): Bike
    remove(uuid: string): boolean
    get(uuid: string): Bike | undefined
    listAll(): Array<Bike>
    clear(): void
}

export class InMemoryRepo implements Repo {
    private bikes: Map<String, Bike> = new Map()

    add(data: BikeData): Bike {
        const bike: Bike = {
            uuid: uuid4(),
            model: data.model
        }
    
        this.bikes.set(bike.uuid, bike)
        return bike
    }

    remove(uuid: string): boolean {
        return this.bikes.delete(uuid)
    }

    get(uuid: string): Bike | undefined {
        return this.bikes.get(uuid)
    }

    listAll(): Array<Bike> {
        return Array.from(this.bikes.values())
    }

    clear(): void {
        this.bikes.clear()
    }
}