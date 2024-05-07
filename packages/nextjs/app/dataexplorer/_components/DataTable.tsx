import { Address } from "~~/components/scaffold-eth";

export const DataTable = () => {
  const schema = {
    schemaName: "schemaName1",
    columns: ["col1", "col2", "col3", "col4", "col5"],
    category: "gaming",
    createdBy: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
    totalRecords: 100,
  };

  const data = [
    ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 3, 6, 5, 8, 3],
    ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 3, 6, 5, 8, 3],
    ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 3, 6, 5, 8, 3],
    ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 3, 6, 5, 8, 3],
    ["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", 3, 6, 5, 8, 3],
  ];

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">Address</th>
              {schema.columns.map(i => (
                <>
                  <th className="bg-primary" key={i}>
                    {i}
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* {blocks.map(block =>
              (block.transactions as TransactionWithFunction[]).map(tx => {
                const receipt = transactionReceipts[tx.hash];
                const timeMined = new Date(Number(block.timestamp) * 1000).toLocaleString();
                const functionCalled = tx.input.substring(0, 10);

                return (
                  <tr key={tx.hash} className="hover text-sm">
                    <td className="w-1/12 md:py-4">
                      <TransactionHash hash={tx.hash} />
                    </td>
                    <td className="w-2/12 md:py-4">
                      {tx.functionName === "0x" ? "" : <span className="mr-1">{tx.functionName}</span>}
                      {functionCalled !== "0x" && (
                        <span className="badge badge-primary font-bold text-xs">{functionCalled}</span>
                      )}
                    </td>
                    <td className="w-1/12 md:py-4">{block.number?.toString()}</td>
                    <td className="w-2/1 md:py-4">{timeMined}</td>
                    <td className="w-2/12 md:py-4">
                      <Address address={tx.from} size="sm" />
                    </td>
                    <td className="w-2/12 md:py-4">
                      {!receipt?.contractAddress ? (
                        tx.to && <Address address={tx.to} size="sm" />
                      ) : (
                        <div className="relative">
                          <Address address={receipt.contractAddress} size="sm" />
                          <small className="absolute top-4 left-4">(Contract Creation)</small>
                        </div>
                      )}
                    </td>
                    <td className="text-right md:py-4">
                      {formatEther(tx.value)} {targetNetwork.nativeCurrency.symbol}
                    </td>
                  </tr>
                );
              }),
            )} */}
            {data.map(dpoint => (
              <>
                <tr>
                  {dpoint.map((i, index) => (
                    <>
                      {index == 0 ? (
                        <td className="md:py-4">
                          <Address address={String(i)} size="sm" />
                        </td>
                      ) : (
                        <td>{i}</td>
                      )}
                    </>
                  ))}
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
