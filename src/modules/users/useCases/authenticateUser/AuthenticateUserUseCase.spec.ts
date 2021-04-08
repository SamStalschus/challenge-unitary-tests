import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Authenticate User', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('I hope to received JWT in correct email', async () => {
    await createUserUseCase.execute({
      name: 'Name Test',
      email: 'email@teste.com.br',
      password: '12345'
    })

    const userAuth = await authenticateUserUseCase.execute({
      email: 'email@teste.com.br',
      password: '12345'
    })

    expect(userAuth).toHaveProperty('token')
  })

  it('I hope to received one Error with incorrect password', () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Name Test',
        email: 'email@teste.com.br',
        password: '12345'
      })

      const userAuth = await authenticateUserUseCase.execute({
        email: 'email@teste.com.br',
        password: '555'
      })
    }).rejects.toBeInstanceOf(AppError)
  })

  it('I hope to received one Error with nonexistent email', () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'Name Test',
        email: 'email@teste.com.br',
        password: '12345'
      })

      const userAuth = await authenticateUserUseCase.execute({
        email: 'emailnonexistent@teste.com.br',
        password: '12345'
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})