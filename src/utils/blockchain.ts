
import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  type: 'EARN' | 'SPEND' | 'TRANSFER';
  action: string;
  timestamp: number;
  hash: string;
  signature?: string;
  gasPrice?: string;
  gasLimit?: string;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  merkleRoot: string;
  difficulty: number;
  miner: string;
  gasUsed: number;
  gasLimit: number;
}

export class EcoBlockchain {
  private chain: Block[] = [];
  private difficulty: number = 4; // Increased difficulty for more realistic mining
  private pendingTransactions: Transaction[] = [];
  private miningReward: number = 50;
  private provider: ethers.JsonRpcProvider | null = null;
  private signer: ethers.Wallet | null = null;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.initializeEthers();
  }

  private async initializeEthers() {
    try {
      // Initialize with a local provider or test network
      this.provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/demo');
      
      // Create a random wallet for demonstration
      this.signer = ethers.Wallet.createRandom();
      
      console.log('Blockchain initialized with Ethers.js');
      console.log('Wallet address:', this.signer.address);
    } catch (error) {
      console.log('Using local blockchain simulation');
    }
  }

  private createGenesisBlock(): Block {
    const genesisTransactions: Transaction[] = [{
      id: 'genesis-0x' + Date.now().toString(16),
      from: '0x0000000000000000000000000000000000000000',
      to: '0x0000000000000000000000000000000000000000',
      amount: 0,
      type: 'EARN',
      action: 'Genesis Block Creation',
      timestamp: Date.now(),
      hash: this.calculateTransactionHash('genesis', 0, 'EARN', 'Genesis Block Creation'),
      gasPrice: '0',
      gasLimit: '21000'
    }];

    const block: Block = {
      index: 0,
      timestamp: Date.now(),
      transactions: genesisTransactions,
      previousHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
      hash: '',
      nonce: 0,
      merkleRoot: this.calculateMerkleRoot(genesisTransactions),
      difficulty: this.difficulty,
      miner: '0x0000000000000000000000000000000000000000',
      gasUsed: 0,
      gasLimit: 8000000
    };

    block.hash = this.calculateBlockHash(block);
    return block;
  }

  private calculateTransactionHash(id: string, amount: number, type: string, action: string): string {
    const data = `${id}${amount}${type}${action}${Date.now()}`;
    return '0x' + CryptoJS.SHA256(data).toString();
  }

  private calculateBlockHash(block: Block): string {
    const data = `${block.index}${block.timestamp}${JSON.stringify(block.transactions)}${block.previousHash}${block.nonce}${block.merkleRoot}`;
    return '0x' + CryptoJS.SHA256(data).toString();
  }

  private calculateMerkleRoot(transactions: Transaction[]): string {
    if (transactions.length === 0) return '0x0000000000000000000000000000000000000000000000000000000000000000';
    
    let txHashes = transactions.map(tx => tx.hash);
    
    while (txHashes.length > 1) {
      const newLevel = [];
      for (let i = 0; i < txHashes.length; i += 2) {
        const left = txHashes[i];
        const right = txHashes[i + 1] || left;
        newLevel.push('0x' + CryptoJS.SHA256(left + right).toString());
      }
      txHashes = newLevel;
    }
    
    return txHashes[0];
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'hash' | 'signature'>): Promise<Transaction> {
    const transactionId = '0x' + CryptoJS.lib.WordArray.random(32).toString();
    
    const newTransaction: Transaction = {
      ...transaction,
      id: transactionId,
      timestamp: Date.now(),
      hash: this.calculateTransactionHash(transactionId, transaction.amount, transaction.type, transaction.action),
      gasPrice: ethers.parseUnits('20', 'gwei').toString(),
      gasLimit: '21000'
    };

    // Sign transaction if ethers is available
    if (this.signer) {
      try {
        const messageHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(newTransaction)));
        newTransaction.signature = await this.signer.signMessage(ethers.getBytes(messageHash));
      } catch (error) {
        console.log('Transaction signing failed, using local signature');
      }
    }

    this.pendingTransactions.push(newTransaction);
    return newTransaction;
  }

  async minePendingTransactions(miningRewardAddress: string): Promise<Block> {
    console.log('🚀 Starting mining process...');
    
    // Create mining reward transaction
    const rewardTransaction: Transaction = {
      id: '0x' + CryptoJS.lib.WordArray.random(32).toString(),
      from: '0x0000000000000000000000000000000000000000',
      to: miningRewardAddress,
      amount: this.miningReward,
      type: 'EARN',
      action: 'Mining Reward',
      timestamp: Date.now(),
      hash: this.calculateTransactionHash('mining-reward', this.miningReward, 'EARN', 'Mining Reward'),
      gasPrice: '0',
      gasLimit: '21000'
    };

    this.pendingTransactions.push(rewardTransaction);

    const newBlock: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      previousHash: this.getLatestBlock().hash,
      hash: '',
      nonce: 0,
      merkleRoot: this.calculateMerkleRoot(this.pendingTransactions),
      difficulty: this.difficulty,
      miner: miningRewardAddress,
      gasUsed: this.pendingTransactions.length * 21000,
      gasLimit: 8000000
    };

    // Proof of Work mining
    console.log('⛏️  Mining block with difficulty:', this.difficulty);
    const startTime = Date.now();
    
    newBlock.hash = await this.mineBlock(newBlock);
    
    const endTime = Date.now();
    console.log(`✅ Block mined successfully in ${endTime - startTime}ms`);
    console.log('Block hash:', newBlock.hash);
    
    this.chain.push(newBlock);
    this.pendingTransactions = [];
    
    return newBlock;
  }

  private async mineBlock(block: Block): Promise<string> {
    const target = '0x' + Array(this.difficulty + 1).join('0');
    let hash = '';
    
    while (!hash.startsWith(target)) {
      block.nonce++;
      hash = this.calculateBlockHash(block);
      
      // Add a small delay to prevent UI blocking
      if (block.nonce % 1000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }

    return hash;
  }

  getBalance(address: string): number {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.from === address) {
          balance -= transaction.amount;
        }
        if (transaction.to === address) {
          balance += transaction.amount;
        }
      }
    }

    return Math.max(0, balance);
  }

  getAllTransactions(): Transaction[] {
    const allTransactions: Transaction[] = [];
    for (const block of this.chain) {
      allTransactions.push(...block.transactions);
    }
    return allTransactions.filter(tx => 
      tx.from !== '0x0000000000000000000000000000000000000000' || 
      tx.to !== '0x0000000000000000000000000000000000000000'
    );
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateBlockHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }

      // Verify proof of work
      const target = '0x' + Array(currentBlock.difficulty + 1).join('0');
      if (!currentBlock.hash.startsWith(target)) {
        return false;
      }
    }
    return true;
  }

  getBlockchainInfo() {
    const totalSupply = this.chain.reduce((sum, block) => 
      sum + block.transactions.reduce((blockSum, tx) => 
        tx.type === 'EARN' ? blockSum + tx.amount : blockSum, 0
      ), 0
    );

    return {
      totalBlocks: this.chain.length,
      totalTransactions: this.getAllTransactions().length,
      isValid: this.isChainValid(),
      difficulty: this.difficulty,
      latestBlock: this.getLatestBlock(),
      totalSupply,
      networkHashRate: this.calculateNetworkHashRate(),
      averageBlockTime: this.calculateAverageBlockTime()
    };
  }

  private calculateNetworkHashRate(): number {
    // Simplified hash rate calculation
    const recentBlocks = this.chain.slice(-10);
    if (recentBlocks.length < 2) return 0;
    
    const totalNonces = recentBlocks.reduce((sum, block) => sum + block.nonce, 0);
    return totalNonces / recentBlocks.length;
  }

  private calculateAverageBlockTime(): number {
    if (this.chain.length < 2) return 0;
    
    const recentBlocks = this.chain.slice(-10);
    const timeDiffs = [];
    
    for (let i = 1; i < recentBlocks.length; i++) {
      timeDiffs.push(recentBlocks[i].timestamp - recentBlocks[i-1].timestamp);
    }
    
    return timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
  }

  // Get wallet address if ethers is initialized
  getWalletAddress(): string {
    return this.signer?.address || '0x742d35Cc6634C0532925a3b8D6aBC4c2b5C7FDec';
  }

  // Get provider status
  getProviderStatus(): { connected: boolean; network?: string } {
    return {
      connected: this.provider !== null,
      network: this.provider ? 'Sepolia Testnet' : 'Local Simulation'
    };
  }
}

// Create a singleton instance
export const ecoBlockchain = new EcoBlockchain();
