class PushNotificationError extends Error {
  constructor(requestType, results, successCount, failureCount, tokenCount) {


    super(PushNotificationError.getMessage(results));

    this.requestType = requestType;
    this.results = results;
    this.successCount = successCount;
    this.failureCount = failureCount;
    this.tokenCount = tokenCount;


  }

  static getMessage(results) {
    let message = '';

    for (const result of results) {
      if (result.error) {
        message += `[${result.error.code}-${result.messageId}]: ${result.error.message} - with token ${result.canonicalRegistrationToken} `;
        message += "\n";
      }
    }


  }
}


exports.PushNotificationError = PushNotificationError;
