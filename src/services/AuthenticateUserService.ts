import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories"
import { compare } from 'bcryptjs'
import { sign } from "jsonwebtoken"

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories)

    const user = await usersRepositories.findOne({ email })

    if(!user) {
      throw new Error('Email/Password incorrect')
    }
    
    const passwordMatch = await compare(password, user.password)
    
    if(!passwordMatch) {
      throw new Error('Email/Password incorrect')
    }

    const token = sign({
      email: user.email
    }, "f2bdf6b0314918ca3e9ace83bdb8edfd", {
      subject: user.id,
      expiresIn: '1d'
    })

    return token

  }
}

export { AuthenticateUserService }