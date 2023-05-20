import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as tokenJson from './assets/tokenJson.json';
import { Contract, ethers } from 'ethers';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  apiKey = this.configService.get<string>('ALCHEMY_API_KEY');
  provider = new ethers.providers.AlchemyProvider(
    'maticmum',
    '6gU6Ca6fUzx_4kzLzSWjqOsfZEuOx598',
  );

  async requestTokens(address: string, signature: string) {
    const pk = this.configService.get<string>('PRIVATE_KEY');
    const tokenAddress = this.configService.get<string>('TOKEN_ADDRESS');
    const contract = new Contract(tokenAddress, tokenJson.abi, this.provider);
    const wallet = new ethers.Wallet(pk);
    const signer = wallet.connect(this.provider);
    return contract.connect(signer).mint(address, ethers.utils.parseUnits('1'));
  }
}
