"use client";

import { useEffect, useState } from "react";
import { CreateSchema } from "./_components/schema/CreateSchema";
import { SchemaDetails } from "./_components/schema/SchemaDetails";
import { Abi } from "abitype";
import type { NextPage } from "next";
import { WalletClient, createPublicClient, createWalletClient, custom, getContract, http } from "viem";
import { useAccount } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

const Home: NextPage = () => {
  useAccount();

  const [schemas, setSchemas] = useState<any>();
  const [odl, setOdl] = useState<any>();

  useEffect(() => {
    let walletClient: WalletClient;
    if (window.ethereum) {
      walletClient = createWalletClient({
        chain: {
          id: 1849857664505656,
          name: "Adafel Testnet Network",
          nativeCurrency: {
            name: "Adafel Testnet Token",
            symbol: "ADFL",
            decimals: 18,
          },
          rpcUrls: {
            default: {
              http: ["https://testnet-rpc.adafel.com"],
            },
          },
        },
        transport: custom(window.ethereum as any),
      });
    }

    const publicClient = createPublicClient({
      chain: {
        id: 1849857664505656,
        name: "Adafel Testnet Network",
        nativeCurrency: {
          name: "Adafel Token",
          symbol: "ADFL",
          decimals: 18,
        },
        rpcUrls: {
          default: {
            http: ["https://testnet-rpc.adafel.com"],
          },
        },
      },
      transport: http(),
    });

    const getSchemas = async () => {
      try {
        const userAnalyticsContractData = getContract({
          abi: deployedContracts[1849857664505656].DataLayer.abi as Abi,
          address: deployedContracts[1849857664505656].DataLayer.address,
          client: { public: publicClient, wallet: walletClient },
        });
        setOdl(userAnalyticsContractData);

        const schemas_ = await userAnalyticsContractData.read.getAllSchemas();

        console.log(schemas_);
        setSchemas(schemas_);
      } catch (e) {
        console.log(e);
      }
    };

    getSchemas();
  }, []);

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold heading">Adafel Demo</span>
            <span className="block text-2xl mb-2 des">Dashboard</span>
            <div className="padding"></div>
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-10 w-full max-w-7xl">
          <div className="z-10">
            <div className="adafelbg bg-base-100 rounded-3xl  border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Schemas</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-base-300 h-screen overflow-scroll">
                {/* Use only if required overflow-scroll */}
                <SchemaDetails schemaList={schemas} odl={odl} />
              </div>
            </div>
          </div>
          <div className="z-10">
            <div className="adafelbg bg-base-100 rounded-3xl  border-base-300 flex flex-col mt-10 relative">
              <div className="h-[5rem] w-[5.5rem] bg-base-300 absolute self-start rounded-[22px] -top-[38px] -left-[1px] -z-10 py-[0.65rem] shadow-lg">
                <div className="flex items-center justify-center space-x-2">
                  <p className="my-0 text-sm">Create</p>
                </div>
              </div>
              <div className="p-5 divide-y divide-base-300">
                <CreateSchema odl={odl} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
