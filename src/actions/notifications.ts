'use server'

import { createClient } from "@/supabase/server";

type Notification = {
    token: string,
    title: string,
    body: string,
    data: {
        status: string
    }
}

type NotificationParams = {
    userId: string,
    title: string,
    body: string,
    data: {
        status: string
    }
}

const sendPushNotifications = async ({token, title, body,data}: Notification)=>{

    const message = {
        to: token,
        sound: 'default',
        title: title,
        body: body,
        data: data,
      };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

}

const getUserNoticationsToken = async (userId: string)=>{
    const supabase = await createClient();

    const { data, error } = await supabase.from('users')
                                    .select('*')
                                    .eq('id', userId)
                                    .single();
    
    if(error) throw new Error('An error occured while fetching expo notifications token'+error.message);

    return data;
}

export const sendNotification = async(data: NotificationParams)=>{

    const tokenData = await getUserNoticationsToken(data.userId!);
    if(!tokenData.expo_notifications){
        return;
    }

   await sendPushNotifications({...data, token: tokenData.expo_notifications});

}