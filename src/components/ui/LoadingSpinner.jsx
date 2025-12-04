import React from "react";

function LoadingSpinner() {
    return (
        <div className="w-full h-full flex justify-center items-center p-6">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
        </div>
    );
}

export default LoadingSpinner;
