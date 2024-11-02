import { scrypt, randomBytes } from 'crypto';
import { promisify} from 'util';
const scryptasync = promisify(scrypt);
export class Password {
    static async hash(password:string){
        const salt = randomBytes(8).toString('hex');
        const buffer = (await scryptasync(password,salt,64) as Buffer);

        return `${buffer.toString('hex')}.${salt}`;
    }

    static async compare (storedPassword:string, suppliedPassword:string){
        const [ hashedPassword, salt ] = storedPassword.split('.');
        const buffer = (await scryptasync(suppliedPassword,salt,64)) as Buffer;
        return buffer.toString('hex') === hashedPassword;
    }
}