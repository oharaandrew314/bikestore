import { Repo, InMemoryRepo, Bike, BikeData } from '../src/repo'
import { expect } from 'chai';
import 'mocha';

describe('Empty InMemoryRepo', () => {

    const repo: Repo = new InMemoryRepo()

    afterEach(() => {
        repo.clear()
    })

    it('remove', () => {
        const result = repo.remove('123')
        expect(result).to.equal(false);
    });

    it('add', () => {
        const result = repo.add(new BikeData('Boone 7'))
        expect(result.uuid).to.not.empty
        expect(result.model).to.equal('Boone 7')
    })

    it('get', () => {
        expect(repo.get('123')).to.undefined
    })

    it('list', () => {
        expect(repo.listAll()).to.empty
    })
})

describe('InMemoryRepo with bikes', () => {

    const repo: Repo = new InMemoryRepo()
    let bike1: Bike
    let bike2: Bike

    beforeEach(() => {
        bike1 = repo.add(new BikeData('Boone 7'))
        bike2 = repo.add(new BikeData('Cadent 1'))
    })

    afterEach(() => {
        repo.clear()
    })

    it('remove when missing', () => {
        expect(repo.remove('123')).to.eq(false)
    })

    it('remove when exists', () => {
        expect(repo.remove(bike1.uuid)).to.eq(true)
        expect(repo.get(bike1.uuid)).to.undefined
    })

    it ('remove after removed', () => {
        expect(repo.remove(bike1.uuid)).to.eq(true)
        expect(repo.remove(bike1.uuid)).to.eq(false)
    })

    it ('get missing', () => {
        expect(repo.get('123')).to.undefined
    })

    it('get', () => {
        expect(repo.get(bike1.uuid)).to.eq(bike1)
        expect(repo.get(bike2.uuid)).to.eq(bike2)
    })

    it('list', () => {
        expect(repo.listAll()).to.deep.eq(new Array(bike1, bike2))
    })
})