"use client";

const Page = ({ error }: { error: Error }) => (
  <div>
    <h1>Error</h1>
    <p>{error.message}</p>
  </div>
);

export default Page;
