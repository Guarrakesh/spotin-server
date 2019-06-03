const { verifyRecaptchaV3 } = require('../api/utils/google');
const { UserSubscription } = require('../api/models/usersubscription.model');

exports.UserSubscription = `
  
  
  input UserSubscribeInput {
    email: String!
    businessType: String
    recaptchaToken: String!
  }
  type UserSubscription {
    email: String!
    businessType: String
    createdAt: String
  }
  type SubscriptionResponse {
    subscription: UserSubscription
    ok: Boolean!
    errorCode: Int
  } 
  extend type Mutation {
    subscribe(input: UserSubscribeInput): SubscriptionResponse
  } 
 
`;

exports.userSubscriptionResolvers = {

  Mutation: {
    async subscribe(obj, args) {
      if (!args.input) {
        return { ok: false };
      }

      const {email, businessType, recaptchaToken} = args.input;
      const response = await verifyRecaptchaV3(recaptchaToken);

      if (response.data.success && response.data.score > 0.2) {
        if ((await UserSubscription.findOne({ email }))) {
          return {
            ok: false,
            errorCode: 10 // email già esistente
          }
        }
        const subscription = new UserSubscription({
          email, businessType
        });
        await subscription.save();
        // send email

        console.log("sending email...");
        return { ok: true, subscription }
      } else {
        return {ok: false, errorCode: 11}
      }

    }
  },




};
