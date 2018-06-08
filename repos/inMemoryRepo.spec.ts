/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import InMemoryRepo from './inMemoryRepo'
import { Bike, BikeData } from '../models/bike'

describe('Empty InMemoryRepo', () => {

  const repo = new InMemoryRepo()

  afterEach(() => {
    repo.clear()
  })

  it('remove', async () => {
    const result = await repo.remove('123')
    expect(result).undefined
  })

  it('add', async () => {
    const result = await repo.add(new BikeData('Boone 7'))
    expect(result.constructor.name).eq('Bike')
    expect(result.uuid).not.empty
    expect(result.model).eq('Boone 7')
  })

  it('get', async () => {
    const result = await repo.get('123')
    expect(result).to.undefined
  })

  it('list', async () => {
    const result = await repo.listAll()
    expect(result).to.eql(new Array<Bike>())
  })
})

describe('InMemoryRepo with bikes', () => {

  const repo = new InMemoryRepo()
  let bike1: Bike
  let bike2: Bike

  beforeEach(async () => {
    bike1 = await repo.add(new BikeData('Boone 7'))
    bike2 = await repo.add(new BikeData('Cadent 1'))
  })

  afterEach(() => {
    repo.clear()
  })

  it('remove when missing', async () => {
    expect(await repo.remove('123')).undefined
  })

  it('remove when exists', async () => {
    expect(await repo.remove(bike1.uuid)).eq(bike1)
    expect(await repo.get(bike1.uuid)).undefined
  })

  it('remove after removed', async () => {
    expect(await repo.remove(bike1.uuid)).eq(bike1)
    expect(await repo.remove(bike1.uuid)).undefined
  })

  it('get missing', async () => {
    expect(await repo.get('123')).undefined
  })

  it('get', async () => {
    expect(await repo.get(bike1.uuid)).eq(bike1)
    expect(await repo.get(bike2.uuid)).eq(bike2)
  })

  it('list', async () => {
    expect(await repo.listAll()).to.eql(new Array(bike1, bike2))
  })
})
