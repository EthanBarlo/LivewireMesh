import React from "react";
import { useWire } from "./contexts/LivewireContext";

interface IComponent {}
const Component: React.FC<IComponent> = ({}) => {
    const $wire = useWire();

    return (
        <div>
            <h1>LivewireMesh Template</h1>
        </div>
    );
};

export default Component;
