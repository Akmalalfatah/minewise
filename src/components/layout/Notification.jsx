import React from 'react';

function Notification() {
    return (
        <div data-layer="global_notification" className="GlobalNotification size-[77px] p-[18px] bg-white rounded-[50px] inline-flex justify-center items-center gap-2.5">
            <div data-layer="notification_layer" className="NotificationLayer size-[50px] p-2 bg-[#efefef] rounded-[50px] flex justify-center items-center gap-2.5">
                <div data-layer="icon_bell" className="IconBell size-[29px] relative" />
            </div>
        </div>
    );
}

export default Notification;