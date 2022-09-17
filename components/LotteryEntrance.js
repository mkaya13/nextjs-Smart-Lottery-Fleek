// We need to have a function to enter the lottery
// To interact with the contract, we are gonna use Morales hooks
// Moralis chainId returns hex version of chainId thus we need to convert it to a real number with *parseInt()* function.

import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants/index.js"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const dispatch = useNotification()

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayer, setNumPlayer] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        contractAddress: raffleAddress,
        abi: abi,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        contractAddress: raffleAddress,
        abi: abi,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        contractAddress: raffleAddress,
        abi: abi,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        contractAddress: raffleAddress,
        abi: abi,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()

        setEntranceFee(entranceFeeFromCall) // parseEther opposite
        setNumPlayer(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    //async function eventListener() {
    //    await new Promise(async (resolve,reject) => {
    //        contract.once("")

    //    })
    //}

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispatch({
            type: "success", // info , warning, error,
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "bottomR", // topL, bottomR, bottomL
            //  icon: "bell",
        })
    }

    if (isWeb3Enabled) {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const raffleContract = new ethers.Contract(contractAddresses, abi, signer)
            console.log(raffleContract.address)
        }
    }

    async function listenForWinnerPicked() {
        await new Promise(async (resolve, reject) => {
            raffleContract.once("WinnerPicked", async () => {
                updateUI()
            })
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <div>
                        <ul class="p-10 rounded leading-6 space-y-10 content-center text-left">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto text-bold"
                                onClick={async function () {
                                    await enterRaffle({
                                        onSuccess: handleSuccess,
                                        onError: (error) => console.log(error),
                                    })
                                }}
                                disable={isLoading || isFetching}
                            >
                                {isLoading || isFetching ? (
                                    <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                ) : (
                                    <div>Enter Raffle</div>
                                )}
                            </button>

                            <li>
                                Entrance fee is:
                                {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                            </li>

                            <li>Number Of Players in Current Raffle: {numPlayer}</li>
                            <li>
                                Recent Winner: {recentWinner.slice(0, 6)}...
                                {recentWinner.slice(recentWinner.length - 4)}
                            </li>
                        </ul>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>No Raffle Address Detected</h1>
                </div>
            )}
        </div>
    )
}
