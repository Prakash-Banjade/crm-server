import { TemplateDelegate } from 'handlebars';



export interface ITemplates<T = any> {
    confirmation: TemplateDelegate<T>;
    resetPassword: TemplateDelegate<T>;
    userCredentials: TemplateDelegate<T>;
    twoFaOtp: TemplateDelegate<T>;
    notification: TemplateDelegate<T>;
}