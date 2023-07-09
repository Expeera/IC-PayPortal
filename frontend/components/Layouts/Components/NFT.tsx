import React, { useEffect, useState, useCallback, useContext } from "react"
import { AppContext } from "../../../App"
import { toast } from "react-toastify"
import { Principal } from "@dfinity/principal";
import Modal from 'react-modal';



export type SubAccount = Uint8Array;
export interface TimeStamp { 'timestamp_nanos': bigint }
export type Memo = bigint;
export interface Tokens { 'e8s': bigint }
export type AccountIdentifier = Uint8Array;


export interface TransferArgs {
  'to': AccountIdentifier,
  'fee': Tokens,
  'memo': Memo,
  'from_subaccount': [] | [SubAccount],
  'created_at_time': [] | [TimeStamp],
  'amount': Tokens,
}

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#18191D',
    minWidth: '400px',
    borderRadius : '16px',
  },
  overlay : {
    backgroundColor: 'rgba(24, 25, 29, 0.5)',
    backdropFilter: 'blur(13px)'
  }
};

Modal.setAppElement('#root')

export const NFT = ({ tokenId, name, image, description, price, leasePricePerDay, category, seller, sellerAccountId, isCreator, expires, renter, isMarket, refresh, isUserMarketplace }) => {

  const { user, isAuthenticated, nftActor, ledgerActor } = useContext(AppContext)

  const [loading, setLoading] = useState(false)

  const buy = async () => {

    setLoading(true);
    var transferData: TransferArgs = {
      'to': Principal.fromHex(sellerAccountId).toUint8Array(),
      'fee': {
        'e8s': BigInt(10000)
      },
      'memo': BigInt(1234),
      'from_subaccount': [],
      'created_at_time': [],
      'amount': {
        'e8s': BigInt(price)
      },
    };

    const transferResponse: any = await ledgerActor.transfer(transferData);
    console.log('transferResponse', transferResponse);
    if (transferResponse?.Err !== undefined) {
      if (transferResponse?.Err?.InsufficientFunds !== undefined) {
        toast.error("Insufficient funds")
      } else if (transferResponse?.Err?.BadFee !== undefined) {
        toast.error("Bad Fee")
      } else if (transferResponse?.Err?.TxTooOld !== undefined) {
        toast.error("Tx Too Old")
      } else if (transferResponse?.Err?.TxCreatedInFuture !== undefined) {
        toast.error("Tx Created In Future")
      } else if (transferResponse?.Err?.TxDuplicate !== undefined) {
        toast.error("Tx Duplicate")
      }

      setLoading(false);
    } else if (transferResponse?.Ok !== undefined) {
      await nftActor.buy(tokenId).then(data => {
        console.log('buy',{ data })

        if ("err" in data) {
          if ("NotAuthorized" in data.err) {
            toast.error(data.err.NotAuthorized + "")
          } else if ("General" in data.err) {
            toast.error(data.err.General + "")
          }
        } else {
          toast.success("Purchased Successfully ")
          refresh()
        }
      }).catch(err => {
        toast.error(err.message)
      }).finally(() => {
        setLoading(false);
      });
    }

  }
  const [endLeaseDate, setEndLeaseDate] = useState(null)

  const lease = async () => {
    setLoading(true);
    if (endLeaseDate === null) {
      toast.error("Please Select Valid Date")
      setLoading(false);
      return
    }

    var numberOfDay = Math.ceil((new Date(endLeaseDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (numberOfDay < 1) {
      toast.error("Please Select Valid Date")
      setLoading(false);
      return
    }
    toast.info("Please Wait...")

    var transferData: TransferArgs = {
      'to': Principal.fromHex(sellerAccountId).toUint8Array(),
      'fee': {
        'e8s': BigInt(10000)
      },
      'memo': BigInt(1234),
      'from_subaccount': [],
      'created_at_time': [],
      'amount': {
        'e8s': BigInt(numberOfDay * parseFloat(leasePricePerDay.toString()))
      },
    };

    const transferResponse: any = await ledgerActor.transfer(transferData);

    if (transferResponse?.Err !== undefined) {
      if (transferResponse?.Err?.InsufficientFunds !== undefined) {
        toast.error("Insufficient funds")
      } else if (transferResponse?.Err?.BadFee !== undefined) {
        toast.error("Bad Fee")
      } else if (transferResponse?.Err?.TxTooOld !== undefined) {
        toast.error("Tx Too Old")
      } else if (transferResponse?.Err?.TxCreatedInFuture !== undefined) {
        toast.error("Tx Created In Future")
      } else if (transferResponse?.Err?.TxDuplicate !== undefined) {
        toast.error("Tx Duplicate")
      }

      setLoading(false);

    } else if (transferResponse?.Ok !== undefined) {
      await nftActor.lease(tokenId, BigInt(numberOfDay)).then(data => {
        console.log({ data })

        if ("err" in data) {
          if ("NotAuthorized" in data.err) {
            toast.error(data.err.NotAuthorized + "")
          } else if ("General" in data.err) {
            toast.error(data.err.General + "")
          }
        } else {
          toast.success("Leased Successfully ")
          setIsOpen(false)
          refresh()
        }
      }).catch(err => {
        toast.error(err.message)
      }).finally(() => {
        setLoading(false);
      });
    }


  }

  useEffect(() => {
    console.log("Start", tokenId);
  }, [])


  const timeDiffirence = (date1: Date, date2: Date) => {
    var Difference_In_Time = date2?.getTime() - date1?.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return  ` ${Math.ceil(Difference_In_Days)} Days`;
  }

  const timeDiffirenceNumber = (date1: Date, date2: Date) => {
    var Difference_In_Time = date2?.getTime() - date1?.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return Math.ceil(Difference_In_Days) ;
  }

  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }


  return (
    <>
          <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="flex flex-col items-center gap-5">
        <p className="text-secondary font-semibold text-2xl mb-2">{(Number(leasePricePerDay) / 10 ** 8)} EXP per day</p>
        <div className="flex flex-col gap-1 w-64">
          <p className="text-accent text-sm">start date</p>
          <input type="date" value={new Date().toISOString().slice(0, 10)} disabled />
        </div>
        <div className="flex flex-col gap-1 w-64">
          <p className="text-accent text-sm">end date</p>
          <input type="date" value={endLeaseDate} onChange={(e) => setEndLeaseDate(e.target.value)} />
        </div>
        <div className="flex  items-center justify-between gap-4 mt-2">
        <div className="flex gap-2 items-center">
          <p className="text-accent ">Total EXP</p>
          <div className="w-20 h-10 border border-theme rounded-xl flex items-center justify-center">
          <p className="text-accent text-lg">{((Number(leasePricePerDay) / 10 ** 8) * timeDiffirenceNumber(new Date(), new Date(endLeaseDate))) > 0 ? ((Number(leasePricePerDay) / 10 ** 8) * timeDiffirenceNumber(new Date(), new Date(endLeaseDate))) : 0}</p>
          </div>
        </div>
        <div>
            <button disabled={loading} className="bg-secondary hover:bg-secondary/70 text-black text-sm font-semibold py-2 px-6 rounded-xl text-center w-full" onClick={lease}>Lease</button>
        </div>
        </div>
        </div>
      </Modal>
    <div className={`p-4 flex flex-col gap-3 rounded-2xl w-[256px] bg-custom-card`}>
      <img
        alt={`${name} NFT`}
        src={image}
        className="aspect-square w-full object-cover rounded-2xl	"
      />
      <h5 className="text-[#F6F6F6] font-semibold">{name}</h5>

      {seller.length > 0 && <div className="flex flex-col gap-1">
        <p className="text-[#606166] text-xs ">Creator</p>
        <p className="text-[#F6F6F6] font-semibold">{seller.slice(0, 5) + '...' + seller.slice(-5)}</p>
      </div>}

    

      {/* <div className="flex justify-between p-1 text-accent">
        <p>Category:</p>
        <p>{category}</p>
      </div>
      {
        price > 0 ?
          <div className="flex flex-col justify-end p-1 text-accent">
            <p>Price:</p>
            <p>{price / 10 ** 8} ICP</p>
          </div>
          : ""
      } */}

  
      {/* {
        seller.length > 0 ? <div className="flex justify-between p-1 text-accent">
          <p>Seller:</p>
          <p>{seller.slice(0, 5) + '...' + seller.slice(-5)}</p>
        </div> : ''
      } */}
      {
        !isMarket && <div className="flex justify-between p-1 text-accent">
          <p>Lessee:</p>
          <p>{renter == '2vxsx-fae' ? 'No One' : renter.slice(0, 5) + '...' + renter.slice(-5)}</p>
        </div>
      }
      {
      !isMarket && <div className="flex justify-between p-1 text-accent items-center">        
          <p>Lease Period:</p>
          <p style={{
            textAlign: 'right',
            width: '100%'
          }}>{renter == '2vxsx-fae' ? '---' : timeDiffirence(new Date(), new Date(parseInt(expires) / (1000 * 1000)))}</p>
        </div>
      }
      {
        isUserMarketplace &&  expires != 0 && <div className=" ">
          <p className="text-[#606166] text-xs">Leased For:{'\u00A0'}<span className="text-white text-sm font-semibold">{timeDiffirence(new Date(), new Date(parseInt(expires) / (1000 * 1000)))}</span></p>
    </div>
          }
            <div className="w-full bg-[#2A2B31] rounded-xl p-1">
        <div className="flex justify-between text-[#606166] text-sm">
          <p className="p-1 pl-2">Price</p>
          <p className="p-1 pr-2">Category</p>
        </div>
        <div className="flex justify-between  font-semibold">
          <p className="p-1 pl-2 text-secondary">{price === 0 ? 'bought' : `${price / 10 ** 8} EXP`}</p>
          <p className="p-1 pr-2 text-[#F6F6F6]">{category}</p>
        </div>
        </div>
     {seller.length > 0 && expires == 0 && <div className="flex items-center gap-2 mt-2">
      {
            <button onClick={e => buy()} disabled={loading} className="w-full bg-secondary hover:bg-secondary/70 text-black text-sm font-semibold py-2 px-4 rounded-xl text-center">
            Buy
          </button> 
      }
      {
        
    
              <button onClick={e => openModal()} disabled={loading}  className="w-full bg-secondary hover:bg-secondary/70 text-black text-sm font-semibold py-2 px-4 rounded-xl text-center">
              Lease
            </button>
           
          
      }
      </div>}



    </div>
    </>
  )
}
