
import CryptoJS from 'crypto-js';

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
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  merkleRoot: string;
}

export class EcoBlockchain {
  private chain: Block[] = [];
  private difficulty: number = 2;
  private pendingTransactions: Transaction[] = [];
  private miningReward: number = 10;

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock(): Block {
    const genesisTransactions: Transaction[] = [{
      id: 'genesis',
      from: 'system',
      to: 'genesis',
      amount: 0,
      type: 'EARN',
      action: 'Genesis Block',
      timestamp: Date.now(),
      hash: 'genesis-hash'
    }];

    return {
      index: 0,
      timestamp: Date.now(),
      transactions: genesisTransactions,
      previousHash: '0',
      hash: this.calculateHash(0, Date.now(), genesisTransactions, '0', 0),
      nonce: 0,
      merkleRoot: this.calculateMerkleRoot(genesisTransactions)
    };
  }

  private calculateHash(index: number, timestamp: number, transactions: Transaction[], previousHash: string, nonce: number): string {
    const data = index + timestamp + JSON.stringify(transactions) + previousHash + nonce;
    return CryptoJS.SHA256(data).toString();
  }

  private calculateMerkleRoot(transactions: Transaction[]): string {
    if (transactions.length === 0) return '';
    
    const txHashes = transactions.map(tx => tx.hash);
    
    while (txHashes.length > 1) {
      const newLevel = [];
      for (let i = 0; i < txHashes.length; i += 2) {
        const left = txHashes[i];
        const right = txHashes[i + 1] || left;
        newLevel.push(CryptoJS.SHA256(left + right).toString());
      }
      txHashes.splice(0, txHashes.length, ...newLevel);
    }
    
    return txHashes[0];
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp' | 'hash'>): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      id: CryptoJS.lib.WordArray.random(16).toString(),
      timestamp: Date.now(),
      hash: CryptoJS.SHA256(JSON.stringify(transaction) + Date.now()).toString()
    };

    this.pendingTransactions.push(newTransaction);
    return newTransaction;
  }

  minePendingTransactions(miningRewardAddress: string): Block {
    const rewardTransaction: Transaction = {
      id: 'reward-' + Date.now(),
      from: 'system',
      to: miningRewardAddress,
      amount: this.miningReward,
      type: 'EARN',
      action: 'Mining Reward',
      timestamp: Date.now(),
      hash: CryptoJS.SHA256('mining-reward-' + Date.now()).toString()
    };

    this.pendingTransactions.push(rewardTransaction);

    const block: Block = {
      index: this.chain.length,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      previousHash: this.getLatestBlock().hash,
      hash: '',
      nonce: 0,
      merkleRoot: this.calculateMerkleRoot(this.pendingTransactions)
    };

    block.hash = this.mineBlock(block);
    
    console.log('Block successfully mined:', block);
    this.chain.push(block);
    this.pendingTransactions = [];
    
    return block;
  }

  private mineBlock(block: Block): string {
    const target = Array(this.difficulty + 1).join('0');
    
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++;
      block.hash = this.calculateHash(
        block.index,
        block.timestamp,
        block.transactions,
        block.previousHash,
        block.nonce
      );
    }

    return block.hash;
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

    return balance;
  }

  getAllTransactions(): Transaction[] {
    const allTransactions: Transaction[] = [];
    for (const block of this.chain) {
      allTransactions.push(...block.transactions);
    }
    return allTransactions.filter(tx => tx.from !== 'system' || tx.to !== 'genesis');
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(
        currentBlock.index,
        currentBlock.timestamp,
        currentBlock.transactions,
        currentBlock.previousHash,
        currentBlock.nonce
      )) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getBlockchainInfo() {
    return {
      totalBlocks: this.chain.length,
      totalTransactions: this.getAllTransactions().length,
      isValid: this.isChainValid(),
      difficulty: this.difficulty,
      latestBlock: this.getLatestBlock()
    };
  }
}

// Create a singleton instance
export const ecoBlockchain = new EcoBlockchain();
