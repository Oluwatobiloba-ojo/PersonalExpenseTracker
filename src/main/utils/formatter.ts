import { ValidationError } from "class-validator";
import { errorResponse } from "../error/response";

export function formatError(validationErrors: ValidationError[]) {
    const messageData = new Map<string, string>(
        validationErrors
          .filter((error) => !!error.constraints)
          .map((error) => [error.property, getMessage(error.constraints)])
      );
    
    const plainMessageObject: Record<string, string> = Object.fromEntries(messageData);
    
    return errorResponse(plainMessageObject, 400)
}

function getMessage(messages: { [type: string]: string }): string  {
    if(Object.keys(messages).length == 1){
        return Object.values(messages)[0];
    }else{
        for (var key in messages){
            if(key == "isNotEmpty"){
                return messages[key];
            }
        }
        return "";
    }    
}