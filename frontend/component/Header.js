// import { ConnectButton } from "web3uikit"
import { useState } from "react";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import styles from "@/styles/Home.module.css";

const injected = new InjectedConnector();

export default function Header() {
  const { activate, active, library: provider } = useWeb3React();
  const [signer, setSigner] = useState(undefined);

  //   async function registerAnswer() {
  //     if (typeof window.ethereum !== "undefined") {
  //       //const contract = new ethers.Contract(contractAddress, abi, signer);
  //       //console.log(contract);
  //       try {
  //         await contract.registerAnswer("oil change", "youtube");
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     } else {
  //       console.log("Please install MetaMask");
  //     }
  //   }

  //   async function getAnswer() {
  //       if (typeof window.ethereum !== "undefined") {
  //           const contractAddress = "0x7b0e416a1295fA8601e21AC1Fe0aF432f749a4a7"
  //           const contract = new ethers.Contract(contractAddress, abi, signer)
  //           console.log(contract.answerMapping(0))
  //           try {
  //               await contract.answerMapping(0)
  //           } catch (error) {
  //               console.log(error)
  //           }
  //       } else {
  //           console.log("Please install MetaMask")
  //       }
  //   }

  async function connect() {
    try {
      await activate(injected);
    } catch (e) {
      console.log(e);
    }
  }

  async function getAnswer() {
    console.log("test getAnswer");
  }
  async function registerAnswer() {
    console.log("test registerAnswer");
  }

  return (
    <div className="p-7 border-b-2 border-black bg-neutral-700 ">
      <div className={styles.description}>DVT Staking</div>
      <div className="flex justify-end mr-10">
        {active ? (
          "Connected!"
        ) : (
          <button
            className="bg-slate-100 p-1 border-2 hover:bg-neutral-300 "
            onClick={() => connect()}
          >
            Connect
          </button>
        )}
      </div>

      {active ? (
        <div className=" mx-7rem flex justify-center ">
          <div>
            <label className="mx-1.5" for="search">
              Search:
            </label>
            <input type="text" name="search "></input>
          </div>

          <button
            className="bg-slate-100 p-1 mx-7 hover:bg-neutral-300"
            onClick={() => registerAnswer()}
          >
            post answer
          </button>
          <button
            className="bg-slate-100 p-1 hover:bg-neutral-300"
            onClick={() => getAnswer()}
          >
            get Answer
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
