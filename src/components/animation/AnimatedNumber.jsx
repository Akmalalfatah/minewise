import React, { useEffect, useState } from "react";
import { animate } from "framer-motion";

function AnimatedNumber({ value = 0, decimals = 0, className = "" }) {
const [display, setDisplay] = useState(0);

useEffect(() => {
let target = 0;

if (typeof value === "number") {
    target = value;
} else if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/,/g, ""));
    target = Number.isNaN(parsed) ? 0 : parsed;
} else {
    target = 0;
}

const controls = animate(display, target, {
    duration: 1.5,
    ease: "easeOut",
    onUpdate: (latest) => {
    setDisplay(latest);
    },
});

return () => {
    controls.stop();
};
}, [value]);

return (
<span className={className}>
    {Number(display).toFixed(decimals)}
</span>
);
}

export default AnimatedNumber;
