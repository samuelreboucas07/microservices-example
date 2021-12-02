import { Request, Response, NextFunction } from 'express';

class CertificationControllers {
  async create(request: Request, response: Response, next: NextFunction) {
    const message = {
      user: { id: 1, name: 'Samuel rebouças' },
      course: 'microservices kafka',
      grade: 5,
    };

    await request.producer.send({
      topic: 'issue-certificate',
      messages: [
        {
          value: JSON.stringify(message),
        }
      ]
    });
    return response.json({message: 'Mensagem enviada.'});
  }
};

export default CertificationControllers;