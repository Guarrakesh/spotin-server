const BaseMongoService = require('../BaseMongoService');
const { Event } = require('../../models/events/event.model');
const PubSub = require('pubsub-js');

class EventService extends BaseMongoService {

  constructor() {
    super(Event);

    this.PubSub = PubSub;
  }

  /**
   * Publish an event.
   * @param eventName
   * @param data
   */
  publishEvent(eventName, data) {
    this.PubSub.publish(eventName, data);
  }

  /**
   * Subscribe to a topic
   * @param topic
   * @param handler
   *
   * @return {string} token The subscription token
   */
  subscribeTo(topic, handler) {
    return this.PubSub.subscribe(topic, handler);

  }

  unsubscribeTo(token) {
    return this.PubSub.unsubscribe(token);
  }

}

exports.EventService = EventService;
