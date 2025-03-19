//TODO: add firebase messaging
import { FC, PropsWithChildren, useEffect } from "react";
// import { isSupported, MessagePayload } from "firebase/messaging";
import toast from "react-hot-toast";
import Toaster from "./toaster";
// import { getPushToken, onMessageListener } from "./utils";
// import useCookies from "../../hooks/cookies";

const NotificationProvider: FC<PropsWithChildren> = ({ children }) => {
  // const [pushToken, setPushToken] = useCookies("push-token");
  // useEffect(() => {
  //   isSupported().then((hasSupport) => {
  //     if (hasSupport) {
  //       getPushToken().then((token: string) => {
  //         // Track the token -> client mapping, by sending to backend server
  //         // show on the UI that permission is secured
  //         console.log(token);
  //         setPushToken(token);
  //       });
  //     }
  //   });
  // }, []);

  // onMessageListener()
  //   .then((payload: MessagePayload) => {
  //     console.log(payload);
  //     toast(
  //       JSON.stringify({
  //         type: "notification",
  //         title: payload.notification?.title,
  //         description: payload.notification?.body,
  //       })
  //     );
  //   })
  //   .catch((err) =>{});

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};

export default NotificationProvider;
