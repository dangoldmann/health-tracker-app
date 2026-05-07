import { Module } from '@nestjs/common';
import { TokenExtractorService } from './token-extractor.service';
import { SupabaseTokenVerifierService } from './supabase-token-verifier.service';
import { IdentityService } from './identity.service';
import { PrismaIdentityService } from './prisma-identity.service';

@Module({
  providers: [
    TokenExtractorService,
    SupabaseTokenVerifierService,
    PrismaIdentityService,
    {
      provide: IdentityService,
      useExisting: PrismaIdentityService,
    },
  ],
  exports: [TokenExtractorService, SupabaseTokenVerifierService, IdentityService],
})
export class AuthModule {}
