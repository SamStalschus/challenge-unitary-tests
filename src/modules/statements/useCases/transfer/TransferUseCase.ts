import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "../createStatement/CreateStatementError";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

@injectable()
class TransferUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute(
    user_id: string,
    amount: number,
    description: string,
    idToSend: string
  ) {
    const user = await this.usersRepository.findById(user_id);

    const userSend = await this.usersRepository.findById(idToSend);

    if (!user || !userSend) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const statementOperationWithdraw = await this.statementsRepository.create({
      user_id,
      type: 'withdraw' as OperationType,
      amount,
      description
    });


    const statementOperationDeposit = await this.statementsRepository.create({
      user_id: idToSend,
      type: 'deposit' as OperationType,
      amount,
      description
    });

    return {
      "id": statementOperationWithdraw.id,
      "sender_id": statementOperationDeposit.id,
      "amount": amount,
      "description": description,
      "type": "transfer",
      "created_at": statementOperationWithdraw.created_at,
      "updated_at": statementOperationWithdraw.updated_at
    }

  }
}

export { TransferUseCase }