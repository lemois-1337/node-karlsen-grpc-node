import {Client} from 'kaspa-grpc';
import {IRPC, RPC as Rpc} from '../types/custom-types';

export class RPC implements IRPC{
	client:Client;
	constructor(options:any={}){
		if(options.client){
			this.client = options.client;
		}else{
			this.client = new Client(options.clientConfig||{});
			this.client.connect();
		}
	}
	disconnect(){
		this.client?.disconnect();
	}
	unSubscribe(method:string, uid:string=''){
		return this.client.unSubscribe(method, uid);
	}
	subscribe<T, R>(method:string, data:any, callback:Rpc.callback<R>){
		return this.client.subscribe<T>(method, data, callback);
	}
	request<T>(method:string, data:any){
		return this.client.call(method, data) as Promise<T>;
	}

	subscribeChainChanged(callback:Rpc.callback<Rpc.ChainChangedNotification>){
		return this.subscribe<Rpc.NotifyChainChangedResponse, Rpc.ChainChangedNotification>("notifyChainChangedRequest", {}, callback);
	}
	subscribeBlockAdded(callback:Rpc.callback<Rpc.BlockAddedNotification>){
		return this.subscribe<Rpc.NotifyBlockAddedResponse, Rpc.BlockAddedNotification>("notifyBlockAddedRequest", {}, callback);
	}
	subscribeVirtualSelectedParentBlueScoreChanged(callback:Rpc.callback<Rpc.VirtualSelectedParentBlueScoreChangedNotification>){
		return this.subscribe<Rpc.NotifyVirtualSelectedParentBlueScoreChangedResponse, Rpc.VirtualSelectedParentBlueScoreChangedNotification>("notifyVirtualSelectedParentBlueScoreChangedRequest", {}, callback);
	}

	subscribeUtxosChanged(addresses:string[], callback:Rpc.callback<Rpc.UtxosChangedNotification>){
		return this.subscribe<Rpc.NotifyUtxosChangedResponse, Rpc.UtxosChangedNotification>("notifyUtxosChangedRequest", {addresses}, callback);
	}

	unSubscribeUtxosChanged(uid:string=''){
		this.unSubscribe("notifyUtxosChangedRequest", uid);
	}

	getBlock(hash:string){
		return this.request<Rpc.BlockResponse>('getBlockRequest', {hash, includeBlockVerboseData:true});
	}
	getTransactionsByAddresses(startingBlockHash:string, addresses:string[]){
		return this.request<Rpc.TransactionsByAddressesResponse>('getTransactionsByAddressesRequest', {
			startingBlockHash, addresses
		});
	}
	getUtxosByAddresses(addresses:string[]){
		return this.request<Rpc.UTXOsByAddressesResponse>('getUtxosByAddressesRequest', {addresses});
	}
	submitTransaction(tx: Rpc.SubmitTransactionRequest){
		return this.request<Rpc.SubmitTransactionResponse>('submitTransactionRequest', tx);
	}

	getVirtualSelectedParentBlueScore(){
		return this.request<Rpc.VirtualSelectedParentBlueScoreResponse>('getVirtualSelectedParentBlueScoreRequest', {});
	}
}