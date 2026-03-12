import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
    HttpException
} from "@nestjs/common";
import { ZodSchema } from "zod/v3";

@Injectable()
export class ValidateUrl implements PipeTransform {
    constructor(private zodSchema: ZodSchema) {}
    transform(value: any, metadata: ArgumentMetadata) {
        try {
            if(!this.zodSchema.parse(value).link.match(/http[s]{0,1}:\/\/\w+/)) {
                throw new BadRequestException('ERROR: INVALID URL FORMAT');
            }
        } catch(err) {
            throw new HttpException(err.message, err.status);
        }
        return value;
    }
}