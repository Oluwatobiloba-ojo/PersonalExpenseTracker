
export interface OtpService {

    generate(user_id: string): Promise<string>;

    verify(user_id: string, otp: string): Promise<boolean>;

}
