import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let showUserProfile: ShowUserProfileUseCase

describe('Show user profile', () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    showUserProfile = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it('I hope to received a user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name Test',
      email: 'email@teste.com.br',
      password: '12345'
    })
    const user_id = user.id as string

    const userProfile = await showUserProfile.execute(user_id)

    expect(userProfile).toHaveProperty('id')
  })

  it('I hope to received one Error with nonexistent userId', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Name Test',
        email: 'email@teste.com.br',
        password: '12345'
      })
      const user_id = 'testeerror'

      const userProfile = await showUserProfile.execute(user_id)
    }).rejects.toBeInstanceOf(AppError)
  })
})