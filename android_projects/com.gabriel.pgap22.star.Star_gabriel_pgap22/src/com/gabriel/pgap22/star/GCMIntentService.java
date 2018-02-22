package com.gabriel.pgap22.star;

import com.google.android.gcm.*;
import org.json.JSONException;
import org.json.JSONObject;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.util.Log;
import com.phonegap.plugins.GCM.GCMPlugin;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.media.*;
import android.app.*;


public class GCMIntentService extends GCMBaseIntentService {

  public static final String ME="GCMReceiver";

  public GCMIntentService() {
    super("GCMIntentService");
  }
  private static final String TAG = "GCMIntentService";

  @Override
  public void onRegistered(Context context, String regId) {

    Log.v(ME + ":onRegistered", "Registration ID arrived!");
    Log.v(ME + ":onRegistered", regId);
    Log.d("regId", regId);
    JSONObject json;

    try
    {
      json = new JSONObject().put("event", "registered");
      json.put("regid", regId);
      

      Log.v(ME + ":onRegisterd", json.toString());

      // Send this JSON data to the JavaScript application above EVENT should be set to the msg type
      // In this case this is the registration ID
      GCMPlugin.sendJavascript( json );

    }
    catch( JSONException e)
    {
      // No message to the user is sent, JSON failed
      Log.e(ME + ":onRegisterd", "JSON exception");
    }
  }

  @Override
  public void onUnregistered(Context context, String regId) {
    Log.d(TAG, "onUnregistered - regId: " + regId);
  }

  @Override
  protected void onMessage(Context context, Intent intent) {
    Log.d(TAG, "onMessage - context: " + context);

    // Extract the payload from the message
    Bundle extras = intent.getExtras();
    if (extras != null) {
      try
      {
        Log.v(ME + ":onMessage extras ", extras.getString("message"));

        JSONObject json;
        json = new JSONObject().put("event", "message");


        // My application on my host server sends back to "EXTRAS" variables message and msgcnt
        // Depending on how you build your server app you can specify what variables you want to send
        //
        String title = extras.getString("title");
        String message = extras.getString("message");
        json.put("title", title);
        json.put("message", message);
        json.put("msgcnt", extras.getString("msgcnt"));

        /* Status Bar Notification */
        /*
        Notification notif = new Notification(android.R.drawable.btn_star_big_on, message, System.currentTimeMillis());
        notif.flags = Notification.FLAG_AUTO_CANCEL;
        notif.defaults |= Notification.DEFAULT_SOUND;
        notif.defaults |= Notification.DEFAULT_VIBRATE;*/
        
        NotificationCompat.Builder notiBuilder = 
        		new NotificationCompat.Builder(this)
        		.setSmallIcon(android.R.drawable.btn_star_big_on)
        		.setContentTitle(title)
        		.setContentText(message)
        		.setAutoCancel(true)
        		.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION))
        		.setTicker("MiixCard Ticker");
        
        
        
        Intent notificationIntent = new Intent(context, Star_gabriel_pgap22.class);
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        //PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, 0);
        
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(this);
        stackBuilder.addParentStack(Star_gabriel_pgap22.class);
        stackBuilder.addNextIntent(notificationIntent);
        
        PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
        notiBuilder.setContentIntent(resultPendingIntent);
        
        Notification notif = notiBuilder.build();
        
        notif.setLatestEventInfo(context, title, message, resultPendingIntent);
        String ns = Context.NOTIFICATION_SERVICE;
        NotificationManager mNotificationManager = (NotificationManager) context.getSystemService(ns);
        mNotificationManager.notify(1, notif);
        /* End of Status Bar Notification*/
          
       
        
        Log.v(ME + ":onMessage ", json.toString());

        GCMPlugin.sendJavascript( json );
        // Send the MESSAGE to the Javascript application
      }
      catch( JSONException e)
      {
        Log.e(ME + ":onMessage", "JSON exception");
      }        	
    }


  }

  @Override
  public void onError(Context context, String errorId) {
    Log.e(TAG, "onError - errorId: " + errorId);
  }




}
