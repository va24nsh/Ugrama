import bcrypt from "bcryptjs";
import { AuthType, Role } from "@prisma/client";
import { UserRepository } from "../repositories/postgres/user";

export class AuthService {
  static async registerWithEmail(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role: Role
  ) {
    const hashedPassword = await bcrypt.hash(password, 12);

    return await UserRepository.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      authType: AuthType.EMAIL,
      emailVerified: false,
    });
  }

  static async loginWithEmail(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);

    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  static async findOrCreateUserWithGoogle(profile: any) {
    const { id, emails, name, photos } = profile;

    let user = await UserRepository.findByGoogleId(id);

    if (user) {
      return user;
    }

    user = await UserRepository.findByEmail(emails[0].value);

    if (user) {
      return await UserRepository.updateUser(user.id, {
        googleId: id,
        authType: AuthType.GOOGLE,
        avatar: photos[0].value,
        emailVerified: true,
      });
    }

    return await UserRepository.createUser({
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      googleId: id,
      avatar: photos[0].value,
      authType: AuthType.GOOGLE,
      emailVerified: true,
    });
  }
}
