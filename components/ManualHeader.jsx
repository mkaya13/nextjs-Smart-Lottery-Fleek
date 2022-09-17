import { useMoralis} from "react-moralis"  // useMoralis is a hook
import { useEffect } from "react"   // Core react hook


export default function ManualHeader() {

    const {enableWeb3, account, isWeb3Enabled, chainId, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()

// *useEffect* is used to adjust the state of the website. For example when you are not connected, you are shown smg, when you are not connected you are shown another thing
// *isWeb3Enabled* is an object that tells us whether we are connected or not
// *enableWeb3()* once called, it makes us to connect
// *In the local Storage of web application storage, we are able to store some data so that we can use it!
/* For example, when we refresh the page, we want our account credentials to be remembered, thus when we click to connect,
   we do window.localStorage.setItem("connected", "injected") inside onClick so that when we connect, that data is added.
*/ 
// Then in the useEffect, if we grab that item, we run the enableWeb3() again to get the data! But if still have isWeb3Enabled true, then it does noting!!!
/* In the Connect button section, if we are not connected, there is a button named Connect, when you click the button, you will be pumped to metamask with enableWeb3() func
   OTW, if you are connected, you will be shown bunch of account credentials!
*/
// However when we disconnect from the account, the metamask will pop up! We need to fix it
// So we are gonna add another useEffect to check the see if we've disconnected!
/* So we want to say whenever smg changes, run functions inside it. Morales have some functionality for us to do this as well! add *Moralis* and *deactivateWeb3* 
   inside useMoralis() hook. Whenever an account is changed, Moralis.onAccountChanged runs and grabs that account. Then if our account is null which means we are not
   connected to any account, we remove the item in localstorage with window.localStorage.removeItem("connected") then we *deactiveWeb3* which converts
   isWeb3Enabled to False.
*/
// *isWeb3EnableLoading*, disabled = {isWeb3EnableLoading}, While you are entering your password, you will be unable to click the connect button!

//     const [balance, setBalance] = useState(-1); 

    // To handle refresh problem. Without this, if you refresh the page, U will be unable to see your account credentials.

    useEffect(() => {
        if(isWeb3Enabled) return                       // if isWeb3Enabled return noting since we already have it, else run enableWeb3() function

        if(typeof window !== "undefined")
            if(window.localStorage.getItem("connected")){
                enableWeb3() 
            }
    }, [isWeb3Enabled])

    // Automatically run on load
    // Then, it will run checking the value

    // It provides account change + prevents automatical wallet pop up after log out from the account


    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null){
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, [])




    return (
    <div>
        {account ? 
        <div>
            <h1>Connected to {account.slice(0,6)}...{account.slice(account.length - 4)}</h1>
            <h1>Account Balance: {account.balance}</h1>
            <h1>Blockchain ChainId: {chainId.slice(2)}</h1>
        </div>
        : 
        <button onClick={async() => { 
            await enableWeb3()

            window.localStorage.setItem("connected", "injected")

        }}
        disabled = {isWeb3EnableLoading}
        >Connect</button>    
        }
    </div>)
}




// We will see the hardway first
// Then the easy way 

// let connected = false
// some button that connects us and changes connected to be true
// Changing connected to be true wont reRender our application !!!


