import { Injectable } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');

        if (!secret || secret.trim() === '') {
            throw new Error('JWT_SECRET is not defined or empty.');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret
        });
    }

    async validate(payload: { sub: number, username: string }): Promise<any> {
        return { userId: payload.sub, username: payload.username };
    }
}
