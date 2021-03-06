import {TX_TYPE,decimals} from "../constant";
import { converCoin } from "../helper/IritaHelper"
import Tools from '@/util/Tools'
export async function getAmountByTx (message,events) {
	let amountDecimals = decimals.amount
	if (message ) {
		let msg = message.msg;
		let amount = {
			amount:'',
			denom: ''
		}
		let txType = message.type || '--';
		switch (txType) {
			case TX_TYPE.mint_nft:
			case TX_TYPE.burn_nft:
			case TX_TYPE.create_record:
			case TX_TYPE.define_service:
			case TX_TYPE.bind_service:
			case TX_TYPE.send:
				if (msg.amount && msg.amount.length === 1) {
					const sendAmount = msg && msg.amount.length > 0 ? converCoin(msg.amount[0]) : null
					amount = sendAmount && sendAmount.amount && sendAmount.denom ? `${Tools.formatPriceToFixed(sendAmount.amount,amountDecimals) } ${sendAmount.denom.toLocaleUpperCase()}` : '--';
				}
				break;
			case TX_TYPE.call_service:
			case TX_TYPE.transfer_nft:
			case TX_TYPE.edit_nft:
			case TX_TYPE.issue_denom:
			case TX_TYPE.respond_service:
			case TX_TYPE.pause_request_context:
			case TX_TYPE.start_request_context:
			case TX_TYPE.kill_request_context:
			case TX_TYPE.update_request_context:
			case TX_TYPE.update_service_binding:
			case TX_TYPE.disable_service_binding:
			case TX_TYPE.enable_service_binding:
			case TX_TYPE.refund_service_deposit:
			case TX_TYPE.recv_packet:
			case TX_TYPE.create_identity:
			case TX_TYPE.update_identity:
			case TX_TYPE.create_client:
			case TX_TYPE.update_client:
			case TX_TYPE.begin_redelegate:
				const beginRedelegateAmount = msg && msg.amount ?  await converCoin(msg.amount) :null
				amount = beginRedelegateAmount && beginRedelegateAmount.amount && beginRedelegateAmount.denom ? `${Tools.formatPriceToFixed(beginRedelegateAmount.amount,amountDecimals)} ${beginRedelegateAmount.denom.toLocaleUpperCase()}` : '--';
				break;
			case TX_TYPE.create_validator:
			case TX_TYPE.withdraw_delegator_reward:
				(events || []).forEach((item) => {
					if(item.type === 'withdraw_rewards') {
						(item.attributes || []).forEach((attr) => {
							if (attr.key == 'amount') {
								amount = attr.value || '--';
							}
						});
					}
				});
				if( amount && amount !== '--' && typeof amount !== 'object') {
					amount = await converCoin(amount);
					amount = `${Tools.formatPriceToFixed(amount.amount,amountDecimals)} ${amount.denom.toUpperCase()}`;
				} else {
					amount = '--'
				}
				break;
			case TX_TYPE.withdraw_validator_commission:
			case TX_TYPE.set_withdraw_address:
			case TX_TYPE.begin_unbonding:
				let beginUnbondingAmount = msg &&  msg.amount ? await converCoin(msg.amount) : null
				amount = beginUnbondingAmount && beginUnbondingAmount.amount && beginUnbondingAmount.denom ? `${Tools.formatPriceToFixed(beginUnbondingAmount.amount,amountDecimals)} ${beginUnbondingAmount.denom.toLocaleUpperCase()}` : '--';
				break;
			case TX_TYPE.edit_validator:
			case TX_TYPE.delegate:
				let delegateAmount = msg &&  msg.delegation ? await converCoin(msg.delegation) : null
				amount = delegateAmount && delegateAmount.amount  && delegateAmount.denom ? `${Tools.formatPriceToFixed(delegateAmount.amount,amountDecimals)} ${delegateAmount.denom.toLocaleUpperCase()}` : '--'
				break;
			case TX_TYPE.fund_community_pool:
				let poolAmount = msg && msg.amount && msg.amount.length > 0 ? await converCoin(msg.amount[0]) : null
				amount = poolAmount && poolAmount.amount  && poolAmount.denom? `${Tools.formatPriceToFixed(poolAmount.amount,amountDecimals)} ${poolAmount.denom.toLocaleUpperCase()}` : '--'
			
		}
		return amount
	}
}
