import { useState } from "react";
import { InputBase } from "~~/components/scaffold-eth";

export const CreateSchema = () => {
  const [schemaName, setSchemaName] = useState("My Schema");
  const [totalCol, setTotalCol] = useState("0");
  const [col, setCol] = useState<Record<string, any>>();
  const [selectedCategory, setSelectedCategory] = useState<number>();

  const categories = [...Array(7).keys()];

  const categoryDappMap = {
    0: "Gaming",
    1: "Marketplace",
    2: "Defi",
    3: "Dao",
    4: "Web3Social",
    5: "Identity",
    6: "Certificates",
  };

  return (
    <>
      <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
        <p className="font-medium my-0 break-words">Schema Name</p>
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center ml-2">
            <span className="block text-xs font-extralight leading-none">string</span>
          </div>
          <InputBase name="schema name" placeholder="My Schema" value={schemaName} onChange={setSchemaName} />
        </div>
      </div>
      <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
        <p className="font-medium my-0 break-words">Total Columns</p>
        <div className="flex flex-col gap-1.5 w-full">
          <div className="flex items-center ml-2">
            <span className="block text-xs font-extralight leading-none">number</span>
          </div>
          <InputBase name="total columns" placeholder="0" value={totalCol} onChange={setTotalCol} />
        </div>
      </div>
      {parseInt(totalCol) > 0
        ? [...Array(parseInt(totalCol)).keys()].map(i => (
            <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1" key={i}>
              <p className="font-medium my-0 break-words">Column {i}</p>
              <div className="flex flex-col gap-1.5 w-full">
                <div className="flex items-center ml-2">
                  <span className="block text-xs font-extralight leading-none">string</span>
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
      <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
        <p className="font-medium my-0 break-words">Select Category</p>
        <div className="flex flex-col gap-1.5 w-full">
          {categories.length === 0 ? (
            <p className="text-3xl mt-14">No categories found!</p>
          ) : (
            <>
              {categories.length > 1 && (
                <div className="flex flex-row gap-2 w-full max-w-7xl pb-1 px-6 lg:px-10 flex-wrap">
                  {categories.map(category => (
                    <button
                      className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                        category === selectedCategory
                          ? "bg-base-300 hover:bg-base-300 no-animation"
                          : "bg-base-100 hover:bg-secondary"
                      }`}
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {categoryDappMap[category as keyof typeof categoryDappMap]}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <button className="btn btn-secondary btn-sm">Save</button>
      </div>
    </>
  );
};
