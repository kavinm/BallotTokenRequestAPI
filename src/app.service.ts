import { Injectable } from '@nestjs/common';
import { Contract, ethers } from 'ethers';
import * as tokenJson from './assets/MyToken.json';
import * as tokenSaleJson from './assets/TokenSale.json';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  contract: Contract;
  tokenSaleContract: Contract;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('ALCHEMY_API_KEY');
    this.provider = new ethers.providers.AlchemyProvider('maticmum', apiKey);
    this.contract = new Contract(
      this.getAddress(),
      tokenJson.abi,
      this.provider,
    );
    this.tokenSaleContract = new Contract(
      this.getTokenSaleAddress(),
      tokenSaleJson.abi,
      this.provider,
    );
  }

  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock() {
    return this.provider.getBlock('latest');
  }

  getAddress() {
    const address = this.configService.get<string>('TOKEN_ADDRESS');
    return address;
  }

  getTokenSaleAddress() {
    const tokenSaleAddress =
      this.configService.get<string>('TOKENSALE_ADDRESS');
    return tokenSaleAddress;
  }

  async getTotalSupply() {
    const totalSupplyBN = await this.contract.totalSupply();
    return ethers.utils.formatEther(totalSupplyBN);
  }

  async getBalanceOf(address: string) {
    const balanceBN = await this.contract.balanceOf(address);
    return ethers.utils.formatEther(balanceBN);
  }

  async getTransactionReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const receipt = await this.getReceipt(tx);
    return receipt;
  }

  async getReceipt(tx: ethers.providers.TransactionResponse) {
    return await tx.wait();
  }

  async requestTokens(address: string, amount: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider);
    return await this.tokenSaleContract
      .connect(signer)
      .buyTokens({ value: ethers.utils.parseEther(amount) });
  }
}

// if (ethers.utils.verifyMessage("my fingerprint", signature) != address) throw error
