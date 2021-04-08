import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"


let inMemoryUsersRepository: InMemoryUsersRepository
let statementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase
let getBalanceUseCase: GetBalanceUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperation: GetStatementOperationUseCase

describe('Get statement operation', () => {

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
    getStatementOperation = new GetStatementOperationUseCase(inMemoryUsersRepository, statementsRepository)
  })

  it('I hope to received one Error with nonexistent userId', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Name Test',
        email: 'email@teste.com.br',
        password: '12345'
      })
      const user_id = 'teste'

      await getStatementOperation.execute({
        user_id,
        statement_id: 'teste'
      })

    }).rejects.toBeInstanceOf(AppError)
  })

  it('I hope to received one Error with nonexistent statement Id', () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'Name Test',
        email: 'email@teste.com.br',
        password: '12345'
      })
      const user_id = user.id as string

      await getStatementOperation.execute({
        user_id,
        statement_id: 'teste'
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

    const { id } = balance.statement[0]

    const statementOperation = await getStatementOperation.execute({
      user_id,
      statement_id: id as string
    })

    expect(balance.statement[0]).toHaveProperty('id')
  })

})