import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let getBalanceUseCase: GetBalanceUseCase
let createStatementUseCase: CreateStatementUseCase

describe('Get balance', () => {

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    getBalanceUseCase = new GetBalanceUseCase(statementsRepository, inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, statementsRepository)
  })

  it('I hope to received one Error with nonexistent userId', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Name Test',
        email: 'email@teste.com.br',
        password: '12345'
      })
      const user_id = 'teste'

      await getBalanceUseCase.execute({
        user_id,
      })

    }).rejects.toBeInstanceOf(AppError)
  })

  it('I hope to received one statement', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name Test',
      email: 'email@teste.com.br',
      password: '12345'
    })
    const user_id = user.id as string

    const type = "withdraw" as OperationType

    await createStatementUseCase.execute({
      user_id,
      type,
      amount: 0,
      description: 'Testess'
    })

    const balance = await getBalanceUseCase.execute({
      user_id,
    })

    expect(balance.statement[0]).toHaveProperty('id')
  })

})