SentNotifications = new Mongo.Collection('oneSignalNotifications');

OneSignal = {
  _base: 'https://onesignal.com/api/v1/',
  send(method, api, data){
    const url = `${this._base}/${api}`;
    const { apiKey } = Meteor.settings.oneSignal;

    return HTTP.call(method, url, {
      data,
      headers: {
        Authorization: `Basic ${apiKey}`,
      },
    });
  },
};

OneSignal.Notifications = {
  _api: 'notifications',
  create(data){
    const url = `${this._api}`;
    const { appId } = Meteor.settings.oneSignal;

    SentNotifications.insert({
      ...data.message,
      createdAt: new Date(),
    });
    var notification = {
      ...data.message,
      app_id: appId
    }
    if (data.include_player_ids) {
      notification.include_player_ids = data.include_player_ids;
    } else {
      var segments = data.segments;
      if (!segments) segments = ['All'];
      notification.included_segments = segments;
    }
    return OneSignal.send('POST', url, notification);
  },
};
