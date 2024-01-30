'use client'
import Trade from "@/models/trade";
import { useState } from "react";


function init() : Trade {
    const trade: Trade = {
        accountValue:0,
        risk: 0.5,
        price: 0,
        stop: 0,
        shares: 0,
        percentageOfAccount: 0        
    }
    return trade;
}

// function calculateStop(trade: Trade) : Trade {
//     const result = {...trade, stop: trade.price * 0.95};
//     return result;
// }

function caculateTrade(trade:Trade) : Trade {
    const newShares = trade.accountValue*(trade.risk/100)/(trade.price-trade.stop);
    const newPercentageOfAccount = (newShares * trade.price) /trade.accountValue  ;
    return {...trade, shares : newShares, percentageOfAccount: newPercentageOfAccount};
}

function formatCurrency(f: number): string {
    if (isNaN(f)) {
        return '-';
    }    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  }).format(f);
}

function formatNumber(f: number): string {
    if (isNaN(f)) {
        return '-';
    }
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  }).format(f);
}

function formatPercentage(f: number): string {
    if (isNaN(f)) {
        return '-';
    }
    return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        maximumFractionDigits: 2, // (causes 2500.99 to be printed as $2,501)
  }).format(f);
}


export function SizeCalculator() {
    const [trade, setTrade]= useState<Trade>(init);
    const [isEditingRisk, setIsEditingRisk] = useState(false);

    function onPriceChangeHandler (e: React.FormEvent<HTMLInputElement>) {
        const newValue = parseFloat(e.currentTarget.value);
        const newTrade = {...trade, price:newValue};

        setTrade(caculateTrade(newTrade));
      }  

      function onStopChangeHandler (e: React.FormEvent<HTMLInputElement>) {
        const newValue = parseFloat(e.currentTarget.value);
        const newTrade = {...trade, stop:newValue};
        setTrade(caculateTrade(newTrade));
      }        

     function onAccountValueChangeHandler (e: React.FormEvent<HTMLInputElement>) {
        const newAccountValue = parseFloat(e.currentTarget.value);
        const newTrade = {...trade, accountValue:newAccountValue};
        setTrade(newTrade);
      }   
      
      function onRiskChangeHandler (e: React.FormEvent<HTMLInputElement>) {
        setIsEditingRisk(false);
        const newValue = parseFloat(e.currentTarget.value);
        if (isNaN(newValue)) {
            return;
        }
        const newTrade = {...trade, risk:newValue};
        setTrade(caculateTrade(newTrade));
      } 
      
      function editRisk() {
        setIsEditingRisk(true);
      }

    return <div className="main">
        <div className="content">
            <h1 className="title">Size calculator</h1>
            <label>Account total</label><input type='text'  onBlur={onAccountValueChangeHandler} /><label className='labelRight'>{formatCurrency(trade.accountValue)}</label>
            <label>Risk</label>
            { isEditingRisk ? 
                <input type='text' onBlur={onRiskChangeHandler} /> :  <label className='labelCenter' onClick={editRisk}>{formatPercentage(trade.risk/100)}</label> }    
            <hr />
            <label>Price</label><input type='text'  onBlur={onPriceChangeHandler} /><label className='labelRight'>{formatCurrency(trade.price)}</label>
            <label>Stop</label><input type='text' onBlur={onStopChangeHandler}/><label className='labelRight'>{formatCurrency(trade.stop)}&nbsp;|&nbsp;{formatPercentage((trade.price-trade.stop)/trade.price)}</label>
            <label>Shares</label><label className='labelCenter'>{formatNumber(trade.shares)}</label>
            <label>% of account</label><label className='labelCenter'>{formatPercentage(trade.percentageOfAccount)}</label>
            <hr />
            <label>33% of Shares</label><label className='labelCenter'>{formatNumber(trade.shares*0.33)}</label>
            <label>50% of Shares</label><label className='labelCenter'>{formatNumber(trade.shares*0.50)}</label>
            <label>67% of Shares</label><label className='labelCenter'>{formatNumber(trade.shares*0.67)}</label>
            <hr />
            <label>5% gain</label><label className='labelCenter'>{formatCurrency(trade.price*1.05)}</label>
        </div>        
    </div>
}