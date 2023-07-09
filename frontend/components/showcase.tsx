// component where i showcase the ui components
import React from "react"
import { BigCircleLink } from "./Buttons/FlexButton"
import TextInput from "./Inputs/Text"
import { Toggle } from "./Inputs/Toggle"
import { HiBuildingStorefront } from "react-icons/hi2"
export const Showcase = () => {
    return <div className="w-full place-items-center grid  h-full">
        <div className="w-10">
            <Toggle />
        </div>
        <TextInput label="exampletext" />
        <BigCircleLink
            title="Creator Sign Up"
            href="/showcase"
            description="as an approved creator you can sell or lease execlusive access to any of your copyrighted media via NFTs"
            Icon={HiBuildingStorefront}
        />
    </div>
}