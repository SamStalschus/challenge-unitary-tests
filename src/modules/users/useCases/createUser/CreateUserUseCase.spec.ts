import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase"

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create a new User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('I hope to create a new user', async () => {

    const newUser = await createUserUseCase.execute({
      name: 'Name Test',
      email: 'email@teste.com.br',
      password: '12345'
    })


    expect(newUser).toHaveProperty('id')
  })

  it('I hope it is not possible to create a new user to same email', () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Name Test One',
        email: 'email@teste.com.br',
        password: '12345'
      })

      await createUserUseCase.execute({
        name: 'Name Test Two',
        email: 'email@teste.com.br',
        password: '12345'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})