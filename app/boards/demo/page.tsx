import BoardViewPage from "../[id]/page";

export default function DemoBoardPage() {
  return <BoardViewPage params={Promise.resolve({ id: "demo" })} />;
}