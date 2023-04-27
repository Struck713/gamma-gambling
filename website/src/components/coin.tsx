import Image from "next/image";
import { Images } from "./images";
import { Utils } from "@/lib/utils";

export const InlineCoin = ({ amount } : { amount: number }) => (
    <span className="d-flex align-items-center">
        <Image style={{ height: "1em", width: "1em", marginRight: ".3em" }} src={Images.GammaCoin} alt="GAMMA COIN" />{Utils.format(amount)}
    </span>
);