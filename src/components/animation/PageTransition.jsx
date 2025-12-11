import React from "react";
import { motion } from "framer-motion";

const pageVariants = {
initial: {
opacity: 0,
y: 16,
},
animate: {
opacity: 1,
y: 0,
},
exit: {
opacity: 0,
y: -8,
},
};

const pageTransition = {
type: "tween",
duration: 0.25,
ease: "easeOut",
};

function PageTransition({ children, className = "" }) {
return (
<motion.div
    className={className}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={pageTransition}
>
    {children}
</motion.div>
);
}

export default PageTransition;
