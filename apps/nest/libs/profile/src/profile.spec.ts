import { ProfileEntity } from './entities/profile.entity'
import { TestContext, testHelper, UserContextTestType } from '@app/spec/test.helper'

describe('Profile', () => {
  let tc: TestContext
  let profile: ProfileEntity
  let userContext: UserContextTestType

  beforeAll(async () => {
    tc = await testHelper.createContext()
    userContext = await tc.generateAcount({ initProfile: false })
  })

  afterAll(async () => {
    await tc?.clean()
  })

  test('Unauthorized', async () => {
    const res = await tc.request().post('/auth/init-profile')
    expect(res).toBeUnauthorized()
  })
  test('Put:Failed:Uninitialized', async () => {
    const res = await userContext.request((t) => t.put('/profile/me'))
    expect(res).toBeBad('User has not initialized the profile yet')
  })
  test('Me:Failed:Uninitialized', async () => {
    const res = await userContext.request((t) => t.get('/profile/me'))
    expect(res).toBeBad('User has not initialized the profile yet')
  })
  test('Init:OK', async () => {
    let res = await userContext.request((t) => t.post('/auth/init-profile'))
    expect(res).toBeCreated()
    profile = res.body?.profile

    expect(profile.id).not.toBeUndefined()

    res = await userContext.request((t) => t.get('/auth/me'))
    expect(res).toBeOK()
    const user = res.body
    expect(user.profileId).not.toBeUndefined()
    expect(user.profileId).toEqual(profile.id)
  })
  test('Init:Failed:Duplicated', async () => {
    const res = await userContext.request((t) => t.post('/auth/init-profile'))
    expect(res).toBeBad('User has initialized the profile')
  })
  test('Me:Success', async () => {
    const res = await userContext.request((t) => t.get('/profile/me'))
    expect(res.body.id).toEqual(profile.id)
  })
  test('Put:Success', async () => {
    let res = await userContext.request((t) => t.put('/profile/me').send({ name: 'something' }))
    expect(res).toBeOK()
    expect(res.body.name).toEqual('something')

    const dob = new Date()
    res = await userContext.request((t) => t.put('/profile/me').send({ dob: dob }))
    expect(res).toBeOK()
    expect(res.body.dob).toEqual(dob.toISOString())
  })
})
