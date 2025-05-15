import { ValidationError } from "class-validator";
import { errorResponse } from "../error/response";

export function formatError(validationErrors: ValidationError[]) {
    var messageData : Map<string, string> = new Map<string, string>();
    validationErrors.forEach((error) => {
        var value = messageData.get(error.property);
        if(!value){
            var message = getMessage(error.constraints)
            messageData.set(error.property, message)
        }
    })
    
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