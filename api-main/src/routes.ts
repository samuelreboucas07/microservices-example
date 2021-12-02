import { Router } from 'express';
import certificationControllers from './controllers/certification';

const routes = Router();

const certificationsControllers = new certificationControllers();

routes.post('/certifications', certificationsControllers.create);

export default routes;