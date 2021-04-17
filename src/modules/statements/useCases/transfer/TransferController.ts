import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { TransferUseCase } from './TransferUseCase';

class TransferController {

  async execute(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user
    const { amount, description } = request.body
    const { user_id: idToSend } = request.params

    const transferUseCase = container.resolve(TransferUseCase)

    const transfered = await transferUseCase.execute(
      user_id,
      amount,
      description,
      idToSend
    )

    return response.json(transfered).send()
  }
}

export { TransferController }