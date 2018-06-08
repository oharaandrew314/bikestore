/* tslint:disable:no-unused-expression */

import { v4 as uuid4 } from 'uuid'
import { expect } from 'chai'
import { DynamoDB } from 'aws-sdk'
import DynamoDbLocal from 'dynamodb-local'

import DynamoRepo from './dynamoRepo'
import { Bike, BikeData } from '../models/bike'

const dynamoLocalPort = 8000
const client = new DynamoDB({ region: 'us-east-1', endpoint: `http://localhost:${dynamoLocalPort}` })

describe('Empty DynamoRepo', () => {

  const repo = new DynamoRepo(client, 'test-')
  let dynamo: any

  beforeEach(async () => {
    dynamo = await DynamoDbLocal.launch(dynamoLocalPort)
    await repo.mapper.createTable(Bike, { readCapacityUnits: 5, writeCapacityUnits: 5 })
  })

  afterEach(async () => {
    await repo.mapper.deleteTable(Bike)
    await DynamoDbLocal.stop(dynamo)
  })

  it('remove', async () => {
    const result = await repo.remove('123')
    expect(result).undefined
  })

  it('add', async () => {
    const result: Bike = await repo.add(new BikeData('Boone 7'))
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

describe('DynamoRepo with bikes', () => {

  let bike1: Bike
  let bike2: Bike

  const repo = new DynamoRepo(client, 'test-')
  let dynamo: any

  beforeEach(async () => {
    dynamo = await DynamoDbLocal.launch(dynamoLocalPort)
    await repo.mapper.createTable(Bike, { readCapacityUnits: 5, writeCapacityUnits: 5 })

    bike1 = await repo.add(new BikeData('Cadent 1'))
    bike2 = await repo.add(new BikeData('Boone 7'))
  })

  afterEach(async () => {
    await repo.mapper.deleteTable(Bike)
    await DynamoDbLocal.stop(dynamo)
  })

  it('remove when missing', async () => {
    expect(await repo.remove('123')).undefined
  })

  it('remove when exists', async () => {
    expect(await repo.remove(bike1.uuid)).eql(bike1)
    expect(await repo.get(bike1.uuid)).undefined
  })

  it('remove after removed', async () => {
    expect(await repo.remove(bike1.uuid)).eql(bike1)
    expect(await repo.remove(bike1.uuid)).undefined
  })

  it('get missing', async () => {
    expect(await repo.get('123')).undefined
  })

  it('get', async () => {
    expect(await repo.get(bike1.uuid)).eql(bike1)
    expect(await repo.get(bike2.uuid)).eql(bike2)
  })

  it('list', async () => {
    const result = await repo.listAll()
    expect(result.sort()).eql([bike1, bike2].sort())
  })
})
