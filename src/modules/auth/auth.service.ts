import { Injectable } from '@nestjs/common';
import type {SendOtpRequest} from "@prismcinema/contracts/gen/auth";
import {AuthRepository} from "@/modules/auth/auth.repository";
import {Account} from "prisma/generated/client";

@Injectable()
export class AuthService {
    public constructor(private readonly authRepo: AuthRepository) {
    }

    public async sendOtp(data:SendOtpRequest){

        const { identifier, type} = data


        let account : Account | null

        if(type === "phone") account = await this.authRepo.findByPhone(identifier)
        else account = await  this.authRepo.findByEmail(identifier)

        if(!account){
            account = await this.authRepo.createAccount({
                phone: type === 'phone' ? identifier : null,
                email: type === 'email' ? identifier : null
            })
        }


        return {ok:true}
    }
}
