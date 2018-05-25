/* tslint:disable:no-unused-expression */

import { v4 as uuid4 } from 'uuid'
import { expect } from 'chai'
import { DynamoDB } from 'aws-sdk'

import { DynamoRepo } from '../../src/repos/repo'
import ClearableRepo from './clearableRepo'
import { Bike, BikeData } from '../../src/models/bike'

describe('Empty InMemoryRepo', () => {

  const repo = new ClearableRepo(new DynamoRepo())
  const tableName = `test-bikes-${uuid4()}`
  const client = new DynamoDB({ region: 'us-east-1' })
  const DynamoDbLocal = require('dynamodb-local')
  const dynamoLocalPort = 8000
  let dynamo: any

  beforeEach(async () => {
    process.env.BIKES_TABLE_NAME = tableName
    dynamo = await DynamoDbLocal.launch(dynamoLocalPort, null, [], false, true)

    // const params: DynamoDB.CreateTableInput = {
    //   AttributeDefinitions: [
    //     {
    //       AttributeName: 'uuid',
    //       AttributeType: 'S'
    //     }
    //   ],
    //   KeySchema: [
    //     {
    //       AttributeName: 'uuid',
    //       KeyType: 'HASH'
    //     }
    //   ],
    //   ProvisionedThroughput: {
    //     ReadCapacityUnits: 1,
    //     WriteCapacityUnits: 1
    //   },
    //   TableName: tableName
    // }
    // await client.createTable(params).promise()
    // setTimeout(() => { console.log('foo') }, 10000)
    // await client.waitFor('tableExists', { TableName: tableName }).promise()
  })

  afterEach(async () => {
    await DynamoDbLocal.stopChild(dynamo)
    // const params: DynamoDB.DeleteTableInput = {
    //   TableName: tableName
    // }

    // await client.deleteTable(params).promise()
  })

  it('foo', () => {
    console.log('foo')
  })

//   it('remove', async () => {
//     const result = await repo.remove('123')
//     expect(result).undefined
//   })

//   it('add', async () => {
//     const result = await repo.add(new BikeData('Boone 7'))
//     expect(result.constructor.name).eq('Bike')
//     expect(result.uuid).not.empty
//     expect(result.model).eq('Boone 7')
//   })

//   it('get', async () => {
//     const result = await repo.get('123')
//     expect(result).to.undefined
//   })

//   it('list', async () => {
//     const result = await repo.listAll()
//     expect(result).to.eql(new Array<Bike>())
//   })
})

// describe('InMemoryRepo with bikes', () => {

//   const repo = new ClearableRepo(new DynamoRepo())
//   let bike1: Bike
//   let bike2: Bike

//   beforeEach(async () => {
//     bike1 = await repo.add(new BikeData('Boone 7'))
//     bike2 = await repo.add(new BikeData('Cadent 1'))
//   })

//   afterEach(() => {
//     repo.clear()
//   })

//   it('remove when missing', async () => {
//     expect(await repo.remove('123')).undefined
//   })

//   it('remove when exists', async () => {
//     expect(await repo.remove(bike1.uuid)).eq(bike1)
//     expect(await repo.get(bike1.uuid)).undefined
//   })

//   it('remove after removed', async () => {
//     expect(await repo.remove(bike1.uuid)).eq(bike1)
//     expect(await repo.remove(bike1.uuid)).undefined
//   })

//   it('get missing', async () => {
//     expect(await repo.get('123')).undefined
//   })

//   it('get', async () => {
//     expect(await repo.get(bike1.uuid)).eq(bike1)
//     expect(await repo.get(bike2.uuid)).eq(bike2)
//   })

//   it('list', async () => {
//     expect(await repo.listAll()).to.eql(new Array(bike1, bike2))
//   })
// })
