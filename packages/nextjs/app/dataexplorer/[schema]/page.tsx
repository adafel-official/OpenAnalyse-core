"use client";

import { DataTable, SearchBar } from "./_components";
import type { NextPage } from "next";

type PageProps = {
  params: { schema: string };
};

const BlockExplorer: NextPage<PageProps> = ({ params }: PageProps) => {
  const schemaName = params.schema;

  return (
    <div className="container mx-auto my-10">
      <SearchBar schema={schemaName} />
      <DataTable schema={schemaName} />
      {/* <PaginationButton currentPage={currentPage} totalItems={totalItems} setCurrentPage={setCurrentPage} /> */}
    </div>
  );
};

export default BlockExplorer;
