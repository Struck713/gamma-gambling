import { useRouter } from "next/router";

const Game = () => {

    const router = useRouter();
    const { id } = router.query;

    return (
      <p className="text-light">{id}</p>
    )
  }
  
export default Game;