import React from "react";
import { motion } from "framer-motion";

function KpiCardWrapper({ children, className = "", isAlert = false }) {
return (
<motion.div
    className={className}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    animate={
    isAlert
        ? {
            scale: [1, 1.02, 1],
        }
        : {}
    }
    transition={
    isAlert
        ? {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
        }
        : {
            duration: 0.2,
        }
    }
>
    {children}
</motion.div>
);
}

export default KpiCardWrapper;
