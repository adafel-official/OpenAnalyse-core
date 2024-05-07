import { useState } from "react";
import { useRouter } from "next/navigation";
import { InputBase } from "~~/components/scaffold-eth";

export const SchemaDetails = () => {
  const router = useRouter();
  const [expandCol, setExpandCol] = useState<string>();
  const [toggleCol, setToggleCol] = useState(false);
  const [col, setCol] = useState<Record<string, number>>();

  const schemas = [
    {
      schemaName: "schemaName1",
      columns: ["col1", "col2", "col3", "col4", "col5"],
      category: "gaming",
      createdBy: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      totalRecords: 100,
    },
    {
      schemaName: "schemaName2",
      columns: ["col1", "col2", "col3", "col4", "col5"],
      category: "marketplace",
      createdBy: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      totalRecords: 100,
    },
    {
      schemaName: "schemaName3",
      columns: ["col1", "col2", "col3", "col4", "col5"],
      category: "social",
      createdBy: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      totalRecords: 100,
    },
    {
      schemaName: "schemaName4",
      columns: ["col1", "col2", "col3", "col4", "col5"],
      category: "gaming",
      createdBy: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      totalRecords: 100,
    },
    {
      schemaName: "schemaName5",
      columns: ["col1", "col2", "col3", "col4", "col5"],
      category: "identity",
      createdBy: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
      totalRecords: 100,
    },
  ];

  return (
    <>
      {schemas.map(i => (
        <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1" key={i.schemaName}>
          <p className="font-medium my-0 break-words">{i.schemaName}</p>
          <div className="flex-col gap-y-1">
            <div className="flex">
              <div className="font-small">columns: </div>
              <div className="font-extralight px-2">{i.columns.join(", ")}</div>
            </div>
            <div className="flex">
              <div className="font-small">category: </div>
              <div className="font-extralight px-2">{i.category}</div>
            </div>
            <div className="flex">
              <div className="font-small">created by: </div>
              <div className="font-extralight px-2">
                {i.createdBy.slice(0, 7)}...{i.createdBy.slice(-4, -1)}
              </div>
            </div>
            <div className="flex">
              <div className="font-small">total records: </div>
              <div className="font-extralight px-2">{i.totalRecords}</div>
            </div>
          </div>
          <div className="flex justify-between gap-2 flex-wrap">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setExpandCol(i.schemaName);
                setToggleCol(!toggleCol);
              }}
            >
              Add data
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={async () => {
                router.push("/dataexplorer");
              }}
              // disabled={isFetching}
            >
              Explore data 📡
            </button>
          </div>
          {expandCol == i.schemaName && toggleCol == true
            ? i.columns.map(i => (
                <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1" key={i}>
                  <p className="font-medium my-0 break-words">{i}</p>
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center ml-2">
                      <span className="block text-xs font-extralight leading-none">number</span>
                    </div>
                    <InputBase
                      name="total columns"
                      placeholder="0"
                      value={col?.[i]}
                      onChange={(value: any) => {
                        setCol(cols => ({ ...cols, [i]: value }));
                      }}
                    />
                  </div>
                </div>
              ))
            : null}
          {expandCol == i.schemaName && toggleCol == true ? (
            <button className="btn btn-secondary btn-sm">Save</button>
          ) : null}
        </div>
      ))}
    </>
  );
};
