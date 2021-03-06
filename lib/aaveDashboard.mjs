import { ethers } from 'ethers';
import IProtocolDataProvider from '../lib/contracts/IProtocolDataProvider.mjs';

async function aaveDashboard(_address, _provider, _log = false) {
  const tokens = [];
  const { name: network } = await _provider.getNetwork();

  const DP = new ethers.Contract(IProtocolDataProvider['ADDRESS'][network], IProtocolDataProvider['ABI'], _provider);
  const reserveTokens = await DP.getAllReservesTokens();

  for (const reserve of reserveTokens) {

    const { currentATokenBalance: aBal, currentStableDebt: sdBal, currentVariableDebt: vdBal }
      = await DP.getUserReserveData(reserve.tokenAddress, _address);

    if (aBal > 0 || sdBal > 0 || vdBal > 0) {

      const reserveConf = await DP.getReserveConfigurationData(reserve.tokenAddress);
      const decimals = reserveConf.decimals.toString();
      const { aTokenAddress: aToken, stableDebtTokenAddress: sdToken, variableDebtTokenAddress: vdToken }
        = await DP.getReserveTokensAddresses(reserve.tokenAddress);

      if (aBal > 0) {
        const token = { "address": aToken, "amount": aBal.toString(), "symbol": 'a' + reserve.symbol, "type": 0, "decimals": decimals, "asset": reserve.tokenAddress }
        tokens.push(token);
        if (_log) console.log('a' + reserve.symbol, aBal.toString());
      }
      if (sdBal > 0) {
        const token = { "address": sdToken, "amount": sdBal.toString(), "symbol": 'sd' + reserve.symbol, "type": 1, "decimals": decimals, "asset": reserve.tokenAddress }
        tokens.push(token);
        if (_log) console.log('sd' + reserve.symbol, sdBal.toString());
      }
      if (vdBal > 0) {
        const token = { "address": vdToken, "amount": vdBal.toString(), "symbol": 'vd' + reserve.symbol, "type": 2, "decimals": decimals, "asset": reserve.tokenAddress }
        tokens.push(token);
        if (_log) console.log('vd' + reserve.symbol, vdBal.toString());
      }
    }
  };
  if (_log) console.log(tokens);
  return tokens;
}

export default aaveDashboard;
