/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MockERC1155, MockERC1155Interface } from "../MockERC1155";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604080518082019091526008815267746573745f75726960c01b60208201526200003c8162000043565b506200013f565b8051620000589060029060208401906200005c565b5050565b8280546200006a9062000102565b90600052602060002090601f0160209004810192826200008e5760008555620000d9565b82601f10620000a957805160ff1916838001178555620000d9565b82800160010185558215620000d9579182015b82811115620000d9578251825591602001919060010190620000bc565b50620000e7929150620000eb565b5090565b5b80821115620000e75760008155600101620000ec565b600181811c908216806200011757607f821691505b602082108114156200013957634e487b7160e01b600052602260045260246000fd5b50919050565b611546806200014f6000396000f3fe608060405234801561001057600080fd5b50600436106100925760003560e01c80632eb2c2d6116100665780632eb2c2d6146101155780634e1273f414610128578063a22cb46514610148578063e985e9c51461015b578063f242432a1461019757600080fd5b8062fdd58e1461009757806301ffc9a7146100bd5780630e89341c146100e05780631b2ef1ca14610100575b600080fd5b6100aa6100a5366004610f5d565b6101aa565b6040519081526020015b60405180910390f35b6100d06100cb366004611051565b610240565b60405190151581526020016100b4565b6100f36100ee366004611090565b610292565b6040516100b49190611232565b61011361010e3660046110a8565b610326565b005b610113610123366004610e1a565b610345565b61013b610136366004610f86565b610391565b6040516100b491906111f1565b610113610156366004610f23565b6104f3565b6100d0610169366004610de8565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b6101136101a5366004610ec0565b6104fe565b60006001600160a01b03831661021a5760405162461bcd60e51b815260206004820152602a60248201527f455243313135353a2061646472657373207a65726f206973206e6f742061207660448201526930b634b21037bbb732b960b11b60648201526084015b60405180910390fd5b506000908152602081815260408083206001600160a01b03949094168352929052205490565b60006001600160e01b03198216636cdb3d1360e11b148061027157506001600160e01b031982166303a24d0760e21b145b8061028c57506301ffc9a760e01b6001600160e01b03198316145b92915050565b6060600280546102a1906113a6565b80601f01602080910402602001604051908101604052809291908181526020018280546102cd906113a6565b801561031a5780601f106102ef5761010080835404028352916020019161031a565b820191906000526020600020905b8154815290600101906020018083116102fd57829003601f168201915b50505050509050919050565b61034133838360405180602001604052806000815250610543565b5050565b6001600160a01b03851633148061036157506103618533610169565b61037d5760405162461bcd60e51b81526004016102119061128d565b61038a8585858585610657565b5050505050565b606081518351146103f65760405162461bcd60e51b815260206004820152602960248201527f455243313135353a206163636f756e747320616e6420696473206c656e677468604482015268040dad2e6dac2e8c6d60bb1b6064820152608401610211565b6000835167ffffffffffffffff81111561042057634e487b7160e01b600052604160045260246000fd5b604051908082528060200260200182016040528015610449578160200160208202803683370190505b50905060005b84518110156104eb576104b085828151811061047b57634e487b7160e01b600052603260045260246000fd5b60200260200101518583815181106104a357634e487b7160e01b600052603260045260246000fd5b60200260200101516101aa565b8282815181106104d057634e487b7160e01b600052603260045260246000fd5b60209081029190910101526104e48161140e565b905061044f565b509392505050565b610341338383610850565b6001600160a01b03851633148061051a575061051a8533610169565b6105365760405162461bcd60e51b81526004016102119061128d565b61038a8585858585610931565b6001600160a01b0384166105a35760405162461bcd60e51b815260206004820152602160248201527f455243313135353a206d696e7420746f20746865207a65726f206164647265736044820152607360f81b6064820152608401610211565b3360006105af85610a5b565b905060006105bc85610a5b565b90506000868152602081815260408083206001600160a01b038b168452909152812080548792906105ee90849061138e565b909155505060408051878152602081018790526001600160a01b03808a1692600092918716917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a461064e83600089898989610ab4565b50505050505050565b81518351146106b95760405162461bcd60e51b815260206004820152602860248201527f455243313135353a2069647320616e6420616d6f756e7473206c656e677468206044820152670dad2e6dac2e8c6d60c31b6064820152608401610211565b6001600160a01b0384166106df5760405162461bcd60e51b8152600401610211906112db565b3360005b84518110156107e257600085828151811061070e57634e487b7160e01b600052603260045260246000fd5b60200260200101519050600085838151811061073a57634e487b7160e01b600052603260045260246000fd5b602090810291909101810151600084815280835260408082206001600160a01b038e16835290935291909120549091508181101561078a5760405162461bcd60e51b815260040161021190611320565b6000838152602081815260408083206001600160a01b038e8116855292528083208585039055908b168252812080548492906107c790849061138e565b92505081905550505050806107db9061140e565b90506106e3565b50846001600160a01b0316866001600160a01b0316826001600160a01b03167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610832929190611204565b60405180910390a4610848818787878787610c1f565b505050505050565b816001600160a01b0316836001600160a01b031614156108c45760405162461bcd60e51b815260206004820152602960248201527f455243313135353a2073657474696e6720617070726f76616c20737461747573604482015268103337b91039b2b63360b91b6064820152608401610211565b6001600160a01b03838116600081815260016020908152604080832094871680845294825291829020805460ff191686151590811790915591519182527f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a3505050565b6001600160a01b0384166109575760405162461bcd60e51b8152600401610211906112db565b33600061096385610a5b565b9050600061097085610a5b565b90506000868152602081815260408083206001600160a01b038c168452909152902054858110156109b35760405162461bcd60e51b815260040161021190611320565b6000878152602081815260408083206001600160a01b038d8116855292528083208985039055908a168252812080548892906109f090849061138e565b909155505060408051888152602081018890526001600160a01b03808b16928c821692918816917fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62910160405180910390a4610a50848a8a8a8a8a610ab4565b505050505050505050565b60408051600180825281830190925260609160009190602080830190803683370190505090508281600081518110610aa357634e487b7160e01b600052603260045260246000fd5b602090810291909101015292915050565b6001600160a01b0384163b156108485760405163f23a6e6160e01b81526001600160a01b0385169063f23a6e6190610af890899089908890889088906004016111ac565b602060405180830381600087803b158015610b1257600080fd5b505af1925050508015610b42575060408051601f3d908101601f19168201909252610b3f91810190611074565b60015b610bef57610b4e611455565b806308c379a01415610b885750610b6361146d565b80610b6e5750610b8a565b8060405162461bcd60e51b81526004016102119190611232565b505b60405162461bcd60e51b815260206004820152603460248201527f455243313135353a207472616e7366657220746f206e6f6e2d455243313135356044820152732932b1b2b4bb32b91034b6b83632b6b2b73a32b960611b6064820152608401610211565b6001600160e01b0319811663f23a6e6160e01b1461064e5760405162461bcd60e51b815260040161021190611245565b6001600160a01b0384163b156108485760405163bc197c8160e01b81526001600160a01b0385169063bc197c8190610c63908990899088908890889060040161114e565b602060405180830381600087803b158015610c7d57600080fd5b505af1925050508015610cad575060408051601f3d908101601f19168201909252610caa91810190611074565b60015b610cb957610b4e611455565b6001600160e01b0319811663bc197c8160e01b1461064e5760405162461bcd60e51b815260040161021190611245565b80356001600160a01b0381168114610d0057600080fd5b919050565b600082601f830112610d15578081fd5b81356020610d228261136a565b604051610d2f82826113e1565b8381528281019150858301600585901b87018401881015610d4e578586fd5b855b85811015610d6c57813584529284019290840190600101610d50565b5090979650505050505050565b600082601f830112610d89578081fd5b813567ffffffffffffffff811115610da357610da361143f565b604051610dba601f8301601f1916602001826113e1565b818152846020838601011115610dce578283fd5b816020850160208301379081016020019190915292915050565b60008060408385031215610dfa578182fd5b610e0383610ce9565b9150610e1160208401610ce9565b90509250929050565b600080600080600060a08688031215610e31578081fd5b610e3a86610ce9565b9450610e4860208701610ce9565b9350604086013567ffffffffffffffff80821115610e64578283fd5b610e7089838a01610d05565b94506060880135915080821115610e85578283fd5b610e9189838a01610d05565b93506080880135915080821115610ea6578283fd5b50610eb388828901610d79565b9150509295509295909350565b600080600080600060a08688031215610ed7578081fd5b610ee086610ce9565b9450610eee60208701610ce9565b93506040860135925060608601359150608086013567ffffffffffffffff811115610f17578182fd5b610eb388828901610d79565b60008060408385031215610f35578182fd5b610f3e83610ce9565b915060208301358015158114610f52578182fd5b809150509250929050565b60008060408385031215610f6f578182fd5b610f7883610ce9565b946020939093013593505050565b60008060408385031215610f98578182fd5b823567ffffffffffffffff80821115610faf578384fd5b818501915085601f830112610fc2578384fd5b81356020610fcf8261136a565b604051610fdc82826113e1565b8381528281019150858301600585901b870184018b1015610ffb578889fd5b8896505b848710156110245761101081610ce9565b835260019690960195918301918301610fff565b509650508601359250508082111561103a578283fd5b5061104785828601610d05565b9150509250929050565b600060208284031215611062578081fd5b813561106d816114f7565b9392505050565b600060208284031215611085578081fd5b815161106d816114f7565b6000602082840312156110a1578081fd5b5035919050565b600080604083850312156110ba578182fd5b50508035926020909101359150565b6000815180845260208085019450808401835b838110156110f8578151875295820195908201906001016110dc565b509495945050505050565b60008151808452815b818110156111285760208185018101518683018201520161110c565b818111156111395782602083870101525b50601f01601f19169290920160200192915050565b6001600160a01b0386811682528516602082015260a06040820181905260009061117a908301866110c9565b828103606084015261118c81866110c9565b905082810360808401526111a08185611103565b98975050505050505050565b6001600160a01b03868116825285166020820152604081018490526060810183905260a0608082018190526000906111e690830184611103565b979650505050505050565b60208152600061106d60208301846110c9565b60408152600061121760408301856110c9565b828103602084015261122981856110c9565b95945050505050565b60208152600061106d6020830184611103565b60208082526028908201527f455243313135353a204552433131353552656365697665722072656a656374656040820152676420746f6b656e7360c01b606082015260800190565b6020808252602e908201527f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60408201526d195c881bdc88185c1c1c9bdd995960921b606082015260800190565b60208082526025908201527f455243313135353a207472616e7366657220746f20746865207a65726f206164604082015264647265737360d81b606082015260800190565b6020808252602a908201527f455243313135353a20696e73756666696369656e742062616c616e636520666f60408201526939103a3930b739b332b960b11b606082015260800190565b600067ffffffffffffffff8211156113845761138461143f565b5060051b60200190565b600082198211156113a1576113a1611429565b500190565b600181811c908216806113ba57607f821691505b602082108114156113db57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8201601f1916810167ffffffffffffffff811182821017156114075761140761143f565b6040525050565b600060001982141561142257611422611429565b5060010190565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052604160045260246000fd5b600060033d111561146a57600481823e5160e01c5b90565b600060443d101561147b5790565b6040516003193d81016004833e81513d67ffffffffffffffff81602484011181841117156114ab57505050505090565b82850191508151818111156114c35750505050505090565b843d87010160208285010111156114dd5750505050505090565b6114ec602082860101876113e1565b509095945050505050565b6001600160e01b03198116811461150d57600080fd5b5056fea264697066735822122002e94ac6a87bb7eec2e804866998bc29328938ada7e003aa3eff0a9291df435b64736f6c63430008040033";

export class MockERC1155__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockERC1155> {
    return super.deploy(overrides || {}) as Promise<MockERC1155>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): MockERC1155 {
    return super.attach(address) as MockERC1155;
  }
  connect(signer: Signer): MockERC1155__factory {
    return super.connect(signer) as MockERC1155__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockERC1155Interface {
    return new utils.Interface(_abi) as MockERC1155Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockERC1155 {
    return new Contract(address, _abi, signerOrProvider) as MockERC1155;
  }
}
